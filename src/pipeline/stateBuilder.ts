import type {
  Connection,
  Entity,
  Interaction,
  Moment,
} from '../schema/moment.schema.js';
import type {Logger} from './logger.js';
import {silentLogger} from './logger.js';

export type EntityStateMap = Record<string, Entity>;

interface BuildIncrementalScenesOptions {
  logger?: Logger;
}

const cloneEntity = (entity: Entity): Entity => ({...entity});
const cloneConnection = (connection: Connection): Connection => ({...connection});
const cloneInteraction = (interaction: Interaction): Interaction => ({...interaction});

const normalizeRoleToken = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

const buildLogicalRoleKey = (entity: Entity): string | null => {
  if (!entity.label) {
    return null;
  }

  return `${entity.type}:${normalizeRoleToken(entity.label)}`;
};

const collectRemovedEntityIds = (moment: Moment): string[] => {
  const removedFromStateChanges = (moment.stateChanges ?? [])
    .filter((change) => change.type === 'remove')
    .map((change) => change.entityId);

  const removeEntitiesValue = (moment as unknown as {removeEntities?: unknown}).removeEntities;
  const removedFromLegacyField = Array.isArray(removeEntitiesValue)
    ? removeEntitiesValue.filter((value): value is string => typeof value === 'string')
    : [];

  return [...new Set([...removedFromStateChanges, ...removedFromLegacyField])];
};

const enforceSinglePrimary = (
  entityState: Map<string, Entity>,
  preferredPrimaryId?: string,
): void => {
  if (entityState.size === 0) {
    return;
  }

  const hasPreferredPrimary =
    preferredPrimaryId !== undefined && entityState.has(preferredPrimaryId);
  const carriedPrimaryId = [...entityState.values()].find(
    (entity) => entity.importance === 'primary',
  )?.id;
  const fallbackPrimaryId =
    (hasPreferredPrimary ? preferredPrimaryId : carriedPrimaryId) ??
    [...entityState.keys()][0];

  if (!fallbackPrimaryId) {
    return;
  }

  for (const [entityId, entity] of entityState.entries()) {
    entityState.set(entityId, {
      ...entity,
      importance: entityId === fallbackPrimaryId ? 'primary' : 'secondary',
    });
  }
};

export const buildIncrementalScenes = (
  moments: Moment[],
  options: BuildIncrementalScenesOptions = {},
): Moment[] => {
  const logger = options.logger ?? silentLogger;
  const scenes: Moment[] = [];
  const entityState = new Map<string, Entity>();
  const connectionState = new Map<string, Connection>();
  const interactionState = new Map<string, Interaction>();
  const roleToEntityId = new Map<string, string>();

  for (const moment of moments) {
    for (const entity of moment.entities) {
      const roleKey = buildLogicalRoleKey(entity);
      if (roleKey) {
        const previousEntityId = roleToEntityId.get(roleKey);
        if (
          previousEntityId &&
          previousEntityId !== entity.id &&
          entityState.has(previousEntityId)
        ) {
          logger.warn('Entity identity changed: layout will reset', {
            momentId: moment.id,
            role: roleKey,
            previousId: previousEntityId,
            nextId: entity.id,
          });
        }
        roleToEntityId.set(roleKey, entity.id);
      }

      const existing = entityState.get(entity.id);
      entityState.set(entity.id, {
        ...(existing ?? {}),
        ...cloneEntity(entity),
      });
    }

    const removedEntityIds = collectRemovedEntityIds(moment);
    for (const removedEntityId of removedEntityIds) {
      entityState.delete(removedEntityId);

      for (const [roleKey, entityId] of roleToEntityId.entries()) {
        if (entityId === removedEntityId) {
          roleToEntityId.delete(roleKey);
        }
      }
    }

    const preferredPrimaryId = moment.entities.find(
      (entity) => entity.importance === 'primary',
    )?.id;
    enforceSinglePrimary(entityState, preferredPrimaryId);

    for (const connection of moment.connections ?? []) {
      if (!entityState.has(connection.from) || !entityState.has(connection.to)) {
        logger.warn('State builder: skipping connection update with unknown entity ids', {
          momentId: moment.id,
          connectionId: connection.id,
          from: connection.from,
          to: connection.to,
        });
        continue;
      }

      connectionState.set(connection.id, cloneConnection(connection));
    }

    for (const [connectionId, connection] of connectionState.entries()) {
      if (!entityState.has(connection.from) || !entityState.has(connection.to)) {
        connectionState.delete(connectionId);
      }
    }

    for (const interaction of moment.interactions ?? []) {
      if (!entityState.has(interaction.from) || !entityState.has(interaction.to)) {
        logger.warn('State builder: skipping interaction update with unknown entity ids', {
          momentId: moment.id,
          interactionId: interaction.id,
          from: interaction.from,
          to: interaction.to,
        });
        continue;
      }

      interactionState.set(interaction.id, cloneInteraction(interaction));
    }

    for (const [interactionId, interaction] of interactionState.entries()) {
      if (!entityState.has(interaction.from) || !entityState.has(interaction.to)) {
        interactionState.delete(interactionId);
      }
    }

    scenes.push({
      ...moment,
      entities: [...entityState.values()].map(cloneEntity),
      connections: [...connectionState.values()].map(cloneConnection),
      interactions: [...interactionState.values()].map(cloneInteraction),
    });
  }

  return scenes;
};
