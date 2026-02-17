import {z} from 'zod';
import {VIDEO_LIMITS} from '../../config/constants.js';
import {ComponentType} from '../../schema/visualGrammar.js';
import {normalizeLucideIconName} from '../catalog/iconCatalog.js';

const SCENE_ARCHETYPES = [
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

const sceneComplexityBudgetSchema = z.object({
  max_visible_components: z.number().int().min(1).max(8),
  max_visible_connections: z.number().int().min(0).max(12),
  max_simultaneous_motions: z.number().int().min(1).max(6),
});

const nullToUndefined = (value: unknown): unknown => (value === null ? undefined : value);

const optionalIconSchema = z.preprocess(
  (value) => normalizeLucideIconName(nullToUndefined(value)),
  z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
);

const storyIconHintSchema = z.object({
  component_type: z.nativeEnum(ComponentType),
  icon: optionalIconSchema,
});

export const storyIntentSceneSchema = z.object({
  id: z.string().min(1),
  start: z.number().min(0),
  end: z.number().min(0),
  archetype: z.enum(SCENE_ARCHETYPES),
  narrative_goal: z.string().min(1),
  narration: z.string().min(1),
  required_component_types: z.array(z.nativeEnum(ComponentType)).min(1).max(8),
  icon_hints: z.array(storyIconHintSchema).default([]),
  focus_component_types: z.array(z.nativeEnum(ComponentType)).min(1).max(3),
  transition_goal: z.string().min(1),
  complexity_budget: sceneComplexityBudgetSchema,
});

export const storyIntentSchema = z
  .object({
    duration: z.number().positive().max(VIDEO_LIMITS.maxDurationSeconds),
    audience: z.string().min(1),
    tone: z.enum(['fast', 'educational', 'dramatic']),
    scenes: z.array(storyIntentSceneSchema).min(1),
  })
  .superRefine((value, context) => {
    const sorted = [...value.scenes].sort((left, right) => left.start - right.start);
    const firstScene = sorted[0];

    if (firstScene && firstScene.start !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'First scene must start at 0',
        path: ['scenes', 0, 'start'],
      });
    }

    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];

      if (!previous || !current) {
        continue;
      }

      if (current.start < previous.end) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Scene "${current.id}" overlaps "${previous.id}"`,
          path: ['scenes'],
        });
      }
    }

    for (const scene of sorted) {
      const duration = scene.end - scene.start;
      if (duration <= 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Scene "${scene.id}" must have end > start`,
          path: ['scenes'],
        });
        continue;
      }

      if (duration > VIDEO_LIMITS.maxSceneDurationSeconds) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Scene "${scene.id}" exceeds ${VIDEO_LIMITS.maxSceneDurationSeconds}s`,
          path: ['scenes'],
        });
      }

      const requiredTypes = new Set(scene.required_component_types);
      for (const focusedType of scene.focus_component_types) {
        if (!requiredTypes.has(focusedType)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Scene "${scene.id}" has focus_component_type "${focusedType}" not present in required_component_types`,
            path: ['scenes'],
          });
        }
      }

      const hintedTypes = new Set(scene.icon_hints.map((hint) => hint.component_type));
      for (const requiredType of requiredTypes) {
        if (!hintedTypes.has(requiredType)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Scene "${scene.id}" icon_hints must include required_component_type "${requiredType}"`,
            path: ['scenes'],
          });
        }
      }

      for (const hint of scene.icon_hints) {
        if (!requiredTypes.has(hint.component_type)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Scene "${scene.id}" icon_hints component_type "${hint.component_type}" must be in required_component_types`,
            path: ['scenes'],
          });
        }
      }

      if (scene.complexity_budget.max_visible_components < scene.required_component_types.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Scene "${scene.id}" max_visible_components must be >= required_component_types length`,
          path: ['scenes'],
        });
      }
    }

    const lastEnd = Math.max(...sorted.map((scene) => scene.end));
    if (lastEnd > value.duration) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duration must cover final scene end',
        path: ['duration'],
      });
    }
  });

export const storyIntentResponseFormat = {
  type: 'json_schema',
  name: 'story_intent_v2',
  strict: true,
  description: 'Scene-by-scene storytelling intent for system design reels.',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['duration', 'audience', 'tone', 'scenes'],
    properties: {
      duration: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: VIDEO_LIMITS.maxDurationSeconds,
      },
      audience: {type: 'string', minLength: 1},
      tone: {type: 'string', enum: ['fast', 'educational', 'dramatic']},
      scenes: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          additionalProperties: false,
          required: [
            'id',
            'start',
            'end',
            'archetype',
            'narrative_goal',
            'narration',
            'required_component_types',
            'icon_hints',
            'focus_component_types',
            'transition_goal',
            'complexity_budget',
          ],
          properties: {
            id: {type: 'string', minLength: 1},
            start: {type: 'number', minimum: 0},
            end: {type: 'number', minimum: 0},
            archetype: {type: 'string', enum: [...SCENE_ARCHETYPES]},
            narrative_goal: {type: 'string', minLength: 1},
            narration: {type: 'string', minLength: 1},
            required_component_types: {
              type: 'array',
              minItems: 1,
              maxItems: 8,
              items: {type: 'string', enum: Object.values(ComponentType)},
            },
            icon_hints: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['component_type', 'icon'],
                properties: {
                  component_type: {type: 'string', enum: Object.values(ComponentType)},
                  icon: {
                    anyOf: [
                      {
                        type: 'string',
                        minLength: 1,
                        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
                      },
                      {type: 'null'},
                    ],
                  },
                },
              },
            },
            focus_component_types: {
              type: 'array',
              minItems: 1,
              maxItems: 3,
              items: {type: 'string', enum: Object.values(ComponentType)},
            },
            transition_goal: {type: 'string', minLength: 1},
            complexity_budget: {
              type: 'object',
              additionalProperties: false,
              required: [
                'max_visible_components',
                'max_visible_connections',
                'max_simultaneous_motions',
              ],
              properties: {
                max_visible_components: {type: 'integer', minimum: 1, maximum: 8},
                max_visible_connections: {type: 'integer', minimum: 0, maximum: 12},
                max_simultaneous_motions: {type: 'integer', minimum: 1, maximum: 6},
              },
            },
          },
        },
      },
    },
  },
} as const;

export type StoryIntent = z.infer<typeof storyIntentSchema>;
export type StoryIntentScene = z.infer<typeof storyIntentSceneSchema>;
