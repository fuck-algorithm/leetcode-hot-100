import React from 'react';
import { IconProps } from './types';

/**
 * 链表图标
 * 概念：节点通过 next 指针串联
 * 视觉：三个节点 + 箭头指针链 + 终点 NULL，带数据值标注
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
    <defs>
      <linearGradient id="listGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0.9" />
      </linearGradient>
    </defs>

    {/* 节点1 */}
    <circle cx="4" cy="16" r="3.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" />
    <text x="4" y="17" fill={color} fontSize="4" fontWeight="bold" textAnchor="middle">1</text>

    {/* 节点2 */}
    <circle cx="13" cy="16" r="3.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />
    <text x="13" y="17" fill={color} fontSize="4" fontWeight="bold" textAnchor="middle">2</text>

    {/* 节点3 */}
    <circle cx="22" cy="16" r="3.5" fill={color} fillOpacity="0.45" stroke={color} strokeWidth="2.2" />
    <text x="22" y="17" fill={color} fontSize="4" fontWeight="bold" textAnchor="middle">3</text>

    {/* NULL 终点 */}
    <circle cx="30" cy="16" r="2.8" stroke={color} strokeWidth="2.2" />
    <path d="M28.5 17.5L31.5 14.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* next 指针链 */}
    <path
      d="M8.5 14L10.5 16L8.5 18M17.5 14L19.5 16L17.5 18M26.5 14L28.5 16L26.5 18"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LinkedListIcon;
