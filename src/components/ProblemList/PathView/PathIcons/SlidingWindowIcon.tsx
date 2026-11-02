import React from 'react';
import { IconProps } from './types';

/**
 * 滑动窗口图标
 * 概念：一个固定大小的窗口在数据序列上滑动
 * 视觉：数据柱 + 框住中间三根柱子的窗口 + 滑动方向箭头
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
    {/* 数据序列 */}
    <rect x="3.2" y="13" width="2.6" height="8" rx="1.3" fill={color} fillOpacity="0.35" />
    <rect x="7.7" y="13" width="2.6" height="8" rx="1.3" fill={color} fillOpacity="0.35" />
    <rect x="12.2" y="13" width="2.6" height="8" rx="1.3" fill={color} />
    <rect x="16.7" y="13" width="2.6" height="8" rx="1.3" fill={color} />
    <rect x="21.2" y="13" width="2.6" height="8" rx="1.3" fill={color} />
    <rect x="25.7" y="13" width="2.6" height="8" rx="1.3" fill={color} fillOpacity="0.35" />

    {/* 窗口 */}
    <rect
      x="9.9"
      y="9.5"
      width="15.5"
      height="15"
      rx="3"
      fill={color}
      fillOpacity="0.1"
      stroke={color}
      strokeWidth="2.4"
    />

    {/* 滑动方向 */}
    <path d="M18 28h7.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M23 25.5L25.5 28L23 30.5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SlidingWindowIcon;
