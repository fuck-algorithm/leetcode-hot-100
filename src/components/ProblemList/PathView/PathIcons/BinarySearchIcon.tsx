import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 二分查找
 * 概念：在有序序列中锁定中点，逐次排除一半
 */
const BinarySearchIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <circle cx="14.2" cy="14.2" r="7.3" strokeWidth={2.6} />
    <path d="M19.7 19.7L26 26" strokeWidth={3.2} />
    <path d="M11.1 18.6v-3.6M14.2 18.6v-6.6M17.3 18.6v-9.2" strokeWidth={2.6} />
  </IconBase>
);

export default BinarySearchIcon;