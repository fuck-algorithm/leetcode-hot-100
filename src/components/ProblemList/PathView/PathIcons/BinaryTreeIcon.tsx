import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 二叉树
 * 概念：每个节点最多两个子节点，逐层向下展开
 */
const BinaryTreeIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <path d="M13.5 11.2L10.6 16.9M18.5 11.2L21.4 16.9" strokeWidth={2.6} />
    <circle cx="16" cy="7.4" r="4.2" fill={color} />
    <circle cx="9" cy="20.6" r="3.5" fill={color} fillOpacity={0.65} />
    <circle cx="23" cy="20.6" r="3.5" fill={color} fillOpacity={0.65} />
  </IconBase>
);

export default BinaryTreeIcon;