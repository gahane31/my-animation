import {
  DesignedMomentsVideoSchema,
  type Camera,
  type Connection,
  type DesignedEntity,
  type DesignedMoment,
  type DesignedMomentsVideo,
  type MomentTransition,
} from '../../schema/moment.schema.js';
import {VIDEO_LIMITS} from '../../config/constants.js';
import type {TemplateId} from '../../design/templates.js';
import {ComponentType} from '../../schema/visualGrammar.js';
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

const toCamera = (): Camera => ({mode: 'wide', zoom: 1});

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

const DEFAULT_LABEL_BY_TYPE: Record<ComponentType, string> = {
  [ComponentType.UsersCluster]: 'Users',
  [ComponentType.Server]: 'Server',
  [ComponentType.LoadBalancer]: 'Load Balancer',
  [ComponentType.Database]: 'Database',
  [ComponentType.Cache]: 'Cache',
  [ComponentType.Queue]: 'Queue',
  [ComponentType.Worker]: 'Worker',
  [ComponentType.Cdn]: 'CDN',
};

const toStaticLabel = (
  type: ComponentType,
  _label: string | undefined,
): string => DEFAULT_LABEL_BY_TYPE[type];

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
      direction: 'one_way',
      style: connection.kind === 'replication' ? 'dashed' : 'solid',
    }));
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

  return {
    id: scene.id,
    start: scene.start,
    end: scene.end,
    narration: scene.narration,
    entities,
    connections,
    interactions: [],
    stateChanges: [],
    camera: toCamera(),
    transition: toMomentTransition(scene),
    template: TEMPLATE_BY_ARCHETYPE[scene.archetype] ?? 'ARCHITECTURE_FLOW',
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
