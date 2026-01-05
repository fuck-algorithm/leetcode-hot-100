import React from 'react';
import { IconProps } from './types';

/**
 * 动态规划图标 - Dynamic Programming
 * 设计理念：
 * - DP表格是核心，展示状态存储
 * - 对角线路径展示最优子结构
 * - 箭头表示状态转移方程
 * - 从左上到右下的渐变填充，体现递推过程
 * - 记忆化的概念通过已填充的格子体现
 */
const DPIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* DP表格网格 */}
    <rect x="3" y="3" width="26" height="26" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
    
    {/* 横向分割线 */}
    <line x1="3" y1="10" x2="29" y2="10" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
    <line x1="3" y1="17" x2="29" y2="17" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
    <line x1="3" y1="24" x2="29" y2="24" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
    
    {/* 纵向分割线 */}
    <line x1="10" y1="3" x2="10" y2="29" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
    <line x1="17" y1="3" x2="17" y2="29" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
    <line x1="24" y1="3" x2="24" y2="29" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
    
    {/* 已计算的状态 - 渐变填充 */}
    <rect x="3" y="3" width="7" height="7" fill={color} fillOpacity="0.2"/>
    <rect x="10" y="3" width="7" height="7" fill={color} fillOpacity="0.3"/>
    <rect x="3" y="10" width="7" height="7" fill={color} fillOpacity="0.3"/>
    <rect x="10" y="10" width="7" height="7" fill={color} fillOpacity="0.4"/>
    <rect x="17" y="10" width="7" height="7" fill={color} fillOpacity="0.5"/>
    <rect x="10" y="17" width="7" height="7" fill={color} fillOpacity="0.5"/>
    <rect x="17" y="17" width="7" height="7" fill={color} fillOpacity="0.7"/>
    
    {/* 最终答案格子 */}
    <rect x="24" y="24" width="5" height="5" fill={color}/>
    
    {/* 状态转移箭头 - 从上方和左方 */}
    <path 
      d="M20.5 21L23 23.5" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M26.5 21L26.5 23.5" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    
    {/* 起点标记 */}
    <circle cx="6.5" cy="6.5" r="2" fill={color}/>
    
    {/* 最优路径虚线 */}
    <path 
      d="M8 8L12 12L19 12L19 19L26 26" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeDasharray="3 2"
      strokeOpacity="0.8"
    />
  </svg>
);

export default DPIcon;
