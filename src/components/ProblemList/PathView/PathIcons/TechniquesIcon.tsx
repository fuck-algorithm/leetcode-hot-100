import React from 'react';
import { IconProps } from './types';

/**
 * 技巧图标
 * 概念：灵光一现、巧解
 * 视觉：灯泡 + 多条光线 + 小火花 + 思考气泡
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
    <defs>
      <radialGradient id="bulbGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* 背景光晕 */}
    <circle cx="14" cy="13" r="10" fill="url(#bulbGrad)" />

    {/* 灯泡主体 */}
    <path
      d="M14 4a7 7 0 0 0-4.1 12.7c.7.5 1.1 1.3 1.1 2.1v1.2h6v-1.2c0-.8.4-1.6 1.1-2.1A7 7 0 0 0 14 4z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />

    {/* 灯丝 - W 形 */}
    <path
      d="M11 13c1.2-2 2-2 3 0s1.8 2 3 0"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />

    {/* 灯座 */}
    <path d="M11 24h6M12 27h4" stroke={color} strokeWidth="2.4" strokeLinecap="round" />

    {/* 思考气泡 */}
    <circle cx="24" cy="6" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="21" cy="9" r="1.3" fill={color} fillOpacity="0.5" />
    <circle cx="19" cy="11" r="0.8" fill={color} fillOpacity="0.4" />

    {/* 多条光线 */}
    <path d="M5 10L2 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
    <path d="M23 10L26 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
    <path d="M4 14L1 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />

    {/* 小火花 */}
    <path
      d="M8 4L8.5 2.5L9 4L10.5 4.5L9 5L8.5 6.5L8 5L6.5 4.5Z"
      fill={color}
      fillOpacity="0.7"
    />
  </svg>
);

export default TechniquesIcon;
