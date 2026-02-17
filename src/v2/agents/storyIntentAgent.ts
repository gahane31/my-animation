import type {StructuredOutputHelper, StructuredOutputOptions} from '../../llm/structuredOutput.js';
import type {Logger} from '../../pipeline/logger.js';
import {silentLogger} from '../../pipeline/logger.js';
import {
  buildStoryIntentPrompt,
  type StoryIntentPromptInput,
} from '../prompts/storyIntentPrompt.js';
import {
  formatIconValidationIssues,
  validateStoryIntentLucideIcons,
} from './lucideIconValidation.js';
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
  const maxIconRepairAttempts = 2;

  const generate = async (
    input: StoryIntentPromptInput,
    options: StructuredOutputOptions = {},
  ): Promise<StoryIntent> => {
    logger.info('V2 story intent agent: building prompt', {
      topic: input.topic,
      audience: input.audience,
      duration: input.duration,
    });

    const basePrompt = buildStoryIntentPrompt(input);
    const requestOptions: StructuredOutputOptions = {
      ...options,
      responseFormat: options.responseFormat ?? storyIntentResponseFormat,
    };

    let repairPrompt = basePrompt;
    for (let attempt = 1; attempt <= maxIconRepairAttempts; attempt += 1) {
      const storyIntent = await dependencies.structuredOutputHelper.generateStructuredOutput<StoryIntent>(
        repairPrompt,
        storyIntentSchema,
        requestOptions,
      );

      const iconValidation = await validateStoryIntentLucideIcons(storyIntent, {logger});
      if (iconValidation.valid || iconValidation.skipped) {
        logger.info('V2 story intent agent: output validated', {
          scenes: storyIntent.scenes.length,
          duration: storyIntent.duration,
          tone: storyIntent.tone,
          iconValidationSkipped: iconValidation.skipped,
        });
        return storyIntent;
      }

      const issueText = formatIconValidationIssues(iconValidation.issues);
      logger.warn('V2 story intent agent: invalid Lucide icon tokens, requesting repair', {
        attempt,
        maxAttempts: maxIconRepairAttempts,
        issues: iconValidation.issues.length,
      });

      if (attempt === maxIconRepairAttempts) {
        throw new Error(
          `StoryIntent icon validation failed after ${maxIconRepairAttempts} attempts:\n${issueText}`,
        );
      }

      repairPrompt = `${basePrompt}

Icon validation feedback from previous response:
${issueText}

Fix only icon_hints.icon values.
Keep scene timing, archetypes, required_component_types, focus_component_types, transition_goal, and narration unchanged unless needed for consistency.
Return full strict JSON only.`;
    }

    throw new Error('StoryIntent generation failed unexpectedly');
  };

  return {generate};
};
