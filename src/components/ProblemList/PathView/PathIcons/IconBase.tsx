import React from 'react';
import { IconProps } from './types';

export interface IconBaseProps extends IconProps {
  children: React.ReactNode;
}

/**
 * 图标统一画布
 * 32x32 视口，留出光学安全边距；圆头描边由父元素统一下发，
 * 保证 28px ~ 40px 尺寸下线条粗细和转角风格一致。
 */
const IconBase: React.FC<IconBaseProps> = ({
  size = 32,
  color = '#fff',
  className,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

export default IconBase;