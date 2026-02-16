import {
  DesignedMomentsVideoSchema,
  type Camera,
  type Connection,
  type DesignedEntity,
  type DesignedMoment,
  type DesignedMomentsVideo,
  type Interaction,
  type MomentTransition,
} from '../../schema/moment.schema.js';
import {VIDEO_LIMITS} from '../../config/constants.js';
import type {TemplateId} from '../../design/templates.js';
import {ComponentType} from '../../schema/visualGrammar.js';
import {COMPONENT_CATALOG} from '../catalog/componentCatalog.js';
import type {LaidOutPlan, LaidOutScene} from '../schema/compiledPlan.schema.js';

const TEMPLATE_BY_ARCHETYPE: Record<string, TemplateId> = {
  hook: 'HERO_FOCUS',
  setup: 'ARCHITECTURE_FLOW',
  problem: 'HERO_FOCUS',
  escalation: 'HERO_FOCUS',
  solution: 'PROGRESSIVE_REVEAL',
  expansion: 'PROGRESSIVE_REVEAL',
  climax: 'ARCHITECTURE_FLOW',
  recap: 'COMPARISON_SPLIT',
  ending: 'HERO_FOCUS',
};

const zoomByPreset = (zoom: 'tight' | 'medium' | 'wide' | undefined): number => {
  switch (zoom) {
    case 'tight':
      return 1.18;
    case 'medium':
      return 1.1;
    case 'wide':
      return 1;
    default:
      return 1.1;
  }
};

const resolveFollowActionZoomCap = (scene: LaidOutScene): number => {
  const entityCount = scene.laidOutEntities.length;

  if (entityCount <= 2) {
    return 1.18;
  }

  if (entityCount === 3) {
    return 1.12;
  }

  if (entityCount === 4) {
    return 1.08;
  }

  if (entityCount === 5) {
    return 1.04;
  }

  return 1;
};

const toCamera = (scene: LaidOutScene): Camera => {
  const directives = scene.directives;
  const cameraMode = directives?.camera.mode ?? 'auto';
  const fallbackZoom =
    scene.cameraIntent === 'wide' || scene.archetype === 'recap' ? 'wide' : 'tight';
  const zoom = zoomByPreset(directives?.camera.zoom ?? fallbackZoom);
  const focusTarget = scene.focusEntityId;

  if (cameraMode === 'wide_recap') {
    return {mode: 'wide', zoom: zoomByPreset('wide')};
  }

  if (cameraMode === 'follow_action') {
    const zoomCap = resolveFollowActionZoomCap(scene);
    return {
      mode: 'focus',
      target: focusTarget,
      zoom: Math.min(zoom, zoomCap),
    };
  }

  if (cameraMode === 'steady') {
    return {mode: 'wide', zoom: zoomByPreset('medium')};
  }

  if (scene.cameraIntent === 'focus' || scene.cameraIntent === 'introduce') {
    return {
      mode: 'focus',
      target: focusTarget,
      zoom,
    };
  }

  if (scene.cameraIntent === 'steady') {
    return {mode: 'wide', zoom: zoomByPreset('medium')};
  }

  if (scene.archetype === 'recap') {
    return {mode: 'wide', zoom: zoomByPreset('wide')};
  }

  return {mode: 'wide', zoom: zoomByPreset('medium')};
};

const ensureSinglePrimary = (
  entities: DesignedEntity[],
  focusEntityId: string,
): DesignedEntity[] => {
  const fallbackPrimaryId = focusEntityId || entities[0]?.id;

  return entities.map((entity) => ({
    ...entity,
    importance: entity.id === fallbackPrimaryId ? 'primary' : 'secondary',
  }));
};

const toStaticLabel = (
  type: ComponentType,
  label: string | undefined,
): string => label ?? COMPONENT_CATALOG[type]?.label ?? 'Component';

const toDesignedEntities = (scene: LaidOutScene): DesignedEntity[] => {
  const visibleIds = new Set(scene.laidOutEntities.map((entity) => entity.id));
  const focusEntityId = visibleIds.has(scene.focusEntityId)
    ? scene.focusEntityId
    : scene.laidOutEntities[0]?.id ?? scene.focusEntityId;

  const entities = scene.laidOutEntities.map((entity) => ({
    id: entity.id,
    type: entity.type,
    label: toStaticLabel(entity.type, entity.label),
    count: Math.max(1, Math.round(entity.count ?? 1)),
    importance: entity.importance,
    status: entity.status,
    layout: {
      x: entity.x,
      y: entity.y,
    },
  }));

  return ensureSinglePrimary(entities, focusEntityId);
};

const toConnections = (scene: LaidOutScene, visibleEntityIds: ReadonlySet<string>): Connection[] => {
  return scene.visibleConnections
    .filter(
      (connection) =>
        visibleEntityIds.has(connection.from) &&
        visibleEntityIds.has(connection.to),
    )
    .map((connection) => ({
      id: connection.id,
      from: connection.from,
      to: connection.to,
      direction: connection.connection_type === 'both_ways' ? 'bidirectional' : 'one_way',
      style: connection.kind === 'replication' ? 'dashed' : 'solid',
    }));
};

const toInteractions = (
  scene: LaidOutScene,
  visibleEntityIds: ReadonlySet<string>,
): Interaction[] => {
  const interactions: Interaction[] = [];

  for (const connection of scene.visibleConnections) {
    if (!visibleEntityIds.has(connection.from) || !visibleEntityIds.has(connection.to)) {
      continue;
    }

    const connectionType = connection.connection_type ?? 'static';
    if (connectionType === 'static') {
      continue;
    }

    const intensity = connection.intensity ?? 'medium';
    const interactionType =
      connection.kind === 'cache_lookup'
        ? 'ping'
        : connection.pattern === 'burst'
          ? 'burst'
          : connection.pattern === 'broadcast'
            ? 'broadcast'
            : connection.pattern === 'ping'
              ? 'ping'
              : 'flow';
    interactions.push({
      id: `i_${connection.id}_fwd`,
      from: connection.from,
      to: connection.to,
      type: interactionType,
      intensity,
    });

    if (connectionType === 'both_ways') {
      interactions.push({
        id: `i_${connection.id}_rev`,
        from: connection.to,
        to: connection.from,
        type: interactionType,
        intensity,
      });
    }
  }

  return interactions;
};

const toMomentTransition = (scene: LaidOutScene): MomentTransition | undefined => {
  if (scene.transition) {
    if (scene.transition.type === 'add_entity') {
      return {
        type: 'add_entity',
        entityId: scene.transition.entityId,
        style: scene.transition.style,
        pace: scene.transition.pace,
      };
    }

    return {
      type: 'insert_between',
      entityId: scene.transition.entityId,
      fromId: scene.transition.fromId,
      toId: scene.transition.toId,
      style: scene.transition.style,
      pace: scene.transition.pace,
    };
  }

  return undefined;
};

const toDesignedMoment = (scene: LaidOutScene): DesignedMoment => {
  const entities = toDesignedEntities(scene);
  const visibleEntityIds = new Set(entities.map((entity) => entity.id));
  const connections = toConnections(scene, visibleEntityIds);
  const interactions = toInteractions(scene, visibleEntityIds);

  return {
    id: scene.id,
    start: scene.start,
    end: scene.end,
    narration: scene.narration,
    entities,
    connections,
    interactions,
    stateChanges: [],
    camera: toCamera(scene),
    transition: toMomentTransition(scene),
    template: TEMPLATE_BY_ARCHETYPE[scene.archetype] ?? 'ARCHITECTURE_FLOW',
    directives: scene.directives,
  };
};

const validateSceneDurations = (scenes: LaidOutScene[]): void => {
  const violations = scenes
    .map((scene) => ({id: scene.id, duration: scene.end - scene.start}))
    .filter((scene) => scene.duration > VIDEO_LIMITS.maxSceneDurationSeconds);

  if (violations.length === 0) {
    return;
  }

  const detail = violations
    .map((scene) => `${scene.id}=${scene.duration.toFixed(2)}s`)
    .join(', ');

  throw new Error(
    `V2 static compiler requires per-scene duration <= ${VIDEO_LIMITS.maxSceneDurationSeconds}s. Violations: ${detail}`,
  );
};

export const compileLaidOutPlanToDesignedMoments = (
  laidOutPlan: LaidOutPlan,
): DesignedMomentsVideo => {
  const scenes = [...laidOutPlan.scenes].sort((left, right) => left.start - right.start);
  validateSceneDurations(scenes);

  const moments = scenes.map((scene) => toDesignedMoment(scene));

  return DesignedMomentsVideoSchema.parse({
    duration: laidOutPlan.duration,
    moments,
  });
};
