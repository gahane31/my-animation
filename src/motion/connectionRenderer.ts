import {Line} from '@motion-canvas/2d';
import type {ConnectionVisualStyle} from '../design/styleResolver.js';
import type {PixelPosition} from './positioning.js';

type LinePoint = [number, number];
type LinePoints = LinePoint[];

export interface ConnectionAnchor {
  position: PixelPosition;
  halfWidth: number;
  halfHeight: number;
}

const toPoint = (position: PixelPosition): LinePoint => [position.x, position.y];

const routeConnectionPoints = (
  from: ConnectionAnchor,
  to: ConnectionAnchor,
  laneOffset = 0,
): LinePoints => {
  const deltaXRaw = to.position.x - from.position.x;
  const deltaYRaw = to.position.y - from.position.y;
  const isVerticalRoute = Math.abs(deltaYRaw) >= Math.abs(deltaXRaw);

  if (isVerticalRoute) {
    const direction = to.position.y >= from.position.y ? 1 : -1;
    const start: PixelPosition = {
      x: from.position.x,
      y: from.position.y + direction * from.halfHeight,
    };
    const end: PixelPosition = {
      x: to.position.x,
      y: to.position.y - direction * to.halfHeight,
    };
    const deltaX = end.x - start.x;

    if (laneOffset === 0) {
      return [toPoint(start), toPoint(end)];
    }

    if (Math.abs(deltaX) <= 24) {
      const laneX = start.x + laneOffset;
      const midY = (start.y + end.y) / 2;
      return [toPoint(start), [laneX, midY], toPoint(end)];
    }

    const turnY = (start.y + end.y) / 2;
    return [toPoint(start), [start.x, turnY], [end.x, turnY], toPoint(end)];
  }

  const direction = to.position.x >= from.position.x ? 1 : -1;
  const start: PixelPosition = {
    x: from.position.x + direction * from.halfWidth,
    y: from.position.y,
  };
  const end: PixelPosition = {
    x: to.position.x - direction * to.halfWidth,
    y: to.position.y,
  };
  const deltaY = end.y - start.y;

  if (laneOffset === 0 && Math.abs(deltaY) <= 24) {
    return [toPoint(start), toPoint(end)];
  }

  if (Math.abs(deltaY) <= 24) {
    const midX = (start.x + end.x) / 2;
    const laneY = start.y + laneOffset;
    return [toPoint(start), [midX, laneY], toPoint(end)];
  }

  const turnX = (start.x + end.x) / 2;
  return [toPoint(start), [turnX, start.y], [turnX, end.y], toPoint(end)];
};

export const createConnection = (
  from: ConnectionAnchor,
  to: ConnectionAnchor,
  style: ConnectionVisualStyle,
  bidirectional = false,
  laneOffset = 0,
): Line =>
  new Line({
    points: routeConnectionPoints(from, to, laneOffset),
    stroke: style.color,
    lineWidth: style.width,
    startArrow: bidirectional,
    endArrow: true,
    arrowSize: style.arrowSize,
    opacity: 0.9,
    zIndex: -5,
  });

export const updateConnection = (
  line: Line,
  from: ConnectionAnchor,
  to: ConnectionAnchor,
  style: ConnectionVisualStyle,
  bidirectional = false,
  laneOffset = 0,
): void => {
  line.points(routeConnectionPoints(from, to, laneOffset));
  line.stroke(style.color);
  line.lineWidth(style.width);
  line.startArrow(bidirectional);
  line.endArrow(true);
  line.arrowSize(style.arrowSize);
  line.opacity(0.9);
  line.zIndex(-5);
};
