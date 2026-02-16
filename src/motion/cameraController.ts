import type {Node} from '@motion-canvas/2d';
import {
  all,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  type ThreadGenerator,
  type TimingFunction,
} from '@motion-canvas/core';
import {CameraActionType} from '../schema/visualGrammar.js';
import type {CameraState, RuntimeLogger} from './types.js';
import type {PixelPosition} from './positioning.js';

const DEFAULT_CAMERA_DURATION = 1;
const MIN_CAMERA_DURATION = 0.8;
const MAX_CAMERA_DURATION = 1.2;
const ZOOM_IN_SCALE = 1.2;
const ZOOM_OUT_SCALE = 1;
const PAN_DISTANCE = 200;
const FOCUS_SCALE = 1.2;
const SUBTLE_DRIFT_DISTANCE = 45;
const FRAME_HALF_WIDTH = 540;
const FRAME_HALF_HEIGHT = 960;
const FRAME_MARGIN = 32;

interface CameraContentBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const resolveTimingFunction = (easing?: string): TimingFunction => {
  if (!easing) {
    return easeInOutCubic;
  }

  if (easing.includes('0.4,0,0.2,1')) {
    return easeOutCubic;
  }

  if (easing.includes('0.16,1,0.3,1')) {
    return easeOutCubic;
  }

  if (easing.includes('0.4,0,1,1')) {
    return easeInCubic;
  }

  if (easing.includes('0,0,0.2,1')) {
    return easeOutCubic;
  }

  return easeInOutCubic;
};

export interface CameraPlan {
  thread: ThreadGenerator;
  duration: number;
  action?: CameraActionType;
}

export interface CameraPlanInput {
  view: Node;
  cameraState: CameraState;
  sceneDuration: number;
  durationOverride?: number;
  action?: CameraActionType;
  focusTarget?: PixelPosition;
  activeZone?: 'upper_third' | 'center';
  reserveBottomPercent?: number;
  zoomOverride?: number;
  easingOverride?: string;
  allowDrift?: boolean;
  lockXAxis?: boolean;
  contentBounds?: CameraContentBounds;
  logger: RuntimeLogger;
}

const resolveDuration = (sceneDuration: number): number => {
  const proportionalDuration = sceneDuration * 0.3;
  return clamp(proportionalDuration || DEFAULT_CAMERA_DURATION, MIN_CAMERA_DURATION, MAX_CAMERA_DURATION);
};

const getFocusTargetCoordinates = (
  focusTarget: PixelPosition | undefined,
  activeZone: 'upper_third' | 'center',
  reserveBottomPercent: number,
): PixelPosition => {
  if (!focusTarget) {
    return {x: 0, y: 0};
  }

  const clampedReserveBottomPercent = clamp(reserveBottomPercent, 0, 40);
  const upperThirdBias = activeZone === 'upper_third' ? 80 : 0;
  const reserveBias = clampedReserveBottomPercent * 0.25;

  // Invert target position because moving the camera node shifts scene space.
  // Safe offset is already applied in normalized node positions.
  return {
    x: -focusTarget.x,
    y: -focusTarget.y - upperThirdBias - reserveBias,
  };
};

const createCameraTransition = (
  view: Node,
  cameraState: CameraState,
  action: CameraActionType,
  duration: number,
  focusTarget: PixelPosition,
  timingFunction: TimingFunction,
  zoomOverride?: number,
  lockXAxis = false,
  contentBounds?: CameraContentBounds,
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
      targetX = cameraState.originX;
      targetY = cameraState.originY;
      break;
    case CameraActionType.PanUp:
      targetY -= PAN_DISTANCE;
      break;
    case CameraActionType.PanDown:
      targetY += PAN_DISTANCE;
      break;
    case CameraActionType.Focus:
      targetScale = FOCUS_SCALE;
      targetX = lockXAxis ? cameraState.originX : cameraState.originX + focusTarget.x;
      targetY = cameraState.originY + focusTarget.y;
      break;
    case CameraActionType.Wide:
      targetScale = ZOOM_OUT_SCALE;
      targetX = cameraState.originX;
      targetY = cameraState.originY;
      break;
    default:
      break;
  }

  if (typeof zoomOverride === 'number') {
    targetScale = zoomOverride;
  }

  if (contentBounds) {
    const contentWidth = Math.max(1, contentBounds.maxX - contentBounds.minX);
    const contentHeight = Math.max(1, contentBounds.maxY - contentBounds.minY);
    const frameWidth = FRAME_HALF_WIDTH * 2 - FRAME_MARGIN * 2;
    const frameHeight = FRAME_HALF_HEIGHT * 2 - FRAME_MARGIN * 2;
    const fitScale = Math.min(frameWidth / contentWidth, frameHeight / contentHeight);
    targetScale = Math.max(0.72, Math.min(targetScale, fitScale));

    const minTargetX = (-FRAME_HALF_WIDTH + FRAME_MARGIN) / targetScale - contentBounds.minX;
    const maxTargetX = (FRAME_HALF_WIDTH - FRAME_MARGIN) / targetScale - contentBounds.maxX;
    const minTargetY = (-FRAME_HALF_HEIGHT + FRAME_MARGIN) / targetScale - contentBounds.minY;
    const maxTargetY = (FRAME_HALF_HEIGHT - FRAME_MARGIN) / targetScale - contentBounds.maxY;

    if (!lockXAxis) {
      targetX = minTargetX <= maxTargetX ? clamp(targetX, minTargetX, maxTargetX) : (minTargetX + maxTargetX) / 2;
    } else {
      targetX = minTargetX <= maxTargetX ? clamp(targetX, minTargetX, maxTargetX) : cameraState.originX;
    }
    targetY = minTargetY <= maxTargetY ? clamp(targetY, minTargetY, maxTargetY) : (minTargetY + maxTargetY) / 2;
  }

  cameraState.scale = targetScale;
  cameraState.x = targetX;
  cameraState.y = targetY;

  return all(
    view.scale(targetScale, duration, timingFunction),
    view.x(targetX, duration, timingFunction),
    view.y(targetY, duration, timingFunction),
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
  durationOverride,
  action,
  focusTarget,
  activeZone = 'upper_third',
  reserveBottomPercent = 25,
  zoomOverride,
  easingOverride,
  allowDrift = true,
  lockXAxis = false,
  contentBounds,
  logger,
}: CameraPlanInput): CameraPlan | null => {
  const resolvedAction = action;
  const targetCoordinates = getFocusTargetCoordinates(
    focusTarget,
    activeZone,
    reserveBottomPercent,
  );
  const baseDuration = durationOverride ?? resolveDuration(sceneDuration);
  const timingFunction = resolveTimingFunction(easingOverride);

  if (!resolvedAction) {
    cameraState.lastAction = undefined;
    cameraState.actionStreak = 0;
    return null;
  }

  const driftPlan = allowDrift ? createSubtleDrift(view, cameraState, sceneDuration) : null;

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
    timingFunction,
    zoomOverride,
    lockXAxis,
    contentBounds,
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
