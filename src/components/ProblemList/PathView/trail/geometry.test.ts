/**
 * 路径几何单元测试
 *
 * 重点覆盖「蜿蜒但不乱」的几条硬性质：
 * - 同样的索引永远得到同样的形状（不闪烁）；
 * - 相邻各段形状互不相同（用户反馈的「长得都一样」）；
 * - 曲线始终落在画布内、纵向不回折（不出怪线）。
 */
import {
  buildOverviewPositions,
  buildDetailPosition,
  buildSmoothConnectorPath,
  buildWindingConnectorPath,
  detailSpacingRhythm,
  edgeHash,
  getAmplitude,
  getNodeSway,
  getNodeX,
  getWindingStyle,
  PATH_WINDING_STYLE,
  WINDING_STYLES,
  DETAIL_WOBBLE,
  OVERVIEW_WOBBLE,
  TrailPoint,
} from './geometry';
import { learningPaths } from '../../data/learningPaths';

interface CubicSegment {
  p0: TrailPoint;
  c1: TrailPoint;
  c2: TrailPoint;
  p3: TrailPoint;
}

/** 解析 buildSmoothConnectorPath 产出的单段三次贝塞尔 */
const parseCubic = (d: string): CubicSegment => {
  const nums = d.match(/-?\d+(?:\.\d+)?/g);
  if (!nums || nums.length !== 8) {
    throw new Error(`不是单段三次贝塞尔: ${d}`);
  }
  const n = nums.map(Number);
  return {
    p0: { x: n[0], y: n[1] },
    c1: { x: n[2], y: n[3] },
    c2: { x: n[4], y: n[5] },
    p3: { x: n[6], y: n[7] },
  };
};

const sampleCubic = (segment: CubicSegment, steps = 64): TrailPoint[] => {
  const { p0, c1, c2, p3 } = segment;
  const points: TrailPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    points.push({
      x:
        u * u * u * p0.x +
        3 * u * u * t * c1.x +
        3 * u * t * t * c2.x +
        t * t * t * p3.x,
      y:
        u * u * u * p0.y +
        3 * u * u * t * c1.y +
        3 * u * t * t * c2.y +
        t * t * t * p3.y,
    });
  }
  return points;
};

/** 一段曲线的「形状签名」：横向跨度 + 最大回拉量 */
const shapeSignature = (d: string): string => {
  const points = sampleCubic(parseCubic(d));
  const xs = points.map(point => point.x);
  const ys = points.map(point => point.y);
  const span = Math.max(...xs) - Math.min(...xs);
  const drift = Math.max(...ys) - Math.min(...ys);
  return `${span.toFixed(2)}:${drift.toFixed(2)}`;
};

const linearTrend = (a: TrailPoint, b: TrailPoint, t: number): TrailPoint => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

describe('确定性与伪随机', () => {
  test('edgeHash 输出始终落在 [0, 1)', () => {
    for (let i = 0; i < 200; i++) {
      const value = edgeHash(i * 1.37);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  test('相同索引得到相同的摆动，不同索引摆动不同', () => {
    const first = getNodeSway(3, DETAIL_WOBBLE);
    expect(getNodeSway(3, DETAIL_WOBBLE)).toBe(first);

    const values = new Set<number>();
    for (let i = 0; i < 12; i++) {
      values.add(Number(getNodeSway(i, DETAIL_WOBBLE).toFixed(4)));
    }
    // 12 个节点里，摆动系数至少要有 9 种不同取值
    expect(values.size).toBeGreaterThanOrEqual(9);
  });

  test('摆动系数始终落在 -1 ~ 1', () => {
    for (let i = 0; i < 200; i++) {
      for (const pattern of [OVERVIEW_WOBBLE, DETAIL_WOBBLE]) {
        const sway = getNodeSway(i, pattern);
        expect(sway).toBeGreaterThanOrEqual(-1);
        expect(sway).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('节点坐标', () => {
  test('节点始终与容器边缘保持安全距离', () => {
    for (const width of [320, 390, 500, 680, 1024, 1920]) {
      for (const margin of [48, 56]) {
        const amplitude = getAmplitude(width, 160, margin);
        for (let i = 0; i < 40; i++) {
          const x = getNodeX(i, width, amplitude, DETAIL_WOBBLE, margin);
          expect(x).toBeGreaterThanOrEqual(margin);
          expect(x).toBeLessThanOrEqual(Math.max(margin, width - margin));
        }
      }
    }
  });

  test('概览页纵向单调递增（不会上下打架）', () => {
    const positions = buildOverviewPositions(14, 680, {
      startY: 100,
      spacing: 196,
      amplitude: 152,
    });

    for (let i = 1; i < positions.length; i++) {
      expect(positions[i].y).toBeGreaterThan(positions[i - 1].y);
    }
  });

  test('纵向间距有节奏，不是等距楼梯', () => {
    const positions = buildOverviewPositions(10, 680, {
      startY: 100,
      spacing: 196,
      amplitude: 152,
    });
    const gaps = positions
      .slice(1)
      .map((position, index) => position.y - positions[index].y);

    expect(new Set(gaps.map(gap => gap.toFixed(2))).size).toBeGreaterThan(3);
    // 节奏幅度在 0.78 ~ 1.34 倍之间（见 spacingRhythm）
    gaps.forEach(gap => {
      expect(gap).toBeGreaterThanOrEqual(196 * 0.76);
      expect(gap).toBeLessThanOrEqual(196 * 1.36);
    });
  });

  test('详情页宝箱占位是叠加的额外间距', () => {
    const options = {
      width: 700,
      segmentGap: 120,
      treasuresBefore: () => 0,
      startY: 40,
      spacing: 168,
      amplitude: 108,
    };
    const plain = buildDetailPosition(7, options);
    const withTreasure = buildDetailPosition(7, {
      ...options,
      treasuresBefore: () => 1,
    });

    expect(withTreasure.y - plain.y).toBe(120);
    expect(withTreasure.x).toBe(plain.x);
  });

  test('详情页间距节奏在克制区间内', () => {
    for (let i = 1; i < 60; i++) {
      expect(detailSpacingRhythm(i)).toBeGreaterThanOrEqual(0.85);
      expect(detailSpacingRhythm(i)).toBeLessThanOrEqual(1.15);
    }
  });
});

describe('连接曲线', () => {
  const detailNodes = Array.from({ length: 12 }, (_, index) =>
    buildDetailPosition(index, {
      width: 700,
      segmentGap: 0,
      treasuresBefore: () => 0,
      startY: 40,
      spacing: 168,
      amplitude: 108,
    })
  );

  const buildEach = (nodes: TrailPoint[]): string[] =>
    nodes.slice(0, -1).map((node, index) =>
      buildSmoothConnectorPath(
        node,
        nodes[index + 1],
        nodes[index - 1] ?? null,
        nodes[index + 2] ?? null
      )
    );

  test('曲线起止于两个节点本身', () => {
    const paths = buildEach(detailNodes);
    paths.forEach((d, index) => {
      const segment = parseCubic(d);
      const from = detailNodes[index];
      const to = detailNodes[index + 1];
      expect(segment.p0).toEqual({ x: from.x, y: from.y });
      expect(segment.p3).toEqual({ x: to.x, y: to.y });
    });
  });

  test('相邻各段形状互不相同（核心诉求）', () => {
    const signatures = buildEach(detailNodes).map(shapeSignature);
    const unique = new Set(signatures);

    expect(unique.size).toBeGreaterThanOrEqual(signatures.length - 1);
  });

  test('曲线不会越出画布左右边界', () => {
    const width = 700;
    buildEach(detailNodes).forEach(d => {
      sampleCubic(parseCubic(d)).forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(width);
      });
    });
  });

  test('曲线纵向不回折（不会画到上一个节点上面去）', () => {
    buildEach(detailNodes).forEach(d => {
      const points = sampleCubic(parseCubic(d));
      for (let i = 1; i < points.length; i++) {
        // 允许极小的数值抖动，但不允许明显回头
        expect(points[i].y).toBeGreaterThanOrEqual(points[i - 1].y - 0.5);
      }
    });
  });

  test('曲线偏离两点连线的距离受控，不会甩出夸张的大弧', () => {
    buildEach(detailNodes).forEach((d, index) => {
      const from = detailNodes[index];
      const to = detailNodes[index + 1];
      sampleCubic(parseCubic(d)).forEach(point => {
        const trend = linearTrend(from, to, (point.y - from.y) / (to.y - from.y));
        expect(Math.abs(point.x - trend.x)).toBeLessThan(140);
      });
    });
  });

  test('首尾两段缺少邻点时用镜像补齐，不产生 NaN', () => {
    const first = buildSmoothConnectorPath(detailNodes[0], detailNodes[1], null, detailNodes[2]);
    const last = buildSmoothConnectorPath(
      detailNodes[detailNodes.length - 2],
      detailNodes[detailNodes.length - 1],
      detailNodes[detailNodes.length - 3],
      null
    );

    [first, last].forEach(d => {
      expect(d).not.toContain('NaN');
      expect(d).not.toContain('Infinity');
    });
  });

  test('概览页同样满足：各段不同、不越界、不回折', () => {

    const width = 680;
    const positions = buildOverviewPositions(10, width, {
      startY: 120,
      spacing: 196,
      amplitude: 152,
    });
    const paths = buildEach(positions);

    expect(new Set(paths.map(shapeSignature)).size).toBeGreaterThanOrEqual(
      paths.length - 1
    );

    paths.forEach(d => {
      const points = sampleCubic(parseCubic(d));
      points.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(width);
      });
      for (let i = 1; i < points.length; i++) {
        expect(points[i].y).toBeGreaterThanOrEqual(points[i - 1].y - 0.5);
      }
    });
  });
});

/* ------------------------------------------------------------------ *
 * 段内蜿蜒：一条路径在两个节点之间要来回摆动很多次
 * ------------------------------------------------------------------ */

/** 解析由多个三次贝塞尔段拼成的曲线 */
const parseCubicChain = (d: string): CubicSegment[] => {
  const tokens = d.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g) ?? [];
  const segments: CubicSegment[] = [];
  let current: TrailPoint = { x: 0, y: 0 };
  let i = 0;

  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'M') {
      current = { x: Number(tokens[i++]), y: Number(tokens[i++]) };
    } else if (command === 'C') {
      const c1 = { x: Number(tokens[i++]), y: Number(tokens[i++]) };
      const c2 = { x: Number(tokens[i++]), y: Number(tokens[i++]) };
      const p3 = { x: Number(tokens[i++]), y: Number(tokens[i++]) };
      segments.push({ p0: current, c1, c2, p3 });
      current = p3;
    } else {
      i++;
    }
  }

  return segments;
};

const sampleChain = (d: string, stepsPerSegment = 24): TrailPoint[] =>
  parseCubicChain(d).flatMap(segment => sampleCubic(segment, stepsPerSegment));

/** 横向来回摆动的次数（dx 变号次数） */
const countXReversals = (points: TrailPoint[]): number => {
  let reversals = 0;
  let lastSign = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    if (Math.abs(dx) < 0.08) continue;
    const sign = Math.sign(dx);
    if (lastSign !== 0 && sign !== lastSign) reversals++;
    lastSign = sign;
  }
  return reversals;
};

/** 整条曲线的形状签名（用于判断两条路是否长得一样） */
const chainSignature = (d: string): string =>
  sampleChain(d)
    .map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(';');

describe('段内蜿蜒（每段内反复摆动）', () => {
  const width = 700;
  const amplitude = 128;
  const nodes = Array.from({ length: 8 }, (_, index) =>
    buildDetailPosition(index, {
      width,
      segmentGap: 0,
      treasuresBefore: () => 0,
      startY: 40,
      spacing: 168,
      amplitude,
      style: WINDING_STYLES[0],
    })
  );

  const windingPath = (
    style: (typeof WINDING_STYLES)[number],
    edgeIndex = 0
  ): string =>
    buildWindingConnectorPath(
      nodes[0],
      nodes[1],
      null,
      nodes[2],
      { style, edgeIndex, amplitude, minX: 12, maxX: width - 12 }
    );

  test.each(WINDING_STYLES.map(style => [style.name, style] as const))(
    '%s 风格在单段内反复摆动',
    (_name, style) => {
      // 大摆幅蜿蜒每段至少一个完整 S（两次折返）；
      // 弹簧回环每绕一圈也是两次折返，短段至少绕一圈，所以下限同样是两次
      const minimum = 2;
      for (let edge = 0; edge < 6; edge++) {
        const reversals = countXReversals(sampleChain(windingPath(style, edge)));
        expect(reversals).toBeGreaterThanOrEqual(minimum);
      }
    }
  );

  test('14 种风格里两种蜿蜒形态都存在（不是清一色正弦，也不是清一色绕圈）', () => {
    const modes = new Set(WINDING_STYLES.map(style => style.mode));
    expect(modes.has('meander')).toBe(true);
    expect(modes.has('loop')).toBe(true);
  });

  test('14 种风格在同一段上形状两两不同', () => {
    const signatures = WINDING_STYLES.map(style => chainSignature(windingPath(style)));
    expect(new Set(signatures).size).toBe(WINDING_STYLES.length);
  });

  test('同一风格的相邻两段也不一样', () => {
    const style = WINDING_STYLES[0];
    const first = chainSignature(windingPath(style, 0));
    const second = chainSignature(windingPath(style, 1));
    expect(first).not.toBe(second);
  });

  test('14 条学习路径各自映射到不同的蜿蜒风格', () => {
    expect(learningPaths.length).toBe(WINDING_STYLES.length);
    const styles = learningPaths.map(path => getWindingStyle(path.id).id);
    expect(new Set(styles).size).toBe(learningPaths.length);
    learningPaths.forEach(path => {
      expect(PATH_WINDING_STYLE[path.id]).toBeDefined();
    });
  });

  test('不同路径的详情页骨架互不相同', () => {
    const signatures = learningPaths.map(path => {
      const style = getWindingStyle(path.id);
      return Array.from({ length: 10 }, (_, index) =>
        buildDetailPosition(index, {
          width,
          segmentGap: 0,
          treasuresBefore: () => 0,
          startY: 40,
          spacing: 168,
          amplitude,
          style,
        })
      )
        .map(node => `${node.x.toFixed(1)}:${node.y.toFixed(1)}`)
        .join(';');
    });

    expect(new Set(signatures).size).toBe(learningPaths.length);
  });

  test('任意风格、任意宽度下曲线不越界且不出怪线', () => {
    for (const width of [320, 390, 500, 700, 1024]) {
      for (const style of WINDING_STYLES) {
        const segmentNodes = Array.from({ length: 3 }, (_, index) =>
          buildDetailPosition(index, {
            width,
            segmentGap: 0,
            treasuresBefore: () => 0,
            startY: 40,
            spacing: 168,
            amplitude: width < 480 ? 74 : 128,
            style,
          })
        );
        const d = buildWindingConnectorPath(
          segmentNodes[0],
          segmentNodes[1],
          null,
          segmentNodes[2],
          {
            style,
            edgeIndex: 2,
            amplitude: width < 480 ? 74 : 128,
            minX: 12,
            maxX: width - 12,
          }
        );
        const points = sampleChain(d);
        expect(points.length).toBeGreaterThan(10);
        points.forEach(point => {
          expect(point.x).toBeGreaterThanOrEqual(12);
          expect(point.x).toBeLessThanOrEqual(width - 12);
        });

        const failures: string[] = [];
        if (style.mode === 'meander') {
          // 正弦蜿蜒不回头：不会画到上一个节点上面去
          for (let i = 1; i < points.length; i++) {
            if (points[i].y < points[i - 1].y - 0.5) {
              failures.push(`meander 回头: ${points[i].y} < ${points[i - 1].y}`);
            }
          }
        } else {
          // 回环本来就要绕回来，只约束它别甩出整段之外
          const minY = Math.min(segmentNodes[0].y, segmentNodes[1].y);
          const maxY = Math.max(segmentNodes[0].y, segmentNodes[1].y);
          points.forEach(point => {
            if (point.y < minY - 260 || point.y > maxY + 260) {
              failures.push(`回环甩出整段: y=${point.y}`);
            }
          });
        }
        expect(failures).toEqual([]);
      }
    }
  });

  test('每条路的长度拉得开：单段弧长至少是纵向跨度的 2.4 倍，风格之间再拉开档次', () => {
    const width = 820;
    const arcRatios = WINDING_STYLES.map(style => {
      // 用画布中段的一对节点：不受「节点贴边、波被迫收窄」的影响，
      // 量到的就是这一种风格本身能缠多长
      const nodes: TrailPoint[] = [
        { x: width / 2 - 70, y: 40 },
        { x: width / 2 + 70, y: 400 },
      ];
      const d = buildWindingConnectorPath(nodes[0], nodes[1], null, null, {
        style,
        edgeIndex: 1,
        amplitude: 320,
        minX: 14,
        maxX: width - 14,
      });
      const points = sampleChain(d, 40);
      let arc = 0;
      for (let i = 1; i < points.length; i++) {
        arc += Math.hypot(
          points[i].x - points[i - 1].x,
          points[i].y - points[i - 1].y
        );
      }
      // 用纵向跨度衡量「一屏能装下多少路」：弧长 / Δy
      return arc / Math.max(1, nodes[1].y - nodes[0].y);
    });

    arcRatios.forEach(ratio => expect(ratio).toBeGreaterThan(2.4));
    // 最缠的一条至少是最缓和的一条的 1.8 倍，并排看不会「每段都差不多」
    expect(Math.max(...arcRatios) / Math.min(...arcRatios)).toBeGreaterThan(1.8);
  });

  test('概览页 14 条路径的节点横向铺得很开（不再是三列楼梯）', () => {
    const pathIds = learningPaths.map(path => path.id);
    const positions = buildOverviewPositions(pathIds.length, 680, {
      startY: 100,
      spacing: 196,
      amplitude: 172,
      styleAt: index => getWindingStyle(pathIds[index]),
    });

    const xs = positions.map(position => position.x.toFixed(1));
    expect(new Set(xs).size).toBeGreaterThanOrEqual(10);
    const mean = positions.reduce((sum, position) => sum + position.x, 0) / positions.length;
    const variance =
      positions.reduce((sum, position) => sum + (position.x - mean) ** 2, 0) /
      positions.length;
    expect(variance).toBeGreaterThan(1500);
  });
});
