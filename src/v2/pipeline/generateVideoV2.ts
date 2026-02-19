import {readFile} from 'node:fs/promises';
import {
  createMotionCanvasAgent,
  type MotionCanvasAgent,
} from '../../agents/motionCanvasAgent.js';
import {createOpenAIClient, type LLMClient} from '../../llm/openaiClient.js';
import {createStructuredOutputHelper} from '../../llm/structuredOutput.js';
import {createRenderer, type Renderer} from '../../motion/renderer.js';
import {createArtifactRunContext, writeJsonArtifact} from '../../pipeline/artifacts.js';
import {createConsoleLogger, type Logger} from '../../pipeline/logger.js';
import {createStoryIntentAgent, createTopologyDirectorAgent} from '../agents/index.js';
import {layoutCompositionPlan, composeTopologyPlan, compileLaidOutPlanToDesignedMoments} from '../compile/index.js';
import {V2_PIPELINE_DEFAULTS} from '../config/constants.js';
import type {StoryIntentAgent} from '../agents/storyIntentAgent.js';
import type {TopologyDirectorAgent} from '../agents/topologyDirectorAgent.js';
import type {MotionPersonalityId} from '../../config/motionPersonalityTokens.js';
import {topologyPlanSchema, type TopologyPlan} from '../schema/topologyPlan.schema.js';
import {storyIntentSchema, type StoryIntent} from '../schema/storyIntent.schema.js';
import {analyzeSceneGaps} from '../analysis/sceneGapAnalyzer.js';

export interface GenerateVideoV2Input {
  topic: string;
  audience: string;
  duration: number;
  topologyInputPath?: string;
  storyIntentInputPath?: string;
  animate?: boolean;
  stableLayout?: boolean;
  personality?: MotionPersonalityId | string;
  outputPath?: string;
  storyIntentOutputPath?: string;
  topologyOutputPath?: string;
  model?: string;
  temperature?: number;
  seed?: number;
}

export interface GenerateVideoV2Dependencies {
  logger?: Logger;
  llmClient?: LLMClient;
  storyIntentAgent?: StoryIntentAgent;
  topologyDirectorAgent?: TopologyDirectorAgent;
  motionCanvasAgent?: MotionCanvasAgent;
  renderer?: Renderer;
}

const toMotionPersonality = (tone: 'fast' | 'educational' | 'dramatic'): MotionPersonalityId => {
  if (tone === 'fast' || tone === 'dramatic') {
    return 'ENERGETIC';
  }

  if (tone === 'educational') {
    return 'CALM';
  }

  return 'PREMIUM';
};

const normalizeMotionPersonality = (
  value: MotionPersonalityId | string | undefined,
): MotionPersonalityId | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }

  if (normalized === 'calm') {
    return 'CALM';
  }

  if (normalized === 'energetic') {
    return 'ENERGETIC';
  }

  if (normalized === 'premium') {
    return 'PREMIUM';
  }

  if (
    normalized === 'educational' ||
    normalized === 'beginner' ||
    normalized === 'slow' ||
    normalized === 'steady'
  ) {
    return 'CALM';
  }

  if (
    normalized === 'fast' ||
    normalized === 'dramatic' ||
    normalized === 'reel_fast' ||
    normalized === 'reelfast'
  ) {
    return 'ENERGETIC';
  }

  if (
    normalized === 'cinematic' ||
    normalized === 'default' ||
    normalized === 'balanced'
  ) {
    return 'PREMIUM';
  }

  return undefined;
};

export const generateVideoV2 = async (
  input: GenerateVideoV2Input,
  dependencies: GenerateVideoV2Dependencies = {},
): Promise<string> => {
  const logger = dependencies.logger ?? createConsoleLogger('generateVideoV2');

  logger.info('V2 pipeline start', {
    topic: input.topic,
    audience: input.audience,
    duration: input.duration,
  });

  const artifactRunContext = await createArtifactRunContext({
    pipeline: 'v2',
    logger,
  });

  const motionCanvasAgent = dependencies.motionCanvasAgent ?? createMotionCanvasAgent({logger});
  const renderer = dependencies.renderer ?? createRenderer({logger});

  let storyIntentOutputPath: string | undefined;
  let storyIntentTone: 'fast' | 'educational' | 'dramatic' = 'educational';
  let storyIntentForAnalysis: StoryIntent | undefined;
  let topologyPlan: TopologyPlan;

  if (input.topologyInputPath) {
    logger.info('V2 pipeline start (manual topology mode)', {
      topologyInputPath: input.topologyInputPath,
      animate: input.animate ?? true,
    });

    const topologyRaw = await readFile(input.topologyInputPath, {encoding: 'utf8'});
    const topologyParsed = JSON.parse(topologyRaw) as unknown;
    topologyPlan = topologyPlanSchema.parse(topologyParsed);

    if (input.storyIntentInputPath) {
      const storyIntentRaw = await readFile(input.storyIntentInputPath, {encoding: 'utf8'});
      const parsedStoryIntent = storyIntentSchema.parse(JSON.parse(storyIntentRaw) as unknown);
      storyIntentTone = parsedStoryIntent.tone;
      storyIntentForAnalysis = parsedStoryIntent;

      storyIntentOutputPath = await writeJsonArtifact({
        outputPath: input.storyIntentOutputPath ?? V2_PIPELINE_DEFAULTS.storyIntentPath,
        label: 'v2_story_intent_from_file',
        value: parsedStoryIntent,
        logger,
        runContext: artifactRunContext,
      });
    }
  } else {
    const llmClient = dependencies.llmClient ?? createOpenAIClient({logger});
    const structuredOutputHelper = createStructuredOutputHelper({llmClient, logger});

    const storyIntentAgent =
      dependencies.storyIntentAgent ?? createStoryIntentAgent({structuredOutputHelper, logger});
    const topologyDirectorAgent =
      dependencies.topologyDirectorAgent ??
      createTopologyDirectorAgent({
        structuredOutputHelper,
        logger,
      });

    const storyIntent = await storyIntentAgent.generate(
      {
        topic: input.topic,
        audience: input.audience,
        duration: input.duration,
      },
      {
        model: input.model,
        temperature: input.temperature ?? 0.2,
        seed: input.seed,
      },
    );

    storyIntentTone = storyIntent.tone;
    storyIntentForAnalysis = storyIntent;
    storyIntentOutputPath = await writeJsonArtifact({
      outputPath: input.storyIntentOutputPath ?? V2_PIPELINE_DEFAULTS.storyIntentPath,
      label: 'v2_story_intent',
      value: storyIntent,
      logger,
      runContext: artifactRunContext,
    });

    topologyPlan = await topologyDirectorAgent.generate(
      {
        storyIntent,
      },
      {
        model: input.model,
        temperature: input.temperature ?? 0.1,
        seed: input.seed,
      },
    );
  }

  const topologyOutputPath = await writeJsonArtifact({
    outputPath: input.topologyOutputPath ?? V2_PIPELINE_DEFAULTS.topologyPath,
    label: 'v2_topology',
    value: topologyPlan,
    logger,
    runContext: artifactRunContext,
  });

  const compositionPlan = composeTopologyPlan(topologyPlan);
  await writeJsonArtifact({
    outputPath: V2_PIPELINE_DEFAULTS.compositionPath,
    label: 'v2_composition',
    value: compositionPlan,
    logger,
    runContext: artifactRunContext,
  });

  const laidOutPlan = layoutCompositionPlan(compositionPlan);
  await writeJsonArtifact({
    outputPath: V2_PIPELINE_DEFAULTS.layoutPath,
    label: 'v2_layout',
    value: laidOutPlan,
    logger,
    runContext: artifactRunContext,
  });

  if (storyIntentForAnalysis) {
    const gapAnalysis = analyzeSceneGaps({
      storyIntent: storyIntentForAnalysis,
      topologyPlan,
      laidOutPlan,
    });
    await writeJsonArtifact({
      outputPath: V2_PIPELINE_DEFAULTS.gapAnalysisPath,
      label: 'v2_gap_analysis',
      value: gapAnalysis,
      logger,
      runContext: artifactRunContext,
    });
  }

  const designedMoments = compileLaidOutPlanToDesignedMoments(laidOutPlan);
  await writeJsonArtifact({
    outputPath: V2_PIPELINE_DEFAULTS.designedMomentsPath,
    label: 'v2_designed_moments',
    value: designedMoments,
    logger,
    runContext: artifactRunContext,
  });

  const normalizedPersonality = normalizeMotionPersonality(input.personality);
  if (input.personality && !normalizedPersonality) {
    logger.warn('Unknown motion personality provided; falling back to tone-derived personality', {
      requestedPersonality: input.personality,
      fallbackFromTone: storyIntentTone,
    });
  }
  const personality = normalizedPersonality ?? toMotionPersonality(storyIntentTone);
  const animate = input.animate ?? Boolean(input.topologyInputPath);
  const stableLayout = input.stableLayout ?? true;
  const renderSpec = motionCanvasAgent.buildRenderSpec(designedMoments, {
    personality,
    staticMode: !animate,
    stableLayout,
  });
  await writeJsonArtifact({
    outputPath: V2_PIPELINE_DEFAULTS.renderSpecPath,
    label: 'v2_render_spec',
    value: renderSpec,
    logger,
    runContext: artifactRunContext,
  });

  const outputPath = await renderer.render(renderSpec, {
    outputPath: input.outputPath,
  });

  logger.info('V2 pipeline complete', {
    outputPath,
    storyIntentOutputPath,
    topologyOutputPath,
    artifactRunDirectory: artifactRunContext.runDirectory,
    artifactRunId: artifactRunContext.runId,
    scenes: renderSpec.scenes.length,
    duration: renderSpec.duration,
  });

  return outputPath;
};
