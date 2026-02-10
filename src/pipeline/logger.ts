export interface Logger {
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
}

const formatMetadata = (metadata?: Record<string, unknown>): string => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '';
  }

  return ` ${JSON.stringify(metadata)}`;
};

export const createConsoleLogger = (scope = 'pipeline'): Logger => ({
  info: (message, metadata) => {
    console.log(`[${scope}] ${message}${formatMetadata(metadata)}`);
  },
  warn: (message, metadata) => {
    console.warn(`[${scope}] ${message}${formatMetadata(metadata)}`);
  },
  error: (message, metadata) => {
    console.error(`[${scope}] ${message}${formatMetadata(metadata)}`);
  },
});

export const silentLogger: Logger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};
