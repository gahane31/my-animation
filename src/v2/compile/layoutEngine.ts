import {COMPONENT_CATALOG} from '../catalog/componentCatalog.js';
import {
  laidOutPlanSchema,
  type CompositionPlan,
  type CompositionScene,
  type LaidOutPlan,
  type LaidOutScene,
} from '../schema/compiledPlan.schema.js';

interface Position {
  x: number;
  y: number;
}

interface PixelPoint {
  x: number;
  y: number;
}

interface PixelAnchor {
  position: PixelPoint;
  halfWidth: number;
  halfHeight: number;
}

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

const STACK_CENTER_X = 50;
const STACK_TOP_Y = 7;
const STACK_BOTTOM_Y = 95;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalizeDimension = (value: number, axis: 'x' | 'y'): number =>
  axis === 'x' ? (value / CANVAS_WIDTH) * 100 : (value / CANVAS_HEIGHT) * 100;

const resolveChainPosition = (
  index: number,
  total: number,
  minY: number,
  maxY: number,
): Position => {
  if (total <= 1) {
    return {x: STACK_CENTER_X, y: (minY + maxY) / 2};
  }

  const step = (maxY - minY) / Math.max(1, total - 1);
  return {
    x: STACK_CENTER_X,
    y: minY + step * index,
  };
};

const resolveHorizontalBounds = (
  scene: CompositionScene,
): {leftX: number; centerX: number; rightX: number} => {
  const maxHalfWidth = scene.visibleEntities.reduce((largestHalfWidth, entity) => {
    const definition = COMPONENT_CATALOG[entity.type];
    const width = definition?.dimensions.width ?? 150;
    const halfWidth = normalizeDimension(width, 'x') / 2;
    return Math.max(largestHalfWidth, halfWidth);
  }, 0);

  const leftLimit = maxHalfWidth + 6;
  const rightLimit = 100 - maxHalfWidth - 6;
  const maxOffset = Math.max(10, Math.min(24, 50 - leftLimit, rightLimit - 50));

  return {
    leftX: clamp(50 - maxOffset, leftLimit, 50),
    centerX: STACK_CENTER_X,
    rightX: clamp(50 + maxOffset, 50, rightLimit),
  };
};

const resolveHorizontalPosition = (
  scene: CompositionScene,
  entity: CompositionScene['visibleEntities'][number],
  nonReplicaRank: number,
  total: number,
): number => {
  if (total <= 5) {
    return STACK_CENTER_X;
  }

  const bounds = resolveHorizontalBounds(scene);
  if (Math.round(entity.count ?? 1) > 1) {
    return STACK_CENTER_X;
  }

  return nonReplicaRank % 2 === 0 ? bounds.rightX : bounds.leftX;
};

const resolveVerticalBounds = (scene: CompositionScene): {minY: number; maxY: number} => {
  const entityCount = scene.visibleEntities.length;
  const requestedReserveBottomPercent = scene.directives?.camera.reserve_bottom_percent;
  const reserveBottomPercent = clamp(
    requestedReserveBottomPercent == null
      ? 8
      : entityCount >= 6
        ? Math.min(requestedReserveBottomPercent, 10)
        : requestedReserveBottomPercent,
    0,
    35,
  );
  const maxLayoutBottomY = clamp(100 - reserveBottomPercent - 1.5, 52, STACK_BOTTOM_Y);
  const maxHalfHeight = scene.visibleEntities.reduce((largestHalfHeight, entity) => {
    const definition = COMPONENT_CATALOG[entity.type];
    const height = definition?.dimensions.height ?? 120;
    const halfHeight = normalizeDimension(height, 'y') / 2;
    return Math.max(largestHalfHeight, halfHeight);
  }, 0);

  const boundedTop = Math.max(STACK_TOP_Y, maxHalfHeight);
  const boundedBottom = Math.min(maxLayoutBottomY, 100 - maxHalfHeight);

  if (boundedTop >= boundedBottom) {
    const mid = (STACK_TOP_Y + STACK_BOTTOM_Y) / 2;
    return {
      minY: clamp(mid - 10, 0, 100),
      maxY: clamp(mid + 10, 0, 100),
    };
  }

  const span = boundedBottom - boundedTop;
  const spanFactor =
    entityCount <= 2
      ? 0.84
      : entityCount === 3
        ? 0.92
        : entityCount === 4
          ? 0.98
          : 1;
  const adjustedSpan = span * spanFactor;
  const centerY = (boundedTop + boundedBottom) / 2;
  const adjustedTop = clamp(centerY - adjustedSpan / 2, boundedTop, boundedBottom);
  const adjustedBottom = clamp(centerY + adjustedSpan / 2, boundedTop, boundedBottom);

  return {
    minY: adjustedTop,
    maxY: adjustedBottom,
  };
};

type Segment = [PixelPoint, PixelPoint];

const toPixelPoint = (position: Position): PixelPoint => ({
  x: (position.x / 100) * CANVAS_WIDTH,
  y: (position.y / 100) * CANVAS_HEIGHT,
});

const toPixelAnchor = (
  entity: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  overrideX?: number,
): PixelAnchor => ({
  position: toPixelPoint({
    x: overrideX ?? entity.x,
    y: entity.y,
  }),
  halfWidth: Math.max(22, entity.width / 2),
  halfHeight: Math.max(22, entity.height / 2),
});

const routeConnectionPoints = (
  from: PixelAnchor,
  to: PixelAnchor,
  laneOffset = 0,
): PixelPoint[] => {
  const deltaXRaw = to.position.x - from.position.x;
  const deltaYRaw = to.position.y - from.position.y;
  const isVerticalRoute = Math.abs(deltaYRaw) >= Math.abs(deltaXRaw);

  if (isVerticalRoute) {
    const direction = to.position.y >= from.position.y ? 1 : -1;
    const start: PixelPoint = {
      x: from.position.x,
      y: from.position.y + direction * from.halfHeight,
    };
    const end: PixelPoint = {
      x: to.position.x,
      y: to.position.y - direction * to.halfHeight,
    };
    const deltaX = end.x - start.x;

    if (laneOffset === 0) {
      return [start, end];
    }

    if (Math.abs(deltaX) <= 24) {
      const laneX = start.x + laneOffset;
      const midY = (start.y + end.y) / 2;
      return [start, {x: laneX, y: midY}, end];
    }

    const turnY = (start.y + end.y) / 2;
    return [start, {x: start.x, y: turnY}, {x: end.x, y: turnY}, end];
  }

  const direction = to.position.x >= from.position.x ? 1 : -1;
  const start: PixelPoint = {
    x: from.position.x + direction * from.halfWidth,
    y: from.position.y,
  };
  const end: PixelPoint = {
    x: to.position.x - direction * to.halfWidth,
    y: to.position.y,
  };
  const deltaY = end.y - start.y;

  if (laneOffset === 0 && Math.abs(deltaY) <= 24) {
    return [start, end];
  }

  if (Math.abs(deltaY) <= 24) {
    const midX = (start.x + end.x) / 2;
    const laneY = start.y + laneOffset;
    return [start, {x: midX, y: laneY}, end];
  }

  const turnX = (start.x + end.x) / 2;
  return [start, {x: turnX, y: start.y}, {x: turnX, y: end.y}, end];
};

const toSegments = (points: PixelPoint[]): Segment[] => {
  const segments: Segment[] = [];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    if (previous && current) {
      segments.push([previous, current]);
    }
  }

  return segments;
};

const orientation = (left: PixelPoint, middle: PixelPoint, right: PixelPoint): number => {
  const value =
    (middle.x - left.x) * (right.y - left.y) -
    (middle.y - left.y) * (right.x - left.x);

  if (Math.abs(value) < 1e-6) {
    return 0;
  }

  return value > 0 ? 1 : -1;
};

const onSegment = (left: PixelPoint, right: PixelPoint, candidate: PixelPoint): boolean =>
  candidate.x >= Math.min(left.x, right.x) - 1e-6 &&
  candidate.x <= Math.max(left.x, right.x) + 1e-6 &&
  candidate.y >= Math.min(left.y, right.y) - 1e-6 &&
  candidate.y <= Math.max(left.y, right.y) + 1e-6;

const segmentsIntersect = (left: Segment, right: Segment): boolean => {
  const [a1, a2] = left;
  const [b1, b2] = right;

  if (!a1 || !a2 || !b1 || !b2) {
    return false;
  }

  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  if (o1 === 0 && onSegment(a1, a2, b1)) {
    return true;
  }
  if (o2 === 0 && onSegment(a1, a2, b2)) {
    return true;
  }
  if (o3 === 0 && onSegment(b1, b2, a1)) {
    return true;
  }
  if (o4 === 0 && onSegment(b1, b2, a2)) {
    return true;
  }

  return false;
};

interface RoutedConnection {
  id: string;
  from: string;
  to: string;
  points: PixelPoint[];
}

const routeVisibleConnections = (
  scene: CompositionScene,
  entitiesById: Map<
    string,
    {
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  >,
  xById: Map<string, number>,
): RoutedConnection[] => {
  const routed: RoutedConnection[] = [];

  for (const connection of scene.visibleConnections) {
    const fromEntity = entitiesById.get(connection.from);
    const toEntity = entitiesById.get(connection.to);
    if (!fromEntity || !toEntity) {
      continue;
    }

    const fromAnchor = toPixelAnchor(fromEntity, xById.get(fromEntity.id));
    const toAnchor = toPixelAnchor(toEntity, xById.get(toEntity.id));
    routed.push({
      id: connection.id,
      from: connection.from,
      to: connection.to,
      points: routeConnectionPoints(fromAnchor, toAnchor, 0),
    });
  }

  return routed;
};

const computeLayoutCost = (
  scene: CompositionScene,
  entitiesById: Map<
    string,
    {
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  >,
  xById: Map<string, number>,
  initialXById: Map<string, number>,
): number => {
  const routedConnections = routeVisibleConnections(scene, entitiesById, xById);

  let totalPolylineLength = 0;
  for (const routed of routedConnections) {
    const segments = toSegments(routed.points);
    for (const [start, end] of segments) {
      if (!start || !end) {
        continue;
      }
      totalPolylineLength += Math.hypot(end.x - start.x, end.y - start.y);
    }
  }

  let crossingCount = 0;
  for (let leftIndex = 0; leftIndex < routedConnections.length; leftIndex += 1) {
    const left = routedConnections[leftIndex];
    if (!left) {
      continue;
    }

    for (let rightIndex = leftIndex + 1; rightIndex < routedConnections.length; rightIndex += 1) {
      const right = routedConnections[rightIndex];
      if (!right) {
        continue;
      }

      const sharesEndpoint =
        left.from === right.from ||
        left.from === right.to ||
        left.to === right.from ||
        left.to === right.to;
      if (sharesEndpoint) {
        continue;
      }

      const leftSegments = toSegments(left.points);
      const rightSegments = toSegments(right.points);
      const intersects = leftSegments.some((leftSegment) =>
        rightSegments.some((rightSegment) => segmentsIntersect(leftSegment, rightSegment)),
      );

      if (intersects) {
        crossingCount += 1;
      }
    }
  }

  let deviation = 0;
  for (const [entityId, initialX] of initialXById.entries()) {
    deviation += Math.abs((xById.get(entityId) ?? initialX) - initialX);
  }

  // Strongly prefer no crossings, then shorter routes, then stable x drift.
  return crossingCount * 1_000_000 + totalPolylineLength + deviation * 90;
};

const optimizeHorizontalPositions = (
  scene: CompositionScene,
  laidOutEntities: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    count?: number;
  }>,
): Map<string, number> => {
  if (laidOutEntities.length <= 5 || scene.visibleConnections.length < 3) {
    return new Map(laidOutEntities.map((entity) => [entity.id, entity.x]));
  }

  const bounds = resolveHorizontalBounds(scene);
  const candidateXs = Array.from(
    new Set([
      bounds.leftX,
      (bounds.leftX + bounds.centerX) / 2,
      bounds.centerX,
      (bounds.centerX + bounds.rightX) / 2,
      bounds.rightX,
    ]),
  ).sort((left, right) => left - right);

  const entitiesById = new Map(laidOutEntities.map((entity) => [entity.id, entity]));
  const initialXById = new Map(laidOutEntities.map((entity) => [entity.id, entity.x]));
  const xById = new Map(initialXById);

  const movableEntityIds = laidOutEntities
    .filter((entity, index) => index > 0 && Math.round(entity.count ?? 1) <= 1)
    .map((entity) => entity.id);

  for (let pass = 0; pass < 4; pass += 1) {
    let improvedInPass = false;

    for (const entityId of movableEntityIds) {
      const currentX = xById.get(entityId);
      if (currentX == null) {
        continue;
      }

      let bestX = currentX;
      let bestCost = computeLayoutCost(scene, entitiesById, xById, initialXById);
      const sortedCandidates = [...candidateXs].sort(
        (left, right) => Math.abs(left - currentX) - Math.abs(right - currentX),
      );

      for (const candidateX of sortedCandidates) {
        if (Math.abs(candidateX - currentX) < 1e-3) {
          continue;
        }

        xById.set(entityId, candidateX);
        const candidateCost = computeLayoutCost(scene, entitiesById, xById, initialXById);
        if (candidateCost + 1e-3 < bestCost) {
          bestCost = candidateCost;
          bestX = candidateX;
          improvedInPass = true;
        }
      }

      xById.set(entityId, bestX);
    }

    if (!improvedInPass) {
      break;
    }
  }

  return xById;
};

const placeScene = (scene: CompositionScene): LaidOutScene => {
  const orderedEntities = [...scene.visibleEntities];
  const {minY, maxY} = resolveVerticalBounds(scene);
  const orderedIndexById = new Map(
    orderedEntities.map((entity, index) => [entity.id, index]),
  );
  const nonReplicaRankById = new Map<string, number>();
  let nonReplicaRank = 0;
  for (const entity of orderedEntities) {
    if (Math.round(entity.count ?? 1) <= 1) {
      nonReplicaRankById.set(entity.id, nonReplicaRank);
      nonReplicaRank += 1;
    }
  }

  const laidOutEntities = orderedEntities.map((entity) => {
    const componentDefinition = COMPONENT_CATALOG[entity.type];
    const entityIndex = orderedIndexById.get(entity.id) ?? 0;
    const resolved = resolveChainPosition(entityIndex, orderedEntities.length, minY, maxY);
    const resolvedX = resolveHorizontalPosition(
      scene,
      entity,
      nonReplicaRankById.get(entity.id) ?? entityIndex,
      orderedEntities.length,
    );

    return {
      ...entity,
      x: resolvedX,
      y: resolved.y,
      width: componentDefinition.dimensions.width,
      height: componentDefinition.dimensions.height,
    };
  });

  const optimizedXById = optimizeHorizontalPositions(scene, laidOutEntities);
  const optimizedEntities = laidOutEntities.map((entity) => ({
    ...entity,
    x: optimizedXById.get(entity.id) ?? entity.x,
  }));

  return {
    ...scene,
    laidOutEntities: optimizedEntities,
  };
};

export const layoutCompositionPlan = (compositionPlan: CompositionPlan): LaidOutPlan => {
  const scenes = compositionPlan.scenes
    .sort((left, right) => left.start - right.start)
    .map((scene) => placeScene(scene));

  return laidOutPlanSchema.parse({
    duration: compositionPlan.duration,
    scenes,
  });
};
