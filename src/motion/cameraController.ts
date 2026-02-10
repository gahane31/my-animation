import type {Node} from '@motion-canvas/2d';
import {all, easeInOutCubic, type ThreadGenerator} from '@motion-canvas/core';
import {CameraActionType} from '../schema/visualGrammar.js';
import type {CameraState, RuntimeLogger} from './types.js';
import {REEL_SAFE_OFFSET_Y, type PixelPosition} from './positioning.js';

const DEFAULT_CAMERA_DURATION = 1;
const MIN_CAMERA_DURATION = 0.8;
const MAX_CAMERA_DURATION = 1.2;
const ZOOM_IN_SCALE = 1.2;
const ZOOM_OUT_SCALE = 1;
const PAN_DISTANCE = 200;
const FOCUS_SCALE = 1.2;
const SUBTLE_DRIFT_DISTANCE = 45;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export interface CameraPlan {
  thread: ThreadGenerator;
  duration: number;
  action?: CameraActionType;
}

export interface CameraPlanInput {
  view: Node;
  cameraState: CameraState;
  sceneDuration: number;
  action?: CameraActionType;
  focusTarget?: PixelPosition;
  logger: RuntimeLogger;
}

const resolveDuration = (sceneDuration: number): number => {
  const proportionalDuration = sceneDuration * 0.3;
  return clamp(proportionalDuration || DEFAULT_CAMERA_DURATION, MIN_CAMERA_DURATION, MAX_CAMERA_DURATION);
};

const getFocusTargetCoordinates = (focusTarget?: PixelPosition): PixelPosition => {
  if (!focusTarget) {
    return {x: 0, y: REEL_SAFE_OFFSET_Y};
  }

  // Invert target position because moving the camera node shifts scene space.
  // Keep focus around reel-safe center instead of exact frame center.
  return {
    x: -focusTarget.x,
    y: REEL_SAFE_OFFSET_Y - focusTarget.y,
  };
};

const createCameraTransition = (
  view: Node,
  cameraState: CameraState,
  action: CameraActionType,
  duration: number,
  focusTarget: PixelPosition,
): ThreadGenerator => {
  let targetScale = cameraState.scale;
  let targetX = cameraState.x;
  let targetY = cameraState.y;

  switch (action) {
    case CameraActionType.ZoomIn:
      targetScale = ZOOM_IN_SCALE;
      break;
    case CameraActionType.ZoomOut:
      targetScale = ZOOM_OUT_SCALE;
      targetX = 0;
      targetY = REEL_SAFE_OFFSET_Y;
      break;
    case CameraActionType.PanUp:
      targetY -= PAN_DISTANCE;
      break;
    case CameraActionType.PanDown:
      targetY += PAN_DISTANCE;
      break;
    case CameraActionType.Focus:
      targetScale = FOCUS_SCALE;
      targetX = focusTarget.x;
      targetY = focusTarget.y;
      break;
    case CameraActionType.Wide:
      targetScale = ZOOM_OUT_SCALE;
      targetX = 0;
      targetY = REEL_SAFE_OFFSET_Y;
      break;
    default:
      break;
  }

  cameraState.scale = targetScale;
  cameraState.x = targetX;
  cameraState.y = targetY;

  return all(
    view.scale(targetScale, duration, easeInOutCubic),
    view.x(targetX, duration, easeInOutCubic),
    view.y(targetY, duration, easeInOutCubic),
  );
};

const createSubtleDrift = (
  view: Node,
  cameraState: CameraState,
  sceneDuration: number,
): CameraPlan | null => {
  if (sceneDuration <= 3) {
    return null;
  }

  const driftDuration = clamp(sceneDuration * 0.24, 0.9, 1.4);
  const startX = cameraState.x;
  const driftX = startX + SUBTLE_DRIFT_DISTANCE;

  const thread = (function* subtleDriftThread() {
    yield* view.x(driftX, driftDuration / 2, easeInOutCubic).to(startX, driftDuration / 2, easeInOutCubic);
  })();

  return {
    thread,
    duration: driftDuration,
  };
};

export const createCameraPlan = ({
  view,
  cameraState,
  sceneDuration,
  action,
  focusTarget,
  logger,
}: CameraPlanInput): CameraPlan | null => {
  const resolvedAction = action ?? (focusTarget ? CameraActionType.Focus : undefined);
  const targetCoordinates = getFocusTargetCoordinates(focusTarget);
  const baseDuration = resolveDuration(sceneDuration);

  const driftPlan = createSubtleDrift(view, cameraState, sceneDuration);

  if (!resolvedAction && !driftPlan) {
    cameraState.lastAction = undefined;
    cameraState.actionStreak = 0;
    return null;
  }

  if (!resolvedAction && driftPlan) {
    cameraState.lastAction = undefined;
    cameraState.actionStreak = 0;
    return driftPlan;
  }

  if (!resolvedAction) {
    return null;
  }

  if (cameraState.lastAction === resolvedAction) {
    cameraState.actionStreak += 1;
  } else {
    cameraState.lastAction = resolvedAction;
    cameraState.actionStreak = 1;
  }

  if (cameraState.actionStreak > 2) {
    logger.warn('Camera repetition', {
      action: resolvedAction,
      repeatCount: cameraState.actionStreak,
    });
  }

  logger.info(`Camera action: ${resolvedAction}`);

  const baseThread = createCameraTransition(
    view,
    cameraState,
    resolvedAction,
    baseDuration,
    targetCoordinates,
  );

  if (!driftPlan) {
    return {
      thread: baseThread,
      duration: baseDuration,
      action: resolvedAction,
    };
  }

  const compositeThread = (function* cameraCompositeThread() {
    yield* baseThread;
    yield* driftPlan.thread;
  })();

  return {
    thread: compositeThread,
    duration: baseDuration + driftPlan.duration,
    action: resolvedAction,
  };
};
