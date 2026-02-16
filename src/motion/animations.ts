import {Circle, Node, Rect} from '@motion-canvas/2d';
import {
  all,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  type TimingFunction,
  type ThreadGenerator,
} from '@motion-canvas/core';
import {AnimationType, CameraActionType} from '../schema/visualGrammar.js';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

const SLIDE_DISTANCE = 140;
const DEFAULT_FADE_IN_DURATION = 0.35;
const DEFAULT_SHAKE_INTENSITY = 8;

const ANIMATION_DURATION_MAP: Record<AnimationType, number> = {
  [AnimationType.ZoomIn]: 0.55,
  [AnimationType.ZoomOut]: 0.45,
  [AnimationType.PanDown]: 0.5,
  [AnimationType.PanUp]: 0.5,
  [AnimationType.Focus]: 0.45,
  [AnimationType.Wide]: 0.5,
};

const getSlideOffset = (direction: SlideDirection): {x: number; y: number} => {
  switch (direction) {
    case 'left':
      return {x: SLIDE_DISTANCE, y: 0};
    case 'right':
      return {x: -SLIDE_DISTANCE, y: 0};
    case 'up':
      return {x: 0, y: SLIDE_DISTANCE};
    case 'down':
      return {x: 0, y: -SLIDE_DISTANCE};
    default:
      return {x: 0, y: 0};
  }
};

export const getAnimationDuration = (animation: AnimationType): number =>
  ANIMATION_DURATION_MAP[animation] ?? 0.45;

export interface TimedAnimationOptions {
  duration: number;
  timingFunction: TimingFunction;
  scaleTarget?: number;
}

export function* applyFadeIn(node: Node, duration = DEFAULT_FADE_IN_DURATION): ThreadGenerator {
  const currentOpacity = node.opacity();
  const startOpacity = Math.min(currentOpacity, 0.35);
  node.opacity(startOpacity);

  yield* node.opacity(1, duration, easeInOutCubic);
}

export function* applyDrop(node: Node, duration = 0.45): ThreadGenerator {
  const targetY = node.y();
  node.y(targetY - SLIDE_DISTANCE);
  node.opacity(0);

  yield* all(
    node.y(targetY, duration, easeOutCubic),
    node.opacity(1, duration * 0.8, easeOutCubic),
  );
}

export function* applySlide(
  node: Node,
  direction: SlideDirection,
  duration = 0.5,
): ThreadGenerator {
  const targetX = node.x();
  const targetY = node.y();
  const offset = getSlideOffset(direction);

  node.x(targetX + offset.x);
  node.y(targetY + offset.y);
  node.opacity(Math.min(node.opacity(), 0.25));

  yield* all(
    node.x(targetX, duration, easeOutCubic),
    node.y(targetY, duration, easeOutCubic),
    node.opacity(1, duration * 0.8, easeOutCubic),
  );
}

export function* applyScaleIn(node: Node, duration = 0.55): ThreadGenerator {
  node.scale(0.82);
  node.opacity(Math.min(node.opacity(), 0.2));

  yield* all(node.scale(1.06, duration * 0.7, easeOutBack), node.opacity(1, duration * 0.6));
  yield* node.scale(1, duration * 0.3, easeInOutCubic);
}

export interface ShakeOptions {
  duration?: number;
  intensity?: number;
}

export function* applyShake(node: Node, options: ShakeOptions = {}): ThreadGenerator {
  const duration = options.duration ?? 0.45;
  const intensity = options.intensity ?? DEFAULT_SHAKE_INTENSITY;
  const quarter = duration / 4;

  yield* node
    .rotation(intensity, quarter)
    .to(-intensity, quarter)
    .to(intensity, quarter)
    .to(0, quarter);
}

export interface PulseRedOptions {
  duration?: number;
  loops?: number;
}

export function* applyPulseRed(node: Rect | Circle, options: PulseRedOptions = {}): ThreadGenerator {
  const duration = options.duration ?? 0.5;
  const loops = options.loops ?? 1;
  const originalFill = node.fill();

  for (let index = 0; index < loops; index += 1) {
    yield* all(node.fill('#ef4444', duration / 2), node.scale(1.08, duration / 2));
    yield* all(node.fill(originalFill, duration / 2), node.scale(1, duration / 2));
  }
}

export function* applyFlow(
  container: Node,
  source: Node,
  target: Node,
  duration = 0.6,
): ThreadGenerator {
  const packet = new Circle({
    width: 16,
    height: 16,
    fill: '#facc15',
    opacity: 1,
  });

  container.add(packet);
  packet.position(source.position());

  yield* packet.position(target.position(), duration, linear);
  packet.remove();
}

export function* applyHighlight(node: Node, duration = 0.4): ThreadGenerator {
  yield* node.scale(1.08, duration / 2, easeInOutCubic).to(1, duration / 2, easeInOutCubic);
}

export function* runElementAnimation(node: Node, animation: AnimationType): ThreadGenerator {
  const duration = getAnimationDuration(animation);

  switch (animation) {
    case AnimationType.ZoomIn:
      yield* applyScaleIn(node, duration);
      break;
    case AnimationType.ZoomOut:
      node.scale(1.1);
      yield* node.scale(1, duration, easeInOutCubic);
      break;
    case AnimationType.PanDown:
      yield* applySlide(node, 'down', duration);
      break;
    case AnimationType.PanUp:
      yield* applySlide(node, 'up', duration);
      break;
    case AnimationType.Focus:
      yield* applyHighlight(node, duration);
      break;
    case AnimationType.Wide:
      node.scale(0.92);
      yield* node.scale(1, duration, easeInOutCubic);
      break;
    default:
      yield* applyFadeIn(node);
      break;
  }
}

export function* runElementAnimationTimed(
  node: Node,
  animation: AnimationType,
  options: TimedAnimationOptions,
): ThreadGenerator {
  const duration = Math.max(0.1, options.duration);
  const timing = options.timingFunction;

  switch (animation) {
    case AnimationType.ZoomIn: {
      const targetScale = options.scaleTarget ?? 1;
      node.scale(0.84);
      node.opacity(Math.min(node.opacity(), 0.2));
      yield* all(
        node.scale(targetScale, duration, timing),
        node.opacity(1, duration * 0.85, timing),
      );
      break;
    }
    case AnimationType.ZoomOut: {
      node.scale(1.08);
      yield* all(
        node.scale(1, duration, timing),
        node.opacity(1, duration * 0.85, timing),
      );
      break;
    }
    case AnimationType.PanDown: {
      const startY = node.y();
      yield* node.y(startY + 48, duration / 2, timing).to(startY, duration / 2, timing);
      break;
    }
    case AnimationType.PanUp: {
      const startY = node.y();
      yield* node.y(startY - 48, duration / 2, timing).to(startY, duration / 2, timing);
      break;
    }
    case AnimationType.Focus: {
      const scaleTarget = options.scaleTarget ?? 1.12;
      yield* node.scale(scaleTarget, duration / 2, timing).to(1, duration / 2, timing);
      break;
    }
    case AnimationType.Wide: {
      yield* node.scale(0.92, duration / 2, timing).to(1, duration / 2, timing);
      break;
    }
    default:
      yield* node.opacity(1, duration, timing);
      break;
  }
}

// Backward-compatible helper for previously generated scenes.
export function* runCameraAction(
  view: Node,
  action: CameraActionType,
  duration = 1,
): ThreadGenerator {
  switch (action) {
    case CameraActionType.ZoomIn:
      yield* view.scale(1.2, duration, easeInOutCubic);
      break;
    case CameraActionType.ZoomOut:
      yield* view.scale(1, duration, easeInOutCubic);
      break;
    case CameraActionType.PanDown:
      yield* view.y(view.y() + 200, duration, easeInOutCubic);
      break;
    case CameraActionType.PanUp:
      yield* view.y(view.y() - 200, duration, easeInOutCubic);
      break;
    case CameraActionType.Focus:
      yield* view.scale(1.2, duration, easeInOutCubic);
      break;
    case CameraActionType.Wide:
      yield* all(
        view.scale(1, duration, easeInOutCubic),
        view.x(0, duration, easeInOutCubic),
        view.y(0, duration, easeInOutCubic),
      );
      break;
    default:
      yield* view.scale(1, duration, easeInOutCubic);
      break;
  }
}
