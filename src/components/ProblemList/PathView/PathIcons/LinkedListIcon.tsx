import React from 'react';
import { IconProps } from './types';

/**
 * 链表图标
 * 概念：节点通过指针链接
 * 设计：火车车厢连接，每节车厢是一个节点
 */
const LinkedListIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 车厢1 - 数据区 + 指针区 */}
    <rect x="2" y="11" width="7" height="10" rx="1.5" fill={color}/>
    <line x1="7" y1="11" x2="7" y2="21" stroke={color} strokeWidth="1" strokeOpacity="0.3"/>
    {/* 车轮 */}
    <circle cx="4" cy="23" r="1.5" fill={color} fillOpacity="0.6"/>
    <circle cx="7" cy="23" r="1.5" fill={color} fillOpacity="0.6"/>
    
    {/* 连接钩1 */}
    <path d="M9 16H12" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="11" cy="16" r="1.5" stroke={color} strokeWidth="1.5" fill="none"/>
    
    {/* 车厢2 */}
    <rect x="13" y="11" width="7" height="10" rx="1.5" fill={color} fillOpacity="0.8"/>
    <line x1="18" y1="11" x2="18" y2="21" stroke={color} strokeWidth="1" strokeOpacity="0.3"/>
    <circle cx="15" cy="23" r="1.5" fill={color} fillOpacity="0.5"/>
    <circle cx="18" cy="23" r="1.5" fill={color} fillOpacity="0.5"/>
    
    {/* 连接钩2 */}
    <path d="M20 16H23" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="22" cy="16" r="1.5" stroke={color} strokeWidth="1.5" fill="none"/>
    
    {/* 终点站 NULL */}
    <rect x="24" y="13" width="5" height="6" rx="1" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
    <line x1="25" y1="14" x2="28" y2="18" stroke={color} strokeWidth="1.5" strokeOpacity="0.5"/>
  </svg>
);

export default LinkedListIcon;
