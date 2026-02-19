import {generateVideo} from '../pipeline/generateVideo.js';
import {generateVideoV2} from '../v2/pipeline/generateVideoV2.js';

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
    const hasFlag = (name: string): boolean => args.includes(`--${name}`);

    const topic = readArg('topic') ?? 'How systems scale to 1 million users';
    const audience = readArg('audience') ?? 'beginner';
    const durationArg = readArg('duration');
    const model = readArg('model');
    const topologyInputPath = readArg('topology-input');
    const storyIntentInputPath = readArg('story-intent-input');
    const personalityArg = readArg('personality');
    const animate = hasFlag('animate') ? true : undefined;
    const stableLayout = hasFlag('stable-layout') ? true : undefined;
    const outputPath = readArg('output');
    const storyPlanOutputPath = readArg('story-plan-output');
    const momentsOutputPath = readArg('moments-output') ?? readArg('llm-spec-output');
    const storyIntentOutputPath = readArg('story-intent-output');
    const topologyOutputPath = readArg('topology-output');
    const pipelineMode = readArg('pipeline') ?? 'v1';
    const duration = durationArg ? Number(durationArg) : 60;

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error('Invalid --duration. Provide a positive number.');
    }

    if (pipelineMode !== 'v1' && pipelineMode !== 'v2') {
      throw new Error('Invalid --pipeline. Use "v1" or "v2".');
    }

    const result =
      pipelineMode === 'v2'
        ? await generateVideoV2({
            topic,
            audience,
            duration,
            topologyInputPath,
            storyIntentInputPath,
            animate,
            stableLayout,
            personality: personalityArg,
            model,
            outputPath,
            storyIntentOutputPath: storyIntentOutputPath ?? storyPlanOutputPath,
            topologyOutputPath: topologyOutputPath ?? momentsOutputPath,
          })
        : await generateVideo({
            topic,
            audience,
            duration,
            model,
            outputPath,
            storyPlanOutputPath,
            momentsOutputPath,
          });
    console.log('Video generated:', result);
  } catch (err) {
    console.error(`Error: ${serializeError(err)}`);
    process.exit(1);
  }
}

main();
