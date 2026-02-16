import {z} from 'zod';
import {VIDEO_LIMITS} from '../../config/constants.js';
import {ComponentType} from '../../schema/visualGrammar.js';
import {CONNECTION_KINDS, FLOW_PATTERNS, TRANSITION_OPERATION_TYPES} from '../catalog/index.js';

const nullToUndefined = (value: unknown): unknown => (value === null ? undefined : value);

const optionalLabelSchema = z.preprocess(nullToUndefined, z.string().min(1).optional());
const optionalCountSchema = z.preprocess(nullToUndefined, z.number().positive().optional());
const optionalImportanceSchema = z.preprocess(
  nullToUndefined,
  z.enum(['primary', 'secondary']).optional(),
);
const optionalStatusSchema = z.preprocess(
  nullToUndefined,
  z.enum(['normal', 'active', 'overloaded', 'error', 'down']).optional(),
);
const optionalIntensitySchema = z.preprocess(
  nullToUndefined,
  z.enum(['low', 'medium', 'high']).optional(),
);

const normalizeConnectionTypeInput = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (normalized === 'bothways') {
    return 'both_ways';
  }

  return normalized;
};

const connectionTypeSchema = z.preprocess(
  (value) => normalizeConnectionTypeInput(nullToUndefined(value)),
  z.enum(['static', 'flowing', 'both_ways']).default('flowing'),
);
const optionalTransitionStyleSchema = z.preprocess(
  nullToUndefined,
  z.enum(['hooked_split_insert', 'soft_pop']).optional(),
);
const optionalTransitionPaceSchema = z.preprocess(
  nullToUndefined,
  z.enum(['slow', 'medium', 'fast']).optional(),
);

const sceneComplexityBudgetSchema = z.object({
  max_visible_components: z.number().int().min(1).max(8),
  max_visible_connections: z.number().int().min(0).max(12),
  max_simultaneous_motions: z.number().int().min(1).max(6),
});

export const topologyCameraDirectivesSchema = z.object({
  mode: z.enum(['auto', 'follow_action', 'wide_recap', 'steady']).default('auto'),
  zoom: z.enum(['tight', 'medium', 'wide']).default('tight'),
  active_zone: z.enum(['upper_third', 'center']).default('upper_third'),
  reserve_bottom_percent: z.number().min(0).max(40).default(25),
});

export const topologyVisualDirectivesSchema = z.object({
  theme: z.enum(['default', 'neon']).default('neon'),
  background_texture: z.enum(['none', 'grid']).default('grid'),
  glow_strength: z.enum(['soft', 'strong']).default('strong'),
});

export const topologyMotionDirectivesSchema = z.object({
  entry_style: z.enum(['drop_bounce', 'elastic_pop']).default('elastic_pop'),
  pacing: z.enum(['balanced', 'reel_fast']).default('reel_fast'),
});

export const topologyFlowDirectivesSchema = z.object({
  renderer: z.enum(['dashed', 'packets', 'hybrid']).default('hybrid'),
});

export const topologySceneDirectivesSchema = z.object({
  camera: topologyCameraDirectivesSchema.default({
    mode: 'auto',
    zoom: 'tight',
    active_zone: 'upper_third',
    reserve_bottom_percent: 25,
  }),
  visual: topologyVisualDirectivesSchema.default({
    theme: 'neon',
    background_texture: 'grid',
    glow_strength: 'strong',
  }),
  motion: topologyMotionDirectivesSchema.default({
    entry_style: 'elastic_pop',
    pacing: 'reel_fast',
  }),
  flow: topologyFlowDirectivesSchema.default({
    renderer: 'hybrid',
  }),
});

const optionalSceneDirectivesSchema = z.preprocess(
  nullToUndefined,
  topologySceneDirectivesSchema.optional(),
);

export const topologyEntitySchema = z.object({
  id: z.string().min(1),
  type: z.nativeEnum(ComponentType),
  label: optionalLabelSchema,
  count: optionalCountSchema,
  importance: optionalImportanceSchema,
  status: optionalStatusSchema,
});

export const topologyConnectionSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  kind: z.enum(CONNECTION_KINDS),
  pattern: z.enum(FLOW_PATTERNS),
  intensity: optionalIntensitySchema,
  connection_type: connectionTypeSchema,
});

const addEntityOperationSchema = z.object({
  type: z.literal('add_entity'),
  entityId: z.string().min(1),
});

const removeEntityOperationSchema = z.object({
  type: z.literal('remove_entity'),
  entityId: z.string().min(1),
});

const insertBetweenOperationSchema = z.object({
  type: z.literal('insert_between'),
  entityId: z.string().min(1),
  fromId: z.string().min(1),
  toId: z.string().min(1),
});

const rerouteConnectionOperationSchema = z.object({
  type: z.literal('reroute_connection'),
  connectionId: z.string().min(1),
  newFromId: z.preprocess(nullToUndefined, z.string().min(1).optional()),
  newToId: z.preprocess(nullToUndefined, z.string().min(1).optional()),
});

const scaleEntityOperationSchema = z.object({
  type: z.literal('scale_entity'),
  entityId: z.string().min(1),
  toCount: z.number().positive(),
});

const changeStatusOperationSchema = z.object({
  type: z.literal('change_status'),
  entityId: z.string().min(1),
  toStatus: z.enum(['normal', 'active', 'overloaded', 'error', 'down']),
});

const emphasizeOperationSchema = z.object({
  type: z.literal('emphasize_entity'),
  entityId: z.string().min(1),
});

const deEmphasizeOperationSchema = z.object({
  type: z.literal('de_emphasize_entity'),
  entityId: z.string().min(1),
});

const revealGroupOperationSchema = z.object({
  type: z.literal('reveal_group'),
  entityIds: z.array(z.string().min(1)).min(1),
});

export const topologyOperationSchema = z.discriminatedUnion('type', [
  addEntityOperationSchema,
  removeEntityOperationSchema,
  insertBetweenOperationSchema,
  rerouteConnectionOperationSchema,
  scaleEntityOperationSchema,
  changeStatusOperationSchema,
  emphasizeOperationSchema,
  deEmphasizeOperationSchema,
  revealGroupOperationSchema,
]);

const insertBetweenTransitionSchema = z.object({
  type: z.literal('insert_between'),
  entityId: z.string().min(1),
  fromId: z.string().min(1),
  toId: z.string().min(1),
  style: optionalTransitionStyleSchema,
  pace: optionalTransitionPaceSchema,
});

const addEntityTransitionSchema = z.object({
  type: z.literal('add_entity'),
  entityId: z.string().min(1),
  style: optionalTransitionStyleSchema,
  pace: optionalTransitionPaceSchema,
});

export const topologyTransitionSchema = z.discriminatedUnion('type', [
  insertBetweenTransitionSchema,
  addEntityTransitionSchema,
]);

export const topologySceneSchema = z
  .object({
    id: z.string().min(1),
    start: z.number().min(0),
    end: z.number().min(0),
    archetype: z.enum([
      'hook',
      'setup',
      'problem',
      'escalation',
      'solution',
      'expansion',
      'climax',
      'recap',
      'ending',
    ]),
    narration: z.string().min(1),
    focus_entity_id: z.preprocess(nullToUndefined, z.string().min(1).optional()),
    entities: z.array(topologyEntitySchema).min(1),
    connections: z.array(topologyConnectionSchema),
    operations: z.array(topologyOperationSchema),
    transition: z.preprocess(nullToUndefined, topologyTransitionSchema.optional()),
    complexity_budget: sceneComplexityBudgetSchema,
    camera_intent: z.preprocess(
      nullToUndefined,
      z.enum(['wide', 'focus', 'introduce', 'steady']).optional(),
    ),
    directives: optionalSceneDirectivesSchema,
  })
  .superRefine((scene, context) => {
    const entityIds = new Set<string>();
    const entityIndexById = new Map<string, number>();
    scene.entities.forEach((entity, index) => {
      entityIndexById.set(entity.id, index);
    });
    for (const entity of scene.entities) {
      if (entityIds.has(entity.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate entity id "${entity.id}" in scene "${scene.id}"`,
          path: ['entities'],
        });
      }
      entityIds.add(entity.id);
    }

    if (scene.focus_entity_id && !entityIds.has(scene.focus_entity_id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `focus_entity_id "${scene.focus_entity_id}" not found in entities`,
        path: ['focus_entity_id'],
      });
    }

    const seenUndirectedPairs = new Set<string>();
    for (const connection of scene.connections) {
      if (!entityIds.has(connection.from)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Connection "${connection.id}" has unknown from "${connection.from}"`,
          path: ['connections'],
        });
      }

      if (!entityIds.has(connection.to)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Connection "${connection.id}" has unknown to "${connection.to}"`,
          path: ['connections'],
        });
      }

      if (connection.from === connection.to) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Connection "${connection.id}" cannot connect entity "${connection.from}" to itself`,
          path: ['connections'],
        });
      }

      const fromIndex = entityIndexById.get(connection.from);
      const toIndex = entityIndexById.get(connection.to);
      if (
        fromIndex !== undefined &&
        toIndex !== undefined &&
        fromIndex >= toIndex
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Connection "${connection.id}" must point from earlier entity to later entity in scene.entities order`,
          path: ['connections'],
        });
      }

      const pairKey = [connection.from, connection.to].sort().join('<->');
      if (seenUndirectedPairs.has(pairKey)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate directional pair detected for "${connection.from}" and "${connection.to}"`,
          path: ['connections'],
        });
      } else {
        seenUndirectedPairs.add(pairKey);
      }
    }

    if (scene.transition) {
      if (!entityIds.has(scene.transition.entityId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Transition entity "${scene.transition.entityId}" not found in entities`,
          path: ['transition', 'entityId'],
        });
      }

      if (scene.transition.type === 'insert_between') {
        if (!entityIds.has(scene.transition.fromId)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Transition fromId "${scene.transition.fromId}" not found in entities`,
            path: ['transition', 'fromId'],
          });
        }

        if (!entityIds.has(scene.transition.toId)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Transition toId "${scene.transition.toId}" not found in entities`,
            path: ['transition', 'toId'],
          });
        }
      }
    }
  });

export const topologyPlanSchema = z
  .object({
    duration: z.number().positive().max(VIDEO_LIMITS.maxDurationSeconds),
    scenes: z.array(topologySceneSchema).min(1),
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

export const topologyPlanResponseFormat = {
  type: 'json_schema',
  name: 'scene_topology_v2',
  strict: true,
  description: 'Scene topology plan with deterministic transition operations.',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['duration', 'scenes'],
    properties: {
      duration: {type: 'number', exclusiveMinimum: 0, maximum: VIDEO_LIMITS.maxDurationSeconds},
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
            'narration',
            'focus_entity_id',
            'entities',
            'connections',
            'operations',
            'transition',
            'complexity_budget',
            'camera_intent',
            'directives',
          ],
          properties: {
            id: {type: 'string', minLength: 1},
            start: {type: 'number', minimum: 0},
            end: {type: 'number', minimum: 0},
            archetype: {
              type: 'string',
              enum: ['hook', 'setup', 'problem', 'escalation', 'solution', 'expansion', 'climax', 'recap', 'ending'],
            },
            narration: {type: 'string', minLength: 1},
            focus_entity_id: {
              anyOf: [{type: 'string', minLength: 1}, {type: 'null'}],
            },
            entities: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'type', 'label', 'count', 'importance', 'status'],
                properties: {
                  id: {type: 'string', minLength: 1},
                  type: {type: 'string', enum: Object.values(ComponentType)},
                  label: {anyOf: [{type: 'string', minLength: 1}, {type: 'null'}]},
                  count: {anyOf: [{type: 'number', exclusiveMinimum: 0}, {type: 'null'}]},
                  importance: {
                    anyOf: [{type: 'string', enum: ['primary', 'secondary']}, {type: 'null'}],
                  },
                  status: {
                    anyOf: [
                      {type: 'string', enum: ['normal', 'active', 'overloaded', 'error', 'down']},
                      {type: 'null'},
                    ],
                  },
                },
              },
            },
            connections: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'from', 'to', 'kind', 'pattern', 'intensity', 'connection_type'],
                properties: {
                  id: {type: 'string', minLength: 1},
                  from: {type: 'string', minLength: 1},
                  to: {type: 'string', minLength: 1},
                  kind: {type: 'string', enum: [...CONNECTION_KINDS]},
                  pattern: {type: 'string', enum: [...FLOW_PATTERNS]},
                  intensity: {
                    anyOf: [{type: 'string', enum: ['low', 'medium', 'high']}, {type: 'null'}],
                  },
                  connection_type: {type: 'string', enum: ['static', 'flowing', 'both_ways']},
                },
              },
            },
            operations: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityId'],
                    properties: {
                      type: {type: 'string', enum: ['add_entity']},
                      entityId: {type: 'string', minLength: 1},
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityId'],
                    properties: {
                      type: {type: 'string', enum: ['remove_entity']},
                      entityId: {type: 'string', minLength: 1},
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityId', 'fromId', 'toId'],
                    properties: {
                      type: {type: 'string', enum: ['insert_between']},
                      entityId: {type: 'string', minLength: 1},
                      fromId: {type: 'string', minLength: 1},
                      toId: {type: 'string', minLength: 1},
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'connectionId', 'newFromId', 'newToId'],
                    properties: {
                      type: {type: 'string', enum: ['reroute_connection']},
                      connectionId: {type: 'string', minLength: 1},
                      newFromId: {
                        anyOf: [{type: 'string', minLength: 1}, {type: 'null'}],
                      },
                      newToId: {
                        anyOf: [{type: 'string', minLength: 1}, {type: 'null'}],
                      },
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityId', 'toCount'],
                    properties: {
                      type: {type: 'string', enum: ['scale_entity']},
                      entityId: {type: 'string', minLength: 1},
                      toCount: {type: 'number', exclusiveMinimum: 0},
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityId', 'toStatus'],
                    properties: {
                      type: {type: 'string', enum: ['change_status']},
                      entityId: {type: 'string', minLength: 1},
                      toStatus: {
                        type: 'string',
                        enum: ['normal', 'active', 'overloaded', 'error', 'down'],
                      },
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityId'],
                    properties: {
                      type: {type: 'string', enum: ['emphasize_entity']},
                      entityId: {type: 'string', minLength: 1},
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityId'],
                    properties: {
                      type: {type: 'string', enum: ['de_emphasize_entity']},
                      entityId: {type: 'string', minLength: 1},
                    },
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                    required: ['type', 'entityIds'],
                    properties: {
                      type: {type: 'string', enum: ['reveal_group']},
                      entityIds: {
                        type: 'array',
                        minItems: 1,
                        items: {type: 'string', minLength: 1},
                      },
                    },
                  },
                ],
              },
            },
            transition: {
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['type', 'entityId', 'fromId', 'toId', 'style', 'pace'],
                  properties: {
                    type: {type: 'string', enum: ['insert_between']},
                    entityId: {type: 'string', minLength: 1},
                    fromId: {type: 'string', minLength: 1},
                    toId: {type: 'string', minLength: 1},
                    style: {
                      anyOf: [
                        {type: 'string', enum: ['hooked_split_insert', 'soft_pop']},
                        {type: 'null'},
                      ],
                    },
                    pace: {
                      anyOf: [
                        {type: 'string', enum: ['slow', 'medium', 'fast']},
                        {type: 'null'},
                      ],
                    },
                  },
                },
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['type', 'entityId', 'style', 'pace'],
                  properties: {
                    type: {type: 'string', enum: ['add_entity']},
                    entityId: {type: 'string', minLength: 1},
                    style: {
                      anyOf: [
                        {type: 'string', enum: ['hooked_split_insert', 'soft_pop']},
                        {type: 'null'},
                      ],
                    },
                    pace: {
                      anyOf: [
                        {type: 'string', enum: ['slow', 'medium', 'fast']},
                        {type: 'null'},
                      ],
                    },
                  },
                },
                {type: 'null'},
              ],
            },
            complexity_budget: {
              type: 'object',
              additionalProperties: false,
              required: ['max_visible_components', 'max_visible_connections', 'max_simultaneous_motions'],
              properties: {
                max_visible_components: {type: 'integer', minimum: 1, maximum: 8},
                max_visible_connections: {type: 'integer', minimum: 0, maximum: 12},
                max_simultaneous_motions: {type: 'integer', minimum: 1, maximum: 6},
              },
            },
            camera_intent: {
              anyOf: [{type: 'string', enum: ['wide', 'focus', 'introduce', 'steady']}, {type: 'null'}],
            },
            directives: {
              anyOf: [
                {
                  type: 'object',
                  additionalProperties: false,
                  required: ['camera', 'visual', 'motion', 'flow'],
                  properties: {
                    camera: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['mode', 'zoom', 'active_zone', 'reserve_bottom_percent'],
                      properties: {
                        mode: {
                          type: 'string',
                          enum: ['auto', 'follow_action', 'wide_recap', 'steady'],
                        },
                        zoom: {
                          type: 'string',
                          enum: ['tight', 'medium', 'wide'],
                        },
                        active_zone: {
                          type: 'string',
                          enum: ['upper_third', 'center'],
                        },
                        reserve_bottom_percent: {
                          type: 'number',
                          minimum: 0,
                          maximum: 40,
                        },
                      },
                    },
                    visual: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['theme', 'background_texture', 'glow_strength'],
                      properties: {
                        theme: {type: 'string', enum: ['default', 'neon']},
                        background_texture: {type: 'string', enum: ['none', 'grid']},
                        glow_strength: {type: 'string', enum: ['soft', 'strong']},
                      },
                    },
                    motion: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['entry_style', 'pacing'],
                      properties: {
                        entry_style: {type: 'string', enum: ['drop_bounce', 'elastic_pop']},
                        pacing: {type: 'string', enum: ['balanced', 'reel_fast']},
                      },
                    },
                    flow: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['renderer'],
                      properties: {
                        renderer: {type: 'string', enum: ['dashed', 'packets', 'hybrid']},
                      },
                    },
                  },
                },
                {type: 'null'},
              ],
            },
          },
        },
      },
    },
  },
} as const;

export type TopologyPlan = z.infer<typeof topologyPlanSchema>;
export type TopologyScene = z.infer<typeof topologySceneSchema>;
export type TopologyEntity = z.infer<typeof topologyEntitySchema>;
export type TopologyConnection = z.infer<typeof topologyConnectionSchema>;
export type TopologyOperation = z.infer<typeof topologyOperationSchema>;
export type TopologySceneDirectives = z.infer<typeof topologySceneDirectivesSchema>;
