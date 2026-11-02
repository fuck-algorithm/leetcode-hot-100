import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 动态规划
 * 概念：状态表按子问题逐步推导，路径从初始状态通向目标状态
 */
const DPIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <rect x="4.5" y="4.5" width="10.2" height="10.2" rx="2.5" fill={color} fillOpacity={0.4} />
    <rect x="17.3" y="4.5" width="10.2" height="10.2" rx="2.5" fill={color} fillOpacity={0.3} />
    <rect x="4.5" y="17.3" width="10.2" height="10.2" rx="2.5" fill={color} fillOpacity={0.3} />
    <rect x="17.3" y="17.3" width="10.2" height="10.2" rx="2.5" fill={color} fillOpacity={0.6} />
    <path d="M9.6 9.6L21.6 21.6" strokeWidth={2.8} />
    <path d="M17 21.6L21.6 21.6L21.6 17" strokeWidth={2.8} />
  </IconBase>
);

export default DPIcon;