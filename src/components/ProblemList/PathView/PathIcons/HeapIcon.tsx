import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 堆
 * 概念：完全二叉树上父子保持优先级顺序，根永远是最大值
 */
const HeapIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <path
      d="M14.4 8.2L10.4 12.6M17.6 8.2L21.6 12.6M7.9 17.1L5.7 21.9M9.9 17.1L11.7 21.8M22.1 17.1L20.3 21.8M24.1 17.1L26.3 21.9"
      strokeWidth={2}
      strokeOpacity={0.75}
    />
    <circle cx="16" cy="5.8" r="3.2" fill={color} />
    <circle cx="9" cy="14.6" r="2.7" fill={color} fillOpacity={0.7} />
    <circle cx="23" cy="14.6" r="2.7" fill={color} fillOpacity={0.7} />
    <circle cx="4.8" cy="23.8" r="2.1" fill={color} fillOpacity={0.5} />
    <circle cx="12.4" cy="23.8" r="2.1" fill={color} fillOpacity={0.5} />
    <circle cx="19.6" cy="23.8" r="2.1" fill={color} fillOpacity={0.5} />
    <circle cx="27.2" cy="23.8" r="2.1" fill={color} fillOpacity={0.5} />
  </IconBase>
);

export default HeapIcon;