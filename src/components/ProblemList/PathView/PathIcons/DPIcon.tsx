import React from 'react';
import { IconProps } from './types';

/**
 * 动态规划图标
 * 概念：用表格保存子问题状态，逐步递推到最终答案
 * 视觉：3×3 DP 表格，已计算格子沿对角线逐级加深
 */
const DPIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 已计算状态 */}
    <rect x="3" y="4" width="8.67" height="8" fill={color} fillOpacity="0.22" />
    <rect x="11.67" y="4" width="8.66" height="8" fill={color} fillOpacity="0.34" />
    <rect x="3" y="12" width="8.67" height="8" fill={color} fillOpacity="0.46" />
    <rect x="11.67" y="12" width="8.66" height="8" fill={color} fillOpacity="0.62" />
    <rect x="20.33" y="20" width="8.67" height="8" fill={color} />

    {/* 表格边框与网格 */}
    <rect x="3" y="4" width="26" height="24" rx="3" stroke={color} strokeWidth="2.2" />
    <path
      d="M11.67 4v24M20.33 4v24M3 12h26M3 20h26"
      stroke={color}
      strokeWidth="1.5"
      strokeOpacity="0.4"
    />
  </svg>
);

export default DPIcon;
