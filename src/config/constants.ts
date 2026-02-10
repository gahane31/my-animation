export const VIDEO_LIMITS = {
  maxDurationSeconds: 90,
  maxSceneDurationSeconds: 6,
  maxVisualIdleSeconds: 6,
  firstMotionDeadlineSeconds: 1,
} as const;

export const LLM_DEFAULTS = {
  model: 'gpt-5.2',
  temperature: 0,
  seed: 7,
  maxParseRetries: 2,
} as const;

export const PIPELINE_DEFAULTS = {
  generatedScenePath: 'src/scenes/generatedPipelineScene.tsx',
  storyPlanPath: 'output/storyplan.llm.json',
  llmVideoSpecPath: 'output/videospec.llm.json',
  sceneName: 'generatedPipelineScene',
  minimumSceneDurationSeconds: 1,
} as const;

export const DIRECTOR_CAMERA_SEQUENCE = [
  'zoom_in',
  'focus',
  'pan_down',
  'pan_up',
  'wide',
  'zoom_out',
] as const;

export const DECIMAL_PRECISION = 2;
