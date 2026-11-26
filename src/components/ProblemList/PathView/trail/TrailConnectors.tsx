import React from 'react';

import { buildSpineSpikes, samplePathPoints } from './spine';
import { DragonClaw } from './DragonClaw';

/** 路面材质：不同分类的路用不同的小路风格，整页看起来更丰富 */
export type RoadMaterial = 'brick' | 'cobble' | 'wood' | 'asphalt' | 'scale';

export const ROAD_MATERIALS: RoadMaterial[] = ['brick', 'cobble', 'wood', 'asphalt'];

export interface TrailConnection {
  key: string;
  /** SVG path 的 d 属性 */
  d: string;
  completed: boolean;
  /** 路面材质；缺省用柏油 */
  material?: RoadMaterial;
  /**
   * 身体粗细系数（0.75~1.25）。
   * 一条龙从尾到头应当逐渐变粗：尾端细、靠近龙头处最粗。
   * 缺省 1（等粗），详情页路径不需要这个。
   */
  girth?: number;
}

interface DragonEnds {
  /** 龙首位置（路线起点一侧） */
  head?: { x: number; y: number; scale: number; completed: boolean };
  /** 龙尾位置（路线终点一侧） */
  tail?: { x: number; y: number; scale: number; completed: boolean };
}

interface TrailConnectorsProps {
  className: string;
  width: number;
  height: number;
  connections: TrailConnection[];
  /**
   * simple: 详情页使用的单层路径（保持既有的视觉契约）
   * raised: 概览页使用的多层路径，画成有纹理、有厚度的实心小路
   */
  variant?: 'simple' | 'raised';
  /** 概览页把整条路理解为一条龙：首尾各补一个装饰件 */
  dragon?: DragonEnds;
  /** 是否在若干段上画龙爪 */
  claws?: boolean;
  completed?: boolean;
}

const SIMPLE_COMPLETED = '#ffd700';
const SIMPLE_PENDING = '#d0d0d0';

const MATERIAL_LABEL: Record<RoadMaterial, string> = {
  brick: '红砖',
  cobble: '碎石',
  wood: '木板',
  asphalt: '柏油',
  scale: '龙鳞',
};

/** 各材质的基色（路基比路面深一档，用于做出厚度） */
const BASE_COLOR: Record<RoadMaterial, string> = {
  brick: '#8d4a32',
  cobble: '#6e7378',
  wood: '#8a5a34',
  asphalt: '#b9bfc7',
  scale: '#8a5209',
};

/**
 * 材质图案定义。
 *
 * 全部用 SVG <pattern> 铺在描边上：pattern 会随路径自动铺展，
 * 在任意弯折处都贴合，不需要 Path2D 或 canvas 纹理映射。
 * patternUnits="userSpaceOnUse" 让砖块/石块在整页保持统一的尺度，
 * 相邻两段之间不会有明显的接缝错位。
 */
const RoadPatterns: React.FC = () => (
  <defs>
    {/* ---- 红砖：错缝砌法。
         砖块尺寸按"路面宽 15px"反推：纵向 3 排砖铺满整条路宽，
         每块砖约 7.5 宽 × 4.6 高，接近真实铺路砖的长宽比。
         之前 pattern 定死 20×10 导致砖被横向拉长、纵向只露一排，
         看着像细条纹。 */}
    <pattern id="trail-pat-brick" width="15" height="13.8" patternUnits="userSpaceOnUse">
      <rect width="15" height="13.8" fill="#7d3f2a" />
      {/* 第 1 排：两块整砖 */}
      <rect x="0.5" y="0.6" width="6.5" height="3.6" rx="0.8" fill="#c2634a" />
      <rect x="8.1" y="0.6" width="6.5" height="3.6" rx="0.8" fill="#b85840" />
      <rect x="8.1" y="0.6" width="6.5" height="0.9" rx="0.8" fill="#d0755c" opacity="0.5" />
      {/* 第 2 排：错半砖 */}
      <rect x="-3.2" y="5.0" width="6.5" height="3.6" rx="0.8" fill="#bc5c44" />
      <rect x="4.4" y="5.0" width="6.5" height="3.6" rx="0.8" fill="#c96a4a" />
      <rect x="11.9" y="5.0" width="6.5" height="3.6" rx="0.8" fill="#b25238" />
      <rect x="4.4" y="5.0" width="6.5" height="0.9" rx="0.8" fill="#d87a5e" opacity="0.45" />
      {/* 第 3 排：与第 1 排对齐 */}
      <rect x="0.5" y="9.4" width="6.5" height="3.6" rx="0.8" fill="#b5573f" />
      <rect x="8.1" y="9.4" width="6.5" height="3.6" rx="0.8" fill="#c4644a" />
      <rect x="8.1" y="9.4" width="6.5" height="0.9" rx="0.8" fill="#d47a5f" opacity="0.4" />
    </pattern>

    {/* ---- 碎石小径：鹅卵石铺满整条路宽，石子大小约 5px ---- */}
    <pattern id="trail-pat-cobble" width="15" height="12" patternUnits="userSpaceOnUse">
      <rect width="15" height="12" fill="#666c72" />
      <ellipse cx="3.4" cy="3.2" rx="3" ry="2.5" fill="#a8adb3" />
      <ellipse cx="3" cy="2.6" rx="1.8" ry="1.3" fill="#c4c9ce" opacity="0.65" />
      <ellipse cx="10.2" cy="3" rx="2.8" ry="2.3" fill="#98a0a7" />
      <ellipse cx="9.8" cy="2.4" rx="1.6" ry="1.1" fill="#b6bdc3" opacity="0.55" />
      <ellipse cx="1" cy="8.4" rx="2.8" ry="2.4" fill="#9aa2a9" />
      <ellipse cx="6.8" cy="8.6" rx="3.1" ry="2.6" fill="#b2b8be" />
      <ellipse cx="6.4" cy="7.9" rx="1.9" ry="1.3" fill="#c9ced3" opacity="0.55" />
      <ellipse cx="12.4" cy="8.6" rx="2.6" ry="2.2" fill="#949ba2" />
      <ellipse cx="9.5" cy="10.8" rx="2.2" ry="1.6" fill="#8d949b" />
      <ellipse cx="14" cy="2" rx="2" ry="1.6" fill="#a2a9b0" />
    </pattern>

    {/* ---- 木板栈道：纵向长条板 + 木纹。
         和红砖刻意区分：红砖是横向错缝的短块，木板是顺着路面方向的长条，
         板与板之间有一条深缝，上面再点几道木纹。 */}
    <pattern id="trail-pat-wood" width="22" height="26" patternUnits="userSpaceOnUse">
      <rect width="22" height="26" fill="#4d2f16" />
      {/* 三根纵向木板：对齐路宽 20，板条更粗 */}
      <rect x="1" y="0" width="6" height="26" rx="1" fill="#c08a52" />
      <rect x="8.2" y="0" width="6" height="26" rx="1" fill="#b88149" />
      <rect x="15.4" y="0" width="5.6" height="26" rx="1" fill="#c9945c" />
      {/* 板面高光 */}
      <rect x="1.6" y="0" width="1.5" height="26" fill="#d9a771" opacity="0.45" />
      <rect x="8.8" y="0" width="1.4" height="26" fill="#cf9a5f" opacity="0.35" />
      <rect x="16" y="0" width="1.3" height="26" fill="#ddaa72" opacity="0.4" />
      {/* 横向木纹 */}
      <rect x="1" y="6" width="6" height="1" fill="#8d5c2e" opacity="0.55" />
      <rect x="1" y="17" width="6" height="0.9" fill="#8d5c2e" opacity="0.4" />
      <rect x="8.2" y="11" width="6" height="1" fill="#8d5c2e" opacity="0.5" />
      <rect x="8.2" y="21" width="6" height="0.8" fill="#8d5c2e" opacity="0.35" />
      <rect x="15.4" y="8" width="5.6" height="0.9" fill="#8d5c2e" opacity="0.45" />
      <rect x="15.4" y="19" width="5.6" height="1" fill="#8d5c2e" opacity="0.4" />
    </pattern>

    {/* ---- 柏油：细颗粒 ---- */}
    <pattern id="trail-pat-asphalt" width="14" height="10" patternUnits="userSpaceOnUse">
      <rect width="14" height="10" fill="#eceff3" />
      <circle cx="2.5" cy="2" r="0.7" fill="#cdd4dc" />
      <circle cx="8.5" cy="1.2" r="0.5" fill="#d6dce3" />
      <circle cx="11.5" cy="4.5" r="0.8" fill="#c9d1da" />
      <circle cx="4.5" cy="6" r="0.6" fill="#d2d9e0" />
      <circle cx="9" cy="8" r="0.7" fill="#ccd4dc" />
      <circle cx="1" cy="8.5" r="0.5" fill="#d8dee4" />
    </pattern>

    {/* ---- 龙鳞：叠瓦状鳞片。
         两排错半鳞，每片是下缘带弧的半圆，上缘压一道亮边——
         这样看起来像"鳞片层层压着"，而不是一片片孤立的圆点。 ---- */}
    <pattern id="trail-pat-scale" width="10" height="9" patternUnits="userSpaceOnUse">
      <rect width="10" height="9" fill="#c98a1e" />
      {/* 上排 */}
      <path d="M0.6 4.6 Q 3 1.2 5.4 4.6 Q 3 6.2 0.6 4.6 Z" fill="#f0bc3f" />
      <path d="M0.9 4.2 Q 3 1.6 5.1 4.2" stroke="#fff3b8" strokeWidth="0.7" fill="none" opacity="0.75" />
      <path d="M5.4 4.6 Q 7.8 1.2 10.2 4.6 Q 7.8 6.2 5.4 4.6 Z" fill="#e5ab35" />
      <path d="M5.7 4.2 Q 7.8 1.6 9.9 4.2" stroke="#fff3b8" strokeWidth="0.7" fill="none" opacity="0.65" />
      {/* 下排（错半鳞） */}
      <path d="M-1.9 8.7 Q 0.5 5.3 2.9 8.7 Q 0.5 10.3 -1.9 8.7 Z" fill="#e0a22c" />
      <path d="M3.1 8.7 Q 5.5 5.3 7.9 8.7 Q 5.5 10.3 3.1 8.7 Z" fill="#eeb640" />
      <path d="M3.4 8.3 Q 5.5 5.7 7.6 8.3" stroke="#fff3b8" strokeWidth="0.65" fill="none" opacity="0.6" />
      <path d="M8.1 8.7 Q 10.5 5.3 12.9 8.7 Q 10.5 10.3 8.1 8.7 Z" fill="#d99c29" />
    </pattern>

    {/* 投影滤镜 */}
    <filter id="trail-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>
);

/**
 * 一条小路 = 四层
 *
 *   1. 投影   — 让路面从背景浮起来
 *   2. 路基   — 比路面深、整体下沉，形成厚度
 *   3. 路面   — 材质图案（红砖 / 碎石 / 木板 / 柏油）
 *   4. 内阴影 — 贴边一圈暗色，做出路面微凹的立体感
 *   5. 柔光   — 很淡的一道中间光，给材质一点润泽（不遮纹理）
 *
 * 完成态不做整体换色，而是提亮 + 加一层绿色辉光：
 * 这样红砖还是红砖、木板还是木板，材质辨识度不会被"已完成"吃掉。
 */
const RaisedRoad: React.FC<{ connection: TrailConnection }> = ({ connection }) => {
  const done = connection.completed;
  const material: RoadMaterial = connection.material ?? 'asphalt';
  const fill = `url(#trail-pat-${material})`;
  // 身体粗细：尾端细、接近龙头处粗，让整条龙有"体量"而不像一根软管
  const g = connection.girth ?? 1;
  const W = 20 * g;      // 路面
  const WBase = 22 * g;  // 路基
  const WShade = 24 * g; // 投影
  const WSheen = 8 * g;  // 柔光

  // 龙脊尖刺：沿路径每约 26px 一根，朝"下"（+y 方向，也就是沿路前进的
  // 视觉"背侧"）张开。只对龙鳞材质计算，避免无谓开销。
  const spikes = React.useMemo(
    () =>
      material === 'scale'
        ? // side = -1：朝上张开。路半宽只有 10px，刺长必须小于它，
          // 否则整根刺悬在路面外，看起来像插了一圈牙签。
          buildSpineSpikes(connection.d, -1, 46, 22, 13)
        : [],
    [connection.d, material]
  );

  return (
    <g
      key={connection.key}
      className="trail-link-group"
      data-material={material}
      data-material-label={MATERIAL_LABEL[material]}
    >
      {/* 1. 投影 */}
      <path
        className="trail-road-shadow"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={WShade}
        transform="translate(0 11)"
        opacity={0.28}
      />
      {/* 2. 路基：下沉，形成厚度 */}
      <path
        className={`trail-road-base ${done ? 'is-completed' : ''}`}
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={WBase}
        transform="translate(0 7)"
        style={{ stroke: done ? undefined : BASE_COLOR[material] }}
      />
      {/* 3. 路面：材质图案 */}
      <path
        className={`trail-road-surface ${done ? 'is-completed' : ''}`}
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={W}
        stroke={fill}
      />
      {/* 4. 内阴影：贴边一圈暗色 */}
      <path
        className="trail-road-inner-shadow"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={W}
      />
      {/* 5. 柔光：极淡的中间亮带，给材质一点润泽 */}
      <path
        className="trail-road-sheen"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={WSheen}
      />
      {/* 6. 龙脊：沿中线的金色脊线 + 一串真正垂直于曲线张开的尖刺。
          尖刺必须按当地切线算法线才对，pattern/dasharray 做不到这点。
          只在龙鳞材质上画，别的路面不长角。 */}
      {material === 'scale' && (
        <>
          <path
            className="dragon-spine"
            d={connection.d}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
          />
          {/* 脊刺根部落在路面的视觉中线（路基 translate(0 7) 下沉，
              中线约在 -3.5），刺尖朝上越过路面上缘探出去一段。
              之前整体平移导致根部跑到路面外、整根刺悬空，看着像烤串。 */}
          <g transform="translate(0 -3.5)">
            {spikes.map(sp => (
              <path key={sp.index} className="dragon-spike" d={sp.d} />
            ))}
          </g>
        </>
      )}
    </g>
  );
};

const TrailConnectors: React.FC<TrailConnectorsProps> = ({
  className,
  width,
  height,
  connections,
  variant = 'simple',
  dragon,
  claws = false,
  completed = false,
}) => {
  return (
    <svg
      className={className}
      style={{ height }}
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'raised' ? (
        <>
          <RoadPatterns />
          {connections.map(connection => (
            <RaisedRoad key={connection.key} connection={connection} />
          ))}
          {/* 龙头由 PathOverview 里的 DragonHead3D（Three.js）渲染，
              这里不再画 SVG 版，避免两个头重叠。 */}
          {/* 顶端不再画之前的"龙尾"装饰——用户反馈那看起来像个脑袋。
              顶端改为让龙身自然收尖（linecap round + 逐渐收窄的虚化），
              避免在"开始"节点上方悬一个球状物。 */}
          {/* 龙爪：在若干段的侧边各画一只，左右交替。
              用 SVG 而不是 3D：3D 版写好了但画面上看不见（坐标/相机问题）。 */}
          {claws && connections.map((c, ci) => {
            if (ci % 3 !== 1) return null;   // 每 3 段放一对
            const pts = samplePathPoints(c.d, 20);
            if (pts.length < 4) return null;
            const mid = pts[Math.floor(pts.length / 2)];
            const prev = pts[Math.max(0, Math.floor(pts.length / 2) - 1)];
            const dx = mid.x - prev.x;
            const dy = mid.y - prev.y;
            const len = Math.hypot(dx, dy) || 1;
            // 侧向 = 切线逆时针 90°
            const nx = -dy / len;
            const ny = dx / len;
            return (
              <g key={`claw-${c.key}`}>
                <DragonClaw
                  x={mid.x + nx * 16}
                  y={mid.y + ny * 16}
                  dir={nx > 0 ? 1 : -1}
                  scale={1.1}
                  completed={completed}
                />
                <DragonClaw
                  x={mid.x - nx * 16}
                  y={mid.y - ny * 16}
                  dir={nx > 0 ? -1 : 1}
                  scale={1.1}
                  completed={completed}
                />
              </g>
            );
          })}
        </>
      ) : (
        connections.map(connection => (
          <path
            key={connection.key}
            className={`trail-link ${connection.completed ? 'is-completed' : ''}`}
            d={connection.d}
            stroke={connection.completed ? SIMPLE_COMPLETED : SIMPLE_PENDING}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        ))
      )}
    </svg>
  );
};

export default TrailConnectors;
