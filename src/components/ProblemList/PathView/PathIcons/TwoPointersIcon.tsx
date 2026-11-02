import React from 'react';
import { IconProps } from './types';

/**
 * 双指针图标
 * 概念：两个指针相向收缩
 * 视觉：数据条 + 两个箭头
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
    {/* 数据条 */}
    <rect x="3" y="16" width="3.5" height="7" rx="1.5" fill={color} fillOpacity="0.3" />
    <rect x="8" y="15" width="3.5" height="8" rx="1.5" fill={color} fillOpacity="0.5" />
    <rect x="13" y="14" width="3.5" height="9" rx="1.5" fill={color} fillOpacity="0.7" />
    <rect x="18" y="14" width="3.5" height="9" rx="1.5" fill={color} fillOpacity="0.7" />
    <rect x="23" y="15" width="3.5" height="8" rx="1.5" fill={color} fillOpacity="0.5" />
    <rect x="28" y="16" width="3.5" height="7" rx="1.5" fill={color} fillOpacity="0.3" />

    {/* 左箭头 */}
    <path d="M10 6v3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M7 7L10 4L13 7"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 右箭头 */}
    <path d="M22 6v3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M19 7L22 4L25 7"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TwoPointersIcon;
