import type {StructuredOutputHelper, StructuredOutputOptions} from '../../llm/structuredOutput.js';
import type {Logger} from '../../pipeline/logger.js';
import {silentLogger} from '../../pipeline/logger.js';
import {buildTopologyDirectorPrompt} from '../prompts/topologyDirectorPrompt.js';
import {
  formatIconValidationIssues,
  validateTopologyLucideIcons,
} from './lucideIconValidation.js';
import {
  topologyPlanResponseFormat,
  topologyPlanSchema,
  type TopologyPlan,
} from '../schema/topologyPlan.schema.js';
import type {StoryIntent} from '../schema/storyIntent.schema.js';

export interface TopologyDirectorInput {
  storyIntent: StoryIntent;
}

export interface TopologyDirectorAgent {
  generate(input: TopologyDirectorInput, options?: StructuredOutputOptions): Promise<TopologyPlan>;
}

export interface TopologyDirectorAgentDependencies {
  structuredOutputHelper: StructuredOutputHelper;
  logger?: Logger;
}

export const createTopologyDirectorAgent = (
  dependencies: TopologyDirectorAgentDependencies,
): TopologyDirectorAgent => {
  const logger = dependencies.logger ?? silentLogger;
  const maxIconRepairAttempts = 2;

  const generate = async (
    input: TopologyDirectorInput,
    options: StructuredOutputOptions = {},
  ): Promise<TopologyPlan> => {
    logger.info('V2 topology director agent: building prompt', {
      scenes: input.storyIntent.scenes.length,
      duration: input.storyIntent.duration,
      tone: input.storyIntent.tone,
    });

    const basePrompt = buildTopologyDirectorPrompt(input);
    const requestOptions: StructuredOutputOptions = {
      ...options,
      responseFormat: options.responseFormat ?? topologyPlanResponseFormat,
    };

    let repairPrompt = basePrompt;
    for (let attempt = 1; attempt <= maxIconRepairAttempts; attempt += 1) {
      const topologyPlan = await dependencies.structuredOutputHelper.generateStructuredOutput<TopologyPlan>(
        repairPrompt,
        topologyPlanSchema,
        requestOptions,
      );

      const iconValidation = await validateTopologyLucideIcons(topologyPlan, {logger});
      if (iconValidation.valid || iconValidation.skipped) {
        logger.info('V2 topology director agent: output validated', {
          scenes: topologyPlan.scenes.length,
          duration: topologyPlan.duration,
          iconValidationSkipped: iconValidation.skipped,
        });
        return topologyPlan;
      }

      const issueText = formatIconValidationIssues(iconValidation.issues);
      logger.warn('V2 topology director agent: invalid Lucide icon tokens, requesting repair', {
        attempt,
        maxAttempts: maxIconRepairAttempts,
        issues: iconValidation.issues.length,
      });

      if (attempt === maxIconRepairAttempts) {
        throw new Error(
          `Topology icon validation failed after ${maxIconRepairAttempts} attempts:\n${issueText}`,
        );
      }

      repairPrompt = `${basePrompt}

Icon validation feedback from previous response:
${issueText}

Fix only entities[].icon values.
Keep scene ids/timings/narration/entities/connections/operations/transition/directives aligned with StoryIntent.
Return full strict JSON only.`;
    }

    throw new Error('Topology generation failed unexpectedly');
  };

  return {generate};
};
