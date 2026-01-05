import React from 'react';
import { IconProps } from './types';

/**
 * 双指针图标
 * 概念：两个指针从两端向中间移动
 * 设计：两只手指相向，中间是目标区域
 */
const TwoPointersIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 左手指 */}
    <path d="M3 16C3 16 5 14 7 14C9 14 10 16 10 16C10 16 9 18 7 18C5 18 3 16 3 16Z" fill={color}/>
    <path d="M10 16H14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="7" cy="16" r="2" fill={color}/>
    
    {/* 右手指 */}
    <path d="M29 16C29 16 27 14 25 14C23 14 22 16 22 16C22 16 23 18 25 18C27 18 29 16 29 16Z" fill={color}/>
    <path d="M22 16H18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="25" cy="16" r="2" fill={color}/>
    
    {/* 中间目标 */}
    <rect x="13" y="12" width="6" height="8" rx="1" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.3"/>
  </svg>
);

export default TwoPointersIcon;
