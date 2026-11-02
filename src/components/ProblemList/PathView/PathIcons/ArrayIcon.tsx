import React from 'react';
import { IconProps } from './types';

/**
 * 数组与矩阵图标
 * 概念：连续内存 / 二维矩阵
 * 视觉：3×3 矩阵，行列索引标注，对角线高亮
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
    <defs>
      <linearGradient id="arrayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </linearGradient>
    </defs>

    {/* 矩阵外框 */}
    <rect x="4" y="4" width="24" height="24" rx="3" stroke={color} strokeWidth="2.2" />

    {/* 3×3 格子，对角线高亮 */}
    <rect x="5.33" y="5.33" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.2" />
    <rect x="12.67" y="5.33" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.45" />
    <rect x="20" y="5.33" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.2" />

    <rect x="5.33" y="12.67" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.45" />
    <rect x="12.67" y="12.67" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.8" />
    <rect x="20" y="12.67" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.45" />

    <rect x="5.33" y="20" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.2" />
    <rect x="12.67" y="20" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.45" />
    <rect x="20" y="20" width="6.67" height="6.67" rx="1.3" fill={color} fillOpacity="0.2" />

    {/* 网格线 */}
    <path
      d="M12 4v24M20 4v24M4 12h24M4 20h24"
      stroke={color}
      strokeWidth="1.4"
      strokeOpacity="0.3"
    />

    {/* 行列索引小点 */}
    <circle cx="8.67" cy="2" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="16" cy="2" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="23.33" cy="2" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="2" cy="8.67" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="2" cy="16" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="2" cy="23.33" r="1" fill={color} fillOpacity="0.6" />
  </svg>
);

export default ArrayIcon;
