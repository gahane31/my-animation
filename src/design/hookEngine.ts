import {HookTokens} from '../config/hookTokens.js';
import {Templates, type TemplateId} from './templates.js';
import type {Moment} from '../schema/moment.schema.js';
import type {StoryPlan} from '../schema/storyPlannerSchema.js';

const LIGHT_HOOK_DURATION = {
  min: 1.4,
  max: 2.4,
} as const;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const ensureSinglePrimary = (moment: Moment): Moment => {
  if (moment.entities.length === 0) {
    return moment;
  }

  const explicitPrimary = moment.entities.find((entity) => entity.importance === 'primary');
  const primaryId = explicitPrimary?.id ?? moment.entities[0]?.id;

  return {
    ...moment,
    entities: moment.entities.map((entity) => ({
      ...entity,
      importance: entity.id === primaryId ? 'primary' : 'secondary',
    })),
  };
};

const resolveHookDuration = (moment: Moment, strongHook: boolean): number => {
  const currentDuration = moment.end - moment.start;
  const durationRange = strongHook ? HookTokens.duration : LIGHT_HOOK_DURATION;
  return clamp(currentDuration, durationRange.min, durationRange.max);
};

const shouldForceHeroTemplate = (moment: Moment): boolean =>
  moment.entities.length > 1 && moment.template !== 'HERO_FOCUS';

const applyTemplateOverride = (moment: Moment): Moment => {
  if (!shouldForceHeroTemplate(moment)) {
    return moment;
  }

  const template: TemplateId = 'HERO_FOCUS';
  if (!Templates[template]) {
    return moment;
  }

  return {
    ...moment,
    template,
  };
};

export const applyAttentionHook = (
  moments: Moment[],
  storyPlan: Pick<StoryPlan, 'beats'>,
): Moment[] => {
  if (moments.length === 0) {
    return [];
  }

  const [firstMoment, ...rest] = moments;
  if (!firstMoment) {
    return moments;
  }

  const firstBeat = storyPlan.beats[0];
  const isStrongHook = firstBeat?.type === 'hook';
  const hookDuration = resolveHookDuration(firstMoment, isStrongHook);

  let hookedFirstMoment: Moment = {
    ...firstMoment,
    end: firstMoment.start + hookDuration,
    isHook: isStrongHook,
  };

  hookedFirstMoment = applyTemplateOverride(hookedFirstMoment);
  hookedFirstMoment = ensureSinglePrimary(hookedFirstMoment);

  return [hookedFirstMoment, ...rest];
};
