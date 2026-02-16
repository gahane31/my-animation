import {
  DEFAULT_MOTION_PERSONALITY,
  MotionPersonalities,
  type MotionPersonalityId,
} from '../config/motionPersonalityTokens.js';
import {HookTokens} from '../config/hookTokens.js';
import {MotionTokens} from '../config/motionTokens.js';
import type {MomentDiff} from '../design/diffTypes.js';
import type {MomentTransition} from '../schema/moment.schema.js';

export type AnimationTiming = {
  delay: number;
  duration: number;
  easing: string;
};

export type EntityTimingAction = 'remove' | 'move' | 'add';

export interface EntityTimingPlan extends AnimationTiming {
  entityId: string;
  action: EntityTimingAction;
  scale?: number;
  isPrimary?: boolean;
}

export interface ConnectionTimingPlan extends AnimationTiming {
  connectionId: string;
}

export interface CameraTimingPlan extends AnimationTiming {}

export interface SceneAnimationTimings {
  entities: EntityTimingPlan[];
  connections: ConnectionTimingPlan[];
  camera: CameraTimingPlan | null;
}

interface PhaseWindow {
  start: number;
  end: number;
}

export interface ScenePhases {
  exit: PhaseWindow;
  move: PhaseWindow;
  enter: PhaseWindow;
  connect: PhaseWindow;
  camera: PhaseWindow;
}

export const getScenePhases = (sceneDuration: number): ScenePhases => ({
  exit: {start: 0, end: 0.2 * sceneDuration},
  move: {start: 0.1 * sceneDuration, end: 0.4 * sceneDuration},
  enter: {start: 0.3 * sceneDuration, end: 0.6 * sceneDuration},
  connect: {start: 0.5 * sceneDuration, end: 0.8 * sceneDuration},
  camera: {start: 0.6 * sceneDuration, end: sceneDuration},
});

const phaseDuration = (phase: PhaseWindow): number => Math.max(0.12, phase.end - phase.start);

const clampDelay = (delay: number, maxDelay: number): number => Math.min(delay, maxDelay);

const entityDiffIsAdd = (type: MomentDiff['entityDiffs'][number]['type']): boolean =>
  type === 'entity_added';

const entityDiffIsPromotedPrimary = (
  diff: MomentDiff['entityDiffs'][number],
): boolean => diff.type === 'entity_importance_changed' && diff.to === 'primary';

const clampTimingDuration = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const transitionPaceMultiplier = (transition?: MomentTransition): number => {
  switch (transition?.pace) {
    case 'fast':
      return 0.72;
    case 'slow':
      return 1.12;
    case 'medium':
      return 0.9;
    default:
      return 1;
  }
};

export const planEntityTimings = (
  diff: MomentDiff,
  sceneDuration: number,
  primaryEntityIds?: ReadonlySet<string>,
  personality: MotionPersonalityId = DEFAULT_MOTION_PERSONALITY,
  isHook = false,
  transition?: MomentTransition,
): EntityTimingPlan[] => {
  const personalityTokens = MotionPersonalities[personality];
  const hookSpeedMultiplier = isHook ? HookTokens.motionBoost.speedMultiplier : 1;
  const hookStaggerMultiplier = isHook ? HookTokens.motionBoost.staggerMultiplier : 1;
  const effectiveSpeedMultiplier = personalityTokens.speedMultiplier * hookSpeedMultiplier;
  const effectiveStagger = personalityTokens.stagger * hookStaggerMultiplier;
  const paceMultiplier = transitionPaceMultiplier(transition);
  const phases = getScenePhases(sceneDuration);
  const timings: EntityTimingPlan[] = [];

  diff.entityDiffs
    .filter((entry) => entry.type === 'entity_removed')
    .forEach((entry, index) => {
      const delay = clampDelay(
        phases.exit.start + index * effectiveStagger,
        phases.exit.end,
      );
      const baseDuration = phaseDuration(phases.exit);

      timings.push({
        entityId: entry.entityId,
        action: 'remove',
        delay,
        duration: clampTimingDuration(baseDuration * effectiveSpeedMultiplier * paceMultiplier, 0.24, 0.9),
        easing: personalityTokens.easing,
      });
    });

  diff.entityDiffs
    .filter((entry) => entry.type === 'entity_moved')
    .forEach((entry, index) => {
      const delay = clampDelay(
        phases.move.start + index * effectiveStagger,
        phases.move.end,
      );
      const baseDuration = phaseDuration(phases.move);

      timings.push({
        entityId: entry.entityId,
        action: 'move',
        delay,
        duration: clampTimingDuration(baseDuration * effectiveSpeedMultiplier * paceMultiplier, 0.28, 0.95),
        easing: personalityTokens.easing,
      });
    });

  const additionCandidates = diff.entityDiffs.filter(
    (entry) => entityDiffIsAdd(entry.type) || entityDiffIsPromotedPrimary(entry),
  );

  const additionsOrdered = [...additionCandidates].sort((left, right) => {
    const leftIsPrimary =
      (primaryEntityIds?.has(left.entityId) ?? false) || entityDiffIsPromotedPrimary(left);
    const rightIsPrimary =
      (primaryEntityIds?.has(right.entityId) ?? false) || entityDiffIsPromotedPrimary(right);

    if (leftIsPrimary === rightIsPrimary) {
      return left.entityId.localeCompare(right.entityId);
    }

    // Primary additions animate later.
    return leftIsPrimary ? 1 : -1;
  });

  additionsOrdered.forEach((entry, index) => {
    const isPrimary =
      (primaryEntityIds?.has(entry.entityId) ?? false) || entityDiffIsPromotedPrimary(entry);
    const baseDelay = phases.enter.start + index * Math.max(0.05, effectiveStagger);
    const delay = clampDelay(baseDelay + (isPrimary ? 0.1 : 0), phases.enter.end);
    const baseDuration = phaseDuration(phases.enter);
    const duration = clampTimingDuration(
      (isPrimary ? baseDuration * 1.2 : baseDuration) * effectiveSpeedMultiplier * paceMultiplier,
      0.3,
      isPrimary ? 1.05 : 0.95,
    );

    timings.push({
      entityId: entry.entityId,
      action: 'add',
      delay,
      duration,
      easing: personalityTokens.easing,
      scale: isPrimary ? MotionTokens.primaryScale : undefined,
      isPrimary,
    });
  });

  return timings;
};

export const planConnectionTimings = (
  diff: MomentDiff,
  sceneDuration: number,
  personality: MotionPersonalityId = DEFAULT_MOTION_PERSONALITY,
  isHook = false,
  transition?: MomentTransition,
): ConnectionTimingPlan[] => {
  const personalityTokens = MotionPersonalities[personality];
  const hookSpeedMultiplier = isHook ? HookTokens.motionBoost.speedMultiplier : 1;
  const hookStaggerMultiplier = isHook ? HookTokens.motionBoost.staggerMultiplier : 1;
  const effectiveSpeedMultiplier = personalityTokens.speedMultiplier * hookSpeedMultiplier;
  const effectiveStagger = personalityTokens.stagger * hookStaggerMultiplier;
  const paceMultiplier = transitionPaceMultiplier(transition);
  const phases = getScenePhases(sceneDuration);
  const baseDuration = phaseDuration(phases.connect);

  return diff.connectionDiffs.map((entry, index) => ({
    connectionId: entry.connectionId,
    delay: clampDelay(phases.connect.start + index * effectiveStagger, phases.connect.end),
    duration: clampTimingDuration(baseDuration * effectiveSpeedMultiplier * paceMultiplier, 0.22, 0.8),
    easing: personalityTokens.easing,
  }));
};

export const planCameraTiming = (
  diff: MomentDiff,
  sceneDuration: number,
  personality: MotionPersonalityId = DEFAULT_MOTION_PERSONALITY,
  isHook = false,
): CameraTimingPlan | null => {
  const personalityTokens = MotionPersonalities[personality];
  const hookSpeedMultiplier = isHook ? HookTokens.motionBoost.speedMultiplier : 1;
  const effectiveSpeedMultiplier = personalityTokens.speedMultiplier * hookSpeedMultiplier;
  const phases = getScenePhases(sceneDuration);

  if (diff.cameraDiffs.length === 0) {
    return null;
  }

  return {
    delay: phases.camera.start,
    duration: phaseDuration(phases.camera) * effectiveSpeedMultiplier,
    easing: personalityTokens.easing,
  };
};

interface PlanSceneAnimationTimingsInput {
  diff: MomentDiff;
  sceneDuration: number;
  primaryEntityIds?: ReadonlySet<string>;
  personality?: MotionPersonalityId;
  isHook?: boolean;
  transition?: MomentTransition;
}

export const planSceneAnimationTimings = ({
  diff,
  sceneDuration,
  primaryEntityIds,
  personality = DEFAULT_MOTION_PERSONALITY,
  isHook = false,
  transition,
}: PlanSceneAnimationTimingsInput): SceneAnimationTimings => ({
  entities: planEntityTimings(diff, sceneDuration, primaryEntityIds, personality, isHook, transition),
  connections: planConnectionTimings(diff, sceneDuration, personality, isHook, transition),
  camera: planCameraTiming(diff, sceneDuration, personality, isHook),
});
