import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';
import type {VideoSpec} from '../schema/videoSpec.schema.js';
import type {MotionElementSpec, MotionRenderSpec, MotionSceneSpec} from '../motion/types.js';

const cloneElement = (element: VideoSpec['scenes'][number]['elements'][number]): MotionElementSpec => ({
  id: element.id,
  type: element.type,
  position: {
    x: element.position.x,
    y: element.position.y,
  },
  enter: element.enter,
  exit: element.exit,
  effects: element.effects ? [...element.effects] : undefined,
});

const cloneScene = (scene: VideoSpec['scenes'][number]): MotionSceneSpec => ({
  id: scene.id,
  start: scene.start,
  end: scene.end,
  narration: scene.narration,
  title: scene.title,
  camera: scene.camera,
  elements: scene.elements.map(cloneElement),
});

export interface MotionCanvasAgent {
  buildRenderSpec(videoSpec: VideoSpec): MotionRenderSpec;
}

export interface MotionCanvasAgentDependencies {
  logger?: Logger;
}

export const createMotionCanvasAgent = (
  dependencies: MotionCanvasAgentDependencies = {},
): MotionCanvasAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const buildRenderSpec = (videoSpec: VideoSpec): MotionRenderSpec => {
    logger.info('Motion Canvas agent: converting VideoSpec into render spec', {
      scenes: videoSpec.scenes.length,
      duration: videoSpec.duration,
    });

    const renderSpec: MotionRenderSpec = {
      duration: videoSpec.duration,
      scenes: videoSpec.scenes.map(cloneScene),
    };

    logger.info('Motion Canvas agent: render spec ready', {
      scenes: renderSpec.scenes.length,
    });

    return renderSpec;
  };

  return {
    buildRenderSpec,
  };
};
