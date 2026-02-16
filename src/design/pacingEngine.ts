import {VIDEO_LIMITS} from '../config/constants.js';
import {HookTokens} from '../config/hookTokens.js';
import type {Moment} from '../schema/moment.schema.js';
import type {StoryPlan} from '../schema/storyPlannerSchema.js';

const MIN_DURATION_SECONDS = 1.2;
const REQUESTED_MAX_DURATION_SECONDS = 6;
// Respect structural-idle guidance while allowing longer active scenes.
const EFFECTIVE_MAX_DURATION_SECONDS = Math.min(
  REQUESTED_MAX_DURATION_SECONDS,
  VIDEO_LIMITS.maxStructuralIdleSeconds,
);

interface PacingEntityDiff {
  type: 'entity_added' | 'entity_status_changed' | 'primary_added';
  entityId: string;
}

interface PacingConnectionDiff {
  type: 'connection_added' | 'connection_removed';
  connectionId: string;
}

export interface PacingDiff {
  entityDiffs: PacingEntityDiff[];
  connectionDiffs: PacingConnectionDiff[];
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0);

const distributeDelta = (
  durations: number[],
  totalDuration: number,
  minDuration: number,
  maxDuration: number,
): number[] => {
  const adjusted = [...durations];
  let delta = totalDuration - sum(adjusted);
  const EPSILON = 1e-6;

  if (Math.abs(delta) <= EPSILON) {
    return adjusted;
  }

  if (delta > 0) {
    while (delta > EPSILON) {
      const expandableIndexes = adjusted
        .map((value, index) => ({index, room: maxDuration - value}))
        .filter((entry) => entry.room > EPSILON);

      if (expandableIndexes.length === 0) {
        break;
      }

      const perBucket = delta / expandableIndexes.length;
      for (const entry of expandableIndexes) {
        const add = Math.min(entry.room, perBucket);
        adjusted[entry.index] += add;
        delta -= add;
      }
    }
  } else {
    delta = Math.abs(delta);
    while (delta > EPSILON) {
      const shrinkableIndexes = adjusted
        .map((value, index) => ({index, room: value - minDuration}))
        .filter((entry) => entry.room > EPSILON);

      if (shrinkableIndexes.length === 0) {
        break;
      }

      const perBucket = delta / shrinkableIndexes.length;
      for (const entry of shrinkableIndexes) {
        const remove = Math.min(entry.room, perBucket);
        adjusted[entry.index] -= remove;
        delta -= remove;
      }
    }
  }

  return adjusted;
};

export const buildPacingDiffs = (moments: Moment[]): PacingDiff[] =>
  moments.map((moment, index) => {
    const previous = index > 0 ? moments[index - 1] : undefined;
    if (!previous) {
      return {
        entityDiffs: moment.entities.map((entity) => ({
          type: entity.importance === 'primary' ? 'primary_added' : 'entity_added',
          entityId: entity.id,
        })),
        connectionDiffs: (moment.connections ?? []).map((connection) => ({
          type: 'connection_added',
          connectionId: connection.id,
        })),
      };
    }

    const previousEntityById = new Map(previous.entities.map((entity) => [entity.id, entity]));
    const currentEntityById = new Map(moment.entities.map((entity) => [entity.id, entity]));
    const previousConnectionIds = new Set((previous.connections ?? []).map((connection) => connection.id));
    const currentConnectionIds = new Set((moment.connections ?? []).map((connection) => connection.id));

    const entityDiffs: PacingEntityDiff[] = [];
    const connectionDiffs: PacingConnectionDiff[] = [];

    for (const entity of moment.entities) {
      const prevEntity = previousEntityById.get(entity.id);

      if (!prevEntity) {
        entityDiffs.push({
          type: entity.importance === 'primary' ? 'primary_added' : 'entity_added',
          entityId: entity.id,
        });
        continue;
      }

      if (prevEntity.status !== entity.status) {
        entityDiffs.push({
          type: 'entity_status_changed',
          entityId: entity.id,
        });
      }
    }

    for (const connectionId of currentConnectionIds) {
      if (!previousConnectionIds.has(connectionId)) {
        connectionDiffs.push({
          type: 'connection_added',
          connectionId,
        });
      }
    }

    for (const connectionId of previousConnectionIds) {
      if (!currentConnectionIds.has(connectionId)) {
        connectionDiffs.push({
          type: 'connection_removed',
          connectionId,
        });
      }
    }

    // Track entity removals as connection-like changes to reflect visual complexity.
    for (const previousEntityId of previousEntityById.keys()) {
      if (!currentEntityById.has(previousEntityId)) {
        connectionDiffs.push({
          type: 'connection_removed',
          connectionId: `entity_removed:${previousEntityId}`,
        });
      }
    }

    return {
      entityDiffs,
      connectionDiffs,
    };
  });

export const applyNarrativePacing = (
  moments: Moment[],
  diffs: PacingDiff[],
  storyPlan: Pick<StoryPlan, 'duration'>,
): Moment[] => {
  if (moments.length === 0) {
    return [];
  }

  if (moments.length === 1) {
    const onlyMoment = moments[0];
    if (!onlyMoment) {
      return [];
    }

    return [
      {
        ...onlyMoment,
        start: 0,
        end: storyPlan.duration,
      },
    ];
  }

  const totalDuration = storyPlan.duration;
  const weights = moments.map((moment, index) => {
    let weight = 1.0;
    const diff = diffs[index];
    const entityDiffs = diff?.entityDiffs ?? [];
    const connectionDiffs = diff?.connectionDiffs ?? [];

    const addedEntities = entityDiffs.filter((entry) => entry.type === 'entity_added');
    const primaryAddedEntities = entityDiffs.filter((entry) => entry.type === 'primary_added');
    const statusChanges = entityDiffs.filter((entry) => entry.type === 'entity_status_changed');

    weight += addedEntities.length * 0.5;
    weight += primaryAddedEntities.length * 0.5;
    weight += statusChanges.length * 0.7;

    const changeCount = entityDiffs.length + connectionDiffs.length;
    if (changeCount > 4) {
      weight += 0.3;
    }

    if (moment.template === 'HERO_FOCUS' || moment.entities.length === 1) {
      weight += 0.4;
    }

    if (index === moments.length - 1) {
      weight += 0.6;
    }

    return weight;
  });

  const totalWeight = sum(weights);
  if (totalWeight <= 0) {
    return moments.map((moment, index) => {
      const duration = totalDuration / moments.length;
      const start = index * duration;
      const end = index === moments.length - 1 ? totalDuration : start + duration;
      return {
        ...moment,
        start,
        end,
      };
    });
  }

  let minDuration = MIN_DURATION_SECONDS;
  let maxDuration = EFFECTIVE_MAX_DURATION_SECONDS;
  const minTotal = minDuration * moments.length;
  const maxTotal = maxDuration * moments.length;

  if (totalDuration < minTotal) {
    minDuration = totalDuration / moments.length;
    maxDuration = minDuration;
  } else if (totalDuration > maxTotal) {
    maxDuration = totalDuration / moments.length;
    minDuration = Math.min(minDuration, maxDuration);
  }

  const rawDurations = weights.map((weight) => (weight / totalWeight) * totalDuration);
  const clampedDurations = rawDurations.map((duration) => clamp(duration, minDuration, maxDuration));

  const firstMoment = moments[0];
  const shouldLockHookDuration = Boolean(firstMoment?.isHook);
  let balancedDurations: number[];

  if (shouldLockHookDuration && firstMoment) {
    const remainingCount = moments.length - 1;
    const requestedHookDuration = clamp(
      firstMoment.end - firstMoment.start,
      HookTokens.duration.min,
      HookTokens.duration.max,
    );
    const maxHookDuration = totalDuration - MIN_DURATION_SECONDS * remainingCount;

    if (maxHookDuration <= 0) {
      balancedDurations = distributeDelta(
        clampedDurations,
        totalDuration,
        minDuration,
        maxDuration,
      );
    } else {
      const lockedHookDuration = clamp(requestedHookDuration, 0, maxHookDuration);
      const remainingDuration = totalDuration - lockedHookDuration;

      let remainingMinDuration = MIN_DURATION_SECONDS;
      let remainingMaxDuration = EFFECTIVE_MAX_DURATION_SECONDS;

      const remainingMinTotal = remainingMinDuration * remainingCount;
      const remainingMaxTotal = remainingMaxDuration * remainingCount;

      if (remainingDuration < remainingMinTotal) {
        remainingMinDuration = remainingDuration / remainingCount;
        remainingMaxDuration = remainingMinDuration;
      } else if (remainingDuration > remainingMaxTotal) {
        remainingMaxDuration = remainingDuration / remainingCount;
        remainingMinDuration = Math.min(remainingMinDuration, remainingMaxDuration);
      }

      const remainingWeights = weights.slice(1);
      const remainingWeightTotal = sum(remainingWeights);
      const fallbackDuration = remainingDuration / remainingCount;
      const remainingRawDurations = remainingWeights.map((weight) =>
        remainingWeightTotal > 0
          ? (weight / remainingWeightTotal) * remainingDuration
          : fallbackDuration,
      );
      const remainingClampedDurations = remainingRawDurations.map((duration) =>
        clamp(duration, remainingMinDuration, remainingMaxDuration),
      );
      const remainingBalancedDurations = distributeDelta(
        remainingClampedDurations,
        remainingDuration,
        remainingMinDuration,
        remainingMaxDuration,
      );

      balancedDurations = [lockedHookDuration, ...remainingBalancedDurations];
    }
  } else {
    balancedDurations = distributeDelta(
      clampedDurations,
      totalDuration,
      minDuration,
      maxDuration,
    );
  }

  let currentTime = 0;
  return moments.map((moment, index) => {
    const duration = balancedDurations[index] ?? totalDuration / moments.length;
    const start = currentTime;
    const end = index === moments.length - 1 ? totalDuration : start + duration;
    currentTime = end;

    return {
      ...moment,
      start,
      end,
    };
  });
};
