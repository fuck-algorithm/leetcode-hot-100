import React from 'react';
import { IconProps } from './types';

/**
 * 栈图标 - Stack (LIFO)
 * 设计理念：
 * - 三层堆叠的书本/托盘，体现"后进先出"的特性
 * - 顶部元素正在弹出，带有动感的弧线
 * - 渐变透明度表示栈的深度
 * - 侧面阴影增加立体感
 */
const StackIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 底层托盘 - 最稳固 */}
    <path 
      d="M5 24L16 28L27 24L16 20L5 24Z" 
      fill={color} 
      fillOpacity="0.3"
    />
    <path 
      d="M5 24L16 28L27 24" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 中层托盘 */}
    <path 
      d="M5 18L16 22L27 18L16 14L5 18Z" 
      fill={color} 
      fillOpacity="0.5"
    />
    <path 
      d="M5 18L16 22L27 18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 顶层托盘 - 正在弹出 */}
    <path 
      d="M7 10L16 13L25 10L16 7L7 10Z" 
      fill={color}
    />
    
    {/* 弹出动画弧线 */}
    <path 
      d="M16 5C14 5 12.5 4 12 3" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    <path 
      d="M16 5C18 5 19.5 4 20 3" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    
    {/* 向上弹出箭头 */}
    <path 
      d="M16 7V2" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <path 
      d="M13.5 4L16 1L18.5 4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default StackIcon;
