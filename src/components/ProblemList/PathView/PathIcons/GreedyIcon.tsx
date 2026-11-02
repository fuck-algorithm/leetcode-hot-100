import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 贪心算法
 * 概念：每一步都取当前最优，像从一堆金币里挑出最好的那枚
 */
const GreedyIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <circle cx="16" cy="16" r="9.2" strokeWidth={2.7} fill={color} fillOpacity={0.1} />
    <circle cx="16" cy="16" r="6.4" strokeWidth={1.8} strokeOpacity={0.5} />
    <path d="M12.6 16.4L15 18.8L19.6 12.8" strokeWidth={2.6} />
  </IconBase>
);

export default GreedyIcon;