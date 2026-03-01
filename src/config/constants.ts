export const VIDEO_LIMITS = {
  maxDurationSeconds: 90,
  maxSceneDurationSeconds: 8,
  maxStructuralIdleSeconds: 4,
  // Backward-compatible alias for legacy modules.
  maxVisualIdleSeconds: 4,
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
  momentsPath: 'output/moments.llm.json',
  momentsDebugPath: 'output/moments.debug.json',
  scenesIncrementalPath: 'output/scenes.incremental.json',
  momentsAfterLayoutPath: 'output/moments.afterLayout.json',
  renderSpecDebugPath: 'output/renderspec.debug.json',
  // Backward compatibility for older pipeline outputs.
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
