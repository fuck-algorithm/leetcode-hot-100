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

/** 龙首：朝上，从龙身顶端"冒出来"迎向起点 */
export const DragonHead: React.FC<Props> = ({ x, y, scale, completed }) => {
  const main = completed ? DONE_GREEN : GOLD_MID;
  const deep = completed ? '#3f9a00' : GOLD_DEEP;
  const light = completed ? '#a8f06a' : GOLD_LIGHT;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="dragon-head">
      {/* 鬃毛：反向飘起的火焰簇（在头的后方/上方） */}
      <path d="M-14 2 C -24 -10 -30 -22 -24 -32 C -20 -20 -14 -12 -6 -4 Z" fill={deep} opacity={0.85} />
      <path d="M14 2 C 24 -10 30 -22 24 -32 C 20 -20 14 -12 6 -4 Z" fill={deep} opacity={0.85} />
      <path d="M0 0 C -6 -18 -6 -32 0 -44 C 6 -32 6 -18 0 0 Z" fill={deep} opacity={0.7} />

      {/* 龙角：从额侧向后上方伸出的骨角 */}
      <path d="M-13 -4 C -24 -14 -32 -22 -38 -34 C -28 -26 -20 -18 -9 -8 Z" fill={deep} />
      <path d="M13 -4 C 24 -14 32 -22 38 -34 C 28 -26 20 -18 9 -8 Z" fill={deep} />

      {/* 头部主体：3/4 侧视的楔形，吻部向左下探出 */}
      <path
        d="M-30 12 C -30 0 -22 -10 -6 -14 C 12 -18 26 -12 30 0 C 33 12 26 26 12 32 C -4 38 -26 34 -30 22 Z"
        fill={main}
      />

      {/* 额顶高光带 */}
      <path
        d="M-24 4 C -20 -6 -8 -11 6 -12 C 18 -13 26 -8 27 -2 C 22 -9 12 -8 2 -6 C -10 -4 -18 0 -24 4 Z"
        fill={light}
        opacity={0.8}
      />

      {/* 吻部（左下突出，形成龙嘴的侧面轮廓） */}
      <path
        d="M-30 12 C -34 16 -34 24 -28 27 C -22 30 -16 26 -14 20 C -18 18 -24 15 -30 12 Z"
        fill={main}
      />

      {/* 鼻孔 */}
      <ellipse cx="-29" cy="18" rx="1.8" ry="1.2" fill={deep} transform="rotate(-20 -29 18)" />

      {/* 嘴线 */}
      <path
        d="M-31 25 C -22 27 -12 26 -6 22"
        stroke={deep}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* 獠牙（从嘴线下方露出） */}
      <path d="M-22 26 L -19 31 L -16 26 Z" fill="#fffaf0" />
      <path d="M-12 25 L -9 30 L -6 24 Z" fill="#fffaf0" />

      {/* 眼睛：接近侧视，一只大一只小，带竖瞳 */}
      <ellipse cx="-8" cy="4" rx="5" ry="6" fill="#1a1a1a" />
      <ellipse cx="-8" cy="5" rx="2" ry="4" fill={light} />
      <circle cx="-10" cy="1.5" r="1.5" fill="#fff" opacity={0.9} />
      {/* 远侧眼（被头部遮挡，只露一点） */}
      <ellipse cx="8" cy="2" rx="3" ry="3.6" fill="#1a1a1a" opacity={0.85} />
      <ellipse cx="8" cy="3" rx="1.2" ry="2.4" fill={light} opacity={0.9} />

      {/* 眉脊：一道弧线，强化"怒目" */}
      <path
        d="M-15 -2 C -11 -6 -5 -5 -1 -1"
        stroke={deep}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
      />

      {/* 龙须：从左吻部甩出的两根长须 */}
      <path
        d="M-32 20 C -46 22 -56 28 -62 38"
        stroke={deep}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-31 16 C -44 12 -54 12 -62 16"
        stroke={deep}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      {/* 右侧短须 */}
      <path
        d="M28 10 C 40 8 48 12 54 20"
        stroke={deep}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* 头顶鳞片点缀 */}
      <path
        d="M-4 -9 C 0 -11 4 -10 6 -7"
        stroke={deep}
        strokeWidth={1.2}
        fill="none"
        opacity={0.5}
        strokeLinecap="round"
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
