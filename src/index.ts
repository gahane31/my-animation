import {generateVideo} from './pipeline/generateVideo.js';
import {generateVideoV2} from './v2/pipeline/generateVideoV2.js';

export const runExampleVideoGeneration = async (): Promise<string> =>
  generateVideo({
    topic: 'How systems scale to 1 million users',
    audience: 'beginner',
    duration: 60,
  });

export const runExampleVideoGenerationV2 = async (): Promise<string> =>
  generateVideoV2({
    topic: 'How systems scale to 1 million users',
    audience: 'beginner',
    duration: 60,
  });
