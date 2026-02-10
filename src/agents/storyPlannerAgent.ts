import {buildStoryPlannerPrompt, type StoryPlannerInput} from '../prompts/storyPlannerPrompt.js';
import {
  StoryPlanSchema,
  storyPlanResponseFormat,
  type StoryPlan,
} from '../schema/storyPlannerSchema.js';
import type {StructuredOutputHelper, StructuredOutputOptions} from '../llm/structuredOutput.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';

export interface StoryPlannerAgent {
  generate(input: StoryPlannerInput, options?: StructuredOutputOptions): Promise<StoryPlan>;
}

export interface StoryPlannerAgentDependencies {
  structuredOutputHelper: StructuredOutputHelper;
  logger?: Logger;
}

export const createStoryPlannerAgent = (
  dependencies: StoryPlannerAgentDependencies,
): StoryPlannerAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const generate = async (
    input: StoryPlannerInput,
    options: StructuredOutputOptions = {},
  ): Promise<StoryPlan> => {
    logger.info('Story planner agent: building prompt', {
      topic: input.topic,
      audience: input.audience,
      duration: input.duration,
    });

    const prompt = buildStoryPlannerPrompt(input);
    const requestOptions: StructuredOutputOptions = {
      ...options,
      responseFormat: options.responseFormat ?? storyPlanResponseFormat,
    };

    const storyPlan = await dependencies.structuredOutputHelper.generateStructuredOutput<StoryPlan>(
      prompt,
      StoryPlanSchema,
      requestOptions,
    );

    logger.info('Story planner agent: validated StoryPlan generated', {
      beats: storyPlan.beats.length,
      duration: storyPlan.duration,
      tone: storyPlan.tone,
    });

    return storyPlan;
  };

  return {generate};
};
