import type {StructuredOutputHelper, StructuredOutputOptions} from '../../llm/structuredOutput.js';
import type {Logger} from '../../pipeline/logger.js';
import {silentLogger} from '../../pipeline/logger.js';
import {
  buildStoryIntentPrompt,
  type StoryIntentPromptInput,
} from '../prompts/storyIntentPrompt.js';
import {
  storyIntentResponseFormat,
  storyIntentSchema,
  type StoryIntent,
} from '../schema/storyIntent.schema.js';

export interface StoryIntentAgent {
  generate(input: StoryIntentPromptInput, options?: StructuredOutputOptions): Promise<StoryIntent>;
}

export interface StoryIntentAgentDependencies {
  structuredOutputHelper: StructuredOutputHelper;
  logger?: Logger;
}

export const createStoryIntentAgent = (
  dependencies: StoryIntentAgentDependencies,
): StoryIntentAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const generate = async (
    input: StoryIntentPromptInput,
    options: StructuredOutputOptions = {},
  ): Promise<StoryIntent> => {
    logger.info('V2 story intent agent: building prompt', {
      topic: input.topic,
      audience: input.audience,
      duration: input.duration,
    });

    const prompt = buildStoryIntentPrompt(input);
    const requestOptions: StructuredOutputOptions = {
      ...options,
      responseFormat: options.responseFormat ?? storyIntentResponseFormat,
    };

    const storyIntent = await dependencies.structuredOutputHelper.generateStructuredOutput<StoryIntent>(
      prompt,
      storyIntentSchema,
      requestOptions,
    );

    logger.info('V2 story intent agent: output validated', {
      scenes: storyIntent.scenes.length,
      duration: storyIntent.duration,
      tone: storyIntent.tone,
    });

    return storyIntent;
  };

  return {generate};
};

