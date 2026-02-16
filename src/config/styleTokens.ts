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
    background: '#0A0A0A',
    primary: '#2A4B88',
    secondary: '#8AA4C8',
    text: '#E8F6FF',
    states: {
      normal: '#5B92FF',
      active: '#34D399',
      overloaded: '#EF4444',
      error: '#FB923C',
      down: '#64748B',
    },
    flow: '#22D3EE',
    connection: '#00FFFF',
  },

  opacity: {
    primary: 1,
    secondary: 0.6,
    dim: 0.35,
  },

  effects: {
    primaryGlow: true,
    glowColor: '#00FFFF',
    glowBlur: 26,
  },

  connections: {
    thickness: 4,
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
