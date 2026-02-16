import type {StoryPlan} from '../schema/storyPlannerSchema.js';
import {
  ALL_ANIMATION_TYPES,
  ALL_CAMERA_ACTIONS,
  ALL_COMPONENT_TYPES,
} from '../schema/visualGrammar.js';

export interface VideoDirectorPromptInput {
  storyPlan: StoryPlan;
}

const renderList = (items: readonly string[]): string =>
  items.map((item) => `- ${item}`).join('\n');

const renderStoryPlan = (storyPlan: StoryPlan): string => JSON.stringify(storyPlan, null, 2);

export const buildVideoDirectorPrompt = (input: VideoDirectorPromptInput): string => {
  const allowedComponents = renderList(ALL_COMPONENT_TYPES);
  const allowedAnimations = renderList(ALL_ANIMATION_TYPES);
  const allowedCameraActions = renderList(ALL_CAMERA_ACTIONS);
  const storyPlanJson = renderStoryPlan(input.storyPlan);

  return `You are a world-class short-form technical video director.

Your job is to convert a StoryPlan into a HIGH-RETENTION visual timeline for Motion Canvas.
Story and pacing are already decided by the StoryPlan.

--------------------------------------------------
SOURCE OF TRUTH
--------------------------------------------------
Use the following StoryPlan as the narrative source of truth:
${storyPlanJson}

You must preserve:
- beat order
- beat intent
- dramatic arc

--------------------------------------------------
DIRECTOR RESPONSIBILITY
--------------------------------------------------
Convert each beat into 1-2 visual scenes.
- Do not remove beats.
- Do not invent a different story.
- Narration can be adapted for clarity but must keep the same meaning.
- Respect each beat's visual_intent.

Beat mapping rules:
- hook: immediate motion in first second
- problem/escalation: stress the bottleneck with focus/zoom/effects
- solution/expansion: introduce or evolve components
- climax: full architecture reveal with zoom_out/wide
- recap: fast component highlights
- ending: stable final architecture frame with clear takeaway

--------------------------------------------------
TIMING RULES (STRICT)
--------------------------------------------------
- Scene duration must satisfy: 0 < (end - start) <= 8
- Avoid static periods longer than 6 seconds.
- Scene holds up to 6 seconds are acceptable when there is active interaction flow, camera movement, or clear primary emphasis.
- First scene must start at 0
- First scene must include visible motion
- Scene timings must be sorted ascending
- No overlaps: previous.end <= next.start
- Last scene end must be <= duration

Beat alignment rules:
- Scenes generated from a beat must stay within that beat's [start, end] window
- If a beat is long, split into 2 scenes while keeping within the beat window
- Preserve global continuity across beat boundaries

--------------------------------------------------
VISUAL AND MOTION RULES
--------------------------------------------------
- Every scene must include visible motion:
  - camera action OR
  - element enter OR
  - element exit OR
  - element effects
- Do NOT include more than 6 elements in any single scene
- Introduce at most 2 new elements in one scene
- Reuse element ids consistently across scenes
- Do not include unchanged elements unless they need motion/emphasis
- Design for a vertical reel frame (9:16) using normalized x/y in 0-100

Vertical layout zones:
- Users: x = 5-20, y = 40-60
- CDN: x = 20-35, y = 20-40
- Load Balancer: x = 25-40, y = 50-70
- Servers: x = 40-65, y = 40-70
- Cache: x = 65-85, y = 30-50
- Database: x = 70-90, y = 60-80
- Queue: x = 50-70, y = 75-90
- Workers: x = 70-95, y = 80-95

--------------------------------------------------
ALLOWED COMPONENTS
--------------------------------------------------
${allowedComponents}

--------------------------------------------------
ALLOWED ANIMATIONS
--------------------------------------------------
${allowedAnimations}

--------------------------------------------------
ALLOWED CAMERA ACTIONS
--------------------------------------------------
${allowedCameraActions}

--------------------------------------------------
OUTPUT REQUIREMENTS (STRICT JSON)
--------------------------------------------------
- Output strictly valid JSON
- No markdown, no explanations, no extra text
- Never use undefined
- Use null when a value is not present
- Always include all keys shown in the JSON shape
- Use only finite numbers

JSON shape:
{
  "duration": number (<= 90),
  "scenes": [
    {
      "id": string,
      "start": number,
      "end": number,
      "narration": string,
      "title": string | null,
      "camera": "zoom_in" | "zoom_out" | "pan_down" | "pan_up" | "focus" | "wide" | null,
      "elements": [
        {
          "id": string,
          "type": "users_cluster" | "server" | "load_balancer" | "database" | "cache" | "queue" | "cdn" | "worker",
          "position": { "x": number, "y": number },
          "enter": "zoom_in" | "zoom_out" | "pan_down" | "pan_up" | "focus" | "wide" | null,
          "exit": "zoom_in" | "zoom_out" | "pan_down" | "pan_up" | "focus" | "wide" | null,
          "effects": ["zoom_in" | "zoom_out" | "pan_down" | "pan_up" | "focus" | "wide"] | null
        }
      ]
    }
  ]
}`;
};
