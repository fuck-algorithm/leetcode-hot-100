import React from 'react';
import { IconProps } from './types';

/**
 * 滑动窗口图标
 * 概念：固定大小的窗口在数据上滑动
 * 设计：真实的窗户，带有窗格和滑轨
 */
const SlidingWindowIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 窗框 */}
    <rect x="5" y="5" width="22" height="18" rx="2" stroke={color} strokeWidth="2.5" fill="none"/>
    {/* 窗格分隔 */}
    <line x1="16" y1="5" x2="16" y2="23" stroke={color} strokeWidth="2"/>
    <line x1="5" y1="14" x2="27" y2="14" stroke={color} strokeWidth="2"/>
    {/* 高亮窗格 - 当前窗口 */}
    <rect x="6" y="6" width="9" height="7" fill={color} fillOpacity="0.4"/>
    {/* 窗户把手 */}
    <circle cx="13" cy="18" r="1.5" fill={color}/>
    {/* 滑轨 */}
    <line x1="8" y1="26" x2="24" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* 滑块 */}
    <rect x="10" y="24" width="6" height="4" rx="1" fill={color}/>
    {/* 滑动方向 */}
    <path d="M18 26L22 26" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 24L22 26L20 28" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default SlidingWindowIcon;
