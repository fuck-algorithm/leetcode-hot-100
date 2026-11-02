import React from 'react';
import { IconProps } from './types';

/**
 * 二分查找图标
 * 概念：每次排除一半，聚焦中点
 * 视觉：有序数组 + 放大镜对准中间元素
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
    {/* 数组元素 */}
    <rect x="2.5" y="20.5" width="4.2" height="6" rx="1.6" fill={color} fillOpacity="0.25" />
    <rect x="8.2" y="20.5" width="4.2" height="6" rx="1.6" fill={color} fillOpacity="0.42" />
    <rect x="13.9" y="20.5" width="4.2" height="6" rx="1.6" fill={color} />
    <rect x="19.6" y="20.5" width="4.2" height="6" rx="1.6" fill={color} fillOpacity="0.42" />
    <rect x="25.3" y="20.5" width="4.2" height="6" rx="1.6" fill={color} fillOpacity="0.25" />

    {/* 放大镜 */}
    <circle cx="17" cy="9.5" r="5.2" stroke={color} strokeWidth="2.4" />
    <path
      d="M20.7 13.2L24.5 17"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

export default BinarySearchIcon;
