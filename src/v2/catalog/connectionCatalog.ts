export const CONNECTION_KINDS = [
  'request',
  'response',
  'service_call',
  'async_event',
  'cache_lookup',
  'cache_fill',
  'replication',
  'queue_dispatch',
  'worker_commit',
  'cdn_fetch',
  'failover',
  'health_check',
  'retry',
  'auth_request',
  'metrics',
  'logs',
  'trace',
  'external_api',
  'ingestion',
] as const;

export type ConnectionKind = (typeof CONNECTION_KINDS)[number];

export const FLOW_PATTERNS = ['steady', 'burst', 'broadcast', 'ping'] as const;

export type FlowPattern = (typeof FLOW_PATTERNS)[number];

export interface ConnectionDefinition {
  kind: ConnectionKind;
  defaultPattern: FlowPattern;
  description: string;
}

export const CONNECTION_CATALOG: Record<ConnectionKind, ConnectionDefinition> = {
  request: {
    kind: 'request',
    defaultPattern: 'steady',
    description: 'Synchronous request flow between user-facing components.',
  },
  response: {
    kind: 'response',
    defaultPattern: 'steady',
    description: 'Response flow back to callers.',
  },
  service_call: {
    kind: 'service_call',
    defaultPattern: 'steady',
    description: 'Synchronous service-to-service call inside the app layer.',
  },
  async_event: {
    kind: 'async_event',
    defaultPattern: 'broadcast',
    description: 'Asynchronous event emission into downstream consumers.',
  },
  cache_lookup: {
    kind: 'cache_lookup',
    defaultPattern: 'steady',
    description: 'Read path from app/service to cache.',
  },
  cache_fill: {
    kind: 'cache_fill',
    defaultPattern: 'burst',
    description: 'Write-back or fill path into cache.',
  },
  replication: {
    kind: 'replication',
    defaultPattern: 'broadcast',
    description: 'Replication flow between databases.',
  },
  queue_dispatch: {
    kind: 'queue_dispatch',
    defaultPattern: 'broadcast',
    description: 'Queue fan-out from producer to workers.',
  },
  worker_commit: {
    kind: 'worker_commit',
    defaultPattern: 'steady',
    description: 'Worker write/commit path to downstream systems.',
  },
  cdn_fetch: {
    kind: 'cdn_fetch',
    defaultPattern: 'steady',
    description: 'Edge retrieval path through CDN.',
  },
  failover: {
    kind: 'failover',
    defaultPattern: 'burst',
    description: 'Failover path activated during outage or degradation.',
  },
  health_check: {
    kind: 'health_check',
    defaultPattern: 'ping',
    description: 'Health probe path used for liveness/readiness checks.',
  },
  retry: {
    kind: 'retry',
    defaultPattern: 'burst',
    description: 'Retry traffic when initial call fails or times out.',
  },
  auth_request: {
    kind: 'auth_request',
    defaultPattern: 'steady',
    description: 'Authentication/authorization validation call.',
  },
  metrics: {
    kind: 'metrics',
    defaultPattern: 'steady',
    description: 'Metrics emission path into observability backend.',
  },
  logs: {
    kind: 'logs',
    defaultPattern: 'steady',
    description: 'Log shipping path from services to logging stack.',
  },
  trace: {
    kind: 'trace',
    defaultPattern: 'ping',
    description: 'Distributed tracing span/report path.',
  },
  external_api: {
    kind: 'external_api',
    defaultPattern: 'steady',
    description: 'Outbound call to third-party external service.',
  },
  ingestion: {
    kind: 'ingestion',
    defaultPattern: 'burst',
    description: 'High-volume inbound ingestion data flow.',
  },
};

export const summarizeConnectionCatalog = (): string =>
  CONNECTION_KINDS.map((kind) => {
    const definition = CONNECTION_CATALOG[kind];
    return `- kind: ${kind}, pattern: ${definition.defaultPattern}, purpose: ${definition.description}`;
  }).join('\n');
