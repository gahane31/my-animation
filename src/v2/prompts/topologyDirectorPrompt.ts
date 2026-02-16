import type {StoryIntent} from '../schema/storyIntent.schema.js';
import {
  CONNECTION_KINDS,
  FLOW_PATTERNS,
  summarizeActionCatalog,
  summarizeComponentCatalog,
  summarizeConnectionCatalog,
  summarizeMinimalComponentKit,
  summarizeMotionCatalog,
} from '../catalog/index.js';
import {ComponentType} from '../../schema/visualGrammar.js';

export interface TopologyDirectorPromptInput {
  storyIntent: StoryIntent;
}

export const buildTopologyDirectorPrompt = ({
  storyIntent,
}: TopologyDirectorPromptInput): string => {
  const storyIntentJson = JSON.stringify(storyIntent, null, 2);
  const components = summarizeComponentCatalog();
  const connections = summarizeConnectionCatalog();
  const actions = summarizeActionCatalog();
  const motions = summarizeMotionCatalog();
  const minimalKit = summarizeMinimalComponentKit();
  const componentTypeValues = Object.values(ComponentType).join(' | ');
  const connectionKindValues = CONNECTION_KINDS.join(' | ');
  const flowPatternValues = FLOW_PATTERNS.join(' | ');

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
8. Use labels from the component catalog for each type.
   - For core components prefer: Users, Server, Load Balancer, Database, Cache, Queue, Worker, CDN.
9. Build connections[] using only allowed kinds/patterns.
10. Only output connections explicitly needed for scene clarity:
    - Do NOT invent inferred edges.
    - Do NOT output reverse duplicates for the same pair.
11. Connection direction should follow entity order:
    - Prefer from earlier entity to later entity in the scene entities[] array.
11.1 Set connection_type for every connection:
    - "static": line only, no flow particles.
    - "flowing": one-way flow from from -> to.
    - "both_ways": flow in both directions.
12. Respect required_component_types and transition_goal from StoryIntent:
    - Do not add unrelated entities.
    - Keep progression mostly additive unless StoryIntent explicitly teaches removal.
13. Set focus_entity_id to the key teaching component of that scene.
14. Copy complexity_budget from StoryIntent scene unchanged.
15. camera_intent should be "wide" for most scenes; use "focus" only when needed.
16. Add directives for runtime behavior:
    - directives.camera:
      mode ("auto" | "follow_action" | "wide_recap" | "steady")
      zoom ("tight" | "medium" | "wide")
      active_zone ("upper_third" | "center")
      reserve_bottom_percent (0..40)
    - directives.visual:
      theme ("default" | "neon")
      background_texture ("none" | "grid")
      glow_strength ("soft" | "strong")
    - directives.motion:
      entry_style ("drop_bounce" | "elastic_pop")
      pacing ("balanced" | "reel_fast")
    - directives.flow:
      renderer ("dashed" | "packets" | "hybrid")
    Prefer follow_action + upper_third + reserve_bottom_percent=25 for mobile reels.
17. For recap/final scenes, use directives.camera.mode = "wide_recap".
18. operations[] are metadata for change explanation:
    - Keep minimal.
    - Use [] when no clear structural change.
    - If provided, use only allowed operation types:
      add_entity, remove_entity, insert_between, reroute_connection,
      scale_entity, change_status, emphasize_entity, de_emphasize_entity, reveal_group.
19. IMPORTANT: Output must be valid against strict schema:
    - No unknown fields.
    - No null values (omit optional fields instead of null).
    - Every object must follow required keys exactly.
20. Respect per-scene complexity limits from StoryIntent exactly.
21. Entities and connections must use only supported enums listed below.
22. Do not infer hidden architecture. If not explicitly in StoryIntent, do not invent it.
23. Keep output deterministic and reusable across reruns.

Canonical entity ids (preferred):
- users (users_cluster)
- app (server)
- lb (load_balancer)
- db (database)
- cache (cache)
- queue (queue)
- worker (worker)
- cdn (cdn)

Available components:
${components}

Recommended minimal kit for fast production:
${minimalKit}

Available connection kinds:
${connections}

Available action vocabulary (status/teaching intent reference):
${actions}

Runtime motion catalog (reference):
${motions}

Allowed enums and values (strict):
- archetype:
  hook | setup | problem | escalation | solution | expansion | climax | recap | ending
- entity.type:
  ${componentTypeValues}
- entity.importance:
  primary | secondary
- entity.status:
  normal | active | overloaded | error | down
- connection.kind:
  ${connectionKindValues}
- connection.pattern:
  ${flowPatternValues}
- connection.intensity:
  low | medium | high
- connection.connection_type:
  static | flowing | both_ways
- camera_intent:
  wide | focus | introduce | steady
- directives.camera.mode:
  auto | follow_action | wide_recap | steady
- directives.camera.zoom:
  tight | medium | wide
- directives.camera.active_zone:
  upper_third | center
- directives.visual.theme:
  default | neon
- directives.visual.background_texture:
  none | grid
- directives.visual.glow_strength:
  soft | strong
- directives.motion.entry_style:
  drop_bounce | elastic_pop
- directives.motion.pacing:
  balanced | reel_fast
- directives.flow.renderer:
  dashed | packets | hybrid
- transition.type:
  add_entity | insert_between
- transition.style:
  soft_pop | hooked_split_insert
- transition.pace:
  slow | medium | fast

Operation object contracts:
- add_entity: {type, entityId}
- remove_entity: {type, entityId}
- insert_between: {type, entityId, fromId, toId}
- reroute_connection: {type, connectionId, newFromId?, newToId?}
- scale_entity: {type, entityId, toCount}
- change_status: {type, entityId, toStatus}
- emphasize_entity: {type, entityId}
- de_emphasize_entity: {type, entityId}
- reveal_group: {type, entityIds[]}

FORMAT EXAMPLE ONLY (DO NOT COPY THIS LITERALLY):
- This is only a schema-shape example for one mini scene.
- Do NOT reuse ids/timings/narration/components blindly.
- Actual output must be generated from StoryIntent above.
{
  "duration": 6,
  "scenes": [
    {
      "id": "scene_example_01",
      "start": 0,
      "end": 6,
      "archetype": "setup",
      "narration": "Users send requests to a single Server.",
      "focus_entity_id": "app",
      "entities": [
        {"id": "users", "type": "users_cluster", "label": "Users", "count": 1, "importance": "secondary", "status": "normal"},
        {"id": "app", "type": "server", "label": "Server", "count": 1, "importance": "primary", "status": "normal"}
      ],
      "connections": [
        {"id": "c_users_app_req", "from": "users", "to": "app", "kind": "request", "pattern": "steady", "intensity": "medium", "connection_type": "flowing"}
      ],
      "operations": [],
      "complexity_budget": {
        "max_visible_components": 2,
        "max_visible_connections": 1,
        "max_simultaneous_motions": 1
      },
      "camera_intent": "introduce",
      "directives": {
        "camera": {"mode": "follow_action", "zoom": "tight", "active_zone": "upper_third", "reserve_bottom_percent": 25},
        "visual": {"theme": "neon", "background_texture": "grid", "glow_strength": "strong"},
        "motion": {"entry_style": "elastic_pop", "pacing": "reel_fast"},
        "flow": {"renderer": "hybrid"}
      }
    }
  ]
}

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
    - connection_type ("static" | "flowing" | "both_ways")
  - operations[]
  - complexity_budget
  - camera_intent ("wide" | "focus" | "introduce" | "steady")
  - directives
    - camera: mode, zoom, active_zone, reserve_bottom_percent
    - visual: theme, background_texture, glow_strength
    - motion: entry_style, pacing
    - flow: renderer

Return only JSON.`;
};
