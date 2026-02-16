export const MotionTokens = {
  stagger: 0.06,
  primaryScale: 1.2,
  easing: {
    standard: 'cubic-bezier(0.2,0,0,1)',
    enter: 'cubic-bezier(0,0,0.2,1)',
    exit: 'cubic-bezier(0.4,0,1,1)',
  },
} as const;

export type MotionEasingToken = keyof typeof MotionTokens.easing;
