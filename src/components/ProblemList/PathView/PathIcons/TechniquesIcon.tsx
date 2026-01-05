import React from 'react';
import { IconProps } from './types';

/**
 * 技巧图标 - Techniques & Tricks
 * 设计理念：
 * - 魔术帽 + 魔法棒，体现"技巧"的巧妙性
 * - 星星闪烁表示灵感迸发
 * - 从帽子里变出的元素代表意想不到的解法
 * - 整体风格轻松有趣，暗示编程技巧的创意性
 */
const TechniquesIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 魔术帽 */}
    <ellipse cx="14" cy="26" rx="10" ry="3" fill={color} fillOpacity="0.8"/>
    <path 
      d="M6 26C6 26 7 14 14 14C21 14 22 26 22 26" 
      fill={color} 
      fillOpacity="0.6"
    />
    <ellipse cx="14" cy="14" rx="6" ry="2" fill={color}/>
    
    {/* 帽子顶部装饰带 */}
    <path 
      d="M8 15C8 15 11 16 14 16C17 16 20 15 20 15" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    
    {/* 魔法棒 */}
    <line 
      x1="22" y1="12" x2="30" y2="4" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <circle cx="30" cy="4" r="2" fill={color}/>
    
    {/* 魔法星星 - 大 */}
    <path 
      d="M26 10L27 8L28 10L30 11L28 12L27 14L26 12L24 11L26 10Z" 
      fill={color}
    />
    
    {/* 魔法星星 - 小 */}
    <path 
      d="M18 6L18.5 5L19 6L20 6.5L19 7L18.5 8L18 7L17 6.5L18 6Z" 
      fill={color}
      fillOpacity="0.8"
    />
    
    {/* 从帽子冒出的魔法粒子 */}
    <circle cx="11" cy="10" r="1.5" fill={color} fillOpacity="0.6"/>
    <circle cx="17" cy="9" r="1" fill={color} fillOpacity="0.5"/>
    <circle cx="14" cy="7" r="1.5" fill={color} fillOpacity="0.7"/>
    
    {/* 闪烁效果 */}
    <path 
      d="M4 8L5 6L6 8" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      strokeOpacity="0.5"
    />
  </svg>
);

export default TechniquesIcon;
