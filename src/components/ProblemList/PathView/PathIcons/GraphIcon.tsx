import React from 'react';
import { IconProps } from './types';

/**
 * 图论图标
 * 概念：节点和边组成的网络
 * 设计：社交网络，人与人之间的连接
 */
const GraphIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 边 - 连接关系 */}
    <line x1="16" y1="6" x2="6" y2="13" stroke={color} strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="16" y1="6" x2="26" y2="13" stroke={color} strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="6" y1="13" x2="10" y2="25" stroke={color} strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="26" y1="13" x2="22" y2="25" stroke={color} strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="10" y1="25" x2="22" y2="25" stroke={color} strokeWidth="2" strokeOpacity="0.5"/>
    {/* 交叉边 - 复杂关系 */}
    <line x1="6" y1="13" x2="22" y2="25" stroke={color} strokeWidth="1.5" strokeOpacity="0.3"/>
    <line x1="26" y1="13" x2="10" y2="25" stroke={color} strokeWidth="1.5" strokeOpacity="0.3"/>
    <line x1="16" y1="6" x2="16" y2="16" stroke={color} strokeWidth="1.5" strokeOpacity="0.3"/>
    
    {/* 节点 - 人 */}
    <circle cx="16" cy="6" r="4" fill={color}/>
    <circle cx="6" cy="13" r="3.5" fill={color}/>
    <circle cx="26" cy="13" r="3.5" fill={color}/>
    <circle cx="10" cy="25" r="3.5" fill={color}/>
    <circle cx="22" cy="25" r="3.5" fill={color}/>
    {/* 中心节点 */}
    <circle cx="16" cy="16" r="2.5" fill={color} fillOpacity="0.7"/>
  </svg>
);

export default GraphIcon;
