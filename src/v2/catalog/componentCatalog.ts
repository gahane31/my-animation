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
  description: string;
  dimensions: ComponentDimensions;
  minSpacing: number;
  labelMaxWidth: number;
  defaultCount: number;
  maxRenderableInstances: number;
  preferredZone: ComponentZone;
  ports: ComponentPortDefinition[];
}

type ComponentFamily =
  | 'actor'
  | 'edge'
  | 'application'
  | 'compute'
  | 'storage'
  | 'performance'
  | 'messaging'
  | 'networking'
  | 'scalability'
  | 'reliability'
  | 'security'
  | 'observability'
  | 'external';

interface ComponentDefinitionOverride {
  label?: string;
  description?: string;
  dimensions?: ComponentDimensions;
  minSpacing?: number;
  labelMaxWidth?: number;
  defaultCount?: number;
  maxRenderableInstances?: number;
  preferredZone?: ComponentZone;
  ports?: ComponentPortDefinition[];
}

interface FamilyDefaults {
  dimensions: ComponentDimensions;
  minSpacing: number;
  labelMaxWidth: number;
  defaultCount: number;
  maxRenderableInstances: number;
  preferredZone: ComponentZone;
  ports: ComponentPortDefinition[];
}

const DEFAULT_PORTS: ComponentPortDefinition[] = [
  {id: 'in', side: 'left'},
  {id: 'out', side: 'right'},
];

const ACTOR_TYPES = new Set<ComponentType>([
  ComponentType.UsersCluster,
  ComponentType.SingleUser,
  ComponentType.MobileApp,
  ComponentType.WebBrowser,
  ComponentType.AdminUser,
  ComponentType.ThirdPartyService,
  ComponentType.IotDevices,
]);

const EDGE_TYPES = new Set<ComponentType>([
  ComponentType.Dns,
  ComponentType.Cdn,
  ComponentType.Waf,
  ComponentType.ApiGateway,
  ComponentType.ReverseProxy,
  ComponentType.RateLimiter,
  ComponentType.LoadBalancer,
]);

const APPLICATION_TYPES = new Set<ComponentType>([
  ComponentType.Server,
  ComponentType.MonolithApp,
  ComponentType.Microservice,
  ComponentType.AuthService,
  ComponentType.UserService,
  ComponentType.PaymentService,
  ComponentType.NotificationService,
  ComponentType.MediaService,
  ComponentType.SearchService,
]);

const COMPUTE_TYPES = new Set<ComponentType>([
  ComponentType.VirtualMachine,
  ComponentType.Container,
  ComponentType.KubernetesCluster,
  ComponentType.AutoScalingGroup,
  ComponentType.WorkerNode,
  ComponentType.Worker,
  ComponentType.JobProcessor,
]);

const STORAGE_TYPES = new Set<ComponentType>([
  ComponentType.Database,
  ComponentType.PrimaryDatabase,
  ComponentType.ReadReplica,
  ComponentType.ShardedDatabase,
  ComponentType.SqlDatabase,
  ComponentType.NoSqlDatabase,
  ComponentType.TimeSeriesDatabase,
  ComponentType.GraphDatabase,
  ComponentType.ObjectStorage,
  ComponentType.MediaStorage,
  ComponentType.BackupStorage,
]);

const PERFORMANCE_TYPES = new Set<ComponentType>([
  ComponentType.Cache,
  ComponentType.EdgeCache,
  ComponentType.QueryCache,
  ComponentType.ApplicationCache,
]);

const MESSAGING_TYPES = new Set<ComponentType>([
  ComponentType.Queue,
  ComponentType.MessageQueue,
  ComponentType.EventStream,
  ComponentType.PubSub,
  ComponentType.DeadLetterQueue,
  ComponentType.BatchProcessor,
]);

const NETWORKING_TYPES = new Set<ComponentType>([
  ComponentType.InternetCloud,
  ComponentType.VpcBoundary,
  ComponentType.PublicSubnet,
  ComponentType.PrivateSubnet,
  ComponentType.FirewallBoundary,
]);

const SCALABILITY_TYPES = new Set<ComponentType>([
  ComponentType.ShardIndicator,
  ComponentType.GlobalRegion,
  ComponentType.MultiRegion,
]);

const RELIABILITY_TYPES = new Set<ComponentType>([
  ComponentType.FailoverNode,
  ComponentType.HealthCheck,
  ComponentType.CircuitBreaker,
  ComponentType.RetryPolicy,
]);

const SECURITY_TYPES = new Set<ComponentType>([
  ComponentType.AuthorizationLock,
  ComponentType.OAuthProvider,
  ComponentType.JwtToken,
  ComponentType.TlsEncryption,
  ComponentType.SecretsManager,
]);

const OBSERVABILITY_TYPES = new Set<ComponentType>([
  ComponentType.Logs,
  ComponentType.MetricsDashboard,
  ComponentType.Monitoring,
  ComponentType.Alerting,
  ComponentType.Tracing,
]);

const EXTERNAL_TYPES = new Set<ComponentType>([
  ComponentType.PaymentGateway,
  ComponentType.EmailSmsService,
  ComponentType.MapsService,
  ComponentType.SocialLogin,
  ComponentType.LlmApi,
]);

const LABEL_OVERRIDES: Partial<Record<ComponentType, string>> = {
  [ComponentType.UsersCluster]: 'Users',
  [ComponentType.Cdn]: 'CDN',
  [ComponentType.Dns]: 'DNS',
  [ComponentType.Waf]: 'WAF',
  [ComponentType.ApiGateway]: 'API Gateway',
  [ComponentType.SqlDatabase]: 'SQL Database',
  [ComponentType.NoSqlDatabase]: 'NoSQL Database',
  [ComponentType.TimeSeriesDatabase]: 'Time-series DB',
  [ComponentType.IotDevices]: 'IoT Devices',
  [ComponentType.VpcBoundary]: 'VPC Boundary',
  [ComponentType.OAuthProvider]: 'OAuth Provider',
  [ComponentType.JwtToken]: 'JWT Token',
  [ComponentType.TlsEncryption]: 'TLS Encryption',
  [ComponentType.PubSub]: 'Pub/Sub',
  [ComponentType.LlmApi]: 'AI/LLM API',
  [ComponentType.EmailSmsService]: 'Email/SMS Service',
};

const FAMILY_DEFAULTS: Record<ComponentFamily, FamilyDefaults> = {
  actor: {
    dimensions: {width: 190, height: 116},
    minSpacing: 36,
    labelMaxWidth: 240,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'top',
    ports: [{id: 'out', side: 'right'}],
  },
  edge: {
    dimensions: {width: 170, height: 120},
    minSpacing: 36,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 3,
    preferredZone: 'top',
    ports: DEFAULT_PORTS,
  },
  application: {
    dimensions: {width: 170, height: 128},
    minSpacing: 36,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'center',
    ports: DEFAULT_PORTS,
  },
  compute: {
    dimensions: {width: 168, height: 122},
    minSpacing: 34,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'center',
    ports: DEFAULT_PORTS,
  },
  storage: {
    dimensions: {width: 170, height: 144},
    minSpacing: 38,
    labelMaxWidth: 230,
    defaultCount: 1,
    maxRenderableInstances: 4,
    preferredZone: 'bottom',
    ports: DEFAULT_PORTS,
  },
  performance: {
    dimensions: {width: 160, height: 116},
    minSpacing: 34,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 3,
    preferredZone: 'center',
    ports: DEFAULT_PORTS,
  },
  messaging: {
    dimensions: {width: 148, height: 120},
    minSpacing: 34,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 3,
    preferredZone: 'bottom',
    ports: DEFAULT_PORTS,
  },
  networking: {
    dimensions: {width: 220, height: 124},
    minSpacing: 30,
    labelMaxWidth: 260,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'center',
    ports: DEFAULT_PORTS,
  },
  scalability: {
    dimensions: {width: 170, height: 112},
    minSpacing: 30,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'right_center',
    ports: DEFAULT_PORTS,
  },
  reliability: {
    dimensions: {width: 164, height: 112},
    minSpacing: 30,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'right_center',
    ports: DEFAULT_PORTS,
  },
  security: {
    dimensions: {width: 160, height: 112},
    minSpacing: 30,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'left_center',
    ports: DEFAULT_PORTS,
  },
  observability: {
    dimensions: {width: 170, height: 112},
    minSpacing: 30,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'right',
    ports: DEFAULT_PORTS,
  },
  external: {
    dimensions: {width: 170, height: 114},
    minSpacing: 30,
    labelMaxWidth: 220,
    defaultCount: 1,
    maxRenderableInstances: 2,
    preferredZone: 'right',
    ports: DEFAULT_PORTS,
  },
};

const COMPONENT_OVERRIDES: Partial<Record<ComponentType, ComponentDefinitionOverride>> = {
  [ComponentType.UsersCluster]: {
    dimensions: {width: 220, height: 120},
    minSpacing: 42,
    labelMaxWidth: 260,
    maxRenderableInstances: 4,
    preferredZone: 'top',
    ports: [{id: 'out', side: 'right'}],
  },
  [ComponentType.Server]: {
    dimensions: {width: 170, height: 128},
    minSpacing: 38,
    labelMaxWidth: 220,
    maxRenderableInstances: 4,
    preferredZone: 'center',
  },
  [ComponentType.LoadBalancer]: {
    dimensions: {width: 128, height: 128},
    minSpacing: 38,
    labelMaxWidth: 210,
    maxRenderableInstances: 2,
    preferredZone: 'center',
  },
  [ComponentType.Database]: {
    dimensions: {width: 170, height: 144},
    minSpacing: 40,
    labelMaxWidth: 220,
    maxRenderableInstances: 4,
    preferredZone: 'bottom',
  },
  [ComponentType.Cache]: {
    dimensions: {width: 160, height: 116},
    minSpacing: 34,
    labelMaxWidth: 200,
    maxRenderableInstances: 2,
    preferredZone: 'center',
  },
  [ComponentType.Queue]: {
    dimensions: {width: 148, height: 120},
    minSpacing: 34,
    labelMaxWidth: 210,
    maxRenderableInstances: 2,
    preferredZone: 'bottom',
  },
  [ComponentType.Cdn]: {
    dimensions: {width: 170, height: 130},
    minSpacing: 36,
    labelMaxWidth: 220,
    maxRenderableInstances: 3,
    preferredZone: 'top',
  },
  [ComponentType.Worker]: {
    dimensions: {width: 136, height: 136},
    minSpacing: 34,
    labelMaxWidth: 190,
    maxRenderableInstances: 4,
    preferredZone: 'bottom',
  },
};

export const COMPONENT_TYPES = Object.values(ComponentType);

export const MINIMAL_COMPONENT_KIT: ComponentType[] = [
  ComponentType.UsersCluster,
  ComponentType.Cdn,
  ComponentType.LoadBalancer,
  ComponentType.Server,
  ComponentType.Database,
  ComponentType.Cache,
  ComponentType.Queue,
  ComponentType.Worker,
  ComponentType.GlobalRegion,
];

const clonePorts = (ports: ComponentPortDefinition[]): ComponentPortDefinition[] =>
  ports.map((port) => ({...port}));

const toTitleCase = (value: string): string =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const resolveLabel = (type: ComponentType): string => LABEL_OVERRIDES[type] ?? toTitleCase(type);

const resolveFamily = (type: ComponentType): ComponentFamily => {
  if (ACTOR_TYPES.has(type)) {
    return 'actor';
  }
  if (EDGE_TYPES.has(type)) {
    return 'edge';
  }
  if (APPLICATION_TYPES.has(type)) {
    return 'application';
  }
  if (COMPUTE_TYPES.has(type)) {
    return 'compute';
  }
  if (STORAGE_TYPES.has(type)) {
    return 'storage';
  }
  if (PERFORMANCE_TYPES.has(type)) {
    return 'performance';
  }
  if (MESSAGING_TYPES.has(type)) {
    return 'messaging';
  }
  if (NETWORKING_TYPES.has(type)) {
    return 'networking';
  }
  if (SCALABILITY_TYPES.has(type)) {
    return 'scalability';
  }
  if (RELIABILITY_TYPES.has(type)) {
    return 'reliability';
  }
  if (SECURITY_TYPES.has(type)) {
    return 'security';
  }
  if (OBSERVABILITY_TYPES.has(type)) {
    return 'observability';
  }
  if (EXTERNAL_TYPES.has(type)) {
    return 'external';
  }

  return 'application';
};

const resolveDescription = (label: string, family: ComponentFamily): string => {
  switch (family) {
    case 'actor':
      return [
        `${label} represents who generates incoming traffic.`,
        'Use it at the entry point to show the request origin clearly.',
        'Scale count to communicate load growth over time.',
        'Connect it first to edge controls such as CDN, gateway, or load balancer.',
      ].join('\n');
    case 'edge':
      return [
        `${label} belongs to the edge layer that handles entry traffic.`,
        'Use it to show routing, protection, and request shaping.',
        'Place it near the top before application services.',
        'Typical flows go from actors -> edge -> app tier.',
      ].join('\n');
    case 'application':
      return [
        `${label} represents core business logic in the app layer.`,
        'Use it for synchronous service handling and domain operations.',
        'Scale count for horizontal growth or service decomposition.',
        'Connect downstream to cache, queue, and storage components.',
      ].join('\n');
    case 'compute':
      return [
        `${label} represents runtime infrastructure where code executes.`,
        'Use it to explain containerization, orchestration, or worker execution.',
        'Helpful for showing autoscaling or resource boundaries.',
        'Typically sits beneath app services and above storage/messaging.',
      ].join('\n');
    case 'storage':
      return [
        `${label} represents persistent storage for system state.`,
        'Use it to show primary data writes, reads, and durability paths.',
        'Scale count for replicas, shards, or multi-store setups.',
        'Keep it toward the lower part of the architecture flow.',
      ].join('\n');
    case 'performance':
      return [
        `${label} is used to reduce latency and offload heavy dependencies.`,
        'Use it for hot paths, cached reads, or intermediate acceleration.',
        'Place it between services and slower downstream systems.',
        'Show lower-latency behavior with faster request flows.',
      ].join('\n');
    case 'messaging':
      return [
        `${label} models asynchronous communication and workload decoupling.`,
        'Use it to move slow tasks out of synchronous request paths.',
        'Useful for fan-out, event processing, and backpressure handling.',
        'Connect producers to consumers/workers through this layer.',
      ].join('\n');
    case 'networking':
      return [
        `${label} clarifies network topology or trust boundaries.`,
        'Use it for internet flow, VPC segmentation, and subnet context.',
        'These components improve architecture readability in complex scenes.',
        'Treat them as structural context around active traffic components.',
      ].join('\n');
    case 'scalability':
      return [
        `${label} highlights scale strategy and growth behavior.`,
        'Use it to explain partitioning, regional spread, or capacity expansion.',
        'Best placed near affected services to show the scaling relationship.',
        'Useful in before/after optimization storytelling.',
      ].join('\n');
    case 'reliability':
      return [
        `${label} represents resilience and failure-handling behavior.`,
        'Use it to show high availability, recovery, and fault isolation.',
        'Pair with status changes during overload/failure scenes.',
        'Connect it to primary components affected by incident paths.',
      ].join('\n');
    case 'security':
      return [
        `${label} represents identity, auth, or security control points.`,
        'Use it for trust boundaries and secure communication explanation.',
        'Keep security components close to relevant entry or service paths.',
        'Useful for compliance and production-readiness narratives.',
      ].join('\n');
    case 'observability':
      return [
        `${label} represents operational visibility for production systems.`,
        'Use it to show logs, metrics, traces, and alerting coverage.',
        'Place near services to indicate instrumentation and monitoring flow.',
        'Helpful when explaining reliability improvements and incident response.',
      ].join('\n');
    case 'external':
      return [
        `${label} is an external dependency integrated with your platform.`,
        'Use it for third-party APIs and external provider interactions.',
        'Keep boundaries explicit so external calls are visually distinct.',
        'Dashed or lighter flows often communicate out-of-system dependencies.',
      ].join('\n');
    default:
      return `${label} is a reusable system component.`;
  }
};

const buildComponentDefinition = (type: ComponentType): ComponentDefinition => {
  const family = resolveFamily(type);
  const defaults = FAMILY_DEFAULTS[family];
  const override = COMPONENT_OVERRIDES[type];
  const label = override?.label ?? resolveLabel(type);
  const description = override?.description ?? resolveDescription(label, family);

  return {
    type,
    label,
    description,
    dimensions: override?.dimensions ?? defaults.dimensions,
    minSpacing: override?.minSpacing ?? defaults.minSpacing,
    labelMaxWidth: override?.labelMaxWidth ?? defaults.labelMaxWidth,
    defaultCount: override?.defaultCount ?? defaults.defaultCount,
    maxRenderableInstances: override?.maxRenderableInstances ?? defaults.maxRenderableInstances,
    preferredZone: override?.preferredZone ?? defaults.preferredZone,
    ports: clonePorts(override?.ports ?? defaults.ports),
  };
};

export const COMPONENT_CATALOG: Record<ComponentType, ComponentDefinition> = COMPONENT_TYPES.reduce(
  (catalog, type) => {
    catalog[type] = buildComponentDefinition(type);
    return catalog;
  },
  {} as Record<ComponentType, ComponentDefinition>,
);

export const summarizeComponentCatalog = (): string =>
  COMPONENT_TYPES.map((type) => {
    const definition = COMPONENT_CATALOG[type];
    const descriptionLines = definition.description
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n');

    return [
      `- type: ${definition.type}`,
      `  label: ${definition.label}`,
      `  dimensions: ${definition.dimensions.width}x${definition.dimensions.height}`,
      `  preferred_zone: ${definition.preferredZone}`,
      `  max_renderable_instances: ${definition.maxRenderableInstances}`,
      `  min_spacing: ${definition.minSpacing}`,
      '  description:',
      descriptionLines,
    ].join('\n');
  }).join('\n');

export const summarizeMinimalComponentKit = (): string =>
  MINIMAL_COMPONENT_KIT
    .map((type) => `${type} (${COMPONENT_CATALOG[type].label})`)
    .join(', ');
