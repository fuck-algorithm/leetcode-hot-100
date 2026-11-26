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
      {/* 肩：椭圆肌肉块，贴住龙身 */}
      <ellipse cx="2" cy="0" rx="13" ry="10" fill={skin} />
      <ellipse cx="1" cy="-3" rx="9" ry="6" fill={skinL} opacity="0.55" />

      {/* 上臂：细长，斜向下外 */}
      <path d="M 8 4 Q 22 12 32 22 L 26 30 Q 17 22 2 14 Z" fill={skin} />
      {/* 肘关节球 */}
      <circle cx="32" cy="24" r="8" fill={skin} />
      <circle cx="30" cy="21" r="4.5" fill={skinL} opacity="0.5" />

      {/* 前臂：从肘继续向下，略细 */}
      <path d="M 34 30 Q 44 42 46 54 L 38 56 Q 36 44 28 33 Z" fill={skinD} opacity="0.92" />

      {/* 腕：一小团 */}
      <ellipse cx="43" cy="57" rx="9" ry="8" fill={skin} />
      <ellipse cx="41" cy="54" rx="6" ry="4.5" fill={skinL} opacity="0.5" />

      {/* 三趾：细长分节，末端弯钩 */}
      {[
        { ex: 40, ey: 74 },
        { ex: 52, ey: 78 },
        { ex: 62, ey: 70 },
      ].map((t, i) => {
        // 从腕到趾端的向量
        const vx = t.ex - 43;
        const vy = t.ey - 57;
        const L = Math.hypot(vx, vy);
        const ux = vx / L;
        const uy = vy / L;
        // 垂直线（趾宽方向）
        const px = -uy;
        const py = ux;
        return (
          <g key={`toe-${i}`}>
            {/* 趾本体：一条带粗细的带子 */}
            <path
              d={`M ${43 + px * 4} ${57 + py * 4}
                  L ${t.ex + px * 3} ${t.ey + py * 3}
                  L ${t.ex - px * 3} ${t.ey - py * 3}
                  L ${43 - px * 4} ${57 - py * 4} Z`}
              fill={skin}
            />
            {/* 趾关节 */}
            <circle cx={(43 + t.ex) / 2} cy={(57 + t.ey) / 2} r="4" fill={skinD} opacity="0.8" />
            {/* 爪尖：从趾端继续延伸的弯钩 */}
            <path
              d={`M ${t.ex - px * 4} ${t.ey - py * 4}
                  Q ${t.ex + ux * 12 - px * 2} ${t.ey + uy * 12 - py * 2} ${t.ex + ux * 16 + px * 5} ${t.ey + uy * 16 + py * 5}
                  Q ${t.ex + ux * 10 + px * 1} ${t.ey + uy * 10 + py * 1} ${t.ex + px * 4} ${t.ey + py * 4} Z`}
              fill={nail}
            />
          </g>
        );
      })}
    </g>
  );
};

export default DragonClaw;
