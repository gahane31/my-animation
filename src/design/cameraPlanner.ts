import {CameraTokens} from '../config/cameraTokens.js';
import {HookTokens} from '../config/hookTokens.js';
import {
  DEFAULT_MOTION_PERSONALITY,
  MotionPersonalities,
  type MotionPersonalityId,
} from '../config/motionPersonalityTokens.js';
import type {MomentDiff} from './diffTypes.js';
import type {HierarchyPlan} from './hierarchyPlanner.js';
import {getTemplateDefinition} from './templates.js';
import type {DesignedMoment, DesignedEntity} from '../schema/moment.schema.js';

export type CameraMotionType =
  | 'focus_primary'
  | 'introduce_primary'
  | 'expand_architecture'
  | 'steady';

export interface PlannedCamera {
  targetId?: string;
  targetPosition?: {
    x: number;
    y: number;
  };
  zoom: number;
  duration: number;
  easing: string;
  motionType: CameraMotionType;
}

const CAMERA_ZOOM_CHANGE_THRESHOLD = 0.05;
const INTRODUCED_PRIMARY_ZOOM = CameraTokens.zoom.small + 0.1;

const resolveTargetEntity = (
  moment: DesignedMoment,
  hierarchy: HierarchyPlan,
): DesignedEntity | undefined => {
  if (hierarchy.primaryId) {
    const fromHierarchy = moment.entities.find((entity) => entity.id === hierarchy.primaryId);
    if (fromHierarchy) {
      return fromHierarchy;
    }
  }

  if (moment.camera?.target) {
    const fromCamera = moment.entities.find((entity) => entity.id === moment.camera?.target);
    if (fromCamera) {
      return fromCamera;
    }
  }

  return moment.entities[0];
};

const resolveBaseZoom = (entityCount: number): number => {
  if (entityCount <= 2) {
    return CameraTokens.zoom.single;
  }

  if (entityCount <= 5) {
    return CameraTokens.zoom.small;
  }

  if (entityCount <= 10) {
    return CameraTokens.zoom.medium;
  }

  return CameraTokens.zoom.large;
};

const hasSystemGrowth = (diff: MomentDiff): boolean => {
  const hasEntityGrowth = diff.entityDiffs.some((entry) => {
    if (entry.type === 'entity_added') {
      return true;
    }

    return entry.type === 'entity_count_changed' && entry.to > entry.from;
  });

  if (hasEntityGrowth) {
    return true;
  }

  return diff.entityDiffs.some((entry) => entry.type === 'entity_moved');
};

const hasPrimaryIntroduction = (diff: MomentDiff, primaryId: string | null): boolean => {
  if (!primaryId) {
    return false;
  }

  return diff.entityDiffs.some(
    (entry) => entry.type === 'entity_added' && entry.entityId === primaryId,
  );
};

const findNewEntity = (
  moment: DesignedMoment,
  diff: MomentDiff,
): DesignedEntity | undefined => {
  const addedId = diff.entityDiffs.find((entry) => entry.type === 'entity_added')?.entityId;
  if (!addedId) {
    return undefined;
  }

  return moment.entities.find((entity) => entity.id === addedId);
};

const clampZoom = (value: number): number =>
  Math.min(CameraTokens.zoom.single, Math.max(CameraTokens.zoom.large, value));

export const buildCameraPlan = (
  moment: DesignedMoment,
  diff: MomentDiff,
  hierarchy: HierarchyPlan,
  previousCamera?: PlannedCamera | null,
  personality: MotionPersonalityId = DEFAULT_MOTION_PERSONALITY,
): PlannedCamera => {
  const personalityTokens = MotionPersonalities[personality];
  const template = getTemplateDefinition(moment.template ?? 'ARCHITECTURE_FLOW');
  const newEntity = findNewEntity(moment, diff);
  const targetEntity =
    template.cameraBias === 'focus_new' && newEntity
      ? newEntity
      : resolveTargetEntity(moment, hierarchy);
  const primaryId = hierarchy.primaryId;
  const introducedPrimary = hasPrimaryIntroduction(diff, primaryId);
  const growthDetected = hasSystemGrowth(diff);

  let zoom = resolveBaseZoom(moment.entities.length);
  let motionType: CameraMotionType = 'steady';

  if (growthDetected) {
    zoom = Math.min(zoom, CameraTokens.zoom.medium);
    motionType = 'expand_architecture';
  }

  if (template.cameraBias === 'strong_focus') {
    zoom += 0.15;
  } else if (template.cameraBias === 'wide') {
    zoom -= 0.1;
  }

  if (introducedPrimary) {
    zoom = INTRODUCED_PRIMARY_ZOOM;
    motionType = 'introduce_primary';
  } else if (template.cameraBias === 'focus_new' && newEntity) {
    motionType = 'introduce_primary';
  } else if (
    targetEntity?.id &&
    previousCamera?.targetId &&
    previousCamera.targetId !== targetEntity.id
  ) {
    motionType = 'focus_primary';
  } else if (targetEntity) {
    motionType = 'focus_primary';
  }

  const personalityZoom = zoom * personalityTokens.zoomStrength;
  let plannedZoom = clampZoom(personalityZoom);
  let plannedDuration = Math.max(
    0.2,
    CameraTokens.transitionDuration / personalityTokens.cameraSpeed,
  );

  if (moment.isHook) {
    plannedZoom = clampZoom(HookTokens.zoom);
    plannedDuration = Math.max(0.2, plannedDuration * 0.8);
  }

  return {
    targetId: targetEntity?.id,
    targetPosition: targetEntity?.layout,
    zoom: plannedZoom,
    duration: plannedDuration,
    easing: personalityTokens.easing,
    motionType,
  };
};

export const detectCameraChange = (
  previous: PlannedCamera | null | undefined,
  current: PlannedCamera,
): boolean => {
  if (!previous) {
    return true;
  }

  return (
    previous.targetId !== current.targetId ||
    Math.abs(previous.zoom - current.zoom) > CAMERA_ZOOM_CHANGE_THRESHOLD
  );
};
