import type {StructuredOutputHelper, StructuredOutputOptions} from '../../llm/structuredOutput.js';
import type {Logger} from '../../pipeline/logger.js';
import {silentLogger} from '../../pipeline/logger.js';
import {buildTopologyDirectorPrompt} from '../prompts/topologyDirectorPrompt.js';
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

  const generate = async (
    input: TopologyDirectorInput,
    options: StructuredOutputOptions = {},
  ): Promise<TopologyPlan> => {
    logger.info('V2 topology director agent: building prompt', {
      scenes: input.storyIntent.scenes.length,
      duration: input.storyIntent.duration,
      tone: input.storyIntent.tone,
    });

    const prompt = buildTopologyDirectorPrompt(input);
    const requestOptions: StructuredOutputOptions = {
      ...options,
      responseFormat: options.responseFormat ?? topologyPlanResponseFormat,
    };

    const topologyPlan = await dependencies.structuredOutputHelper.generateStructuredOutput<TopologyPlan>(
      prompt,
      topologyPlanSchema,
      requestOptions,
    );

    logger.info('V2 topology director agent: output validated', {
      scenes: topologyPlan.scenes.length,
      duration: topologyPlan.duration,
    });

    return topologyPlan;
  };

  return {generate};
};

