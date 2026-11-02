import React from 'react';
import { IconProps } from './types';

/**
 * 回溯算法图标
 * 概念：深入分支后回退重试
 * 视觉：折返箭头
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
    <circle cx="26" cy="5" r="2.5" fill={color} />

    {/* 路径 */}
    <path d="M26 9v4a5 5 0 0 1-5 5H10" stroke={color} strokeWidth="2.6" strokeLinecap="round" />

    {/* 回退箭头 */}
    <path
      d="M14 14L10 18L14 22"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BacktrackingIcon;
