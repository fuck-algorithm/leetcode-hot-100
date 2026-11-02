import React from 'react';
import { IconProps } from './types';

/**
 * 哈希表图标
 * 概念：key 通过哈希函数映射到桶
 * 视觉：钥匙 + 箭头指向桶
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
    {/* 钥匙 */}
    <circle cx="7" cy="10" r="4" stroke={color} strokeWidth="2.4" fill="none" />
    <circle cx="7" cy="10" r="1.5" fill={color} />
    <path d="M10 13L15 20" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M16 21h3M16 24h3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />

    {/* 箭头 */}
    <path d="M19 14h6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M23 12L25 14L23 16"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 桶 */}
    <rect x="21" y="19" width="8" height="8" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.4" />
  </svg>
);

export default HashIcon;
