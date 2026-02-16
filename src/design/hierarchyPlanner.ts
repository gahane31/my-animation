import {
  DEFAULT_MOTION_PERSONALITY,
  MotionPersonalities,
  type MotionPersonalityId,
} from '../config/motionPersonalityTokens.js';
import {HierarchyTokens} from '../config/hierarchyTokens.js';
import {HookTokens} from '../config/hookTokens.js';
import type {MomentDiff} from './diffTypes.js';
import type {DesignedMoment} from '../schema/moment.schema.js';
import {getTemplateDefinition} from './templates.js';

export interface HierarchyEntityStyle {
  scale: number;
  opacity: number;
  glow: boolean;
}

export interface HierarchyPlan {
  primaryId: string | null;
  entityStyles: Record<string, HierarchyEntityStyle>;
}

export interface HierarchyTransition {
  type: 'primary_changed';
  from: string | null;
  to: string | null;
}

const resolvePrimaryEntityId = (
  moment: DesignedMoment,
  diff?: MomentDiff,
): string | null => {
  const explicitPrimary = moment.entities.find((entity) => entity.importance === 'primary');
  if (explicitPrimary) {
    return explicitPrimary.id;
  }

  const template = getTemplateDefinition(moment.template ?? 'ARCHITECTURE_FLOW');
  if (template.layout === 'center' && moment.entities.length > 0) {
    const centerX = 50;
    const centerY = 55;
    const centerEntity = [...moment.entities].sort((left, right) => {
      const leftDx = left.layout?.x ?? centerX;
      const leftDy = left.layout?.y ?? centerY;
      const rightDx = right.layout?.x ?? centerX;
      const rightDy = right.layout?.y ?? centerY;

      const leftDistance = Math.hypot(leftDx - centerX, leftDy - centerY);
      const rightDistance = Math.hypot(rightDx - centerX, rightDy - centerY);
      return leftDistance - rightDistance;
    })[0];

    if (centerEntity) {
      return centerEntity.id;
    }
  }

  if (moment.camera?.target) {
    return moment.camera.target;
  }

  const highlightedStateChange = (moment.stateChanges ?? []).find(
    (change) => change.type === 'highlight',
  );
  if (highlightedStateChange) {
    return highlightedStateChange.entityId;
  }

  if (diff?.entityDiffs) {
    const added = diff.entityDiffs.find((entry) => entry.type === 'entity_added');
    if (added) {
      return added.entityId;
    }
  }

  return moment.entities[0]?.id ?? null;
};

export const buildHierarchyPlan = (
  moment: DesignedMoment,
  diff?: MomentDiff,
  previousHierarchy?: HierarchyPlan | null,
  personality: MotionPersonalityId = DEFAULT_MOTION_PERSONALITY,
): HierarchyPlan => {
  const personalityTokens = MotionPersonalities[personality];
  const template = getTemplateDefinition(moment.template ?? 'ARCHITECTURE_FLOW');
  const fallbackPrimaryId = previousHierarchy?.primaryId ?? null;
  const primaryId = resolvePrimaryEntityId(moment, diff) ?? fallbackPrimaryId;
  const secondaryOpacity = moment.isHook
    ? HookTokens.opacity.secondary
    : template.layout === 'center'
      ? 0.4
      : HierarchyTokens.secondary.opacity;

  const entityStyles: Record<string, HierarchyEntityStyle> = {};
  const primaryScaleBoost = moment.isHook ? 1.1 : 1;

  for (const entity of moment.entities) {
    if (entity.id === primaryId) {
      entityStyles[entity.id] = {
        scale: HierarchyTokens.primary.scale * personalityTokens.scaleBoost * primaryScaleBoost,
        opacity: HierarchyTokens.primary.opacity,
        glow: HierarchyTokens.primary.glow,
      };
    } else {
      entityStyles[entity.id] = {
        scale: HierarchyTokens.secondary.scale,
        opacity: secondaryOpacity,
        glow: HierarchyTokens.secondary.glow,
      };
    }
  }

  return {
    primaryId,
    entityStyles,
  };
};

export const detectHierarchyTransition = (
  previousHierarchy: HierarchyPlan | null | undefined,
  currentHierarchy: HierarchyPlan,
): HierarchyTransition | null => {
  if (!previousHierarchy) {
    return null;
  }

  if (previousHierarchy.primaryId !== currentHierarchy.primaryId) {
    return {
      type: 'primary_changed',
      from: previousHierarchy.primaryId,
      to: currentHierarchy.primaryId,
    };
  }

  return null;
};
