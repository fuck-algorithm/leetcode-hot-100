import React from 'react';
import { IconProps } from './types';

/**
 * 滑动窗口图标
 * 概念：固定窗口在数据上滑动
 * 视觉：数据柱 + 窗框（带把手）+ 滑轨 + 动态箭头
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
    <defs>
      <linearGradient id="winGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* 数据柱 - 渐变高度 */}
    <rect x="3" y="16" width="2.4" height="7" rx="1.2" fill={color} fillOpacity="0.25" />
    <rect x="7" y="14" width="2.4" height="9" rx="1.2" fill={color} fillOpacity="0.4" />
    <rect x="11" y="12" width="2.4" height="11" rx="1.2" fill={color} fillOpacity="0.7" />
    <rect x="15" y="10" width="2.4" height="13" rx="1.2" fill={color} />
    <rect x="19" y="12" width="2.4" height="11" rx="1.2" fill={color} fillOpacity="0.7" />
    <rect x="23" y="14" width="2.4" height="9" rx="1.2" fill={color} fillOpacity="0.4" />
    <rect x="27" y="16" width="2.4" height="7" rx="1.2" fill={color} fillOpacity="0.25" />

    {/* 窗框 */}
    <rect
      x="8.5"
      y="7.5"
      width="17"
      height="16.5"
      rx="3.5"
      fill="url(#winGrad)"
      stroke={color}
      strokeWidth="2.4"
    />

    {/* 窗框格线 */}
    <line x1="17" y1="7.5" x2="17" y2="24" stroke={color} strokeWidth="1.6" strokeOpacity="0.4" />
    <line x1="8.5" y1="15.75" x2="25.5" y2="15.75" stroke={color} strokeWidth="1.6" strokeOpacity="0.4" />

    {/* 窗把手 */}
    <circle cx="22" cy="20" r="1.8" fill={color} />

    {/* 滑轨 */}
    <line x1="9" y1="27" x2="23" y2="27" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* 滑块与箭头 */}
    <rect x="13" y="25" width="6" height="4" rx="1.5" fill={color} />
    <path d="M21 27h5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M24 25L26 27L24 29"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SlidingWindowIcon;
