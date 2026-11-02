import React from 'react';
import { IconProps } from './types';

/**
 * 堆图标
 * 概念：带优先级的完全二叉树
 * 视觉：根节点带皇冠 + 层级数字 + 优先级箭头
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
    <defs>
      <radialGradient id="heapGrad" cx="50%" cy="20%" r="80%">
        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* 背景光晕 */}
    <circle cx="16" cy="12" r="14" fill="url(#heapGrad)" />

    {/* 连线 */}
    <path d="M13.5 11L10.5 16M18.5 11L21.5 16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M8 22L5.5 26M11 22L13 26M21 22L19 26M23 22L25.5 26"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />

    {/* 根节点 + 皇冠 */}
    <circle cx="16" cy="7.5" r="4.2" fill={color} />
    <path
      d="M11 3.5L13.5 1L16 3L18.5 1L21 3.5L19 4.5H13L11 3.5Z"
      fill={color}
    />
    <circle cx="16" cy="2.5" r="1" fill={color} fillOpacity="0.5" />

    {/* 子节点带编号 */}
    <circle cx="9" cy="19" r="3.4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />
    <text x="9" y="20" fill={color} fontSize="3.5" fontWeight="bold" textAnchor="middle">1</text>
    <circle cx="23" cy="19" r="3.4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.2" />
    <text x="23" y="20" fill={color} fontSize="3.5" fontWeight="bold" textAnchor="middle">2</text>

    {/* 叶子节点 */}
    <circle cx="5.5" cy="27.5" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="13" cy="27.5" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="19" cy="27.5" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="26.5" cy="27.5" r="2" fill={color} fillOpacity="0.6" />

    {/* 优先级上升箭头 */}
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
