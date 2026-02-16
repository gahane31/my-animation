import type {StoryIntent} from '../schema/storyIntent.schema.js';
import {
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
11. focus_component_types must be a subset of required_component_types.
12. transition_goal must describe structural change only:
    - Examples: "add load_balancer between users_cluster and server", "scale server from 1 to 3".
13. Keep progression mostly additive. Avoid removals unless explicitly required by the teaching goal.
14. Prefer one structural change per scene.
14.1 Do not produce long stretches of identical scenes:
    - consecutive scenes should usually differ by at least one component, one connection pattern, or one status change.
14.2 transition_goal must be topology-actionable for every scene after the first:
    - use verbs like add, insert_between, scale, reroute, change_status.
14.3 Include at least one scale or load-distribution step in the full story when topic is about scaling.
15. Tone should usually be "educational" unless topic explicitly needs urgency/drama.
16. Keep story feasible for current system constraints:
    - max 8 visible component types in one scene
    - max 12 visible connections in one scene
    - no custom components outside catalog
17. Story should anticipate deterministic topology conversion:
    - mention additions, insertions, scale-outs, and status changes clearly in narration/transition_goal.
17.1 Mention traffic behavior explicitly in narration when relevant:
    - examples: "requests fan out", "traffic bursts", "cache replies quickly", "queue buffers writes".
18. Use only supported archetypes:
    hook, setup, problem, escalation, solution, expansion, climax, recap, ending
19. Tone must be one of:
    fast, educational, dramatic

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

Runtime directive options downstream (awareness only, do not output here):
- camera.mode: auto | follow_action | wide_recap | steady
- camera.zoom: tight | medium | wide
- camera.active_zone: upper_third | center
- camera.reserve_bottom_percent: 0..40
- visual.theme: default | neon
- visual.background_texture: none | grid
- visual.glow_strength: soft | strong
- motion.entry_style: drop_bounce | elastic_pop
- motion.pacing: balanced | reel_fast
- flow.renderer: dashed | packets | hybrid

Quality target:
- Prioritize clarity over cinematic language.
- Each scene should be understandable as a standalone architecture card.
- Keep component progression consistent so downstream topology stays stable.
- Keep narration grounded in supported primitives so topology generation is lossless.

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
