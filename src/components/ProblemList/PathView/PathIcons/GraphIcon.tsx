import React from 'react';
import { IconProps } from './types';

/**
 * 图论图标
 * 概念：顶点与边组成的网络
 * 视觉：中心辐射型网络，带虚线双向边、权值小点
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
    <defs>
      <radialGradient id="graphGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* 背景光晕 */}
    <circle cx="16" cy="16" r="14" fill="url(#graphGrad)" />

    {/* 边 - 实线 */}
    <path
      d="M16 5L6 13.5M16 5L26 13.5M6 13.5L10 25M26 13.5L22 25M10 25L22 25"
      stroke={color}
      strokeWidth="2.1"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />

    {/* 边 - 虚线双向 */}
    <path
      d="M6 13.5L22 25M26 13.5L10 25M16 5L16 16"
      stroke={color}
      strokeWidth="1.6"
      strokeOpacity="0.35"
      strokeLinecap="round"
      strokeDasharray="3 2"
    />

    {/* 权值小点 */}
    <circle cx="11" cy="9" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="21" cy="9" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="8" cy="19" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="24" cy="19" r="1" fill={color} fillOpacity="0.6" />

    {/* 顶点 */}
    <circle cx="16" cy="5" r="3.5" fill={color} />
    <circle cx="6" cy="13.5" r="3" fill={color} fillOpacity="0.9" />
    <circle cx="26" cy="13.5" r="3" fill={color} fillOpacity="0.9" />
    <circle cx="10" cy="25" r="3" fill={color} fillOpacity="0.75" />
    <circle cx="22" cy="25" r="3" fill={color} fillOpacity="0.75" />
  </svg>
);

export default GraphIcon;
