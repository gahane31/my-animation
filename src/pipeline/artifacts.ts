import {mkdir, readdir, writeFile} from 'fs/promises';
import {basename, dirname, isAbsolute, relative, resolve} from 'path';
import type {Logger} from './logger.js';
import {silentLogger} from './logger.js';

const DEFAULT_HISTORY_ROOT = 'output/history';

export interface ArtifactRunContext {
  pipeline: string;
  historyRoot: string;
  runId: string;
  runDirectory: string;
  createdAtIso: string;
}

export interface CreateArtifactRunContextInput {
  pipeline: string;
  historyRoot?: string;
  logger?: Logger;
}

export interface WriteJsonArtifactInput {
  outputPath: string;
  label: string;
  value: unknown;
  logger?: Logger;
  runContext?: ArtifactRunContext;
}

const pad = (value: number): string => String(value).padStart(2, '0');

const formatDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const resolveRunDirectory = async (
  pipelineRoot: string,
  dateKey: string,
): Promise<{runId: string; runDirectory: string}> => {
  await mkdir(pipelineRoot, {recursive: true});
  const entries = await readdir(pipelineRoot, {withFileTypes: true});

  const indices = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${dateKey}_`))
    .map((entry) => {
      const suffix = entry.name.slice(dateKey.length + 1);
      const parsed = Number(suffix);
      return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
    })
    .filter((index) => index > 0);

  const nextIndex = indices.length === 0 ? 1 : Math.max(...indices) + 1;
  const runId = `${dateKey}_${nextIndex}`;
  return {
    runId,
    runDirectory: resolve(pipelineRoot, runId),
  };
};

const toHistoryRelativePath = (outputPath: string): string => {
  const absolutePath = resolve(outputPath);
  const relativePath = relative(process.cwd(), absolutePath);

  if (!relativePath || relativePath.startsWith('..') || isAbsolute(relativePath)) {
    return basename(absolutePath);
  }

  return relativePath;
};

const writeJsonFile = async (outputPath: string, value: unknown): Promise<void> => {
  const absolutePath = resolve(outputPath);
  await mkdir(dirname(absolutePath), {recursive: true});
  await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

export const createArtifactRunContext = async ({
  pipeline,
  historyRoot,
  logger,
}: CreateArtifactRunContextInput): Promise<ArtifactRunContext> => {
  const activeLogger = logger ?? silentLogger;
  const now = new Date();
  const dateKey = formatDate(now);
  const resolvedHistoryRoot = resolve(historyRoot ?? DEFAULT_HISTORY_ROOT);
  const pipelineRoot = resolve(resolvedHistoryRoot, pipeline);
  const {runId, runDirectory} = await resolveRunDirectory(pipelineRoot, dateKey);

  await mkdir(runDirectory, {recursive: true});
  const createdAtIso = now.toISOString();
  const context: ArtifactRunContext = {
    pipeline,
    historyRoot: resolvedHistoryRoot,
    runId,
    runDirectory,
    createdAtIso,
  };

  await writeJsonFile(resolve(runDirectory, 'run.meta.json'), context);

  activeLogger.info('Created artifact run directory', {
    pipeline,
    runId,
    runDirectory,
  });

  return context;
};

export const writeJsonArtifact = async ({
  outputPath,
  label,
  value,
  logger,
  runContext,
}: WriteJsonArtifactInput): Promise<string> => {
  const activeLogger = logger ?? silentLogger;
  const absolutePath = resolve(outputPath);

  await writeJsonFile(absolutePath, value);

  activeLogger.info('Saved JSON artifact', {
    label,
    outputPath: absolutePath,
  });

  if (runContext) {
    const relativePath = toHistoryRelativePath(outputPath);
    const runOutputPath = resolve(runContext.runDirectory, relativePath);
    await writeJsonFile(runOutputPath, value);

    activeLogger.info('Saved JSON artifact history', {
      label,
      runId: runContext.runId,
      outputPath: runOutputPath,
    });
  }

  return absolutePath;
};
