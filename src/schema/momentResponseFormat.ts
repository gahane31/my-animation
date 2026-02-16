import {VIDEO_LIMITS} from '../config/constants.js';
import {ComponentType} from './visualGrammar.js';

const componentValues = Object.values(ComponentType);

const nullableNumber = {
  anyOf: [{type: 'number'}, {type: 'null'}],
} as const;

const nullableString = {
  anyOf: [{type: 'string', minLength: 1}, {type: 'null'}],
} as const;

const nullableImportance = {
  anyOf: [
    {
      type: 'string',
      enum: ['primary', 'secondary'],
    },
    {type: 'null'},
  ],
} as const;

const nullableStatus = {
  anyOf: [
    {
      type: 'string',
      enum: ['normal', 'active', 'overloaded', 'error', 'down'],
    },
    {type: 'null'},
  ],
} as const;

const nullableDirection = {
  anyOf: [
    {
      type: 'string',
      enum: ['one_way', 'bidirectional'],
    },
    {type: 'null'},
  ],
} as const;

const nullableLineStyle = {
  anyOf: [
    {
      type: 'string',
      enum: ['solid', 'dashed', 'dotted'],
    },
    {type: 'null'},
  ],
} as const;

const nullableIntensity = {
  anyOf: [
    {
      type: 'string',
      enum: ['low', 'medium', 'high'],
    },
    {type: 'null'},
  ],
} as const;

const nullableStateChangeValue = {
  anyOf: [
    {type: 'string'},
    {type: 'number'},
    {type: 'boolean'},
    {type: 'null'},
  ],
} as const;

const entitySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'type', 'count', 'importance', 'status', 'label'],
  properties: {
    id: {type: 'string', minLength: 1},
    type: {type: 'string', enum: componentValues},
    count: nullableNumber,
    importance: nullableImportance,
    status: nullableStatus,
    label: nullableString,
  },
} as const;

const connectionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'from', 'to', 'direction', 'style'],
  properties: {
    id: {type: 'string', minLength: 1},
    from: {type: 'string', minLength: 1},
    to: {type: 'string', minLength: 1},
    direction: nullableDirection,
    style: nullableLineStyle,
  },
} as const;

const interactionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'from', 'to', 'type', 'intensity'],
  properties: {
    id: {type: 'string', minLength: 1},
    from: {type: 'string', minLength: 1},
    to: {type: 'string', minLength: 1},
    type: {
      type: 'string',
      enum: ['flow', 'burst', 'broadcast', 'ping'],
    },
    intensity: nullableIntensity,
  },
} as const;

const stateChangeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['entityId', 'type', 'value'],
  properties: {
    entityId: {type: 'string', minLength: 1},
    type: {
      type: 'string',
      enum: ['status', 'count', 'highlight', 'dim', 'remove'],
    },
    value: nullableStateChangeValue,
  },
} as const;

const cameraSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['mode', 'target', 'zoom'],
  properties: {
    mode: {type: 'string', enum: ['wide', 'focus']},
    target: nullableString,
    zoom: nullableNumber,
  },
} as const;

const nullableConnections = {
  anyOf: [
    {
      type: 'array',
      items: connectionSchema,
    },
    {type: 'null'},
  ],
} as const;

const nullableInteractions = {
  anyOf: [
    {
      type: 'array',
      items: interactionSchema,
    },
    {type: 'null'},
  ],
} as const;

const nullableStateChanges = {
  anyOf: [
    {
      type: 'array',
      items: stateChangeSchema,
    },
    {type: 'null'},
  ],
} as const;

const nullableCamera = {
  anyOf: [cameraSchema, {type: 'null'}],
} as const;

export const momentResponseFormat = {
  type: 'json_schema',
  name: 'moments_video',
  strict: true,
  description: 'Moment-level technical animation plan with entities, interactions, and camera intent.',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['duration', 'moments'],
    properties: {
      duration: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: VIDEO_LIMITS.maxDurationSeconds,
      },
      moments: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          additionalProperties: false,
          required: [
            'id',
            'start',
            'end',
            'narration',
            'entities',
            'connections',
            'interactions',
            'stateChanges',
            'camera',
          ],
          properties: {
            id: {type: 'string', minLength: 1},
            start: {type: 'number', minimum: 0},
            end: {type: 'number', minimum: 0},
            narration: {type: 'string', minLength: 1},
            entities: {
              type: 'array',
              minItems: 1,
              items: entitySchema,
            },
            connections: nullableConnections,
            interactions: nullableInteractions,
            stateChanges: nullableStateChanges,
            camera: nullableCamera,
          },
        },
      },
    },
  },
} as const;
