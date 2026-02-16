import {StyleTokens, type EntityStatus} from '../config/styleTokens.js';
import type {
  Connection,
  DesignedEntity,
  Interaction,
  SceneDirectives,
} from '../schema/moment.schema.js';
import type {HierarchyPlan} from './hierarchyPlanner.js';

export interface EntityVisualStyle {
  size: number;
  opacity: number;
  color: string;
  strokeWidth: number;
  strokeColor: string;
  glow: boolean;
  glowColor: string;
  glowBlur: number;
  textColor: string;
  fontSize: number;
  fontWeight: number;
  status: EntityStatus;
}

export interface ConnectionVisualStyle {
  color: string;
  width: number;
  curved: boolean;
  arrowSize: number;
}

export interface FlowVisualStyle {
  color: string;
  particleSize: number;
  speed: number;
}

type VisualDirectives = SceneDirectives['visual'] | undefined;

const DEFAULT_THEME_COLORS = {
  primary: StyleTokens.colors.primary,
  connection: StyleTokens.colors.connection,
  flow: StyleTokens.colors.flow,
  glow: StyleTokens.effects.glowColor,
} as const;

const CLASSIC_THEME_COLORS = {
  primary: '#345F9F',
  connection: '#8AA4C8',
  flow: '#60A5FA',
  glow: '#93C5FD',
} as const;

const resolveThemeColors = (visual: VisualDirectives) =>
  (visual?.theme ?? 'neon') === 'default'
    ? CLASSIC_THEME_COLORS
    : DEFAULT_THEME_COLORS;

const resolveGlowMultiplier = (visual: VisualDirectives): number =>
  (visual?.glow_strength ?? 'strong') === 'soft' ? 0.52 : 1;

const resolveStatus = (entity: DesignedEntity): EntityStatus =>
  (entity.status ?? 'normal') as EntityStatus;

const STATUS_COLOR_MAP: Record<EntityStatus, string> = {
  normal: StyleTokens.colors.states.normal,
  active: StyleTokens.colors.states.active,
  overloaded: StyleTokens.colors.states.overloaded,
  error: StyleTokens.colors.states.error,
  down: StyleTokens.colors.states.down,
};

export const resolveEntityStyle = (
  entity: DesignedEntity,
  _hierarchy: HierarchyPlan,
  visual?: VisualDirectives,
): EntityVisualStyle => {
  const status = resolveStatus(entity);
  const statusColor = STATUS_COLOR_MAP[status];
  const themeColors = resolveThemeColors(visual);
  const glowMultiplier = resolveGlowMultiplier(visual);
  const size = StyleTokens.sizes.medium;
  const baseGlowBlur =
    status === 'overloaded' || status === 'error'
      ? Math.max(StyleTokens.effects.glowBlur * 0.85, 22)
      : Math.max(StyleTokens.effects.glowBlur * 0.65, 14);

  return {
    size,
    opacity: StyleTokens.opacity.primary,
    color: status === 'normal' ? themeColors.primary : statusColor,
    strokeWidth: StyleTokens.stroke.normal,
    strokeColor: status === 'normal' ? themeColors.connection : statusColor,
    glow: true,
    glowColor: status === 'normal' ? themeColors.glow : statusColor,
    glowBlur: Math.max(8, baseGlowBlur * glowMultiplier),
    textColor: StyleTokens.colors.text,
    fontSize: StyleTokens.text.fontSizeSecondary,
    fontWeight: StyleTokens.text.fontWeight,
    status,
  };
};

export const resolveConnectionStyle = (
  _connection: Connection,
  visual?: VisualDirectives,
): ConnectionVisualStyle => {
  const themeColors = resolveThemeColors(visual);
  const glowMultiplier = resolveGlowMultiplier(visual);

  return {
    color: themeColors.connection,
    width: Math.max(2, StyleTokens.connections.thickness * (0.85 + glowMultiplier * 0.15)),
    curved: StyleTokens.connections.curve,
    arrowSize: StyleTokens.connections.arrowSize,
  };
};

export const resolveFlowStyle = (
  interaction: Interaction,
  visual?: VisualDirectives,
): FlowVisualStyle => {
  let speed: number = StyleTokens.flow.speedMedium;
  const themeColors = resolveThemeColors(visual);
  const glowMultiplier = resolveGlowMultiplier(visual);
  let color: string = themeColors.flow;
  let particleSize: number = StyleTokens.flow.particleSize;

  if (interaction.intensity === 'low') {
    speed = StyleTokens.flow.speedLow;
  }

  if (interaction.intensity === 'high') {
    speed = StyleTokens.flow.speedHigh;
  }

  if (interaction.type === 'burst') {
    speed *= 1.2;
    particleSize += 1.2;
    color = '#67E8F9';
  }

  if (interaction.type === 'broadcast') {
    speed *= 1.05;
    particleSize += 0.8;
    color = '#A5B4FC';
  }

  if (interaction.type === 'ping') {
    speed *= 1.28;
    particleSize += 0.6;
    color = (visual?.theme ?? 'neon') === 'default' ? '#4ADE80' : '#34D399';
  }

  return {
    color,
    particleSize: Math.max(3.5, particleSize * (0.85 + glowMultiplier * 0.2)),
    speed,
  };
};
