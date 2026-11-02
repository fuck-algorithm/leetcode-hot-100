import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 链表
 * 概念：节点通过 next 指针首尾相连
 */
const LinkedListIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <path d="M8.4 16h4.4M19.2 16h4.4" strokeWidth={2.6} />
    <circle cx="5.2" cy="16" r="2.9" fill={color} />
    <circle cx="16" cy="16" r="2.9" fill={color} />
    <circle cx="26.8" cy="16" r="2.9" fill={color} />
  </IconBase>
);

export default LinkedListIcon;