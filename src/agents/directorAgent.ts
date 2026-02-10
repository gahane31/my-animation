import {
  DECIMAL_PRECISION,
  DIRECTOR_CAMERA_SEQUENCE,
  PIPELINE_DEFAULTS,
  VIDEO_LIMITS,
} from '../config/constants.js';
import {AnimationType, CameraActionType} from '../schema/visualGrammar.js';
import type {Element, Scene, VideoSpec} from '../schema/videoSpec.schema.js';
import {videoSpecSchema} from '../schema/videoSpec.schema.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';

const round = (value: number): number => Number(value.toFixed(DECIMAL_PRECISION));

const cloneElement = (element: Element): Element => ({
  ...element,
  effects: element.effects ? [...element.effects] : undefined,
});

const cloneScene = (scene: Scene): Scene => ({
  ...scene,
  elements: scene.elements.map(cloneElement),
});

const toCameraAction = (value: (typeof DIRECTOR_CAMERA_SEQUENCE)[number]): CameraActionType => {
  switch (value) {
    case 'zoom_in':
      return CameraActionType.ZoomIn;
    case 'zoom_out':
      return CameraActionType.ZoomOut;
    case 'pan_down':
      return CameraActionType.PanDown;
    case 'pan_up':
      return CameraActionType.PanUp;
    case 'focus':
      return CameraActionType.Focus;
    case 'wide':
      return CameraActionType.Wide;
    default:
      return CameraActionType.Focus;
  }
};

const getFallbackCameraAction = (index: number): CameraActionType => {
  const sequenceIndex = index % DIRECTOR_CAMERA_SEQUENCE.length;
  const sequenceValue = DIRECTOR_CAMERA_SEQUENCE[sequenceIndex];
  return toCameraAction(sequenceValue);
};

const splitSceneForPacing = (scene: Scene): Scene[] => {
  const safeDuration = Math.max(scene.end - scene.start, PIPELINE_DEFAULTS.minimumSceneDurationSeconds);
  const chunkSize = Math.min(VIDEO_LIMITS.maxVisualIdleSeconds, VIDEO_LIMITS.maxSceneDurationSeconds);
  const chunkCount = Math.max(1, Math.ceil(safeDuration / chunkSize));
  const chunkDuration = safeDuration / chunkCount;

  const chunks: Scene[] = [];
  for (let index = 0; index < chunkCount; index += 1) {
    const start = scene.start + index * chunkDuration;
    const end = start + chunkDuration;

    chunks.push({
      ...cloneScene(scene),
      id: chunkCount === 1 ? scene.id : `${scene.id}_part_${index + 1}`,
      start: round(start),
      end: round(end),
    });
  }

  return chunks;
};

const ensureUniqueSceneIds = (scenes: Scene[]): Scene[] => {
  const seen = new Map<string, number>();

  return scenes.map((scene) => {
    const currentCount = seen.get(scene.id) ?? 0;
    seen.set(scene.id, currentCount + 1);

    if (currentCount === 0) {
      return scene;
    }

    return {
      ...scene,
      id: `${scene.id}_${currentCount + 1}`,
    };
  });
};

const normalizeSceneTimings = (scenes: Scene[], targetDuration: number): Scene[] => {
  const normalized: Scene[] = [];
  let cursor = 0;

  for (const scene of scenes) {
    if (cursor >= targetDuration) {
      break;
    }

    const rawDuration = Math.max(scene.end - scene.start, PIPELINE_DEFAULTS.minimumSceneDurationSeconds);
    const boundedDuration = Math.min(
      rawDuration,
      VIDEO_LIMITS.maxSceneDurationSeconds,
      VIDEO_LIMITS.maxVisualIdleSeconds,
      targetDuration - cursor,
    );

    if (boundedDuration <= 0) {
      continue;
    }

    const nextScene: Scene = {
      ...cloneScene(scene),
      start: round(cursor),
      end: round(cursor + boundedDuration),
    };

    normalized.push(nextScene);
    cursor = nextScene.end;
  }

  return normalized;
};

const sceneHasMotion = (scene: Scene): boolean => {
  if (scene.camera !== undefined) {
    return true;
  }

  return scene.elements.some((element: Element) => {
    const effectCount = element.effects?.length ?? 0;
    return element.enter !== undefined || element.exit !== undefined || effectCount > 0;
  });
};

const ensureFirstSceneMotion = (scenes: Scene[]): Scene[] => {
  if (scenes.length === 0) {
    return scenes;
  }

  const [firstScene, ...rest] = scenes;

  if (!firstScene) {
    return scenes;
  }

  const nextFirst: Scene = {
    ...cloneScene(firstScene),
    start: 0,
    camera: firstScene.camera ?? CameraActionType.ZoomIn,
  };

  if (!sceneHasMotion(nextFirst)) {
    const [firstElement, ...otherElements] = nextFirst.elements;
    if (firstElement) {
      nextFirst.elements = [
        {
          ...firstElement,
          enter: firstElement.enter ?? AnimationType.ZoomIn,
        },
        ...otherElements,
      ];
    }
  }

  return [nextFirst, ...rest];
};

const ensureCameraActions = (scenes: Scene[]): Scene[] =>
  scenes.map((scene, index) => ({
    ...scene,
    camera: scene.camera ?? getFallbackCameraAction(index),
  }));

const calculateFinalDuration = (scenes: Scene[]): number => {
  if (scenes.length === 0) {
    return 0;
  }

  const lastScene = scenes[scenes.length - 1];
  if (!lastScene) {
    return 0;
  }

  return round(lastScene.end);
};

const refine = (input: VideoSpec): VideoSpec => {
  const targetDuration = Math.min(input.duration, VIDEO_LIMITS.maxDurationSeconds);
  const ordered = [...input.scenes].sort((left, right) => left.start - right.start);
  const splitForPacing = ordered.flatMap(splitSceneForPacing);
  const normalized = normalizeSceneTimings(splitForPacing, targetDuration);
  const withCameras = ensureCameraActions(normalized);
  const withEarlyMotion = ensureFirstSceneMotion(withCameras);
  const uniqueIds = ensureUniqueSceneIds(withEarlyMotion);
  const duration = calculateFinalDuration(uniqueIds);

  return videoSpecSchema.parse({
    duration,
    scenes: uniqueIds,
  });
};

export interface DirectorAgent {
  refine(videoSpec: VideoSpec): VideoSpec;
}

export interface DirectorAgentDependencies {
  logger?: Logger;
}

export const createDirectorAgent = (dependencies: DirectorAgentDependencies = {}): DirectorAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const refineWithLogging = (videoSpec: VideoSpec): VideoSpec => {
    logger.info('Director agent: refining VideoSpec', {
      scenesBefore: videoSpec.scenes.length,
      durationBefore: videoSpec.duration,
    });

    const refined = refine(videoSpec);

    logger.info('Director agent: refinement complete', {
      scenesAfter: refined.scenes.length,
      durationAfter: refined.duration,
    });

    return refined;
  };

  return {
    refine: refineWithLogging,
  };
};
