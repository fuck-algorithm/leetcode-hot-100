import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 图论
 * 概念：顶点与边组成的网络
 */
const GraphIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <path
      d="M16 5.3L6 15.6M16 5.3L26 15.6M6 15.6L16 26.3M26 15.6L16 26.3"
      strokeWidth={2.4}
      strokeOpacity={0.7}
    />
    <circle cx="16" cy="5.3" r="3.2" fill={color} />
    <circle cx="6" cy="15.6" r="3.1" fill={color} fillOpacity={0.85} />
    <circle cx="26" cy="15.6" r="3.1" fill={color} fillOpacity={0.85} />
    <circle cx="16" cy="26.3" r="3.1" fill={color} fillOpacity={0.85} />
  </IconBase>
);

export default GraphIcon;