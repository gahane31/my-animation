import type {StoryIntent} from '../schema/storyIntent.schema.js';
import {
  CONNECTION_KINDS,
  FLOW_PATTERNS,
  summarizeLucideIconCatalog,
  summarizeActionCatalog,
  summarizeComponentCatalog,
  summarizeConnectionCatalog,
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
  const icons = summarizeLucideIconCatalog();
  const componentTypeValues = Object.values(ComponentType).join(' | ');
  const connectionKindValues = CONNECTION_KINDS.join(' | ');
  const flowPatternValues = FLOW_PATTERNS.join(' | ');

  return `You are a technical video topology director.

Task:
Convert StoryIntent into a deterministic SceneTopology plan for dynamic, readable reels.

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
6.1 Actor grouping rule:
   - For users_cluster scale-up, keep a single users entity and increase count.
   - Do NOT create multiple standalone users entities for load growth.
7. Topology must be driven by StoryIntent scene data:
   - For each scene, entities[].type must come from that scene's required_component_types.
   - Do NOT introduce component types that are not in required_component_types for that scene.
   - If StoryIntent uses uncommon types (for example api_gateway, microservice, nosql_database),
     preserve those exact types in topology.
8. Entity id policy:
   - ids must be stable for the same logical component across scenes.
   - Use deterministic semantic ids based on role/type context in StoryIntent scenes.
   - Do NOT rely on fixed hardcoded canonical ids from examples.
   - Keep ids concise and readable (snake_case).
9. Use labels from the component catalog for each type unless StoryIntent wording requires a better in-scene label.
9.1 Set entity icon token for every entity:
    - Use valid Lucide icon names (any Lucide icon is allowed).
    - The "Available Lucide icon tokens" section is suggestive, not exhaustive.
    - Use semantic matches (example: users -> users, database -> database, cache -> memory-stick).
    - Prefer clean line icons; avoid container-style tokens like square-*, layout-*, panel-*.
    - Do NOT use Material icons, Heroicons, FontAwesome, emoji, or free-form icon names.
   - icon values must be plain Lucide names (example: "server"), not URLs, SVG paths, or JSX.
   - If unsure, set icon to null (renderer fallback will use component default).
9.2 Prefer StoryIntent icon_hints when available:
   - If a scene provides icon_hints for a component type, reuse that icon for matching entity.type in topology.
   - Only deviate if there is a clear semantic mismatch.
10. Build connections[] using only allowed kinds/patterns.
11. Only output connections explicitly needed for scene clarity:
    - Do NOT invent inferred edges.
    - Do NOT output reverse duplicates for the same pair.
12. Connection direction should follow entity order:
    - Prefer from earlier entity to later entity in the scene entities[] array.
12.1 Set connection_type for every connection:
    - "static": line only, no flow particles.
    - "flowing": one-way flow from from -> to.
    - "both_ways": flow in both directions.
12.2 Set traffic_outcome for every connection:
    - "normal": standard flow, no explicit allow/block storytelling.
    - "allow": explicitly admitted traffic path.
    - "block": explicitly rejected/blocked traffic path.
    - "allow_and_block": mixed outcome on the same edge (some passes, some gets blocked).
12.3 When narration mentions blocked/rejected/throttled traffic:
    - At least one connection in that scene MUST have traffic_outcome = "block" or "allow_and_block".
    - If narration contrasts allow vs block, also keep at least one allowed non-static path.
12.4 For visually engaging reels, avoid fully static scenes:
    - In scenes with connections, at least one key path should be "flowing" or "both_ways".
    - Prefer "flowing" for request/service paths.
    - Use "both_ways" for cache lookups or ping-like exchanges.
12.5 Mixed allow/block modeling rule:
    - For the SAME edge (same from + same to), emit exactly ONE connection.
    - Use traffic_outcome = "allow_and_block" on that single connection.
    - Do NOT emit two separate connections for the same pair (for example one "allow" and one "block").
12.6 Blocked-flow connection rule:
    - If traffic_outcome is "block" or "allow_and_block", connection_type MUST be "flowing" or "both_ways".
    - Never use connection_type = "static" for blocked outcomes.
12.7 Prefer adjacent-chain readability:
    - Prefer edges between neighboring entities in entities[] order.
    - Add skip-level edges only when the story explicitly requires direct bypass behavior.
    - If skip-level edges are necessary, keep them minimal to preserve readability.
13. Respect required_component_types and transition_goal from StoryIntent:
    - Do not add unrelated entities.
    - Keep progression mostly additive unless StoryIntent explicitly teaches removal.
14. Set focus_entity_id to the key teaching component of that scene.
15. Copy complexity_budget from StoryIntent scene unchanged.
16. camera_intent should be "wide" for most scenes; use "focus" only when needed.
17. Add directives for runtime behavior:
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
      entry_style ("draw_in" | "drop_bounce" | "elastic_pop")
      pacing ("balanced" | "reel_fast")
    - directives.flow:
      renderer ("dashed" | "packets" | "hybrid")
    Prefer follow_action + upper_third + reserve_bottom_percent=25 for mobile reels.
17.1 For clean technical style (preferred default):
    - visual.theme = "default"
    - visual.glow_strength = "soft"
    - motion.entry_style = "draw_in"
    - flow.renderer = "hybrid" or "dashed"
    Use "neon"/"strong" only when StoryIntent explicitly asks for it.
17.2 Do not keep directives identical across all scenes.
    - Vary motion/flow/camera by scene role so visuals are perceptibly different.
    - hook/problem/escalation/climax:
      camera.mode = "follow_action", camera.zoom = "tight" or "medium",
      motion.pacing = "reel_fast",
      flow.renderer = "hybrid" or "packets".
    - setup/solution/expansion:
      camera.mode = "follow_action",
      motion.pacing = "balanced" or "reel_fast" based on complexity.
    - recap/ending:
      camera.mode = "wide_recap",
      motion.pacing = "balanced",
      flow.renderer = "dashed" or "hybrid".
    - If the previous scene used the exact same directive tuple
      (camera.mode, camera.zoom, motion.entry_style, motion.pacing, flow.renderer),
      change at least one field unless doing so would break clarity.
18. For recap/final scenes, use directives.camera.mode = "wide_recap".
19. operations[] are metadata for change explanation:
    - Keep minimal.
    - Use [] when no clear structural change.
    - If provided, use only allowed operation types:
      add_entity, remove_entity, insert_between, reroute_connection,
      scale_entity, change_status, emphasize_entity, de_emphasize_entity, reveal_group.
20. Scene-to-scene deltas must be explicit:
    - If a component is added/inserted/scaled/status-changed, reflect that in operations[].
    - If an entity is newly inserted between two entities, prefer transition.type = "insert_between".
    - If a single new entity is introduced, prefer transition.type = "add_entity".
20.1 Transition reference integrity:
    - transition.entityId MUST match an entity.id that exists in this SAME scene.entities[].
    - For insert_between, transition.fromId and transition.toId MUST also exist in this SAME scene.entities[].
    - Do not reference future/past ids that are not present in the current scene.
21. IMPORTANT: Output must be valid against strict schema:
    - No unknown fields.
    - Use every required key exactly as defined.
    - For nullable required keys, use null when not applicable.
    - Do NOT omit required keys.
    - This includes required nullable fields such as focus_entity_id, transition, camera_intent,
      label/count/importance/status on entities, intensity on connections, and
      icon on entities,
      newFromId/newToId for reroute_connection operations.
21.1 Final self-check before returning JSON (must all be true):
    - Every transition entity id reference exists in the same scene.entities[].
    - No duplicate connection pairs by (from,to) within a scene.
    - Any blocked or mixed blocked outcome is non-static.
    - All connection from/to ids exist in scene.entities[].
22. Respect per-scene complexity limits from StoryIntent exactly.
23. Entities and connections must use only supported enums listed below.
24. Do not infer hidden architecture. If not explicitly in StoryIntent, do not invent it.
25. Keep output deterministic and reusable across reruns.
26. Pattern guidance (use when semantically appropriate):
    - request/service_call/auth_request -> pattern "steady", intensity "medium"
    - async_event/queue_dispatch/replication -> pattern "broadcast"
    - failover/retry -> pattern "burst"
    - health_check/trace/cache_lookup -> pattern "ping" or "steady"
    - blocked/denied/throttled path -> traffic_outcome "block" (or "allow_and_block" on mixed edge)
26.1 Semantic encoding guidance (renderer-supported):
    - allow vs block outcomes:
      encode with traffic_outcome on the same edge (prefer "allow_and_block" for mixed outcomes).
    - state/counter/token/window semantics:
      encode with a decision/processing component linked to a state-holding component
      using kinds such as cache_lookup/cache_fill/replication and meaningful pattern/intensity.
    - atomicity/race semantics:
      include a coordination/guard component and explicit coordination relationships
      (for example auth_request/control/cache_fill when available in-scene).
    - hot-key/skew semantics:
      include shard_indicator and mark stressed ingress edges with high intensity + burst pattern.
26.2 Scale-spike encoding rule:
    - If narration describes a traffic/load spike (for example: burst, surge, overload, sudden traffic),
      mark the main ingress path from actor/source to first processing component as:
      pattern = "burst", intensity = "high", connection_type = "flowing".
    - Keep at least one normal or allow path visible for contrast unless the scene is full outage/failure.
27. Motion readability guidance:
    - scenes with transition_goal that inserts/adds components should usually include transition object
      and non-static connection_type on the main path.
28. Keep scenes visually alive but clear: avoid setting all connections to "static" unless StoryIntent
    explicitly asks for an idle/static comparison frame.
29. Avoid repetitive default structures:
    - Do not blindly output the same fixed component chain across different topics.
    - StoryIntent scene components are the source of truth; topology must reflect them scene by scene.

Available components:
${components}

Available Lucide icon tokens:
${icons}

Available connection kinds:
${connections}

Available action vocabulary (status/teaching intent reference):
${actions}

Runtime motion catalog (reference):
${motions}

Renderer behavior reference (deterministic):
- entry_style = draw_in:
  new entities are traced in (icon/shape reveal), and newly added connections are line-traced.
- entry_style = drop_bounce:
  new entities drop from above with bounce.
- entry_style = elastic_pop:
  quick pop/overshoot reveal.
- flow.renderer = dashed:
  marching dashed flow line.
- flow.renderer = packets:
  packet-like movement along edge.
- flow.renderer = hybrid:
  dashed line with stronger motion accents.
- visual.theme = default + glow_strength = soft:
  clean diagram aesthetic (recommended baseline).

Allowed enums and values (strict):
- archetype:
  hook | setup | problem | escalation | solution | expansion | climax | recap | ending
- entity.type:
  ${componentTypeValues}
- entity.importance:
  primary | secondary
- entity.status:
  normal | active | overloaded | error | down
- entity.icon:
  MUST be a valid Lucide token in kebab-case (for example: "server", "database", "shield-check").
  The provided icon list is guidance, not a hard whitelist.
  Invalid examples: "material-symbols:dns", "fa-server", "https://...", "<svg...>".
- connection.kind:
  ${connectionKindValues}
- connection.pattern:
  ${flowPatternValues}
- connection.intensity:
  low | medium | high
- connection.connection_type:
  static | flowing | both_ways
- connection.traffic_outcome:
  normal | allow | block | allow_and_block
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
  draw_in | drop_bounce | elastic_pop
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
- reroute_connection: {type, connectionId, newFromId, newToId}
- reroute_connection note: newFromId/newToId keys are required for this operation and can be string or null.
- scale_entity: {type, entityId, toCount}
- change_status: {type, entityId, toStatus}
- emphasize_entity: {type, entityId}
- de_emphasize_entity: {type, entityId}
- reveal_group: {type, entityIds[]}

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
    - icon
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
    - traffic_outcome ("normal" | "allow" | "block" | "allow_and_block")
  - operations[]
  - transition (object or null)
  - complexity_budget
  - camera_intent ("wide" | "focus" | "introduce" | "steady")
  - directives
    - camera: mode, zoom, active_zone, reserve_bottom_percent
    - visual: theme, background_texture, glow_strength
    - motion: entry_style, pacing
    - flow: renderer

Return only JSON.`;
};
