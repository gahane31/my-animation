import type {StoryPlan} from '../schema/storyPlannerSchema.js';
import {ALL_COMPONENT_TYPES} from '../schema/visualGrammar.js';

export interface MomentDirectorPromptInput {
  storyPlan: StoryPlan;
}

const renderList = (items: readonly string[]): string => items.map((item) => `- ${item}`).join('\n');

export const buildMomentDirectorPrompt = ({storyPlan}: MomentDirectorPromptInput): string => {
  const storyPlanJson = JSON.stringify(storyPlan, null, 2);

  return `You are a technical animation moment director.

Your task is to convert a StoryPlan into a MomentsVideo JSON timeline.

StoryPlan (source of truth):
${storyPlanJson}

Rules:
1. Keep story order and story timing aligned with the beats.
2. For each moment define entities currently present.
3. Use entity count to represent scaling when relevant.
4. Define connections between entities when data paths matter.
5. Define interactions for visible traffic patterns.
6. Define stateChanges for status/count/highlight/dim/remove changes.
7. Connection "from" and "to" must exactly match entity ids in the same moment.
8. Exactly one primary entity per moment.
9. Use camera focus when introducing or highlighting a component.
10. Do NOT define positions.
11. Do NOT define animations.
12. Keep moments sequential, no overlaps, and each moment <= 8 seconds.
13. Avoid long static periods.
14. Holds up to 6 seconds are allowed when at least one is true:
    - interactions are active
    - camera focus/wide intent is present
    - a primary component is being emphasized via stateChanges

Allowed component types:
${renderList(ALL_COMPONENT_TYPES)}

Output must be strict JSON only.
No markdown.
No commentary.
No extra keys.
Use null for optional fields that are not present.

JSON shape:
{
  "duration": number,
  "moments": [
    {
      "id": string,
      "start": number,
      "end": number,
      "narration": string,
      "entities": [
        {
          "id": string,
          "type": "users_cluster" | "server" | "load_balancer" | "database" | "cache" | "queue" | "cdn" | "worker",
          "count": number | null,
          "importance": "primary" | "secondary" | null,
          "status": "normal" | "active" | "overloaded" | "error" | "down" | null,
          "label": string | null
        }
      ],
      "connections": [
        {
          "id": string,
          "from": string,
          "to": string,
          "direction": "one_way" | "bidirectional" | null,
          "style": "solid" | "dashed" | "dotted" | null
        }
      ] | null,
      "interactions": [
        {
          "id": string,
          "from": string,
          "to": string,
          "type": "flow" | "burst" | "broadcast" | "ping",
          "intensity": "low" | "medium" | "high" | null
        }
      ] | null,
      "stateChanges": [
        {
          "entityId": string,
          "type": "status" | "count" | "highlight" | "dim" | "remove",
          "value": string | number | boolean | null
        }
      ] | null,
      "camera": {
        "mode": "wide" | "focus",
        "target": string | null,
        "zoom": number | null
      } | null
    }
  ]
}`;
};
