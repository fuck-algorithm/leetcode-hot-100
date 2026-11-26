import React from 'react';

/**
 * 中国龙的爪（SVG）
 *
 * 之前尝试用 Three.js 程序化生成爪子，写了整段代码但画面上一个都看不见
 * （3D 坐标系与正交相机配合反复出问题）。改用 SVG 后位置完全可控：
 * 画在曲线上的固定位置，不依赖任何 3D 变换。
 *
 * 造型：三条趾 + 每趾一枚弯钩爪尖，腕部带鳞。
 * 中国龙是四爪/五爪，这里画三趾，视觉上更简洁。
 */

interface Props {
  /** 爪子挂载点（龙身侧边） */
  x: number;
  y: number;
  /** +1 朝右、-1 朝左 */
  dir: 1 | -1;
  /** 缩放 */
  scale?: number;
  completed: boolean;
}

export const DragonClaw: React.FC<Props> = ({ x, y, dir, scale = 1, completed }) => {
  const skin = completed ? '#6ad82a' : '#e8b23a';
  const skinL = completed ? '#a8f06a' : '#f7d268';
  const skinD = completed ? '#3f9a00' : '#b0761b';
  const nail = '#f8f0d8';

  return (
    <g transform={`translate(${x} ${y}) rotate(${dir * 18}) scale(${dir * scale} ${scale})`} className="dragon-claw">
      {/* ---- 上臂：从龙身伸出的粗壮一节（不再画大圆球关节）---- */}
      <path
        d="M 0 -12 C 12 -16, 26 -12, 34 -2
           L 36 12 C 24 16, 10 14, -2 10 Z"
        fill={skin}
      />
      <path d="M 2 -10 C 13 -14, 24 -10, 32 -2 L 32 2 C 22 -6, 10 -7, 2 -5 Z" fill={skinL} opacity="0.5" />
      {/* 臂上鳞 */}
      {[0, 1, 2].map(i => (
        <path key={`s${i}`} d={`M ${7 + i * 8} -4 a 4 3.2 0 0 1 8 0`} fill="none" stroke={skinD} strokeWidth="1.2" opacity="0.42" />
      ))}

      {/* ---- 掌：略宽的一团 ---- */}
      <path d="M 32 2 C 40 -2, 46 4, 46 14 C 46 22, 38 26, 32 22 Z" fill={skin} />
      <path d="M 34 4 C 40 2, 44 7, 44 14" stroke={skinL} strokeWidth="2.5" fill="none" opacity="0.45" />

      {/* ---- 四趾：从掌向外张开，两节 + 弯钩 ---- */}
      {[
        { x1: 48, y1: -8, x2: 58, y2: -14 },
        { x1: 52, y1: 4, x2: 64, y2: 2 },
        { x1: 50, y1: 16, x2: 60, y2: 20 },
        { x1: 44, y1: 24, x2: 50, y2: 32 },
      ].map((t, i) => {
        const mx = (46 + t.x1) / 2;
        const my = (14 + t.y1) / 2;
        return (
          <g key={`toe${i}`}>
            {/* 第一节：掌到第一节 */}
            <path
              d={`M 46 14 L ${t.x1} ${t.y1} L ${t.x1} ${t.y1 + 5} L 46 19 Z`}
              fill={skin}
            />
            {/* 第二节：略细 */}
            <path
              d={`M ${t.x1} ${t.y1} L ${t.x2} ${t.y2} L ${t.x2} ${t.y2 + 4} L ${t.x1} ${t.y1 + 5} Z`}
              fill={skinD}
              opacity="0.9"
            />
            {/* 弯钩爪尖：向下弯 */}
            <path
              d={`M ${t.x2} ${t.y2}
                 C ${t.x2 + 8} ${t.y2 + 2}, ${t.x2 + 9} ${t.y2 + 10}, ${t.x2 + 3} ${t.y2 + 14}
                 C ${t.x2 + 5} ${t.y2 + 8}, ${t.x2 + 2} ${t.y2 + 5}, ${t.x2} ${t.y2 + 4} Z`}
              fill={nail}
            />
            {/* 趾节阴影 */}
            <circle cx={mx} cy={my} r="2.6" fill={skinD} opacity="0.5" />
          </g>
        );
      })}
    </g>
  );
};

export default DragonClaw;
