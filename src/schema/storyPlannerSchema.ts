import {z} from 'zod';
import {VIDEO_LIMITS} from '../config/constants.js';

const STORY_BEAT_TYPES = [
  'hook',
  'setup',
  'problem',
  'escalation',
  'solution',
  'expansion',
  'climax',
  'recap',
  'ending',
] as const;

const STORY_TONES = ['fast', 'educational', 'dramatic'] as const;

const MIN_BEAT_DURATION_SECONDS = 1.5;
const MAX_BEAT_DURATION_SECONDS = 6;
const MAX_RECAP_DURATION_SECONDS = 4;

export const StoryBeatSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(STORY_BEAT_TYPES),
    start: z.number().min(0),
    end: z.number().min(0),
    narration: z.string().min(1),
    visual_intent: z.string().min(1),
  })
  .superRefine((beat, context) => {
    const duration = beat.end - beat.start;

    if (duration <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Beat "${beat.id}" must have end > start`,
        path: ['end'],
      });
    }

    if (duration < MIN_BEAT_DURATION_SECONDS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Beat "${beat.id}" must be at least ${MIN_BEAT_DURATION_SECONDS}s`,
        path: ['end'],
      });
    }

    if (duration > MAX_BEAT_DURATION_SECONDS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Beat "${beat.id}" exceeds ${MAX_BEAT_DURATION_SECONDS}s`,
        path: ['end'],
      });
    }

    if (beat.type === 'recap' && duration > MAX_RECAP_DURATION_SECONDS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Recap beat "${beat.id}" must be <= ${MAX_RECAP_DURATION_SECONDS}s`,
        path: ['end'],
      });
    }
  });

export const StoryPlanSchema = z
  .object({
    duration: z.number().positive().max(VIDEO_LIMITS.maxDurationSeconds),
    target_audience: z.string().min(1),
    tone: z.enum(STORY_TONES),
    beats: z.array(StoryBeatSchema).min(1),
  })
  .superRefine((plan, context) => {
    const sortedBeats = [...plan.beats].sort((left, right) => left.start - right.start);

    const firstBeat = sortedBeats[0];
    if (firstBeat && firstBeat.start !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'First beat must start at 0',
        path: ['beats', 0, 'start'],
      });
    }

    const beatIds = new Set<string>();
    sortedBeats.forEach((beat) => {
      if (beatIds.has(beat.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate beat id "${beat.id}"`,
          path: ['beats'],
        });
      }
      beatIds.add(beat.id);
    });

    for (let index = 1; index < sortedBeats.length; index += 1) {
      const previous = sortedBeats[index - 1];
      const current = sortedBeats[index];

      if (!previous || !current) {
        continue;
      }

      if (current.start < previous.end) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Beat "${current.id}" overlaps with "${previous.id}"`,
          path: ['beats'],
        });
      }
    }

    const hasClimax = sortedBeats.some((beat) => beat.type === 'climax');
    if (!hasClimax) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Story plan must include a climax beat',
        path: ['beats'],
      });
    }

    const hasEnding = sortedBeats.some((beat) => beat.type === 'ending');
    if (!hasEnding) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Story plan must include an ending beat',
        path: ['beats'],
      });
    }

    const latestEnd = Math.max(...sortedBeats.map((beat) => beat.end));
    if (latestEnd > plan.duration) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Plan duration must cover the end of the last beat',
        path: ['duration'],
      });
    }
  });

export const storyPlanResponseFormat = {
  type: 'json_schema',
  name: 'story_plan',
  strict: true,
  description: 'Story plan for short-form technical reel with narrative beats.',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['duration', 'target_audience', 'tone', 'beats'],
    properties: {
      duration: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: VIDEO_LIMITS.maxDurationSeconds,
      },
      target_audience: {
        type: 'string',
        minLength: 1,
      },
      tone: {
        type: 'string',
        enum: [...STORY_TONES],
      },
      beats: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'type', 'start', 'end', 'narration', 'visual_intent'],
          properties: {
            id: {type: 'string', minLength: 1},
            type: {type: 'string', enum: [...STORY_BEAT_TYPES]},
            start: {type: 'number', minimum: 0},
            end: {type: 'number', minimum: 0},
            narration: {type: 'string', minLength: 1},
            visual_intent: {type: 'string', minLength: 1},
          },
        },
      },
    },
  },
} as const;

export type StoryBeat = z.infer<typeof StoryBeatSchema>;
export type StoryPlan = z.infer<typeof StoryPlanSchema>;
