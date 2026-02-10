import type {Node} from '@motion-canvas/2d';
import {all, easeInOutCubic, type ThreadGenerator} from '@motion-canvas/core';
import {createComponentNode} from './components.js';
import {hasPositionDelta, normalizePosition, type PixelPosition} from './positioning.js';
import type {ElementState, MotionElementSpec, RuntimeLogger} from './types.js';

const DEFAULT_REPOSITION_DURATION = 0.5;

export interface LifecycleContext {
  view: Node;
  elements: Map<string, ElementState>;
  sceneIndex: number;
  logger: RuntimeLogger;
}

export interface LifecycleResult {
  elementState: ElementState;
  node: Node;
  isNew: boolean;
  hasPositionChange: boolean;
  targetPosition: PixelPosition;
  repositionThread?: ThreadGenerator;
  repositionDuration: number;
}

const createRepositionThread = (
  node: Node,
  targetPosition: PixelPosition,
  duration: number,
): ThreadGenerator =>
  all(
    node.x(targetPosition.x, duration, easeInOutCubic),
    node.y(targetPosition.y, duration, easeInOutCubic),
  );

export const ensureElementLifecycle = (
  context: LifecycleContext,
  element: MotionElementSpec,
): LifecycleResult => {
  const targetPosition = normalizePosition(element.position.x, element.position.y);
  const existing = context.elements.get(element.id);

  if (!existing) {
    const node = createComponentNode(element.type, {
      id: element.id,
      position: targetPosition,
    });

    node.opacity(0);
    context.view.add(node);

    const elementState: ElementState = {
      id: element.id,
      node,
      position: targetPosition,
      unchangedStreak: 0,
      lastSeenSceneIndex: context.sceneIndex,
    };
    context.elements.set(element.id, elementState);

    context.logger.info(`Elements added: ${element.id}`);

    return {
      elementState,
      node,
      isNew: true,
      hasPositionChange: true,
      targetPosition,
      repositionDuration: 0,
    };
  }

  const requiresMove = hasPositionDelta(existing.position, targetPosition);

  existing.lastSeenSceneIndex = context.sceneIndex;

  if (!requiresMove) {
    return {
      elementState: existing,
      node: existing.node,
      isNew: false,
      hasPositionChange: false,
      targetPosition,
      repositionDuration: 0,
    };
  }

  existing.position = targetPosition;

  return {
    elementState: existing,
    node: existing.node,
    isNew: false,
    hasPositionChange: true,
    targetPosition,
    repositionThread: createRepositionThread(
      existing.node,
      targetPosition,
      DEFAULT_REPOSITION_DURATION,
    ),
    repositionDuration: DEFAULT_REPOSITION_DURATION,
  };
};

// TODO: Auto-clean nodes that have been inactive for N scenes.
