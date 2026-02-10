import {waitFor, type ThreadGenerator} from '@motion-canvas/core';
import type {RuntimeLogger} from './types.js';

export interface TimelineState {
  current: number;
}

export const createTimelineState = (initialTime = 0): TimelineState => ({
  current: initialTime,
});

export function* waitUntil(
  state: TimelineState,
  targetTime: number,
  logger?: RuntimeLogger,
): ThreadGenerator {
  const delta = targetTime - state.current;

  if (delta > 0) {
    yield* waitFor(delta);
    state.current = targetTime;
    return;
  }

  if (delta < 0) {
    logger?.warn('Timeline overrun detected', {
      current: state.current,
      targetTime,
      overrun: Math.abs(delta),
    });
  }

  state.current = Math.max(state.current, targetTime);
}

export const advanceTimeline = (state: TimelineState, elapsed: number): number => {
  const safeElapsed = Math.max(0, elapsed);
  state.current += safeElapsed;
  return state.current;
};
