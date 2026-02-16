import type {MomentDiff} from '../design/diffTypes.js';
import type {
  Connection,
  DesignedMoment,
  Interaction,
} from '../schema/moment.schema.js';
import {AnimationType, CameraActionType} from '../schema/visualGrammar.js';
import type {
  ElementAnimationIntent,
  SceneAnimationPlan,
} from './types.js';

const PHASE_ORDER: SceneAnimationPlan['phaseOrder'] = [
  'removals',
  'moves',
  'additions',
  'connections',
  'interactions',
  'camera',
];

const toCameraAction = (moment?: DesignedMoment): CameraActionType | undefined => {
  const mode = moment?.camera?.mode;

  if (!mode) {
    return undefined;
  }

  if (mode === 'wide') {
    return CameraActionType.Wide;
  }

  if (mode === 'focus') {
    return CameraActionType.Focus;
  }

  return undefined;
};

interface AnimationIntentAccumulator {
  removals: Map<string, ElementAnimationIntent>;
  moves: Map<string, ElementAnimationIntent>;
  additions: Map<string, ElementAnimationIntent>;
  connections: Map<string, ElementAnimationIntent>;
  interactions: Map<string, ElementAnimationIntent>;
}

const createAccumulator = (): AnimationIntentAccumulator => ({
  removals: new Map(),
  moves: new Map(),
  additions: new Map(),
  connections: new Map(),
  interactions: new Map(),
});

interface PlannerState {
  currentEntityInstances: Map<string, string[]>;
  previousEntityInstances: Map<string, string[]>;
}

const resolveElementIds = (
  entityId: string,
  state: PlannerState,
  preferCurrent = true,
): string[] => {
  const current = state.currentEntityInstances.get(entityId) ?? [];
  const previous = state.previousEntityInstances.get(entityId) ?? [];

  if (preferCurrent && current.length > 0) {
    return [...current];
  }

  if (!preferCurrent && previous.length > 0) {
    return [...previous];
  }

  if (current.length > 0) {
    return [...current];
  }

  if (previous.length > 0) {
    return [...previous];
  }

  return [entityId];
};

const mergeEffects = (
  left: AnimationType[] | undefined,
  right: AnimationType[] | undefined,
): AnimationType[] | undefined => {
  const values = [...(left ?? []), ...(right ?? [])];

  if (values.length === 0) {
    return undefined;
  }

  return [...new Set(values)];
};

const upsertIntent = (
  target: Map<string, ElementAnimationIntent>,
  intent: ElementAnimationIntent,
): void => {
  const existing = target.get(intent.entityId);

  if (!existing) {
    target.set(intent.entityId, {
      ...intent,
      elementIds: [...new Set(intent.elementIds)],
      effects: intent.effects ? [...new Set(intent.effects)] : undefined,
    });
    return;
  }

  existing.elementIds = [...new Set([...existing.elementIds, ...intent.elementIds])];
  existing.action = intent.action ?? existing.action;
  existing.connectionId = intent.connectionId ?? existing.connectionId;
  existing.interactionId = intent.interactionId ?? existing.interactionId;
  existing.enter = intent.enter ?? existing.enter;
  existing.exit = intent.exit ?? existing.exit;
  existing.cleanup = existing.cleanup || Boolean(intent.cleanup);
  existing.effects = mergeEffects(existing.effects, intent.effects);
};

const buildConnectionMap = (moment?: DesignedMoment): Map<string, Connection> =>
  new Map((moment?.connections ?? []).map((connection) => [connection.id, connection]));

const buildInteractionMap = (moment?: DesignedMoment): Map<string, Interaction> =>
  new Map((moment?.interactions ?? []).map((interaction) => [interaction.id, interaction]));

const applyInsertBetweenTransition = (
  accumulator: AnimationIntentAccumulator,
  state: PlannerState,
  currentMoment: DesignedMoment,
): void => {
  const transition = currentMoment.transition;

  if (!transition || transition.type !== 'insert_between') {
    return;
  }

  const {entityId} = transition;
  // Keep insert-between transitions deterministic and calm:
  // add the inserted entity and let layout/connection diffs handle the rest.
  upsertIntent(accumulator.additions, {
    entityId,
    elementIds: resolveElementIds(entityId, state, true),
    action: 'add',
    enter: AnimationType.ZoomIn,
  });
};

const applyAddEntityTransition = (
  accumulator: AnimationIntentAccumulator,
  state: PlannerState,
  currentMoment: DesignedMoment,
): void => {
  const transition = currentMoment.transition;

  if (!transition || transition.type !== 'add_entity') {
    return;
  }

  const {entityId} = transition;

  upsertIntent(accumulator.additions, {
    entityId,
    elementIds: resolveElementIds(entityId, state, true),
    action: 'add',
    enter: AnimationType.ZoomIn,
  });
};

export interface AnimationPlannerInput {
  diff: MomentDiff;
  currentMoment: DesignedMoment;
  previousMoment?: DesignedMoment;
  currentEntityInstances: Map<string, string[]>;
  previousEntityInstances: Map<string, string[]>;
  fallbackCameraAction?: CameraActionType;
}

const intentsFromMap = (map: Map<string, ElementAnimationIntent>): ElementAnimationIntent[] =>
  [...map.values()];

export const buildSceneAnimationPlan = ({
  diff,
  currentMoment,
  previousMoment,
  currentEntityInstances,
  previousEntityInstances,
  fallbackCameraAction,
}: AnimationPlannerInput): SceneAnimationPlan => {
  const accumulator = createAccumulator();
  const state: PlannerState = {
    currentEntityInstances,
    previousEntityInstances,
  };

  const currentConnections = buildConnectionMap(currentMoment);
  const previousConnections = buildConnectionMap(previousMoment);
  const currentInteractions = buildInteractionMap(currentMoment);
  const previousInteractions = buildInteractionMap(previousMoment);

  for (const entityDiff of diff.entityDiffs) {
    switch (entityDiff.type) {
      case 'entity_added':
        upsertIntent(accumulator.additions, {
          entityId: entityDiff.entityId,
          elementIds: resolveElementIds(entityDiff.entityId, state, true),
          action: 'add',
          enter: AnimationType.ZoomIn,
        });
        break;
      case 'entity_removed':
        upsertIntent(accumulator.removals, {
          entityId: entityDiff.entityId,
          elementIds: resolveElementIds(entityDiff.entityId, state, false),
          action: 'remove',
          exit: AnimationType.ZoomOut,
          cleanup: true,
        });
        break;
      case 'entity_moved':
        upsertIntent(accumulator.moves, {
          entityId: entityDiff.entityId,
          elementIds: resolveElementIds(entityDiff.entityId, state, true),
          action: 'move',
        });
        break;
      case 'entity_count_changed':
        if (entityDiff.to > entityDiff.from) {
          upsertIntent(accumulator.additions, {
            entityId: entityDiff.entityId,
            elementIds: resolveElementIds(entityDiff.entityId, state, true),
            action: 'add',
            enter: AnimationType.ZoomIn,
          });
        } else {
          const previousIds = resolveElementIds(entityDiff.entityId, state, false);
          const currentIds = new Set(resolveElementIds(entityDiff.entityId, state, true));
          const removedInstanceIds = previousIds.filter((id) => !currentIds.has(id));

          upsertIntent(accumulator.removals, {
            entityId: entityDiff.entityId,
            elementIds: removedInstanceIds.length > 0 ? removedInstanceIds : previousIds,
            action: 'remove',
            exit: AnimationType.ZoomOut,
            cleanup: true,
          });
        }
        break;
      case 'entity_status_changed':
        // Status styling is handled by executeStatusEffects.
        break;
      case 'entity_importance_changed':
        if (entityDiff.to === 'primary') {
          upsertIntent(accumulator.additions, {
            entityId: entityDiff.entityId,
            elementIds: resolveElementIds(entityDiff.entityId, state, true),
            action: 'add',
            enter: AnimationType.ZoomIn,
          });
        }
        break;
      default:
        break;
    }
  }

  for (const connectionDiff of diff.connectionDiffs) {
    const connection =
      currentConnections.get(connectionDiff.connectionId) ??
      previousConnections.get(connectionDiff.connectionId);

    if (!connection) {
      continue;
    }

    upsertIntent(accumulator.connections, {
      entityId: connection.from,
      elementIds: resolveElementIds(connection.from, state, true),
      action: 'connect',
      connectionId: connectionDiff.connectionId,
    });

    upsertIntent(accumulator.connections, {
      entityId: connection.to,
      elementIds: resolveElementIds(connection.to, state, true),
      action: 'connect',
      connectionId: connectionDiff.connectionId,
    });
  }

  for (const interactionDiff of diff.interactionDiffs) {
    const interaction =
      currentInteractions.get(interactionDiff.interactionId) ??
      previousInteractions.get(interactionDiff.interactionId);

    if (!interaction) {
      continue;
    }

    switch (interactionDiff.type) {
      case 'interaction_added':
        upsertIntent(accumulator.interactions, {
          entityId: interaction.from,
          elementIds: resolveElementIds(interaction.from, state, true),
          action: 'interact',
          interactionId: interactionDiff.interactionId,
        });
        upsertIntent(accumulator.interactions, {
          entityId: interaction.to,
          elementIds: resolveElementIds(interaction.to, state, true),
          action: 'interact',
          interactionId: interactionDiff.interactionId,
        });
        break;
      case 'interaction_removed':
        upsertIntent(accumulator.interactions, {
          entityId: interaction.from,
          elementIds: resolveElementIds(interaction.from, state, true),
          action: 'interact',
          interactionId: interactionDiff.interactionId,
        });
        upsertIntent(accumulator.interactions, {
          entityId: interaction.to,
          elementIds: resolveElementIds(interaction.to, state, true),
          action: 'interact',
          interactionId: interactionDiff.interactionId,
        });
        break;
      case 'interaction_intensity_changed': {
        upsertIntent(accumulator.interactions, {
          entityId: interaction.from,
          elementIds: resolveElementIds(interaction.from, state, true),
          action: 'interact',
          interactionId: interactionDiff.interactionId,
        });

        upsertIntent(accumulator.interactions, {
          entityId: interaction.to,
          elementIds: resolveElementIds(interaction.to, state, true),
          action: 'interact',
          interactionId: interactionDiff.interactionId,
        });
        break;
      }
      default:
        break;
    }
  }

  applyInsertBetweenTransition(accumulator, state, currentMoment);
  applyAddEntityTransition(accumulator, state, currentMoment);

  const cameraAction =
    toCameraAction(currentMoment) ??
    (diff.cameraDiffs.length > 0 ? fallbackCameraAction : undefined);

  return {
    phaseOrder: PHASE_ORDER,
    removals: intentsFromMap(accumulator.removals),
    moves: intentsFromMap(accumulator.moves),
    additions: intentsFromMap(accumulator.additions),
    connections: intentsFromMap(accumulator.connections),
    interactions: intentsFromMap(accumulator.interactions),
    cameraAction,
  };
};
