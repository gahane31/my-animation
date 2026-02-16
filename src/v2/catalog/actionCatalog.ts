export const ACTION_TYPES = [
  'smooth',
  'overload',
  'crash',
  'recover',
  'scale_out',
  'scale_in',
  'degrade',
  'stabilize',
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

export interface ActionDefinition {
  id: ActionType;
  description: string;
}

export const ACTION_CATALOG: Record<ActionType, ActionDefinition> = {
  smooth: {
    id: 'smooth',
    description: 'System operates in healthy, low-latency mode.',
  },
  overload: {
    id: 'overload',
    description: 'Component is saturated and request latency rises.',
  },
  crash: {
    id: 'crash',
    description: 'Component or path is failing hard.',
  },
  recover: {
    id: 'recover',
    description: 'System returns from degraded state to healthy state.',
  },
  scale_out: {
    id: 'scale_out',
    description: 'Entity count or capacity increases.',
  },
  scale_in: {
    id: 'scale_in',
    description: 'Entity count or capacity decreases.',
  },
  degrade: {
    id: 'degrade',
    description: 'Performance worsens without full outage.',
  },
  stabilize: {
    id: 'stabilize',
    description: 'System settles into predictable steady-state behavior.',
  },
};

export const summarizeActionCatalog = (): string =>
  ACTION_TYPES.map((actionType) => `- ${actionType}: ${ACTION_CATALOG[actionType].description}`).join('\n');

