import React from 'react';
import { IconProps } from './types';

/**
 * 数组与矩阵图标
 * 概念：连续内存 / 二维矩阵
 * 视觉：数组括号包裹一个 2×2 矩阵，左上角格子高亮
 */
const ArrayIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 数组括号 */}
    <path
      d="M9 6H4v20h5M23 6h5v20h-5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 矩阵格子 */}
    <rect x="11.2" y="10.1" width="3.8" height="3.8" rx="0.9" fill={color} />
    <rect x="17" y="10.1" width="3.8" height="3.8" rx="0.9" fill={color} fillOpacity="0.4" />
    <rect x="11.2" y="16.1" width="3.8" height="3.8" rx="0.9" fill={color} fillOpacity="0.4" />
    <rect x="17" y="16.1" width="3.8" height="3.8" rx="0.9" fill={color} fillOpacity="0.4" />
  </svg>
);

export default ArrayIcon;
