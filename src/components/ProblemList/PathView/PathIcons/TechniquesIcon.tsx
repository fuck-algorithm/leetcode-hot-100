import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 技巧
 * 概念：灵光一现，用巧妙的角度解决问题
 */
const TechniquesIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <circle cx="16" cy="12.8" r="6.8" strokeWidth={2.6} fill={color} fillOpacity={0.12} />
    <path d="M13 14.2c1-2 2.5-2 3 0s2 2 3 0" strokeWidth={2.2} />
    <path d="M11.8 21.4h8.4M13.4 25.4h5.2" strokeWidth={2.6} />
    <path d="M10.2 8.6L7.6 6M21.8 8.6L24.4 6M16 5.4V2.4" strokeWidth={2.2} strokeOpacity={0.85} />
  </IconBase>
);

export default TechniquesIcon;