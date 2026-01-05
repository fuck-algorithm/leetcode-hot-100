# Implementation Plan: Experience Bar Golden Theme

## Overview

将经验条组件的颜色主题从绿色系改为金色系。这是一个纯 CSS 样式修改任务，不涉及组件逻辑变更。

## Tasks

- [x] 1. 更新经验条容器样式为金色主题
  - 修改 `.experience-bar-container` 的 border 颜色为金色
  - 修改 box-shadow 中的绿色为金色
  - 修改 `::before` 伪元素的 radial-gradient 颜色为金色
  - 修改 `::after` 伪元素的流光动画颜色为金色
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. 更新境界徽章样式为金色主题
  - 修改 `.realm-badge` 的 background gradient 为金色
  - 修改 `.realm-badge` 的 border 和 box-shadow 为金色
  - 修改 `.realm-badge::before` 的光晕动画颜色为金色
  - 修改 `.realm-icon` 的 drop-shadow 为金色
  - 修改 `.realm-name` 的 color 和 text-shadow 为金色
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. 更新帮助图标样式为金色主题
  - 修改 `.help-icon` 的 border、background、color 为金色
  - 修改 `.help-icon:hover` 的样式为金色
  - _Requirements: 4.2, 4.3_

- [x] 4. 更新经验进度条样式为金色主题
  - 修改 `.exp-bar-track` 的 border 和 box-shadow 为金色
  - 修改 `.exp-bar-track::before` 的纹理颜色为金色
  - 修改 `.exp-bar-fill` 的 background gradient 为金色渐变
  - 修改 `.exp-bar-fill` 的 box-shadow 为金色
  - 修改 `@keyframes fillGlow` 动画的颜色为金色
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5. 更新文字和弹窗样式为金色主题
  - 修改 `.exp-current` 的 color 和 text-shadow 为金色
  - 修改 `.exp-gain-popup` 的 background、border、color、text-shadow 为金色
  - 修改 `@keyframes iconPulse` 动画的颜色为金色
  - _Requirements: 4.1, 4.4_

- [x] 6. Checkpoint - 视觉验证
  - 确保所有绿色已替换为金色
  - 确保颜色在深色背景上有足够对比度
  - 确保动画效果正常显示金色光效
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

## Notes

- 所有颜色替换遵循设计文档中的颜色映射表
- 主要金色值: #f59e0b (amber-500), #fbbf24 (amber-400), #fcd34d (amber-300)
- 深金色值: #d97706 (amber-600), #b45309 (amber-700), #92400e (amber-800)
- rgba 格式的金色: rgba(245, 158, 11, opacity) 和 rgba(251, 191, 36, opacity)

