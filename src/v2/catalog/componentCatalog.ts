import {ComponentType} from '../../schema/visualGrammar.js';

export type ComponentZone =
  | 'left'
  | 'left_center'
  | 'center'
  | 'right_center'
  | 'right'
  | 'bottom'
  | 'top';

export interface ComponentPortDefinition {
  id: string;
  side: 'left' | 'right' | 'top' | 'bottom';
}

export interface ComponentDimensions {
  width: number;
  height: number;
}

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  dimensions: ComponentDimensions;
  minSpacing: number;
  labelMaxWidth: number;
  defaultCount: number;
  maxRenderableInstances: number;
  preferredZone: ComponentZone;
  ports: ComponentPortDefinition[];
}

export const COMPONENT_CATALOG: Record<ComponentType, ComponentDefinition> = {
  [ComponentType.UsersCluster]: {
    type: ComponentType.UsersCluster,
    label: 'Users',
    dimensions: {width: 220, height: 120},
    minSpacing: 42,
    labelMaxWidth: 260,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'top',
    ports: [{id: 'out', side: 'right'}],
  },
  [ComponentType.Server]: {
    type: ComponentType.Server,
    label: 'Server',
    dimensions: {width: 170, height: 128},
    minSpacing: 38,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'center',
    ports: [
      {id: 'in', side: 'left'},
      {id: 'out', side: 'right'},
    ],
  },
  [ComponentType.LoadBalancer]: {
    type: ComponentType.LoadBalancer,
    label: 'Load Balancer',
    dimensions: {width: 128, height: 128},
    minSpacing: 38,
    labelMaxWidth: 210,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'center',
    ports: [
      {id: 'in', side: 'left'},
      {id: 'out', side: 'right'},
    ],
  },
  [ComponentType.Database]: {
    type: ComponentType.Database,
    label: 'Database',
    dimensions: {width: 170, height: 144},
    minSpacing: 40,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'bottom',
    ports: [
      {id: 'in', side: 'left'},
      {id: 'out', side: 'right'},
    ],
  },
  [ComponentType.Cache]: {
    type: ComponentType.Cache,
    label: 'Cache',
    dimensions: {width: 160, height: 116},
    minSpacing: 34,
    labelMaxWidth: 200,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'center',
    ports: [
      {id: 'in', side: 'left'},
      {id: 'out', side: 'right'},
    ],
  },
  [ComponentType.Queue]: {
    type: ComponentType.Queue,
    label: 'Queue',
    dimensions: {width: 148, height: 120},
    minSpacing: 34,
    labelMaxWidth: 210,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'bottom',
    ports: [
      {id: 'in', side: 'left'},
      {id: 'out', side: 'right'},
    ],
  },
  [ComponentType.Cdn]: {
    type: ComponentType.Cdn,
    label: 'CDN',
    dimensions: {width: 170, height: 130},
    minSpacing: 36,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 3,
    preferredZone: 'top',
    ports: [
      {id: 'in', side: 'left'},
      {id: 'out', side: 'right'},
    ],
  },
  [ComponentType.Worker]: {
    type: ComponentType.Worker,
    label: 'Worker',
    dimensions: {width: 136, height: 136},
    minSpacing: 34,
    labelMaxWidth: 190,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'bottom',
    ports: [
      {id: 'in', side: 'left'},
      {id: 'out', side: 'right'},
    ],
  },
};

export const COMPONENT_TYPES = Object.values(ComponentType);

export const summarizeComponentCatalog = (): string =>
  COMPONENT_TYPES.map((type) => {
    const definition = COMPONENT_CATALOG[type];
    return [
      `- type: ${definition.type}`,
      `  label: ${definition.label}`,
      `  dimensions: ${definition.dimensions.width}x${definition.dimensions.height}`,
      `  preferred_zone: ${definition.preferredZone}`,
      `  max_renderable_instances: ${definition.maxRenderableInstances}`,
      `  min_spacing: ${definition.minSpacing}`,
    ].join('\n');
  }).join('\n');
