import React from 'react';
import { IconProps } from './types';
import IconBase from './IconBase';

/**
 * 哈希表
 * 概念：# 号即"哈希"，四条粗线构成等宽网格
 */
const HashIcon: React.FC<IconProps> = ({ size = 32, color = '#fff', className }) => (
  <IconBase size={size} color={color} className={className}>
    <path d="M12.5 6.5v19M19.5 6.5v19" strokeWidth={2.8} />
    <path d="M6 12h20M6 20h20" strokeWidth={2.8} />
  </IconBase>
);

export default HashIcon;