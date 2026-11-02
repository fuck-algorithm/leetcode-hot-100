import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 双指针
 * 概念：左右两枚指针沿序列相向移动
 */
const TwoPointersIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <path d="M5.5 10h10.8" strokeWidth={2.6} />
    <path d="M13.7 7.6L17.2 10L13.7 12.4" strokeWidth={2.6} />
    <path d="M26.5 22H15.7" strokeWidth={2.6} />
    <path d="M18.3 19.6L14.8 22L18.3 24.4" strokeWidth={2.6} />
  </IconBase>
);

export default TwoPointersIcon;