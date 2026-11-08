/**
 * 路径几何计算
 *
 * 所有与 DOM 无关的布局运算集中在这里，方便复用、测试和后续调整。
 *
 * 蜿蜒分两层叠加：
 * - 节点层：每个节点的横坐标有自己的摆动系数，整条路的骨架本身就左右游走；
 * - 段内层：两个节点之间按「波长」自动分配若干个平滑的波峰波谷，
 *   曲线像一根有弹性的绳子在节点之间反复缠绕。
 *
 * 段内层有两种形态（WindingMode），不同路径用不同形态：
 * - meander：正弦式大摆幅蜿蜒，波长与波幅成比例，弯头饱满不打折；
 * - loop：弹簧式回环，一段里自交叠出几个椭圆环，像盘起来的绳子。
 *
 * 每条学习路径都有一套自己的蜿蜒风格（WindingStyle）：
 * 形态、波长、波幅、整段偏向、谐波配比、纵向拉长倍率都不一样，
 * 因此 14 条路径的「长度」和「缠度」各不相同，并排看不重复。
 */

export interface TrailPoint {
  x: number;
  y: number;
}

export interface NodePosition extends TrailPoint {
  index: number;
}

/** 节点左右摆动的节奏，值为 -1 ~ 1。索引从 0 开始循环。 */
export type WobblePattern = number[];

/** 概览页兜底节奏：中 → 左 → 中 → 右 */
export const OVERVIEW_WOBBLE: WobblePattern = [0, -0.78, 0, 0.78];

/** 详情页兜底节奏：中 → 右 → 中 → 左 */
export const DETAIL_WOBBLE: WobblePattern = [0, 0.8, 0, -0.8];

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** 保留一位小数：SVG 路径数据更短，又不影响观感 */
const round1 = (value: number): number => Math.round(value * 10) / 10;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const smoothstep = (value: number): number => {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
};

/**
 * 确定性伪随机数（0~1）。
 * 同一序号永远得到同样的值，保证蜿蜒姿态在重渲染间不闪烁。
 */
export const edgeHash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** 把任意字符串散列成一个稳定的数值种子 */
export const stringSeed = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash % 100000) / 1000;
};

/* ------------------------------------------------------------------ *
 * 蜿蜒风格
 * ------------------------------------------------------------------ */

/** 谐波：频率倍率 + 权重。两三个互不整除的频率叠加，曲线不机械。 */
export interface WindingHarmonic {
  f: number;
  w: number;
}

/**
 * 段内蜿蜒形态：
 * - meander：正弦式大摆幅蜿蜒，长波大幅，像在平原上甩开的公路；
 * - loop：弹簧式回环，一段里绕出几个交叠的椭圆环，像盘起来的绳子。
 */
export type WindingMode = 'meander' | 'loop';

/**
 * 一条路径的蜿蜒「性格」。
 * 14 条学习路径各用一种，缠度、长度、摆动方式互不相同。
 */
export interface WindingStyle {
  id: string;
  name: string;
  /** 段内蜿蜒形态 */
  mode: WindingMode;
  /** 节点摆动节奏 */
  pattern: WobblePattern;
  /** 节点摆动幅度倍率 */
  swayScale: number;
  /** 摆动旋律相位种子：同一节奏的节点也不完全一样 */
  seed: number;
  /** 摆幅预算占比（0~1）：meander 是波幅，loop 是回环半径 */
  waveRatio: number;
  /**
   * 波长 = 波幅 × wavelengthRatio。
   * 让波长跟着波幅一起放大，每个弯头始终是饱满的圆弧，
   * 不会被拉成「一段长直线 + 一个硬折角」（旧的扁平感就是这么来的）。
   */
  wavelengthRatio: number;
  /** 谐波配比 */
  harmonics: WindingHarmonic[];
  /** 相位调制频率 */
  /** 段内相位 */
  phase: number;
  /** 包络指数：<1 两端收得更急、弯头更饱满；>1 中段更细 */
  envelope: number;
  /** 整段偏向的强度：让这一段整体往左/往右鼓出来 */
  lean: number;
  /** loop：每段基准圈数（段越长圈越多） */
  loopCount?: number;
  /** loop：纵向椭圆分量（相对回环半径），越大圈越扁 */
  loopSwing?: number;
  /** 纵向长度倍率：同一段题数，各路径的页面长度不同 */
  spacingScale: number;
  /** 段与段之间的参数差异幅度（0~1） */
  edgeJitter: number;
  /** 段级随机种子 */
  edgeSeed: number;
}

/**
 * 14 种蜿蜒风格，对应 14 条学习路径。
 *
 * 两种形态混搭：10 条大摆幅蜿蜒、4 条弹簧回环，
 * 让「蜿蜒程度」在路径之间拉开明显档次；
 * wavelengthRatio 越小弯越急，waveRatio 越大摆得越野，spacingScale 越大路越长。
 */
export const WINDING_STYLES: WindingStyle[] = [
  {
    id: 'serpentine',
    name: '蛇行',
    mode: 'meander',
    pattern: [0.1, 0.9, -0.05, -0.85],
    swayScale: 1,
    seed: 0.4,
    waveRatio: 1.0,
    wavelengthRatio: 1.45,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.72, w: 0.34 },
    ],
    phase: 0.12,
    envelope: 0.85,
    lean: 0.3,
    spacingScale: 1.18,
    edgeJitter: 0.32,
    edgeSeed: 1.1,
  },
  {
    id: 'switchback',
    name: '盘山折返',
    mode: 'meander',
    pattern: [0.95, -0.3, -0.9, 0.42],
    swayScale: 1,
    seed: 6.6,
    waveRatio: 1.16,
    wavelengthRatio: 1.35,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.55, w: 0.22 },
    ],
    phase: 0.5,
    envelope: 0.72,
    lean: 0.26,
    spacingScale: 1.5,
    edgeJitter: 0.28,
    edgeSeed: 7.9,
  },
  {
    id: 'wave',
    name: '潮汐推移',
    mode: 'meander',
    pattern: [0.55, -0.88, 0.78, -0.4],
    swayScale: 0.95,
    seed: 1.3,
    waveRatio: 0.96,
    wavelengthRatio: 1.55,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.68, w: 0.42 },
    ],
    phase: 0.4,
    envelope: 0.8,
    lean: 0.32,
    spacingScale: 1.04,
    edgeJitter: 0.3,
    edgeSeed: 2.3,
  },
  {
    id: 'reed',
    name: '折尺',
    mode: 'meander',
    pattern: [0.7, -0.72, 0.5, -0.95, 0.2],
    swayScale: 0.98,
    seed: 9.5,
    waveRatio: 0.9,
    wavelengthRatio: 1.4,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.9, w: 0.24 },
    ],
    phase: 0.18,
    envelope: 1.0,
    lean: 0.2,
    spacingScale: 1.24,
    edgeJitter: 0.34,
    edgeSeed: 10.3,
  },
  {
    id: 'spring',
    name: '链环弹簧',
    mode: 'loop',
    pattern: [0.55, -0.78, 0.85, -0.6, 0.3],
    swayScale: 1,
    seed: 10.4,
    waveRatio: 0.86,
    wavelengthRatio: 0.95,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.6, w: 0.3 },
    ],
    phase: 0.6,
    envelope: 0.9,
    lean: 0.15,
    loopCount: 1.8,
    loopSwing: 0.5,
    spacingScale: 1.42,
    edgeJitter: 0.2,
    edgeSeed: 11.9,
  },
  {
    id: 'vine',
    name: '藤蔓',
    mode: 'loop',
    pattern: [0.35, -0.95, 0.25, 0.7],
    swayScale: 1,
    seed: 4.1,
    waveRatio: 0.95,
    wavelengthRatio: 1.2,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.55, w: 0.45 },
    ],
    phase: 0.9,
    envelope: 0.75,
    lean: 0.3,
    loopCount: 1.3,
    loopSwing: 0.4,
    spacingScale: 1.3,
    edgeJitter: 0.26,
    edgeSeed: 5.3,
  },
  {
    id: 'figure-eight',
    name: '回环',
    mode: 'loop',
    pattern: [-0.85, 0.5, 0.92, -0.35],
    swayScale: 1,
    seed: 8.9,
    waveRatio: 0.84,
    wavelengthRatio: 0.95,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.62, w: 0.4 },
    ],
    phase: 0.75,
    envelope: 0.75,
    lean: 0.25,
    loopCount: 2.2,
    loopSwing: 0.55,
    spacingScale: 1.34,
    edgeJitter: 0.18,
    edgeSeed: 9.7,
  },
  {
    id: 'coil',
    name: '盘绕',
    mode: 'loop',
    pattern: [-0.75, 0.9, -0.65, 0.5],
    swayScale: 1,
    seed: 3.2,
    waveRatio: 0.74,
    wavelengthRatio: 0.9,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.75, w: 0.32 },
    ],
    phase: 0.25,
    envelope: 0.95,
    lean: 0.12,
    loopCount: 2.6,
    loopSwing: 0.44,
    spacingScale: 1.48,
    edgeJitter: 0.22,
    edgeSeed: 4.9,
  },
  {
    id: 'zigzag',
    name: '折半之字',
    mode: 'meander',
    pattern: [0.88, -0.62, 0.95, -0.78],
    swayScale: 1,
    seed: 2.1,
    waveRatio: 0.94,
    wavelengthRatio: 1.38,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.85, w: 0.3 },
    ],
    phase: 0.65,
    envelope: 1.0,
    lean: 0.22,
    spacingScale: 1.12,
    edgeJitter: 0.34,
    edgeSeed: 3.7,
  },
  {
    id: 'ripple',
    name: '散列涟漪',
    mode: 'meander',
    pattern: [0.2, -0.5, 0.65, -0.25, 0.45, -0.7],
    swayScale: 0.92,
    seed: 7.8,
    waveRatio: 0.9,
    wavelengthRatio: 1.6,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.9, w: 0.28 },
    ],
    phase: 0.33,
    envelope: 1.05,
    lean: 0.18,
    spacingScale: 1.5,
    edgeJitter: 0.38,
    edgeSeed: 8.3,
  },
  {
    id: 'pulse',
    name: '脉动',
    mode: 'meander',
    pattern: [0.8, -0.3, -0.88, 0.55, 0.15, -0.62],
    swayScale: 1,
    seed: 13.6,
    waveRatio: 1.0,
    wavelengthRatio: 1.42,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.7, w: 0.42 },
    ],
    phase: 0.45,
    envelope: 0.9,
    lean: 0.28,
    spacingScale: 1.2,
    edgeJitter: 0.36,
    edgeSeed: 14.3,
  },
  {
    id: 'stream',
    name: '溪流',
    mode: 'meander',
    pattern: [0.1, 0.7, -0.55, 0.25],
    swayScale: 0.9,
    seed: 5.4,
    waveRatio: 0.92,
    wavelengthRatio: 2.1,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.5, w: 0.18 },
    ],
    phase: 0.05,
    envelope: 0.7,
    lean: 0.42,
    spacingScale: 0.95,
    edgeJitter: 0.3,
    edgeSeed: 6.7,
  },
  {
    id: 'tide',
    name: '潮涌',
    mode: 'meander',
    pattern: [0.4, -0.95, 0.7, 0.85],
    swayScale: 0.96,
    seed: 12.8,
    waveRatio: 1.05,
    wavelengthRatio: 1.7,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.62, w: 0.36 },
    ],
    phase: 0.3,
    envelope: 0.7,
    lean: 0.36,
    spacingScale: 1.36,
    edgeJitter: 0.42,
    edgeSeed: 13.1,
  },
  {
    id: 'ribbon',
    name: '飘带',
    mode: 'meander',
    pattern: [-0.55, 0.95, -0.25, -0.82],
    swayScale: 1,
    seed: 11.7,
    waveRatio: 1.0,
    wavelengthRatio: 1.85,
    harmonics: [
      { f: 1, w: 1 },
      { f: 1.78, w: 0.26 },
    ],
    phase: 0.85,
    envelope: 0.72,
    lean: 0.3,
    spacingScale: 1.06,
    edgeJitter: 0.32,
    edgeSeed: 12.7,
  },
];

const STYLE_BY_ID = new Map(WINDING_STYLES.map(style => [style.id, style]));

/** 每条学习路径使用的蜿蜒风格 */
export const PATH_WINDING_STYLE: Record<string, string> = {
  hash: 'ripple',
  'two-pointers': 'switchback',
  'sliding-window': 'wave',
  array: 'reed',
  'linked-list': 'spring',
  'binary-tree': 'vine',
  graph: 'figure-eight',
  backtracking: 'coil',
  'binary-search': 'zigzag',
  stack: 'serpentine',
  heap: 'pulse',
  greedy: 'stream',
  'dynamic-programming': 'tide',
  techniques: 'ribbon',
};

/**
 * 取一条路径的蜿蜒风格。
 * 已知路径使用显式映射；未知 id 按字符串散列稳定落在一个风格上，
 * 保证「每一条路都不一样」且刷新后不跳变。
 */
export const getWindingStyle = (pathId?: string): WindingStyle => {
  const mapped = pathId ? PATH_WINDING_STYLE[pathId] : undefined;
  if (mapped && STYLE_BY_ID.has(mapped)) {
    return STYLE_BY_ID.get(mapped) as WindingStyle;
  }
  const seed = pathId ? stringSeed(`winding:${pathId}`) : 0;
  return WINDING_STYLES[Math.floor(edgeHash(seed * 1.7 + 0.37) * WINDING_STYLES.length)];
};

/* ------------------------------------------------------------------ *
 * 节点层：横向摆动
 * ------------------------------------------------------------------ */

export interface SwayVariant {
  /** 旋律相位种子 */
  seed?: number;
  /** 摆动幅度倍率 */
  scale?: number;
}

/**
 * 单个节点的横向摆动系数（-1 ~ 1）。
 *
 * 在固定节奏之上叠加两层确定性差异，让每个节点都有自己的姿态：
 * - depth：同样是「左/右」，有的节点摆得浅、有的摆得深（0.72~1.28）；
 * - drift：让中轴附近的节点也左右偏移（±0.21）。
 *
 * 传入 variant 后，旋律相位与随机种子随风格变化，
 * 于是不同路径的骨架本身就是不同的曲线。
 */
export const getNodeSway = (
  index: number,
  pattern: WobblePattern,
  variant: SwayVariant = {}
): number => {
  const { seed = 0, scale = 1 } = variant;
  const base = pattern[((index % pattern.length) + pattern.length) % pattern.length];
  const melody =
    0.3 * Math.sin(index * 0.63 + 1.7 + seed * 1.31) +
    0.18 * Math.sin(index * 1.43 + 0.35 + seed * 2.07);
  const depth = 0.72 + edgeHash(index * 7.31 + 1.7 + seed * 3.19) * 0.56;
  const drift = (edgeHash(index * 13.7 + 5.3 + seed * 5.71) - 0.5) * 0.42;
  const melodyWeight = 1 - Math.abs(base) * 0.35;
  return clamp((base * depth + melody * melodyWeight + drift) * scale, -1, 1);
};

/**
 * 计算节点横坐标，节点始终与容器边缘保持 margin 的安全距离。
 */
export const getNodeX = (
  index: number,
  width: number,
  amplitude: number,
  pattern: WobblePattern,
  margin = 56,
  variant: SwayVariant = {}
): number => {
  const factor = getNodeSway(index, pattern, variant);
  const center = width / 2;
  return clamp(center + factor * amplitude, margin, Math.max(margin, width - margin));
};

/**
 * 根据可用宽度计算摆动幅度，避免小屏幕上节点被裁切。
 */
export const getAmplitude = (
  width: number,
  preferred: number,
  margin = 56
): number => {
  const available = Math.max(0, width / 2 - margin);
  return Math.min(preferred, available);
};

/**
 * 概览页的纵向间距节奏（0.78~1.34）。
 * 让每一条「路」（相邻两个分类之间）的长度都明显不同。
 */
export const spacingRhythm = (index: number): number =>
  0.78 + edgeHash(index * 9.17 + 2.3) * 0.56;

/**
 * 详情页的纵向间距节奏（0.86~1.14）。
 * 详情页节点间还夹着题目标题与宝箱，幅度相对克制。
 */
export const detailSpacingRhythm = (index: number): number =>
  0.86 + edgeHash(index * 6.41 + 4.1) * 0.28;

/* ------------------------------------------------------------------ *
 * 曲线层：采样波浪 + Catmull-Rom 样条
 * ------------------------------------------------------------------ */

/**
 * 用 Catmull-Rom 样条把一串点连成平滑曲线（多个三次贝塞尔段）。
 *
 * clampY 打开时把控制点纵向夹在相邻两点之间：正弦蜿蜒因此不会「回头」
 * 画到上一个节点上面去。回环形态（loop）本身就要绕回来，
 * 必须关掉它，否则顶上的半个环会被压扁成直线。
 */
const catmullRomChain = (points: TrailPoint[], clampY = true): string => {
  if (points.length < 2) return '';

  let d = `M ${round1(points[0].x)} ${round1(points[0].y)}`;

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const pPrev = points[i - 2] ?? { x: p0.x * 2 - p1.x, y: p0.y * 2 - p1.y };
    const pNext = points[i + 1] ?? { x: p1.x * 2 - p0.x, y: p1.y * 2 - p0.y };

    const minY = Math.min(p0.y, p1.y);
    const maxY = Math.max(p0.y, p1.y);
    const c1x = p0.x + (p1.x - pPrev.x) / 6;
    const c1yRaw = p0.y + (p1.y - pPrev.y) / 6;
    const c2x = p1.x - (pNext.x - p0.x) / 6;
    const c2yRaw = p1.y - (pNext.y - p0.y) / 6;
    const c1y = clampY ? clamp(c1yRaw, minY, maxY) : c1yRaw;
    const c2y = clampY ? clamp(c2yRaw, minY, maxY) : c2yRaw;

    d += ` C ${round1(c1x)} ${round1(c1y)}, ${round1(c2x)} ${round1(c2y)}, ${round1(
      p1.x
    )} ${round1(p1.y)}`;
  }

  return d;
};

/**
 * 生成相邻两个节点之间的平滑曲线段（不做段内波浪，仅节点骨架）。
 * 保留给「只想要一根顺滑大弧」的场景与单元测试使用。
 */
export const buildSmoothConnectorPath = (
  from: TrailPoint,
  to: TrailPoint,
  prev: TrailPoint | null,
  next: TrailPoint | null
): string => {
  const px = prev ? prev.x : from.x * 2 - to.x;
  const py = prev ? prev.y : from.y * 2 - to.y;
  const nx = next ? next.x : to.x * 2 - from.x;
  const ny = next ? next.y : to.y * 2 - from.y;

  const c1x = from.x + (to.x - px) / 6;
  const c1y = from.y + (to.y - py) / 6;
  const c2x = to.x - (nx - from.x) / 6;
  const c2y = to.y - (ny - from.y) / 6;

  // 不做取整：这个函数的调用方（含单元测试）依赖「起止点就是节点本身」
  return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
};

export interface WindingConnectorOptions {
  /** 蜿蜒风格；缺省时用第一种（蛇行） */
  style?: WindingStyle;
  /** 段序号：让相邻段呈现不同的波数 / 相位 / 波幅 / 偏向 */
  edgeIndex?: number;
  /** 波幅预算（px，横向半宽）；缺省时用 minX/maxX 决定的半宽 */
  amplitude?: number;
  /** 横向安全边界 */
  minX?: number;
  maxX?: number;
  /** 强制使用大摆幅蜿蜒形态（总览页用），忽略风格的 loop */
  forceMeander?: boolean;
  /**
   * 强制使用圆头折返形态（总览页用）：横向大摆幅 + 纵向小椭圆 + 每段多圈。
   * 短段上纯正弦只能摆出一个 S，改用扁椭圆回环才能在有限高度里多绕几圈，
   * 且拐弯半径等于摆幅，天然圆润。
   */
  forceLoop?: boolean;
}

/** buildLoopPath 的形态覆盖参数 */
interface LoopOverride {
  countBase: number;
  swingRatio: number;
}

/** 每个波至少这么多个采样点，保证高次谐波也不出毛刺 */
const SAMPLES_PER_WAVE = 44;
/** 每个回环至少这么多个采样点，圆圈才不显多边形 */
const SAMPLES_PER_LOOP = 60;
const MAX_SAMPLES = 300;
const MIN_SAMPLES = 30;

/** 出刀/收刀：曲线在节点处先垂直离开，再由窄到宽地展开 */
const MOUTH_RUN = 0.14;

/** 高次谐波相对基波的总权重（基波保留满幅，谐波只做「不均匀」的调味） */
const harmonicWeightOf = (harmonics: WindingHarmonic[]): number =>
  harmonics.slice(1).reduce((sum, item) => sum + Math.abs(item.w), 0) || 1;

/** 谐波调味的上限系数：太小等于纯正弦，太大波峰会被拽出棱角 */
const HARMONIC_BLEND = 0.3;

/** 两遍 [1,2,1]/4 平滑：抹平频率调制留下的细微锯齿，曲线更像一根顺滑的绳子 */
const smoothOffsets = (offsets: number[]): number[] => {
  let result = offsets;
  for (let pass = 0; pass < 2; pass++) {
    const input = result;
    result = input.map((value, i) => {
      const prev = input[i - 1] ?? value;
      const next = input[i + 1] ?? value;
      return (prev + value * 2 + next) / 4;
    });
  }
  return result;
};

/**
 * 正弦式大摆幅蜿蜒。
 *
 * 采样一串横向摆动的中间点，再用 Catmull-Rom 串成 C1 连续的曲线：
 * - 波长 = 波幅 × wavelengthRatio，弯头始终圆润（不会被拉成扁平长条）；
 * - 波长驱动波数，长段自然弯更多；
 * - 段与段的相位 / 波数 / 偏向各自随机，每一段都是不一样的 S；
 * - 出刀收口（mouth）让曲线在节点处平滑进出，不会在节点边上打小钩；
 * - 贴边时整条波一起缩放（fitScale），不会逐点削平出直线和硬折角。
 */
const buildMeanderPath = (
  style: WindingStyle,
  from: TrailPoint,
  to: TrailPoint,
  budget: number,
  edgeIndex: number,
  minX: number,
  maxX: number
): string => {
  const edgeLength = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
  const noise = (salt: number) => edgeHash(edgeIndex * salt + style.edgeSeed);

  // 段级随机：相邻两段的波幅 / 波长 / 相位 / 偏向都不同
  const ratio = style.waveRatio * (0.9 + noise(7.13) * 0.2);
  const waveAmplitude = budget * ratio;
  const wavelength = Math.max(48, waveAmplitude * style.wavelengthRatio);
  const waves = clamp(
    (edgeLength / wavelength) * (1 + (noise(3.71) - 0.5) * 2 * style.edgeJitter),
    1.05,
    3.6
  );
  const phase = style.phase + noise(5.37);
  const lean = (noise(9.29) - 0.5) * 2 * style.lean;
  const envelope = clamp(style.envelope * (0.9 + noise(4.47) * 0.2), 0.45, 1.6);

  const harmonics = style.harmonics;
  const harmonicWeight = harmonicWeightOf(harmonics);
  const blend = HARMONIC_BLEND * Math.min(1, 1 / harmonicWeight);
  const sampleCount = clamp(
    Math.ceil(waves * SAMPLES_PER_WAVE),
    MIN_SAMPLES,
    MAX_SAMPLES
  );

  const rawOffsets: number[] = [];
  const bases: number[] = [];
  for (let k = 1; k < sampleCount; k++) {
    const t = k / sampleCount;

    // 基波满幅，高次谐波只按 HARMONIC_BLEND 调味：
    // 这样波峰仍能摆到接近整条预算，不会被谐波抵消成「矮胖波」
    let wobble = 0;
    for (let h = 0; h < harmonics.length; h++) {
      const { f, w } = harmonics[h];
      const term = Math.sin(2 * Math.PI * (f * waves * t + phase * (h + 1) * 0.61));
      wobble += h === 0 ? term : blend * w * term;
    }

    const gate = smoothstep(t / MOUTH_RUN) * smoothstep((1 - t) / MOUTH_RUN);
    const lobe = Math.pow(Math.sin(Math.PI * t), envelope) * gate;
    const bulk = Math.pow(Math.sin(Math.PI * t), 0.7) * lean * gate;

    rawOffsets.push(wobble * lobe + bulk);
    bases.push(lerp(from.x, to.x, t));
  }

  // 峰值归一：单波的波峰常落在包络还没长满的位置，不拉满就总是「矮一截」；
  // 这里把最高的那个波峰顶到满预算，整条路才够野
  const peak = Math.max(...rawOffsets.map(Math.abs)) || 1;
  const gain = waveAmplitude / peak;

  // 整体按峰值缩放：贴边时整条波一起收，不会削出平直段和硬折角
  let fitScale = 1;
  for (let i = 0; i < rawOffsets.length; i++) {
    const raw = rawOffsets[i] * gain;
    const room = raw >= 0
      ? Number.isFinite(maxX) ? maxX - bases[i] : Infinity
      : Number.isFinite(minX) ? bases[i] - minX : Infinity;
    if (room <= 0) {
      fitScale = 0;
      break;
    }
    if (Math.abs(raw) > room) fitScale = Math.min(fitScale, room / Math.abs(raw));
  }

  const offsets = smoothOffsets(rawOffsets.map(raw => raw * gain * fitScale));
  const points: TrailPoint[] = offsets.map((offset, i) => ({
    x: bases[i] + offset,
    y: lerp(from.y, to.y, (i + 1) / sampleCount),
  }));

  return catmullRomChain([from, ...points, to], true);
};

/**
 * 弹簧式回环。
 *
 * 横向绕圆、纵向回摆，一段里会绕出好几个交叠的环：
 * - 圈数随段长伸缩，宝箱那种短段自然只剩一圈出头；
 * - 半径整段统一（不做逐点缩放，圆圈才不会被压扁），
 *   只在「基线的可用横向空间」放不下时整体收缩；
 * - 纵向不打 clamp，否则每个环的顶会被压成一条直线。
 */
const buildLoopPath = (
  style: WindingStyle,
  from: TrailPoint,
  to: TrailPoint,
  budget: number,
  edgeIndex: number,
  minX: number,
  maxX: number,
  override?: LoopOverride
): string => {
  const edgeLength = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
  const noise = (salt: number) => edgeHash(edgeIndex * salt + style.edgeSeed);
  const count = clamp(
    (override?.countBase ?? style.loopCount ?? 1.8) *
      clamp(edgeLength / 360, 0.75, 1.4) *
      (0.9 + noise(3.71) * 0.2),
    1.05,
    3.8
  );

  const roomAt = (baseX: number): number =>
    Math.min(
      Number.isFinite(maxX) ? maxX - baseX : Infinity,
      Number.isFinite(minX) ? baseX - minX : Infinity
    );
  const room = Math.min(
    roomAt(from.x),
    roomAt(to.x),
    roomAt(lerp(from.x, to.x, 0.5))
  );
  let radius = budget * style.waveRatio * (0.92 + noise(7.13) * 0.16);
  if (Number.isFinite(room)) radius = Math.min(radius, Math.max(10, room * 0.94));

  // 纵向椭圆分量受段长约束：回环的环顶/环底不能越到相邻节点（含其名称胶囊）上去。
  // 两端节点要留出「节点半径 + 胶囊 + 间隙」的净空，环只能在中段之间鼓起来。
  const swingRatio = override?.swingRatio ?? style.loopSwing ?? 0.45;
  const nodeClearance = 92;
  const swingRoom = Math.max(48, edgeLength * 0.5 - nodeClearance);
  const swing = Math.min(radius * swingRatio, swingRoom);
  const phase = style.phase + noise(5.37);
  const sampleCount = clamp(
    Math.ceil(count * SAMPLES_PER_LOOP),
    MIN_SAMPLES,
    MAX_SAMPLES
  );

  const points: TrailPoint[] = [];
  for (let k = 1; k < sampleCount; k++) {
    const t = k / sampleCount;
    const phi = 2 * Math.PI * (count * t + phase);
    const gate = smoothstep(t / MOUTH_RUN) * smoothstep((1 - t) / MOUTH_RUN);

    // 横坐标绕圆、纵坐标椭圆回摆，相邻圈纵向交叠成一条辫子
    const offsetX = radius * Math.sin(phi) * gate;
    const offsetY = -swing * Math.cos(phi) * gate;

    points.push({
      x: lerp(from.x, to.x, t) + offsetX,
      y: lerp(from.y, to.y, t) + offsetY,
    });
  }

  // 横向偏移略做平滑，环的转角更顺；纵向保留解析形态
  const smoothedX = smoothOffsets(points.map(point => point.x));
  const result = points.map((point, i) => ({ x: smoothedX[i], y: point.y }));

  return catmullRomChain([from, ...result, to], false);
};

/**
 * 生成一条「会缠」的连接曲线。
 *
 * 形态由风格的 mode 决定：总览页可 forceMeander（大摆幅正弦）或
 * forceLoop（圆头折返，短段也能多绕几圈）统一改写。
 * 两种形态都保证：起止于两个节点本身、横向不越出 minX / maxX。
 */
export const buildWindingConnectorPath = (
  from: TrailPoint,
  to: TrailPoint,
  _prev: TrailPoint | null,
  _next: TrailPoint | null,
  options: WindingConnectorOptions = {}
): string => {
  const style = options.style ?? WINDING_STYLES[0];
  const mode: WindingMode = options.forceMeander
    ? 'meander'
    : options.forceLoop
    ? 'loop'
    : style.mode;
  const edgeIndex = options.edgeIndex ?? 0;
  const minX = options.minX ?? -Infinity;
  const maxX = options.maxX ?? Infinity;

  const edgeLength = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
  const center = (minX + maxX) / 2;
  const halfWidth = Number.isFinite(minX) && Number.isFinite(maxX)
    ? Math.min(maxX - center, center - minX)
    : edgeLength * 0.5;
  const budget = Math.min(options.amplitude ?? halfWidth, halfWidth);

  if (mode === 'meander') {
    return buildMeanderPath(style, from, to, budget, edgeIndex, minX, maxX);
  }

  // 圆头折返：圈数按风格的摆幅给基数，本就缠绕的风格再加档，
  // 纵向椭圆压扁（0.3 上下），横向摆幅撑满，拐弯半径≈摆幅，天然圆润。
  const countBase = options.forceLoop
    ? 1.9 + style.waveRatio * 0.55 + (style.loopCount ?? 0) * 0.45
    : undefined;
  const swingRatio = options.forceLoop
    ? 0.28 + (style.loopSwing ?? 0) * 0.22
    : undefined;
  return buildLoopPath(
    style,
    from,
    to,
    budget,
    edgeIndex,
    minX,
    maxX,
    countBase === undefined
      ? undefined
      : { countBase, swingRatio: swingRatio as number }
  );
};

/* ------------------------------------------------------------------ *
 * 布局
 * ------------------------------------------------------------------ */

/**
 * 概览页的节点坐标：纵向节奏排列 + 左右摆动。
 * styleAt 给每个节点自己的摆动风格；spacingAt 让每段「路」长度不同。
 */
export const buildOverviewPositions = (
  count: number,
  width: number,
  options: {
    startY: number;
    spacing: number;
    amplitude: number;
    styleAt?: (index: number) => WindingStyle | undefined;
    spacingAt?: (index: number) => number;
  }
): NodePosition[] => {
  const { startY, spacing, amplitude, styleAt, spacingAt } = options;
  const safeAmplitude = getAmplitude(width, amplitude);
  const positions: NodePosition[] = [];
  let y = startY;

  for (let index = 0; index < count; index++) {
    if (index > 0) {
      y += spacing * spacingRhythm(index) * (spacingAt?.(index) ?? 1);
    }
    const style = styleAt?.(index);
    positions.push({
      index,
      x: getNodeX(
        index,
        width,
        safeAmplitude,
        style?.pattern ?? OVERVIEW_WOBBLE,
        56,
        style ? { seed: style.seed, scale: style.swayScale } : undefined
      ),
      y,
    });
  }

  return positions;
};

/**
 * 详情页的节点坐标：基础等距 + 分段宝箱带来的额外间距。
 * 间距再乘上风格的 spacingScale，于是每条路径的「长度」都不一样。
 */
export interface DetailLayoutOptions {

  width: number;
  /** 每个宝箱前面的额外间距，不显示宝箱时传 0 */
  segmentGap: number;
  /** 该索引之前已经越过的宝箱数量 */
  treasuresBefore: (index: number) => number;
  startY?: number;
  spacing?: number;
  amplitude?: number;
  /** 该路径的蜿蜒风格 */
  style?: WindingStyle;
}

export const buildDetailPosition = (
  index: number,
  {
    width,
    segmentGap,
    treasuresBefore,
    startY = 40,
    spacing = 168,
    amplitude = 76,
    style,
  }: DetailLayoutOptions
): NodePosition => {
  // 回环形态要在节点两侧绕圈，节点骨架收窄一些，给环留出横向空间
  const skeleton =
    style && style.mode !== 'meander' ? amplitude * 0.55 : amplitude;
  const safeAmplitude = getAmplitude(width, skeleton, 48);
  const spacingScale = style?.spacingScale ?? 1;

  // 逐段累加间距节奏（确定性，结果与渲染顺序无关），让纵向节奏有松有紧
  let y = startY;
  for (let step = 1; step <= index; step++) {
    y += spacing * spacingScale * detailSpacingRhythm(step);
  }
  y += treasuresBefore(index) * segmentGap * spacingScale;

  return {
    index,
    x: getNodeX(
      index,
      width,
      safeAmplitude,
      style?.pattern ?? DETAIL_WOBBLE,
      48,
      style ? { seed: style.seed, scale: style.swayScale } : undefined
    ),
    y,
  };
};

/**
 * 计算两次取宝箱中间的坐标（用于宝箱与分段）。
 */
export const midpoint = (from: TrailPoint, to: TrailPoint): TrailPoint => ({
  x: (from.x + to.x) / 2,
  y: (from.y + to.y) / 2,
});
