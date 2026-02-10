import {Circle, Layout, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import type {Position} from '../schema/videoSpec.schema.js';
import {ComponentType} from '../schema/visualGrammar.js';

export interface ComponentFactoryInput {
  id: string;
  position: Position;
}

export type ComponentFactory = (input: ComponentFactoryInput) => Node;

const createLabel = (text: string, y: number): Txt =>
  new Txt({
    text,
    y,
    fill: '#e2e8f0',
    fontFamily: 'JetBrains Mono',
    fontSize: 26,
  });

export const createUsers = ({id, position}: ComponentFactoryInput): Node => {
  const cluster = new Layout({
    x: position.x,
    y: position.y,
    layout: true,
    direction: 'row',
    gap: 16,
  });

  for (let index = 0; index < 3; index += 1) {
    const avatar = new Circle({
      width: 52,
      height: 52,
      fill: '#3b82f6',
      stroke: '#bfdbfe',
      lineWidth: 3,
      children: [
        new Txt({
          text: 'U',
          fill: '#f8fafc',
          fontFamily: 'JetBrains Mono',
          fontSize: 20,
        }),
      ],
    });

    cluster.add(avatar);
  }

  cluster.add(createLabel('Users', 64));
  return cluster;
};

export const createServer = ({id, position}: ComponentFactoryInput): Node =>
  new Rect({
    x: position.x,
    y: position.y,
    width: 170,
    height: 210,
    radius: 14,
    fill: '#0f172a',
    stroke: '#334155',
    lineWidth: 4,
    children: [
      new Rect({width: 120, height: 8, y: -52, fill: '#1e293b'}),
      new Rect({width: 120, height: 8, y: -28, fill: '#1e293b'}),
      new Circle({width: 12, height: 12, x: -32, y: 58, fill: '#22c55e'}),
      new Circle({width: 12, height: 12, x: 0, y: 58, fill: '#22c55e'}),
      new Circle({width: 12, height: 12, x: 32, y: 58, fill: '#ef4444'}),
      createLabel('Server', 112),
    ],
  });

export const createLoadBalancer = ({id, position}: ComponentFactoryInput): Node =>
  new Rect({
    x: position.x,
    y: position.y,
    width: 120,
    height: 120,
    rotation: 45,
    radius: 12,
    fill: '#1d4ed8',
    stroke: '#93c5fd',
    lineWidth: 4,
    children: [
      new Txt({
        text: 'LB',
        fill: '#f8fafc',
        rotation: -45,
        fontFamily: 'JetBrains Mono',
        fontSize: 30,
      }),
      createLabel('Load Balancer', 104),
    ],
  });

export const createDatabase = ({id, position}: ComponentFactoryInput): Node =>
  new Rect({
    x: position.x,
    y: position.y,
    width: 180,
    height: 190,
    radius: 72,
    fill: '#111827',
    stroke: '#cbd5e1',
    lineWidth: 4,
    children: [
      new Rect({width: 180, height: 26, y: -54, radius: 72, stroke: '#cbd5e1', lineWidth: 3}),
      new Rect({width: 180, height: 26, y: -10, radius: 72, stroke: '#cbd5e1', lineWidth: 3}),
      new Rect({width: 180, height: 26, y: 34, radius: 72, stroke: '#cbd5e1', lineWidth: 3}),
      createLabel('Database', 114),
    ],
  });

export const createCache = ({id, position}: ComponentFactoryInput): Node =>
  new Rect({
    x: position.x,
    y: position.y,
    width: 150,
    height: 120,
    radius: 12,
    fill: '#f59e0b',
    stroke: '#fef3c7',
    lineWidth: 4,
    children: [
      new Txt({
        text: 'CACHE',
        fill: '#0f172a',
        fontFamily: 'JetBrains Mono',
        fontSize: 28,
      }),
      createLabel('Cache', 92),
    ],
  });

export const createQueue = ({id, position}: ComponentFactoryInput): Node => {
  const queue = new Layout({
    x: position.x,
    y: position.y,
    layout: true,
    direction: 'column',
    gap: 10,
  });

  for (let index = 0; index < 4; index += 1) {
    queue.add(
      new Rect({
        width: 150,
        height: 20,
        radius: 6,
        fill: '#7c3aed',
        stroke: '#ddd6fe',
        lineWidth: 2,
      }),
    );
  }

  queue.add(createLabel('Queue', 72));
  return queue;
};

export const createCdn = ({id, position}: ComponentFactoryInput): Node =>
  new Layout({
    x: position.x,
    y: position.y,
    children: [
      new Circle({width: 70, height: 70, x: -36, y: 0, fill: '#38bdf8'}),
      new Circle({width: 92, height: 92, x: 10, y: -6, fill: '#0ea5e9'}),
      new Circle({width: 62, height: 62, x: 52, y: 4, fill: '#0284c7'}),
      new Txt({
        text: 'CDN',
        y: 2,
        fill: '#f8fafc',
        fontFamily: 'JetBrains Mono',
        fontSize: 30,
      }),
      createLabel('CDN', 86),
    ],
  });

export const createWorker = ({id, position}: ComponentFactoryInput): Node =>
  new Rect({
    x: position.x,
    y: position.y,
    width: 150,
    height: 150,
    radius: 12,
    fill: '#16a34a',
    stroke: '#bbf7d0',
    lineWidth: 4,
    children: [
      new Txt({
        text: 'W',
        fill: '#052e16',
        fontFamily: 'JetBrains Mono',
        fontSize: 56,
      }),
      new Line({
        lineWidth: 3,
        stroke: '#dcfce7',
        points: [
          [-40, 26],
          [40, 26],
        ],
      }),
      createLabel('Worker', 98),
    ],
  });

export const componentFactoryMap: Record<ComponentType, ComponentFactory> = {
  [ComponentType.UsersCluster]: createUsers,
  [ComponentType.Server]: createServer,
  [ComponentType.LoadBalancer]: createLoadBalancer,
  [ComponentType.Database]: createDatabase,
  [ComponentType.Cache]: createCache,
  [ComponentType.Queue]: createQueue,
  [ComponentType.Cdn]: createCdn,
  [ComponentType.Worker]: createWorker,
};

export const createComponentNode = (type: ComponentType, input: ComponentFactoryInput): Node =>
  componentFactoryMap[type](input);
