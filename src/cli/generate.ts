import {generateVideo} from '../pipeline/generateVideo.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const serializeError = (value: unknown): string => {
  if (!(value instanceof Error)) {
    return safeStringify(value);
  }

  const payload: Record<string, unknown> = {
    name: value.name,
    message: value.message,
    stack: value.stack,
  };

  const withCause = value as Error & {cause?: unknown};
  if (withCause.cause !== undefined) {
    payload.cause = withCause.cause;
  }

  if (isRecord(value) && 'issues' in value) {
    payload.issues = value.issues;
  }

  return safeStringify(payload);
};

async function main() {
  try {
    const args = process.argv.slice(2);

    const readArg = (name: string): string | undefined => {
      const index = args.indexOf(`--${name}`);
      if (index === -1) {
        return undefined;
      }

      return args[index + 1];
    };

    const topic = readArg('topic') ?? 'How systems scale to 1 million users';
    const audience = readArg('audience') ?? 'beginner';
    const durationArg = readArg('duration');
    const model = readArg('model');
    const outputPath = readArg('output');
    const storyPlanOutputPath = readArg('story-plan-output');
    const llmVideoSpecOutputPath = readArg('llm-spec-output');
    const duration = durationArg ? Number(durationArg) : 60;

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error('Invalid --duration. Provide a positive number.');
    }

    const result = await generateVideo({
      topic,
      audience,
      duration,
      model,
      outputPath,
      storyPlanOutputPath,
      llmVideoSpecOutputPath,
    });
    console.log('Video generated:', result);
  } catch (err) {
    console.error(`Error: ${serializeError(err)}`);
    process.exit(1);
  }
}

main();
