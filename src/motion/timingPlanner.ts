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

type MotionPacing = 'balanced' | 'reel_fast';

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

const ADDITION_STAGGER_MULTIPLIER = 0.4;
const ADDITION_DURATION_MULTIPLIER = 0.62;

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

const directivePacingMultipliers = (
  pacing: MotionPacing = 'balanced',
): {duration: number; stagger: number} => {
  if (pacing === 'reel_fast') {
    return {
      duration: 0.58,
      stagger: 0.5,
    };
  }

  return {
    duration: 1,
    stagger: 1,
  };
};

export const planEntityTimings = (
  diff: MomentDiff,
  sceneDuration: number,
  primaryEntityIds?: ReadonlySet<string>,
  personality: MotionPersonalityId = DEFAULT_MOTION_PERSONALITY,
  isHook = false,
  transition?: MomentTransition,
  pacing: MotionPacing = 'balanced',
): EntityTimingPlan[] => {
  const personalityTokens =
    MotionPersonalities[personality] ?? MotionPersonalities[DEFAULT_MOTION_PERSONALITY];
  const hookSpeedMultiplier = isHook ? HookTokens.motionBoost.speedMultiplier : 1;
  const hookStaggerMultiplier = isHook ? HookTokens.motionBoost.staggerMultiplier : 1;
  const directivePacing = directivePacingMultipliers(pacing);
  const effectiveSpeedMultiplier =
    personalityTokens.speedMultiplier *
    hookSpeedMultiplier *
    directivePacing.duration;
  const effectiveStagger =
    personalityTokens.stagger * hookStaggerMultiplier * directivePacing.stagger;
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
        duration: clampTimingDuration(baseDuration * effectiveSpeedMultiplier * paceMultiplier, 0.12, 0.28),
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
        duration: clampTimingDuration(baseDuration * effectiveSpeedMultiplier * paceMultiplier, 0.14, 0.34),
        easing: personalityTokens.easing,
      });
    });

  const additionCandidates = diff.entityDiffs.filter(
    (entry) => entityDiffIsAdd(entry.type) || entityDiffIsPromotedPrimary(entry),
  );
  const isPureIntroduction =
    diff.entityDiffs.length > 0 &&
    diff.entityDiffs.every((entry) => entityDiffIsAdd(entry.type));

  // Keep entering entities from colliding with outgoing/moving entities.
  // We let removals/moves visibly clear first, then start additions.
  const latestRemovalClear = timings
    .filter((timing) => timing.action === 'remove')
    .reduce((maxClear, timing) => Math.max(maxClear, timing.delay + timing.duration * 0.75), 0);
  const latestMoveClear = timings
    .filter((timing) => timing.action === 'move')
    .reduce((maxClear, timing) => Math.max(maxClear, timing.delay + timing.duration * 0.55), 0);
  // Keep additions early enough for reel pacing while still respecting
  // any active removals/moves to avoid visible collisions.
  const earlyIntroStart = Math.max(0.02, Math.min(sceneDuration * 0.03, 0.12));
  const earlyGeneralStart = Math.max(0.16, Math.min(sceneDuration * 0.12, 0.72));
  const additionDelayFloor = isPureIntroduction
    ? earlyIntroStart
    : Math.max(earlyGeneralStart, latestRemovalClear, latestMoveClear);
  const additionDelayCap = Math.max(
    additionDelayFloor + 0.02,
    Math.min(sceneDuration * 0.72, phases.connect.end),
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
    const baseDelay =
      additionDelayFloor + index * Math.max(0.03, effectiveStagger * ADDITION_STAGGER_MULTIPLIER);
    const delay = clampDelay(baseDelay + (isPrimary ? 0.05 : 0), additionDelayCap);
    const baseDuration = phaseDuration(phases.enter);
    const duration = clampTimingDuration(
      (isPrimary ? baseDuration * 1.05 : baseDuration) *
        effectiveSpeedMultiplier *
        paceMultiplier *
        ADDITION_DURATION_MULTIPLIER,
      0.12,
      isPrimary ? 0.32 : 0.28,
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
  pacing: MotionPacing = 'balanced',
): ConnectionTimingPlan[] => {
  const personalityTokens =
    MotionPersonalities[personality] ?? MotionPersonalities[DEFAULT_MOTION_PERSONALITY];
  const hookSpeedMultiplier = isHook ? HookTokens.motionBoost.speedMultiplier : 1;
  const hookStaggerMultiplier = isHook ? HookTokens.motionBoost.staggerMultiplier : 1;
  const directivePacing = directivePacingMultipliers(pacing);
  const effectiveSpeedMultiplier =
    personalityTokens.speedMultiplier *
    hookSpeedMultiplier *
    directivePacing.duration;
  const effectiveStagger =
    personalityTokens.stagger * hookStaggerMultiplier * directivePacing.stagger;
  const paceMultiplier = transitionPaceMultiplier(transition);
  const phases = getScenePhases(sceneDuration);
  const baseDuration = phaseDuration(phases.connect);
  const connectionStart = Math.max(
    0.08,
    Math.min(sceneDuration * 0.14, 0.45),
    phases.move.start + Math.min(0.14, sceneDuration * 0.05),
  );

  return diff.connectionDiffs.map((entry, index) => ({
    connectionId: entry.connectionId,
    delay: clampDelay(connectionStart + index * effectiveStagger, phases.connect.end),
    duration: clampTimingDuration(baseDuration * effectiveSpeedMultiplier * paceMultiplier, 0.08, 0.2),
    easing: personalityTokens.easing,
  }));
};

export const planCameraTiming = (
  diff: MomentDiff,
  sceneDuration: number,
  personality: MotionPersonalityId = DEFAULT_MOTION_PERSONALITY,
  isHook = false,
  pacing: MotionPacing = 'balanced',
): CameraTimingPlan | null => {
  const personalityTokens =
    MotionPersonalities[personality] ?? MotionPersonalities[DEFAULT_MOTION_PERSONALITY];
  const hookSpeedMultiplier = isHook ? HookTokens.motionBoost.speedMultiplier : 1;
  const directivePacing = directivePacingMultipliers(pacing);
  const effectiveSpeedMultiplier =
    personalityTokens.speedMultiplier *
    hookSpeedMultiplier *
    directivePacing.duration;
  const phases = getScenePhases(sceneDuration);

  if (diff.cameraDiffs.length === 0) {
    return null;
  }

  const cameraDelay =
    pacing === 'reel_fast'
      ? Math.min(phases.camera.start, sceneDuration * 0.32)
      : phases.camera.start;

  return {
    delay: cameraDelay,
    duration: clampTimingDuration(
      phaseDuration(phases.camera) * effectiveSpeedMultiplier,
      0.16,
      0.36,
    ),
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
  pacing?: MotionPacing;
}

export const planSceneAnimationTimings = ({
  diff,
  sceneDuration,
  primaryEntityIds,
  personality = DEFAULT_MOTION_PERSONALITY,
  isHook = false,
  transition,
  pacing = 'balanced',
}: PlanSceneAnimationTimingsInput): SceneAnimationTimings => ({
  entities: planEntityTimings(
    diff,
    sceneDuration,
    primaryEntityIds,
    personality,
    isHook,
    transition,
    pacing,
  ),
  connections: planConnectionTimings(diff, sceneDuration, personality, isHook, transition, pacing),
  camera: planCameraTiming(diff, sceneDuration, personality, isHook, pacing),
});
