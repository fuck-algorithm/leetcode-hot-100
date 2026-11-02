import React from 'react';
import { IconProps } from './types';

/**
 * 哈希表图标
 * 概念：key 通过哈希函数映射到桶数组
 * 视觉：钥匙 + 旋涡状的哈希箭头 + 桶位
 */
const HashIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
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
      <linearGradient id="hashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.6" />
      </linearGradient>
    </defs>

    {/* 钥匙 */}
    <circle cx="7" cy="9" r="4" stroke={color} strokeWidth="2.2" fill={color} fillOpacity="0.15" />
    <circle cx="7" cy="9" r="1.5" fill={color} />
    <path d="M10 12L14 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M15 19h3M15 22h3" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* 哈希旋涡 */}
    <path
      d="M18 8a4 4 0 0 1 0 8c-2 0-3-1-3-2.5s1-2 3-2c1.5 0 2.5 1 2.5 2s-1 2-2.5 2"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />

    {/* 目标桶 */}
    <rect x="20" y="20" width="8" height="8" rx="2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2.2" />
    <circle cx="24" cy="24" r="1.8" fill={color} />
  </svg>
);

export default HashIcon;
