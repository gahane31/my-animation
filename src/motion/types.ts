import type {Line, Node, Txt} from '@motion-canvas/2d';
import type {MomentDiff} from '../design/diffTypes.js';
import type {
  HierarchyPlan,
  HierarchyTransition,
} from '../design/hierarchyPlanner.js';
import type {MotionPersonalityId} from '../config/motionPersonalityTokens.js';
import type {EntityVisualStyle} from '../design/styleResolver.js';
import type {
  Camera as MomentCamera,
  Connection,
  DesignedEntity,
  Interaction,
  SceneDirectives,
} from '../schema/moment.schema.js';
import type {SceneDiff} from '../pipeline/sceneDiff.js';
import type {AnimationType, CameraActionType, ComponentType} from '../schema/visualGrammar.js';
import type {PixelPosition} from './positioning.js';
import type {SceneAnimationTimings} from './timingPlanner.js';

export interface MotionElementSpec {
  id: string;
  type: ComponentType;
  position: {x: number; y: number};
  sourceEntityId?: string;
  label?: string;
  icon?: string;
  visualStyle?: EntityVisualStyle;
  enter?: AnimationType;
  exit?: AnimationType;
  effects?: AnimationType[];
}

export type SceneAnimationPhase =
  | 'removals'
  | 'moves'
  | 'additions'
  | 'connections'
  | 'interactions'
  | 'camera';

export interface ElementAnimationIntent {
  entityId: string;
  elementIds: string[];
  action?: 'remove' | 'move' | 'add' | 'connect' | 'interact';
  connectionId?: string;
  interactionId?: string;
  enter?: AnimationType;
  exit?: AnimationType;
  effects?: AnimationType[];
  cleanup?: boolean;
}

export interface SceneAnimationPlan {
  phaseOrder: SceneAnimationPhase[];
  removals: ElementAnimationIntent[];
  moves: ElementAnimationIntent[];
  additions: ElementAnimationIntent[];
  connections: ElementAnimationIntent[];
  interactions: ElementAnimationIntent[];
  cameraAction?: CameraActionType;
}

export interface MotionSceneSource {
  entities: DesignedEntity[];
  connections: Connection[];
  interactions: Interaction[];
  camera?: MomentCamera;
}

export type CameraMotionType =
  | 'focus_primary'
  | 'introduce_primary'
  | 'expand_architecture'
  | 'steady';

export interface SceneCameraPlan {
  targetId?: string;
  targetElementId?: string;
  targetPosition?: {
    x: number;
    y: number;
  };
  zoom: number;
  duration: number;
  easing: string;
  motionType: CameraMotionType;
}

export interface MotionSceneSpec {
  id: string;
  start: number;
  end: number;
  narration: string;
  staticScene?: boolean;
  motionPersonality?: MotionPersonalityId;
  title?: string;
  camera?: CameraActionType;
  elements: MotionElementSpec[];
  entities?: DesignedEntity[];
  connections?: Connection[];
  interactions?: Interaction[];
  sourceCamera?: MomentCamera;
  directives?: SceneDirectives;
  source?: MotionSceneSource;
  diff?: MomentDiff;
  sceneDiff?: SceneDiff;
  hierarchy?: HierarchyPlan;
  hierarchyTransition?: HierarchyTransition | null;
  plan?: SceneAnimationPlan;
  animationPlan?: SceneAnimationTimings;
  cameraPlan?: SceneCameraPlan | null;
}

export interface MotionRenderSpec {
  duration: number;
  scenes: MotionSceneSpec[];
}

export interface RuntimeLogger {
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
}

export interface ElementState {
  id: string;
  type: ComponentType;
  icon?: string;
  styleSize: number;
  node: Node;
  position: PixelPosition;
  unchangedStreak: number;
  lastSeenSceneIndex: number;
}

export interface CameraState {
  originX: number;
  originY: number;
  x: number;
  y: number;
  scale: number;
  lastAction?: CameraActionType;
  actionStreak: number;
}

export interface SceneState {
  caption: Txt;
  elements: Map<string, ElementState>;
  connections: Map<string, Line>;
  camera: CameraState;
  sceneIndex: number;
  lastExecutionDuration: number;
  logger: RuntimeLogger;
}

export interface SceneExecutionResult {
  consumedTime: number;
  addedElementIds: string[];
}
