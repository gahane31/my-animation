export const Templates = {
  HERO_FOCUS: {
    layout: 'center',
    cameraBias: 'strong_focus',
    primaryScaleBoost: 1.3,
  },

  ARCHITECTURE_FLOW: {
    layout: 'graph_horizontal',
    cameraBias: 'wide',
  },

  LAYERED_STACK: {
    layout: 'graph_vertical',
    cameraBias: 'medium',
  },

  COMPARISON_SPLIT: {
    layout: 'split',
    cameraBias: 'wide',
  },

  PROGRESSIVE_REVEAL: {
    layout: 'radial',
    cameraBias: 'focus_new',
  },
} as const;

export type TemplateId = keyof typeof Templates;

export type TemplateDefinition = (typeof Templates)[TemplateId];
export type TemplateLayoutMode = TemplateDefinition['layout'];
export type TemplateCameraBias = TemplateDefinition['cameraBias'];

export const TEMPLATE_IDS = [
  'HERO_FOCUS',
  'ARCHITECTURE_FLOW',
  'LAYERED_STACK',
  'COMPARISON_SPLIT',
  'PROGRESSIVE_REVEAL',
] as const satisfies readonly TemplateId[];

export const getTemplateDefinition = (templateId: TemplateId): TemplateDefinition =>
  Templates[templateId];
