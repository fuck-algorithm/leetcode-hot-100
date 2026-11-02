import React from 'react';
import { IconProps } from './types';

/**
 * 双指针图标
 * 概念：两个指针从两侧向中间收缩
 * 视觉：数组元素条 + 两个向下的指针游标
 */
const TwoPointersIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 数组元素 */}
    <rect x="3" y="16" width="4" height="8" rx="1.4" fill={color} fillOpacity="0.35" />
    <rect x="8.75" y="16" width="4" height="8" rx="1.4" fill={color} />
    <rect x="14.5" y="16" width="4" height="8" rx="1.4" fill={color} fillOpacity="0.35" />
    <rect x="20.25" y="16" width="4" height="8" rx="1.4" fill={color} />
    <rect x="26" y="16" width="4" height="8" rx="1.4" fill={color} fillOpacity="0.35" />

    {/* 指针游标 */}
    <path d="M8 4h5.5l-2.75 4.4z" fill={color} />
    <path d="M19.5 4H25l-2.75 4.4z" fill={color} />
    <path
      d="M10.75 9.8v4.6M22.25 9.8v4.6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.55"
    />
  </svg>
);

export default TwoPointersIcon;
