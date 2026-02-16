import type {StructuredOutputHelper, StructuredOutputOptions} from '../llm/structuredOutput.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';
import {buildMomentDirectorPrompt} from '../prompts/momentDirectorPrompt.js';
import {
  MomentsVideoSchema,
  type MomentsVideo,
} from '../schema/moment.schema.js';
import {momentResponseFormat} from '../schema/momentResponseFormat.js';
import type {StoryPlan} from '../schema/storyPlannerSchema.js';

export interface MomentDirectorInput {
  storyPlan: StoryPlan;
}

export interface MomentDirectorAgent {
  generate(input: MomentDirectorInput, options?: StructuredOutputOptions): Promise<MomentsVideo>;
}

export interface MomentDirectorAgentDependencies {
  structuredOutputHelper: StructuredOutputHelper;
  logger?: Logger;
}

export const createMomentDirectorAgent = (
  dependencies: MomentDirectorAgentDependencies,
): MomentDirectorAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const generate = async (
    input: MomentDirectorInput,
    options: StructuredOutputOptions = {},
  ): Promise<MomentsVideo> => {
    logger.info('Moment director agent: building prompt', {
      beats: input.storyPlan.beats.length,
      duration: input.storyPlan.duration,
      tone: input.storyPlan.tone,
    });

    const prompt = buildMomentDirectorPrompt({storyPlan: input.storyPlan});
    const requestOptions: StructuredOutputOptions = {
      ...options,
      responseFormat: options.responseFormat ?? momentResponseFormat,
    };

    const moments = await dependencies.structuredOutputHelper.generateStructuredOutput<MomentsVideo>(
      prompt,
      MomentsVideoSchema,
      requestOptions,
    );

    logger.info('Moment director agent: validated MomentsVideo generated', {
      moments: moments.moments.length,
      duration: moments.duration,
    });

    return moments;
  };

  return {generate};
};
