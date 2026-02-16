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

export const resolveEntityStyle = (
  entity: DesignedEntity,
  _hierarchy: HierarchyPlan,
): EntityVisualStyle => {
  const status = resolveStatus(entity);
  const size = StyleTokens.sizes.medium;

  return {
    size,
    opacity: StyleTokens.opacity.primary,
    color: StyleTokens.colors.primary,
    strokeWidth: StyleTokens.stroke.normal,
    strokeColor: StyleTokens.colors.connection,
    glow: false,
    glowColor: StyleTokens.effects.glowColor,
    glowBlur: 0,
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

  if (interaction.intensity === 'low') {
    speed = StyleTokens.flow.speedLow;
  }

  if (interaction.intensity === 'high') {
    speed = StyleTokens.flow.speedHigh;
  }

  return {
    color: StyleTokens.colors.flow,
    particleSize: StyleTokens.flow.particleSize,
    speed,
  };
};
