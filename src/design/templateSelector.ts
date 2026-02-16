import type {Connection, Moment} from '../schema/moment.schema.js';
import {Templates, type TemplateId} from './templates.js';

const hasEntityAdditions = (previous: Moment | undefined, current: Moment): boolean => {
  if (!previous) {
    return current.entities.length > 0;
  }

  const previousIds = new Set(previous.entities.map((entity) => entity.id));
  return current.entities.some((entity) => !previousIds.has(entity.id));
};

const buildGraphDepth = (entities: Moment['entities'], connections: Connection[]): number => {
  if (connections.length === 0) {
    return 0;
  }

  const entityIds = new Set(entities.map((entity) => entity.id));
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, number>();
  const depthById = new Map<string, number>();

  for (const entity of entities) {
    outgoing.set(entity.id, new Set());
    incoming.set(entity.id, 0);
  }

  for (const connection of connections) {
    if (!entityIds.has(connection.from) || !entityIds.has(connection.to)) {
      continue;
    }

    const bucket = outgoing.get(connection.from);
    if (!bucket || bucket.has(connection.to)) {
      continue;
    }

    bucket.add(connection.to);
    incoming.set(connection.to, (incoming.get(connection.to) ?? 0) + 1);

    if (connection.direction === 'bidirectional') {
      const reverse = outgoing.get(connection.to);
      if (reverse && !reverse.has(connection.from)) {
        reverse.add(connection.from);
        incoming.set(connection.from, (incoming.get(connection.from) ?? 0) + 1);
      }
    }
  }

  const queue = [...incoming.entries()]
    .filter(([, count]) => count === 0)
    .map(([id]) => id)
    .sort((left, right) => left.localeCompare(right));

  for (const entityId of queue) {
    depthById.set(entityId, 0);
  }

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) {
      continue;
    }

    const currentDepth = depthById.get(currentId) ?? 0;
    const targets = outgoing.get(currentId);
    if (!targets) {
      continue;
    }

    for (const targetId of [...targets].sort((left, right) => left.localeCompare(right))) {
      const nextDepth = currentDepth + 1;
      if (nextDepth > (depthById.get(targetId) ?? 0)) {
        depthById.set(targetId, nextDepth);
      }

      const remainingIncoming = (incoming.get(targetId) ?? 0) - 1;
      incoming.set(targetId, remainingIncoming);
      if (remainingIncoming === 0) {
        queue.push(targetId);
      }
    }
  }

  for (const entity of entities) {
    if (!depthById.has(entity.id)) {
      depthById.set(entity.id, 0);
    }
  }

  return Math.max(...depthById.values());
};

export const selectTemplate = (
  moment: Moment,
  previousMoment?: Moment,
): TemplateId => {
  if (moment.entities.length === 1) {
    return 'HERO_FOCUS';
  }

  const hasAdded = hasEntityAdditions(previousMoment, moment);
  const previousCount = previousMoment?.entities.length ?? 0;
  if (hasAdded && previousCount <= 2) {
    return 'PROGRESSIVE_REVEAL';
  }

  const connections = moment.connections ?? [];
  const graphDepth = buildGraphDepth(moment.entities, connections);
  if (graphDepth > 1) {
    return 'ARCHITECTURE_FLOW';
  }

  if (moment.entities.length >= 2 && moment.entities.length <= 4 && connections.length === 0) {
    return 'COMPARISON_SPLIT';
  }

  return 'ARCHITECTURE_FLOW';
};

export const DEFAULT_TEMPLATE_ID: TemplateId = 'ARCHITECTURE_FLOW';
export const DEFAULT_TEMPLATE = Templates[DEFAULT_TEMPLATE_ID];
