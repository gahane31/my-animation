import {AnimationType, CameraActionType} from '../../schema/visualGrammar.js';

export const TRANSITION_OPERATION_TYPES = [
  'add_entity',
  'remove_entity',
  'insert_between',
  'reroute_connection',
  'scale_entity',
  'change_status',
  'emphasize_entity',
  'de_emphasize_entity',
  'reveal_group',
] as const;

export type TransitionOperationType = (typeof TRANSITION_OPERATION_TYPES)[number];

export const CAMERA_MOTIONS = Object.values(CameraActionType);
export const ELEMENT_MOTIONS = Object.values(AnimationType);

export const summarizeMotionCatalog = (): string => {
  const camera = CAMERA_MOTIONS.map((motion) => `- ${motion}`).join('\n');
  const element = ELEMENT_MOTIONS.map((motion) => `- ${motion}`).join('\n');
  const transitions = TRANSITION_OPERATION_TYPES.map((operationType) => `- ${operationType}`).join('\n');

  return [
    'Camera motions:',
    camera,
    '',
    'Element motions:',
    element,
    '',
    'Transition operations:',
    transitions,
  ].join('\n');
};

