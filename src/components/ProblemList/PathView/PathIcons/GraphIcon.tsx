import React from 'react';
import { IconProps } from './types';

/**
 * 图论图标
 * 概念：顶点与边组成的网络
 * 视觉：五节点网络
 */
const GraphIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 边 */}
    <path
      d="M16 5L6 13.5M16 5L26 13.5M6 13.5L10 25M26 13.5L22 25M10 25L22 25"
      stroke={color}
      strokeWidth="2.1"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />

    {/* 顶点 */}
    <circle cx="16" cy="5" r="3.5" fill={color} />
    <circle cx="6" cy="13.5" r="3" fill={color} fillOpacity="0.9" />
    <circle cx="26" cy="13.5" r="3" fill={color} fillOpacity="0.9" />
    <circle cx="10" cy="25" r="3" fill={color} fillOpacity="0.75" />
    <circle cx="22" cy="25" r="3" fill={color} fillOpacity="0.75" />
  </svg>
);

export default GraphIcon;
