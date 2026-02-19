import type {LaidOutPlan, LaidOutScene} from '../schema/compiledPlan.schema.js';
import type {StoryIntent} from '../schema/storyIntent.schema.js';
import type {TopologyPlan, TopologyScene} from '../schema/topologyPlan.schema.js';
import {ComponentType} from '../../schema/visualGrammar.js';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

interface PixelPoint {
  x: number;
  y: number;
}

interface PixelAnchor {
  position: PixelPoint;
  halfWidth: number;
  halfHeight: number;
}

type Segment = [PixelPoint, PixelPoint];

interface SemanticAsk {
  decision_split: boolean;
  state_timing: boolean;
  distribution_skew: boolean;
  atomicity: boolean;
}

interface SemanticSupport {
  decision_split: 'none' | 'partial' | 'explicit';
  state_timing: 'none' | 'partial' | 'explicit';
  distribution_skew: 'none' | 'partial' | 'explicit';
  atomicity: 'none' | 'partial' | 'explicit';
}

export interface SceneGapReport {
  scene_id: string;
  timing: {start: number; end: number};
  required_components: string[];
  topology_component_types: string[];
  missing_required_components: string[];
  extra_topology_components: string[];
  transition_goal: string;
  topology_transition_type: string | null;
  topology_operation_types: string[];
  transition_alignment: 'aligned' | 'partial' | 'mismatch' | 'not_applicable';
  semantic_asks: SemanticAsk;
  semantic_support: SemanticSupport;
  layout_crossings: number;
  crossing_connection_pairs: string[];
}

export interface GapAnalysisReport {
  generated_at: string;
  scene_count: number;
  summary: {
    scenes_with_missing_components: number;
    scenes_with_transition_mismatch: number;
    scenes_with_connection_crossings: number;
    scenes_with_semantic_gap: number;
  };
  scenes: SceneGapReport[];
}

const toPixelPoint = (x: number, y: number): PixelPoint => ({
  x: (x / 100) * CANVAS_WIDTH,
  y: (y / 100) * CANVAS_HEIGHT,
});

const toAnchor = (
  entity: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
): PixelAnchor => ({
  position: toPixelPoint(entity.x, entity.y),
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

  if (o1 === 0 && onSegment(a1, a2, b1)) return true;
  if (o2 === 0 && onSegment(a1, a2, b2)) return true;
  if (o3 === 0 && onSegment(b1, b2, a1)) return true;
  if (o4 === 0 && onSegment(b1, b2, a2)) return true;

  return false;
};

const findCrossings = (layoutScene: LaidOutScene): string[] => {
  const entityById = new Map(layoutScene.laidOutEntities.map((entity) => [entity.id, entity]));
  const routedConnections = layoutScene.visibleConnections
    .map((connection) => {
      const fromEntity = entityById.get(connection.from);
      const toEntity = entityById.get(connection.to);
      if (!fromEntity || !toEntity) {
        return null;
      }

      return {
        from: connection.from,
        to: connection.to,
        points: routeConnectionPoints(toAnchor(fromEntity), toAnchor(toEntity), 0),
      };
    })
    .filter((value): value is {from: string; to: string; points: PixelPoint[]} => Boolean(value));

  const crossings: string[] = [];

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
        crossings.push(`${left.from}->${left.to} x ${right.from}->${right.to}`);
      }
    }
  }

  return crossings;
};

const detectSemanticAsks = (narration: string): SemanticAsk => {
  const text = narration.toLowerCase();
  return {
    decision_split:
      /\b(allow|allowed|permit|pass|block|blocked|deny|denied|reject|rejected|throttle|throttled)\b/.test(
        text,
      ),
    state_timing:
      /\b(token|counter|window|reset|refill|remaining|bucket|ttl|time[- ]?window)\b/.test(text),
    distribution_skew:
      /\b(hot[- ]?key|skew|partition|shard|per[- ]?key|key[- ]?space)\b/.test(text),
    atomicity: /\b(atomic|race|simultaneous|lock|compare[- ]?and[- ]?set|cas)\b/.test(text),
  };
};

const detectSemanticSupport = (scene: TopologyScene): SemanticSupport => {
  const componentTypes = new Set(scene.entities.map((entity) => entity.type));
  const hasBlockedFlow = scene.connections.some(
    (connection) =>
      connection.traffic_outcome === 'block' || connection.traffic_outcome === 'allow_and_block',
  );
  const hasAllowedFlow = scene.connections.some(
    (connection) => connection.connection_type !== 'static' && connection.traffic_outcome !== 'block',
  );
  const hasRateLimiterStateModel =
    componentTypes.has(ComponentType.RateLimiter) &&
    (componentTypes.has(ComponentType.Cache) || componentTypes.has(ComponentType.QueryCache));
  const hasShardingHints =
    componentTypes.has(ComponentType.ShardIndicator) ||
    componentTypes.has(ComponentType.ShardedDatabase);
  const hasAtomicityModel =
    componentTypes.has(ComponentType.AuthorizationLock) ||
    scene.connections.some((connection) => connection.kind === 'auth_request');

  return {
    decision_split: hasBlockedFlow && hasAllowedFlow ? 'explicit' : hasBlockedFlow ? 'partial' : 'none',
    state_timing: hasRateLimiterStateModel ? 'partial' : 'none',
    distribution_skew: hasShardingHints ? 'partial' : 'none',
    atomicity: hasAtomicityModel ? 'partial' : 'none',
  };
};

const expectedTransitionAction = (transitionGoal: string): string | null => {
  const normalized = transitionGoal.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (normalized.includes('insert_between')) return 'insert_between';
  if (normalized.includes('change_status')) return 'change_status';
  if (normalized.includes('scale')) return 'scale_entity';
  if (normalized.includes('reroute')) return 'reroute_connection';
  if (normalized.includes('add')) return 'add_entity';
  if (normalized.includes('remove')) return 'remove_entity';
  return null;
};

const resolveTransitionAlignment = (
  transitionGoal: string,
  scene: TopologyScene,
): SceneGapReport['transition_alignment'] => {
  const expectedAction = expectedTransitionAction(transitionGoal);
  if (!expectedAction) {
    return 'not_applicable';
  }

  const transitionType = scene.transition?.type ?? null;
  const operationTypes = new Set(scene.operations.map((operation) => operation.type));
  const hasExpectedOperation = operationTypes.has(expectedAction as never);
  const hasExpectedTransition = transitionType === expectedAction;

  if (hasExpectedOperation || hasExpectedTransition) {
    return 'aligned';
  }

  if (scene.operations.length > 0 || transitionType) {
    return 'partial';
  }

  return 'mismatch';
};

const hasSemanticGap = (asks: SemanticAsk, support: SemanticSupport): boolean =>
  (asks.decision_split && support.decision_split === 'none') ||
  (asks.state_timing && support.state_timing === 'none') ||
  (asks.distribution_skew && support.distribution_skew === 'none') ||
  (asks.atomicity && support.atomicity === 'none');

export const analyzeSceneGaps = ({
  storyIntent,
  topologyPlan,
  laidOutPlan,
}: {
  storyIntent: StoryIntent;
  topologyPlan: TopologyPlan;
  laidOutPlan: LaidOutPlan;
}): GapAnalysisReport => {
  const topologyById = new Map(topologyPlan.scenes.map((scene) => [scene.id, scene]));
  const layoutById = new Map(laidOutPlan.scenes.map((scene) => [scene.id, scene]));
  const reports: SceneGapReport[] = [];

  for (const storyScene of storyIntent.scenes) {
    const topologyScene = topologyById.get(storyScene.id);
    if (!topologyScene) {
      continue;
    }

    const layoutScene = layoutById.get(storyScene.id);
    const required = new Set(storyScene.required_component_types);
    const topologyTypes = topologyScene.entities.map((entity) => entity.type);
    const topologyTypeSet = new Set(topologyTypes);
    const missingRequired = [...required].filter((type) => !topologyTypeSet.has(type));
    const extraTypes = topologyTypes.filter((type) => !required.has(type));
    const asks = detectSemanticAsks(storyScene.narration);
    const support = detectSemanticSupport(topologyScene);
    const crossings = layoutScene ? findCrossings(layoutScene) : [];

    reports.push({
      scene_id: storyScene.id,
      timing: {start: storyScene.start, end: storyScene.end},
      required_components: [...required],
      topology_component_types: topologyTypes,
      missing_required_components: missingRequired,
      extra_topology_components: extraTypes,
      transition_goal: storyScene.transition_goal,
      topology_transition_type: topologyScene.transition?.type ?? null,
      topology_operation_types: topologyScene.operations.map((operation) => operation.type),
      transition_alignment: resolveTransitionAlignment(storyScene.transition_goal, topologyScene),
      semantic_asks: asks,
      semantic_support: support,
      layout_crossings: crossings.length,
      crossing_connection_pairs: crossings,
    });
  }

  return {
    generated_at: new Date().toISOString(),
    scene_count: reports.length,
    summary: {
      scenes_with_missing_components: reports.filter(
        (scene) => scene.missing_required_components.length > 0,
      ).length,
      scenes_with_transition_mismatch: reports.filter(
        (scene) => scene.transition_alignment === 'mismatch',
      ).length,
      scenes_with_connection_crossings: reports.filter((scene) => scene.layout_crossings > 0)
        .length,
      scenes_with_semantic_gap: reports.filter((scene) =>
        hasSemanticGap(scene.semantic_asks, scene.semantic_support),
      ).length,
    },
    scenes: reports,
  };
};
