import React from 'react';
import { IconProps } from './types';

/**
 * 数组与矩阵图标
 * 概念：连续内存 / 二维矩阵
 * 视觉：数组括号 + 2×2 矩阵
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
      d="M8 6H4v20h4M24 6h4v20h-4"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 2×2 矩阵 */}
    <rect x="10" y="10" width="5" height="5" rx="1.2" fill={color} />
    <rect x="17" y="10" width="5" height="5" rx="1.2" fill={color} fillOpacity="0.4" />
    <rect x="10" y="17" width="5" height="5" rx="1.2" fill={color} fillOpacity="0.4" />
    <rect x="17" y="17" width="5" height="5" rx="1.2" fill={color} fillOpacity="0.4" />
  </svg>
);

export default ArrayIcon;
