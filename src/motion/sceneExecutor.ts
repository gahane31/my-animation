import type {Node, Txt} from '@motion-canvas/2d';
import {all, easeInOutCubic, type ThreadGenerator} from '@motion-canvas/core';
import {
  applyFadeIn,
  getAnimationDuration,
  runElementAnimation,
} from './animations.js';
import {createCameraPlan} from './cameraController.js';
import {ensureElementLifecycle} from './lifecycle.js';
import {REEL_SAFE_OFFSET_Y} from './positioning.js';
import type {
  MotionElementSpec,
  MotionSceneSpec,
  RuntimeLogger,
  SceneState,
} from './types.js';

const MIN_SCENE_DURATION = 1.5;
const MAX_SCENE_DURATION = 6;
const CAPTION_FADE_OUT_DURATION = 0.12;
const CAPTION_TEXT_DURATION = 0.3;
const CAPTION_FADE_IN_DURATION = 0.2;

const CAPTION_TOTAL_DURATION =
  CAPTION_FADE_OUT_DURATION + CAPTION_TEXT_DURATION + CAPTION_FADE_IN_DURATION;
const DEFAULT_ENTRY_FADE_DURATION = 0.35;
const MAX_RECOMMENDED_SCENE_ELEMENTS = 6;

const formatMetadata = (metadata?: Record<string, unknown>): string => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '';
  }

  return ` ${JSON.stringify(metadata)}`;
};

export const createRuntimeLogger = (scope = 'renderer'): RuntimeLogger => ({
  info: (message, metadata) => {
    console.log(`[${scope}] ${message}${formatMetadata(metadata)}`);
  },
  warn: (message, metadata) => {
    console.warn(`[${scope}] ${message}${formatMetadata(metadata)}`);
  },
});

export interface CreateSceneStateInput {
  caption: Txt;
  logger?: RuntimeLogger;
}

export const createSceneState = ({caption, logger}: CreateSceneStateInput): SceneState => ({
  caption,
  elements: new Map(),
  camera: {
    x: 0,
    y: REEL_SAFE_OFFSET_Y,
    scale: 1,
    actionStreak: 0,
  },
  sceneIndex: 0,
  logger: logger ?? createRuntimeLogger(),
});

const hasMotionEvent = (scene: MotionSceneSpec): boolean => {
  if (scene.camera) {
    return true;
  }

  return scene.elements.some((element) => {
    const effectsCount = element.effects?.length ?? 0;
    return element.enter !== undefined || element.exit !== undefined || effectsCount > 0;
  });
};

export const validateSceneForRuntime = (scene: MotionSceneSpec, logger: RuntimeLogger): void => {
  const duration = scene.end - scene.start;

  if (duration > MAX_SCENE_DURATION) {
    logger.warn('Scene duration exceeds recommended maximum', {
      sceneId: scene.id,
      duration,
      maxDuration: MAX_SCENE_DURATION,
    });
  }

  if (duration < MIN_SCENE_DURATION) {
    logger.warn('Scene duration below recommended minimum', {
      sceneId: scene.id,
      duration,
      minDuration: MIN_SCENE_DURATION,
    });
  }

  if (!hasMotionEvent(scene)) {
    logger.warn('Scene has no explicit motion event', {
      sceneId: scene.id,
    });
  }

  if (scene.elements.length > MAX_RECOMMENDED_SCENE_ELEMENTS) {
    logger.warn('High element density', {
      scene: scene.id,
      elements: scene.elements.length,
      recommendedMax: MAX_RECOMMENDED_SCENE_ELEMENTS,
    });
  }
};

const hasExplicitElementMotion = (element: MotionElementSpec): boolean =>
  element.enter !== undefined ||
  element.exit !== undefined ||
  (element.effects?.length ?? 0) > 0;

const getElementSequenceDuration = (
  element: MotionElementSpec,
  repositionDuration: number,
  isNew: boolean,
): number => {
  const enterDuration = element.enter
    ? getAnimationDuration(element.enter)
    : isNew
      ? DEFAULT_ENTRY_FADE_DURATION
      : 0;
  const effectsDuration = (element.effects ?? []).reduce(
    (total, effect) => total + getAnimationDuration(effect),
    0,
  );
  const exitDuration = element.exit ? getAnimationDuration(element.exit) : 0;

  return repositionDuration + enterDuration + effectsDuration + exitDuration;
};

const createElementSequence = (
  node: Node,
  element: MotionElementSpec,
  isNew: boolean,
  repositionThread?: ThreadGenerator,
): ThreadGenerator =>
  (function* elementSequenceThread() {
    if (repositionThread) {
      yield* repositionThread;
    }

    if (element.enter) {
      yield* runElementAnimation(node, element.enter);
    } else if (isNew) {
      // Default motion to avoid static entry frames.
      yield* applyFadeIn(node);
    }

    for (const effect of element.effects ?? []) {
      yield* runElementAnimation(node, effect);
    }

    if (element.exit) {
      yield* runElementAnimation(node, element.exit);
    }
  })();

const createCaptionTransition = (caption: Txt, text: string): ThreadGenerator =>
  (function* captionThread() {
    yield* caption.opacity(0, CAPTION_FADE_OUT_DURATION, easeInOutCubic);
    yield* caption.text(text, CAPTION_TEXT_DURATION);
    yield* caption.opacity(1, CAPTION_FADE_IN_DURATION, easeInOutCubic);
  })();

export function* executeScene(
  view: Node,
  scene: MotionSceneSpec,
  state: SceneState,
): ThreadGenerator {
  const sceneDuration = Math.max(0, scene.end - scene.start);
  state.logger.info('Scene start', {
    scene: scene.id,
    duration: sceneDuration,
    elements: scene.elements.length,
  });

  const captionText = scene.title ?? scene.narration;
  const captionThread = createCaptionTransition(state.caption, captionText);

  const lifecycleResults = scene.elements.map((element) =>
    ensureElementLifecycle(
      {
        view,
        elements: state.elements,
        sceneIndex: state.sceneIndex,
        logger: state.logger,
      },
      element,
    ),
  );

  const firstNewElement = lifecycleResults.find((result) => result.isNew);

  const cameraPlan = createCameraPlan({
    view,
    cameraState: state.camera,
    sceneDuration,
    action: scene.camera,
    focusTarget: firstNewElement?.targetPosition,
    logger: state.logger,
  });

  const elementPlans = scene.elements.map((element, index) => {
    const lifecycleResult = lifecycleResults[index];
    if (!lifecycleResult) {
      throw new Error(`Missing lifecycle result for element ${element.id}`);
    }

    const shouldSkipElement =
      !lifecycleResult.isNew &&
      !lifecycleResult.hasPositionChange &&
      !hasExplicitElementMotion(element);

    if (shouldSkipElement) {
      lifecycleResult.elementState.unchangedStreak += 1;

      if (lifecycleResult.elementState.unchangedStreak > 3) {
        state.logger.warn('Element repetition detected', {
          scene: scene.id,
          elementId: element.id,
          consecutiveScenes: lifecycleResult.elementState.unchangedStreak,
        });
      }

      return undefined;
    }

    lifecycleResult.elementState.unchangedStreak = 0;

    return {
      thread: createElementSequence(
        lifecycleResult.node,
        element,
        lifecycleResult.isNew,
        lifecycleResult.repositionThread,
      ),
      duration: getElementSequenceDuration(
        element,
        lifecycleResult.repositionDuration,
        lifecycleResult.isNew,
      ),
    };
  });

  const activeElementPlans = elementPlans.filter((plan): plan is NonNullable<typeof plan> => Boolean(plan));
  const elementThreads = activeElementPlans.map((plan) => plan.thread);
  const elementDuration = elementPlans.reduce(
    (maxDuration, plan) => Math.max(maxDuration, plan?.duration ?? 0),
    0,
  );

  const executionThreads: ThreadGenerator[] = [captionThread, ...elementThreads];
  if (cameraPlan) {
    executionThreads.push(cameraPlan.thread);
  }

  if (executionThreads.length > 0) {
    // Parallel across elements; each element remains sequential internally.
    yield* all(...executionThreads);
  }

  const consumedTime = Math.max(
    CAPTION_TOTAL_DURATION,
    elementDuration,
    cameraPlan?.duration ?? 0,
  );

  state.logger.info('Scene end', {
    scene: scene.id,
    consumedTime,
  });

  // TODO: Voice sync: drive transition durations from narration/audio timing.
  // TODO: Auto scene compression when scene execution exceeds budget.
  // TODO: Auto highlight bottleneck elements based on narration intent.
  // TODO: Style profiles (viral / cinematic) to tune motion defaults.
}
