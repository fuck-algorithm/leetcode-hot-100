import React from 'react';
import { IconProps } from './types';

/**
 * 二叉树图标
 * 概念：每个节点最多两个子节点
 * 视觉：根节点实心，左右子树与叶子节点逐层变淡
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
    <path d="M13.2 9.9L9.8 14.6M18.8 9.9L22.2 14.6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M8.8 21.2L6.4 24.9M10.2 21.2L12.6 24.9M21.8 21.2L19.4 24.9M23.2 21.2L25.6 24.9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.55"
    />

    {/* 根节点 */}
    <circle cx="16" cy="6.5" r="4" fill={color} />

    {/* 左右子节点 */}
    <circle cx="9" cy="18" r="3.4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />
    <circle cx="23" cy="18" r="3.4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />

    {/* 叶子节点 */}
    <circle cx="5.5" cy="26.8" r="1.9" fill={color} fillOpacity="0.65" />
    <circle cx="13" cy="26.8" r="1.9" fill={color} fillOpacity="0.65" />
    <circle cx="19" cy="26.8" r="1.9" fill={color} fillOpacity="0.65" />
    <circle cx="26.5" cy="26.8" r="1.9" fill={color} fillOpacity="0.65" />
  </svg>
);

export default BinaryTreeIcon;
