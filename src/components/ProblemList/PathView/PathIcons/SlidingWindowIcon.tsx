import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 滑动窗口
 * 概念：一个固定的窗框在数据上向右滑动
 */
const SlidingWindowIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <rect x="6" y="4.6" width="20" height="17" rx="3.6" strokeWidth={2.6} />
    <rect x="9.8" y="8.6" width="6.6" height="9" rx="2" fill={color} />
    <path d="M8.5 26h13" strokeWidth={2.6} />
    <path d="M18 23L21.5 26L18 29" strokeWidth={2.6} />
  </IconBase>
);

export default SlidingWindowIcon;