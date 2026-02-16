import {StyleTokens, type EntityStatus} from '../config/styleTokens.js';
import type {
  Connection,
  DesignedEntity,
  Interaction,
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
): EntityVisualStyle => {
  const status = resolveStatus(entity);
  const statusColor = STATUS_COLOR_MAP[status];
  const size = StyleTokens.sizes.medium;

  return {
    size,
    opacity: StyleTokens.opacity.primary,
    color: status === 'normal' ? StyleTokens.colors.primary : statusColor,
    strokeWidth: StyleTokens.stroke.normal,
    strokeColor: status === 'normal' ? StyleTokens.colors.connection : statusColor,
    glow: true,
    glowColor: status === 'normal' ? StyleTokens.effects.glowColor : statusColor,
    glowBlur:
      status === 'overloaded' || status === 'error'
        ? Math.max(StyleTokens.effects.glowBlur * 0.85, 22)
        : Math.max(StyleTokens.effects.glowBlur * 0.65, 14),
    textColor: StyleTokens.colors.text,
    fontSize: StyleTokens.text.fontSizeSecondary,
    fontWeight: StyleTokens.text.fontWeight,
    status,
  };
};

export const resolveConnectionStyle = (_connection: Connection): ConnectionVisualStyle => ({
  color: StyleTokens.colors.connection,
  width: StyleTokens.connections.thickness,
  curved: StyleTokens.connections.curve,
  arrowSize: StyleTokens.connections.arrowSize,
});

export const resolveFlowStyle = (interaction: Interaction): FlowVisualStyle => {
  let speed: number = StyleTokens.flow.speedMedium;
  let color: string = StyleTokens.colors.flow;
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
    color = '#34D399';
  }

  return {
    color,
    particleSize,
    speed,
  };
};
