import React from 'react';
import { IconProps } from './types';

/**
 * 堆图标 - Heap (Priority Queue)
 * 设计理念：
 * - 完全二叉树结构，体现堆的本质
 * - 顶部节点最大/最小，带皇冠标识优先级
 * - 节点间的连线展示父子关系
 * - 节点大小递减，体现堆的层级特性
 */
const HeapIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 连接线 - 父子关系 */}
    <path 
      d="M16 10L9 18M16 10L23 18M9 18L5 26M9 18L13 26M23 18L19 26M23 18L27 26" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeOpacity="0.4"
    />
    
    {/* 第三层节点 - 叶子 */}
    <circle cx="5" cy="27" r="3" fill={color} fillOpacity="0.4"/>
    <circle cx="13" cy="27" r="3" fill={color} fillOpacity="0.4"/>
    <circle cx="19" cy="27" r="3" fill={color} fillOpacity="0.4"/>
    <circle cx="27" cy="27" r="3" fill={color} fillOpacity="0.4"/>
    
    {/* 第二层节点 */}
    <circle cx="9" cy="19" r="3.5" fill={color} fillOpacity="0.7"/>
    <circle cx="23" cy="19" r="3.5" fill={color} fillOpacity="0.7"/>
    
    {/* 根节点 - 最高优先级 */}
    <circle cx="16" cy="10" r="4.5" fill={color}/>
    
    {/* 皇冠 - 表示最高优先级 */}
    <path 
      d="M11 5L13.5 2L16 4.5L18.5 2L21 5L19 6H13L11 5Z" 
      fill={color}
    />
    
    {/* 皇冠宝石 */}
    <circle cx="16" cy="3.5" r="1" fill={color} fillOpacity="0.5"/>
  </svg>
);

export default HeapIcon;
