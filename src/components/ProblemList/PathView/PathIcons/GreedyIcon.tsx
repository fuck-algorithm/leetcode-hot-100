import React from 'react';
import { IconProps } from './types';

/**
 * 贪心算法图标
 * 概念：每一步选当前最优
 * 视觉：大小金币 + 勾选最优币 + 多个闪光 + 贪心箭头
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
    <defs>
      <radialGradient id="coinGrad" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
      </radialGradient>
    </defs>

    {/* 最优大金币 */}
    <circle cx="20" cy="18" r="7" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.6" />
    <circle cx="20" cy="18" r="4.5" fill={color} />
    <circle cx="20" cy="18" r="2" fill={color} fillOpacity="0.5" />

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

    {/* 贪心箭头指向最优 */}
    <path d="M10 20L16 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 2" />
    <path
      d="M13.5 17L16 18L15 20.5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 多个闪光 */}
    <path
      d="M28 6L29 4L30 6L32 7L30 8L29 10L28 8L26 7Z"
      fill={color}
    />
    <path
      d="M5 7L5.5 5.5L6 7L7.5 7.5L6 8L5.5 9.5L5 8L3.5 7.5Z"
      fill={color}
      fillOpacity="0.7"
    />
    <circle cx="26" cy="11" r="1.2" fill={color} fillOpacity="0.6" />
  </svg>
);

export default GreedyIcon;
