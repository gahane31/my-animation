import {mkdir, writeFile} from 'fs/promises';
import {dirname, resolve} from 'path';
import type {Logger} from './logger.js';
import {silentLogger} from './logger.js';

export interface WriteJsonArtifactInput {
  outputPath: string;
  label: string;
  value: unknown;
  logger?: Logger;
}

export const writeJsonArtifact = async ({
  outputPath,
  label,
  value,
  logger,
}: WriteJsonArtifactInput): Promise<string> => {
  const activeLogger = logger ?? silentLogger;
  const absolutePath = resolve(outputPath);

  await mkdir(dirname(absolutePath), {recursive: true});
  await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

  activeLogger.info('Saved JSON artifact', {
    label,
    outputPath: absolutePath,
  });

  return absolutePath;
};
