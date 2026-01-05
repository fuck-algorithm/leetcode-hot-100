import React from 'react';
import { IconProps } from './types';

/**
 * 哈希表图标 - Hash Table / HashMap
 * 设计理念：
 * - 使用 { } 大括号，这是 JSON/字典的经典符号
 * - 内部有 key:value 的点状表示
 * - 简洁、一眼就能认出是"映射/字典"结构
 */
const HashIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 左大括号 { */}
    <path 
      d="M10 6C7 6 6 8 6 10V13C6 15 5 16 3 16C5 16 6 17 6 19V22C6 24 7 26 10 26" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* 右大括号 } */}
    <path 
      d="M22 6C25 6 26 8 26 10V13C26 15 27 16 29 16C27 16 26 17 26 19V22C26 24 25 26 22 26" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* 内部的 key:value 表示 */}
    {/* 第一对 */}
    <circle cx="13" cy="11" r="1.5" fill={color}/>
    <circle cx="19" cy="11" r="1.5" fill={color}/>
    
    {/* 第二对 */}
    <circle cx="13" cy="16" r="1.5" fill={color}/>
    <circle cx="19" cy="16" r="1.5" fill={color}/>
    
    {/* 第三对 */}
    <circle cx="13" cy="21" r="1.5" fill={color}/>
    <circle cx="19" cy="21" r="1.5" fill={color}/>
    
    {/* 冒号连接 */}
    <line x1="14.5" y1="11" x2="17.5" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="14.5" y1="16" x2="17.5" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="14.5" y1="21" x2="17.5" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export default HashIcon;
