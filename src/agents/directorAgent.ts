import {DECIMAL_PRECISION, PIPELINE_DEFAULTS, VIDEO_LIMITS} from '../config/constants.js';
import {AnimationType, CameraActionType, ComponentType} from '../schema/visualGrammar.js';
import type {Element, Position, Scene, VideoSpec} from '../schema/videoSpec.schema.js';
import {videoSpecSchema} from '../schema/videoSpec.schema.js';
import type {StoryBeat, StoryPlan} from '../schema/storyPlannerSchema.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';

type BeatType = StoryBeat['type'] | 'unknown';

interface RefineOptions {
  storyPlan?: StoryPlan;
}

interface BeatBoundScene {
  scene: Scene;
  beat: StoryBeat;
  beatIndex: number;
  sceneOrdinal: number;
}

interface DirectorContext {
  seenElementIds: Set<string>;
  seenComponentTypes: Set<ComponentType>;
  canonicalIds: Map<ComponentType, string>;
  elementPositions: Map<string, Position>;
  cameraHistory: CameraActionType[];
}

const round = (value: number): number => Number(value.toFixed(DECIMAL_PRECISION));

const sceneDuration = (scene: Scene): number => Math.max(0, scene.end - scene.start);

const cloneElement = (element: Element): Element => ({
  ...element,
  position: {...element.position},
  effects: element.effects ? [...element.effects] : undefined,
});

const cloneScene = (scene: Scene): Scene => ({
  ...scene,
  elements: scene.elements.map(cloneElement),
});

const DEFAULT_ID_BY_COMPONENT: Partial<Record<ComponentType, string>> = {
  [ComponentType.UsersCluster]: 'users',
  [ComponentType.Server]: 'app1',
  [ComponentType.LoadBalancer]: 'lb1',
  [ComponentType.Database]: 'db1',
  [ComponentType.Cache]: 'cache1',
  [ComponentType.Queue]: 'queue1',
  [ComponentType.Worker]: 'worker1',
  [ComponentType.Cdn]: 'cdn1',
};

const COMPONENT_STAGE_ORDER: ComponentType[] = [
  ComponentType.UsersCluster,
  ComponentType.Server,
  ComponentType.LoadBalancer,
  ComponentType.Database,
  ComponentType.Cache,
  ComponentType.Queue,
  ComponentType.Worker,
  ComponentType.Cdn,
];

const COMPONENT_ORDER_INDEX = new Map<ComponentType, number>(
  COMPONENT_STAGE_ORDER.map((value, index) => [value, index]),
);

const COMPONENT_PREREQUISITES: Partial<Record<ComponentType, ComponentType[]>> = {
  [ComponentType.UsersCluster]: [],
  [ComponentType.Server]: [ComponentType.UsersCluster],
  [ComponentType.LoadBalancer]: [ComponentType.Server],
  [ComponentType.Database]: [ComponentType.Server],
  [ComponentType.Cache]: [ComponentType.Database],
  [ComponentType.Queue]: [ComponentType.Database],
  [ComponentType.Worker]: [ComponentType.Queue],
  [ComponentType.Cdn]: [ComponentType.LoadBalancer],
};

const COMPONENT_ZONE_POSITIONS: Partial<Record<ComponentType, Position[]>> = {
  [ComponentType.UsersCluster]: [{x: 25, y: 56}, {x: 21, y: 50}],
  [ComponentType.Cdn]: [{x: 24, y: 28}],
  [ComponentType.LoadBalancer]: [{x: 33, y: 56}],
  [ComponentType.Server]: [
    {x: 50, y: 56},
    {x: 50, y: 48},
    {x: 50, y: 64},
    {x: 56, y: 56},
  ],
  [ComponentType.Cache]: [{x: 72, y: 52}],
  [ComponentType.Database]: [{x: 76, y: 76}],
  [ComponentType.Queue]: [{x: 60, y: 86}],
  [ComponentType.Worker]: [
    {x: 82, y: 86},
    {x: 86, y: 92},
    {x: 78, y: 92},
  ],
};

const HERO_CENTER: Position = {x: 52, y: 56};
const ENDING_SUPPORT_POSITIONS: Position[] = [
  {x: 44, y: 58},
  {x: 60, y: 58},
  {x: 52, y: 66},
];

const CORE_CLIMAX_TYPES = new Set<ComponentType>([
  ComponentType.UsersCluster,
  ComponentType.Cdn,
  ComponentType.LoadBalancer,
  ComponentType.Server,
]);

const ADVANCED_CLIMAX_TYPES = new Set<ComponentType>([
  ComponentType.Cache,
  ComponentType.Database,
  ComponentType.Queue,
  ComponentType.Worker,
]);

const MAX_ELEMENTS_BY_BEAT: Record<BeatType, number> = {
  hook: 2,
  setup: 3,
  problem: 3,
  escalation: 3,
  solution: 4,
  expansion: 4,
  climax: 7,
  recap: 3,
  ending: 3,
  unknown: 4,
};

const MAX_NEW_IDS_BY_BEAT: Record<BeatType, number> = {
  hook: 2,
  setup: 2,
  problem: 0,
  escalation: 0,
  solution: 2,
  expansion: 1,
  climax: 4,
  recap: 0,
  ending: 0,
  unknown: 2,
};

const MAX_NEW_TYPES_BY_BEAT: Record<BeatType, number> = {
  hook: 2,
  setup: 2,
  problem: 0,
  escalation: 0,
  solution: 1,
  expansion: 1,
  climax: 4,
  recap: 0,
  ending: 0,
  unknown: 2,
};

const CAMERA_PATTERNS: Record<BeatType, CameraActionType[]> = {
  hook: [CameraActionType.ZoomIn, CameraActionType.Focus],
  setup: [CameraActionType.Focus],
  problem: [CameraActionType.ZoomIn, CameraActionType.Focus],
  escalation: [CameraActionType.ZoomIn, CameraActionType.Focus],
  solution: [CameraActionType.PanUp, CameraActionType.ZoomOut, CameraActionType.PanDown],
  expansion: [CameraActionType.PanDown, CameraActionType.ZoomOut, CameraActionType.PanUp],
  climax: [CameraActionType.ZoomOut, CameraActionType.Wide],
  recap: [CameraActionType.Wide, CameraActionType.Focus],
  ending: [CameraActionType.Focus, CameraActionType.Wide],
  unknown: [CameraActionType.Focus, CameraActionType.ZoomIn],
};

const HERO_PRIORITY_BY_BEAT: Record<BeatType, ComponentType[]> = {
  hook: [ComponentType.Server, ComponentType.UsersCluster],
  setup: [ComponentType.Server, ComponentType.UsersCluster, ComponentType.LoadBalancer],
  problem: [ComponentType.Server, ComponentType.Database, ComponentType.Queue],
  escalation: [ComponentType.Server, ComponentType.Database, ComponentType.Queue],
  solution: [
    ComponentType.Cache,
    ComponentType.LoadBalancer,
    ComponentType.Queue,
    ComponentType.Worker,
    ComponentType.Cdn,
    ComponentType.Database,
    ComponentType.Server,
  ],
  expansion: [
    ComponentType.Server,
    ComponentType.Cache,
    ComponentType.Queue,
    ComponentType.Worker,
    ComponentType.Cdn,
  ],
  climax: [ComponentType.LoadBalancer, ComponentType.Server, ComponentType.Cache, ComponentType.Database],
  recap: [ComponentType.LoadBalancer, ComponentType.Server, ComponentType.UsersCluster],
  ending: [ComponentType.LoadBalancer, ComponentType.Server, ComponentType.UsersCluster],
  unknown: [ComponentType.Server, ComponentType.UsersCluster],
};

const SUPPORT_PRIORITY: ComponentType[] = [
  ComponentType.UsersCluster,
  ComponentType.LoadBalancer,
  ComponentType.Server,
  ComponentType.Cache,
  ComponentType.Database,
  ComponentType.Queue,
  ComponentType.Worker,
  ComponentType.Cdn,
];

const MOTION_REQUIRED_BEATS = new Set<BeatType>([
  'hook',
  'problem',
  'escalation',
  'solution',
  'expansion',
  'climax',
  'recap',
  'ending',
  'setup',
  'unknown',
]);

const toBeatType = (value?: StoryBeat['type']): BeatType => value ?? 'unknown';

const createDirectorContext = (): DirectorContext => ({
  seenElementIds: new Set<string>(),
  seenComponentTypes: new Set<ComponentType>(),
  canonicalIds: new Map<ComponentType, string>(),
  elementPositions: new Map<string, Position>(),
  cameraHistory: [],
});

const dedupeElements = (elements: Element[]): Element[] => {
  const ids = new Set<string>();
  const deduped: Element[] = [];

  for (const element of elements) {
    if (ids.has(element.id)) {
      continue;
    }

    ids.add(element.id);
    deduped.push(cloneElement(element));
  }

  return deduped;
};

const uniqueScenes = (scenes: Scene[]): Scene[] => {
  const idCounts = new Map<string, number>();

  return scenes.map((scene) => {
    const next = cloneScene(scene);
    const count = idCounts.get(next.id) ?? 0;
    idCounts.set(next.id, count + 1);

    if (count === 0) {
      return next;
    }

    return {
      ...next,
      id: `${next.id}_${count + 1}`,
    };
  });
};

const splitSceneIntoParts = (scene: Scene, parts: number): Scene[] => {
  if (parts <= 1) {
    return [cloneScene(scene)];
  }

  const duration = sceneDuration(scene);
  if (duration <= 0) {
    return [cloneScene(scene)];
  }

  const partDuration = duration / parts;
  const output: Scene[] = [];

  for (let index = 0; index < parts; index += 1) {
    const start = round(scene.start + index * partDuration);
    const rawEnd = index === parts - 1 ? scene.end : scene.start + (index + 1) * partDuration;
    const end = round(rawEnd);

    output.push({
      ...cloneScene(scene),
      id: `${scene.id}_part_${index + 1}`,
      start,
      end,
    });
  }

  return output;
};

const splitSceneByPacing = (scene: Scene): Scene[] => {
  const duration = sceneDuration(scene);
  const maxDuration = Math.min(
    VIDEO_LIMITS.maxSceneDurationSeconds,
    VIDEO_LIMITS.maxStructuralIdleSeconds,
  );
  const parts = Math.max(1, Math.ceil(duration / maxDuration));
  return splitSceneIntoParts(scene, parts);
};

const overlapsBeat = (scene: Scene, beat: StoryBeat): boolean =>
  scene.start < beat.end && scene.end > beat.start;

const normalizeBeatDuration = (beat: StoryBeat): number =>
  Math.max(beat.end - beat.start, PIPELINE_DEFAULTS.minimumSceneDurationSeconds);

const requiredScenesForBeat = (beat: StoryBeat): number => {
  const baseCount = Math.max(
    1,
    Math.ceil(normalizeBeatDuration(beat) / VIDEO_LIMITS.maxStructuralIdleSeconds),
  );

  if (beat.type === 'climax') {
    return Math.max(baseCount, 2);
  }

  return baseCount;
};

const splitLongestCandidate = (candidates: Scene[]): Scene[] => {
  if (candidates.length === 0) {
    return candidates;
  }

  const longestIndex = candidates.reduce((bestIndex, candidate, currentIndex) => {
    const currentDuration = sceneDuration(candidate);
    const bestDuration = sceneDuration(candidates[bestIndex] ?? candidate);
    return currentDuration > bestDuration ? currentIndex : bestIndex;
  }, 0);

  const longest = candidates[longestIndex];
  if (!longest) {
    return candidates;
  }

  const duration = sceneDuration(longest);
  if (duration <= PIPELINE_DEFAULTS.minimumSceneDurationSeconds * 2) {
    const duplicate = cloneScene(longest);
    duplicate.id = `${duplicate.id}_dup_${candidates.length + 1}`;
    return [...candidates, duplicate];
  }

  const split = splitSceneIntoParts(longest, 2);
  return [...candidates.slice(0, longestIndex), ...split, ...candidates.slice(longestIndex + 1)];
};

const ensureCandidateCount = (candidates: Scene[], requiredCount: number): Scene[] => {
  let output = candidates.map(cloneScene);

  while (output.length < requiredCount) {
    output = splitLongestCandidate(output);
  }

  if (output.length > requiredCount) {
    output = output.slice(0, requiredCount);
  }

  return output;
};

const fallbackTypeForBeat = (beatType: BeatType, context: DirectorContext): ComponentType => {
  if (beatType === 'ending' || beatType === 'recap') {
    if (context.seenComponentTypes.has(ComponentType.LoadBalancer)) {
      return ComponentType.LoadBalancer;
    }

    if (context.seenComponentTypes.has(ComponentType.Server)) {
      return ComponentType.Server;
    }
  }

  if (context.seenComponentTypes.has(ComponentType.Server)) {
    return ComponentType.Server;
  }

  return ComponentType.UsersCluster;
};

const resolveCanonicalId = (type: ComponentType, context: DirectorContext): string =>
  context.canonicalIds.get(type) ?? DEFAULT_ID_BY_COMPONENT[type] ?? `${type}_1`;

const createFallbackElement = (type: ComponentType, context: DirectorContext): Element => ({
  id: resolveCanonicalId(type, context),
  type,
  position: {x: HERO_CENTER.x, y: HERO_CENTER.y},
});

const buildBeatBoundScenes = (videoSpec: VideoSpec, storyPlan: StoryPlan): BeatBoundScene[] => {
  const sortedScenes = [...videoSpec.scenes].sort((left, right) => left.start - right.start);
  const beats = [...storyPlan.beats].sort((left, right) => left.start - right.start);
  const output: BeatBoundScene[] = [];
  let lastElements: Element[] = [];

  beats.forEach((beat, beatIndex) => {
    const overlapped = sortedScenes
      .filter((scene) => overlapsBeat(scene, beat))
      .flatMap(splitSceneByPacing);

    const candidates = overlapped.length
      ? overlapped
      : [
          {
            id: `${beat.id}_scene_1`,
            start: beat.start,
            end: beat.end,
            narration: beat.narration,
            title: undefined,
            camera: undefined,
            elements: lastElements.length > 0 ? lastElements.map(cloneElement) : [],
          },
        ];

    const requiredCount = requiredScenesForBeat(beat);
    const normalizedCandidates = ensureCandidateCount(candidates, requiredCount);
    const beatDuration = normalizeBeatDuration(beat);
    const segmentDuration = beatDuration / requiredCount;

    normalizedCandidates.forEach((candidate, sceneOrdinal) => {
      const start = round(beat.start + sceneOrdinal * segmentDuration);
      const end = round(sceneOrdinal === requiredCount - 1 ? beat.end : beat.start + (sceneOrdinal + 1) * segmentDuration);

      const scene: Scene = {
        ...cloneScene(candidate),
        id: `${beat.id}_scene_${sceneOrdinal + 1}`,
        start,
        end,
        narration: candidate.narration || beat.narration,
        title: candidate.title ?? beat.type.toUpperCase(),
      };

      output.push({
        scene,
        beat,
        beatIndex,
        sceneOrdinal,
      });
    });

    const lastScene = normalizedCandidates[normalizedCandidates.length - 1];
    lastElements = lastScene ? lastScene.elements.map(cloneElement) : lastElements;
  });

  return output;
};

const canIntroduceTypeInBeat = (type: ComponentType, beatType: BeatType, introducedTypeCount: number): boolean => {
  if (introducedTypeCount >= MAX_NEW_TYPES_BY_BEAT[beatType]) {
    return false;
  }

  switch (beatType) {
    case 'hook':
      return type === ComponentType.UsersCluster || type === ComponentType.Server;
    case 'setup':
      return (
        type === ComponentType.UsersCluster ||
        type === ComponentType.Server ||
        type === ComponentType.LoadBalancer ||
        type === ComponentType.Database
      );
    case 'problem':
    case 'escalation':
    case 'recap':
    case 'ending':
      return false;
    case 'solution':
    case 'expansion':
    case 'climax':
    case 'unknown':
      return true;
    default:
      return true;
  }
};

const canIntroduceElementInBeat = (beatType: BeatType, introducedElementCount: number): boolean =>
  introducedElementCount < MAX_NEW_IDS_BY_BEAT[beatType];

const prerequisitesSatisfied = (
  type: ComponentType,
  availableTypes: Set<ComponentType>,
): boolean =>
  (COMPONENT_PREREQUISITES[type] ?? []).every((required) => availableTypes.has(required));

const sortByComponentStage = (elements: Element[]): Element[] =>
  [...elements].sort((left, right) => {
    const leftRank = COMPONENT_ORDER_INDEX.get(left.type) ?? 999;
    const rightRank = COMPONENT_ORDER_INDEX.get(right.type) ?? 999;
    return leftRank - rightRank;
  });

const applyClimaxStructure = (
  elements: Element[],
  sceneOrdinal: number,
  context: DirectorContext,
): Element[] => {
  if (sceneOrdinal === 0) {
    const core = elements.filter((element) => CORE_CLIMAX_TYPES.has(element.type));
    if (core.length > 0) {
      return core;
    }

    return [createFallbackElement(ComponentType.Server, context)];
  }

  const output = elements.filter(
    (element) => CORE_CLIMAX_TYPES.has(element.type) || ADVANCED_CLIMAX_TYPES.has(element.type),
  );

  for (const advancedType of ADVANCED_CLIMAX_TYPES) {
    if (output.some((element) => element.type === advancedType)) {
      continue;
    }

    const fallback = createFallbackElement(advancedType, context);
    output.push(fallback);
  }

  return output;
};

const filterElementsForBeat = (
  elements: Element[],
  beatType: BeatType,
  context: DirectorContext,
): Element[] => {
  const sorted = sortByComponentStage(elements);
  const output: Element[] = [];
  const availableTypes = new Set<ComponentType>(context.seenComponentTypes);
  let introducedIds = 0;
  let introducedTypes = 0;

  for (const element of sorted) {
    const seenId = context.seenElementIds.has(element.id);
    const seenType = context.seenComponentTypes.has(element.type) || availableTypes.has(element.type);

    if (!seenId) {
      if (!canIntroduceElementInBeat(beatType, introducedIds)) {
        continue;
      }
    }

    if (!seenType) {
      if (!canIntroduceTypeInBeat(element.type, beatType, introducedTypes)) {
        continue;
      }

      if (!prerequisitesSatisfied(element.type, availableTypes)) {
        continue;
      }

      introducedTypes += 1;
    }

    if (!seenId) {
      introducedIds += 1;
    }

    output.push(cloneElement(element));
    availableTypes.add(element.type);
  }

  return output;
};

const pickHeroElement = (
  elements: Element[],
  beatType: BeatType,
  context: DirectorContext,
): Element | undefined => {
  if (elements.length === 0) {
    return undefined;
  }

  const newElements = elements.filter((element) => !context.seenElementIds.has(element.id));
  if ((beatType === 'solution' || beatType === 'expansion') && newElements.length > 0) {
    return newElements[0];
  }

  const preferred = HERO_PRIORITY_BY_BEAT[beatType];
  for (const preferredType of preferred) {
    const match = elements.find((element) => element.type === preferredType);
    if (match) {
      return match;
    }
  }

  return elements[0];
};

const supportPriorityIndex = (type: ComponentType): number => {
  const index = SUPPORT_PRIORITY.indexOf(type);
  return index === -1 ? SUPPORT_PRIORITY.length : index;
};

const limitElements = (elements: Element[], hero: Element, beatType: BeatType): Element[] => {
  const maxElements = MAX_ELEMENTS_BY_BEAT[beatType];
  const supports = elements
    .filter((element) => element.id !== hero.id)
    .sort((left, right) => supportPriorityIndex(left.type) - supportPriorityIndex(right.type));

  return [hero, ...supports].slice(0, maxElements);
};

const getZonePosition = (type: ComponentType, countForType: number): Position => {
  const zone = COMPONENT_ZONE_POSITIONS[type] ?? [HERO_CENTER];
  const index = Math.max(0, Math.min(zone.length - 1, countForType));
  const fallback = zone[index] ?? zone[0] ?? HERO_CENTER;
  return {x: fallback.x, y: fallback.y};
};

const assignPositions = (
  elements: Element[],
  heroId: string,
  beatType: BeatType,
  context: DirectorContext,
): Element[] => {
  const typeCounts = new Map<ComponentType, number>();
  let endingSupportIndex = 0;

  return elements.map((element) => {
    const next = cloneElement(element);
    const isHero = next.id === heroId;
    const persisted = context.elementPositions.get(next.id);

    if (isHero) {
      next.position = {x: HERO_CENTER.x, y: HERO_CENTER.y};
    } else if (beatType === 'recap' || beatType === 'ending') {
      const position = ENDING_SUPPORT_POSITIONS[endingSupportIndex] ?? ENDING_SUPPORT_POSITIONS[ENDING_SUPPORT_POSITIONS.length - 1] ?? HERO_CENTER;
      next.position = {x: position.x, y: position.y};
      endingSupportIndex += 1;
    } else if (persisted) {
      next.position = {x: persisted.x, y: persisted.y};
    } else {
      const countForType = typeCounts.get(next.type) ?? 0;
      next.position = getZonePosition(next.type, countForType);
      typeCounts.set(next.type, countForType + 1);
    }

    context.elementPositions.set(next.id, {...next.position});
    return next;
  });
};

const chooseCamera = (
  beatType: BeatType,
  beatIndex: number,
  sceneOrdinal: number,
  context: DirectorContext,
): CameraActionType => {
  const pattern = CAMERA_PATTERNS[beatType];
  const pointer = (beatIndex + sceneOrdinal) % pattern.length;
  let action = pattern[pointer] ?? CameraActionType.Focus;

  const last = context.cameraHistory[context.cameraHistory.length - 1];
  const secondLast = context.cameraHistory[context.cameraHistory.length - 2];
  if (last && secondLast && last === secondLast && action === last) {
    const alternative = pattern.find((candidate) => candidate !== last);
    action = alternative ?? CameraActionType.Wide;
  }

  context.cameraHistory.push(action);
  if (context.cameraHistory.length > 4) {
    context.cameraHistory.shift();
  }

  return action;
};

const heroEnterForBeat = (
  beatType: BeatType,
  sceneOrdinal: number,
  isNewHero: boolean,
): AnimationType | undefined => {
  if (!isNewHero) {
    return undefined;
  }

  switch (beatType) {
    case 'hook':
      return AnimationType.ZoomIn;
    case 'solution':
      return sceneOrdinal % 2 === 0 ? AnimationType.ZoomIn : AnimationType.PanUp;
    case 'expansion':
      return AnimationType.PanDown;
    case 'climax':
      return sceneOrdinal > 0 ? AnimationType.ZoomIn : undefined;
    default:
      return AnimationType.ZoomIn;
  }
};

const heroEffectsForBeat = (
  beatType: BeatType,
  sceneOrdinal: number,
  hasEnter: boolean,
): AnimationType[] | undefined => {
  if (beatType === 'ending' || beatType === 'recap') {
    return undefined;
  }

  if (hasEnter && beatType !== 'problem' && beatType !== 'escalation') {
    return undefined;
  }

  switch (beatType) {
    case 'problem':
      return [AnimationType.Focus, AnimationType.Focus];
    case 'escalation':
      return [AnimationType.ZoomIn, AnimationType.Focus];
    case 'solution':
      return [AnimationType.Focus];
    case 'expansion':
      return [AnimationType.PanUp];
    case 'climax':
      return sceneOrdinal === 0 ? [AnimationType.Focus] : [AnimationType.ZoomIn];
    case 'hook':
      return [AnimationType.ZoomIn];
    case 'setup':
    case 'unknown':
      return [AnimationType.Focus];
    default:
      return undefined;
  }
};

const sceneHasMotion = (scene: Scene): boolean => {
  if (scene.camera !== undefined) {
    return true;
  }

  return scene.elements.some((element) => {
    const effectsCount = element.effects?.length ?? 0;
    return element.enter !== undefined || element.exit !== undefined || effectsCount > 0;
  });
};

const applyMotion = (
  scene: Scene,
  heroId: string,
  beatType: BeatType,
  beatIndex: number,
  sceneOrdinal: number,
  context: DirectorContext,
): Scene => {
  const camera = chooseCamera(beatType, beatIndex, sceneOrdinal, context);
  const elements = scene.elements.map((element) => {
    const next = cloneElement(element);
    const isHero = next.id === heroId;
    const isSeen = context.seenElementIds.has(next.id);

    next.exit = undefined;
    if (!isHero) {
      next.enter = undefined;
      next.effects = undefined;
      return next;
    }

    const enter = heroEnterForBeat(beatType, sceneOrdinal, !isSeen);
    next.enter = isSeen ? undefined : enter;
    next.effects = heroEffectsForBeat(beatType, sceneOrdinal, next.enter !== undefined);

    return next;
  });

  const nextScene: Scene = {
    ...cloneScene(scene),
    camera,
    elements,
  };

  if (MOTION_REQUIRED_BEATS.has(beatType) && !sceneHasMotion(nextScene)) {
    const [firstElement, ...rest] = nextScene.elements;
    if (firstElement) {
      nextScene.elements = [
        {
          ...firstElement,
          effects: [AnimationType.Focus],
        },
        ...rest,
      ];
    } else {
      nextScene.camera = CameraActionType.Focus;
    }
  }

  return nextScene;
};

const composeSceneFromBeat = (
  beatBoundScene: BeatBoundScene,
  context: DirectorContext,
): Scene => {
  const beatType = toBeatType(beatBoundScene.beat.type);
  let elements = dedupeElements(beatBoundScene.scene.elements);

  if (beatType === 'climax') {
    elements = applyClimaxStructure(elements, beatBoundScene.sceneOrdinal, context);
  }

  elements = filterElementsForBeat(elements, beatType, context);

  if (elements.length === 0) {
    elements = [createFallbackElement(fallbackTypeForBeat(beatType, context), context)];
  }

  const hero = pickHeroElement(elements, beatType, context) ?? elements[0];
  const constrainedElements = limitElements(elements, hero, beatType);
  const positioned = assignPositions(constrainedElements, hero.id, beatType, context);

  const nextScene: Scene = {
    ...cloneScene(beatBoundScene.scene),
    elements: positioned,
    narration: beatBoundScene.scene.narration || beatBoundScene.beat.narration,
  };

  const withMotion = applyMotion(
    nextScene,
    hero.id,
    beatType,
    beatBoundScene.beatIndex,
    beatBoundScene.sceneOrdinal,
    context,
  );

  withMotion.elements.forEach((element) => {
    context.seenElementIds.add(element.id);
    context.seenComponentTypes.add(element.type);
    if (!context.canonicalIds.has(element.type)) {
      context.canonicalIds.set(element.type, element.id);
    }
  });

  return withMotion;
};

const enforceFirstSceneMotion = (scenes: Scene[]): Scene[] => {
  if (scenes.length === 0) {
    return scenes;
  }

  const [first, ...rest] = scenes;
  if (!first) {
    return scenes;
  }

  const nextFirst = cloneScene(first);
  nextFirst.start = 0;

  if (!sceneHasMotion(nextFirst)) {
    nextFirst.camera = nextFirst.camera ?? CameraActionType.ZoomIn;
    const [firstElement, ...otherElements] = nextFirst.elements;
    if (firstElement) {
      nextFirst.elements = [
        {
          ...firstElement,
          enter: firstElement.enter ?? AnimationType.ZoomIn,
        },
        ...otherElements,
      ];
    }
  }

  return [nextFirst, ...rest];
};

const calculateDuration = (scenes: Scene[], storyPlan?: StoryPlan): number => {
  const lastEnd = scenes.length === 0 ? 0 : scenes[scenes.length - 1]?.end ?? 0;
  const planDuration = storyPlan ? storyPlan.duration : lastEnd;
  return round(Math.min(VIDEO_LIMITS.maxDurationSeconds, Math.max(lastEnd, planDuration)));
};

const legacyRefine = (input: VideoSpec): VideoSpec => {
  const ordered = [...input.scenes].sort((left, right) => left.start - right.start);
  const split = ordered.flatMap(splitSceneByPacing);
  const unique = uniqueScenes(split);
  const firstMotion = enforceFirstSceneMotion(unique);

  return videoSpecSchema.parse({
    duration: calculateDuration(firstMotion),
    scenes: firstMotion,
  });
};

const refineWithStoryPlan = (input: VideoSpec, storyPlan: StoryPlan): VideoSpec => {
  const beatBoundScenes = buildBeatBoundScenes(input, storyPlan);
  const context = createDirectorContext();
  const composed = beatBoundScenes.map((beatBoundScene) => composeSceneFromBeat(beatBoundScene, context));
  const sorted = [...composed].sort((left, right) => left.start - right.start);
  const unique = uniqueScenes(sorted);
  const firstMotion = enforceFirstSceneMotion(unique);

  return videoSpecSchema.parse({
    duration: calculateDuration(firstMotion, storyPlan),
    scenes: firstMotion,
  });
};

const refine = (input: VideoSpec, options: RefineOptions = {}): VideoSpec => {
  if (!options.storyPlan) {
    return legacyRefine(input);
  }

  return refineWithStoryPlan(input, options.storyPlan);
};

export interface DirectorAgent {
  refine(videoSpec: VideoSpec, options?: RefineOptions): VideoSpec;
}

export interface DirectorAgentDependencies {
  logger?: Logger;
}

export const createDirectorAgent = (dependencies: DirectorAgentDependencies = {}): DirectorAgent => {
  const logger = dependencies.logger ?? silentLogger;

  const refineWithLogging = (videoSpec: VideoSpec, options: RefineOptions = {}): VideoSpec => {
    logger.info('Director agent: refining VideoSpec', {
      scenesBefore: videoSpec.scenes.length,
      durationBefore: videoSpec.duration,
      hasStoryPlan: options.storyPlan !== undefined,
      beatCount: options.storyPlan?.beats.length,
    });

    const refined = refine(videoSpec, options);

    logger.info('Director agent: refinement complete', {
      scenesAfter: refined.scenes.length,
      durationAfter: refined.duration,
    });

    return refined;
  };

  return {
    refine: refineWithLogging,
  };
};
