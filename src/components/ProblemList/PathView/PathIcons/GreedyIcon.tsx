import React from 'react';
import { IconProps } from './types';

/**
 * 贪心算法图标
 * 概念：每一步选当前最优
 * 视觉：大小币 + 勾选
 */
const GreedyIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 最优大币 */}
    <circle cx="20" cy="18" r="7" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.6" />
    <circle cx="20" cy="18" r="4.5" fill={color} />

    {/* 勾选 */}
    <path
      d="M16.5 18L19 20.5L23.5 16"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 小候选币 */}
    <circle cx="8" cy="24" r="3.8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <circle cx="3" cy="27" r="2.5" fill={color} fillOpacity="0.15" />
  </svg>
);

export default GreedyIcon;
