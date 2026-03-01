import {Circle, Icon, Line, Rect, Txt, type Node} from '@motion-canvas/2d';
import {
  all,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  type TimingFunction,
  type ThreadGenerator,
  waitFor,
} from '@motion-canvas/core';
import {HierarchyTokens} from '../config/hierarchyTokens.js';
import {MotionTokens} from '../config/motionTokens.js';
import {StyleTokens} from '../config/styleTokens.js';
import {VIDEO_LIMITS} from '../config/constants.js';
import {
  resolveConnectionStyle,
  resolveFlowStyle,
} from '../design/styleResolver.js';
import {AnimationType, CameraActionType, ComponentType} from '../schema/visualGrammar.js';
import {
  applyShake,
  applyFadeIn,
  getAnimationDuration,
  runElementAnimation,
  runElementAnimationTimed,
} from './animations.js';
import {
  createConnection,
  updateConnection,
  type ConnectionAnchor,
} from './connectionRenderer.js';
import {createCameraPlan} from './cameraController.js';
import {ensureElementLifecycle, type LifecycleResult} from './lifecycle.js';
import type {PixelPosition} from './positioning.js';
import {
  getScenePhases,
  type ConnectionTimingPlan,
  type EntityTimingAction,
  type EntityTimingPlan,
} from './timingPlanner.js';
import type {
  ElementAnimationIntent,
  MotionElementSpec,
  MotionSceneSpec,
  RuntimeLogger,
  SceneAnimationPhase,
  SceneState,
} from './types.js';

const MIN_SCENE_DURATION = 1.5;
const MAX_SCENE_DURATION = VIDEO_LIMITS.maxSceneDurationSeconds;
const CAPTIONS_ENABLED = false;
const CAPTION_FADE_OUT_DURATION = 0.12;
const CAPTION_TEXT_DURATION = 0.3;
const CAPTION_FADE_IN_DURATION = 0.2;

const CAPTION_TOTAL_DURATION =
  CAPTION_FADE_OUT_DURATION + CAPTION_TEXT_DURATION + CAPTION_FADE_IN_DURATION;
const DEFAULT_ENTRY_FADE_DURATION = 0.22;
const DEFAULT_REMOVAL_DURATION = 0.2;
const MAX_RECOMMENDED_SCENE_ELEMENTS = 6;

const formatMetadata = (metadata?: Record<string, unknown>): string => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '';
  }

  return ` ${JSON.stringify(metadata)}`;
};

export const createRuntimeLogger = (scope = 'renderer'): RuntimeLogger => ({
  info: (message, metadata) => {
    console.log(`[${scope}] ${message}${formatMetadata(metadata)}`);
  },
  warn: (message, metadata) => {
    console.warn(`[${scope}] ${message}${formatMetadata(metadata)}`);
  },
});

export interface CreateSceneStateInput {
  caption: Txt;
  logger?: RuntimeLogger;
}

export const createSceneState = ({caption, logger}: CreateSceneStateInput): SceneState => ({
  caption,
  elements: new Map(),
  connections: new Map(),
  camera: {
    originX: 0,
    originY: 0,
    x: 0,
    y: 0,
    scale: 1,
    actionStreak: 0,
  },
  sceneIndex: 0,
  lastExecutionDuration: 0,
  logger: logger ?? createRuntimeLogger(),
});

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
    plan.cameraAction !== undefined ||
    (scene.cameraPlan !== undefined && scene.cameraPlan !== null)
  );
};

const hasMotionEvent = (scene: MotionSceneSpec): boolean => {
  if (scene.camera || hasPlanMotion(scene) || Boolean(scene.hierarchyTransition)) {
    return true;
  }

  return scene.elements.some((element) => {
    const effectsCount = element.effects?.length ?? 0;
    return element.enter !== undefined || element.exit !== undefined || effectsCount > 0;
  });
};

const hasAmbientVisualActivity = (scene: MotionSceneSpec): boolean =>
  (scene.interactions?.length ?? scene.source?.interactions?.length ?? 0) > 0 ||
  scene.sourceCamera !== undefined;

const hasVisualActivitySignal = (scene: MotionSceneSpec): boolean =>
  hasMotionEvent(scene) || hasAmbientVisualActivity(scene);

const LOAD_SPIKE_NARRATION_PATTERN =
  /\b(massive|sudden|spike|load spike|surge|burst|flood|overload|overloaded|high traffic|incoming traffic|increase load|load increase|traffic increase|increase in traffic|user load)\b/i;

const ACTOR_COMPONENT_TYPES = new Set<ComponentType>([
  ComponentType.UsersCluster,
  ComponentType.SingleUser,
  ComponentType.MobileApp,
  ComponentType.WebBrowser,
  ComponentType.AdminUser,
  ComponentType.ThirdPartyService,
  ComponentType.IotDevices,
]);

const sceneIndicatesTrafficSpike = (scene: MotionSceneSpec): boolean => {
  if (LOAD_SPIKE_NARRATION_PATTERN.test(scene.narration)) {
    return true;
  }

  const interactions = scene.interactions ?? scene.source?.interactions ?? [];
  return interactions.some(
    (interaction) => interaction.type === 'burst' && interaction.intensity === 'high',
  );
};

const buildEntityTypeById = (scene: MotionSceneSpec): Map<string, ComponentType> => {
  const entityTypeById = new Map<string, ComponentType>();
  const entities = scene.entities ?? scene.source?.entities ?? [];
  for (const entity of entities) {
    entityTypeById.set(entity.id, entity.type);
  }

  return entityTypeById;
};

const buildEntityStatusById = (scene: MotionSceneSpec): Map<string, string> => {
  const statusByEntityId = new Map<string, string>();
  const entities = scene.entities ?? scene.source?.entities ?? [];
  for (const entity of entities) {
    if (entity.status) {
      statusByEntityId.set(entity.id, entity.status);
    }
  }

  for (const element of scene.elements) {
    const sourceEntityId = element.sourceEntityId ?? element.id;
    const status = element.visualStyle?.status;
    if (status) {
      statusByEntityId.set(sourceEntityId, status);
    }
  }

  return statusByEntityId;
};

export const validateSceneForRuntime = (scene: MotionSceneSpec, logger: RuntimeLogger): void => {
  const duration = scene.end - scene.start;

  if (duration > MAX_SCENE_DURATION) {
    logger.warn('Scene duration exceeds recommended maximum', {
      sceneId: scene.id,
      duration,
      maxDuration: MAX_SCENE_DURATION,
    });
  }

  if (duration < MIN_SCENE_DURATION) {
    logger.warn('Scene duration below recommended minimum', {
      sceneId: scene.id,
      duration,
      minDuration: MIN_SCENE_DURATION,
    });
  }

  if (!hasMotionEvent(scene)) {
    logger.warn('Scene has no explicit motion event', {
      sceneId: scene.id,
    });
  }

  if (duration > VIDEO_LIMITS.maxStructuralIdleSeconds && !hasVisualActivitySignal(scene)) {
    logger.warn('Long low-activity scene detected', {
      sceneId: scene.id,
      duration,
      maxStructuralIdleSeconds: VIDEO_LIMITS.maxStructuralIdleSeconds,
    });
  }

  if (scene.elements.length > MAX_RECOMMENDED_SCENE_ELEMENTS) {
    logger.warn('High element density', {
      scene: scene.id,
      elements: scene.elements.length,
      recommendedMax: MAX_RECOMMENDED_SCENE_ELEMENTS,
    });
  }
};

const hasExplicitElementMotion = (element: MotionElementSpec): boolean =>
  element.enter !== undefined ||
  element.exit !== undefined ||
  (element.effects?.length ?? 0) > 0;

const createCaptionTransition = (caption: Txt, text: string): PhaseExecutionPlan => {
  if (!CAPTIONS_ENABLED || text.trim().length === 0) {
    return {duration: 0};
  }

  return {
    duration: CAPTION_TOTAL_DURATION,
    thread: (function* captionThread() {
      yield* caption.opacity(0, CAPTION_FADE_OUT_DURATION, easeInOutCubic);
      yield* caption.text(text, CAPTION_TEXT_DURATION);
      yield* caption.opacity(1, CAPTION_FADE_IN_DURATION, easeInOutCubic);
    })(),
  };
};

const toLifecycleMap = (results: LifecycleResult[]): Map<string, LifecycleResult> =>
  new Map(results.map((result) => [result.elementState.id, result]));

const toElementSpecMap = (elements: MotionElementSpec[]): Map<string, MotionElementSpec> =>
  new Map(elements.map((element) => [element.id, element]));

const getIntentBucket = (
  scene: MotionSceneSpec,
  phase: SceneAnimationPhase,
): ElementAnimationIntent[] => {
  const plan = scene.plan;

  if (!plan) {
    return [];
  }

  switch (phase) {
    case 'removals':
      return plan.removals;
    case 'moves':
      return plan.moves;
    case 'additions':
      return plan.additions;
    case 'connections':
      return plan.connections;
    case 'interactions':
      return plan.interactions;
    case 'camera':
      return [];
    default:
      return [];
  }
};

interface PhaseExecutionPlan {
  thread?: ThreadGenerator;
  duration: number;
}

const toThread = (threads: ThreadGenerator[]): ThreadGenerator | undefined =>
  threads.length > 0 ? all(...threads) : undefined;

const timingKey = (entityId: string, action: EntityTimingAction): string => `${entityId}|${action}`;

const resolveTimingFunction = (easing: string): TimingFunction => {
  if (easing.includes('0.4,0,0.2,1')) {
    return easeOutCubic;
  }

  if (easing.includes('0.16,1,0.3,1')) {
    return easeOutCubic;
  }

  if (easing === MotionTokens.easing.exit) {
    return easeInCubic;
  }

  if (easing === MotionTokens.easing.enter) {
    return easeOutCubic;
  }

  return easeInOutCubic;
};

const createDelayedThread = (delay: number, thread: ThreadGenerator): ThreadGenerator =>
  (function* delayedThread() {
    if (delay > 0) {
      yield* waitFor(delay);
    }

    yield* thread;
  })();

const resolveElementSourceId = (
  sceneElementById: Map<string, MotionElementSpec>,
  elementId: string,
): string => {
  const spec = sceneElementById.get(elementId);
  if (!spec) {
    return elementId;
  }

  return spec.sourceEntityId ?? spec.id;
};

const COMPONENT_CONNECTION_BOUNDS: Partial<Record<ComponentType, {width: number; height: number}>> = {
  [ComponentType.UsersCluster]: {width: 86, height: 86},
  [ComponentType.Server]: {width: 86, height: 86},
  [ComponentType.LoadBalancer]: {width: 88, height: 88},
  [ComponentType.Database]: {width: 90, height: 90},
  [ComponentType.Cache]: {width: 86, height: 86},
  [ComponentType.Queue]: {width: 84, height: 84},
  [ComponentType.Cdn]: {width: 88, height: 88},
  [ComponentType.Worker]: {width: 84, height: 84},
};

const resolveAnchorSize = (
  element: MotionElementSpec | undefined,
): {halfWidth: number; halfHeight: number} => {
  const styleSize = element?.visualStyle?.size ?? StyleTokens.sizes.medium;
  const scale = styleSize / StyleTokens.sizes.medium;
  const base = element
    ? COMPONENT_CONNECTION_BOUNDS[element.type] ?? {width: 84, height: 84}
    : {width: 84, height: 84};

  return {
    halfWidth: Math.max(28, (base.width * scale) / 2),
    halfHeight: Math.max(20, (base.height * scale) / 2),
  };
};

const collectEntityAnchors = (
  lifecycleResults: LifecycleResult[],
  sceneElementById: Map<string, MotionElementSpec>,
): Map<string, ConnectionAnchor> => {
  const preferredByEntityId = new Map<string, ConnectionAnchor>();
  const fallbackByEntityId = new Map<string, ConnectionAnchor>();

  for (const lifecycleResult of lifecycleResults) {
    const sourceEntityId = resolveElementSourceId(sceneElementById, lifecycleResult.elementState.id);
    const element = sceneElementById.get(lifecycleResult.elementState.id);
    const size = resolveAnchorSize(element);
    const anchor: ConnectionAnchor = {
      position: lifecycleResult.targetPosition,
      halfWidth: size.halfWidth,
      halfHeight: size.halfHeight,
    };

    if (lifecycleResult.elementState.id === sourceEntityId) {
      preferredByEntityId.set(sourceEntityId, anchor);
      continue;
    }

    if (!fallbackByEntityId.has(sourceEntityId)) {
      fallbackByEntityId.set(sourceEntityId, anchor);
    }
  }

  for (const [sourceEntityId, fallbackAnchor] of fallbackByEntityId.entries()) {
    if (!preferredByEntityId.has(sourceEntityId)) {
      preferredByEntityId.set(sourceEntityId, fallbackAnchor);
    }
  }

  return preferredByEntityId;
};

const collectSceneContentBounds = (
  lifecycleResults: LifecycleResult[],
  sceneElementById: Map<string, MotionElementSpec>,
): {minX: number; maxX: number; minY: number; maxY: number} | undefined => {
  if (lifecycleResults.length === 0) {
    return undefined;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const lifecycleResult of lifecycleResults) {
    const element = sceneElementById.get(lifecycleResult.elementState.id);
    const size = resolveAnchorSize(element);
    const labelPadding = element?.label ? 26 : 16;
    const x = lifecycleResult.targetPosition.x;
    const y = lifecycleResult.targetPosition.y;
    minX = Math.min(minX, x - size.halfWidth);
    maxX = Math.max(maxX, x + size.halfWidth);
    minY = Math.min(minY, y - size.halfHeight);
    maxY = Math.max(maxY, y + size.halfHeight + labelPadding);
  }

  return {minX, maxX, minY, maxY};
};

const resolveLineDashPattern = (style?: 'solid' | 'dashed' | 'dotted'): number[] => {
  switch (style) {
    case 'dashed':
      return [12, 10];
    case 'dotted':
      return [4, 9];
    default:
      return [];
  }
};

const BURST_TRAFFIC_LANE_COUNT = 3;
const BURST_TRAFFIC_LANE_SPACING = 18;

type NumericPoint = [number, number];

const toNumericLinePoints = (rawPoints: unknown): NumericPoint[] => {
  if (!Array.isArray(rawPoints)) {
    return [];
  }

  const normalized: NumericPoint[] = [];
  for (const point of rawPoints) {
    if (Array.isArray(point) && point.length >= 2) {
      const [x, y] = point;
      if (typeof x === 'number' && typeof y === 'number') {
        normalized.push([x, y]);
      }
      continue;
    }

    if (point && typeof point === 'object') {
      const candidate = point as Record<string, unknown>;
      const x = candidate.x;
      const y = candidate.y;
      if (typeof x === 'number' && typeof y === 'number') {
        normalized.push([x, y]);
      }
    }
  }

  return normalized;
};

const createBurstTrafficOverlayLanes = (
  view: Node,
  baseLine: Line,
  fromAnchor?: ConnectionAnchor,
  toAnchor?: ConnectionAnchor,
): Line[] => {
  const basePoints = toNumericLinePoints(baseLine.points() as unknown);
  if (basePoints.length < 2 || BURST_TRAFFIC_LANE_COUNT < 2) {
    return [];
  }

  const first = basePoints[0];
  const last = basePoints[basePoints.length - 1];
  if (!first || !last) {
    return [];
  }

  const isVerticalRoute = Math.abs(last[1] - first[1]) >= Math.abs(last[0] - first[0]);
  const proportionalLaneSpacing =
    fromAnchor && toAnchor
      ? Math.min(
          76,
          Math.max(
            12,
            (isVerticalRoute
              ? Math.min(fromAnchor.halfWidth, toAnchor.halfWidth)
              : Math.min(fromAnchor.halfHeight, toAnchor.halfHeight)) * 0.8,
          ),
        )
      : BURST_TRAFFIC_LANE_SPACING;
  const laneOffsets = [-1, 1];
  const baseWidth = baseLine.lineWidth();
  const baseArrowSize = baseLine.arrowSize();
  const baseZIndex = baseLine.zIndex();
  const baseDash = baseLine.lineDash();
  const baseDashOffset = baseLine.lineDashOffset();
  const baseStroke = baseLine.stroke();
  const startArrow = baseLine.startArrow();
  const endArrow = baseLine.endArrow();

  const lanes: Line[] = [];
  for (const laneOffset of laneOffsets) {
    const shiftedPoints: NumericPoint[] = basePoints.map(([x, y]) =>
      isVerticalRoute
        ? [x + laneOffset * proportionalLaneSpacing, y]
        : [x, y + laneOffset * proportionalLaneSpacing],
    );

    const lane = new Line({
      points: shiftedPoints,
      stroke: baseStroke,
      lineWidth: Math.max(1.6, baseWidth * 0.76),
      startArrow,
      endArrow,
      arrowSize: Math.max(6, baseArrowSize * 0.82),
      opacity: 0,
      zIndex: baseZIndex - 0.2,
    });
    lane.lineDash(baseDash);
    lane.lineDashOffset(baseDashOffset);
    lane.start(0);
    lane.end(1);
    view.add(lane);
    lanes.push(lane);
  }

  return lanes;
};

const findLbSpinnerNode = (root: Node): Node | undefined => {
  const tagged = root as Node & {lbSpinnerTag?: boolean};
  if (tagged.lbSpinnerTag) {
    return root;
  }

  for (const child of root.children()) {
    const nested = findLbSpinnerNode(child);
    if (nested) {
      return nested;
    }
  }

  return undefined;
};

interface ConnectionSyncStats {
  added: number;
  updated: number;
  removed: number;
  retainedForRemoval: number;
}

const syncSceneConnections = (
  view: Node,
  scene: MotionSceneSpec,
  state: SceneState,
  entityAnchorsById: Map<string, ConnectionAnchor>,
  connectionIdsRetainedForRemoval: ReadonlySet<string>,
): ConnectionSyncStats => {
  const desiredConnections = scene.connections ?? scene.source?.connections ?? [];
  const desiredIds = new Set<string>();
  let added = 0;
  let updated = 0;
  let removed = 0;
  let retainedForRemoval = 0;

  for (const connection of desiredConnections) {
    desiredIds.add(connection.id);
    const fromAnchor = entityAnchorsById.get(connection.from);
    const toAnchor = entityAnchorsById.get(connection.to);
    const baseLaneOffset = 0;

    if (!fromAnchor || !toAnchor) {
      state.logger.warn('Connection skipped', {
        scene: scene.id,
        connectionId: connection.id,
        from: connection.from,
        to: connection.to,
        reason: 'Missing entity position',
      });

      const existingNode = state.connections.get(connection.id);
      if (existingNode) {
        existingNode.remove();
        state.connections.delete(connection.id);
        removed += 1;
      }
      continue;
    }

    const style = resolveConnectionStyle(connection, scene.directives?.visual);
    const bidirectional = connection.direction === 'bidirectional';
    const existingNode = state.connections.get(connection.id);

    if (!existingNode) {
      const line = createConnection(fromAnchor, toAnchor, style, bidirectional, baseLaneOffset);
      line.lineDash(resolveLineDashPattern(connection.style));
      line.lineDashOffset(0);
      line.start(0);
      line.end(1);
      line.opacity(0);
      view.add(line);
      state.connections.set(connection.id, line);
      added += 1;
      continue;
    }

    updateConnection(existingNode, fromAnchor, toAnchor, style, bidirectional, baseLaneOffset);
    existingNode.lineDash(resolveLineDashPattern(connection.style));
    existingNode.lineDashOffset(0);
    existingNode.start(0);
    existingNode.end(1);
    updated += 1;
  }

  for (const [connectionId, line] of state.connections.entries()) {
    if (desiredIds.has(connectionId)) {
      continue;
    }

    if (connectionIdsRetainedForRemoval.has(connectionId)) {
      retainedForRemoval += 1;
      continue;
    }

    line.remove();
    state.connections.delete(connectionId);
    removed += 1;
  }

  return {added, updated, removed, retainedForRemoval};
};

const executeHierarchyStyling = (
  scene: MotionSceneSpec,
  sceneDuration: number,
  lifecycleResults: LifecycleResult[],
  sceneElementById: Map<string, MotionElementSpec>,
): PhaseExecutionPlan => {
  const hierarchy = scene.hierarchy;
  if (!hierarchy) {
    return {duration: 0};
  }

  const phases = getScenePhases(sceneDuration);
  const baseDelay = scene.hierarchyTransition ? phases.enter.start : 0;
  const transitionDuration = HierarchyTokens.transition.duration;
  const timingFunction = resolveTimingFunction(MotionTokens.easing.standard);
  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;

  for (const lifecycle of lifecycleResults) {
    const sourceId = resolveElementSourceId(sceneElementById, lifecycle.elementState.id);
    const hierarchyStyle = hierarchy.entityStyles[sourceId];
    if (!hierarchyStyle) {
      continue;
    }
    const elementStyle = sceneElementById.get(lifecycle.elementState.id)?.visualStyle;
    const targetOpacity =
      elementStyle?.opacity !== undefined
        ? Math.min(hierarchyStyle.opacity, elementStyle.opacity)
        : hierarchyStyle.opacity;

    let delay = baseDelay;
    if (scene.hierarchyTransition?.from === sourceId) {
      delay = baseDelay;
    } else if (scene.hierarchyTransition?.to === sourceId) {
      delay = baseDelay + 0.05;
    }

    maxEnd = Math.max(maxEnd, delay + transitionDuration);

    const thread = createDelayedThread(
      delay,
      (function* hierarchyStyleThread() {
        yield* all(
          lifecycle.node.scale(hierarchyStyle.scale, transitionDuration, timingFunction),
          lifecycle.node.opacity(targetOpacity, transitionDuration, timingFunction),
        );

        if (scene.hierarchyTransition?.to === sourceId && hierarchyStyle.glow) {
          yield* lifecycle.node
            .scale(hierarchyStyle.scale * 1.05, transitionDuration * 0.35, timingFunction)
            .to(hierarchyStyle.scale, transitionDuration * 0.35, timingFunction);
        }
      })(),
    );

    threads.push(thread);
  }

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const runTimedEffects = (
  node: Node,
  effects: MotionElementSpec['effects'],
  duration: number,
  easing: string,
): ThreadGenerator =>
  (function* timedEffectsThread() {
    if (!effects || effects.length === 0) {
      return;
    }

    const perEffectDuration = Math.max(0.1, duration / effects.length);
    const timingFunction = resolveTimingFunction(easing);

    for (const effect of effects) {
      yield* runElementAnimationTimed(node, effect, {
        duration: perEffectDuration,
        timingFunction,
      });
    }
  })();

const withFallbackEntityTiming = (
  timing: EntityTimingPlan | undefined,
  fallbackDelay: number,
  fallbackDuration: number,
  fallbackEasing: string,
  entityId: string,
  action: EntityTimingAction,
): EntityTimingPlan => ({
  entityId,
  action,
  delay: timing?.delay ?? fallbackDelay,
  duration: timing?.duration ?? fallbackDuration,
  easing: timing?.easing ?? fallbackEasing,
  scale: timing?.scale,
  isPrimary: timing?.isPrimary,
});

const executeRemovalsPhase = (
  intents: ElementAnimationIntent[],
  sceneDuration: number,
  state: SceneState,
  entityTimingByKey: Map<string, EntityTimingPlan>,
  entryStyle: 'drop_bounce' | 'elastic_pop' | 'draw_in',
): PhaseExecutionPlan => {
  const phase = getScenePhases(sceneDuration).exit;
  const fallbackDuration = Math.max(DEFAULT_REMOVAL_DURATION, phase.end - phase.start);
  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;

  intents.forEach((intent, index) => {
    const timing = withFallbackEntityTiming(
      entityTimingByKey.get(timingKey(intent.entityId, 'remove')),
      phase.start + index * MotionTokens.stagger,
      fallbackDuration,
      MotionTokens.easing.exit,
      intent.entityId,
      'remove',
    );
    const timingFunction = resolveTimingFunction(timing.easing);
    const exitAnimation = intent.exit;

    intent.elementIds.forEach((elementId, elementIndex) => {
      const elementState = state.elements.get(elementId);
      if (!elementState) {
        return;
      }

      const localDelay = timing.delay + elementIndex * (MotionTokens.stagger / 2);
      maxEnd = Math.max(maxEnd, localDelay + timing.duration);

      const thread = createDelayedThread(
        localDelay,
        (function* removalThread() {
          if (exitAnimation) {
            yield* runElementAnimationTimed(elementState.node, exitAnimation, {
              duration: timing.duration,
              timingFunction,
            });
          } else if (entryStyle === 'draw_in') {
            yield* runDrawOutExit(elementState.node, timing.duration, timingFunction);
          } else {
            yield* elementState.node.opacity(0, timing.duration, timingFunction);
          }

          if (intent.cleanup) {
            elementState.node.remove();
            state.elements.delete(elementId);
          }
        })(),
      );

      threads.push(thread);
    });
  });

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const executeMovesPhase = (
  intents: ElementAnimationIntent[],
  sceneDuration: number,
  lifecycleById: Map<string, LifecycleResult>,
  entityTimingByKey: Map<string, EntityTimingPlan>,
): PhaseExecutionPlan => {
  const phase = getScenePhases(sceneDuration).move;
  const fallbackDuration = Math.max(0.2, phase.end - phase.start);
  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;

  intents.forEach((intent, index) => {
    const timing = withFallbackEntityTiming(
      entityTimingByKey.get(timingKey(intent.entityId, 'move')),
      phase.start + index * MotionTokens.stagger,
      fallbackDuration,
      MotionTokens.easing.standard,
      intent.entityId,
      'move',
    );
    const timingFunction = resolveTimingFunction(timing.easing);

    intent.elementIds.forEach((elementId, elementIndex) => {
      const lifecycle = lifecycleById.get(elementId);
      if (!lifecycle || !lifecycle.hasPositionChange) {
        return;
      }

      const localDelay = timing.delay + elementIndex * (MotionTokens.stagger / 2);
      maxEnd = Math.max(maxEnd, localDelay + timing.duration);

      const thread = createDelayedThread(
        localDelay,
        (function* moveThread() {
          yield* all(
            lifecycle.node.x(lifecycle.targetPosition.x, timing.duration, timingFunction),
            lifecycle.node.y(lifecycle.targetPosition.y, timing.duration, timingFunction),
          );

          if (intent.effects && intent.effects.length > 0) {
            yield* runTimedEffects(lifecycle.node, intent.effects, timing.duration * 0.4, timing.easing);
          }
        })(),
      );

      threads.push(thread);
    });
  });

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const runElasticPopEntry = (
  node: Node,
  duration: number,
  timingFunction: TimingFunction,
  scaleTarget = 1,
): ThreadGenerator =>
  (function* elasticPopEntryThread() {
    const phaseOneDuration = Math.max(0.08, duration * 0.62);
    const phaseTwoDuration = Math.max(0.06, duration - phaseOneDuration);
    const initialScale = Math.max(0.05, scaleTarget * 0.05);

    node.scale(initialScale);
    node.opacity(Math.min(node.opacity(), 0.06));

    yield* all(
      node.scale(scaleTarget * 1.1, phaseOneDuration, easeOutBack),
      node.opacity(1, Math.max(0.08, phaseOneDuration * 0.75), timingFunction),
    );

    yield* node.scale(scaleTarget, phaseTwoDuration, timingFunction);
  })();

interface DrawNodeCollection {
  curves: Array<Rect | Circle | Line>;
  icons: Icon[];
  labels: Txt[];
}

const collectDrawNodes = (root: Node): DrawNodeCollection => {
  const collection: DrawNodeCollection = {
    curves: [],
    icons: [],
    labels: [],
  };

  const visit = (node: Node): void => {
    if (node instanceof Icon) {
      collection.icons.push(node);
    } else if (node instanceof Rect || node instanceof Circle || node instanceof Line) {
      collection.curves.push(node);
    }

    if (node instanceof Txt) {
      collection.labels.push(node);
    }

    for (const child of node.children()) {
      visit(child);
    }
  };

  visit(root);
  return collection;
};

const resolveIconSize = (icon: Icon): number => {
  const width = icon.width();
  if (typeof width === 'number' && Number.isFinite(width)) {
    return Math.abs(width);
  }

  const height = icon.height();
  if (typeof height === 'number' && Number.isFinite(height)) {
    return Math.abs(height);
  }

  return 84;
};

const runDrawInEntry = (
  node: Node,
  duration: number,
  timingFunction: TimingFunction,
  scaleTarget = 1,
): ThreadGenerator =>
  (function* drawInEntryThread() {
    const strokeDuration = Math.max(0.1, duration * 0.68);
    const settleDuration = Math.max(0.08, duration - strokeDuration);
    const drawNodes = collectDrawNodes(node);

    if (
      drawNodes.curves.length === 0 &&
      drawNodes.icons.length === 0 &&
      drawNodes.labels.length === 0
    ) {
      yield* runElasticPopEntry(node, duration, timingFunction, scaleTarget);
      return;
    }

    const fillByCurve = new Map<Rect | Circle, string>();
    const lineWidthByCurve = new Map<Rect | Circle | Line, number>();
    const iconTraces: Line[] = [];

    for (const curve of drawNodes.curves) {
      const baseWidth = Math.max(1, curve.lineWidth());
      lineWidthByCurve.set(curve, baseWidth);
      curve.start(0);
      curve.end(0);
      curve.lineWidth(Math.max(0.8, baseWidth * 0.62));
      curve.opacity(1);

      if (curve instanceof Rect || curve instanceof Circle) {
        const currentFill = curve.fill();
        fillByCurve.set(curve, currentFill == null ? '#00000000' : String(currentFill));
        curve.fill('#00000000');
      }
    }

    for (const icon of drawNodes.icons) {
      const iconSize = resolveIconSize(icon);
      const trace = new Line({
        points: [
          [-iconSize * 0.46, iconSize * 0.22],
          [-iconSize * 0.08, -iconSize * 0.06],
          [iconSize * 0.44, -iconSize * 0.4],
        ],
        stroke: '#E8F6FF',
        lineWidth: Math.max(1.3, iconSize * 0.032),
        lineCap: 'round',
        lineJoin: 'round',
        opacity: 0.9,
      });
      trace.end(0);
      icon.add(trace);
      iconTraces.push(trace);

      icon.opacity(0);
      icon.scale(0.78);
    }

    for (const label of drawNodes.labels) {
      label.opacity(0);
    }

    node.opacity(1);
    node.scale(Math.max(0.78, scaleTarget * 0.92));

    const drawThreads: ThreadGenerator[] = [];
    for (const curve of drawNodes.curves) {
      const baseWidth = lineWidthByCurve.get(curve) ?? Math.max(1, curve.lineWidth());
      drawThreads.push(
        all(
          curve.end(1, strokeDuration, linear),
          curve.lineWidth(baseWidth, strokeDuration, timingFunction),
        ),
      );
    }
    for (const icon of drawNodes.icons) {
      drawThreads.push(
        all(
          icon.opacity(0.94, Math.max(0.08, strokeDuration * 0.7), timingFunction),
          icon.scale(1, Math.max(0.08, strokeDuration * 0.7), easeOutCubic),
        ),
      );
    }
    for (const trace of iconTraces) {
      drawThreads.push(
        all(
          trace.end(1, Math.max(0.08, strokeDuration * 0.6), linear),
          trace.opacity(0, Math.max(0.08, strokeDuration * 0.62), easeOutCubic),
        ),
      );
    }

    yield* all(...drawThreads, node.scale(scaleTarget, strokeDuration, timingFunction));

    const settleThreads: ThreadGenerator[] = [];
    for (const [shape, fill] of fillByCurve.entries()) {
      settleThreads.push(shape.fill(fill, settleDuration, timingFunction));
    }
    for (const label of drawNodes.labels) {
      settleThreads.push(label.opacity(1, settleDuration, timingFunction));
    }
    for (const icon of drawNodes.icons) {
      settleThreads.push(icon.opacity(1, Math.max(0.05, settleDuration * 0.8), timingFunction));
    }

    if (settleThreads.length > 0) {
      yield* all(...settleThreads);
    }

    for (const trace of iconTraces) {
      trace.remove();
    }
  })();

const runDrawOutExit = (
  node: Node,
  duration: number,
  timingFunction: TimingFunction,
): ThreadGenerator =>
  (function* drawOutExitThread() {
    const drawNodes = collectDrawNodes(node);
    if (
      drawNodes.curves.length === 0 &&
      drawNodes.icons.length === 0 &&
      drawNodes.labels.length === 0
    ) {
      yield* node.opacity(0, duration, timingFunction);
      return;
    }

    const vanishDuration = Math.max(0.08, duration * 0.46);
    const traceDuration = Math.max(0.1, duration - vanishDuration);
    const threads: ThreadGenerator[] = [];

    for (const label of drawNodes.labels) {
      threads.push(label.opacity(0, vanishDuration, timingFunction));
    }
    for (const icon of drawNodes.icons) {
      threads.push(
        all(
          icon.opacity(0, vanishDuration, timingFunction),
          icon.scale(0.78, vanishDuration, easeInOutCubic),
        ),
      );
    }
    for (const curve of drawNodes.curves) {
      threads.push(curve.start(1, traceDuration, linear));
    }

    yield* all(
      ...threads,
      node.scale(0.86, duration, timingFunction),
      node.opacity(0, duration, timingFunction),
    );
  })();

const executeAdditionsPhase = (
  intents: ElementAnimationIntent[],
  sceneDuration: number,
  lifecycleById: Map<string, LifecycleResult>,
  sceneElementById: Map<string, MotionElementSpec>,
  entityTimingByKey: Map<string, EntityTimingPlan>,
  entryStyle: 'drop_bounce' | 'elastic_pop' | 'draw_in',
): PhaseExecutionPlan => {
  const phase = getScenePhases(sceneDuration).enter;
  const fallbackDuration = Math.max(DEFAULT_ENTRY_FADE_DURATION, phase.end - phase.start);
  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;

  intents.forEach((intent, index) => {
    const timing = withFallbackEntityTiming(
      entityTimingByKey.get(timingKey(intent.entityId, 'add')),
      phase.start + index * Math.max(0.05, MotionTokens.stagger),
      fallbackDuration,
      MotionTokens.easing.enter,
      intent.entityId,
      'add',
    );
    const timingFunction = resolveTimingFunction(timing.easing);

    intent.elementIds.forEach((elementId, elementIndex) => {
      const lifecycle = lifecycleById.get(elementId);
      if (!lifecycle) {
        return;
      }

      const elementSpec = sceneElementById.get(elementId);
      const localDelay = timing.delay + elementIndex * (MotionTokens.stagger / 2);
      maxEnd = Math.max(maxEnd, localDelay + timing.duration);

      const thread = createDelayedThread(
        localDelay,
        (function* additionThread() {
          const entryAnimation = intent.enter ?? elementSpec?.enter;
          const directiveControlsEntry =
            lifecycle.isNew &&
            (entryAnimation === undefined || entryAnimation === AnimationType.ZoomIn);

          if (directiveControlsEntry) {
            if (entryStyle === 'drop_bounce') {
              yield* runElementAnimationTimed(lifecycle.node, AnimationType.ZoomIn, {
                duration: timing.duration,
                timingFunction,
                scaleTarget: timing.scale,
              });
            } else if (entryStyle === 'draw_in') {
              yield* runDrawInEntry(
                lifecycle.node,
                timing.duration,
                timingFunction,
                timing.scale ?? 1,
              );
            } else {
              yield* runElasticPopEntry(
                lifecycle.node,
                timing.duration,
                timingFunction,
                timing.scale ?? 1,
              );
            }
          } else if (entryAnimation) {
            yield* runElementAnimationTimed(lifecycle.node, entryAnimation, {
              duration: timing.duration,
              timingFunction,
              scaleTarget: timing.scale,
            });
          } else if (lifecycle.isNew) {
            yield* applyFadeIn(lifecycle.node);
          }

          const mergedEffects = [...(intent.effects ?? []), ...(elementSpec?.effects ?? [])];
          const dedupedEffects = [...new Set(mergedEffects)];
          if (dedupedEffects.length > 0) {
            yield* runTimedEffects(lifecycle.node, dedupedEffects, timing.duration * 0.7, timing.easing);
          }
        })(),
      );

      threads.push(thread);
    });
  });

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const fallbackConnectionTiming = (
  sceneDuration: number,
  index: number,
): ConnectionTimingPlan => {
  const phase = getScenePhases(sceneDuration).connect;
  return {
    connectionId: `fallback_${index}`,
    delay: phase.start + index * MotionTokens.stagger,
    duration: Math.max(0.15, phase.end - phase.start),
    easing: MotionTokens.easing.enter,
  };
};

const executeConnectionLineTransitions = (
  scene: MotionSceneSpec,
  sceneDuration: number,
  state: SceneState,
  connectionTimingById: Map<string, ConnectionTimingPlan>,
): PhaseExecutionPlan => {
  const connectionDiffs = scene.diff?.connectionDiffs ?? [];
  if (connectionDiffs.length === 0) {
    return {duration: 0};
  }

  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;
  const connectionById = new Map(
    (scene.connections ?? scene.source?.connections ?? []).map((connection) => [
      connection.id,
      connection,
    ]),
  );
  const additionTimings = (scene.animationPlan?.entities ?? []).filter(
    (timing) => timing.action === 'add',
  );
  const additionRevealByEntityId = new Map(
    additionTimings.map((timing) => [timing.entityId, timing.delay + timing.duration * 0.68]),
  );
  const moveTimings = (scene.animationPlan?.entities ?? []).filter(
    (timing) => timing.action === 'move',
  );
  const moveSettleByEntityId = new Map(
    moveTimings.map((timing) => [timing.entityId, timing.delay + timing.duration * 0.6]),
  );
  const resolveEntityRevealTime = (entityId: string): number =>
    Math.max(additionRevealByEntityId.get(entityId) ?? 0, moveSettleByEntityId.get(entityId) ?? 0);

  connectionDiffs.forEach((diff, index) => {
    const line = state.connections.get(diff.connectionId);
    if (!line) {
      return;
    }

    const timing = connectionTimingById.get(diff.connectionId) ?? fallbackConnectionTiming(sceneDuration, index);
    const timingFunction = resolveTimingFunction(timing.easing);
    const connection = connectionById.get(diff.connectionId);
    const endpointRevealTime = connection
      ? Math.max(resolveEntityRevealTime(connection.from), resolveEntityRevealTime(connection.to))
      : 0;

    if (diff.type === 'connection_added') {
      const drawDelay = Math.max(timing.delay, endpointRevealTime + 0.04);
      maxEnd = Math.max(maxEnd, drawDelay + timing.duration);
      line.start(0);
      line.end(0);
      line.opacity(0.92);
      threads.push(
        createDelayedThread(
          drawDelay,
          (function* connectionAddedThread() {
            yield* all(
              line.end(1, timing.duration, linear),
              line.opacity(0.9, Math.max(0.08, timing.duration * 0.7), timingFunction),
            );
          })(),
        ),
      );
      return;
    }

    maxEnd = Math.max(maxEnd, timing.delay + timing.duration);
    threads.push(
      createDelayedThread(
        timing.delay,
        (function* connectionRemovedThread() {
          yield* all(
            line.start(1, timing.duration, linear),
            line.opacity(0, timing.duration, timingFunction),
          );
          line.remove();
          state.connections.delete(diff.connectionId);
        })(),
      ),
    );
  });

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const executeEffectsPhase = (
  intents: ElementAnimationIntent[],
  phaseType: 'connections' | 'interactions',
  sceneDuration: number,
  lifecycleById: Map<string, LifecycleResult>,
  state: SceneState,
  connectionTimingById: Map<string, ConnectionTimingPlan>,
  scene: MotionSceneSpec,
): PhaseExecutionPlan => {
  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;
  const connectionById = new Map(
    (scene.connections ?? scene.source?.connections ?? []).map((connection) => [
      connection.id,
      connection,
    ]),
  );
  const interactionById = new Map(
    (scene.interactions ?? scene.source?.interactions ?? []).map((interaction) => [
      interaction.id,
      interaction,
    ]),
  );

  intents.forEach((intent, index) => {
    const connectionTiming = intent.connectionId
      ? connectionTimingById.get(intent.connectionId)
      : undefined;
    const timing =
      phaseType === 'connections'
        ? connectionTiming ?? fallbackConnectionTiming(sceneDuration, index)
        : fallbackConnectionTiming(sceneDuration, index);
    const timingFunction = resolveTimingFunction(timing.easing);
    const connectionStyle =
      phaseType === 'connections' && intent.connectionId
        ? resolveConnectionStyle(connectionById.get(intent.connectionId) ?? {
            id: intent.connectionId,
            from: intent.entityId,
            to: intent.entityId,
          }, scene.directives?.visual)
        : undefined;
    const flowStyle =
      phaseType === 'interactions' && intent.interactionId
        ? resolveFlowStyle(interactionById.get(intent.interactionId) ?? {
            id: intent.interactionId,
            from: intent.entityId,
            to: intent.entityId,
            type: 'flow',
          }, scene.directives?.visual)
        : undefined;

    const effects = intent.effects ?? [];
    if (effects.length === 0) {
      return;
    }

    intent.elementIds.forEach((elementId, elementIndex) => {
      const lifecycle = lifecycleById.get(elementId);
      const node = lifecycle?.node ?? state.elements.get(elementId)?.node;

      if (!node) {
        return;
      }

      const localDelay = timing.delay + elementIndex * (MotionTokens.stagger / 2);
      maxEnd = Math.max(maxEnd, localDelay + timing.duration);

      const thread = createDelayedThread(
        localDelay,
        (function* effectThread() {
          const speedFactor = flowStyle?.speed ?? 1;
          const lineFactor = connectionStyle ? Math.max(1, connectionStyle.width / 3) : 1;
          const perEffectDuration = Math.max(
            0.1,
            (timing.duration * lineFactor) / effects.length / speedFactor,
          );

          if (flowStyle) {
            const targetBlur = flowStyle.particleSize * 1.4;
            yield* all(
              node.shadowColor(flowStyle.color, Math.min(0.15, perEffectDuration), timingFunction),
              node.shadowBlur(targetBlur, Math.min(0.15, perEffectDuration), timingFunction),
            );
          }

          for (const effect of effects) {
            yield* runElementAnimationTimed(node, effect, {
              duration: perEffectDuration,
              timingFunction,
            });
          }

          if (flowStyle) {
            yield* all(
              node.shadowColor(
                StyleTokens.colors.background,
                Math.min(0.15, perEffectDuration),
                timingFunction,
              ),
              node.shadowBlur(0, Math.min(0.15, perEffectDuration), timingFunction),
            );
          }
        })(),
      );

      threads.push(thread);
    });
  });

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const executeInteractionFlowsPhase = (
  view: Node,
  scene: MotionSceneSpec,
  sceneDuration: number,
  state: SceneState,
  connectionTimingById: Map<string, ConnectionTimingPlan>,
  entityAnchorsById: Map<string, ConnectionAnchor>,
): PhaseExecutionPlan => {
  const connections = scene.connections ?? scene.source?.connections ?? [];
  if (connections.length === 0) {
    return {duration: 0};
  }

  const connectionById = new Map(connections.map((connection) => [connection.id, connection]));
  const interactions = scene.interactions ?? scene.source?.interactions ?? [];
  const directionalConnectionIds = new Map<string, string>();
  const undirectedConnectionIds = new Map<string, string>();
  const toUndirectedKey = (from: string, to: string): string =>
    [from, to].sort((left, right) => left.localeCompare(right)).join('<->');

  for (const connection of connectionById.values()) {
    directionalConnectionIds.set(`${connection.from}->${connection.to}`, connection.id);
    undirectedConnectionIds.set(toUndirectedKey(connection.from, connection.to), connection.id);
    if (connection.direction === 'bidirectional') {
      directionalConnectionIds.set(`${connection.to}->${connection.from}`, connection.id);
    }
  }

  const flowTargets = new Map<
    string,
    {
      directionMultiplier: number;
      flowStyle: ReturnType<typeof resolveFlowStyle>;
      interactionType: 'flow' | 'burst' | 'broadcast' | 'ping' | 'blocked';
      interactionIntensity: 'low' | 'medium' | 'high';
    }
  >();

  for (const interaction of interactions) {
    const connectionId =
      directionalConnectionIds.get(`${interaction.from}->${interaction.to}`) ??
      undirectedConnectionIds.get(toUndirectedKey(interaction.from, interaction.to));
    if (!connectionId) {
      continue;
    }

    const connection = connectionById.get(connectionId);
    if (!connection) {
      continue;
    }

    const existingTarget = flowTargets.get(connectionId);
    const resolvedStyle = resolveFlowStyle(interaction, scene.directives?.visual);
    let directionMultiplier = -1;
    if (interaction.from === connection.to && interaction.to === connection.from) {
      directionMultiplier = 1;
    }

    if (!existingTarget) {
      flowTargets.set(connectionId, {
        directionMultiplier,
        flowStyle: resolvedStyle,
        interactionType: interaction.type,
        interactionIntensity: interaction.intensity ?? 'medium',
      });
      continue;
    }

    if (connection.direction === 'bidirectional') {
      flowTargets.set(connectionId, {
        directionMultiplier: 1,
        flowStyle: resolvedStyle,
        interactionType: interaction.type,
        interactionIntensity: interaction.intensity ?? existingTarget.interactionIntensity,
      });
    }
  }

  for (const connection of connectionById.values()) {
    if (flowTargets.has(connection.id)) {
      continue;
    }
    const line = state.connections.get(connection.id);
    if (!line) {
      continue;
    }
    line.lineDash(resolveLineDashPattern(connection.style));
    line.lineDashOffset(0);
  }

  if (flowTargets.size === 0) {
    return {duration: 0};
  }

  const additionTimings = (scene.animationPlan?.entities ?? []).filter(
    (timing) => timing.action === 'add',
  );
  const additionRevealByEntityId = new Map(
    additionTimings.map((timing) => [timing.entityId, timing.delay + timing.duration * 0.68]),
  );
  const moveTimings = (scene.animationPlan?.entities ?? []).filter(
    (timing) => timing.action === 'move',
  );
  const moveSettleByEntityId = new Map(
    moveTimings.map((timing) => [timing.entityId, timing.delay + timing.duration * 0.6]),
  );
  const resolveEntityRevealTime = (entityId: string): number =>
    Math.max(additionRevealByEntityId.get(entityId) ?? 0, moveSettleByEntityId.get(entityId) ?? 0);

  const streamEndPadding = Math.min(0.02, sceneDuration * 0.015);
  const addedConnectionDiffs = (scene.diff?.connectionDiffs ?? []).filter(
    (diff) => diff.type === 'connection_added',
  );
  const addedConnectionIndexById = new Map(
    addedConnectionDiffs.map((diff, index) => [diff.connectionId, index]),
  );

  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;
  const flowRenderer = scene.directives?.flow.renderer ?? 'hybrid';
  const entryStyle = scene.directives?.motion.entry_style ?? 'draw_in';
  const sceneHasTrafficSpike = sceneIndicatesTrafficSpike(scene);
  const entityTypeById = buildEntityTypeById(scene);
  const entityStatusById = buildEntityStatusById(scene);
  const stressedStatuses = new Set(['overloaded', 'error']);
  const isIngressConnection = (connection: {from: string; to: string}): boolean => {
    const fromType = entityTypeById.get(connection.from);
    const toType = entityTypeById.get(connection.to);
    const fromIsActor = fromType ? ACTOR_COMPONENT_TYPES.has(fromType) : false;
    const toIsActor = toType ? ACTOR_COMPONENT_TYPES.has(toType) : false;
    return fromIsActor && !toIsActor;
  };
  const isStressedTargetConnection = (connection: {to: string}): boolean =>
    stressedStatuses.has(entityStatusById.get(connection.to) ?? '');

  // Fallback: if topology marks a target overloaded/error but didn't explicitly declare
  // burst/high interaction, still animate ingress as a visual traffic surge.
  for (const connection of connectionById.values()) {
    if (flowTargets.has(connection.id)) {
      continue;
    }
    if (!isIngressConnection(connection) || !isStressedTargetConnection(connection)) {
      continue;
    }

    const fallbackInteraction = {
      id: `i_${connection.id}_stress_fallback`,
      from: connection.from,
      to: connection.to,
      type: 'burst' as const,
      intensity: 'high' as const,
    };
    flowTargets.set(connection.id, {
      directionMultiplier: -1,
      flowStyle: resolveFlowStyle(fallbackInteraction, scene.directives?.visual),
      interactionType: 'burst',
      interactionIntensity: 'high',
    });
  }

  const resolveConnectionVisibleTime = (connectionId: string): number => {
    const diffIndex = addedConnectionIndexById.get(connectionId);
    if (diffIndex === undefined) {
      return 0;
    }

    const timing =
      connectionTimingById.get(connectionId) ?? fallbackConnectionTiming(sceneDuration, diffIndex);
    const connection = connectionById.get(connectionId);
    const fromReveal = connection ? resolveEntityRevealTime(connection.from) : 0;
    const toReveal = connection ? resolveEntityRevealTime(connection.to) : 0;

    const connectionReveal =
      entryStyle === 'draw_in'
        ? Math.max(
            timing.delay + Math.max(0.06, timing.duration * 0.88),
            fromReveal + 0.04,
            toReveal + 0.04,
          )
        : Math.max(
            timing.delay + Math.max(0.03, timing.duration * 0.2),
            fromReveal + 0.04,
            toReveal + 0.04,
          );

    return Math.max(connectionReveal, fromReveal, toReveal);
  };

  [...flowTargets.entries()].forEach(([connectionId, target], index) => {
    const connection = connectionById.get(connectionId);
    const line = state.connections.get(connectionId);
    if (!connection || !line) {
      return;
    }

    const flowStyle = target.flowStyle;
    const flowMode = target.interactionType;
    const interactionIntensity = target.interactionIntensity;
    const stressedTargetConnection = isIngressConnection(connection) && isStressedTargetConnection(connection);
    const flowSpeedBoost =
      flowMode === 'burst'
        ? 1.25
        : flowMode === 'broadcast'
          ? 1.08
          : flowMode === 'ping'
            ? 1.35
            : flowMode === 'blocked'
              ? 0.86
              : 1;
    const surgeEnabled =
      (sceneHasTrafficSpike || stressedTargetConnection) &&
      flowMode !== 'blocked' &&
      (flowMode === 'burst' || isIngressConnection(connection));
    const flowSpeed = Math.max(
      0.45,
      flowStyle.speed * flowSpeedBoost * (surgeEnabled ? 1.18 : 1),
    );
    const dashLength =
      flowRenderer === 'packets'
        ? 3
        : flowRenderer === 'dashed'
          ? 18
          : flowMode === 'blocked'
            ? 9
            : flowMode === 'broadcast'
              ? 12
              : connection.direction === 'bidirectional'
                ? 10
                : 14;
    const gapLength =
      flowRenderer === 'packets'
        ? 14
        : flowRenderer === 'dashed'
          ? 9
          : flowMode === 'blocked'
            ? 12
            : flowMode === 'burst'
              ? 7
              : connection.direction === 'bidirectional'
                ? 8
                : 10;
    const dashPattern = [dashLength, gapLength] as [number, number];
    line.lineDash(dashPattern);
    line.lineDashOffset(0);

    const connectionVisibleTime = resolveConnectionVisibleTime(connectionId);
    const baseDelay = Math.min(0.1, sceneDuration * 0.04) + index * 0.006;
    const delay = Math.max(baseDelay, connectionVisibleTime + 0.008);
    const streamDuration = Math.max(0.24, sceneDuration - delay - streamEndPadding);
    const introDuration = Math.min(0.08, streamDuration * 0.12);
    const activeDuration = Math.max(0.14, streamDuration - introDuration);
    maxEnd = Math.max(maxEnd, delay + introDuration + activeDuration);

    const baseStroke = line.stroke();
    const baseWidth = line.lineWidth();
    const needsBurstTrafficLanes =
      (flowMode === 'burst' ||
        interactionIntensity === 'high' ||
        stressedTargetConnection) &&
      isIngressConnection(connection);
    const fromAnchor = entityAnchorsById.get(connection.from);
    const toAnchor = entityAnchorsById.get(connection.to);
    const overlayLanes = needsBurstTrafficLanes
      ? createBurstTrafficOverlayLanes(view, line, fromAnchor, toAnchor)
      : [];
    const laneLines = [line, ...overlayLanes];
    const overlayWidth = Math.max(1.5, baseWidth * 0.74);
    const overlayOpacity = 0.82;
    const linePulseWidth =
      baseWidth +
      (flowMode === 'burst'
        ? Math.max(1.4, flowStyle.particleSize * 0.28)
        : Math.max(0.8, flowStyle.particleSize * 0.18));
    const dashTravel = Math.max(90, Math.min(680, activeDuration * 260 * flowSpeed));
    const timingFunction = resolveTimingFunction(MotionTokens.easing.enter);

    const thread = createDelayedThread(
      delay,
      (function* interactionFlowThread() {
        for (const lane of laneLines) {
          lane.lineDash(dashPattern);
          lane.lineDashOffset(0);
        }

        try {
          yield* all(
            ...laneLines.flatMap((lane, laneIndex) => {
              const laneTargetWidth = laneIndex === 0 ? linePulseWidth : overlayWidth;
              const laneTargetOpacity = laneIndex === 0 ? 1 : overlayOpacity;
              return [
                lane.stroke(flowStyle.color, introDuration, timingFunction),
                lane.lineWidth(laneTargetWidth, introDuration, timingFunction),
                lane.opacity(laneTargetOpacity, introDuration, timingFunction),
              ];
            }),
          );

          const canRunSurgeRamp =
            surgeEnabled &&
            activeDuration >= 0.28 &&
            connection.direction !== 'bidirectional' &&
            flowMode !== 'ping';

          if (canRunSurgeRamp) {
            const stageOneDuration = activeDuration * 0.28;
            const stageTwoDuration = activeDuration * 0.33;
            const stageThreeDuration = Math.max(
              0.06,
              activeDuration - stageOneDuration - stageTwoDuration,
            );
            const surgePatterns: Array<[number, number]> = [
              dashPattern,
              [
                Math.max(3, Math.round(dashLength * 0.74)),
                Math.max(2, Math.round(gapLength * 0.64)),
              ],
              [
                Math.max(2, Math.round(dashLength * 0.56)),
                Math.max(2, Math.round(gapLength * 0.46)),
              ],
            ];
            const surgeDurations = [stageOneDuration, stageTwoDuration, stageThreeDuration];
            const surgeDistances = [dashTravel * 0.2, dashTravel * 0.33, dashTravel * 0.47];
            const surgeWidths = [
              linePulseWidth,
              linePulseWidth + Math.max(0.4, flowStyle.particleSize * 0.08),
              linePulseWidth + Math.max(0.9, flowStyle.particleSize * 0.16),
            ];

            let accumulatedOffset = 0;
            for (let stageIndex = 0; stageIndex < surgeDurations.length; stageIndex += 1) {
              const stageDuration = surgeDurations[stageIndex];
              const stagePattern = surgePatterns[stageIndex] ?? dashPattern;
              const stageDistance = surgeDistances[stageIndex] ?? dashTravel / 3;
              const stageWidth = surgeWidths[stageIndex] ?? linePulseWidth;

              for (const lane of laneLines) {
                lane.lineDash(stagePattern);
              }
              yield* all(
                ...laneLines.map((lane, laneIndex) =>
                  lane.lineWidth(
                    laneIndex === 0 ? stageWidth : overlayWidth,
                    Math.min(0.06, stageDuration * 0.35),
                    timingFunction,
                  )),
              );
              accumulatedOffset += target.directionMultiplier * stageDistance;
              yield* all(
                ...laneLines.map((lane, laneIndex) =>
                  lane.lineDashOffset(
                    accumulatedOffset + laneIndex * target.directionMultiplier * 8,
                    stageDuration,
                    linear,
                  )),
              );
            }
          } else if (flowMode === 'ping') {
            const pingHalf = Math.max(0.08, activeDuration / 2);
            yield* all(
              ...laneLines.map((lane, laneIndex) =>
                lane
                  .lineDashOffset(-dashTravel - laneIndex * 6, pingHalf, linear)
                  .to(laneIndex * 4, pingHalf, linear)),
            );
          } else if (flowMode === 'blocked') {
            const pulseCount = Math.max(2, Math.round(activeDuration / 0.24));
            const pulseDuration = activeDuration / pulseCount;
            const blockedTravel = target.directionMultiplier * Math.max(30, dashTravel * 0.36);

            for (let pulseIndex = 0; pulseIndex < pulseCount; pulseIndex += 1) {
              const forwardDuration = pulseDuration * 0.58;
              const returnDuration = Math.max(0.05, pulseDuration - forwardDuration);
              yield* all(
                ...laneLines.map((lane, laneIndex) =>
                  lane
                    .lineDashOffset(
                      blockedTravel + laneIndex * target.directionMultiplier * 6,
                      forwardDuration,
                      linear,
                    )
                    .to(laneIndex * 3, returnDuration, linear)),
              );
            }
          } else if (connection.direction === 'bidirectional') {
            const swingAmplitude = Math.max(42, dashTravel * 0.2);
            const cycleDuration = Math.max(0.14, 0.3 / flowSpeed);
            let elapsed = 0;
            let sign = -1;

            while (elapsed + cycleDuration <= activeDuration) {
              const halfCycle = cycleDuration / 2;
              yield* all(
                ...laneLines.map((lane, laneIndex) =>
                  lane
                    .lineDashOffset(sign * swingAmplitude + laneIndex * 4, halfCycle, linear)
                    .to(-sign * swingAmplitude + laneIndex * 4, halfCycle, linear)),
              );
              elapsed += cycleDuration;
              sign *= -1;
            }

            const remaining = activeDuration - elapsed;
            if (remaining > 0.01) {
              yield* all(
                ...laneLines.map((lane, laneIndex) =>
                  lane.lineDashOffset(swingAmplitude * sign + laneIndex * 4, remaining, linear)),
              );
            }
          } else {
            yield* all(
              ...laneLines.map((lane, laneIndex) =>
                lane.lineDashOffset(
                  target.directionMultiplier * dashTravel + laneIndex * target.directionMultiplier * 6,
                  activeDuration,
                  linear,
                )),
            );
          }

          yield* all(
            ...laneLines.flatMap((lane, laneIndex) => [
              lane.stroke(baseStroke, Math.min(0.06, activeDuration * 0.15), timingFunction),
              lane.lineWidth(
                laneIndex === 0 ? baseWidth : overlayWidth,
                Math.min(0.06, activeDuration * 0.15),
                timingFunction,
              ),
              lane.opacity(
                laneIndex === 0 ? 0.9 : 0.72,
                Math.min(0.06, activeDuration * 0.15),
                timingFunction,
              ),
            ]),
          );
        } finally {
          for (const overlayLane of overlayLanes) {
            overlayLane.remove();
          }
        }
      })(),
    );

    threads.push(thread);
  });

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const executeLegacyScene = (
  scene: MotionSceneSpec,
  lifecycleResults: LifecycleResult[],
  sceneState: SceneState,
): PhaseExecutionPlan => {
  const elementPlans = scene.elements.map((element, index) => {
    const lifecycleResult = lifecycleResults[index];
    if (!lifecycleResult) {
      throw new Error(`Missing lifecycle result for element ${element.id}`);
    }

    const shouldSkipElement =
      !lifecycleResult.isNew &&
      !lifecycleResult.hasPositionChange &&
      !hasExplicitElementMotion(element);

    if (shouldSkipElement) {
      lifecycleResult.elementState.unchangedStreak += 1;

      if (lifecycleResult.elementState.unchangedStreak > 3) {
        sceneState.logger.warn('Element repetition detected', {
          scene: scene.id,
          elementId: element.id,
          consecutiveScenes: lifecycleResult.elementState.unchangedStreak,
        });
      }

      return undefined;
    }

    lifecycleResult.elementState.unchangedStreak = 0;

    const thread = (function* legacyElementThread() {
      if (lifecycleResult.repositionThread) {
        yield* lifecycleResult.repositionThread;
      }

      if (element.enter) {
        yield* runElementAnimation(lifecycleResult.node, element.enter);
      } else if (lifecycleResult.isNew) {
        yield* applyFadeIn(lifecycleResult.node);
      }

      for (const effect of element.effects ?? []) {
        yield* runElementAnimation(lifecycleResult.node, effect);
      }

      if (element.exit) {
        yield* runElementAnimation(lifecycleResult.node, element.exit);
      }
    })();

    const duration =
      (element.enter
        ? getAnimationDuration(element.enter)
        : lifecycleResult.isNew
          ? DEFAULT_ENTRY_FADE_DURATION
          : 0) +
      (element.effects ?? []).reduce((total, effect) => total + getAnimationDuration(effect), 0) +
      (element.exit ? getAnimationDuration(element.exit) : 0) +
      lifecycleResult.repositionDuration;

    return {
      thread,
      duration,
    };
  });

  const activeElementPlans = elementPlans.filter(
    (plan): plan is NonNullable<typeof plan> => Boolean(plan),
  );

  const duration = activeElementPlans.reduce(
    (maxDuration, plan) => Math.max(maxDuration, plan.duration),
    0,
  );

  return {
    thread:
      activeElementPlans.length > 0
        ? all(...activeElementPlans.map((plan) => plan.thread))
        : undefined,
    duration,
  };
};

const executePlanDrivenScene = (
  view: Node,
  scene: MotionSceneSpec,
  lifecycleResults: LifecycleResult[],
  sceneState: SceneState,
  sceneDuration: number,
): PhaseExecutionPlan => {
  const lifecycleById = toLifecycleMap(lifecycleResults);
  const sceneElementById = toElementSpecMap(scene.elements);
  const entityAnchorsById = collectEntityAnchors(lifecycleResults, sceneElementById);

  const entityTimingByKey = new Map<string, EntityTimingPlan>(
    (scene.animationPlan?.entities ?? []).map((timing) => [
      timingKey(timing.entityId, timing.action),
      timing,
    ]),
  );

  const connectionTimingById = new Map<string, ConnectionTimingPlan>(
    (scene.animationPlan?.connections ?? []).map((timing) => [timing.connectionId, timing]),
  );

  const phasePlans: PhaseExecutionPlan[] = [];

  for (const phase of scene.plan?.phaseOrder ?? []) {
    if (phase === 'camera') {
      continue;
    }

    const intents = getIntentBucket(scene, phase);

    let phasePlan: PhaseExecutionPlan;
    switch (phase) {
      case 'removals':
        phasePlan = executeRemovalsPhase(
          intents,
          sceneDuration,
          sceneState,
          entityTimingByKey,
          scene.directives?.motion.entry_style ?? 'draw_in',
        );
        break;
      case 'moves':
        phasePlan = executeMovesPhase(
          intents,
          sceneDuration,
          lifecycleById,
          entityTimingByKey,
        );
        break;
      case 'additions':
        phasePlan = executeAdditionsPhase(
          intents,
          sceneDuration,
          lifecycleById,
          sceneElementById,
          entityTimingByKey,
          scene.directives?.motion.entry_style ?? 'draw_in',
        );
        break;
      case 'connections':
        {
          const connectionTransitions = executeConnectionLineTransitions(
            scene,
            sceneDuration,
            sceneState,
            connectionTimingById,
          );
          const connectionEffects = executeEffectsPhase(
            intents,
            'connections',
            sceneDuration,
            lifecycleById,
            sceneState,
            connectionTimingById,
            scene,
          );
          phasePlan = {
            thread: toThread(
              [connectionTransitions.thread, connectionEffects.thread].filter(
                (thread): thread is ThreadGenerator => thread !== undefined,
              ),
            ),
            duration: Math.max(connectionTransitions.duration, connectionEffects.duration),
          };
        }
        break;
      case 'interactions':
        {
          const interactionEffects = executeEffectsPhase(
            intents,
            'interactions',
            sceneDuration,
            lifecycleById,
            sceneState,
            connectionTimingById,
            scene,
          );
          const interactionFlows = executeInteractionFlowsPhase(
            view,
            scene,
            sceneDuration,
            sceneState,
            connectionTimingById,
            entityAnchorsById,
          );
          phasePlan = {
            thread: toThread(
              [interactionEffects.thread, interactionFlows.thread].filter(
                (thread): thread is ThreadGenerator => thread !== undefined,
              ),
            ),
            duration: Math.max(interactionEffects.duration, interactionFlows.duration),
          };
        }
        break;
      default:
        phasePlan = {duration: 0};
        break;
    }

    phasePlans.push(phasePlan);
  }

  return {
    thread: toThread(phasePlans.flatMap((plan) => (plan.thread ? [plan.thread] : []))),
    duration: phasePlans.reduce((maxDuration, plan) => Math.max(maxDuration, plan.duration), 0),
  };
};

const executeStatusEffects = (
  scene: MotionSceneSpec,
  lifecycleResults: LifecycleResult[],
  sceneElementById: Map<string, MotionElementSpec>,
  sceneDuration: number,
): PhaseExecutionPlan => {
  const phases = getScenePhases(sceneDuration);
  const threads: ThreadGenerator[] = [];
  let maxEnd = 0;

  lifecycleResults.forEach((lifecycleResult, index) => {
    const elementSpec = sceneElementById.get(lifecycleResult.elementState.id);
    const style = elementSpec?.visualStyle;
    if (!style) {
      return;
    }

    const status = style.status;
    const baseDelay =
      status === 'down' || status === 'error' || status === 'overloaded'
        ? phases.connect.start
        : phases.enter.start;
    const localDelay = baseDelay + index * 0.02;
    const duration = Math.max(0.18, Math.min(0.45, phases.connect.end - phases.connect.start));
    const timingFunction = resolveTimingFunction(MotionTokens.easing.standard);
    const node = lifecycleResult.node;

    maxEnd = Math.max(maxEnd, localDelay + duration);
    const thread = createDelayedThread(
      localDelay,
      (function* statusThread() {
        if (node instanceof Rect || node instanceof Circle) {
          yield* all(
            node.fill(style.color, duration * 0.6, timingFunction),
            node.stroke(style.strokeColor, duration * 0.6, timingFunction),
            node.lineWidth(style.strokeWidth, duration * 0.6, timingFunction),
          );
        }

        yield* node.opacity(style.opacity, duration * 0.4, timingFunction);

        switch (status) {
          case 'active':
            yield* runElementAnimationTimed(node, AnimationType.Focus, {
              duration: duration * 0.9,
              timingFunction,
            });
            break;
          case 'overloaded':
            yield* applyShake(node, {
              duration: duration,
              intensity: 10,
            });
            break;
          case 'error':
            yield* node
              .opacity(Math.max(0.4, style.opacity * 0.7), duration / 2, timingFunction)
              .to(style.opacity, duration / 2, timingFunction);
            break;
          case 'down':
            yield* node.opacity(StyleTokens.opacity.dim, duration, timingFunction);
            break;
          default:
            break;
        }
      })(),
    );

    threads.push(thread);
  });

  return {
    thread: toThread(threads),
    duration: maxEnd,
  };
};

const executeAmbientComponentMotion = (
  sceneDuration: number,
  lifecycleResults: LifecycleResult[],
  sceneElementById: Map<string, MotionElementSpec>,
): PhaseExecutionPlan => {
  const threads: ThreadGenerator[] = [];

  for (const lifecycleResult of lifecycleResults) {
    const elementSpec = sceneElementById.get(lifecycleResult.elementState.id);
    if (!elementSpec) {
      continue;
    }

    if (elementSpec.type === ComponentType.LoadBalancer) {
      const spinnerNode = findLbSpinnerNode(lifecycleResult.node);
      if (!spinnerNode) {
        continue;
      }

      const rotationPerSecond = 160;
      const cycleDuration = 0.36;
      threads.push((function* lbSpinnerThread() {
        let elapsed = 0;
        let currentRotation = spinnerNode.rotation();

        while (elapsed + cycleDuration <= sceneDuration) {
          currentRotation += rotationPerSecond * cycleDuration;
          yield* spinnerNode.rotation(currentRotation, cycleDuration, linear);
          elapsed += cycleDuration;
        }

        const remaining = sceneDuration - elapsed;
        if (remaining > 0.01) {
          currentRotation += rotationPerSecond * remaining;
          yield* spinnerNode.rotation(currentRotation, remaining, linear);
        }
      })());
    }
  }

  return {
    thread: toThread(threads),
    duration: threads.length > 0 ? sceneDuration : 0,
  };
};

const resolveCameraTiming = (
  scene: MotionSceneSpec,
  sceneDuration: number,
): {delay: number; duration: number} | null => {
  if (scene.cameraPlan?.motionType === 'introduce_primary') {
    const earliestAddDelay = Math.min(
      ...(scene.animationPlan?.entities
        .filter((timing) => timing.action === 'add')
        .map((timing) => timing.delay) ?? [0]),
    );
    const hasAdditions = Number.isFinite(earliestAddDelay);
    const spotlightDelay = hasAdditions
      ? Math.max(0, earliestAddDelay - Math.min(0.03, sceneDuration * 0.03))
      : 0;

    return {
      delay: spotlightDelay,
      duration: Math.max(
        0.18,
        Math.min(0.42, scene.cameraPlan.duration, Math.max(0.22, sceneDuration * 0.24)),
      ),
    };
  }

  const plannedTiming = scene.animationPlan?.camera;
  if (plannedTiming) {
    return {
      delay: plannedTiming.delay,
      duration: plannedTiming.duration,
    };
  }

  if (!scene.cameraPlan) {
    return null;
  }

  const directiveCameraMode = scene.directives?.camera.mode;
  if (directiveCameraMode === 'follow_action' || directiveCameraMode === 'wide_recap') {
    const earliestAddDelay = Math.min(
      ...(scene.animationPlan?.entities
        .filter((timing) => timing.action === 'add')
        .map((timing) => timing.delay) ?? [0]),
    );
    const hasAdditions = Number.isFinite(earliestAddDelay) && earliestAddDelay > 0;
    const followDelay = hasAdditions
      ? Math.max(0, earliestAddDelay - Math.min(0.08, sceneDuration * 0.08))
      : 0;
    const immediateDuration = Math.max(
      0.18,
      Math.min(
        0.42,
        scene.cameraPlan.duration,
        Math.max(0.22, sceneDuration * 0.28),
      ),
    );

    return {
      delay: directiveCameraMode === 'follow_action' ? followDelay : 0,
      duration: immediateDuration,
    };
  }

  const cameraPhase = getScenePhases(sceneDuration).camera;
  const phaseDuration = Math.max(0.1, cameraPhase.end - cameraPhase.start);

  return {
    delay: cameraPhase.start,
    duration: Math.min(phaseDuration, scene.cameraPlan.duration),
  };
};

const resolveSceneCameraAction = (
  scene: MotionSceneSpec,
  hasCameraTiming: boolean,
): CameraActionType | undefined => {
  const directiveCameraMode = scene.directives?.camera.mode;
  const hasExplicitDirectiveCamera =
    directiveCameraMode === 'follow_action' || directiveCameraMode === 'wide_recap';

  if (scene.cameraPlan) {
    if (scene.cameraPlan.motionType === 'expand_architecture') {
      return CameraActionType.Wide;
    }

    return CameraActionType.Focus;
  }

  if (scene.camera && hasExplicitDirectiveCamera) {
    return scene.camera;
  }

  if (!hasCameraTiming) {
    return undefined;
  }

  return scene.plan?.cameraAction ?? scene.camera;
};

const resolveCameraFocusTarget = (
  scene: MotionSceneSpec,
  lifecycleResults: LifecycleResult[],
  sceneElementById: Map<string, MotionElementSpec>,
  primaryElement: LifecycleResult | undefined,
  firstNewElement: LifecycleResult | undefined,
): PixelPosition | undefined => {
  const focusLifecycle = resolveCameraFocusLifecycle(
    scene,
    lifecycleResults,
    sceneElementById,
    primaryElement,
    firstNewElement,
  );
  return focusLifecycle?.targetPosition;
};

const resolveCameraFocusLifecycle = (
  scene: MotionSceneSpec,
  lifecycleResults: LifecycleResult[],
  sceneElementById: Map<string, MotionElementSpec>,
  primaryElement: LifecycleResult | undefined,
  firstNewElement: LifecycleResult | undefined,
): LifecycleResult | undefined => {
  if (scene.cameraPlan?.targetElementId) {
    const targetLifecycle = lifecycleResults.find(
      (result) => result.elementState.id === scene.cameraPlan?.targetElementId,
    );
    if (targetLifecycle) {
      return targetLifecycle;
    }
  }

  if (scene.cameraPlan?.targetId) {
    const targetLifecycle = lifecycleResults.find((result) => {
      const sourceId = resolveElementSourceId(sceneElementById, result.elementState.id);
      return sourceId === scene.cameraPlan?.targetId;
    });
    if (targetLifecycle) {
      return targetLifecycle;
    }
  }

  return primaryElement ?? firstNewElement;
};

const collectFocusedElementBounds = (
  lifecycleResult: LifecycleResult | undefined,
  sceneElementById: Map<string, MotionElementSpec>,
): {minX: number; maxX: number; minY: number; maxY: number} | undefined => {
  if (!lifecycleResult) {
    return undefined;
  }

  const element = sceneElementById.get(lifecycleResult.elementState.id);
  const size = resolveAnchorSize(element);
  const labelPadding = element?.label ? 26 : 16;
  const focusPadding = 10;
  const x = lifecycleResult.targetPosition.x;
  const y = lifecycleResult.targetPosition.y;

  return {
    minX: x - size.halfWidth - focusPadding,
    maxX: x + size.halfWidth + focusPadding,
    minY: y - size.halfHeight - focusPadding,
    maxY: y + size.halfHeight + labelPadding + focusPadding,
  };
};

function* executeStaticScene(
  view: Node,
  scene: MotionSceneSpec,
  state: SceneState,
): ThreadGenerator {
  state.camera.x = state.camera.originX;
  state.camera.y = state.camera.originY;
  state.camera.scale = 1;
  view.x(state.camera.originX);
  view.y(state.camera.originY);
  view.scale(1);

  const captionText = scene.title ?? scene.narration;
  const captionExecution = createCaptionTransition(state.caption, captionText);
  if (captionExecution.thread) {
    yield* captionExecution.thread;
  }

  const desiredElementIds = new Set(scene.elements.map((element) => element.id));
  for (const [elementId, elementState] of state.elements.entries()) {
    if (desiredElementIds.has(elementId)) {
      continue;
    }
    elementState.node.remove();
    state.elements.delete(elementId);
  }

  const lifecycleResults = scene.elements.map((element) =>
    ensureElementLifecycle(
      {
        view,
        elements: state.elements,
        sceneIndex: state.sceneIndex,
        logger: state.logger,
      },
      element,
    ),
  );
  const sceneElementById = toElementSpecMap(scene.elements);

  for (const lifecycle of lifecycleResults) {
    lifecycle.node.x(lifecycle.targetPosition.x);
    lifecycle.node.y(lifecycle.targetPosition.y);
    const visualStyle = sceneElementById.get(lifecycle.elementState.id)?.visualStyle;
    lifecycle.node.opacity(visualStyle?.opacity ?? 1);
    lifecycle.elementState.position = lifecycle.targetPosition;
    lifecycle.elementState.unchangedStreak = 0;
  }

  const entityAnchorsById = collectEntityAnchors(lifecycleResults, sceneElementById);
  const connectionSync = syncSceneConnections(
    view,
    scene,
    state,
    entityAnchorsById,
    new Set<string>(),
  );

  for (const line of state.connections.values()) {
    line.opacity(0.9);
  }

  if (connectionSync.added > 0 || connectionSync.updated > 0 || connectionSync.removed > 0) {
    state.logger.info('Connections synchronized', {
      scene: scene.id,
      added: connectionSync.added,
      updated: connectionSync.updated,
      removed: connectionSync.removed,
      retainedForRemoval: connectionSync.retainedForRemoval,
      total: state.connections.size,
    });
  }

  state.lastExecutionDuration = captionExecution.duration;
}

export function* executeScene(
  view: Node,
  scene: MotionSceneSpec,
  state: SceneState,
): ThreadGenerator {
  const sceneDuration = Math.max(0, scene.end - scene.start);
  state.logger.info('Scene start', {
    scene: scene.id,
    duration: sceneDuration,
    elements: scene.elements.length,
    hasDiff: scene.diff !== undefined,
  });

  if (scene.staticScene) {
    yield* executeStaticScene(view, scene, state);
    state.logger.info('Scene end', {
      scene: scene.id,
      consumedTime: state.lastExecutionDuration,
      staticScene: true,
    });
    return;
  }

  const captionText = scene.title ?? scene.narration;
  const captionExecution = createCaptionTransition(state.caption, captionText);

  const lifecycleResults = scene.elements.map((element) =>
    ensureElementLifecycle(
      {
        view,
        elements: state.elements,
        sceneIndex: state.sceneIndex,
        logger: state.logger,
      },
      element,
    ),
  );
  const sceneElementById = toElementSpecMap(scene.elements);
  const entityAnchorsById = collectEntityAnchors(lifecycleResults, sceneElementById);
  const connectionIdsRetainedForRemoval = scene.plan
    ? new Set(
        (scene.diff?.connectionDiffs ?? [])
          .filter((diff) => diff.type === 'connection_removed')
          .map((diff) => diff.connectionId),
      )
    : new Set<string>();
  const connectionSync = syncSceneConnections(
    view,
    scene,
    state,
    entityAnchorsById,
    connectionIdsRetainedForRemoval,
  );

  if (connectionSync.added > 0 || connectionSync.updated > 0 || connectionSync.removed > 0) {
    state.logger.info('Connections synchronized', {
      scene: scene.id,
      added: connectionSync.added,
      updated: connectionSync.updated,
      removed: connectionSync.removed,
      retainedForRemoval: connectionSync.retainedForRemoval,
      total: state.connections.size,
    });
  }

  const primaryElement = lifecycleResults[0];
  const firstNewElement = lifecycleResults.find((result) => result.isNew);
  const hierarchyExecution = executeHierarchyStyling(
    scene,
    sceneDuration,
    lifecycleResults,
    sceneElementById,
  );
  const statusExecution = executeStatusEffects(
    scene,
    lifecycleResults,
    sceneElementById,
    sceneDuration,
  );
  const ambientExecution = executeAmbientComponentMotion(
    sceneDuration,
    lifecycleResults,
    sceneElementById,
  );

  const motionExecution = scene.plan
    ? executePlanDrivenScene(view, scene, lifecycleResults, state, sceneDuration)
    : executeLegacyScene(scene, lifecycleResults, state);

  const cameraTiming = resolveCameraTiming(scene, sceneDuration);
  const cameraAction = resolveSceneCameraAction(scene, cameraTiming !== null);
  const directiveCameraMode = scene.directives?.camera.mode;
  const isWideRecapCamera = directiveCameraMode === 'wide_recap';
  const shouldRunCamera = Boolean(cameraAction) || Boolean(scene.cameraPlan);
  const focusLifecycle = shouldRunCamera
    ? resolveCameraFocusLifecycle(
      scene,
      lifecycleResults,
      sceneElementById,
      primaryElement,
      firstNewElement,
    )
    : undefined;
  const focusTarget = shouldRunCamera
    ? resolveCameraFocusTarget(
      scene,
      lifecycleResults,
      sceneElementById,
      primaryElement,
      firstNewElement,
    )
    : undefined;
  const shouldUseFocusedContentBounds = scene.cameraPlan?.motionType === 'introduce_primary';
  const sceneContentBounds = shouldUseFocusedContentBounds
    ? collectFocusedElementBounds(focusLifecycle, sceneElementById) ??
      collectSceneContentBounds(lifecycleResults, sceneElementById)
    : collectSceneContentBounds(lifecycleResults, sceneElementById);
  const cameraDelay = cameraTiming?.delay ?? 0;
  const cameraAvailableDuration = Math.max(0.1, sceneDuration - cameraDelay);
  const cameraExecution = shouldRunCamera
    ? createCameraPlan({
      view,
      cameraState: state.camera,
      sceneDuration: cameraAvailableDuration,
      durationOverride: cameraTiming?.duration,
      action: cameraAction,
      focusTarget,
      activeZone: shouldUseFocusedContentBounds
        ? 'center'
        : scene.directives?.camera.active_zone ?? 'upper_third',
      reserveBottomPercent: shouldUseFocusedContentBounds
        ? 0
        : scene.directives?.camera.reserve_bottom_percent ?? 25,
      zoomOverride: scene.cameraPlan?.zoom,
      holdDuration: scene.cameraPlan?.holdDuration ?? 0,
      resetAfterHold: shouldUseFocusedContentBounds,
      easingOverride: scene.cameraPlan?.easing,
      allowDrift: !isWideRecapCamera && !shouldUseFocusedContentBounds,
      lockXAxis: isWideRecapCamera,
      contentBounds: sceneContentBounds,
      logger: state.logger,
    })
    : null;

  const cameraThread = cameraExecution
    ? createDelayedThread(cameraDelay, cameraExecution.thread)
    : undefined;
  const cameraDuration = cameraExecution ? cameraDelay + cameraExecution.duration : 0;

  const threads: ThreadGenerator[] = [];
  if (captionExecution.thread) {
    threads.push(captionExecution.thread);
  }
  if (hierarchyExecution.thread) {
    threads.push(hierarchyExecution.thread);
  }
  if (statusExecution.thread) {
    threads.push(statusExecution.thread);
  }
  if (ambientExecution.thread) {
    threads.push(ambientExecution.thread);
  }
  if (motionExecution.thread) {
    threads.push(motionExecution.thread);
  }
  if (cameraThread) {
    threads.push(cameraThread);
  }

  if (threads.length > 0) {
    yield* all(...threads);
  }

  const consumedTime = Math.max(
    captionExecution.duration,
    hierarchyExecution.duration,
    statusExecution.duration,
    ambientExecution.duration,
    motionExecution.duration,
    cameraDuration,
  );

  state.logger.info('Scene end', {
    scene: scene.id,
    consumedTime,
  });
  state.lastExecutionDuration = consumedTime;

  // TODO: Voice sync: drive transition durations from narration/audio timing.
  // TODO: Auto scene compression when scene execution exceeds budget.
  // TODO: Auto highlight bottleneck elements based on narration intent.
  // TODO: Style profiles (viral / cinematic) to tune motion defaults.
}
