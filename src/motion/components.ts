import {Circle, Icon, Layout, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {StyleTokens} from '../config/styleTokens.js';
import type {EntityVisualStyle} from '../design/styleResolver.js';
import {ComponentType} from '../schema/visualGrammar.js';
import {resolveLucideIconForComponent} from '../v2/catalog/iconCatalog.js';

export interface ComponentFactoryInput {
  id: string;
  position: {x: number; y: number};
  label?: string;
  icon?: string;
  style?: EntityVisualStyle;
}

export type ComponentFactory = (input: ComponentFactoryInput) => Node;

const DEFAULT_STYLE: EntityVisualStyle = {
  size: StyleTokens.sizes.medium,
  opacity: StyleTokens.opacity.secondary,
  color: StyleTokens.colors.states.normal,
  strokeWidth: StyleTokens.stroke.normal,
  strokeColor: StyleTokens.colors.connection,
  glow: false,
  glowColor: StyleTokens.effects.glowColor,
  glowBlur: StyleTokens.effects.glowBlur,
  textColor: StyleTokens.colors.text,
  fontSize: StyleTokens.text.fontSizeSecondary,
  fontWeight: StyleTokens.text.fontWeight,
  status: 'normal',
};

const NO_SHADOW_COLOR = StyleTokens.colors.background;

const resolveStyle = (style?: EntityVisualStyle): EntityVisualStyle =>
  style ? {...DEFAULT_STYLE, ...style} : {...DEFAULT_STYLE};

const scaleByStyle = (value: number, style: EntityVisualStyle): number =>
  value * (style.size / StyleTokens.sizes.medium);

const createLabel = (text: string, y: number, style: EntityVisualStyle): Txt =>
  new Txt({
    text,
    y,
    fill: style.textColor,
    fontFamily: StyleTokens.text.fontFamily,
    fontSize: Math.max(20, style.fontSize),
    fontWeight: style.fontWeight,
  });

const findLastTextNode = (node: Node): Txt | undefined => {
  let result: Txt | undefined;

  if (node instanceof Txt) {
    result = node;
  }

  for (const child of node.children()) {
    const nestedResult = findLastTextNode(child);
    if (nestedResult) {
      result = nestedResult;
    }
  }

  return result;
};

const findFirstIconNode = (node: Node): Icon | undefined => {
  if (node instanceof Icon) {
    return node;
  }

  for (const child of node.children()) {
    const nested = findFirstIconNode(child);
    if (nested) {
      return nested;
    }
  }

  return undefined;
};

const createCard = (
  input: ComponentFactoryInput,
  options: {
    label: string;
    width: number;
    height: number;
    radius: number;
    rotation?: number;
    labelOffset?: number;
  },
): Rect => {
  const style = resolveStyle(input.style);
  const width = scaleByStyle(options.width, style);
  const height = scaleByStyle(options.height, style);
  const labelOffset = options.labelOffset ?? 22;

  const node = new Rect({
    x: input.position.x,
    y: input.position.y,
    width,
    height,
    radius: scaleByStyle(options.radius, style),
    rotation: options.rotation ?? 0,
    lineWidth: style.strokeWidth,
    stroke: style.strokeColor,
    fill: style.color,
    opacity: style.opacity,
    shadowColor: style.glow ? style.glowColor : NO_SHADOW_COLOR,
    shadowBlur: style.glow ? style.glowBlur : 0,
    children: [
      createLabel(options.label, height / 2 + scaleByStyle(labelOffset, style), style),
    ],
  });

  return node;
};

export const applyComponentVisualStyle = (node: Node, styleInput?: EntityVisualStyle): void => {
  const style = resolveStyle(styleInput);

  node.opacity(style.opacity);
  node.shadowColor(style.glow ? style.glowColor : NO_SHADOW_COLOR);
  node.shadowBlur(style.glow ? style.glowBlur : 0);

  if (node instanceof Icon) {
    // Icon inherits Rect in Motion Canvas; keep its geometry transparent
    // so we render only glyph strokes and no square background panel.
    node.color(style.strokeColor);
    node.fill(null);
    node.stroke(null);
    node.lineWidth(0);
  } else if (node instanceof Rect || node instanceof Circle) {
    node.fill(style.color);
    node.stroke(style.strokeColor);
    node.lineWidth(style.strokeWidth);
  }

  if (node instanceof Line) {
    node.stroke(style.strokeColor);
    node.lineWidth(Math.max(StyleTokens.stroke.thin, style.strokeWidth - 1));
  }

  if (node instanceof Txt) {
    node.fill(style.textColor);
    node.fontFamily(StyleTokens.text.fontFamily);
    node.fontSize(Math.max(16, style.fontSize - 4));
    node.fontWeight(style.fontWeight);
  }

  for (const child of node.children()) {
    applyComponentVisualStyle(child, style);
  }
};

export const applyComponentLabel = (node: Node, label?: string): void => {
  if (!label) {
    return;
  }

  const labelNode = findLastTextNode(node);
  if (!labelNode) {
    return;
  }

  labelNode.text(label);
};

export const applyComponentIcon = (
  node: Node,
  type: ComponentType,
  iconInput?: string,
  styleInput?: EntityVisualStyle,
): void => {
  const style = resolveStyle(styleInput);
  const iconName = resolveLucideIconForComponent(type, iconInput);
  const iconNode = findFirstIconNode(node);
  if (!iconNode) {
    return;
  }

  iconNode.icon(`lucide:${iconName}`);
  iconNode.color(style.strokeColor);
  iconNode.fill(null);
  iconNode.stroke(null);
  iconNode.lineWidth(0);
  iconNode.opacity(Math.min(1, style.opacity * 0.98));
};

export const createUsers = (input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const avatarSize = scaleByStyle(26, style);
  const cluster = new Layout({
    x: input.position.x,
    y: input.position.y,
    layout: true,
    direction: 'row',
    gap: scaleByStyle(12, style),
    opacity: style.opacity,
  });

  for (let index = 0; index < 3; index += 1) {
    const user = new Layout({
      layout: true,
      direction: 'column',
      alignItems: 'center',
      gap: scaleByStyle(3, style),
    });
    user.add(
      new Circle({
        width: avatarSize * 0.75,
        height: avatarSize * 0.75,
        fill: style.color,
      }),
    );
    user.add(
      new Rect({
        width: avatarSize * 0.9,
        height: avatarSize * 0.55,
        radius: scaleByStyle(8, style),
        fill: style.color,
      }),
    );

    cluster.add(
      new Rect({
        width: avatarSize * 1.5,
        height: avatarSize * 1.5,
        radius: scaleByStyle(14, style),
        lineWidth: style.strokeWidth,
        stroke: style.strokeColor,
        fill: StyleTokens.colors.background,
        children: [user],
      }),
    );
  }

  cluster.add(createLabel(input.label ?? 'Users', scaleByStyle(50, style), style));
  cluster.shadowColor(style.glow ? style.glowColor : NO_SHADOW_COLOR);
  cluster.shadowBlur(style.glow ? style.glowBlur : 0);

  return cluster;
};

export const createServer = (input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const node = createCard(input, {
    label: input.label ?? 'Server',
    width: 170,
    height: 128,
    radius: 14,
  });
  const rackWidth = scaleByStyle(120, style);
  const rackHeight = scaleByStyle(16, style);
  const rackGap = scaleByStyle(10, style);

  for (let index = 0; index < 3; index += 1) {
    const y = scaleByStyle(-24, style) + index * (rackHeight + rackGap);
    node.add(
      new Rect({
        width: rackWidth,
        height: rackHeight,
        y,
        radius: scaleByStyle(5, style),
        lineWidth: Math.max(1, style.strokeWidth - 1),
        stroke: style.strokeColor,
        fill: StyleTokens.colors.background,
      }),
    );
    node.add(
      new Circle({
        width: scaleByStyle(8, style),
        height: scaleByStyle(8, style),
        x: rackWidth * 0.44,
        y,
        fill: style.textColor,
      }),
    );
  }

  return node;
};

export const createLoadBalancer = (input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const node = createCard(input, {
    label: input.label ?? 'Load Balancer',
    width: 156,
    height: 116,
    radius: 14,
  });
  const coreRadius = scaleByStyle(14, style);
  const branchOffsetX = scaleByStyle(42, style);
  const branchOffsetY = scaleByStyle(22, style);
  const spinner = new Node({});
  (spinner as Node & {lbSpinnerTag?: boolean}).lbSpinnerTag = true;

  spinner.add(
    new Line({
      points: [
        [-branchOffsetX, 0],
        [0, 0],
        [branchOffsetX, -branchOffsetY],
      ],
      stroke: style.strokeColor,
      lineWidth: Math.max(2, style.strokeWidth - 1),
    }),
  );
  spinner.add(
    new Line({
      points: [
        [0, 0],
        [branchOffsetX, 0],
      ],
      stroke: style.strokeColor,
      lineWidth: Math.max(2, style.strokeWidth - 1),
    }),
  );
  spinner.add(
    new Line({
      points: [
        [0, 0],
        [branchOffsetX, branchOffsetY],
      ],
      stroke: style.strokeColor,
      lineWidth: Math.max(2, style.strokeWidth - 1),
    }),
  );

  spinner.add(
    new Circle({
      width: coreRadius * 2,
      height: coreRadius * 2,
      fill: StyleTokens.colors.background,
      stroke: style.strokeColor,
      lineWidth: Math.max(2, style.strokeWidth - 1),
    }),
  );

  node.add(spinner);

  return node;
};

export const createDatabase = (input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const width = scaleByStyle(170, style);
  const height = scaleByStyle(130, style);
  const topHeight = scaleByStyle(26, style);

  return new Layout({
    x: input.position.x,
    y: input.position.y,
    opacity: style.opacity,
    shadowColor: style.glow ? style.glowColor : NO_SHADOW_COLOR,
    shadowBlur: style.glow ? style.glowBlur : 0,
    children: [
      new Rect({
        width,
        height,
        y: scaleByStyle(8, style),
        fill: style.color,
        stroke: style.strokeColor,
        lineWidth: style.strokeWidth,
      }),
      new Circle({
        width,
        height: topHeight,
        y: -height / 2 + scaleByStyle(8, style),
        fill: style.color,
        stroke: style.strokeColor,
        lineWidth: style.strokeWidth,
      }),
      new Circle({
        width,
        height: topHeight,
        y: height / 2 + scaleByStyle(8, style),
        fill: style.color,
        stroke: style.strokeColor,
        lineWidth: style.strokeWidth,
      }),
      createLabel(input.label ?? 'Database', height / 2 + scaleByStyle(34, style), style),
    ],
  });
};

export const createCache = (input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const node = createCard(input, {
    label: input.label ?? 'Cache',
    width: 160,
    height: 116,
    radius: 12,
  });

  const barWidth = scaleByStyle(100, style);
  const barHeight = scaleByStyle(11, style);
  const gap = scaleByStyle(6, style);
  for (let index = 0; index < 3; index += 1) {
    node.add(
      new Rect({
        width: barWidth,
        height: barHeight,
        y: scaleByStyle(-18, style) + index * (barHeight + gap),
        radius: scaleByStyle(4, style),
        fill: StyleTokens.colors.background,
        stroke: style.strokeColor,
        lineWidth: Math.max(1, style.strokeWidth - 1),
      }),
    );
  }

  return node;
};

export const createQueue = (input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const width = scaleByStyle(148, style);
  const barHeight = scaleByStyle(16, style);
  const queue = new Layout({
    x: input.position.x,
    y: input.position.y,
    layout: true,
    direction: 'column',
    gap: scaleByStyle(8, style),
    opacity: style.opacity,
    shadowColor: style.glow ? style.glowColor : NO_SHADOW_COLOR,
    shadowBlur: style.glow ? style.glowBlur : 0,
  });

  for (let index = 0; index < 4; index += 1) {
    queue.add(
      new Rect({
        width,
        height: barHeight,
        radius: scaleByStyle(6, style),
        fill: style.color,
        stroke: style.strokeColor,
        lineWidth: Math.max(StyleTokens.stroke.thin, style.strokeWidth - 1),
      }),
    );
  }

  queue.add(createLabel(input.label ?? 'Queue', scaleByStyle(40, style), style));
  return queue;
};

export const createCdn = (input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const size = scaleByStyle(62, style);
  const node = new Layout({
    x: input.position.x,
    y: input.position.y,
    opacity: style.opacity,
    shadowColor: style.glow ? style.glowColor : NO_SHADOW_COLOR,
    shadowBlur: style.glow ? style.glowBlur : 0,
    children: [
      new Circle({width: size, height: size, x: -size * 0.4, fill: style.color}),
      new Circle({
        width: size * 1.2,
        height: size * 1.2,
        x: size * 0.2,
        y: -size * 0.08,
        fill: style.color,
      }),
      new Circle({width: size * 0.9, height: size * 0.9, x: size * 0.72, fill: style.color}),
      new Circle({
        width: size * 0.62,
        height: size * 0.62,
        y: size * 0.08,
        fill: StyleTokens.colors.background,
        stroke: style.strokeColor,
        lineWidth: Math.max(1, style.strokeWidth - 1),
      }),
      createLabel(input.label ?? 'CDN', scaleByStyle(62, style), style),
    ],
  });

  return node;
};

export const createWorker = (input: ComponentFactoryInput): Node =>
  createCard(input, {
    label: input.label ?? 'Worker',
    width: 136,
    height: 136,
    radius: 14,
  });

const toDefaultLabel = (type: ComponentType): string =>
  type
    .split('_')
    .map((part) => {
      if (part === 'cdn') {
        return 'CDN';
      }
      if (part === 'dns') {
        return 'DNS';
      }
      if (part === 'waf') {
        return 'WAF';
      }
      if (part === 'api') {
        return 'API';
      }
      if (part === 'llm') {
        return 'LLM';
      }
      if (part === 'jwt') {
        return 'JWT';
      }
      if (part === 'tls') {
        return 'TLS';
      }
      if (part === 'oauth') {
        return 'OAuth';
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');

const createIconOnlyComponent = (type: ComponentType, input: ComponentFactoryInput): Node => {
  const style = resolveStyle(input.style);
  const iconName = resolveLucideIconForComponent(type, input.icon);
  const iconSize = scaleByStyle(104, style);
  const label = input.label;

  const children: Node[] = [
    new Icon({
      icon: `lucide:${iconName}`,
      size: iconSize,
      y: 0,
      color: style.strokeColor,
      fill: null,
      stroke: null,
      lineWidth: 0,
      opacity: Math.min(1, style.opacity * 0.98),
    }),
  ];
  if (label) {
    children.push(createLabel(label, iconSize / 2 + scaleByStyle(32, style), style));
  }

  return new Layout({
    x: input.position.x,
    y: input.position.y,
    opacity: style.opacity,
    shadowColor: style.glow ? style.glowColor : NO_SHADOW_COLOR,
    shadowBlur: style.glow ? style.glowBlur : 0,
    children,
  });
};

export const componentFactoryMap: Partial<Record<ComponentType, ComponentFactory>> = {
  [ComponentType.UsersCluster]: createUsers,
  [ComponentType.SingleUser]: createUsers,
  [ComponentType.MobileApp]: createUsers,
  [ComponentType.WebBrowser]: createUsers,
  [ComponentType.AdminUser]: createUsers,
  [ComponentType.ThirdPartyService]: createUsers,
  [ComponentType.IotDevices]: createUsers,
  [ComponentType.Dns]: createLoadBalancer,
  [ComponentType.Server]: createServer,
  [ComponentType.MonolithApp]: createServer,
  [ComponentType.Microservice]: createServer,
  [ComponentType.AuthService]: createServer,
  [ComponentType.UserService]: createServer,
  [ComponentType.PaymentService]: createServer,
  [ComponentType.NotificationService]: createServer,
  [ComponentType.MediaService]: createServer,
  [ComponentType.SearchService]: createServer,
  [ComponentType.VirtualMachine]: createServer,
  [ComponentType.Container]: createServer,
  [ComponentType.KubernetesCluster]: createServer,
  [ComponentType.AutoScalingGroup]: createServer,
  [ComponentType.WorkerNode]: createServer,
  [ComponentType.JobProcessor]: createServer,
  [ComponentType.LoadBalancer]: createLoadBalancer,
  [ComponentType.Waf]: createLoadBalancer,
  [ComponentType.ApiGateway]: createLoadBalancer,
  [ComponentType.ReverseProxy]: createLoadBalancer,
  [ComponentType.RateLimiter]: createLoadBalancer,
  [ComponentType.Database]: createDatabase,
  [ComponentType.PrimaryDatabase]: createDatabase,
  [ComponentType.ReadReplica]: createDatabase,
  [ComponentType.ShardedDatabase]: createDatabase,
  [ComponentType.SqlDatabase]: createDatabase,
  [ComponentType.NoSqlDatabase]: createDatabase,
  [ComponentType.TimeSeriesDatabase]: createDatabase,
  [ComponentType.GraphDatabase]: createDatabase,
  [ComponentType.ObjectStorage]: createDatabase,
  [ComponentType.MediaStorage]: createDatabase,
  [ComponentType.BackupStorage]: createDatabase,
  [ComponentType.Cache]: createCache,
  [ComponentType.EdgeCache]: createCache,
  [ComponentType.QueryCache]: createCache,
  [ComponentType.ApplicationCache]: createCache,
  [ComponentType.Queue]: createQueue,
  [ComponentType.MessageQueue]: createQueue,
  [ComponentType.EventStream]: createQueue,
  [ComponentType.PubSub]: createQueue,
  [ComponentType.DeadLetterQueue]: createQueue,
  [ComponentType.BatchProcessor]: createQueue,
  [ComponentType.Cdn]: createCdn,
  [ComponentType.InternetCloud]: createCdn,
  [ComponentType.VpcBoundary]: createCdn,
  [ComponentType.PublicSubnet]: createCdn,
  [ComponentType.PrivateSubnet]: createCdn,
  [ComponentType.FirewallBoundary]: createCdn,
  [ComponentType.ShardIndicator]: createCdn,
  [ComponentType.GlobalRegion]: createCdn,
  [ComponentType.FailoverNode]: createCdn,
  [ComponentType.HealthCheck]: createCdn,
  [ComponentType.CircuitBreaker]: createCdn,
  [ComponentType.RetryPolicy]: createCdn,
  [ComponentType.MultiRegion]: createCdn,
  [ComponentType.AuthorizationLock]: createCdn,
  [ComponentType.OAuthProvider]: createCdn,
  [ComponentType.JwtToken]: createCdn,
  [ComponentType.TlsEncryption]: createCdn,
  [ComponentType.SecretsManager]: createCdn,
  [ComponentType.Logs]: createCdn,
  [ComponentType.MetricsDashboard]: createCdn,
  [ComponentType.Monitoring]: createCdn,
  [ComponentType.Alerting]: createCdn,
  [ComponentType.Tracing]: createCdn,
  [ComponentType.PaymentGateway]: createCdn,
  [ComponentType.EmailSmsService]: createCdn,
  [ComponentType.MapsService]: createCdn,
  [ComponentType.SocialLogin]: createCdn,
  [ComponentType.LlmApi]: createCdn,
  [ComponentType.Worker]: createWorker,
};

const fallbackFactory: ComponentFactory = (input) =>
  createCard(input, {
    label: input.label ?? 'Component',
    width: 164,
    height: 112,
    radius: 12,
  });

export const createComponentNode = (type: ComponentType, input: ComponentFactoryInput): Node => {
  const node = createIconOnlyComponent(type, input);
  if (input.style) {
    applyComponentVisualStyle(node, input.style);
  }
  applyComponentIcon(node, type, input.icon, input.style);
  return node;
};
