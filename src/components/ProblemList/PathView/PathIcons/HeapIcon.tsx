import React from 'react';
import { IconProps } from './types';

/**
 * 堆图标
 * 概念：带优先级的完全二叉树
 * 视觉：根节点高亮 + 二叉结构 + 右侧优先级上升箭头
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
    <path d="M14 10.5L11.2 15.7M18 10.5L20.8 15.7" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
    <path
      d="M8.2 21.4L6 25.3M10.8 21.4L12.6 25.3M21.2 21.4L19.4 25.3M23.8 21.4L26 25.3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.55"
    />

    {/* 根节点 */}
    <circle cx="16" cy="7" r="4" fill={color} />

    {/* 子节点 */}
    <circle cx="9.5" cy="18.5" r="3.2" fill={color} fillOpacity="0.28" stroke={color} strokeWidth="2.1" />
    <circle cx="22.5" cy="18.5" r="3.2" fill={color} fillOpacity="0.28" stroke={color} strokeWidth="2.1" />

    {/* 叶子节点 */}
    <circle cx="5.5" cy="27" r="1.9" fill={color} fillOpacity="0.6" />
    <circle cx="13" cy="27" r="1.9" fill={color} fillOpacity="0.6" />
    <circle cx="19" cy="27" r="1.9" fill={color} fillOpacity="0.6" />
    <circle cx="26.5" cy="27" r="1.9" fill={color} fillOpacity="0.6" />

    {/* 优先级上升 */}
    <path d="M28 14.5V5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M25.7 7.3L28 5l2.3 2.3"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HeapIcon;
