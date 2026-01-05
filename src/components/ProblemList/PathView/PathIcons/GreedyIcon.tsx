import React from 'react';
import { IconProps } from './types';

/**
 * 贪心算法图标 - Greedy Algorithm
 * 设计理念：
 * - 一只手正在抓取金币/宝石，体现"贪心"的本质
 * - 多个选项中选择当前最优（最大的那个）
 * - 闪光效果表示"最优选择"
 * - 动态的抓取姿态增加活力
 */
const GreedyIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 未选择的小选项 */}
    <circle cx="6" cy="24" r="3" fill={color} fillOpacity="0.3"/>
    <circle cx="13" cy="26" r="2.5" fill={color} fillOpacity="0.3"/>
    
    {/* 最优选择 - 大金币/宝石 */}
    <circle cx="22" cy="20" r="6" fill={color}/>
    <circle cx="22" cy="20" r="4" fill={color} fillOpacity="0.5"/>
    
    {/* 闪光效果 - 表示最优 */}
    <path 
      d="M28 14L30 12M30 18L32 18M28 22L30 24" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    
    {/* 抓取的手 */}
    <path 
      d="M8 8C8 8 10 6 12 6C14 6 15 7 15 9L15 12" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <path 
      d="M15 12L17 14L19 13" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15 10L18 10L20 11" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M15 8L17 7L19 8" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    
    {/* 手臂 */}
    <path 
      d="M8 8L4 12L2 18" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 指向最优的箭头 */}
    <path 
      d="M12 14L18 18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
  </svg>
);

export default GreedyIcon;
