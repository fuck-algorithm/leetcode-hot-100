import React from 'react';
import { IconProps } from './types';

/**
 * 二叉树图标
 * 概念：每个节点最多两个子节点
 * 视觉：二叉树结构
 */
const BinaryTreeIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 连线 */}
    <path d="M14 10.5L10.5 15.5M18 10.5L21.5 15.5" stroke={color} strokeWidth="2.3" strokeLinecap="round" />
    <path
      d="M8 21.5L5.5 25.5M10.5 21.5L12.5 25.5M21.5 21.5L19.5 25.5M23.5 21.5L26.5 25.5"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeOpacity="0.55"
    />

    {/* 根节点 */}
    <circle cx="16" cy="7" r="4.2" fill={color} />

    {/* 子节点 */}
    <circle cx="9" cy="18.5" r="3.5" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="2.3" />
    <circle cx="23" cy="18.5" r="3.5" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="2.3" />

    {/* 叶子节点 */}
    <circle cx="5.5" cy="27" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="13" cy="27" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="19" cy="27" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="26.5" cy="27" r="2" fill={color} fillOpacity="0.6" />
  </svg>
);

export default BinaryTreeIcon;
