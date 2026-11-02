import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 回溯算法
 * 概念：走到尽头后沿原路折返，换一条分支重试
 */
const BacktrackingIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <circle cx="26" cy="6.6" r="2.5" fill={color} />
    <path d="M26 10.4v4.2a6.4 6.4 0 0 1-6.4 6.4H14" strokeWidth={2.6} />
    <path d="M17.4 17L13.4 21L17.4 25" strokeWidth={2.6} />
  </IconBase>
);

export default BacktrackingIcon;