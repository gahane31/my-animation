export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1920;
export const REEL_SAFE_OFFSET_Y = -100;
export const REEL_SAFE_MIN_Y = -700;
export const REEL_SAFE_MAX_Y = 600;

export interface PixelPosition {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const normalizePosition = (
  x: number,
  y: number,
  width = CANVAS_WIDTH,
  height = CANVAS_HEIGHT,
): PixelPosition => ({
  x: (x - 50) * (width / 100),
  y: clamp((y - 50) * (height / 100) + REEL_SAFE_OFFSET_Y, REEL_SAFE_MIN_Y, REEL_SAFE_MAX_Y),
});

export const hasPositionDelta = (
  current: PixelPosition,
  next: PixelPosition,
  threshold = 0.5,
): boolean => {
  const dx = Math.abs(current.x - next.x);
  const dy = Math.abs(current.y - next.y);

  return dx > threshold || dy > threshold;
};
