import type {
  Camera,
  DesignedMoment,
} from '../schema/moment.schema.js';

export interface Pos {
  x: number;
  y: number;
}

export type EntityDiff =
  | {type: 'entity_added'; entityId: string}
  | {type: 'entity_removed'; entityId: string}
  | {type: 'entity_moved'; entityId: string; from: Pos; to: Pos}
  | {type: 'entity_count_changed'; entityId: string; from: number; to: number}
  | {type: 'entity_status_changed'; entityId: string; from?: string; to?: string}
  | {type: 'entity_importance_changed'; entityId: string; from?: string; to?: string};

export type ConnectionDiff =
  | {type: 'connection_added'; connectionId: string}
  | {type: 'connection_removed'; connectionId: string};

export type InteractionDiff =
  | {type: 'interaction_added'; interactionId: string}
  | {type: 'interaction_removed'; interactionId: string}
  | {
      type: 'interaction_intensity_changed';
      interactionId: string;
      from?: string;
      to?: string;
    };

export type CameraDiff = {
  type: 'camera_changed';
  from?: Camera | null;
  to?: Camera | null;
};

export interface MomentDiff {
  entityDiffs: EntityDiff[];
  connectionDiffs: ConnectionDiff[];
  interactionDiffs: InteractionDiff[];
  cameraDiffs: CameraDiff[];
}

export interface MomentTransition {
  previous: Pick<DesignedMoment, 'id' | 'start' | 'end'> | null;
  current: Pick<DesignedMoment, 'id' | 'start' | 'end'>;
  diff: MomentDiff;
}
