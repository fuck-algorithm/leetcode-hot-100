import React from 'react';
import { IconProps } from './types';

/**
 * 回溯算法图标
 * 概念：深入一条分支后回退，再尝试下一条
 * 视觉：从起点出发后折返的箭头（undo 语义）
 */
const BacktrackingIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 起点 */}
    <circle cx="27" cy="5.5" r="2.2" fill={color} />

    {/* 折返路径 */}
    <path
      d="M27 9.5v4.5a5 5 0 0 1-5 5H10"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
    />

    {/* 回退箭头 */}
    <path
      d="M14.2 14.8L10 19l4.2 4.2"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BacktrackingIcon;
