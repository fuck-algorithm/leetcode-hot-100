import React from 'react';
import { IconProps } from './types';
import HashIcon from './HashIcon';
import TwoPointersIcon from './TwoPointersIcon';
import SlidingWindowIcon from './SlidingWindowIcon';
import ArrayIcon from './ArrayIcon';
import LinkedListIcon from './LinkedListIcon';
import BinaryTreeIcon from './BinaryTreeIcon';
import GraphIcon from './GraphIcon';
import BacktrackingIcon from './BacktrackingIcon';
import BinarySearchIcon from './BinarySearchIcon';
import StackIcon from './StackIcon';
import HeapIcon from './HeapIcon';
import GreedyIcon from './GreedyIcon';
import DPIcon from './DPIcon';
import TechniquesIcon from './TechniquesIcon';

// 导出所有图标组件
export {
  HashIcon,
  TwoPointersIcon,
  SlidingWindowIcon,
  ArrayIcon,
  LinkedListIcon,
  BinaryTreeIcon,
  GraphIcon,
  BacktrackingIcon,
  BinarySearchIcon,
  StackIcon,
  HeapIcon,
  GreedyIcon,
  DPIcon,
  TechniquesIcon,
};

// 导出类型
export type { IconProps } from './types';

/**
 * 图标映射表
 * key: 学习路径 ID
 * value: 对应的图标组件
 */
export const PathIconMap: Record<string, React.FC<IconProps>> = {
  'hash': HashIcon,
  'two-pointers': TwoPointersIcon,
  'sliding-window': SlidingWindowIcon,
  'array': ArrayIcon,
  'linked-list': LinkedListIcon,
  'binary-tree': BinaryTreeIcon,
  'graph': GraphIcon,
  'backtracking': BacktrackingIcon,
  'binary-search': BinarySearchIcon,
  'stack': StackIcon,
  'heap': HeapIcon,
  'greedy': GreedyIcon,
  'dynamic-programming': DPIcon,
  'techniques': TechniquesIcon,
};

/**
 * 通用路径图标组件
 * 根据 pathId 自动选择对应的图标
 */
interface PathIconProps {
  pathId: string;
  size?: number;
  color?: string;
  fallback?: string;
}

export const PathIcon: React.FC<PathIconProps> = ({ 
  pathId, 
  size = 32, 
  color = '#fff',
  fallback = '📚'
}) => {
  const IconComponent = PathIconMap[pathId];
  
  if (IconComponent) {
    return <IconComponent size={size} color={color} />;
  }
  
  return <span style={{ fontSize: size * 0.8 }}>{fallback}</span>;
};

export default PathIcon;
