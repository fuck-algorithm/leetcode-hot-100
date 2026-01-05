import React from 'react';
import { IconProps } from './types';

/**
 * 二分查找图标
 * 概念：每次排除一半，快速定位
 * 设计：放大镜聚焦中点，两边逐渐模糊
 */
const BinarySearchIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 有序数组 - 高度递增表示有序 */}
    <rect x="2" y="18" width="4" height="6" rx="1" fill={color} fillOpacity="0.25"/>
    <rect x="7" y="16" width="4" height="8" rx="1" fill={color} fillOpacity="0.4"/>
    <rect x="12" y="14" width="4" height="10" rx="1" fill={color} fillOpacity="0.6"/>
    <rect x="17" y="12" width="4" height="12" rx="1" fill={color}/>
    <rect x="22" y="14" width="4" height="10" rx="1" fill={color} fillOpacity="0.6"/>
    <rect x="27" y="16" width="4" height="8" rx="1" fill={color} fillOpacity="0.4"/>
    
    {/* 放大镜 */}
    <circle cx="19" cy="7" r="5" stroke={color} strokeWidth="2.5" fill="none"/>
    <line x1="23" y1="10" x2="27" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* 聚焦点 */}
    <circle cx="19" cy="7" r="2" fill={color}/>
    
    {/* 指向 mid */}
    <line x1="19" y1="10" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default BinarySearchIcon;
