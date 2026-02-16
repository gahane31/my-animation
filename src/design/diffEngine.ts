import type {
  DesignedEntity,
  DesignedMoment,
  Interaction,
} from '../schema/moment.schema.js';
import type {
  CameraDiff,
  ConnectionDiff,
  EntityDiff,
  InteractionDiff,
  MomentDiff,
  Pos,
} from './diffTypes.js';

const DEFAULT_POSITION: Pos = {x: 50, y: 55};
const POSITION_EPSILON = 0.001;

const resolvePosition = (entity: DesignedEntity): Pos => {
  const layout = entity.layout;

  if (!layout) {
    return DEFAULT_POSITION;
  }

  return {
    x: layout.x,
    y: layout.y,
  };
};

const hasPositionDelta = (left: Pos, right: Pos): boolean =>
  Math.abs(left.x - right.x) > POSITION_EPSILON || Math.abs(left.y - right.y) > POSITION_EPSILON;

const toCount = (value: number | undefined): number => Math.max(1, Math.round(value ?? 1));

const toStatus = (value: DesignedEntity['status']): string | undefined => value;
const toImportance = (value: DesignedEntity['importance']): string | undefined => value;
const toIntensity = (value: Interaction['intensity']): string | undefined => value;

const buildEntityMap = (moment: DesignedMoment): Map<string, DesignedEntity> =>
  new Map(moment.entities.map((entity) => [entity.id, entity]));

const buildConnectionMap = (moment: DesignedMoment): Set<string> =>
  new Set((moment.connections ?? []).map((connection) => connection.id));

const buildInteractionMap = (moment: DesignedMoment): Map<string, Interaction> =>
  new Map((moment.interactions ?? []).map((interaction) => [interaction.id, interaction]));

const diffEntities = (previous: DesignedMoment, current: DesignedMoment): EntityDiff[] => {
  const previousById = buildEntityMap(previous);
  const currentById = buildEntityMap(current);

  const diffs: EntityDiff[] = [];

  for (const [entityId] of currentById) {
    if (!previousById.has(entityId)) {
      diffs.push({type: 'entity_added', entityId});
    }
  }

  for (const [entityId] of previousById) {
    if (!currentById.has(entityId)) {
      diffs.push({type: 'entity_removed', entityId});
    }
  }

  for (const [entityId, previousEntity] of previousById) {
    const currentEntity = currentById.get(entityId);
    if (!currentEntity) {
      continue;
    }

    const previousPosition = resolvePosition(previousEntity);
    const currentPosition = resolvePosition(currentEntity);

    if (hasPositionDelta(previousPosition, currentPosition)) {
      diffs.push({
        type: 'entity_moved',
        entityId,
        from: previousPosition,
        to: currentPosition,
      });
    }

    const previousCount = toCount(previousEntity.count);
    const currentCount = toCount(currentEntity.count);

    if (previousCount !== currentCount) {
      diffs.push({
        type: 'entity_count_changed',
        entityId,
        from: previousCount,
        to: currentCount,
      });
    }

    const previousStatus = toStatus(previousEntity.status);
    const currentStatus = toStatus(currentEntity.status);

    if (previousStatus !== currentStatus) {
      diffs.push({
        type: 'entity_status_changed',
        entityId,
        from: previousStatus,
        to: currentStatus,
      });
    }

    const previousImportance = toImportance(previousEntity.importance);
    const currentImportance = toImportance(currentEntity.importance);

    if (previousImportance !== currentImportance) {
      diffs.push({
        type: 'entity_importance_changed',
        entityId,
        from: previousImportance,
        to: currentImportance,
      });
    }
  }

  return diffs;
};

const diffConnections = (
  previous: DesignedMoment,
  current: DesignedMoment,
): ConnectionDiff[] => {
  const previousIds = buildConnectionMap(previous);
  const currentIds = buildConnectionMap(current);

  const diffs: ConnectionDiff[] = [];

  for (const connectionId of currentIds) {
    if (!previousIds.has(connectionId)) {
      diffs.push({type: 'connection_added', connectionId});
    }
  }

  for (const connectionId of previousIds) {
    if (!currentIds.has(connectionId)) {
      diffs.push({type: 'connection_removed', connectionId});
    }
  }

  return diffs;
};

const diffInteractions = (
  previous: DesignedMoment,
  current: DesignedMoment,
): InteractionDiff[] => {
  const previousById = buildInteractionMap(previous);
  const currentById = buildInteractionMap(current);

  const diffs: InteractionDiff[] = [];

  for (const [interactionId] of currentById) {
    if (!previousById.has(interactionId)) {
      diffs.push({type: 'interaction_added', interactionId});
    }
  }

  for (const [interactionId] of previousById) {
    if (!currentById.has(interactionId)) {
      diffs.push({type: 'interaction_removed', interactionId});
    }
  }

  for (const [interactionId, previousInteraction] of previousById) {
    const currentInteraction = currentById.get(interactionId);
    if (!currentInteraction) {
      continue;
    }

    const previousIntensity = toIntensity(previousInteraction.intensity);
    const currentIntensity = toIntensity(currentInteraction.intensity);

    if (previousIntensity !== currentIntensity) {
      diffs.push({
        type: 'interaction_intensity_changed',
        interactionId,
        from: previousIntensity,
        to: currentIntensity,
      });
    }
  }

  return diffs;
};

const diffCamera = (previous: DesignedMoment, current: DesignedMoment): CameraDiff[] => {
  const previousCamera = previous.camera ?? null;
  const currentCamera = current.camera ?? null;

  if (JSON.stringify(previousCamera) === JSON.stringify(currentCamera)) {
    return [];
  }

  return [
    {
      type: 'camera_changed',
      from: previousCamera,
      to: currentCamera,
    },
  ];
};

export function diffMoments(previous: DesignedMoment, current: DesignedMoment): MomentDiff {
  return {
    entityDiffs: diffEntities(previous, current),
    connectionDiffs: diffConnections(previous, current),
    interactionDiffs: diffInteractions(previous, current),
    cameraDiffs: diffCamera(previous, current),
  };
}
