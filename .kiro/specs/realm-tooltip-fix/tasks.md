# Implementation Plan: Realm Tooltip Fix

## Overview

修复 RealmHelpTooltip 组件的显示问题，将深色玄幻风格改为与 ExperienceBar 一致的金色浅色主题，并修复定位和 z-index 问题。

## Tasks

- [x] 1. 修复 Tooltip 主容器样式
  - [x] 1.1 更新 `.realm-help-tooltip` 背景色为金色浅色主题
    - 将背景从深色渐变改为浅金色渐变 (`#fffbeb`, `#fef3c7`, `#fde68a`)
    - 更新边框颜色为金色 (`rgba(245, 158, 11, 0.4)`)
    - 更新阴影为金色调
    - 提升 z-index 到 9999
    - 调整定位策略，增加 top 间距
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.3_

  - [x] 1.2 更新 `.realm-help-tooltip::before` 背景装饰
    - 将绿色径向渐变改为金色径向渐变
    - _Requirements: 2.1_

- [x] 2. 更新标题和经验规则区域样式
  - [x] 2.1 更新 `.tooltip-header` 和 `.tooltip-title` 样式
    - 边框颜色从绿色改为金色
    - 标题文字颜色从 `#4ade80` 改为 `#b45309`
    - 更新 text-shadow 为金色调
    - _Requirements: 2.2_

  - [x] 2.2 更新 `.exp-rules` 经验规则区域样式
    - 背景色改为金色调
    - 边框颜色改为金色
    - 规则标题颜色调整为暖灰色
    - _Requirements: 2.1, 2.3_

  - [x] 2.3 更新 `.exp-rule-item` 难度徽章样式
    - 保持 easy/medium/hard/treasure 各自的特征色
    - 调整背景和边框以适配浅色主题
    - _Requirements: 2.4_

- [x] 3. 更新境界列表样式
  - [x] 3.1 更新 `.realm-list` 滚动条样式
    - 滚动条轨道和滑块改为金色调
    - _Requirements: 3.3_

  - [x] 3.2 更新 `.realm-item` 境界项样式
    - 背景色改为浅色
    - hover 状态改为金色高亮
    - _Requirements: 3.2_

  - [x] 3.3 更新 `.realm-item.current` 当前境界高亮样式
    - 背景和边框从绿色改为金色
    - 阴影改为金色调
    - _Requirements: 2.5_

  - [x] 3.4 更新境界项文字颜色
    - `.realm-item-name` 改为深色文字
    - `.realm-item-level`, `.realm-item-exp`, `.realm-item-estimate` 调整颜色
    - `.current-badge` 改为金色主题
    - _Requirements: 2.2, 3.1_

- [x] 4. 更新响应式样式
  - [x] 4.1 更新移动端样式
    - 确保移动端 tooltip 正确显示
    - 调整固定定位时的背景色
    - _Requirements: 3.4_

- [x] 5. Checkpoint - 验证样式修改
  - 在浏览器中验证 tooltip 显示正确
  - 确保不被遮挡
  - 确保配色与经验条协调
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. 编写属性测试
  - [x] 6.1 编写难度徽章颜色唯一性属性测试
    - **Property 2: 难度徽章颜色唯一性**
    - **Validates: Requirements 2.4**

  - [x] 6.2 编写文字对比度属性测试
    - **Property 3: 文字对比度可访问性**
    - **Validates: Requirements 3.1**

## Notes
- 本次修改仅涉及 CSS 样式，不修改组件逻辑
- 主要修改文件: `src/components/ExperienceBar/RealmHelpTooltip.css`
