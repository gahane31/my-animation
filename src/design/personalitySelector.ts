import {
  DEFAULT_MOTION_PERSONALITY,
  type MotionPersonalityId,
} from '../config/motionPersonalityTokens.js';
import type {StoryPlan} from '../schema/storyPlannerSchema.js';

const hasKeyword = (value: string, keyword: string): boolean => value.includes(keyword);

export const selectPersonality = (storyPlan: StoryPlan): MotionPersonalityId => {
  const toneText = storyPlan.tone?.toLowerCase() ?? '';
  const beatsText = storyPlan.beats
    .map((beat) => `${beat.narration} ${beat.visual_intent}`.toLowerCase())
    .join(' ');
  const corpus = `${toneText} ${beatsText}`;

  if (
    hasKeyword(corpus, 'fast') ||
    hasKeyword(corpus, 'high traffic') ||
    hasKeyword(corpus, 'scale')
  ) {
    return 'ENERGETIC';
  }

  if (hasKeyword(corpus, 'premium') || hasKeyword(corpus, 'product')) {
    return 'PREMIUM';
  }

  if (hasKeyword(corpus, 'dramatic')) {
    return 'ENERGETIC';
  }

  if (hasKeyword(corpus, 'educational')) {
    return 'CALM';
  }

  return DEFAULT_MOTION_PERSONALITY;
};
