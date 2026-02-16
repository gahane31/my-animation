import {z} from 'zod';
import {VIDEO_LIMITS} from '../config/constants.js';
import {TEMPLATE_IDS} from '../design/templates.js';
import {ComponentType} from './visualGrammar.js';

const nullToUndefined = (value: unknown): unknown => (value === null ? undefined : value);

const COMPONENT_TYPE_ALIASES: Record<string, ComponentType> = {
  users: ComponentType.UsersCluster,
  user: ComponentType.UsersCluster,
  users_cluster: ComponentType.UsersCluster,
  user_cluster: ComponentType.UsersCluster,
  server: ComponentType.Server,
  servers: ComponentType.Server,
  app: ComponentType.Server,
  application: ComponentType.Server,
  load_balancer: ComponentType.LoadBalancer,
  loadbalancer: ComponentType.LoadBalancer,
  lb: ComponentType.LoadBalancer,
  database: ComponentType.Database,
  db: ComponentType.Database,
  cache: ComponentType.Cache,
  queue: ComponentType.Queue,
  worker: ComponentType.Worker,
  workers: ComponentType.Worker,
  cdn: ComponentType.Cdn,
  single_user: ComponentType.SingleUser,
  mobile_app: ComponentType.MobileApp,
  web_browser: ComponentType.WebBrowser,
  admin_user: ComponentType.AdminUser,
  admin: ComponentType.AdminUser,
  third_party_service: ComponentType.ThirdPartyService,
  third_party: ComponentType.ThirdPartyService,
  iot_devices: ComponentType.IotDevices,
  iot: ComponentType.IotDevices,
  dns: ComponentType.Dns,
  waf: ComponentType.Waf,
  api_gateway: ComponentType.ApiGateway,
  reverse_proxy: ComponentType.ReverseProxy,
  rate_limiter: ComponentType.RateLimiter,
  monolith_app: ComponentType.MonolithApp,
  monolith: ComponentType.MonolithApp,
  microservice: ComponentType.Microservice,
  microservices: ComponentType.Microservice,
  auth_service: ComponentType.AuthService,
  user_service: ComponentType.UserService,
  payment_service: ComponentType.PaymentService,
  notification_service: ComponentType.NotificationService,
  media_service: ComponentType.MediaService,
  search_service: ComponentType.SearchService,
  vm: ComponentType.VirtualMachine,
  virtual_machine: ComponentType.VirtualMachine,
  container: ComponentType.Container,
  kubernetes_cluster: ComponentType.KubernetesCluster,
  k8s: ComponentType.KubernetesCluster,
  auto_scaling_group: ComponentType.AutoScalingGroup,
  worker_node: ComponentType.WorkerNode,
  job_processor: ComponentType.JobProcessor,
  primary_db: ComponentType.PrimaryDatabase,
  primary_database: ComponentType.PrimaryDatabase,
  read_replica: ComponentType.ReadReplica,
  sharded_db: ComponentType.ShardedDatabase,
  sharded_database: ComponentType.ShardedDatabase,
  sql_db: ComponentType.SqlDatabase,
  sql_database: ComponentType.SqlDatabase,
  nosql_db: ComponentType.NoSqlDatabase,
  nosql_database: ComponentType.NoSqlDatabase,
  time_series_db: ComponentType.TimeSeriesDatabase,
  time_series_database: ComponentType.TimeSeriesDatabase,
  graph_db: ComponentType.GraphDatabase,
  graph_database: ComponentType.GraphDatabase,
  object_storage: ComponentType.ObjectStorage,
  media_storage: ComponentType.MediaStorage,
  edge_cache: ComponentType.EdgeCache,
  query_cache: ComponentType.QueryCache,
  application_cache: ComponentType.ApplicationCache,
  message_queue: ComponentType.MessageQueue,
  event_stream: ComponentType.EventStream,
  pub_sub: ComponentType.PubSub,
  dlq: ComponentType.DeadLetterQueue,
  dead_letter_queue: ComponentType.DeadLetterQueue,
  batch_processor: ComponentType.BatchProcessor,
  internet_cloud: ComponentType.InternetCloud,
  vpc_boundary: ComponentType.VpcBoundary,
  vpc: ComponentType.VpcBoundary,
  public_subnet: ComponentType.PublicSubnet,
  private_subnet: ComponentType.PrivateSubnet,
  firewall_boundary: ComponentType.FirewallBoundary,
  shard_indicator: ComponentType.ShardIndicator,
  global_region: ComponentType.GlobalRegion,
  failover: ComponentType.FailoverNode,
  failover_node: ComponentType.FailoverNode,
  health_check: ComponentType.HealthCheck,
  circuit_breaker: ComponentType.CircuitBreaker,
  retry_policy: ComponentType.RetryPolicy,
  retry: ComponentType.RetryPolicy,
  backup_storage: ComponentType.BackupStorage,
  multi_region: ComponentType.MultiRegion,
  authorization_lock: ComponentType.AuthorizationLock,
  oauth_provider: ComponentType.OAuthProvider,
  jwt_token: ComponentType.JwtToken,
  jwt: ComponentType.JwtToken,
  tls_encryption: ComponentType.TlsEncryption,
  tls: ComponentType.TlsEncryption,
  secrets_manager: ComponentType.SecretsManager,
  logs: ComponentType.Logs,
  metrics_dashboard: ComponentType.MetricsDashboard,
  monitoring: ComponentType.Monitoring,
  alerting: ComponentType.Alerting,
  tracing: ComponentType.Tracing,
  payment_gateway: ComponentType.PaymentGateway,
  email_sms_service: ComponentType.EmailSmsService,
  maps_service: ComponentType.MapsService,
  social_login: ComponentType.SocialLogin,
  llm_api: ComponentType.LlmApi,
};

const normalizeComponentTypeInput = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const normalizedKey = value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return COMPONENT_TYPE_ALIASES[normalizedKey] ?? normalizedKey;
};

const componentTypeSchema = z.preprocess(
  normalizeComponentTypeInput,
  z.nativeEnum(ComponentType),
);

const optionalCountSchema = z.preprocess(
  nullToUndefined,
  z.number().positive().optional(),
);

const optionalImportanceSchema = z.preprocess(
  nullToUndefined,
  z.enum(['primary', 'secondary']).optional(),
);

const optionalStatusSchema = z.preprocess(
  nullToUndefined,
  z.enum(['normal', 'active', 'overloaded', 'error', 'down']).optional(),
);

const optionalLabelSchema = z.preprocess(nullToUndefined, z.string().min(1).optional());

const optionalDirectionSchema = z.preprocess(
  nullToUndefined,
  z.enum(['one_way', 'bidirectional']).optional(),
);

const optionalLineStyleSchema = z.preprocess(
  nullToUndefined,
  z.enum(['solid', 'dashed', 'dotted']).optional(),
);

const optionalIntensitySchema = z.preprocess(
  nullToUndefined,
  z.enum(['low', 'medium', 'high']).optional(),
);

const optionalStateValueSchema = z.preprocess(
  nullToUndefined,
  z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
);

const optionalCameraTargetSchema = z.preprocess(nullToUndefined, z.string().min(1).optional());
const optionalCameraZoomSchema = z.preprocess(
  nullToUndefined,
  z.number().positive().optional(),
);

export const EntitySchema = z.object({
  id: z.string().min(1),
  type: componentTypeSchema,
  count: optionalCountSchema,
  importance: optionalImportanceSchema,
  status: optionalStatusSchema,
  label: optionalLabelSchema,
});

export const ConnectionSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  direction: optionalDirectionSchema,
  style: optionalLineStyleSchema,
});

export const InteractionSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  type: z.enum(['flow', 'burst', 'broadcast', 'ping']),
  intensity: optionalIntensitySchema,
});

export const EntityStateChangeSchema = z.object({
  entityId: z.string().min(1),
  type: z.enum(['status', 'count', 'highlight', 'dim', 'remove']),
  value: optionalStateValueSchema,
});

const CameraObjectSchema = z.object({
  mode: z.enum(['wide', 'focus']),
  target: optionalCameraTargetSchema,
  zoom: optionalCameraZoomSchema,
});

export const CameraSchema = CameraObjectSchema.superRefine((camera, context) => {
  if (camera.mode === 'focus' && !camera.target) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Focus camera requires a target entity id',
      path: ['target'],
    });
  }
});

const optionalConnectionsSchema = z.preprocess(
  nullToUndefined,
  z.array(ConnectionSchema).optional(),
);

const optionalInteractionsSchema = z.preprocess(
  nullToUndefined,
  z.array(InteractionSchema).optional(),
);

const optionalStateChangesSchema = z.preprocess(
  nullToUndefined,
  z.array(EntityStateChangeSchema).optional(),
);

const optionalCameraSchema = z.preprocess(nullToUndefined, CameraSchema.optional());
const optionalTemplateSchema = z.preprocess(
  nullToUndefined,
  z.enum(TEMPLATE_IDS).optional(),
);
const optionalHookFlagSchema = z.preprocess(nullToUndefined, z.boolean().optional());
const optionalTransitionStyleSchema = z.preprocess(
  nullToUndefined,
  z.enum(['hooked_split_insert', 'soft_pop']).optional(),
);
const optionalTransitionPaceSchema = z.preprocess(
  nullToUndefined,
  z.enum(['slow', 'medium', 'fast']).optional(),
);

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

export const MomentTransitionSchema = z.discriminatedUnion('type', [
  insertBetweenTransitionSchema,
  addEntityTransitionSchema,
]);

const optionalTransitionSchema = z.preprocess(
  nullToUndefined,
  MomentTransitionSchema.optional(),
);

export const SceneDirectivesSchema = z.object({
  camera: z
    .object({
      mode: z.enum(['auto', 'follow_action', 'wide_recap', 'steady']).default('auto'),
      zoom: z.enum(['tight', 'medium', 'wide']).default('tight'),
      active_zone: z.enum(['upper_third', 'center']).default('upper_third'),
      reserve_bottom_percent: z.number().min(0).max(40).default(25),
    })
    .default({
      mode: 'auto',
      zoom: 'tight',
      active_zone: 'upper_third',
      reserve_bottom_percent: 25,
    }),
  visual: z
    .object({
      theme: z.enum(['default', 'neon']).default('neon'),
      background_texture: z.enum(['none', 'grid']).default('grid'),
      glow_strength: z.enum(['soft', 'strong']).default('strong'),
    })
    .default({
      theme: 'neon',
      background_texture: 'grid',
      glow_strength: 'strong',
    }),
  motion: z
    .object({
      entry_style: z.enum(['drop_bounce', 'elastic_pop']).default('elastic_pop'),
      pacing: z.enum(['balanced', 'reel_fast']).default('reel_fast'),
    })
    .default({
      entry_style: 'elastic_pop',
      pacing: 'reel_fast',
    }),
  flow: z
    .object({
      renderer: z.enum(['dashed', 'packets', 'hybrid']).default('hybrid'),
    })
    .default({
      renderer: 'hybrid',
    }),
});

const optionalSceneDirectivesSchema = z.preprocess(
  nullToUndefined,
  SceneDirectivesSchema.optional(),
);

const MomentObjectSchema = z.object({
  id: z.string().min(1),
  start: z.number().min(0),
  end: z.number().min(0),
  narration: z.string().min(1),
  entities: z.array(EntitySchema).min(1),
  connections: optionalConnectionsSchema,
  interactions: optionalInteractionsSchema,
  stateChanges: optionalStateChangesSchema,
  camera: optionalCameraSchema,
  template: optionalTemplateSchema,
  isHook: optionalHookFlagSchema,
  transition: optionalTransitionSchema,
  directives: optionalSceneDirectivesSchema,
});

const validateMomentRules = (
  moment: z.infer<typeof MomentObjectSchema>,
  context: z.RefinementCtx,
): void => {
  const duration = moment.end - moment.start;

  if (duration <= 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Moment "${moment.id}" must have end > start`,
      path: ['end'],
    });
  }

  if (duration > VIDEO_LIMITS.maxSceneDurationSeconds) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Moment "${moment.id}" exceeds ${VIDEO_LIMITS.maxSceneDurationSeconds}s`,
      path: ['end'],
    });
  }

  const entityIds = new Set<string>();
  for (const entity of moment.entities) {
    if (entityIds.has(entity.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate entity id "${entity.id}" in moment "${moment.id}"`,
        path: ['entities'],
      });
    }
    entityIds.add(entity.id);
  }

  const primaryCount = moment.entities.filter((entity) => entity.importance === 'primary').length;
  if (primaryCount === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Moment "${moment.id}" must define exactly one primary entity`,
      path: ['entities'],
    });
  }

  if (primaryCount > 1) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Moment "${moment.id}" has more than one primary entity`,
      path: ['entities'],
    });
  }

  for (const connection of moment.connections ?? []) {
    if (!entityIds.has(connection.from)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Connection "${connection.id}" references unknown from entity "${connection.from}"`,
        path: ['connections'],
      });
    }

    if (!entityIds.has(connection.to)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Connection "${connection.id}" references unknown to entity "${connection.to}"`,
        path: ['connections'],
      });
    }
  }

  for (const interaction of moment.interactions ?? []) {
    if (!entityIds.has(interaction.from)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Interaction "${interaction.id}" references unknown from entity "${interaction.from}"`,
        path: ['interactions'],
      });
    }

    if (!entityIds.has(interaction.to)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Interaction "${interaction.id}" references unknown to entity "${interaction.to}"`,
        path: ['interactions'],
      });
    }
  }

  for (const stateChange of moment.stateChanges ?? []) {
    if (!entityIds.has(stateChange.entityId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `State change references unknown entity "${stateChange.entityId}"`,
        path: ['stateChanges'],
      });
    }
  }

  if (moment.camera?.target && !entityIds.has(moment.camera.target)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Camera target "${moment.camera.target}" is not present in entities`,
      path: ['camera', 'target'],
    });
  }

  if (moment.transition) {
    if (!entityIds.has(moment.transition.entityId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Transition entity "${moment.transition.entityId}" is not present in entities`,
        path: ['transition', 'entityId'],
      });
    }

    if (moment.transition.type === 'insert_between') {
      if (!entityIds.has(moment.transition.fromId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Transition fromId "${moment.transition.fromId}" is not present in entities`,
          path: ['transition', 'fromId'],
        });
      }

      if (!entityIds.has(moment.transition.toId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Transition toId "${moment.transition.toId}" is not present in entities`,
          path: ['transition', 'toId'],
        });
      }

      if (moment.transition.fromId === moment.transition.toId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Transition fromId and toId must be different',
          path: ['transition'],
        });
      }
    }
  }
};

export const MomentSchema = MomentObjectSchema.superRefine(validateMomentRules);

const MomentsVideoObjectSchema = z.object({
  duration: z.number().positive().max(VIDEO_LIMITS.maxDurationSeconds),
  moments: z.array(MomentSchema).min(1),
});

const validateMomentsVideoRules = (
  video: z.infer<typeof MomentsVideoObjectSchema>,
  context: z.RefinementCtx,
): void => {
  const sortedMoments = [...video.moments].sort((left, right) => left.start - right.start);

  const firstMoment = sortedMoments[0];
  if (firstMoment && firstMoment.start !== 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'First moment must start at 0',
      path: ['moments', 0, 'start'],
    });
  }

  const momentIds = new Set<string>();
  sortedMoments.forEach((moment) => {
    if (momentIds.has(moment.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate moment id "${moment.id}"`,
        path: ['moments'],
      });
    }
    momentIds.add(moment.id);
  });

  for (let index = 1; index < sortedMoments.length; index += 1) {
    const previous = sortedMoments[index - 1];
    const current = sortedMoments[index];

    if (!previous || !current) {
      continue;
    }

    if (current.start < previous.end) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Moment "${current.id}" overlaps with "${previous.id}"`,
        path: ['moments'],
      });
    }
  }

  const latestEnd = Math.max(...sortedMoments.map((moment) => moment.end));
  if (latestEnd > video.duration) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Video duration must cover the end of the last moment',
      path: ['duration'],
    });
  }
};

export const MomentsVideoSchema = MomentsVideoObjectSchema.superRefine(validateMomentsVideoRules);

export const EntityLayoutSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

export const DesignedEntitySchema = EntitySchema.extend({
  layout: EntityLayoutSchema,
});

const DesignedMomentObjectSchema = MomentObjectSchema.extend({
  entities: z.array(DesignedEntitySchema).min(1),
});

export const DesignedMomentSchema = DesignedMomentObjectSchema.superRefine(validateMomentRules);

const DesignedMomentsVideoObjectSchema = MomentsVideoObjectSchema.extend({
  moments: z.array(DesignedMomentSchema).min(1),
});

export const DesignedMomentsVideoSchema = DesignedMomentsVideoObjectSchema.superRefine(
  validateMomentsVideoRules,
);

export type Entity = z.infer<typeof EntitySchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type Interaction = z.infer<typeof InteractionSchema>;
export type EntityStateChange = z.infer<typeof EntityStateChangeSchema>;
export type Camera = z.infer<typeof CameraSchema>;
export type MomentTransition = z.infer<typeof MomentTransitionSchema>;
export type SceneDirectives = z.infer<typeof SceneDirectivesSchema>;
export type Moment = z.infer<typeof MomentSchema>;
export type MomentsVideo = z.infer<typeof MomentsVideoSchema>;
export type DesignedEntity = z.infer<typeof DesignedEntitySchema>;
export type DesignedMoment = z.infer<typeof DesignedMomentSchema>;
export type DesignedMomentsVideo = z.infer<typeof DesignedMomentsVideoSchema>;

export const validateMomentsVideo = (input: unknown): MomentsVideo => MomentsVideoSchema.parse(input);

export interface MomentVisualActivityWarning {
  momentId: string;
  message: string;
}

const sortById = <T extends {id: string}>(items: T[]): T[] =>
  [...items].sort((left, right) => left.id.localeCompare(right.id));

const entitySignature = (entity: Entity): string =>
  [
    entity.id,
    entity.type,
    entity.count ?? null,
    entity.importance ?? null,
    entity.status ?? null,
    entity.label ?? null,
  ].join('|');

const connectionSignature = (connection: Connection): string =>
  [connection.id, connection.from, connection.to, connection.direction ?? null, connection.style ?? null].join(
    '|',
  );

const hasEntitySetChanged = (previous: Moment | undefined, current: Moment): boolean => {
  const previousEntities = previous ? sortById(previous.entities).map(entitySignature) : [];
  const currentEntities = sortById(current.entities).map(entitySignature);

  if (previousEntities.length !== currentEntities.length) {
    return true;
  }

  return previousEntities.some((signature, index) => signature !== currentEntities[index]);
};

const hasConnectionSetChanged = (previous: Moment | undefined, current: Moment): boolean => {
  const previousConnections = previous
    ? sortById(previous.connections ?? []).map(connectionSignature)
    : [];
  const currentConnections = sortById(current.connections ?? []).map(connectionSignature);

  if (previousConnections.length !== currentConnections.length) {
    return true;
  }

  return previousConnections.some((signature, index) => signature !== currentConnections[index]);
};

const hasCameraChanged = (previous: Moment | undefined, current: Moment): boolean =>
  JSON.stringify(previous?.camera ?? null) !== JSON.stringify(current.camera ?? null);

const hasVisualActivitySignal = (previous: Moment | undefined, current: Moment): boolean => {
  const hasStructuralChange = hasEntitySetChanged(previous, current) || hasConnectionSetChanged(previous, current);
  if (hasStructuralChange) {
    return true;
  }

  if ((current.interactions?.length ?? 0) > 0) {
    return true;
  }

  if (hasCameraChanged(previous, current)) {
    return true;
  }

  if ((current.stateChanges?.length ?? 0) > 0) {
    return true;
  }

  return false;
};

export const collectMomentVisualActivityWarnings = (
  video: Pick<MomentsVideo, 'moments'>,
): MomentVisualActivityWarning[] => {
  const sortedMoments = [...video.moments].sort((left, right) => left.start - right.start);
  const warnings: MomentVisualActivityWarning[] = [];

  for (let index = 0; index < sortedMoments.length; index += 1) {
    const current = sortedMoments[index];
    if (!current) {
      continue;
    }

    const previous = index > 0 ? sortedMoments[index - 1] : undefined;
    const duration = current.end - current.start;
    const timeSincePreviousStart = previous ? current.start - previous.start : current.start;
    const hasActivity = hasVisualActivitySignal(previous, current);

    if (
      !hasActivity &&
      (duration > VIDEO_LIMITS.maxStructuralIdleSeconds ||
        timeSincePreviousStart > VIDEO_LIMITS.maxStructuralIdleSeconds)
    ) {
      warnings.push({
        momentId: current.id,
        message: `Long low-activity moment detected (> ${VIDEO_LIMITS.maxStructuralIdleSeconds}s).`,
      });
    }
  }

  return warnings;
};
