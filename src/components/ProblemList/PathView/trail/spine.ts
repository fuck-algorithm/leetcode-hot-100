/**
 * 从贝塞尔路径采样点，生成"龙脊尖刺"。
 *
 * 为什么不能直接用 pattern / dasharray：
 *   pattern 是轴对齐的，dasharray 只会画成圆点/短划，两者都无法让尖刺
 *   *顺着曲线方向* 朝外张开。龙脊要的正是"每个尖刺都垂直于当地切线"，
 *   所以必须真的沿路径微分、算出法线。
 *
 * 路径形态是 `M x y` 加若干 `C c1 c2 p` 段（Catmull-Rom 转出的三次贝塞尔），
 * 这里按贝塞尔公式逐段细分采样。
 */

export interface SpineSpike {
  /** 尖刺三角形的三个点，直接拼成 path d */
  d: string;
  /** 序号，用于让相邻尖刺的大小略有差异 */
  index: number;
}

export interface Pt {
  x: number;
  y: number;
}

interface Cubic {
  p0: Pt;
  c1: Pt;
  c2: Pt;
  p3: Pt;
}

const NUM = '-?\\d+(?:\\.\\d+)?';
const PATH_RE = new RegExp(
  `([MLC])\\s*(${NUM})[ ,]+(${NUM})(?:[ ,]+(${NUM})[ ,]+(${NUM})(?:[ ,]+(${NUM})[ ,]+(${NUM}))?)?`,
  'g'
);

/** 把路径拆成有序的贝塞尔段 */
const parseSegments = (d: string): Cubic[] => {
  const segs: Cubic[] = [];
  let cur: Pt | null = null;
  let m: RegExpExecArray | null;
  PATH_RE.lastIndex = 0;
  while ((m = PATH_RE.exec(d))) {
    const cmd = m[1];
    const nums = m.slice(2).filter(v => v !== undefined).map(Number);
    if (cmd === 'M') {
      cur = { x: nums[0], y: nums[1] };
    } else if (cmd === 'L') {
      if (!cur) continue;
      const next = { x: nums[0], y: nums[1] };
      // 直线段用退化贝塞尔表示（控制点落在端点上）
      segs.push({ p0: cur, c1: cur, c2: next, p3: next });
      cur = next;
    } else if (cmd === 'C' && cur && nums.length >= 6) {
      const c1 = { x: nums[0], y: nums[1] };
      const c2 = { x: nums[2], y: nums[3] };
      const p3 = { x: nums[4], y: nums[5] };
      segs.push({ p0: cur, c1, c2, p3 });
      cur = p3;
    }
  }
  return segs;
};

/** 三次贝塞尔求值 */
const bezier = (seg: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const dd = t * t * t;
  return {
    x: a * seg.p0.x + b * seg.c1.x + c * seg.c2.x + dd * seg.p3.x,
    y: a * seg.p0.y + b * seg.c1.y + c * seg.c2.y + dd * seg.p3.y,
  };
};

/** 按固定步长重采样整条路径 */
export const samplePathPoints = (d: string, step: number): Pt[] => {
  const segs = parseSegments(d);
  if (!segs.length) return [];
  // 单段细分步数：按控制点包围盒估算长度，保证采样密度大致均匀
  const out: Pt[] = [];
  for (const seg of segs) {
    const rough =
      Math.hypot(seg.c1.x - seg.p0.x, seg.c1.y - seg.p0.y) +
      Math.hypot(seg.c2.x - seg.c1.x, seg.c2.y - seg.c1.y) +
      Math.hypot(seg.p3.x - seg.c2.x, seg.p3.y - seg.c2.y);
    const steps = Math.max(2, Math.min(60, Math.ceil(rough / step)));
    for (let i = 0; i <= steps; i++) {
      // 段间接缝只保留一个点
      if (i === 0 && out.length) continue;
      out.push(bezier(seg, i / steps));
    }
  }
  return out;
};

/**
 * 生成沿路径的尖刺。
 *
 * @param d        路径
 * @param side     -1 = 朝上（左法线），1 = 朝下（右法线）
 * @param every    每隔多少个采样点放一根刺
 * @param height   刺长（px）
 * @param base     刺底宽度（px）
 */
export const buildSpineSpikes = (
  d: string,
  side: -1 | 1,
  every: number,
  height: number,
  base: number
): SpineSpike[] => {
  const pts = samplePathPoints(d, 6);
  if (pts.length < 4) return [];

  const out: SpineSpike[] = [];
  let acc = 0;
  let nextAt = every;
  let idx = 0;

  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[i - 1];
    const dx = p.x - q.x;
    const dy = p.y - q.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.001) continue;
    acc += len;
    if (acc < nextAt) continue;
    nextAt += every;
    idx++;

    // 当地单位切线 -> 法线。
    // 关键：法线必须"永远朝视觉上方"，不能跟着曲线前进方向翻转。
    // 之前用固定左法线（-ty, tx），曲线从上往下走时它会翻到龙身内侧，
    // 表现为"直段朝上、弯段朝里"，像一排乱插的牙签。
    // 做法：取两个候选法线，选 y 分量更小的那个（即更朝上）。
    const tx = dx / len;
    const ty = dy / len;
    let nx = -ty * side;
    let ny = tx * side;
    if (ny > 0) {          // 若当前法线朝下，就翻转成朝上
      nx = -nx;
      ny = -ny;
    }

    // 大小轻微起伏，避免一排刺像梳齿一样死板
    const vary = 0.75 + ((idx * 7) % 5) / 10;
    const h = height * vary;

    // 刺底沿切线方向张开，刺尖沿法线方向
    const bx = tx * base * 0.5;
    const by = ty * base * 0.5;
    const tipX = p.x + nx * h;
    const tipY = p.y + ny * h;

    out.push({
      index: idx,
      d: `M ${(p.x - bx).toFixed(1)} ${(p.y - by).toFixed(1)} L ${tipX.toFixed(1)} ${tipY.toFixed(
        1
      )} L ${(p.x + bx).toFixed(1)} ${(p.y + by).toFixed(1)} Z`,
    });
  }

  return out;
};
