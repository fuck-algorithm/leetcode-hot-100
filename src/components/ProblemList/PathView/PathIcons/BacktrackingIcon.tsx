import React from 'react';
import { IconProps } from './types';

/**
 * 回溯算法图标
 * 概念：尝试 → 失败 → 回退 → 重试
 * 设计：迷宫中的探索者，走错路后回头
 */
const BacktrackingIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 迷宫格子 */}
    <rect x="4" y="4" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    <rect x="12" y="4" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    <rect x="20" y="4" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    <rect x="4" y="12" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    <rect x="12" y="12" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    <rect x="20" y="12" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    <rect x="4" y="20" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    <rect x="12" y="20" width="8" height="8" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
    {/* 终点 */}
    <rect x="20" y="20" width="8" height="8" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    
    {/* 探索路径 */}
    <path d="M8 8L16 8L16 16" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* 回退路径 */}
    <path d="M16 16L8 16" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="3 2"/>
    
    {/* 回退箭头 */}
    <path d="M10 13L7 16L10 19" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* 起点标记 */}
    <circle cx="8" cy="8" r="2.5" fill={color}/>
    
    {/* 终点星星 */}
    <path d="M24 24L24.8 22.5L26.5 22.5L25.2 23.8L25.6 25.5L24 24.5L22.4 25.5L22.8 23.8L21.5 22.5L23.2 22.5Z" fill={color}/>
  </svg>
);

export default BacktrackingIcon;
