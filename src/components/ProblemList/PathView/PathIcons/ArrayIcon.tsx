import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 数组与矩阵
 * 概念：连续的存储单元排成二维网格
 */
const ArrayIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <rect x="5.6" y="6.6" width="20.8" height="18.8" rx="3.6" strokeWidth={2.6} />
    <path d="M16 6.6v18.8M5.6 16h20.8" strokeWidth={2.6} />
  </IconBase>
);

export default ArrayIcon;