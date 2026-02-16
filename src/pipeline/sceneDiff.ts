import type {MomentDiff, Pos} from '../design/diffTypes.js';
import type {
  Camera,
  Connection,
  DesignedEntity,
  Interaction,
} from '../schema/moment.schema.js';

const DEFAULT_POSITION: Pos = {x: 50, y: 55};
const POSITION_EPSILON = 0.001;

const resolvePosition = (entity: DesignedEntity): Pos =>
  entity.layout ? {x: entity.layout.x, y: entity.layout.y} : DEFAULT_POSITION;

const hasPositionDelta = (left: Pos, right: Pos): boolean =>
  Math.abs(left.x - right.x) > POSITION_EPSILON ||
  Math.abs(left.y - right.y) > POSITION_EPSILON;

const toCount = (value: number | undefined): number => Math.max(1, Math.round(value ?? 1));

export interface SceneSnapshot {
  entities: DesignedEntity[];
  connections: Connection[];
  interactions: Interaction[];
  camera?: Camera;
}

export interface SceneEntityChanges {
  status?: {from?: string; to?: string};
  count?: {from: number; to: number};
  label?: {from?: string; to?: string};
  importance?: {from?: string; to?: string};
}

export interface SceneDiff {
  addedEntities: DesignedEntity[];
  removedEntities: DesignedEntity[];
  movedEntities: {id: string; from: Pos; to: Pos}[];
  updatedEntities: {id: string; changes: SceneEntityChanges}[];
  addedConnections: Connection[];
  removedConnections: Connection[];
  addedInteractions: Interaction[];
  removedInteractions: Interaction[];
  interactionIntensityChanged: {id: string; from?: string; to?: string}[];
  cameraChanged: {from?: Camera | null; to?: Camera | null} | null;
}

const emptySceneSnapshot: SceneSnapshot = {
  entities: [],
  connections: [],
  interactions: [],
  camera: undefined,
};

const createEntityMap = (entities: DesignedEntity[]): Map<string, DesignedEntity> =>
  new Map(entities.map((entity) => [entity.id, entity]));

const createConnectionMap = (connections: Connection[]): Map<string, Connection> =>
  new Map(connections.map((connection) => [connection.id, connection]));

const createInteractionMap = (interactions: Interaction[]): Map<string, Interaction> =>
  new Map(interactions.map((interaction) => [interaction.id, interaction]));

export const diffScenes = (
  previousInput: SceneSnapshot | undefined,
  currentInput: SceneSnapshot,
): SceneDiff => {
  const previous = previousInput ?? emptySceneSnapshot;

  const previousEntityMap = createEntityMap(previous.entities);
  const currentEntityMap = createEntityMap(currentInput.entities);
  const previousConnectionMap = createConnectionMap(previous.connections);
  const currentConnectionMap = createConnectionMap(currentInput.connections);
  const previousInteractionMap = createInteractionMap(previous.interactions);
  const currentInteractionMap = createInteractionMap(currentInput.interactions);

  const addedEntities: DesignedEntity[] = [];
  const removedEntities: DesignedEntity[] = [];
  const movedEntities: {id: string; from: Pos; to: Pos}[] = [];
  const updatedEntities: {id: string; changes: SceneEntityChanges}[] = [];
  const addedConnections: Connection[] = [];
  const removedConnections: Connection[] = [];
  const addedInteractions: Interaction[] = [];
  const removedInteractions: Interaction[] = [];
  const interactionIntensityChanged: {id: string; from?: string; to?: string}[] = [];

  for (const [entityId, currentEntity] of currentEntityMap.entries()) {
    const previousEntity = previousEntityMap.get(entityId);
    if (!previousEntity) {
      addedEntities.push(currentEntity);
      continue;
    }

    const previousPosition = resolvePosition(previousEntity);
    const currentPosition = resolvePosition(currentEntity);
    if (hasPositionDelta(previousPosition, currentPosition)) {
      movedEntities.push({
        id: entityId,
        from: previousPosition,
        to: currentPosition,
      });
    }

    const changes: SceneEntityChanges = {};
    const previousCount = toCount(previousEntity.count);
    const currentCount = toCount(currentEntity.count);

    if (previousEntity.status !== currentEntity.status) {
      changes.status = {
        from: previousEntity.status,
        to: currentEntity.status,
      };
    }

    if (previousCount !== currentCount) {
      changes.count = {
        from: previousCount,
        to: currentCount,
      };
    }

    if (previousEntity.label !== currentEntity.label) {
      changes.label = {
        from: previousEntity.label,
        to: currentEntity.label,
      };
    }

    if (previousEntity.importance !== currentEntity.importance) {
      changes.importance = {
        from: previousEntity.importance,
        to: currentEntity.importance,
      };
    }

    if (Object.keys(changes).length > 0) {
      updatedEntities.push({id: entityId, changes});
    }
  }

  for (const [entityId, previousEntity] of previousEntityMap.entries()) {
    if (!currentEntityMap.has(entityId)) {
      removedEntities.push(previousEntity);
    }
  }

  for (const [connectionId, currentConnection] of currentConnectionMap.entries()) {
    if (!previousConnectionMap.has(connectionId)) {
      addedConnections.push(currentConnection);
    }
  }

  for (const [connectionId, previousConnection] of previousConnectionMap.entries()) {
    if (!currentConnectionMap.has(connectionId)) {
      removedConnections.push(previousConnection);
    }
  }

  for (const [interactionId, currentInteraction] of currentInteractionMap.entries()) {
    const previousInteraction = previousInteractionMap.get(interactionId);
    if (!previousInteraction) {
      addedInteractions.push(currentInteraction);
      continue;
    }

    if (previousInteraction.intensity !== currentInteraction.intensity) {
      interactionIntensityChanged.push({
        id: interactionId,
        from: previousInteraction.intensity,
        to: currentInteraction.intensity,
      });
    }
  }

  for (const [interactionId, previousInteraction] of previousInteractionMap.entries()) {
    if (!currentInteractionMap.has(interactionId)) {
      removedInteractions.push(previousInteraction);
    }
  }

  const previousCamera = previous.camera ?? null;
  const currentCamera = currentInput.camera ?? null;
  const cameraChanged =
    JSON.stringify(previousCamera) !== JSON.stringify(currentCamera)
      ? {
          from: previousCamera,
          to: currentCamera,
        }
      : null;

  return {
    addedEntities,
    removedEntities,
    movedEntities,
    updatedEntities,
    addedConnections,
    removedConnections,
    addedInteractions,
    removedInteractions,
    interactionIntensityChanged,
    cameraChanged,
  };
};

export const toMomentDiff = (sceneDiff: SceneDiff): MomentDiff => ({
  entityDiffs: [
    ...sceneDiff.addedEntities.map((entity) => ({
      type: 'entity_added' as const,
      entityId: entity.id,
    })),
    ...sceneDiff.removedEntities.map((entity) => ({
      type: 'entity_removed' as const,
      entityId: entity.id,
    })),
    ...sceneDiff.movedEntities.map((entry) => ({
      type: 'entity_moved' as const,
      entityId: entry.id,
      from: entry.from,
      to: entry.to,
    })),
    ...sceneDiff.updatedEntities.flatMap((entry) => {
      const diffs: MomentDiff['entityDiffs'] = [];

      if (entry.changes.count) {
        diffs.push({
          type: 'entity_count_changed',
          entityId: entry.id,
          from: entry.changes.count.from,
          to: entry.changes.count.to,
        });
      }

      if (entry.changes.status) {
        diffs.push({
          type: 'entity_status_changed',
          entityId: entry.id,
          from: entry.changes.status.from,
          to: entry.changes.status.to,
        });
      }

      if (entry.changes.importance) {
        diffs.push({
          type: 'entity_importance_changed',
          entityId: entry.id,
          from: entry.changes.importance.from,
          to: entry.changes.importance.to,
        });
      }

      return diffs;
    }),
  ],
  connectionDiffs: [
    ...sceneDiff.addedConnections.map((connection) => ({
      type: 'connection_added' as const,
      connectionId: connection.id,
    })),
    ...sceneDiff.removedConnections.map((connection) => ({
      type: 'connection_removed' as const,
      connectionId: connection.id,
    })),
  ],
  interactionDiffs: [
    ...sceneDiff.addedInteractions.map((interaction) => ({
      type: 'interaction_added' as const,
      interactionId: interaction.id,
    })),
    ...sceneDiff.removedInteractions.map((interaction) => ({
      type: 'interaction_removed' as const,
      interactionId: interaction.id,
    })),
    ...sceneDiff.interactionIntensityChanged.map((interaction) => ({
      type: 'interaction_intensity_changed' as const,
      interactionId: interaction.id,
      from: interaction.from,
      to: interaction.to,
    })),
  ],
  cameraDiffs: sceneDiff.cameraChanged
    ? [
        {
          type: 'camera_changed',
          from: sceneDiff.cameraChanged.from,
          to: sceneDiff.cameraChanged.to,
        },
      ]
    : [],
});
