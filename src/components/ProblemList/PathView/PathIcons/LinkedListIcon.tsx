import React from 'react';
import { IconProps } from './types';

/**
 * 链表图标
 * 概念：节点通过 next 指针串联
 * 视觉：两个数据节点 + null 终点，节点之间用箭头连接
 */
const LinkedListIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 数据节点 */}
    <circle cx="4" cy="16" r="3.2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />
    <circle cx="16" cy="16" r="3.2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />

    {/* null 终点 */}
    <circle cx="28" cy="16" r="3.2" stroke={color} strokeWidth="2.2" />
    <path d="M26.8 17.2L29.2 14.8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* next 指针 */}
    <path
      d="M8.4 13.2L11.6 16L8.4 18.8M20.4 13.2L23.6 16L20.4 18.8"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LinkedListIcon;
