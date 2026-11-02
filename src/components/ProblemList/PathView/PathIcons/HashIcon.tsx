import React from 'react';
import { IconProps } from './types';

/**
 * 哈希表图标
 * 概念：key 通过哈希函数映射到桶数组
 * 视觉：左侧 key 节点 + 箭头指向右侧三个桶，中间桶被命中
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
    {/* 桶数组 */}
    <rect x="16" y="4" width="12" height="6" rx="2" stroke={color} strokeWidth="2.2" />
    <rect
      x="16"
      y="13"
      width="12"
      height="6"
      rx="2"
      fill={color}
      fillOpacity="0.35"
      stroke={color}
      strokeWidth="2.2"
    />
    <rect x="16" y="22" width="12" height="6" rx="2" stroke={color} strokeWidth="2.2" />

    {/* key 与哈希箭头 */}
    <circle cx="7" cy="16" r="2.6" fill={color} />
    <path d="M10.6 16h3" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M11.8 13.8L14.2 16l-2.4 2.2"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HashIcon;
