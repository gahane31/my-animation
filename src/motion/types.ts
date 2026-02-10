import type {Node, Txt} from '@motion-canvas/2d';
import type {AnimationType, CameraActionType, ComponentType} from '../schema/visualGrammar.js';
import type {PixelPosition} from './positioning.js';

export interface MotionElementSpec {
  id: string;
  type: ComponentType;
  position: {x: number; y: number};
  enter?: AnimationType;
  exit?: AnimationType;
  effects?: AnimationType[];
}

export interface MotionSceneSpec {
  id: string;
  start: number;
  end: number;
  narration: string;
  title?: string;
  camera?: CameraActionType;
  elements: MotionElementSpec[];
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
  node: Node;
  position: PixelPosition;
  unchangedStreak: number;
  lastSeenSceneIndex: number;
}

export interface CameraState {
  x: number;
  y: number;
  scale: number;
  lastAction?: CameraActionType;
  actionStreak: number;
}

export interface SceneState {
  caption: Txt;
  elements: Map<string, ElementState>;
  camera: CameraState;
  sceneIndex: number;
  logger: RuntimeLogger;
}

export interface SceneExecutionResult {
  consumedTime: number;
  addedElementIds: string[];
}
