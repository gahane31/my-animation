import {generateVideo} from './pipeline/generateVideo.js';

export const runExampleVideoGeneration = async (): Promise<string> =>
  generateVideo({
    topic: 'How systems scale to 1 million users',
    audience: 'beginner',
    duration: 60,
  });
