import {
  DEFAULT_MOTION_PERSONALITY,
  type MotionPersonalityId,
} from '../config/motionPersonalityTokens.js';
import {VIDEO_LIMITS} from '../config/constants.js';
import {
  buildCameraPlan,
  detectCameraChange,
  type PlannedCamera,
} from '../design/cameraPlanner.js';
import type {MomentDiff} from '../design/diffTypes.js';
import {
  buildHierarchyPlan,
  detectHierarchyTransition,
  type HierarchyPlan,
} from '../design/hierarchyPlanner.js';
import {
  diffScenes,
  toMomentDiff,
  type SceneSnapshot,
} from '../pipeline/sceneDiff.js';
import {resolveEntityStyle, type EntityVisualStyle} from '../design/styleResolver.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';
import type {
  Connection,
  DesignedEntity,
  DesignedMoment,
  DesignedMomentsVideo,
  Interaction,
} from '../schema/moment.schema.js';
import {AnimationType, CameraActionType, ComponentType} from '../schema/visualGrammar.js';
import {buildSceneAnimationPlan} from '../motion/animationPlanner.js';
import {planSceneAnimationTimings} from '../motion/timingPlanner.js';
import type {
  MotionElementSpec,
  MotionRenderSpec,
  MotionSceneSpec,
  SceneCameraPlan,
} from '../motion/types.js';

interface BuildState {
  seenElementIds: Set<string>;
  previousMoment?: DesignedMoment;
  previousSceneSnapshot?: SceneSnapshot;
  previousEntityInstances: Map<string, string[]>;
  previousHierarchy?: HierarchyPlan;
  previousCameraPlan?: PlannedCamera;
}

interface EntityInstance {
  sourceEntityId: string;
  id: string;
  position: {x: number; y: number};
  isHero: boolean;
  isLead: boolean;
}

interface SceneBuildResult {
  scene: MotionSceneSpec;
  entityInstances: Map<string, string[]>;
  resolvedCameraPlan?: PlannedCamera;
}

interface AttachDiffAndPlanResult {
  scene: MotionSceneSpec;
  resolvedCameraPlan?: PlannedCamera;
}

interface BuildRenderSpecOptions {
  personality?: MotionPersonalityId;
  staticMode?: boolean;
  stableLayout?: boolean;
}

const MAX_CLUSTER_SIZE = 4;
const CLUSTER_VERTICAL_SPACING = 6;
const CLUSTER_HORIZONTAL_SPACING = 12;

const DEFAULT_PRIMARY_POSITION = {x: 50, y: 55};
const DEFAULT_SECONDARY_POSITION = {x: 50, y: 70};

const clampPercent = (value: number): number => Math.min(100, Math.max(0, value));

const scaledVisualStyle = (
  style: EntityVisualStyle | undefined,
  factor: number,
): EntityVisualStyle | undefined => {
  if (!style) {
    return undefined;
  }

  return {
    ...style,
    size: Math.max(52, style.size * factor),
    fontSize: Math.max(16, style.fontSize * factor),
    strokeWidth: Math.max(2, style.strokeWidth * Math.sqrt(factor)),
    glowBlur: style.glowBlur * factor,
  };
};

const resolveSceneScaleFactor = (moment: DesignedMoment): number => {
  const renderUnitCount = moment.entities.reduce((total, entity) => {
    const replicas = Math.max(1, Math.min(MAX_CLUSTER_SIZE, Math.round(entity.count ?? 1)));
    return total + replicas;
  }, 0);

  if (renderUnitCount <= 2) {
    return 1.45;
  }

  if (renderUnitCount === 3) {
    return 1.28;
  }

  if (renderUnitCount === 4) {
    return 1.14;
  }

  if (renderUnitCount === 5) {
    return 1.0;
  }

  if (renderUnitCount === 6) {
    return 0.9;
  }

  if (renderUnitCount === 7) {
    return 0.8;
  }

  if (renderUnitCount === 8) {
    return 0.72;
  }

  return Math.max(0.56, 0.72 - (renderUnitCount - 8) * 0.05);
};

const componentNormalizedWidth = (type: ComponentType): number => {
  switch (type) {
    case ComponentType.UsersCluster:
      return 220 / 1080 * 100;
    case ComponentType.Server:
      return 170 / 1080 * 100;
    case ComponentType.LoadBalancer:
      return 156 / 1080 * 100;
    case ComponentType.Database:
      return 170 / 1080 * 100;
    case ComponentType.Cache:
      return 160 / 1080 * 100;
    case ComponentType.Queue:
      return 148 / 1080 * 100;
    case ComponentType.Cdn:
      return 170 / 1080 * 100;
    case ComponentType.Worker:
      return 136 / 1080 * 100;
    default:
      return 150 / 1080 * 100;
  }
};

const toCameraAction = (moment: DesignedMoment): CameraActionType | undefined => {
  if (!moment.camera) {
    return undefined;
  }

  if (moment.camera.mode === 'wide') {
    return CameraActionType.Wide;
  }

  if (moment.camera.mode === 'focus') {
    return CameraActionType.Focus;
  }

  return undefined;
};

const resolveBasePosition = (entity: DesignedEntity): {x: number; y: number} => {
  if (entity.layout) {
    return {
      x: entity.layout.x,
      y: entity.layout.y,
    };
  }

  if (entity.importance === 'primary') {
    return DEFAULT_PRIMARY_POSITION;
  }

  return DEFAULT_SECONDARY_POSITION;
};

const expandEntityInstances = (
  entity: DesignedEntity,
  heroEntityId: string,
  sceneScaleFactor: number,
): EntityInstance[] => {
  const basePosition = resolveBasePosition(entity);
  const roundedCount = Math.round(entity.count ?? 1);
  const count = Math.max(1, Math.min(MAX_CLUSTER_SIZE, roundedCount));

  if (count === 1) {
    return [
      {
        sourceEntityId: entity.id,
        id: entity.id,
        position: {
          x: clampPercent(basePosition.x),
          y: clampPercent(basePosition.y),
        },
        isHero: entity.id === heroEntityId,
        isLead: true,
      },
    ];
  }

  const centerOffset = (count - 1) / 2;
  const spreadAcrossX =
    entity.type === ComponentType.Server ||
    entity.type === ComponentType.Worker;
  // Keep replicated horizontal groups (server xN / worker xN) visually separated
  // even after hierarchy emphasis scales nodes up at runtime.
  const widthDrivenSpacing = componentNormalizedWidth(entity.type) * sceneScaleFactor * 1.45;
  const spacing = spreadAcrossX
    ? Math.max(CLUSTER_HORIZONTAL_SPACING, widthDrivenSpacing)
    : CLUSTER_VERTICAL_SPACING;
  const leadIndex = spreadAcrossX ? Math.floor(count / 2) : 0;

  return Array.from({length: count}, (_, index) => {
    const offsetFromCenter = index - centerOffset;
    const x = spreadAcrossX
      ? clampPercent(basePosition.x + offsetFromCenter * spacing)
      : clampPercent(basePosition.x);
    const y = spreadAcrossX
      ? clampPercent(basePosition.y)
      : clampPercent(basePosition.y + offsetFromCenter * spacing);
    const elementId = index === leadIndex ? entity.id : `${entity.id}_${index + 1}`;

    return {
      sourceEntityId: entity.id,
      id: elementId,
      position: {
        x,
        y,
      },
      isHero: entity.id === heroEntityId && index === leadIndex,
      isLead: index === leadIndex,
    };
  });
};

const selectHeroId = (moment: DesignedMoment): string =>
  moment.entities.find((entity) => entity.importance === 'primary')?.id ??
  moment.entities[0]?.id ??
  '';

const createEmptyPreviousMoment = (moment: DesignedMoment): DesignedMoment => ({
  ...moment,
  narration: '',
  entities: [],
  connections: [],
  interactions: [],
  stateChanges: [],
  camera: undefined,
});

const cloneMapOfArrays = (input: Map<string, string[]>): Map<string, string[]> =>
  new Map([...input.entries()].map(([key, values]) => [key, [...values]]));

const hasPlanMotion = (scene: MotionSceneSpec): boolean => {
  const plan = scene.plan;

  if (!plan) {
    return false;
  }

  return (
    plan.removals.length > 0 ||
    plan.moves.length > 0 ||
    plan.additions.length > 0 ||
    plan.connections.length > 0 ||
    plan.interactions.length > 0 ||
    plan.cameraAction !== undefined
  );
};

const sceneHasVisibleMotion = (scene: MotionSceneSpec): boolean =>
  scene.camera !== undefined ||
  scene.cameraPlan != null ||
  scene.elements.some(
    (element) =>
      element.enter !== undefined ||
      element.exit !== undefined ||
      (element.effects?.length ?? 0) > 0,
  ) ||
  hasPlanMotion(scene);

const mapEntityInstances = (elements: MotionElementSpec[]): Map<string, string[]> => {
  const mapped = new Map<string, string[]>();

  for (const element of elements) {
    const sourceEntityId = element.sourceEntityId ?? element.id;
    const ids = mapped.get(sourceEntityId);

    if (ids) {
      ids.push(element.id);
    } else {
      mapped.set(sourceEntityId, [element.id]);
    }
  }

  return mapped;
};

const createSceneSource = (moment: DesignedMoment): SceneSnapshot => ({
  entities: moment.entities.map((entity) => ({...entity, layout: {...entity.layout}})),
  connections: (moment.connections ?? []).map((connection: Connection) => ({...connection})),
  interactions: (moment.interactions ?? []).map((interaction: Interaction) => ({...interaction})),
  camera: moment.camera ? {...moment.camera} : undefined,
});

const resolveTargetElementId = (
  entityInstances: Map<string, string[]>,
  targetEntityId: string | undefined,
): string | undefined => {
  if (!targetEntityId) {
    return undefined;
  }

  const instances = entityInstances.get(targetEntityId) ?? [];
  if (instances.length === 0) {
    return undefined;
  }

  // Prefer the canonical lead element id (same as source entity id),
  // then fall back to the first rendered replica.
  return instances.find((instanceId) => instanceId === targetEntityId) ?? instances[0];
};

const resolveCameraMotionType = (
  moment: DesignedMoment,
): SceneCameraPlan['motionType'] => {
  if (moment.camera?.mode === 'focus') {
    return 'focus_primary';
  }

  return 'expand_architecture';
};

const buildExplicitSceneCameraPlan = (
  moment: DesignedMoment,
  currentEntityInstances: Map<string, string[]>,
): SceneCameraPlan | null => {
  if (!moment.camera) {
    return null;
  }

  const cameraTargetId = moment.camera.target;
  const targetElementId = resolveTargetElementId(
    currentEntityInstances,
    cameraTargetId,
  );
  const defaultZoom = moment.camera.mode === 'focus' ? 1.5 : 1;
  const defaultDuration = moment.camera.mode === 'focus' ? 0.55 : 0.45;

  return {
    targetId: cameraTargetId,
    targetElementId,
    targetPosition: undefined,
    zoom: moment.camera.zoom ?? defaultZoom,
    duration: defaultDuration,
    easing: 'cubic-bezier(0.2,0,0,1)',
    motionType: resolveCameraMotionType(moment),
  };
};

const hasSceneVisualActivity = (scene: MotionSceneSpec): boolean => {
  const hasStructuralChange =
    (scene.diff?.entityDiffs.length ?? 0) > 0 || (scene.diff?.connectionDiffs.length ?? 0) > 0;
  const hasInteractionActivity =
    (scene.interactions?.length ?? scene.source?.interactions?.length ?? 0) > 0;
  const hasCameraActivity =
    (scene.diff?.cameraDiffs.length ?? 0) > 0 || scene.cameraPlan != null;
  const hasHierarchyActivity = scene.hierarchyTransition !== null && scene.hierarchyTransition !== undefined;

  return hasStructuralChange || hasInteractionActivity || hasCameraActivity || hasHierarchyActivity;
};

const ensureFallbackMotion = (scene: MotionSceneSpec, heroEntityId: string): void => {
  if (sceneHasVisibleMotion(scene)) {
    return;
  }

  const heroElement = scene.elements.find((element) => element.sourceEntityId === heroEntityId);

  if (heroElement) {
    heroElement.effects = [...new Set([...(heroElement.effects ?? []), AnimationType.Focus])];
    return;
  }

  scene.camera = scene.camera ?? CameraActionType.Focus;
};

const attachDiffAndPlan = (
  scene: MotionSceneSpec,
  diff: MomentDiff,
  currentMoment: DesignedMoment,
  previousMoment: DesignedMoment,
  previousHierarchy: HierarchyPlan | null,
  previousCameraPlan: PlannedCamera | null,
  currentEntityInstances: Map<string, string[]>,
  previousEntityInstances: Map<string, string[]>,
  personality: MotionPersonalityId,
  staticMode: boolean,
  stableLayout: boolean,
): AttachDiffAndPlanResult => {
  const sceneScaleFactor = resolveSceneScaleFactor(currentMoment);
  const explicitCameraPlan = buildExplicitSceneCameraPlan(
    currentMoment,
    currentEntityInstances,
  );

  if (staticMode) {
    const hierarchy = buildHierarchyPlan(currentMoment, diff, previousHierarchy, personality);
    const entityStyleById = new Map(
      currentMoment.entities.map((entity) => [
        entity.id,
        resolveEntityStyle(entity, hierarchy, currentMoment.directives?.visual),
      ]),
    );

    return {
      scene: {
        ...scene,
        staticScene: true,
        motionPersonality: personality,
        elements: scene.elements.map((element) => ({
          ...element,
          enter: undefined,
          exit: undefined,
          effects: [],
          visualStyle: scaledVisualStyle(
            entityStyleById.get(element.sourceEntityId ?? element.id),
            sceneScaleFactor,
          ),
        })),
        camera: CameraActionType.Wide,
        diff,
        hierarchy,
        hierarchyTransition: null,
        plan: undefined,
        animationPlan: undefined,
        cameraPlan: null,
      },
      resolvedCameraPlan: previousCameraPlan ?? undefined,
    };
  }

  const sceneDuration = Math.max(0, scene.end - scene.start);
  const primaryEntityIds = new Set(
    currentMoment.entities
      .filter((entity) => entity.importance === 'primary')
      .map((entity) => entity.id),
  );

  const plan = buildSceneAnimationPlan({
    diff,
    currentMoment,
    previousMoment,
    currentEntityInstances,
    previousEntityInstances,
    fallbackCameraAction: scene.camera,
  });
  const animationPlan = planSceneAnimationTimings({
    diff,
    sceneDuration,
    primaryEntityIds,
    personality,
    isHook: Boolean(
      currentMoment.isHook || currentMoment.directives?.motion.pacing === 'reel_fast',
    ),
    transition: currentMoment.transition,
  });
  const stablePlan = stableLayout
    ? {
      ...plan,
      cameraAction: undefined,
    }
    : plan;
  const stableAnimationPlan = stableLayout
    ? {
      ...animationPlan,
      camera: null,
    }
    : animationPlan;
  const hierarchy = stableLayout
    ? undefined
    : buildHierarchyPlan(currentMoment, diff, previousHierarchy, personality);
  const hierarchyTransition = hierarchy
    ? detectHierarchyTransition(previousHierarchy, hierarchy)
    : null;
  const entityStyleById = new Map(
    currentMoment.entities.map((entity) => [
      entity.id,
      resolveEntityStyle(
        entity,
        hierarchy ?? {
          primaryId: null,
          entityStyles: {},
        },
        currentMoment.directives?.visual,
      ),
    ]),
  );
  let resolvedCameraPlan: PlannedCamera | undefined = previousCameraPlan ?? undefined;
  let sceneCameraPlan: SceneCameraPlan | null = null;
  const directiveCameraMode = currentMoment.directives?.camera.mode ?? 'auto';
  const hasExplicitFollowCamera =
    directiveCameraMode === 'follow_action' ||
    directiveCameraMode === 'wide_recap' ||
    currentMoment.camera?.mode === 'focus';

  if (!stableLayout && !hasExplicitFollowCamera) {
    const nextCameraPlan = buildCameraPlan(
      currentMoment,
      diff,
      hierarchy ?? {
        primaryId: null,
        entityStyles: {},
      },
      previousCameraPlan,
      personality,
    );
    resolvedCameraPlan = nextCameraPlan;

    if (detectCameraChange(previousCameraPlan, nextCameraPlan)) {
      const targetElementId = resolveTargetElementId(
        currentEntityInstances,
        nextCameraPlan.targetId,
      );
      sceneCameraPlan = {
        ...nextCameraPlan,
        targetElementId,
      };
    }
  } else if (explicitCameraPlan) {
    sceneCameraPlan = explicitCameraPlan;
  }

  const sceneCameraAction = stableLayout
    ? hasExplicitFollowCamera
      ? scene.camera
      : undefined
    : stablePlan.cameraAction ?? scene.camera;
  const resolvedSceneCameraPlan = stableLayout
    ? hasExplicitFollowCamera
      ? sceneCameraPlan
      : null
    : sceneCameraPlan;

  return {
    scene: {
      ...scene,
      motionPersonality: personality,
      elements: scene.elements.map((element) => ({
        ...element,
        visualStyle: scaledVisualStyle(
          entityStyleById.get(element.sourceEntityId ?? element.id),
          sceneScaleFactor,
        ),
      })),
      camera: sceneCameraAction,
      diff,
      hierarchy,
      hierarchyTransition,
      plan: stablePlan,
      animationPlan: stableAnimationPlan,
      cameraPlan: resolvedSceneCameraPlan,
    },
    resolvedCameraPlan,
  };
};

const toMotionScene = (
  moment: DesignedMoment,
  state: BuildState,
  personality: MotionPersonalityId,
  staticMode: boolean,
  stableLayout: boolean,
): SceneBuildResult => {
  const heroEntityId = selectHeroId(moment);
  const sceneScaleFactor = resolveSceneScaleFactor(moment);

  const elements: MotionElementSpec[] = [];

  for (const entity of moment.entities) {
    const instances = expandEntityInstances(entity, heroEntityId, sceneScaleFactor);

    for (const instance of instances) {
      const isNew = !state.seenElementIds.has(instance.id);
      if (isNew) {
        state.seenElementIds.add(instance.id);
      }

      const enter = isNew
        ? staticMode
          ? undefined
          : AnimationType.ZoomIn
        : undefined;

      elements.push({
        id: instance.id,
        type: entity.type,
        sourceEntityId: instance.sourceEntityId,
        label: instance.isLead ? entity.label : undefined,
        position: instance.position,
        enter,
      });
    }
  }

  const sourceScene = createSceneSource(moment);

  const sceneBase: MotionSceneSpec = {
    id: moment.id,
    start: moment.start,
    end: moment.end,
    narration: moment.narration,
    camera: toCameraAction(moment),
    elements,
    entities: moment.entities.map((entity) => ({...entity, layout: {...entity.layout}})),
    connections: (moment.connections ?? []).map((connection) => ({...connection})),
    interactions: (moment.interactions ?? []).map((interaction) => ({...interaction})),
    sourceCamera: moment.camera ? {...moment.camera} : undefined,
    directives: moment.directives,
    source: sourceScene,
  };

  const currentEntityInstances = mapEntityInstances(elements);
  const previousMoment = state.previousMoment ?? createEmptyPreviousMoment(moment);
  const previousEntityInstances =
    state.previousMoment !== undefined
      ? cloneMapOfArrays(state.previousEntityInstances)
      : new Map<string, string[]>();
  const previousHierarchy = state.previousHierarchy ?? null;
  const previousCameraPlan = state.previousCameraPlan ?? null;
  const previousSceneSnapshot =
    state.previousSceneSnapshot ??
    ({
      entities: [],
      connections: [],
      interactions: [],
      camera: undefined,
    } satisfies SceneSnapshot);

  const sceneDiff = diffScenes(previousSceneSnapshot, sourceScene);
  const diff = toMomentDiff(sceneDiff);
  const attached = attachDiffAndPlan(
    sceneBase,
    diff,
    moment,
    previousMoment,
    previousHierarchy,
    previousCameraPlan,
    currentEntityInstances,
    previousEntityInstances,
    personality,
    staticMode,
    stableLayout,
  );
  const sceneWithPlan: MotionSceneSpec = {
    ...attached.scene,
    sceneDiff,
  };

  if (!staticMode) {
    ensureFallbackMotion(sceneWithPlan, heroEntityId);
  }

  return {
    scene: sceneWithPlan,
    entityInstances: currentEntityInstances,
    resolvedCameraPlan: attached.resolvedCameraPlan,
  };
};

export interface MotionCanvasAgent {
  buildRenderSpec(
    momentsVideo: DesignedMomentsVideo,
    options?: BuildRenderSpecOptions,
  ): MotionRenderSpec;
}

export interface MotionCanvasAgentDependencies {
  logger?: Logger;
}

export const createMotionCanvasAgent = (
  dependencies: MotionCanvasAgentDependencies = {},
): MotionCanvasAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const buildRenderSpec = (
    momentsVideo: DesignedMomentsVideo,
    options: BuildRenderSpecOptions = {},
  ): MotionRenderSpec => {
    const personality = options.personality ?? DEFAULT_MOTION_PERSONALITY;
    const staticMode = options.staticMode ?? false;
    const stableLayout = options.stableLayout ?? false;

    logger.info('Motion Canvas agent: converting MomentsVideo into render spec', {
      moments: momentsVideo.moments.length,
      duration: momentsVideo.duration,
      personality,
      staticMode,
      stableLayout,
    });

    const sortedMoments = [...momentsVideo.moments].sort((left, right) => left.start - right.start);
    const state: BuildState = {
      seenElementIds: new Set<string>(),
      previousEntityInstances: new Map<string, string[]>(),
      previousSceneSnapshot: undefined,
      previousHierarchy: undefined,
    };

    const scenes: MotionSceneSpec[] = [];

    for (const moment of sortedMoments) {
      const built = toMotionScene(moment, state, personality, staticMode, stableLayout);
      scenes.push(built.scene);

      const sceneDuration = built.scene.end - built.scene.start;
      if (
        sceneDuration > VIDEO_LIMITS.maxStructuralIdleSeconds &&
        !hasSceneVisualActivity(built.scene)
      ) {
        logger.warn('Motion Canvas agent: long low-activity scene', {
          sceneId: built.scene.id,
          duration: sceneDuration,
          maxStructuralIdleSeconds: VIDEO_LIMITS.maxStructuralIdleSeconds,
        });
      }

      state.previousMoment = moment;
      state.previousSceneSnapshot = built.scene.source;
      state.previousEntityInstances = cloneMapOfArrays(built.entityInstances);
      state.previousHierarchy = built.scene.hierarchy;
      state.previousCameraPlan = built.resolvedCameraPlan;
    }

    const renderSpec: MotionRenderSpec = {
      duration: momentsVideo.duration,
      scenes,
    };

    logger.info('Motion Canvas agent: render spec ready', {
      scenes: renderSpec.scenes.length,
    });

    return renderSpec;
  };

  return {
    buildRenderSpec,
  };
};
