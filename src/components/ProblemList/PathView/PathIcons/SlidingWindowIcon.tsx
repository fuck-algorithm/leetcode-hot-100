import React from 'react';
import { IconProps } from './types';

/**
 * 滑动窗口图标
 * 概念：窗口在数据上滑动
 * 视觉：数据柱 + 窗框 + 箭头
 */
const SlidingWindowIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 数据柱 */}
    <rect x="3" y="14" width="2.4" height="8" rx="1.2" fill={color} fillOpacity="0.3" />
    <rect x="7" y="12" width="2.4" height="10" rx="1.2" fill={color} fillOpacity="0.5" />
    <rect x="11" y="10" width="2.4" height="12" rx="1.2" fill={color} fillOpacity="0.7" />
    <rect x="15" y="8" width="2.4" height="14" rx="1.2" fill={color} />
    <rect x="19" y="10" width="2.4" height="12" rx="1.2" fill={color} fillOpacity="0.7" />
    <rect x="23" y="12" width="2.4" height="10" rx="1.2" fill={color} fillOpacity="0.5" />
    <rect x="27" y="14" width="2.4" height="8" rx="1.2" fill={color} fillOpacity="0.3" />

    {/* 窗框 */}
    <rect
      x="9"
      y="6"
      width="16"
      height="18"
      rx="3.5"
      fill={color}
      fillOpacity="0.1"
      stroke={color}
      strokeWidth="2.4"
    />

    {/* 窗格线 */}
    <line x1="17" y1="6" x2="17" y2="24" stroke={color} strokeWidth="1.6" strokeOpacity="0.4" />
    <line x1="9" y1="15" x2="25" y2="15" stroke={color} strokeWidth="1.6" strokeOpacity="0.4" />

    {/* 箭头 */}
    <path d="M18 27h7" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M23 25L25 27L23 29"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SlidingWindowIcon;
