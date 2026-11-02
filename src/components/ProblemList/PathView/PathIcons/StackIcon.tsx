import React from 'react';
import { IconProps } from './types';

/**
 * 栈图标
 * 概念：后进先出
 * 视觉：三层堆叠 + 从顶部压入的元素箭头
 */
const StackIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 栈元素 */}
    <rect x="5.5" y="10" width="21" height="5" rx="2.5" fill={color} />
    <rect
      x="5.5"
      y="16.5"
      width="21"
      height="5"
      rx="2.5"
      fill={color}
      fillOpacity="0.22"
      stroke={color}
      strokeWidth="2"
    />
    <rect
      x="5.5"
      y="23"
      width="21"
      height="5"
      rx="2.5"
      fill={color}
      fillOpacity="0.22"
      stroke={color}
      strokeWidth="2"
    />

    {/* 压栈箭头 */}
    <path d="M16 2.5v5.6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M13.4 5.7L16 8.2l2.6-2.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StackIcon;
