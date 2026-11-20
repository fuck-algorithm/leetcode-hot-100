import React from 'react';

/**
 * 龙的头部与尾尖。
 *
 * 整条学习之路被理解为一条龙：
 *   页头那只"龙首"在最上方（起点），路径一路向下蜿蜒成龙身，
 *   最下方是龙尾收尖。
 *
 * 这两个部件都画在 SVG 里，和龙身（TrailConnectors 的路面）共用一套
 * 坐标系，因此在任意宽度下都能对齐路径端点。
 *
 * 设计取舍：不追求写实龙，而是"游戏化装饰"——
 * 用剪影 + 少量渐变表现角、须、爪，避免细节过多在移动端糊成一团。
 */

interface Props {
  /** 尾尖朝向：上方起点是龙头所在的"首端"，下方末端是"尾端" */
  variant: 'head' | 'tail';
  x: number;
  y: number;
  /** 缩放，按容器宽度自适应 */
  scale: number;
  completed: boolean;
}

const GOLD_LIGHT = '#ffe58a';
const GOLD_MID = '#e8b23a';
const GOLD_DEEP = '#b4771a';
const DONE_GREEN = '#58cc02';

/**
 * 龙首（侧脸，中国龙比例）
 *
 * 之前那版像老鼠的原因：眼睛直径占到头高的 40%，吻部又短又圆。
 * 这里按真实龙首的比例重画——长吻、小眼、额头隆起、上下颌分明。
 */
export const DragonHead: React.FC<Props> = ({ x, y, scale, completed }) => {
  const main = completed ? DONE_GREEN : GOLD_MID;
  const deep = completed ? '#3f9a00' : GOLD_DEEP;
  const light = completed ? '#a8f06a' : GOLD_LIGHT;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="dragon-head">
      {/* 颈后鬃毛：三束向后飘的火苗 */}
      <path d="M8 -6 C 26 -18 38 -30 40 -46 C 30 -34 20 -24 10 -14 Z" fill={deep} opacity={0.8} />
      <path d="M10 4 C 30 0 42 -8 48 -22 C 36 -12 24 -6 12 -2 Z" fill={deep} opacity={0.7} />
      <path d="M10 14 C 26 18 36 28 40 42 C 30 30 20 22 10 22 Z" fill={deep} opacity={0.6} />

      {/* 龙角：两支向后上方的骨角，粗细适中、末端微叉。
          之前做得像扇子（过宽过长），这里收窄、缩短。 */}
      <path d="M-4 -28 C 2 -44 8 -54 18 -62 L 24 -57 C 15 -49 10 -38 6 -26 Z" fill={deep} />
      <path d="M16 -55 L 24 -68 L 30 -62 L 21 -53 Z" fill={deep} />
      <path d="M-14 -24 C -13 -38 -10 -47 -4 -56 L 2 -51 C -4 -43 -7 -34 -8 -22 Z" fill={deep} opacity={0.85} />

      {/* 头部主体：长吻楔形，额头隆起，颈侧收窄 */}
      <path
        d="M-66 17
           C -68 7 -59 -4 -43 -12
           C -25 -21 -3 -24 13 -18
           C 25 -14 33 -6 33 5
           C 33 16 26 24 14 28
           C -2 33 -22 34 -38 30
           C -53 26 -63 23 -66 17 Z"
        fill={main}
      />

      {/* 额骨高光 */}
      <path
        d="M-40 -10 C -24 -18 -6 -20 8 -15 C -6 -17 -24 -14 -40 -6 Z"
        fill={light}
        opacity={0.75}
      />

      {/* 上唇/鼻梁隆起 */}
      <path
        d="M-64 14 C -56 8 -46 8 -38 12 C -46 14 -56 16 -64 20 Z"
        fill={light}
        opacity={0.45}
      />

      {/* 下颌：单独一块，略微张开 */}
      <path
        d="M-62 26 C -52 32 -36 36 -20 34 C -10 33 -4 30 -2 27 C -8 36 -28 42 -46 40 C -56 39 -62 34 -62 26 Z"
        fill={deep}
        opacity={0.55}
      />

      {/* 口腔缝隙 */}
      <path
        d="M-60 24 C -44 28 -24 29 -6 26"
        stroke="#5a1f1f"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
      />

      {/* 獠牙：上颚朝下、下颚朝上 */}
      <path d="M-52 25 L -49 34 L -46 25 Z" fill="#fffaf0" />
      <path d="M-34 27 L -31 35 L -28 27 Z" fill="#fffaf0" />
      <path d="M-50 33 L -47 25 L -44 33 Z" fill="#f3ead2" opacity={0.9} />

      {/* 鼻孔 */}
      <ellipse cx="-60" cy="15" rx="2.4" ry="1.5" fill={deep} transform="rotate(-24 -60 15)" />

      {/* 眼睛：小得多（约为头高的 1/6），带竖瞳与眉压 */}
      <ellipse cx="-30" cy="-2" rx="5.5" ry="6.5" fill="#141008" />
      <ellipse cx="-30" cy="-1" rx="2.2" ry="4.4" fill={light} />
      <circle cx="-32" cy="-5" r="1.6" fill="#fff" opacity={0.92} />
      {/* 眉脊压住眼上缘，形成怒目 */}
      <path
        d="M-40 -9 C -34 -13 -24 -12 -19 -6"
        stroke={deep}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />

      {/* 颊侧鳞片：沿颧骨排三片 */}
      <path d="M-14 -12 q 4 -5 9 -1 q -5 4 -9 1 Z" fill={deep} opacity={0.35} />
      <path d="M-6 -8 q 4 -5 9 -1 q -5 4 -9 1 Z" fill={deep} opacity={0.3} />
      <path d="M-22 -14 q 4 -5 9 -1 q -5 4 -9 1 Z" fill={deep} opacity={0.3} />

      {/* 龙须：从吻侧甩出的长须，带一点颤动尾 */}
      <path
        d="M-62 22 C -78 26 -92 36 -100 52"
        stroke={deep}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-60 14 C -76 10 -90 8 -102 14"
        stroke={deep}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      {/* 下颌须 */}
      <path
        d="M-46 40 C -56 50 -64 58 -74 62"
        stroke={deep}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        opacity={0.8}
      />
    </g>
  );
};

/** 龙尾：朝下收尖，末端带火焰形状的尾鳍 */
export const DragonTail: React.FC<Props> = ({ x, y, scale, completed }) => {
  const main = completed ? DONE_GREEN : GOLD_MID;
  const deep = completed ? '#3f9a00' : GOLD_DEEP;
  const light = completed ? '#a8f06a' : GOLD_LIGHT;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="dragon-tail">
      {/* 尾鳍：三片火焰状散开 */}
      <path
        d="M0 26 C -14 40 -22 52 -20 66 C -14 52 -8 44 -2 38 Z"
        fill={deep}
        opacity={0.9}
      />
      <path
        d="M0 26 C 14 40 22 52 20 66 C 14 52 8 44 2 38 Z"
        fill={deep}
        opacity={0.9}
      />
      <path
        d="M0 28 C -6 44 -4 60 0 74 C 4 60 6 44 0 28 Z"
        fill={deep}
      />

      {/* 尾部主体：从宽到尖 */}
      <path
        d="M0 -20 C 13 -14 16 2 10 16 C 6 24 2 26 0 28 C -2 26 -6 24 -10 16 C -16 2 -13 -14 0 -20 Z"
        fill={main}
      />

      {/* 尾脊高光 */}
      <path
        d="M0 -17 C 7 -12 9 0 5 12 C 3 18 1 20 0 21 C -1 20 -3 18 -5 12 C -9 0 -7 -12 0 -17 Z"
        fill={light}
        opacity={0.7}
      />

      {/* 尾鳞：两道弧线 */}
      <path
        d="M-7 0 C -2 3 2 3 7 0"
        stroke={deep}
        strokeWidth={1.4}
        fill="none"
        opacity={0.5}
        strokeLinecap="round"
      />
      <path
        d="M-5 10 C -2 12 2 12 5 10"
        stroke={deep}
        strokeWidth={1.4}
        fill="none"
        opacity={0.45}
        strokeLinecap="round"
      />
    </g>
  );
};
