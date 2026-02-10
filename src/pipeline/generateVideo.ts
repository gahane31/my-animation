import {createDirectorAgent, type DirectorAgent} from '../agents/directorAgent.js';
import {createMotionCanvasAgent, type MotionCanvasAgent} from '../agents/motionCanvasAgent.js';
import {createScriptAgent, type ScriptAgent} from '../agents/scriptAgent.js';
import {createStoryPlannerAgent, type StoryPlannerAgent} from '../agents/storyPlannerAgent.js';
import {createOpenAIClient, type LLMClient} from '../llm/openaiClient.js';
import {createStructuredOutputHelper} from '../llm/structuredOutput.js';
import {createRenderer, type Renderer} from '../motion/renderer.js';
import {PIPELINE_DEFAULTS} from '../config/constants.js';
import {writeJsonArtifact} from './artifacts.js';
import {createConsoleLogger, type Logger} from './logger.js';

export interface GenerateVideoInput {
  topic: string;
  audience: string;
  duration: number;
  outputPath?: string;
  storyPlanOutputPath?: string;
  llmVideoSpecOutputPath?: string;
  model?: string;
  temperature?: number;
  seed?: number;
}

export interface GenerateVideoDependencies {
  logger?: Logger;
  llmClient?: LLMClient;
  storyPlannerAgent?: StoryPlannerAgent;
  videoDirectorAgent?: ScriptAgent;
  // Backward compatibility alias.
  scriptAgent?: ScriptAgent;
  directorAgent?: DirectorAgent;
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

  const llmClient = dependencies.llmClient ?? createOpenAIClient({logger});
  const structuredOutputHelper = createStructuredOutputHelper({llmClient, logger});
  const storyPlannerAgent =
    dependencies.storyPlannerAgent ?? createStoryPlannerAgent({structuredOutputHelper, logger});
  const videoDirectorAgent =
    dependencies.videoDirectorAgent ??
    dependencies.scriptAgent ??
    createScriptAgent({structuredOutputHelper, logger});
  const directorAgent = dependencies.directorAgent ?? createDirectorAgent({logger});
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
  });

  const llmVideoSpec = await videoDirectorAgent.generate(
    {
      storyPlan,
    },
    {
      model: input.model,
      temperature: input.temperature,
      seed: input.seed,
    },
  );
  const llmVideoSpecOutputPath = await writeJsonArtifact({
    outputPath: input.llmVideoSpecOutputPath ?? PIPELINE_DEFAULTS.llmVideoSpecPath,
    label: 'llm_video_spec',
    value: llmVideoSpec,
    logger,
  });

  const refinedVideoSpec = directorAgent.refine(llmVideoSpec);
  const renderSpec = motionCanvasAgent.buildRenderSpec(refinedVideoSpec);

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
    llmVideoSpecOutputPath,
    totalScenes: renderSpec.scenes.length,
    duration: renderSpec.duration,
  });

  return outputPath;
};
