# `generateVideo.ts` Deep-Dive

This document explains exactly what happens when `generateVideo(...)` runs, including:

- what starts first
- which data is used at each stage
- what output each stage produces
- what becomes the next stage's input
- all major static rule/config data used
- how final scene code is generated
- how animations are applied at runtime

---

## 1. Entry Points

You usually trigger the pipeline through:

- CLI: `src/cli/generate.ts`
- Programmatic helper: `src/index.ts`

CLI parses:

- `--topic`
- `--audience`
- `--duration`
- `--model`
- `--output`
- `--story-plan-output`
- `--llm-spec-output`

Then it calls:

```ts
generateVideo({...})
```

Primary orchestrator:

- `src/pipeline/generateVideo.ts`

---

## 2. High-Level Data Flow

Current architecture:

`GenerateVideoInput`
-> Story Planner LLM (`StoryPlan`)
-> Video Director LLM (`VideoSpec`)
-> Deterministic Director Refinement (`VideoSpec`, corrected)
-> Motion Canvas Agent (`MotionRenderSpec`)
-> Renderer (writes `generatedPipelineScene.tsx`)

So there are two LLM generations:

1. Story structure generation
2. Visual scene generation

---

## 3. Exact Step-by-Step Execution in `generateVideo.ts`

File: `src/pipeline/generateVideo.ts`

### Step 0: Logger + dependency setup

`generateVideo` initializes components using dependency injection.

If no overrides are passed, it builds:

- logger: `createConsoleLogger('generateVideo')`
- llm client: `createOpenAIClient({logger})`
- structured output helper: `createStructuredOutputHelper({llmClient, logger})`
- story planner agent: `createStoryPlannerAgent(...)`
- video director agent (LLM prompt agent): `createScriptAgent(...)`
- deterministic director agent: `createDirectorAgent(...)`
- motion canvas agent: `createMotionCanvasAgent(...)`
- renderer: `createRenderer(...)`

### Step 1: Story planning (LLM call #1)

Input:

- `topic`
- `audience`
- `duration`
- model/temperature/seed options

Component:

- `storyPlannerAgent.generate(...)`

Internally:

- prompt built via `src/prompts/storyPlannerPrompt.ts`
- strict response format schema enforced using `storyPlanResponseFormat`
- parsed/validated with `StoryPlanSchema` in `src/schema/storyPlannerSchema.ts`

Output:

- `storyPlan` object

### Step 2: Persist story plan artifact

Component:

- `writeJsonArtifact(...)` from `src/pipeline/artifacts.ts`

Default path:

- `output/storyplan.llm.json`

### Step 3: Visual direction (LLM call #2)

Input:

- `storyPlan` (not raw topic)

Component:

- `videoDirectorAgent.generate({storyPlan}, ...)` (this is `scriptAgent`)

Internally:

- prompt built via `src/llm/prompts.ts`
- strict JSON schema response format: `videoSpecResponseFormat`
- parse + validate with `videoSpecSchema`

Output:

- `llmVideoSpec` (`VideoSpec`)

### Step 4: Persist raw VideoSpec artifact

Component:

- `writeJsonArtifact(...)`

Default path:

- `output/videospec.llm.json`

### Step 5: Deterministic director refinement

Input:

- `llmVideoSpec`
- `storyPlan`

Component:

- `directorAgent.refine(llmVideoSpec, {storyPlan})`

This stage enforces deterministic cinematic/layout constraints and returns a corrected `VideoSpec`.

Output:

- `refinedVideoSpec`

### Step 6: Convert to render spec

Input:

- `refinedVideoSpec`

Component:

- `motionCanvasAgent.buildRenderSpec(...)`

Output:

- `renderSpec` (`MotionRenderSpec`)

### Step 7: Generate Motion Canvas scene source code

Input:

- `renderSpec`

Component:

- `renderer.render(renderSpec, {outputPath})`

Default output path:

- `src/scenes/generatedPipelineScene.tsx`

Output:

- absolute `outputPath` string returned by `generateVideo(...)`

---

## 4. Stage-by-Stage Input/Output Table

| Stage | Component | Input | Output | Next Consumer |
|---|---|---|---|---|
| 1 | Story Planner Agent | topic, audience, duration | `StoryPlan` | Video Director Agent |
| 2 | Artifact Writer | `StoryPlan` | `output/storyplan.llm.json` | Human/debug |
| 3 | Video Director Agent | `StoryPlan` | raw `VideoSpec` | Deterministic Director |
| 4 | Artifact Writer | raw `VideoSpec` | `output/videospec.llm.json` | Human/debug |
| 5 | Deterministic Director Agent | raw `VideoSpec` + `StoryPlan` | refined `VideoSpec` | Motion Canvas Agent |
| 6 | Motion Canvas Agent | refined `VideoSpec` | `MotionRenderSpec` | Renderer |
| 7 | Renderer | `MotionRenderSpec` | `generatedPipelineScene.tsx` | Motion Canvas runtime |

---

## 5. LLM Layer: Request, Parsing, Validation, Retry

## `src/llm/openaiClient.ts`

Responsibilities:

- Loads `.env` via `dotenv`
- Reads `OPENAI_API_KEY`
- Calls `client.responses.create(...)`
- Uses `text.format` with strict JSON schema when provided

Defaults (from `src/config/constants.ts`):

- model: `gpt-5.2`
- temperature: `0`
- seed default exists in config (`7`) but current OpenAI call body does not send `seed`

## `src/llm/structuredOutput.ts`

Responsibilities:

- parse raw model output as JSON
- repair common JSON-like issues (`undefined`, trailing commas, NaN/Infinity)
- validate using Zod schema
- retry only for:
  - parse errors
  - Zod validation errors
- retry strategy:
  - attempt 1: original prompt
  - attempt 2+: self-correction prompt with previous output + validation errors

Important behavior:

- non-parse/non-validation failures (for example network connection failures) are not retried by this helper
- max attempts = `LLM_DEFAULTS.maxParseRetries + 1` (currently `3`)

---

## 6. Schema Layer (Single Source of Truth Contracts)

## Story Plan schema

File: `src/schema/storyPlannerSchema.ts`

Validates:

- beat type set
- beat timing (`1.5s` to `6s`)
- recap duration `<= 4s`
- first beat starts at `0`
- no beat overlap
- `climax` and `ending` must exist
- plan duration covers final beat end

Also exports:

- `storyPlanResponseFormat` (`json_schema`, `strict: true`)

## VideoSpec schema

File: `src/schema/videoSpec.schema.ts`

Validates:

- scene duration > `0` and `<= maxSceneDurationSeconds`
- no scene overlap
- first motion constraints
- duplicate scene ids / duplicate element ids per scene
- visual change timing (`maxVisualIdleSeconds`)
- last scene end <= `duration`

Also exports:

- `videoSpecResponseFormat` (`json_schema`, `strict: true`)

---

## 7. Static Data Used Across Pipeline

## Global constants

File: `src/config/constants.ts`

- `VIDEO_LIMITS`
  - `maxDurationSeconds: 90`
  - `maxSceneDurationSeconds: 6`
  - `maxVisualIdleSeconds: 6`
  - `firstMotionDeadlineSeconds: 1`
- `LLM_DEFAULTS`
  - model/temperature/seed/retry count
- `PIPELINE_DEFAULTS`
  - generated scene path
  - artifact output paths
  - min scene duration helper

## Visual grammar enums

File: `src/schema/visualGrammar.ts`

- components: `users_cluster`, `server`, `load_balancer`, `database`, `cache`, `queue`, `cdn`, `worker`
- animations/camera actions: `zoom_in`, `zoom_out`, `pan_down`, `pan_up`, `focus`, `wide`

## Deterministic Director static tables

File: `src/agents/directorAgent.ts`

Major static rule maps include:

- component introduction order and prerequisites
- fixed zone positions for each component type
- hero center position
- max elements/new elements per beat type
- camera pattern per beat type
- hero priority per beat type
- climax split sets (core vs advanced components)

These are key to consistent, reel-friendly composition.

---

## 8. Deterministic Director (`directorAgent.ts`) Deep Behavior

This module is the main quality control stage after LLM output.

If `storyPlan` is provided, it uses StoryPlan-aware refinement.
If not, it falls back to legacy pacing split logic.

With story plan:

1. Build beat-bound scene candidates from LLM scenes.
2. Enforce required scene count per beat:
   - based on beat duration and pacing limits
   - climax forced to at least 2 scenes
3. Compose each scene with deterministic rules:
   - prune/allow elements by beat and architecture growth prerequisites
   - choose one hero element
   - limit total elements by beat type
   - assign zone-aware positions and centered hero
   - assign camera with anti-repetition checks
   - assign hero motion (enter/effects) by beat type
4. Ensure first scene has motion and starts at zero.
5. Validate final result through `videoSpecSchema.parse(...)`.

Result:

- cleaner scenes
- stable layout
- lower clutter
- beat-aligned pacing

---

## 9. Motion Conversion Stage (`motionCanvasAgent.ts`)

This stage is intentionally simple:

- clones/refactors refined `VideoSpec` into `MotionRenderSpec`
- preserves timing and scene/element definitions
- does not invent or reinterpret business logic

Think of it as type-level adaptation before code generation.

---

## 10. Renderer Code Generation (`motion/renderer.ts`)

Renderer does not render MP4 directly.
It generates executable Motion Canvas scene source code (`.tsx`).

`buildSceneSource(renderSpec)` produces a full scene module that:

- embeds `const renderSpec = {...}`
- imports runtime executors (`sceneExecutor`, `timeline`, etc.)
- creates caption text node
- initializes reel-safe view offset
- loops through scenes using absolute timeline logic
- validates each scene at runtime
- executes scene threads
- checks timeline mismatch at the end

Written to:

- default `src/scenes/generatedPipelineScene.tsx`

---

## 11. Runtime Execution Inside Generated Scene

When Motion Canvas plays the generated scene:

1. Creates caption ref and root view setup.
2. Initializes `timeline` and mutable `sceneState`.
3. For each scene:
   - check duration > 0
   - runtime warn checks (`validateSceneForRuntime`)
   - wait to scene start (`waitUntil`)
   - execute scene (`executeScene`)
   - advance timeline by scene duration
4. Warn if final timeline differs from expected duration.

---

## 12. Scene Runtime Engine Components

## `motion/sceneExecutor.ts`

Responsibilities:

- caption transition (fade out -> text update -> fade in)
- element lifecycle resolution
- camera plan creation
- per-element sequence execution
- skip unchanged elements
- repetition and density warnings

Execution model:

- parallel across elements + camera + caption (`all(...)`)
- sequential within each element (`enter -> effects -> exit`)

## `motion/lifecycle.ts`

Handles persistent node map:

- creates node on first appearance (`opacity(0)` + add to view)
- reuses existing node by id
- computes normalized target position
- animates reposition only if delta exists

## `motion/timeline.ts`

Absolute timeline helpers:

- `waitUntil(state, target)` waits if ahead, warns on overrun
- `advanceTimeline(state, elapsed)` moves forward

## `motion/cameraController.ts`

Builds camera transition plans:

- maps camera action -> scale/x/y targets
- supports focus target conversion to camera coordinates
- applies reel-safe centering for `wide`/`zoom_out`
- optional subtle drift for longer scenes
- warns on repeated camera action streaks

## `motion/positioning.ts`

Converts 0-100 normalized coordinates to reel pixels:

- canvas: `1080x1920`
- safe vertical offset `-100`
- y clamped to safe range

## `motion/components.ts`

Factory library for visual nodes:

- users cluster
- server
- load balancer
- database
- cache
- queue
- cdn
- worker

## `motion/animations.ts`

Reusable animation helpers:

- fade, drop, slide, scale-in, shake, pulse red, flow, highlight
- `runElementAnimation` maps enum animation types to concrete motion implementation
- per-animation default durations and easing configured here

---

## 13. What Exactly Is “Final Output”?

`generateVideo(...)` returns:

- path to generated scene TSX file (string)

By default:

- `src/scenes/generatedPipelineScene.tsx`

It also writes:

- `output/storyplan.llm.json`
- `output/videospec.llm.json`

The pipeline does not directly export MP4.
Video export is done by Motion Canvas runtime/studio render workflow.

---

## 14. How Final Video Is Actually Produced

1. Run `npm run generate` to regenerate `generatedPipelineScene.tsx`.
2. Run `npm run studio`.
3. Motion Canvas loads project scenes from `src/project.ts`.
4. Render/export from Motion Canvas UI.

Important current project wiring:

- `src/project.ts` currently imports `src/scenes/scallingStory.tsx`, not `generatedPipelineScene.tsx`.
- If you want generated pipeline output to be the active studio scene, update `src/project.ts` scene import/list accordingly.

---

## 15. All Major Components Responsible for Final Generated Code

- CLI/entry:
  - `src/cli/generate.ts`
  - `src/index.ts`
- Orchestration:
  - `src/pipeline/generateVideo.ts`
  - `src/pipeline/logger.ts`
  - `src/pipeline/artifacts.ts`
- LLM and parsing:
  - `src/llm/openaiClient.ts`
  - `src/llm/structuredOutput.ts`
  - `src/prompts/storyPlannerPrompt.ts`
  - `src/llm/prompts.ts`
- Schemas/contracts:
  - `src/schema/storyPlannerSchema.ts`
  - `src/schema/videoSpec.schema.ts`
  - `src/schema/visualGrammar.ts`
- Agents:
  - `src/agents/storyPlannerAgent.ts`
  - `src/agents/scriptAgent.ts` (video director LLM)
  - `src/agents/directorAgent.ts` (deterministic cinematic refinement)
  - `src/agents/motionCanvasAgent.ts`
- Code generation and runtime engine:
  - `src/motion/renderer.ts`
  - `src/motion/sceneExecutor.ts`
  - `src/motion/lifecycle.ts`
  - `src/motion/timeline.ts`
  - `src/motion/cameraController.ts`
  - `src/motion/positioning.ts`
  - `src/motion/components.ts`
  - `src/motion/animations.ts`
  - `src/motion/types.ts`

---

## 16. Quick Debug Checklist

If output quality is off:

- check `output/storyplan.llm.json` for beat quality first
- check `output/videospec.llm.json` for scene timing and structure
- inspect deterministic refinement effects in `src/agents/directorAgent.ts`
- inspect generated runtime scene `src/scenes/generatedPipelineScene.tsx`
- confirm active studio scene in `src/project.ts`

