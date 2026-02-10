import type {ZodType, ZodTypeDef} from 'zod';
import {ZodError} from 'zod';
import {LLM_DEFAULTS} from '../config/constants.js';
import type {LLMClient, LLMRequest} from './openaiClient.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';

const PARSE_ERROR = 'STRUCTURED_OUTPUT_PARSE_ERROR';
const MAX_RETRY_JSON_CHARS = 40000;
const MAX_ISSUES_IN_PROMPT = 20;

class StructuredOutputParseError extends Error {
  public readonly originalError: unknown;

  public constructor(originalError: unknown) {
    super(PARSE_ERROR);
    this.name = PARSE_ERROR;
    this.originalError = originalError;
  }
}

const toError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value;
  }

  return new Error(String(value));
};

const extractJsonBlock = (raw: string): string => {
  const trimmed = raw.trim();

  if (trimmed.startsWith('```')) {
    const stripped = trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    if (stripped.length > 0) {
      return stripped;
    }
  }

  const objectStart = trimmed.indexOf('{');
  const objectEnd = trimmed.lastIndexOf('}');

  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    return trimmed.slice(objectStart, objectEnd + 1);
  }

  return trimmed;
};

const repairJsonLike = (input: string): string => {
  let output = input.trim().replace(/^\uFEFF/, '');

  // Remove trailing commas in objects/arrays.
  output = output.replace(/,\s*([}\]])/g, '$1');

  // Convert non-JSON JavaScript token to JSON null.
  output = output
    .replace(/:\s*undefined\b/g, ': null')
    .replace(/\bundefined\b(?=\s*[,}\]])/g, 'null');

  // Normalize other non-JSON numeric tokens.
  output = output
    .replace(/\bNaN\b/g, 'null')
    .replace(/\b-Infinity\b/g, 'null')
    .replace(/\bInfinity\b/g, 'null');

  return output;
};

const parseJson = (raw: string): unknown => {
  const candidate = extractJsonBlock(raw);

  try {
    return JSON.parse(candidate) as unknown;
  } catch (firstError) {
    const repairedCandidate = repairJsonLike(candidate);

    if (repairedCandidate !== candidate) {
      try {
        return JSON.parse(repairedCandidate) as unknown;
      } catch (secondError) {
        throw new StructuredOutputParseError({
          firstError,
          secondError,
          candidatePreview: candidate.slice(0, 500),
          repairedPreview: repairedCandidate.slice(0, 500),
        });
      }
    }

    throw new StructuredOutputParseError({
      firstError,
      candidatePreview: candidate.slice(0, 500),
    });
  }
};

const formatIssuePath = (path: Array<string | number>): string =>
  path.length > 0 ? path.join('.') : '<root>';

const summarizeValidationIssues = (error: ZodError): string => {
  const issueLines = error.issues
    .slice(0, MAX_ISSUES_IN_PROMPT)
    .map((issue) => `- ${formatIssuePath(issue.path)}: ${issue.message}`);

  if (issueLines.length === 0) {
    return '- <root>: unknown validation issue';
  }

  return issueLines.join('\n');
};

const truncateForPrompt = (value: string, maxChars = MAX_RETRY_JSON_CHARS): string => {
  if (value.length <= maxChars) {
    return value;
  }

  const truncatedChars = value.length - maxChars;
  return `${value.slice(0, maxChars)}\n[TRUNCATED ${truncatedChars} CHARS]`;
};

const normalizeRetryPayload = (value: string | null): string => {
  if (!value) {
    return '{}';
  }

  return truncateForPrompt(value);
};

interface RetryPromptContext {
  basePrompt: string;
  error: Error;
  previousJson: string | null;
  previousRaw: string | null;
}

const buildValidationRetryPrompt = (
  basePrompt: string,
  error: ZodError,
  previousJson: string | null,
): string => {
  const issueSummary = summarizeValidationIssues(error);
  const jsonPayload = normalizeRetryPayload(previousJson);

  // Added explicit instruction to pay attention to numerical constraints
  return `${basePrompt}

The previous JSON failed validation.

Errors:
${issueSummary}

Here is the previous JSON:
BEGIN_PREVIOUS_JSON
${jsonPayload}
END_PREVIOUS_JSON

Fix the JSON and return a corrected version.
Fix only the listed errors and preserve all valid content.
Pay close attention to numerical constraints and timing math.
Do not regenerate from scratch unless necessary.
Return only strict JSON.`;
};

const buildParseRetryPrompt = (
  basePrompt: string,
  error: Error,
  previousRaw: string | null,
): string => {
  const rawPayload = normalizeRetryPayload(previousRaw);

  return `${basePrompt}

The previous response was not valid strict JSON.

Parse error:
- ${error.message}

Here is the previous response:
BEGIN_PREVIOUS_OUTPUT
${rawPayload}
END_PREVIOUS_OUTPUT

Fix formatting only and return strict JSON.
Do not add markdown fences or commentary.
Return only strict JSON.`;
};

const buildRetryPrompt = ({
  basePrompt,
  error,
  previousJson,
  previousRaw,
}: RetryPromptContext): string => {
  if (error instanceof ZodError) {
    return buildValidationRetryPrompt(basePrompt, error, previousJson);
  }

  return buildParseRetryPrompt(basePrompt, error, previousRaw);
};

export interface StructuredOutputOptions extends Omit<LLMRequest, 'prompt'> {}

export interface StructuredOutputHelper {
  generateStructuredOutput<T>(
    prompt: string,
    schema: ZodType<T, ZodTypeDef, unknown>,
    options?: StructuredOutputOptions,
  ): Promise<T>;
}

export interface StructuredOutputDependencies {
  llmClient: LLMClient;
  logger?: Logger;
}

export const createStructuredOutputHelper = (
  dependencies: StructuredOutputDependencies,
): StructuredOutputHelper => {
  const logger = dependencies.logger ?? silentLogger;

  const generateStructuredOutput = async <T>(
    prompt: string,
    schema: ZodType<T, ZodTypeDef, unknown>,
    options: StructuredOutputOptions = {},
  ): Promise<T> => {
    const maxAttempts = LLM_DEFAULTS.maxParseRetries + 1;
    let lastError: Error | null = null;
    let currentPrompt = prompt;
    let previousRawResponse: string | null = null;
    let previousJsonResponse: string | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const raw = await dependencies.llmClient.callLLM({prompt: currentPrompt, ...options});
        previousRawResponse = raw;

        const parsed = parseJson(raw);
        previousJsonResponse = JSON.stringify(parsed, null, 2);

        return schema.parse(parsed);
      } catch (error) {
        const typedError = toError(error);
        lastError = typedError;

        const isParseError =
          typedError.message === PARSE_ERROR || typedError.name === PARSE_ERROR;
        const isValidationError = typedError instanceof ZodError;
        const shouldRetry = attempt < maxAttempts && (isParseError || isValidationError);

        logger.warn('Structured output parsing attempt failed', {
          attempt,
          maxAttempts,
          isParseError,
          isValidationError,
          message: typedError.message,
          parseDetails:
            typedError instanceof StructuredOutputParseError
              ? typedError.originalError
              : undefined,
          validationIssues:
            typedError instanceof ZodError ? summarizeValidationIssues(typedError) : undefined,
        });

        if (!shouldRetry) {
          throw typedError;
        }

        currentPrompt = buildRetryPrompt({
          basePrompt: prompt,
          error: typedError,
          previousJson: previousJsonResponse,
          previousRaw: previousRawResponse,
        });
      }
    }

    throw new Error(lastError?.message ?? 'Structured output generation failed');
  };

  return {generateStructuredOutput};
};