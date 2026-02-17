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
  if (total < 5) {
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

  return {
    ...scene,
    laidOutEntities,
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
