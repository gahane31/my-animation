import type {
  Connection,
  DesignedEntity,
  DesignedMoment,
  Entity,
  Moment,
} from '../schema/moment.schema.js';
import {getTemplateDefinition, type TemplateId} from './templates.js';

const SAFE_LEFT = 10;
const SAFE_RIGHT = 90;
const SAFE_TOP = 35;
const SAFE_BOTTOM = 75;

const PRIMARY_CENTER_X = 50;
const PRIMARY_CENTER_Y = 55;

const SECONDARY_BASE_Y = 68;
const SECONDARY_GAP_Y = 9;
const SECONDARY_OFFSET_X = 10;
const MIN_LAYOUT_GAP = 8;
const NUDGE_STEP = 8;

const clampPercent = (value: number): number => Math.min(100, Math.max(0, value));

const sortEntitiesInLayer = (entities: Entity[]): Entity[] =>
  [...entities].sort((left, right) => {
    const leftRank = left.importance === 'primary' ? 0 : 1;
    const rightRank = right.importance === 'primary' ? 0 : 1;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.id.localeCompare(right.id);
  });

const getPrimaryEntityId = (entities: Entity[]): string =>
  entities.find((entity) => entity.importance === 'primary')?.id ?? entities[0]?.id ?? '';

interface GraphData {
  outgoing: Map<string, Set<string>>;
  incomingCount: Map<string, number>;
}

const buildGraph = (entities: Entity[], connections: Connection[]): GraphData => {
  const ids = new Set(entities.map((entity) => entity.id));
  const outgoing = new Map<string, Set<string>>();
  const incomingCount = new Map<string, number>();

  entities.forEach((entity) => {
    outgoing.set(entity.id, new Set<string>());
    incomingCount.set(entity.id, 0);
  });

  for (const connection of connections) {
    if (!ids.has(connection.from) || !ids.has(connection.to)) {
      continue;
    }

    const fromEdges = outgoing.get(connection.from);
    if (!fromEdges || fromEdges.has(connection.to)) {
      continue;
    }

    fromEdges.add(connection.to);
    incomingCount.set(connection.to, (incomingCount.get(connection.to) ?? 0) + 1);

    if (connection.direction === 'bidirectional') {
      const reverseEdges = outgoing.get(connection.to);
      if (reverseEdges && !reverseEdges.has(connection.from)) {
        reverseEdges.add(connection.from);
        incomingCount.set(connection.from, (incomingCount.get(connection.from) ?? 0) + 1);
      }
    }
  }

  return {outgoing, incomingCount};
};

const computeDepthById = (entities: Entity[], connections: Connection[]): Map<string, number> => {
  const {outgoing, incomingCount} = buildGraph(entities, connections);
  const depthById = new Map<string, number>();

  const queue = [...entities]
    .map((entity) => entity.id)
    .filter((id) => (incomingCount.get(id) ?? 0) === 0)
    .sort((left, right) => left.localeCompare(right));

  for (const id of queue) {
    depthById.set(id, 0);
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

      const nextIncoming = (incomingCount.get(targetId) ?? 0) - 1;
      incomingCount.set(targetId, nextIncoming);
      if (nextIncoming === 0) {
        queue.push(targetId);
      }
    }
  }

  for (const entity of entities) {
    if (!depthById.has(entity.id)) {
      depthById.set(entity.id, 0);
    }
  }

  return depthById;
};

const buildHeroFocusLayout = (entities: Entity[]): Map<string, {x: number; y: number}> => {
  const layoutById = new Map<string, {x: number; y: number}>();
  const primaryId = getPrimaryEntityId(entities);

  if (!primaryId) {
    return layoutById;
  }

  layoutById.set(primaryId, {x: PRIMARY_CENTER_X, y: PRIMARY_CENTER_Y});

  const secondaryEntities = entities.filter((entity) => entity.id !== primaryId);
  secondaryEntities.forEach((entity, index) => {
    const direction = index % 2 === 0 ? -1 : 1;
    const row = Math.floor(index / 2);
    layoutById.set(entity.id, {
      x: clampPercent(PRIMARY_CENTER_X + direction * (SECONDARY_OFFSET_X + row * 4)),
      y: clampPercent(SECONDARY_BASE_Y + row * SECONDARY_GAP_Y),
    });
  });

  return layoutById;
};

const buildGraphHorizontalLayout = (
  entities: Entity[],
  connections: Connection[],
): Map<string, {x: number; y: number}> => {
  if (connections.length === 0) {
    return buildHeroFocusLayout(entities);
  }

  const depthById = computeDepthById(entities, connections);
  const maxDepth = Math.max(...depthById.values());
  const layerCount = Math.max(1, maxDepth + 1);
  const layerWidth = (SAFE_RIGHT - SAFE_LEFT) / layerCount;
  const layoutById = new Map<string, {x: number; y: number}>();

  for (let layerIndex = 0; layerIndex < layerCount; layerIndex += 1) {
    const layerEntities = sortEntitiesInLayer(
      entities.filter((entity) => (depthById.get(entity.id) ?? 0) === layerIndex),
    );
    if (layerEntities.length === 0) {
      continue;
    }

    const x = layerCount === 1 ? PRIMARY_CENTER_X : SAFE_LEFT + layerIndex * layerWidth;
    const verticalGap = (SAFE_BOTTOM - SAFE_TOP) / (layerEntities.length + 1);

    layerEntities.forEach((entity, index) => {
      layoutById.set(entity.id, {
        x: clampPercent(x),
        y: clampPercent(SAFE_TOP + verticalGap * (index + 1)),
      });
    });
  }

  return layoutById;
};

const buildGraphVerticalLayout = (
  entities: Entity[],
  connections: Connection[],
): Map<string, {x: number; y: number}> => {
  if (connections.length === 0) {
    return buildHeroFocusLayout(entities);
  }

  const depthById = computeDepthById(entities, connections);
  const maxDepth = Math.max(...depthById.values());
  const layerCount = Math.max(1, maxDepth + 1);
  const layerHeight = (SAFE_BOTTOM - SAFE_TOP) / layerCount;
  const layoutById = new Map<string, {x: number; y: number}>();

  for (let layerIndex = 0; layerIndex < layerCount; layerIndex += 1) {
    const layerEntities = sortEntitiesInLayer(
      entities.filter((entity) => (depthById.get(entity.id) ?? 0) === layerIndex),
    );
    if (layerEntities.length === 0) {
      continue;
    }

    const y = layerCount === 1 ? PRIMARY_CENTER_Y : SAFE_TOP + layerIndex * layerHeight;
    const horizontalGap = (SAFE_RIGHT - SAFE_LEFT) / (layerEntities.length + 1);

    layerEntities.forEach((entity, index) => {
      layoutById.set(entity.id, {
        x: clampPercent(SAFE_LEFT + horizontalGap * (index + 1)),
        y: clampPercent(y),
      });
    });
  }

  return layoutById;
};

const buildComparisonSplitLayout = (entities: Entity[]): Map<string, {x: number; y: number}> => {
  const layoutById = new Map<string, {x: number; y: number}>();
  const ordered = sortEntitiesInLayer(entities);

  ordered.forEach((entity, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);

    const x = column === 0 ? 30 : 70;
    const y = clampPercent(55 + row * 14);

    layoutById.set(entity.id, {x, y});
  });

  return layoutById;
};

const buildProgressiveRevealLayout = (
  entities: Entity[],
  previousMoment?: DesignedMoment,
): Map<string, {x: number; y: number}> => {
  const layoutById = new Map<string, {x: number; y: number}>();
  const previousIds = new Set(previousMoment?.entities.map((entity) => entity.id) ?? []);
  const previousPrimaryId =
    previousMoment?.entities.find((entity) => entity.importance === 'primary')?.id ??
    previousMoment?.entities[0]?.id;
  const currentPrimaryId = getPrimaryEntityId(entities);

  const centerId =
    previousPrimaryId && entities.some((entity) => entity.id === previousPrimaryId)
      ? previousPrimaryId
      : currentPrimaryId;

  if (centerId) {
    layoutById.set(centerId, {x: PRIMARY_CENTER_X, y: PRIMARY_CENTER_Y});
  }

  const ringEntities = entities.filter((entity) => entity.id !== centerId);
  const newEntities = ringEntities.filter((entity) => !previousIds.has(entity.id));
  const existingEntities = ringEntities.filter((entity) => previousIds.has(entity.id));

  const placeRing = (
    ringList: Entity[],
    radiusX: number,
    radiusY: number,
    startAngle: number,
  ): void => {
    const count = ringList.length;
    if (count === 0) {
      return;
    }

    ringList.forEach((entity, index) => {
      const angle = startAngle + (index / Math.max(1, count)) * Math.PI * 2;
      const x = PRIMARY_CENTER_X + Math.cos(angle) * radiusX;
      const y = PRIMARY_CENTER_Y + Math.sin(angle) * radiusY;
      layoutById.set(entity.id, {
        x: clampPercent(x),
        y: clampPercent(y),
      });
    });
  };

  // New entities are slightly closer to center to emphasize reveal.
  placeRing(newEntities, 16, 11, -Math.PI / 2);
  placeRing(existingEntities, 24, 16, Math.PI / 3);

  return layoutById;
};

const withLayout = (entity: Entity, layout: {x: number; y: number}): DesignedEntity => ({
  ...entity,
  layout,
});

const distance = (left: {x: number; y: number}, right: {x: number; y: number}): number =>
  Math.hypot(left.x - right.x, left.y - right.y);

const hasCollision = (
  candidate: {x: number; y: number},
  occupied: Array<{x: number; y: number}>,
  minGap = MIN_LAYOUT_GAP,
): boolean => occupied.some((position) => distance(candidate, position) < minGap);

const findNearestFreePosition = (
  target: {x: number; y: number},
  occupied: Array<{x: number; y: number}>,
): {x: number; y: number} => {
  const clampedTarget = {x: clampPercent(target.x), y: clampPercent(target.y)};
  if (!hasCollision(clampedTarget, occupied)) {
    return clampedTarget;
  }

  const offsets: Array<{x: number; y: number}> = [
    {x: 0, y: NUDGE_STEP},
    {x: 0, y: -NUDGE_STEP},
    {x: NUDGE_STEP, y: 0},
    {x: -NUDGE_STEP, y: 0},
    {x: NUDGE_STEP, y: NUDGE_STEP},
    {x: NUDGE_STEP, y: -NUDGE_STEP},
    {x: -NUDGE_STEP, y: NUDGE_STEP},
    {x: -NUDGE_STEP, y: -NUDGE_STEP},
    {x: NUDGE_STEP * 2, y: 0},
    {x: -NUDGE_STEP * 2, y: 0},
    {x: 0, y: NUDGE_STEP * 2},
    {x: 0, y: -NUDGE_STEP * 2},
  ];

  for (const offset of offsets) {
    const candidate = {
      x: clampPercent(target.x + offset.x),
      y: clampPercent(target.y + offset.y),
    };

    if (!hasCollision(candidate, occupied)) {
      return candidate;
    }
  }

  return clampedTarget;
};

const applyStableAnchors = (
  entities: Entity[],
  computedLayout: Map<string, {x: number; y: number}>,
  previousMoment?: DesignedMoment,
): Map<string, {x: number; y: number}> => {
  if (!previousMoment) {
    return computedLayout;
  }

  const previousLayoutById = new Map(
    previousMoment.entities.map((entity) => [entity.id, entity.layout]),
  );
  const stabilizedLayout = new Map<string, {x: number; y: number}>();
  const occupied: Array<{x: number; y: number}> = [];

  for (const entity of entities) {
    const previousLayout = previousLayoutById.get(entity.id);
    if (!previousLayout) {
      continue;
    }

    const anchored = {
      x: clampPercent(previousLayout.x),
      y: clampPercent(previousLayout.y),
    };
    stabilizedLayout.set(entity.id, anchored);
    occupied.push(anchored);
  }

  for (const entity of entities) {
    if (stabilizedLayout.has(entity.id)) {
      continue;
    }

    const preferredPosition = computedLayout.get(entity.id) ?? {x: PRIMARY_CENTER_X, y: PRIMARY_CENTER_Y};
    const placed = findNearestFreePosition(preferredPosition, occupied);
    stabilizedLayout.set(entity.id, placed);
    occupied.push(placed);
  }

  return stabilizedLayout;
};

export interface LayoutContext {
  templateId?: TemplateId;
  previousMoment?: DesignedMoment;
}

export const applyLayoutToMoment = (
  moment: Moment,
  context: LayoutContext = {},
): DesignedMoment => {
  const templateId = context.templateId ?? moment.template ?? 'ARCHITECTURE_FLOW';
  const template = getTemplateDefinition(templateId);
  const connections = moment.connections ?? [];

  let layoutById: Map<string, {x: number; y: number}>;

  switch (template.layout) {
    case 'center':
      layoutById = buildHeroFocusLayout(moment.entities);
      break;
    case 'graph_vertical':
      layoutById = buildGraphVerticalLayout(moment.entities, connections);
      break;
    case 'split':
      layoutById = buildComparisonSplitLayout(moment.entities);
      break;
    case 'radial':
      layoutById = buildProgressiveRevealLayout(moment.entities, context.previousMoment);
      break;
    case 'graph_horizontal':
    default:
      layoutById = buildGraphHorizontalLayout(moment.entities, connections);
      break;
  }

  const stabilizedLayout = applyStableAnchors(moment.entities, layoutById, context.previousMoment);

  const entitiesWithLayout = moment.entities.map((entity) =>
    withLayout(entity, stabilizedLayout.get(entity.id) ?? {x: PRIMARY_CENTER_X, y: PRIMARY_CENTER_Y}),
  );

  return {
    ...moment,
    template: templateId,
    entities: entitiesWithLayout,
  };
};
