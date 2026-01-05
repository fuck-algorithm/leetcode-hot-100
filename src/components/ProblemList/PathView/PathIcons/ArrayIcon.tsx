import React from 'react';
import { IconProps } from './types';

/**
 * 数组与矩阵图标
 * 概念：连续内存空间存储数据
 * 设计：带索引的内存格子，像抽屉柜
 */
const ArrayIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 抽屉柜框架 */}
    <rect x="3" y="6" width="26" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    
    {/* 抽屉格子 */}
    <rect x="4" y="7" width="7" height="8" fill={color}/>
    <rect x="12" y="7" width="7" height="8" fill={color} fillOpacity="0.7"/>
    <rect x="20" y="7" width="8" height="8" fill={color} fillOpacity="0.4"/>
    
    {/* 分隔线 */}
    <line x1="11" y1="7" x2="11" y2="25" stroke={color} strokeWidth="1.5" strokeOpacity="0.5"/>
    <line x1="19" y1="7" x2="19" y2="25" stroke={color} strokeWidth="1.5" strokeOpacity="0.5"/>
    
    {/* 索引标签 */}
    <text x="7.5" y="22" fill={color} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">0</text>
    <text x="15.5" y="22" fill={color} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1</text>
    <text x="24" y="22" fill={color} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">2</text>
  </svg>
);

export default ArrayIcon;
