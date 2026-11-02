import React from 'react';
import { IconProps } from './types';

/**
 * 堆图标
 * 概念：带优先级的完全二叉树
 * 视觉：二叉树 + 优先级箭头
 */
const HeapIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
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
    <path d="M13.5 11L10.5 16M18.5 11L21.5 16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M8 22L5.5 26M11 22L13 26M21 22L19 26M23 22L25.5 26"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />

    {/* 根节点 */}
    <circle cx="16" cy="7.5" r="4.2" fill={color} />

    {/* 子节点 */}
    <circle cx="9" cy="19" r="3.4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />
    <circle cx="23" cy="19" r="3.4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />

    {/* 叶子节点 */}
    <circle cx="5.5" cy="27.5" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="13" cy="27.5" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="19" cy="27.5" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="26.5" cy="27.5" r="2" fill={color} fillOpacity="0.6" />

    {/* 优先级箭头 */}
    <path d="M28 12v5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M25.5 10L28 7.5L30.5 10"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HeapIcon;
