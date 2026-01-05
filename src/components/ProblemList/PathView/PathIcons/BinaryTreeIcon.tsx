import React from 'react';
import { IconProps } from './types';

/**
 * 二叉树图标
 * 概念：每个节点最多两个子节点
 * 设计：家族树，根在上，枝叶向下展开
 */
const BinaryTreeIcon: React.FC<IconProps> = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* 树枝 */}
    <path d="M16 9L8 18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 9L24 18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M8 21L5 27" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 21L11 27" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 21L21 27" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 21L27 27" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    
    {/* 根节点 - 最大 */}
    <circle cx="16" cy="6" r="4.5" fill={color}/>
    
    {/* 第二层节点 */}
    <circle cx="8" cy="20" r="3.5" fill={color} fillOpacity="0.85"/>
    <circle cx="24" cy="20" r="3.5" fill={color} fillOpacity="0.85"/>
    
    {/* 叶子节点 */}
    <circle cx="5" cy="28" r="2.5" fill={color} fillOpacity="0.6"/>
    <circle cx="11" cy="28" r="2.5" fill={color} fillOpacity="0.6"/>
    <circle cx="21" cy="28" r="2.5" fill={color} fillOpacity="0.6"/>
    <circle cx="27" cy="28" r="2.5" fill={color} fillOpacity="0.6"/>
  </svg>
);

export default BinaryTreeIcon;
