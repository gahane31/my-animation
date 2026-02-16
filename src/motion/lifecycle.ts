import type {Node} from '@motion-canvas/2d';
import {all, easeInOutCubic, type ThreadGenerator} from '@motion-canvas/core';
import {
  applyComponentLabel,
  applyComponentVisualStyle,
  createComponentNode,
} from './components.js';
import {StyleTokens} from '../config/styleTokens.js';
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

const resolveStyleSize = (element: MotionElementSpec): number =>
  element.visualStyle?.size ?? StyleTokens.sizes.medium;

export const ensureElementLifecycle = (
  context: LifecycleContext,
  element: MotionElementSpec,
): LifecycleResult => {
  const targetPosition = normalizePosition(element.position.x, element.position.y);
  const targetStyleSize = resolveStyleSize(element);
  const existing = context.elements.get(element.id);

  if (!existing) {
    const node = createComponentNode(element.type, {
      id: element.id,
      position: targetPosition,
      label: element.label,
      style: element.visualStyle,
    });

    node.opacity(0);
    context.view.add(node);

    const elementState: ElementState = {
      id: element.id,
      type: element.type,
      styleSize: targetStyleSize,
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

  const requiresNodeRebuild =
    existing.type !== element.type || Math.abs(existing.styleSize - targetStyleSize) > 0.5;

  if (requiresNodeRebuild) {
    const rebuiltNode = createComponentNode(element.type, {
      id: element.id,
      position: targetPosition,
      label: element.label,
      style: element.visualStyle,
    });

    rebuiltNode.opacity(existing.node.opacity());
    existing.node.remove();
    context.view.add(rebuiltNode);

    existing.node = rebuiltNode;
    existing.type = element.type;
    existing.styleSize = targetStyleSize;
    existing.position = targetPosition;
  }

  const requiresMove = hasPositionDelta(existing.position, targetPosition);
  if (element.visualStyle) {
    applyComponentVisualStyle(existing.node, element.visualStyle);
  }
  applyComponentLabel(existing.node, element.label);

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
