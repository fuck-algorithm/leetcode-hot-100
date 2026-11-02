import React from 'react';
import { IconProps } from './types';

/**
 * 栈图标
 * 概念：后进先出
 * 视觉：三层堆叠 + 弹出箭头
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
    {/* 栈层 */}
    <rect x="5.5" y="21" width="21" height="4.5" rx="2.2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <rect x="5.5" y="15.5" width="21" height="4.5" rx="2.2" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" />
    <rect x="5.5" y="10" width="21" height="4.5" rx="2.2" fill={color} fillOpacity="0.65" stroke={color} strokeWidth="2" />
    <rect x="5.5" y="4.5" width="21" height="4.5" rx="2.2" fill={color} />

    {/* 弹出箭头 */}
    <path d="M16 2v1.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M13.5 1L16 3.5L18.5 1"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StackIcon;
