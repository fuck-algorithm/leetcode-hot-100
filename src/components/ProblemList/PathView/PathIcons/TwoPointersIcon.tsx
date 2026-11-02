import React from 'react';
import { IconProps } from './types';

/**
 * 双指针图标
 * 概念：两个指针从两侧向中间收缩
 * 视觉：数据条 + 两只相向的手指 + 收缩动画示意
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
    <defs>
      <linearGradient id="twoPtrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="50%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0.8" />
      </linearGradient>
    </defs>

    {/* 数据条 */}
    <rect x="3" y="16" width="3.5" height="7" rx="1.5" fill={color} fillOpacity="0.3" />
    <rect x="8" y="15" width="3.5" height="8" rx="1.5" fill={color} fillOpacity="0.5" />
    <rect x="13" y="14" width="3.5" height="9" rx="1.5" fill={color} fillOpacity="0.7" />
    <rect x="18" y="14" width="3.5" height="9" rx="1.5" fill={color} fillOpacity="0.7" />
    <rect x="23" y="15" width="3.5" height="8" rx="1.5" fill={color} fillOpacity="0.5" />
    <rect x="28" y="16" width="3.5" height="7" rx="1.5" fill={color} fillOpacity="0.3" />

    {/* 左手指 */}
    <path
      d="M6 4c0 0 1.5-1 3-1s2.5 1 2.5 2c0 1-1 2-2.5 2s-2.5-1-2.5-2"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2.2"
    />
    <path d="M8.5 7v4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M7 11v2" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M10 11v2" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* 右手指 */}
    <path
      d="M26 4c0 0-1.5-1-3-1s-2.5 1-2.5 2c0 1 1 2 2.5 2s2.5-1 2.5-2"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2.2"
    />
    <path d="M23.5 7v4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M22 11v2" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M25 11v2" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* 收缩箭头 */}
    <path d="M14 13L16 11L18 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default TwoPointersIcon;
