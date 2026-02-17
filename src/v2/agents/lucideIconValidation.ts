import type {Logger} from '../../pipeline/logger.js';
import {silentLogger} from '../../pipeline/logger.js';
import {normalizeLucideIconName} from '../catalog/iconCatalog.js';
import type {StoryIntent} from '../schema/storyIntent.schema.js';
import type {TopologyPlan} from '../schema/topologyPlan.schema.js';

interface IconCandidate {
  icon: string;
  sceneId: string;
  location: string;
}

export interface IconValidationIssue {
  sceneId: string;
  location: string;
  icon: string;
  reason: 'invalid_format' | 'icon_not_found';
}

export interface IconValidationResult {
  valid: boolean;
  skipped: boolean;
  issues: IconValidationIssue[];
}

export interface IconValidationOptions {
  logger?: Logger;
  timeoutMs?: number;
}

const ICONIFY_LUCIDE_BASE = 'https://api.iconify.design/lucide:';
const DEFAULT_TIMEOUT_MS = 2500;
const MAX_ISSUE_LINES = 16;

const isRenderableLucideIcon = async (
  icon: string,
  timeoutMs: number,
): Promise<'valid' | 'invalid' | 'unknown'> => {
  if (typeof fetch !== 'function') {
    return 'unknown';
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);
  const normalizedIcon = normalizeLucideIconName(icon);
  const token = normalizedIcon ?? icon;

  try {
    const response = await fetch(`${ICONIFY_LUCIDE_BASE}${token}.svg`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (response.status === 404) {
      return 'invalid';
    }

    if (!response.ok) {
      return 'unknown';
    }

    const payload = await response.text();
    if (payload.includes('<svg')) {
      return 'valid';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  } finally {
    clearTimeout(timeoutHandle);
  }
};

const validateCandidates = async (
  candidates: IconCandidate[],
  options: IconValidationOptions = {},
): Promise<IconValidationResult> => {
  const logger = options.logger ?? silentLogger;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const issues: IconValidationIssue[] = [];
  const availabilityCache = new Map<string, 'valid' | 'invalid' | 'unknown'>();

  for (const candidate of candidates) {
    const normalized = normalizeLucideIconName(candidate.icon);
    if (!normalized) {
      issues.push({
        sceneId: candidate.sceneId,
        location: candidate.location,
        icon: candidate.icon,
        reason: 'invalid_format',
      });
      continue;
    }

    const cached = availabilityCache.get(normalized);
    if (cached === 'invalid') {
      issues.push({
        sceneId: candidate.sceneId,
        location: candidate.location,
        icon: candidate.icon,
        reason: 'icon_not_found',
      });
      continue;
    }

    if (cached === 'valid') {
      continue;
    }

    const availability = await isRenderableLucideIcon(normalized, timeoutMs);
    availabilityCache.set(normalized, availability);

    if (availability === 'invalid') {
      issues.push({
        sceneId: candidate.sceneId,
        location: candidate.location,
        icon: candidate.icon,
        reason: 'icon_not_found',
      });
    }
  }

  const allUnknown = availabilityCache.size > 0 && [...availabilityCache.values()].every((value) => value === 'unknown');
  if (allUnknown) {
    logger.warn('Lucide icon availability check skipped (network unavailable)', {
      checkedIcons: availabilityCache.size,
    });
    return {
      valid: true,
      skipped: true,
      issues: [],
    };
  }

  return {
    valid: issues.length === 0,
    skipped: false,
    issues,
  };
};

const collectStoryCandidates = (storyIntent: StoryIntent): IconCandidate[] => {
  const candidates: IconCandidate[] = [];

  for (const scene of storyIntent.scenes) {
    scene.icon_hints.forEach((hint, index) => {
      if (!hint.icon) {
        return;
      }

      candidates.push({
        sceneId: scene.id,
        location: `icon_hints[${index}](${hint.component_type})`,
        icon: hint.icon,
      });
    });
  }

  return candidates;
};

const collectTopologyCandidates = (topologyPlan: TopologyPlan): IconCandidate[] => {
  const candidates: IconCandidate[] = [];

  for (const scene of topologyPlan.scenes) {
    scene.entities.forEach((entity, index) => {
      if (!entity.icon) {
        return;
      }

      candidates.push({
        sceneId: scene.id,
        location: `entities[${index}](${entity.id}/${entity.type})`,
        icon: entity.icon,
      });
    });
  }

  return candidates;
};

const describeIssue = (issue: IconValidationIssue): string => {
  const reason =
    issue.reason === 'invalid_format'
      ? 'invalid Lucide token format'
      : 'icon not found in Lucide set';
  return `- scene "${issue.sceneId}" ${issue.location}: "${issue.icon}" (${reason})`;
};

export const formatIconValidationIssues = (
  issues: IconValidationIssue[],
): string => issues.slice(0, MAX_ISSUE_LINES).map((issue) => describeIssue(issue)).join('\n');

export const validateStoryIntentLucideIcons = async (
  storyIntent: StoryIntent,
  options: IconValidationOptions = {},
): Promise<IconValidationResult> =>
  validateCandidates(collectStoryCandidates(storyIntent), options);

export const validateTopologyLucideIcons = async (
  topologyPlan: TopologyPlan,
  options: IconValidationOptions = {},
): Promise<IconValidationResult> =>
  validateCandidates(collectTopologyCandidates(topologyPlan), options);
