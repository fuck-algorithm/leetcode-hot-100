import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 栈
 * 概念：后进先出，操作发生在栈顶
 */
const StackIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <path d="M12.4 5.6L16 2L19.6 5.6" strokeWidth={2.6} />
    <rect x="7" y="8.6" width="18" height="4.7" rx="2.3" fill={color} />
    <rect x="7" y="15.6" width="18" height="4.7" rx="2.3" fill={color} fillOpacity={0.55} />
    <rect x="7" y="22.6" width="18" height="4.7" rx="2.3" fill={color} fillOpacity={0.28} />
  </IconBase>
);

export default StackIcon;