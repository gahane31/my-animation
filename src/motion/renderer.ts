import {mkdir, writeFile} from 'fs/promises';
import {dirname, resolve} from 'path';
import {PIPELINE_DEFAULTS} from '../config/constants.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';
import type {MotionRenderSpec} from './types.js';

const buildSceneSource = (renderSpec: MotionRenderSpec): string => {
  const renderSpecLiteral = JSON.stringify(renderSpec, null, 2);

  return `/** @jsxImportSource @motion-canvas/2d/lib */
import {makeScene2D, Txt} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {StyleTokens} from '../config/styleTokens.js';
import {
  createRuntimeLogger,
  createSceneState,
  executeScene,
  validateSceneForRuntime,
} from '../motion/sceneExecutor.js';
import {advanceTimeline, createTimelineState, waitUntil} from '../motion/timeline.js';
import type {MotionRenderSpec} from '../motion/types.js';

const renderSpec = ${renderSpecLiteral} as unknown as MotionRenderSpec;
const TIMELINE_EPSILON = 0.001;

export default makeScene2D(function* (view) {
  const caption = createRef<Txt>();
  view.fill(StyleTokens.colors.background);

  view.add(
    <Txt
      ref={caption}
      y={-420}
      fill={StyleTokens.colors.text}
      fontFamily={StyleTokens.text.fontFamily}
      fontSize={StyleTokens.text.fontSizeSecondary}
      fontWeight={StyleTokens.text.fontWeight}
      opacity={0}
      maxWidth={1500}
      textAlign={'center'}
    />,
  );

  const logger = createRuntimeLogger('runtime');
  const timeline = createTimelineState(0);
  const sceneState = createSceneState({
    caption: caption(),
    logger,
  });
  sceneState.camera.originX = view.x();
  sceneState.camera.originY = view.y();
  sceneState.camera.x = sceneState.camera.originX;
  sceneState.camera.y = sceneState.camera.originY;

  for (const scene of renderSpec.scenes) {
    const sceneDuration = scene.end - scene.start;

    if (sceneDuration <= 0) {
      throw new Error(\`Invalid scene duration: \${scene.id}\`);
    }

    validateSceneForRuntime(scene, logger);

    yield* waitUntil(timeline, scene.start, logger);
    yield* executeScene(view, scene, sceneState);
    advanceTimeline(timeline, sceneState.lastExecutionDuration);
    yield* waitUntil(timeline, scene.end, logger);

    sceneState.sceneIndex += 1;
  }

  if (Math.abs(timeline.current - renderSpec.duration) > TIMELINE_EPSILON) {
    logger.warn('Timeline mismatch', {
      expected: renderSpec.duration,
      actual: timeline.current,
    });
  }
});
`;
};

export interface RenderOptions {
  outputPath?: string;
}

export interface Renderer {
  render(renderSpec: MotionRenderSpec, options?: RenderOptions): Promise<string>;
}

export interface RendererDependencies {
  logger?: Logger;
}

export const createRenderer = (dependencies: RendererDependencies = {}): Renderer => {
  const logger = dependencies.logger ?? silentLogger;

  const render = async (
    renderSpec: MotionRenderSpec,
    options: RenderOptions = {},
  ): Promise<string> => {
    const outputPath = resolve(options.outputPath ?? PIPELINE_DEFAULTS.generatedScenePath);
    const sourceCode = buildSceneSource(renderSpec);

    await mkdir(dirname(outputPath), {recursive: true});
    await writeFile(outputPath, sourceCode, {encoding: 'utf8'});

    logger.info('Renderer: generated Motion Canvas scene file', {
      outputPath,
      scenes: renderSpec.scenes.length,
    });

    return outputPath;
  };

  return {render};
};
