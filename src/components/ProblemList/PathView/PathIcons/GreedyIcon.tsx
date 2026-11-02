import React from 'react';
import { IconProps } from './types';

/**
 * 贪心算法图标
 * 概念：每一步都选当前最优
 * 视觉：大小不同的选项币，最大的那枚被勾选，右上角有闪光
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
    {/* 最优选择 */}
    <circle
      cx="22"
      cy="18.5"
      r="6.5"
      fill={color}
      fillOpacity="0.16"
      stroke={color}
      strokeWidth="2.4"
    />
    <path
      d="M18.6 18.6l2.3 2.3 4.4-4.8"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 其他候选 */}
    <circle
      cx="11"
      cy="24"
      r="3.6"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="2"
    />
    <circle cx="4.8" cy="27" r="2.2" fill={color} fillOpacity="0.5" />

    {/* 闪光 */}
    <path
      d="M28.5 5.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"
      fill={color}
    />
  </svg>
);

export default GreedyIcon;
