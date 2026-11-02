import React from 'react';
import { IconProps } from './types';

/**
 * 回溯算法图标
 * 概念：深入分支后回退重试
 * 视觉：分叉路径 + 回退箭头 + 路径编号
 */
const BacktrackingIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
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
      <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.85" />
        <stop offset="100%" stopColor={color} stopOpacity="0.5" />
      </linearGradient>
    </defs>

    {/* 起点 */}
    <circle cx="26" cy="5" r="2.5" fill={color} />
    <text x="26" y="6.5" fill="#fff" fontSize="3" fontWeight="bold" textAnchor="middle">S</text>

    {/* 分叉路径 */}
    <path d="M26 9v4" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M26 13c0 0-4 2-6 5s-2 5-2 5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M26 13c0 0 4 2 6 5s2 5 2 5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />

    {/* 路径编号 */}
    <circle cx="20" cy="18" r="1.3" fill={color} fillOpacity="0.7" />
    <circle cx="32" cy="18" r="1.3" fill={color} fillOpacity="0.7" />

    {/* 回退箭头 */}
    <path
      d="M18 22.5L14 26L18 29.5"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 26h5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />

    {/* 失败标记 */}
    <circle cx="22" cy="23" r="1.5" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M21 22l2 2M23 22l-2 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default BacktrackingIcon;
