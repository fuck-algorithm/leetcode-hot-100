import React from 'react';
import { IconProps } from './types';

/**
 * 栈图标
 * 概念：后进先出
 * 视觉：四层堆叠 + 顶部弹出动画 + 侧边编号
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
    <defs>
      <linearGradient id="stackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0.3" />
      </linearGradient>
    </defs>

    {/* 栈层 - 从下到上 */}
    <rect x="5.5" y="21" width="21" height="4.5" rx="2.2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <rect x="5.5" y="15.5" width="21" height="4.5" rx="2.2" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" />
    <rect x="5.5" y="10" width="21" height="4.5" rx="2.2" fill={color} fillOpacity="0.65" stroke={color} strokeWidth="2" />
    <rect x="5.5" y="4.5" width="21" height="4.5" rx="2.2" fill={color} />

    {/* 侧边编号 */}
    <text x="30" y="24" fill={color} fontSize="4" fontWeight="bold" textAnchor="middle">1</text>
    <text x="30" y="18.5" fill={color} fontSize="4" fontWeight="bold" textAnchor="middle">2</text>
    <text x="30" y="13" fill={color} fontSize="4" fontWeight="bold" textAnchor="middle">3</text>
    <text x="30" y="7.5" fill={color} fontSize="4" fontWeight="bold" textAnchor="middle">4</text>

    {/* 弹出动画 */}
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
