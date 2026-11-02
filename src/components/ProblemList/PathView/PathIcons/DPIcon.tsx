import React from 'react';
import { IconProps } from './types';

/**
 * 动态规划图标
 * 概念：用表格保存子问题状态，逐步递推
 * 视觉：3×3 DP 表格 + 对角线最优路径 + 状态转移箭头 + 行列标签
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
    <defs>
      <linearGradient id="dpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
        <stop offset="100%" stopColor={color} stopOpacity="0.5" />
      </linearGradient>
    </defs>

    {/* 已计算状态 - 对角线渐变 */}
    <rect x="3" y="4" width="8.33" height="7.33" rx="1.3" fill={color} fillOpacity="0.2" />
    <rect x="11.33" y="4" width="8.34" height="7.33" rx="1.3" fill={color} fillOpacity="0.35" />
    <rect x="19.67" y="4" width="8.33" height="7.33" rx="1.3" fill={color} fillOpacity="0.2" />

    <rect x="3" y="11.33" width="8.33" height="7.34" rx="1.3" fill={color} fillOpacity="0.35" />
    <rect x="11.33" y="11.33" width="8.34" height="7.34" rx="1.3" fill={color} fillOpacity="0.55" />
    <rect x="19.67" y="11.33" width="8.33" height="7.34" rx="1.3" fill={color} fillOpacity="0.35" />

    <rect x="3" y="18.67" width="8.33" height="7.33" rx="1.3" fill={color} fillOpacity="0.2" />
    <rect x="11.33" y="18.67" width="8.34" height="7.33" rx="1.3" fill={color} fillOpacity="0.35" />
    <rect x="19.67" y="18.67" width="8.33" height="7.33" rx="1.3" fill={color} />

    {/* 表格边框与网格 */}
    <rect x="3" y="4" width="25" height="22" rx="3" stroke={color} strokeWidth="2.2" />
    <path
      d="M11.33 4v22M19.67 4v22M3 11.33h25M3 18.67h25"
      stroke={color}
      strokeWidth="1.4"
      strokeOpacity="0.35"
    />

    {/* 对角线最优路径 */}
    <path
      d="M7 8L12 8L15 15L20 15L24 22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="4 2"
    />

    {/* 状态转移箭头 */}
    <path d="M22 16v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M20 18h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

    {/* 行列标签 */}
    <text x="7" y="3" fill={color} fontSize="3" fontWeight="bold" textAnchor="middle">i</text>
    <text x="15.5" y="3" fill={color} fontSize="3" fontWeight="bold" textAnchor="middle">j</text>
    <text x="1.5" y="8" fill={color} fontSize="3" fontWeight="bold" textAnchor="middle">1</text>
    <text x="1.5" y="15.5" fill={color} fontSize="3" fontWeight="bold" textAnchor="middle">2</text>
  </svg>
);

export default DPIcon;
