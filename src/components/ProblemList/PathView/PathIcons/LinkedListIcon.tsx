import React from 'react';
import { IconProps } from './types';

/**
 * 链表图标
 * 概念：节点通过 next 指针串联
 * 视觉：三个节点 + 箭头 + NULL
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
    {/* 节点 */}
    <circle cx="4" cy="16" r="3.2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2.4" />
    <circle cx="13" cy="16" r="3.2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2.4" />
    <circle cx="22" cy="16" r="3.2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2.4" />

    {/* NULL */}
    <circle cx="30" cy="16" r="2.5" stroke={color} strokeWidth="2.4" />
    <path d="M28.5 17.5L31.5 14.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" />

    {/* 箭头 */}
    <path
      d="M8.5 13.5L11.5 16L8.5 18.5M17.5 13.5L20.5 16L17.5 18.5M26.5 13.5L29.5 16L26.5 18.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LinkedListIcon;
