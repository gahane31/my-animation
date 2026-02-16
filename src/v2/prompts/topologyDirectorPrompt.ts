import type {StoryIntent} from '../schema/storyIntent.schema.js';
import {
  summarizeComponentCatalog,
  summarizeConnectionCatalog,
} from '../catalog/index.js';

export interface TopologyDirectorPromptInput {
  storyIntent: StoryIntent;
}

export const buildTopologyDirectorPrompt = ({
  storyIntent,
}: TopologyDirectorPromptInput): string => {
  const storyIntentJson = JSON.stringify(storyIntent, null, 2);
  const components = summarizeComponentCatalog();
  const connections = summarizeConnectionCatalog();

  return `You are a technical video topology director.

Task:
Convert StoryIntent into a deterministic static SceneTopology plan.

StoryIntent (source of truth):
${storyIntentJson}

Rules:
1. Preserve scene timing and order exactly from StoryIntent.
2. Topology only. Do NOT output coordinates, pixels, geometry, camera movement text, or animation logic.
3. Narration in each topology scene must match StoryIntent scene narration exactly.
4. Build entities[] as concrete scene instances with stable ids across scenes.
5. Entity order in entities[] is critical and controls vertical layout:
   - Order from top to bottom (source to sink).
   - Example order: users -> load_balancer -> server -> database.
6. For scale-out, use one entity id with count > 1 (do NOT create separate ids like server1/server2/server3).
7. Use canonical stable ids for recurring entities whenever possible:
   - users, app, db, lb, cache, queue, worker, cdn
8. Use canonical labels only:
   - Users, Server, Load Balancer, Database, Cache, Queue, Worker, CDN.
9. Build connections[] using only allowed kinds/patterns.
10. Only output connections explicitly needed for scene clarity:
    - Do NOT invent inferred edges.
    - Do NOT output reverse duplicates for the same pair.
11. Connection direction should follow entity order:
    - Prefer from earlier entity to later entity in the scene entities[] array.
12. Respect required_component_types and transition_goal from StoryIntent:
    - Do not add unrelated entities.
    - Keep progression mostly additive unless StoryIntent explicitly teaches removal.
13. Set focus_entity_id to the key teaching component of that scene.
14. Copy complexity_budget from StoryIntent scene unchanged.
15. camera_intent should be "wide" for most scenes; use "focus" only when needed.
16. operations[] are metadata for change explanation:
    - Keep minimal.
    - Use [] when no clear structural change.
    - If provided, use only allowed operation types:
      add_entity, remove_entity, insert_between, reroute_connection,
      scale_entity, change_status, emphasize_entity, de_emphasize_entity, reveal_group.

Available components:
${components}

Available connection kinds:
${connections}

Output:
Return strict JSON with fields:
- duration
- scenes[]
  - id
  - start
  - end
  - archetype
  - narration
  - focus_entity_id
  - entities[]
    - id
    - type
    - label
    - count
    - importance
    - status
  - connections[]
    - id
    - from
    - to
    - kind
    - pattern
    - intensity
  - operations[]
  - complexity_budget
  - camera_intent ("wide" | "focus" | "introduce" | "steady")

Return only JSON.`;
};
