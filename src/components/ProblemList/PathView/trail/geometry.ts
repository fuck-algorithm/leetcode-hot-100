/**
 * 路径几何计算
 *
 * 所有与 DOM 无关的布局运算集中在这里，方便复用、测试和后续调整。
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

/** 概览页：中 → 左 → 中 → 右，形成一条舒展的蛇形路径 */
export const OVERVIEW_WOBBLE: WobblePattern = [0, -0.78, 0, 0.78];

/** 详情页：中 → 右 → 中 → 左 */
export const DETAIL_WOBBLE: WobblePattern = [0, 0.8, 0, -0.8];

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * 计算节点横坐标。
 * 节点始终与容器边缘保持 margin 的安全距离。
 */
export const getNodeX = (
  index: number,
  width: number,
  amplitude: number,
  pattern: WobblePattern,
  margin = 56
): number => {
  const factor = pattern[((index % pattern.length) + pattern.length) % pattern.length];
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
 * 生成两个节点之间的连接曲线。
 *
 * 曲线从上一节点的底部出发、从下一节点的顶部进入，控制点让路径保持
 * 竖直方向的切线，得到多邻国那种圆润的 S 形，而不是生硬的斜线。
 */
export const buildConnectorPath = (
  from: TrailPoint,
  to: TrailPoint,
  fromRadius = 0,
  toRadius = 0
): string => {
  const startY = from.y + fromRadius;
  const endY = to.y - toRadius;

  if (endY <= startY) {
    return `M ${from.x} ${startY} L ${to.x} ${endY}`;
  }

  const offset = (endY - startY) * 0.48;
  const c1y = startY + offset;
  const c2y = endY - offset;

  return `M ${from.x} ${startY} C ${from.x} ${c1y}, ${to.x} ${c2y}, ${to.x} ${endY}`;
};

/**
 * 概览页的节点坐标：等距纵向排列 + 左右摆动。
 */
export const buildOverviewPositions = (
  count: number,
  width: number,
  options: { startY: number; spacing: number; amplitude: number }
): NodePosition[] => {
  const { startY, spacing, amplitude } = options;
  const safeAmplitude = getAmplitude(width, amplitude);

  return Array.from({ length: count }, (_, index) => ({
    index,
    x: getNodeX(index, width, safeAmplitude, OVERVIEW_WOBBLE),
    y: startY + index * spacing,
  }));
};

/**
 * 详情页的节点坐标：基础等距 + 分段宝箱带来的额外间距。
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
  }: DetailLayoutOptions
): NodePosition => {
  const safeAmplitude = getAmplitude(width, amplitude, 48);
  return {
    index,
    x: getNodeX(index, width, safeAmplitude, DETAIL_WOBBLE, 48),
    y: startY + index * spacing + treasuresBefore(index) * segmentGap,
  };
};

/**
 * 计算两次取宝箱中间的坐标（用于宝箱与分段）。
 */
export const midpoint = (from: TrailPoint, to: TrailPoint): TrailPoint => ({
  x: (from.x + to.x) / 2,
  y: (from.y + to.y) / 2,
});
