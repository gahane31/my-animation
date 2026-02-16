export const StyleTokens = {
  spacing: {
    base: 80,
  },

  sizes: {
    small: 60,
    medium: 90,
    large: 130,
  },

  stroke: {
    thin: 2,
    normal: 3,
    thick: 5,
  },

  colors: {
    background: '#0B0F14',
    primary: '#4F8CFF',
    secondary: '#8A94A6',
    text: '#E6EDF3',
    states: {
      normal: '#4F8CFF',
      active: '#22C55E',
      overloaded: '#EF4444',
      error: '#F97316',
      down: '#6B7280',
    },
    flow: '#60A5FA',
    connection: '#94A3B8',
  },

  opacity: {
    primary: 1,
    secondary: 0.6,
    dim: 0.35,
  },

  effects: {
    primaryGlow: true,
    glowColor: '#4F8CFF',
    glowBlur: 20,
  },

  connections: {
    thickness: 3,
    curve: true,
    arrowSize: 10,
  },

  flow: {
    particleSize: 6,
    speedLow: 0.6,
    speedMedium: 1,
    speedHigh: 1.6,
  },

  text: {
    fontFamily: 'JetBrains Mono',
    fontSizePrimary: 42,
    fontSizeSecondary: 28,
    fontWeight: 600,
  },
} as const;

export type EntityStatus = keyof typeof StyleTokens.colors.states;
