import React from 'react';
import { IconProps } from './types';

/**
 * 技巧图标
 * 概念：灵光一现、巧解
 * 视觉：灯泡 + 光线
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
    {/* 灯泡主体 */}
    <path
      d="M14 4a7 7 0 0 0-4.1 12.7c.7.5 1.1 1.3 1.1 2.1v1.2h6v-1.2c0-.8.4-1.6 1.1-2.1A7 7 0 0 0 14 4z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />

    {/* 灯丝 */}
    <path
      d="M11 13c1.2-2 2-2 3 0s1.8 2 3 0"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />

    {/* 灯座 */}
    <path d="M11 24h6M12 27h4" stroke={color} strokeWidth="2.4" strokeLinecap="round" />

    {/* 光线 */}
    <path d="M5 10L2 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
    <path d="M23 10L26 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
    <path d="M4 14L1 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
  </svg>
);

export default TechniquesIcon;
