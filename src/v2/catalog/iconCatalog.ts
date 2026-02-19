import {ComponentType} from '../../schema/visualGrammar.js';

export const LUCIDE_ICON_NAMES = [
  'activity',
  'archive',
  'arrow-right-left',
  'bar-chart-3',
  'bell',
  'bot',
  'boxes',
  'cloud',
  'cog',
  'container',
  'copy',
  'cpu',
  'credit-card',
  'database',
  'file-text',
  'folder',
  'git-branch',
  'globe',
  'hard-drive',
  'image',
  'inbox',
  'key',
  'key-round',
  'layers',
  'layout-dashboard',
  'list-ordered',
  'lock',
  'mail',
  'map',
  'memory-stick',
  'monitor',
  'network',
  'plug',
  'radio',
  'route',
  'scale',
  'search',
  'server',
  'shield',
  'shield-check',
  'shuffle',
  'smartphone',
  'ticket',
  'timer',
  'triangle-alert',
  'user',
  'users',
  'waves',
  'waypoints',
] as const;

export type LucideIconName = string;
const LUCIDE_ICON_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTAINER_ICON_PATTERNS: RegExp[] = [/^square-/, /-square$/, /^layout-/, /^panel-/];

const DEFAULT_LUCIDE_ICON_BY_COMPONENT: Record<ComponentType, LucideIconName> = {
  [ComponentType.UsersCluster]: 'users',
  [ComponentType.SingleUser]: 'user',
  [ComponentType.MobileApp]: 'smartphone',
  [ComponentType.WebBrowser]: 'monitor',
  [ComponentType.AdminUser]: 'user',
  [ComponentType.ThirdPartyService]: 'plug',
  [ComponentType.IotDevices]: 'radio',
  [ComponentType.Dns]: 'globe',
  [ComponentType.Server]: 'server',
  [ComponentType.LoadBalancer]: 'scale',
  [ComponentType.Waf]: 'shield',
  [ComponentType.ApiGateway]: 'waypoints',
  [ComponentType.ReverseProxy]: 'shuffle',
  [ComponentType.RateLimiter]: 'timer',
  [ComponentType.MonolithApp]: 'layout-dashboard',
  [ComponentType.Microservice]: 'boxes',
  [ComponentType.AuthService]: 'key-round',
  [ComponentType.UserService]: 'user',
  [ComponentType.PaymentService]: 'credit-card',
  [ComponentType.NotificationService]: 'bell',
  [ComponentType.MediaService]: 'image',
  [ComponentType.SearchService]: 'search',
  [ComponentType.VirtualMachine]: 'server',
  [ComponentType.Container]: 'container',
  [ComponentType.KubernetesCluster]: 'boxes',
  [ComponentType.AutoScalingGroup]: 'layers',
  [ComponentType.WorkerNode]: 'cpu',
  [ComponentType.JobProcessor]: 'cog',
  [ComponentType.Database]: 'database',
  [ComponentType.PrimaryDatabase]: 'database',
  [ComponentType.ReadReplica]: 'copy',
  [ComponentType.ShardedDatabase]: 'git-branch',
  [ComponentType.SqlDatabase]: 'database',
  [ComponentType.NoSqlDatabase]: 'database',
  [ComponentType.TimeSeriesDatabase]: 'bar-chart-3',
  [ComponentType.GraphDatabase]: 'route',
  [ComponentType.ObjectStorage]: 'hard-drive',
  [ComponentType.MediaStorage]: 'folder',
  [ComponentType.Cache]: 'memory-stick',
  [ComponentType.EdgeCache]: 'memory-stick',
  [ComponentType.QueryCache]: 'memory-stick',
  [ComponentType.ApplicationCache]: 'memory-stick',
  [ComponentType.Queue]: 'list-ordered',
  [ComponentType.MessageQueue]: 'list-ordered',
  [ComponentType.EventStream]: 'waves',
  [ComponentType.PubSub]: 'radio',
  [ComponentType.DeadLetterQueue]: 'inbox',
  [ComponentType.BatchProcessor]: 'layers',
  [ComponentType.Cdn]: 'cloud',
  [ComponentType.InternetCloud]: 'cloud',
  [ComponentType.VpcBoundary]: 'network',
  [ComponentType.PublicSubnet]: 'network',
  [ComponentType.PrivateSubnet]: 'lock',
  [ComponentType.FirewallBoundary]: 'shield',
  [ComponentType.ShardIndicator]: 'git-branch',
  [ComponentType.GlobalRegion]: 'globe',
  [ComponentType.FailoverNode]: 'arrow-right-left',
  [ComponentType.HealthCheck]: 'shield-check',
  [ComponentType.CircuitBreaker]: 'triangle-alert',
  [ComponentType.RetryPolicy]: 'arrow-right-left',
  [ComponentType.BackupStorage]: 'archive',
  [ComponentType.MultiRegion]: 'map',
  [ComponentType.AuthorizationLock]: 'lock',
  [ComponentType.OAuthProvider]: 'key',
  [ComponentType.JwtToken]: 'ticket',
  [ComponentType.TlsEncryption]: 'shield-check',
  [ComponentType.SecretsManager]: 'key-round',
  [ComponentType.Logs]: 'file-text',
  [ComponentType.MetricsDashboard]: 'bar-chart-3',
  [ComponentType.Monitoring]: 'activity',
  [ComponentType.Alerting]: 'triangle-alert',
  [ComponentType.Tracing]: 'route',
  [ComponentType.PaymentGateway]: 'credit-card',
  [ComponentType.EmailSmsService]: 'mail',
  [ComponentType.MapsService]: 'map',
  [ComponentType.SocialLogin]: 'users',
  [ComponentType.LlmApi]: 'bot',
  [ComponentType.Worker]: 'cog',
};

export const normalizeLucideIconName = (value: unknown): LucideIconName | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^lucide:/, '')
    .replace(/[\s_]+/g, '-');

  if (!LUCIDE_ICON_NAME_PATTERN.test(normalized)) {
    return undefined;
  }

  return normalized;
};

export const resolveLucideIconForComponent = (
  type: ComponentType,
  preferredIcon: unknown,
): LucideIconName => {
  const normalized = normalizeLucideIconName(preferredIcon);
  if (!normalized) {
    return DEFAULT_LUCIDE_ICON_BY_COMPONENT[type];
  }

  if (CONTAINER_ICON_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return DEFAULT_LUCIDE_ICON_BY_COMPONENT[type];
  }

  return normalized;
};

export const summarizeLucideIconCatalog = (): string =>
  [
    '- icon field accepts any valid Lucide icon name token (no "lucide:" prefix).',
    '- avoid container-style variants like square-*/layout-* when clean diagram icons are preferred.',
    '- Suggested commonly useful Lucide tokens:',
    `  ${LUCIDE_ICON_NAMES.join(', ')}`,
    '- These are just suggestions, Use any valid lucid icon applicable',
    '- If icon is null, renderer falls back to a component-type default.',
  ].join('\n');
