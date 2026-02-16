export const CONNECTION_KINDS = [
  'request',
  'response',
  'cache_lookup',
  'cache_fill',
  'replication',
  'queue_dispatch',
  'worker_commit',
  'cdn_fetch',
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
};

export const summarizeConnectionCatalog = (): string =>
  CONNECTION_KINDS.map((kind) => {
    const definition = CONNECTION_CATALOG[kind];
    return `- kind: ${kind}, pattern: ${definition.defaultPattern}, purpose: ${definition.description}`;
  }).join('\n');

