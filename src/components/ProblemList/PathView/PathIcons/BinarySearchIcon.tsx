import React from 'react';
import { IconProps } from './types';

/**
 * 二分查找图标
 * 概念：每次排除一半，聚焦中点
 * 视觉：有序数组 + 放大镜
 */
const BinarySearchIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 有序数组 */}
    <rect x="2.5" y="21" width="4.2" height="6" rx="2" fill={color} fillOpacity="0.08" />
    <rect x="8.2" y="18" width="4.2" height="9" rx="2" fill={color} fillOpacity="0.4" />
    <rect x="13.9" y="15" width="4.2" height="12" rx="2" fill={color} fillOpacity="0.6" />
    <rect x="19.6" y="12" width="4.2" height="15" rx="2" fill={color} />
    <rect x="25.3" y="15" width="4.2" height="12" rx="2" fill={color} fillOpacity="0.08" />

    {/* 放大镜 */}
    <circle cx="16" cy="6" r="5.5" stroke={color} strokeWidth="2.5" />
    <path d="M20.5 10.5L24 14" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export default BinarySearchIcon;
