import {config as loadEnv} from 'dotenv';
import OpenAI from 'openai';
import {LLM_DEFAULTS} from '../config/constants.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';

loadEnv();

interface ProcessContainer {
  process?: {
    env?: Record<string, string | undefined>;
  };
}

const readEnv = (key: string): string | undefined =>
  (globalThis as ProcessContainer).process?.env?.[key];

export interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  seed?: number;
  responseFormat?: LLMResponseFormat;
}

export interface LLMClient {
  callLLM(request: LLMRequest): Promise<string>;
}

export interface OpenAIClientOptions {
  apiKey?: string;
  logger?: Logger;
}

export interface LLMJsonObjectResponseFormat {
  type: 'json_object';
}

export interface LLMJsonSchemaResponseFormat {
  type: 'json_schema';
  name: string;
  schema: Record<string, unknown>;
  description?: string;
  strict?: boolean | null;
}

export type LLMResponseFormat = LLMJsonObjectResponseFormat | LLMJsonSchemaResponseFormat;

export const createOpenAIClient = (options: OpenAIClientOptions = {}): LLMClient => {
  const logger = options.logger ?? silentLogger;
  const apiKey = options.apiKey ?? readEnv('OPENAI_API_KEY');

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const client = new OpenAI({apiKey});

  const callLLM = async (request: LLMRequest): Promise<string> => {
    const model = request.model ?? readEnv('OPENAI_MODEL') ?? LLM_DEFAULTS.model;
    const temperature = request.temperature ?? LLM_DEFAULTS.temperature;
    const seed = request.seed ?? LLM_DEFAULTS.seed;

    logger.info('Calling LLM', {model, temperature, seed});

    const response = await client.responses.create({
      model,
      input: request.prompt,
      temperature,
      text: {
        format: request.responseFormat ?? {type: 'json_object'},
      },
    });

    const outputText = response.output_text.trim();

    if (!outputText) {
      throw new Error('LLM returned an empty response');
    }

    return outputText;
  };

  return {callLLM};
};
