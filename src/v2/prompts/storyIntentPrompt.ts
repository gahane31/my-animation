import type {StoryIntent} from '../schema/storyIntent.schema.js';
import {
  summarizeLucideIconCatalog,
  summarizeActionCatalog,
  summarizeComponentCatalog,
  summarizeConnectionCatalog,
  summarizeMinimalComponentKit,
  summarizeMotionCatalog,
} from '../catalog/index.js';

export interface StoryIntentPromptInput {
  topic: string;
  audience: string;
  duration: number;
}

export const buildStoryIntentPrompt = (input: StoryIntentPromptInput): string => {
  const components = summarizeComponentCatalog();
  const connections = summarizeConnectionCatalog();
  const actions = summarizeActionCatalog();
  const motions = summarizeMotionCatalog();
  const minimalKit = summarizeMinimalComponentKit();
  const icons = summarizeLucideIconCatalog();

  return `You are a story planner for motion-ready system-design reels.

Task:
Create StoryIntent for a vertical short-form video.

Input topic:
${input.topic}

Target audience:
${input.audience}

Target duration:
${input.duration} seconds

Hard constraints:
1. You MUST use only available catalog primitives.
2. Output StoryIntent only. Do NOT output coordinates, pixel layout, topology ids, camera moves, or animation instructions.
3. Focus on teaching clarity and narrative progression with clear visual deltas between scenes.
4. First scene starts at 0. Scenes must not overlap.
5. Scene timings should cover the full video duration without gaps whenever possible.
6. Every scene duration must be between 3 and 8 seconds.
7. Every scene narration must be a complete sentence (never split one sentence across scenes).
8. Scene narration must describe what is visible in that exact scene.
9. Every scene must specify a complexity budget:
   - max_visible_components: 1 to 8
   - max_visible_connections: 0 to 12
   - max_simultaneous_motions: exactly 1
10. required_component_types order is critical:
    - Order from source to sink (top-to-bottom vertical flow).
    - Example: [users_cluster, load_balancer, server, database].
11. icon_hints is required and must cover every required component in the scene:
    - For each required component type, provide one icon_hints item with:
      component_type + icon.
    - icon can use any valid Lucide icon token in kebab-case (example: server, database, shield-check).
    - Prefer clean line icons; avoid container-style tokens like square-*, layout-*, panel-*.
    - Do NOT use non-Lucide systems (material-symbols, FontAwesome, emoji, SVG strings).
    - If unsure, set icon to null.
12. focus_component_types must be a subset of required_component_types.
13. transition_goal must describe structural change only:
    - Examples: "add load_balancer between users_cluster and server", "scale server from 1 to 3".
14. Keep progression mostly additive. Avoid removals unless explicitly required by the teaching goal.
15. Prefer one structural change per scene.
15.1 Do not produce long stretches of identical scenes:
    - consecutive scenes should usually differ by at least one component, one connection pattern, or one status change.
15.2 transition_goal must be topology-actionable for every scene after the first:
    - use verbs like add, insert_between, scale, reroute, change_status.
15.3 Include at least one scale or load-distribution step in the full story when topic is about scaling.
16. Tone should usually be "educational" unless topic explicitly needs urgency/drama.
17. Keep story feasible for current system constraints:
    - max 8 visible component types in one scene
    - max 12 visible connections in one scene
    - no custom components outside catalog
18. Story should anticipate deterministic topology conversion:
    - mention additions, insertions, scale-outs, and status changes clearly in narration/transition_goal.
18.1 Mention traffic behavior explicitly in narration when relevant:
    - examples: "requests fan out", "traffic bursts", "cache replies quickly", "queue buffers writes".
19. Use only supported archetypes:
    hook, setup, problem, escalation, solution, expansion, climax, recap, ending
20. Tone must be one of:
    fast, educational, dramatic
21. Avoid prompt anchoring patterns:
    - Do not always default to the same chain (users -> lb -> server x3 -> cache -> queue -> worker -> db).
    - Choose topic-appropriate primitives; vary architecture while staying deterministic.
22. Cinematic but deterministic storytelling:
    - Build an obvious tension arc: baseline -> stress/failure -> mitigation -> scale confidence.
    - narration should feel punchy and visual, but still map directly to supported components/actions.
23. Visual style expectation for downstream topology:
    - Prefer clean technical diagram language over neon/glow language.
    - Avoid instructions that require free-form artistic effects outside catalog/directives.

Available components:
${components}

Recommended minimal kit for fast interview-style reels:
${minimalKit}

Available connection vocabulary (for story wording):
${connections}

Available action vocabulary (for story wording):
${actions}

Available motion/directive vocabulary in runtime (awareness only, do not output here):
${motions}

Lucide icon guidance:
${icons}

Runtime directive options downstream (awareness only, do not output here):
- camera.mode: auto | follow_action | wide_recap | steady
- camera.zoom: tight | medium | wide
- camera.active_zone: upper_third | center
- camera.reserve_bottom_percent: 0..40
- visual.theme: default | neon
- visual.background_texture: none | grid
- visual.glow_strength: soft | strong
- motion.entry_style: draw_in | drop_bounce | elastic_pop
- motion.pacing: balanced | reel_fast
- flow.renderer: dashed | packets | hybrid

Renderer behavior reference (awareness):
- draw_in = element/connection trace-like reveal (best for technical diagrams).
- drop_bounce = punchy insert effect.
- dashed/hybrid flow renderers = visible directional traffic movement.

Quality target:
- Prioritize clarity with cinematic pacing language.
- Each scene should be understandable as a standalone architecture card.
- Keep component progression consistent so downstream topology stays stable.
- Keep narration grounded in supported primitives so topology generation is lossless.
- Keep scene beats varied; avoid repeating the same topology pattern unless the topic explicitly requires it.

Output format:
Return strict JSON that matches StoryIntent schema with fields:
- duration
- audience
- tone ("fast" | "educational" | "dramatic")
- scenes[]
  - id
  - start
  - end
  - archetype
  - narrative_goal
  - narration
  - required_component_types
  - icon_hints[]
    - component_type
    - icon
  - focus_component_types
  - transition_goal
  - complexity_budget:
    - max_visible_components
    - max_visible_connections
    - max_simultaneous_motions

Return only JSON.`;
};

export const summarizeStoryIntentForPrompt = (storyIntent: StoryIntent): string =>
  JSON.stringify(storyIntent, null, 2);
