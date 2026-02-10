import type {VideoSpec} from '../schema/videoSpec.schema.js';
import {videoSpecSchema} from '../schema/videoSpec.schema.js';
import {videoSpecResponseFormat} from '../schema/videoSpec.schema.js';
import {buildVideoDirectorPrompt} from '../llm/prompts.js';
import type {StructuredOutputHelper, StructuredOutputOptions} from '../llm/structuredOutput.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';
import type {StoryPlan} from '../schema/storyPlannerSchema.js';

export interface ScriptAgentInput {
  storyPlan: StoryPlan;
}

export interface ScriptAgent {
  generate(input: ScriptAgentInput, options?: StructuredOutputOptions): Promise<VideoSpec>;
}

export interface ScriptAgentDependencies {
  structuredOutputHelper: StructuredOutputHelper;
  logger?: Logger;
}

export const createScriptAgent = (dependencies: ScriptAgentDependencies): ScriptAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const generate = async (
    input: ScriptAgentInput,
    options: StructuredOutputOptions = {},
  ): Promise<VideoSpec> => {
    logger.info('Script agent: building prompt', {
      beats: input.storyPlan.beats.length,
      duration: input.storyPlan.duration,
      tone: input.storyPlan.tone,
    });

    const prompt = buildVideoDirectorPrompt({
      storyPlan: input.storyPlan,
    });
    const requestOptions: StructuredOutputOptions = {
      ...options,
      responseFormat: options.responseFormat ?? videoSpecResponseFormat,
    };

    const videoSpec = await dependencies.structuredOutputHelper.generateStructuredOutput<VideoSpec>(
      prompt,
      videoSpecSchema,
      requestOptions,
    );

    logger.info('Script agent: validated VideoSpec generated', {
      scenes: videoSpec.scenes.length,
      duration: videoSpec.duration,
    });

    return videoSpec;
  };

  return {generate};
};
