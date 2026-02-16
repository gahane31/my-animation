import {createDesignDirector, type DesignDirector} from '../agents/designDirector.js';
import {
  createMomentDirectorAgent,
  type MomentDirectorAgent,
} from '../agents/momentDirectorAgent.js';
import {
  createMotionCanvasAgent,
  type MotionCanvasAgent,
} from '../agents/motionCanvasAgent.js';
import {applyAttentionHook} from '../design/hookEngine.js';
import {applyNarrativePacing, buildPacingDiffs} from '../design/pacingEngine.js';
import {selectPersonality} from '../design/personalitySelector.js';
import {
  createStoryPlannerAgent,
  type StoryPlannerAgent,
} from '../agents/storyPlannerAgent.js';
import {PIPELINE_DEFAULTS} from '../config/constants.js';
import {createOpenAIClient, type LLMClient} from '../llm/openaiClient.js';
import {createStructuredOutputHelper} from '../llm/structuredOutput.js';
import {createRenderer, type Renderer} from '../motion/renderer.js';
import {collectMomentVisualActivityWarnings} from '../schema/moment.schema.js';
import {createArtifactRunContext, writeJsonArtifact} from './artifacts.js';
import {buildIncrementalScenes} from './stateBuilder.js';
import {createConsoleLogger, type Logger} from './logger.js';

export interface GenerateVideoInput {
  topic: string;
  audience: string;
  duration: number;
  outputPath?: string;
  storyPlanOutputPath?: string;
  momentsOutputPath?: string;
  // Backward-compatible alias for older CLI flag.
  llmVideoSpecOutputPath?: string;
  model?: string;
  temperature?: number;
  seed?: number;
}

export interface GenerateVideoDependencies {
  logger?: Logger;
  llmClient?: LLMClient;
  storyPlannerAgent?: StoryPlannerAgent;
  momentDirectorAgent?: MomentDirectorAgent;
  designDirector?: DesignDirector;
  motionCanvasAgent?: MotionCanvasAgent;
  renderer?: Renderer;
}

export const generateVideo = async (
  input: GenerateVideoInput,
  dependencies: GenerateVideoDependencies = {},
): Promise<string> => {
  const logger = dependencies.logger ?? createConsoleLogger('generateVideo');

  logger.info('Pipeline start', {
    topic: input.topic,
    audience: input.audience,
    duration: input.duration,
  });

  const artifactRunContext = await createArtifactRunContext({
    pipeline: 'v1',
    logger,
  });

  const llmClient = dependencies.llmClient ?? createOpenAIClient({logger});
  const structuredOutputHelper = createStructuredOutputHelper({llmClient, logger});

  const storyPlannerAgent =
    dependencies.storyPlannerAgent ?? createStoryPlannerAgent({structuredOutputHelper, logger});
  const momentDirectorAgent =
    dependencies.momentDirectorAgent ??
    createMomentDirectorAgent({
      structuredOutputHelper,
      logger,
    });
  const designDirector = dependencies.designDirector ?? createDesignDirector({logger});
  const motionCanvasAgent = dependencies.motionCanvasAgent ?? createMotionCanvasAgent({logger});
  const renderer = dependencies.renderer ?? createRenderer({logger});

  const storyPlan = await storyPlannerAgent.generate(
    {
      topic: input.topic,
      audience: input.audience,
      duration: input.duration,
    },
    {
      model: input.model,
      temperature: input.temperature ?? 0.3,
      seed: input.seed,
    },
  );

  const storyPlanOutputPath = await writeJsonArtifact({
    outputPath: input.storyPlanOutputPath ?? PIPELINE_DEFAULTS.storyPlanPath,
    label: 'story_plan',
    value: storyPlan,
    logger,
    runContext: artifactRunContext,
  });
  const personality = selectPersonality(storyPlan);

  logger.info('Pipeline: motion personality selected', {
    personality,
    tone: storyPlan.tone,
  });

  const momentsVideo = await momentDirectorAgent.generate(
    {
      storyPlan,
    },
    {
      model: input.model,
      temperature: input.temperature,
      seed: input.seed,
    },
  );

  const momentsOutputPath = await writeJsonArtifact({
    outputPath:
      input.momentsOutputPath ??
      input.llmVideoSpecOutputPath ??
      PIPELINE_DEFAULTS.momentsPath,
    label: 'moments_video',
    value: momentsVideo,
    logger,
    runContext: artifactRunContext,
  });
  await writeJsonArtifact({
    outputPath: PIPELINE_DEFAULTS.momentsDebugPath,
    label: 'moments_debug',
    value: momentsVideo,
    logger,
    runContext: artifactRunContext,
  });

  const hookedMoments = applyAttentionHook(momentsVideo.moments, storyPlan);
  const hookedMomentsVideo = {
    ...momentsVideo,
    moments: hookedMoments,
  };

  logger.info('Pipeline: attention hook applied', {
    firstMomentId: hookedMoments[0]?.id,
    firstMomentDuration:
      hookedMoments[0] ? hookedMoments[0].end - hookedMoments[0].start : undefined,
    isHook: hookedMoments[0]?.isHook ?? false,
  });

  const pacingDiffs = buildPacingDiffs(hookedMomentsVideo.moments);
  const pacedMoments = applyNarrativePacing(hookedMomentsVideo.moments, pacingDiffs, storyPlan);
  const pacedMomentsVideo = {
    ...hookedMomentsVideo,
    moments: pacedMoments,
  };

  logger.info('Pipeline: narrative pacing applied', {
    moments: pacedMoments.length,
    minSceneDuration: Math.min(...pacedMoments.map((moment) => moment.end - moment.start)),
    maxSceneDuration: Math.max(...pacedMoments.map((moment) => moment.end - moment.start)),
  });

  const incrementalScenes = buildIncrementalScenes(pacedMomentsVideo.moments, {logger});
  const incrementalMomentsVideo = {
    ...pacedMomentsVideo,
    moments: incrementalScenes,
  };
  await writeJsonArtifact({
    outputPath: PIPELINE_DEFAULTS.scenesIncrementalPath,
    label: 'scenes_incremental',
    value: incrementalScenes,
    logger,
    runContext: artifactRunContext,
  });

  const activityWarnings = collectMomentVisualActivityWarnings(incrementalMomentsVideo);
  for (const warning of activityWarnings) {
    logger.warn('Pipeline: low visual activity warning', {...warning});
  }

  const designedMoments = designDirector.refineMoments(incrementalMomentsVideo);
  await writeJsonArtifact({
    outputPath: PIPELINE_DEFAULTS.momentsAfterLayoutPath,
    label: 'moments_after_layout',
    value: designedMoments,
    logger,
    runContext: artifactRunContext,
  });
  const renderSpec = motionCanvasAgent.buildRenderSpec(designedMoments, {personality});
  await writeJsonArtifact({
    outputPath: PIPELINE_DEFAULTS.renderSpecDebugPath,
    label: 'render_spec_debug',
    value: renderSpec,
    logger,
    runContext: artifactRunContext,
  });

  // TODO: Add voiceover generation (TTS) based on scene narration.
  // TODO: Auto-adjust scene timing from narration duration.
  // TODO: Support batch reel generation for topic lists.
  // TODO: Add style presets (viral / deep / fast) into director defaults.
  // TODO: Add domain-specific component templates.
  const outputPath = await renderer.render(renderSpec, {
    outputPath: input.outputPath,
  });

  logger.info('Pipeline complete', {
    outputPath,
    storyPlanOutputPath,
    momentsOutputPath,
    artifactRunDirectory: artifactRunContext.runDirectory,
    artifactRunId: artifactRunContext.runId,
    totalScenes: renderSpec.scenes.length,
    duration: renderSpec.duration,
  });

  return outputPath;
};
