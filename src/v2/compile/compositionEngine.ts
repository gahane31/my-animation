import {
  compositionPlanSchema,
  type CompositionPlan,
  type CompositionScene,
} from '../schema/compiledPlan.schema.js';
import type {
  TopologyEntity,
  TopologyOperation,
  TopologyPlan,
  TopologyScene,
} from '../schema/topologyPlan.schema.js';

const DEFAULT_BUDGET = {
  max_visible_components: 8,
  max_visible_connections: 12,
  max_simultaneous_motions: 1,
} as const;

const focusOrFallback = (scene: TopologyScene): string =>
  scene.focus_entity_id ??
  scene.entities.find((entity) => entity.importance === 'primary')?.id ??
  scene.entities[0]?.id ??
  '';

const operationTouchesEntity = (operation: TopologyOperation, entityId: string): boolean => {
  switch (operation.type) {
    case 'add_entity':
    case 'remove_entity':
    case 'scale_entity':
    case 'change_status':
    case 'emphasize_entity':
    case 'de_emphasize_entity':
      return operation.entityId === entityId;
    case 'insert_between':
      return (
        operation.entityId === entityId ||
        operation.fromId === entityId ||
        operation.toId === entityId
      );
    case 'reveal_group':
      return operation.entityIds.includes(entityId);
    case 'reroute_connection':
      return operation.newFromId === entityId || operation.newToId === entityId;
    default:
      return false;
  }
};

const scoreEntity = (
  entity: TopologyEntity,
  scene: TopologyScene,
  focusEntityId: string,
): number => {
  let score = 0;

  if (entity.id === focusEntityId) {
    score += 100;
  }

  if (entity.importance === 'primary') {
    score += 40;
  }

  if (entity.status === 'overloaded' || entity.status === 'error' || entity.status === 'down') {
    score += 16;
  }

  if (scene.operations.some((operation) => operationTouchesEntity(operation, entity.id))) {
    score += 24;
  }

  if (
    scene.connections.some(
      (connection) => connection.from === entity.id || connection.to === entity.id,
    )
  ) {
    score += 10;
  }

  if (
    scene.connections.some(
      (connection) =>
        (connection.from === focusEntityId && connection.to === entity.id) ||
        (connection.to === focusEntityId && connection.from === entity.id),
    )
  ) {
    score += 18;
  }

  return score;
};

const buildCompositionScene = (scene: TopologyScene): CompositionScene => {
  const focusEntityId = focusOrFallback(scene);
  const inputBudget = scene.complexity_budget ?? DEFAULT_BUDGET;
  const budget = {
    max_visible_components: Math.max(1, Math.min(8, inputBudget.max_visible_components)),
    max_visible_connections: Math.max(0, Math.min(12, inputBudget.max_visible_connections)),
    max_simultaneous_motions: 1,
  } as const;

  // Keep exact LLM-provided entities; only enrich with a score used by downstream debug/priority logic.
  const visibleEntities = scene.entities.map((entity) => ({
    ...entity,
    priorityScore: scoreEntity(entity, scene, focusEntityId),
  }));
  const visibleEntityIds = new Set(visibleEntities.map((entity) => entity.id));

  // Keep exact LLM-provided connections (filtered only for entity existence within this scene).
  const visibleConnections = scene.connections
    .filter(
      (connection) =>
        visibleEntityIds.has(connection.from) && visibleEntityIds.has(connection.to),
    );

  return {
    id: scene.id,
    start: scene.start,
    end: scene.end,
    archetype: scene.archetype,
    narration: scene.narration,
    focusEntityId,
    visibleEntities,
    visibleConnections,
    operations: scene.operations,
    transition: scene.transition,
    cameraIntent: scene.camera_intent ?? 'focus',
    directives: scene.directives,
    complexity_budget: budget,
  };
};

export const composeTopologyPlan = (topologyPlan: TopologyPlan): CompositionPlan =>
  compositionPlanSchema.parse({
    duration: topologyPlan.duration,
    scenes: topologyPlan.scenes
      .sort((left, right) => left.start - right.start)
      .map(buildCompositionScene),
  });
