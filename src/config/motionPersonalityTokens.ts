export const MotionPersonalities = {
  CALM: {
    speedMultiplier: 1.2,
    stagger: 0.08,
    easing: 'cubic-bezier(0.2,0,0,1)',
    cameraSpeed: 0.8,
    zoomStrength: 0.9,
    scaleBoost: 1.0,
  },

  ENERGETIC: {
    speedMultiplier: 0.8,
    stagger: 0.04,
    easing: 'cubic-bezier(0.4,0,0.2,1)',
    cameraSpeed: 1.3,
    zoomStrength: 1.2,
    scaleBoost: 1.1,
  },

  PREMIUM: {
    speedMultiplier: 1.0,
    stagger: 0.06,
    easing: 'cubic-bezier(0.16,1,0.3,1)',
    cameraSpeed: 0.9,
    zoomStrength: 1.0,
    scaleBoost: 1.05,
  },
} as const;

export type MotionPersonalityId = keyof typeof MotionPersonalities;
export type MotionPersonalityToken = (typeof MotionPersonalities)[MotionPersonalityId];

export const DEFAULT_MOTION_PERSONALITY: MotionPersonalityId = 'PREMIUM';
