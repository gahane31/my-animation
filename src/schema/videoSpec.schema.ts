import {z} from 'zod';
import {VIDEO_LIMITS} from '../config/constants.js';
import {AnimationType, CameraActionType, ComponentType} from './visualGrammar.js';

const nullToUndefined = (value: unknown): unknown => (value === null ? undefined : value);

const positionSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});

const optionalAnimationSchema = z.preprocess(
  nullToUndefined,
  z.nativeEnum(AnimationType).optional(),
);

const optionalAnimationArraySchema = z.preprocess(
  nullToUndefined,
  z.array(z.nativeEnum(AnimationType)).optional(),
);

const elementSchema = z.object({
  id: z.string().min(1),
  type: z.nativeEnum(ComponentType),
  position: positionSchema,
  enter: optionalAnimationSchema,
  exit: optionalAnimationSchema,
  effects: optionalAnimationArraySchema,
});

const optionalSceneTitleSchema = z.preprocess(nullToUndefined, z.string().min(1).optional());
const optionalCameraActionSchema = z.preprocess(
  nullToUndefined,
  z.nativeEnum(CameraActionType).optional(),
);

const sceneSchema = z
  .object({
    id: z.string().min(1),
    start: z.number().min(0),
    end: z.number().min(0),
    narration: z.string().min(1),
    title: optionalSceneTitleSchema,
    camera: optionalCameraActionSchema,
    elements: z.array(elementSchema).min(1),
  })
  .superRefine((scene, context) => {
    const duration = scene.end - scene.start;

    if (duration <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Scene \"${scene.id}\" must have end > start`,
        path: ['end'],
      });
    }

    if (duration > VIDEO_LIMITS.maxSceneDurationSeconds) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Scene \"${scene.id}\" exceeds ${VIDEO_LIMITS.maxSceneDurationSeconds}s`,
        path: ['end'],
      });
    }
  });

const sceneHasVisibleMotion = (scene: z.infer<typeof sceneSchema>): boolean => {
  const hasCameraMotion = scene.camera !== undefined;
  const hasElementMotion = scene.elements.some((element) => {
    const effectCount = element.effects?.length ?? 0;
    return element.enter !== undefined || element.exit !== undefined || effectCount > 0;
  });

  return hasCameraMotion || hasElementMotion;
};

export const videoSpecSchema = z
  .object({
    duration: z.number().positive(),
    scenes: z.array(sceneSchema).min(1),
  })
  .superRefine((videoSpec, context) => {
    if (videoSpec.duration > VIDEO_LIMITS.maxDurationSeconds) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Video duration exceeds ${VIDEO_LIMITS.maxDurationSeconds}s`,
        path: ['duration'],
      });
    }

    const sortedScenes = [...videoSpec.scenes].sort((left, right) => left.start - right.start);

    const uniqueSceneIds = new Set<string>();
    sortedScenes.forEach((scene) => {
      if (uniqueSceneIds.has(scene.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate scene id \"${scene.id}\"`,
          path: ['scenes'],
        });
      }
      uniqueSceneIds.add(scene.id);

      const uniqueElementIds = new Set<string>();
      scene.elements.forEach((element) => {
        if (uniqueElementIds.has(element.id)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate element id \"${element.id}\" in scene \"${scene.id}\"`,
            path: ['scenes'],
          });
        }
        uniqueElementIds.add(element.id);
      });
    });

    for (let index = 1; index < sortedScenes.length; index += 1) {
      const previous = sortedScenes[index - 1];
      const current = sortedScenes[index];

      if (!previous || !current) {
        continue;
      }

      if (current.start < previous.end) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Scene \"${current.id}\" overlaps with \"${previous.id}\"`,
          path: ['scenes'],
        });
      }
    }

    const firstScene = sortedScenes[0];
    if (firstScene) {
      if (firstScene.start > VIDEO_LIMITS.firstMotionDeadlineSeconds) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `First scene must begin by ${VIDEO_LIMITS.firstMotionDeadlineSeconds}s`,
          path: ['scenes', 0, 'start'],
        });
      }

      if (!sceneHasVisibleMotion(firstScene)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `First scene must include visible motion within ${VIDEO_LIMITS.firstMotionDeadlineSeconds}s`,
          path: ['scenes', 0],
        });
      }
    }

    const latestEnd = Math.max(...sortedScenes.map((scene) => scene.end));
    if (latestEnd > videoSpec.duration) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Video duration must cover the end of the last scene',
        path: ['duration'],
      });
    }
  });

const animationValues = Object.values(AnimationType);
const cameraValues = Object.values(CameraActionType);
const componentValues = Object.values(ComponentType);

const nullableStringJsonSchema = {
  anyOf: [
    {type: 'string', minLength: 1},
    {type: 'null'},
  ],
} as const;

const nullableAnimationJsonSchema = {
  anyOf: [
    {type: 'string', enum: animationValues},
    {type: 'null'},
  ],
} as const;

const nullableCameraJsonSchema = {
  anyOf: [
    {type: 'string', enum: cameraValues},
    {type: 'null'},
  ],
} as const;

const nullableAnimationArrayJsonSchema = {
  anyOf: [
    {
      type: 'array',
      items: {type: 'string', enum: animationValues},
    },
    {type: 'null'},
  ],
} as const;

export const videoSpecResponseFormat = {
  type: 'json_schema',
  name: 'video_spec',
  strict: true,
  description:
    'VideoSpec with timeline, scenes, camera actions, and typed visual elements.',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['duration', 'scenes'],
    properties: {
      duration: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: VIDEO_LIMITS.maxDurationSeconds,
      },
      scenes: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'start', 'end', 'narration', 'title', 'camera', 'elements'],
          properties: {
            id: {type: 'string', minLength: 1},
            start: {
              type: 'number',
              minimum: 0,
              description: 'Scene start in seconds. Must be sorted ascending.',
            },
            end: {
              type: 'number',
              minimum: 0,
              description: 'Scene end in seconds. Must be > start and scene duration <= 8.',
            },
            narration: {type: 'string', minLength: 1},
            title: nullableStringJsonSchema,
            camera: nullableCameraJsonSchema,
            elements: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'type', 'position', 'enter', 'exit', 'effects'],
                properties: {
                  id: {type: 'string', minLength: 1},
                  type: {type: 'string', enum: componentValues},
                  position: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['x', 'y'],
                    properties: {
                      x: {type: 'number'},
                      y: {type: 'number'},
                    },
                  },
                  enter: nullableAnimationJsonSchema,
                  exit: nullableAnimationJsonSchema,
                  effects: nullableAnimationArrayJsonSchema,
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

export type Position = z.infer<typeof positionSchema>;
export type Element = z.infer<typeof elementSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type VideoSpec = z.infer<typeof videoSpecSchema>;

export const validateVideoSpec = (input: unknown): VideoSpec => videoSpecSchema.parse(input);
