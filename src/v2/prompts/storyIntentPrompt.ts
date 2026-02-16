import type {StoryIntent} from '../schema/storyIntent.schema.js';
import {
  summarizeComponentCatalog,
} from '../catalog/index.js';

export interface StoryIntentPromptInput {
  topic: string;
  audience: string;
  duration: number;
}

export const buildStoryIntentPrompt = (input: StoryIntentPromptInput): string => {
  const components = summarizeComponentCatalog();

  return `You are a story planner for static system-design reels.

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
2. Output StoryIntent only. Do NOT output coordinates, pixel layout, camera moves, or animation instructions.
3. Focus on teaching clarity and narrative progression using static snapshots.
4. First scene starts at 0. Scenes must not overlap.
5. Scene timings should cover the full video duration without gaps whenever possible.
6. Every scene duration must be between 3 and 8 seconds.
7. Every scene narration must be a complete sentence (never split one sentence across scenes).
8. Scene narration must describe what is visible in that exact scene.
9. Every scene must specify a complexity budget:
   - max_visible_components: 2 to 8
   - max_visible_connections: 1 to 10
   - max_simultaneous_motions: exactly 1
10. required_component_types order is critical:
    - Order from source to sink (top-to-bottom vertical flow).
    - Example: [users_cluster, load_balancer, server, database].
11. focus_component_types must be a subset of required_component_types.
12. transition_goal must describe structural change only:
    - Examples: "add load_balancer between users_cluster and server", "scale server from 1 to 3".
13. Keep progression mostly additive. Avoid removals unless explicitly required by the teaching goal.
14. Prefer one structural change per scene.
15. Tone should usually be "educational" unless topic explicitly needs urgency/drama.

Available components:
${components}

Quality target:
- Prioritize clarity over cinematic language.
- Each scene should be understandable as a standalone architecture card.
- Keep component progression consistent so downstream topology stays stable.

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
