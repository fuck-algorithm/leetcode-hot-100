import React from 'react';
import { IconProps } from './types';

/**
 * 技巧图标
 * 概念：灵光一现、巧解
 * 视觉：点亮的灯泡 + 光线
 */
const TechniquesIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* 灯泡 */}
    <path
      d="M16 3.5a7 7 0 0 0-4.1 12.7c.7.5 1.1 1.3 1.1 2.1v1.2h6v-1.2c0-.8.4-1.6 1.1-2.1A7 7 0 0 0 16 3.5z"
      fill={color}
      fillOpacity="0.16"
      stroke={color}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    {/* 灯丝 */}
    <path
      d="M13 14c1.2-2 2-2 3 0s1.8 2 3 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />

    {/* 灯座 */}
    <path d="M13 24h6M14 27h4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* 光线 */}
    <path
      d="M6.5 10.5L3.5 7.5M25.5 10.5L28.5 7.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.7"
    />
  </svg>
);

export default TechniquesIcon;
