import {z} from 'zod';
import {ComponentType} from '../../schema/visualGrammar.js';
import {
  topologyConnectionSchema,
  topologySceneDirectivesSchema,
  topologyOperationSchema,
  topologyTransitionSchema,
} from './topologyPlan.schema.js';

export const compositionSceneSchema = z.object({
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
  focusEntityId: z.string().min(1),
  visibleEntities: z.array(
    z.object({
      id: z.string().min(1),
      type: z.nativeEnum(ComponentType),
      label: z.string().optional(),
      icon: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      count: z.number().positive().optional(),
      importance: z.enum(['primary', 'secondary']).optional(),
      status: z.enum(['normal', 'active', 'overloaded', 'error', 'down']).optional(),
      priorityScore: z.number(),
    }),
  ),
  visibleConnections: z.array(topologyConnectionSchema),
  operations: z.array(topologyOperationSchema),
  transition: topologyTransitionSchema.optional(),
  cameraIntent: z.enum(['wide', 'focus', 'introduce', 'steady']).default('focus'),
  directives: topologySceneDirectivesSchema.optional(),
  complexity_budget: z.object({
    max_visible_components: z.number().int().min(1).max(8),
    max_visible_connections: z.number().int().min(0).max(12),
    max_simultaneous_motions: z.number().int().min(1).max(6),
  }),
});

export const compositionPlanSchema = z.object({
  duration: z.number().positive(),
  scenes: z.array(compositionSceneSchema).min(1),
});

export const laidOutSceneSchema = compositionSceneSchema.extend({
  laidOutEntities: z.array(
    z.object({
      id: z.string().min(1),
      type: z.nativeEnum(ComponentType),
      label: z.string().optional(),
      icon: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      count: z.number().positive().optional(),
      importance: z.enum(['primary', 'secondary']).optional(),
      status: z.enum(['normal', 'active', 'overloaded', 'error', 'down']).optional(),
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
  ),
});

export const laidOutPlanSchema = z.object({
  duration: z.number().positive(),
  scenes: z.array(laidOutSceneSchema).min(1),
});

export type CompositionPlan = z.infer<typeof compositionPlanSchema>;
export type CompositionScene = z.infer<typeof compositionSceneSchema>;
export type LaidOutPlan = z.infer<typeof laidOutPlanSchema>;
export type LaidOutScene = z.infer<typeof laidOutSceneSchema>;
