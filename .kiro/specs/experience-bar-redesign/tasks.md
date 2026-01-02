# Implementation Plan: Experience Bar Redesign

## Overview

实现经验条组件的重新设计，包括移除大圆角、添加帮助图标和详细的境界系统说明提示框。

## Tasks

- [x] 1. 更新 ExperienceBar 样式为小圆角设计
  - 修改 `ExperienceBar.css` 中所有 border-radius 值
  - 将容器、徽章、进度条的圆角从 18px/16px/12px 改为 4px
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. 创建 RealmHelpTooltip 组件
  - [x] 2.1 创建 RealmHelpTooltip.tsx 组件文件
    - 实现境界列表渲染
    - 实现当前境界高亮逻辑
    - 实现经验值和刷题数量计算
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [x] 2.2 创建 RealmHelpTooltip.css 样式文件
    - 实现提示框布局和样式
    - 实现当前境界高亮样式
    - 实现响应式设计
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 3. 在 ExperienceBar 中集成帮助图标
  - [x] 3.1 添加帮助图标到境界徽章旁边
    - 实现问号图标渲染
    - 实现悬停状态管理
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 集成 RealmHelpTooltip 组件
    - 实现悬停显示/隐藏逻辑
    - 传递必要的 props（currentLang, currentLevel）
    - _Requirements: 3.1, 3.7_

- [x] 4. 实现国际化支持
  - 添加中英文提示文本
  - 确保境界名称根据语言正确显示
  - 添加经验值说明的翻译
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 5. Checkpoint - 验证功能完整性
  - 确保所有样式更改正确应用
  - 确保帮助提示框正确显示所有境界信息
  - 确保中英文切换正常工作
  - 确保响应式设计在不同屏幕尺寸下正常工作

- [x] 6. 编写单元测试
  - [x] 6.1 测试经验值计算函数
    - 测试 calculateExpForRealm 对所有境界返回正确值
    - 测试 calculateProblemEstimate 返回合理估算
    - _Requirements: 3.4, 4.4_
  
  - [x] 6.2 测试组件渲染
    - 测试帮助图标正确渲染
    - 测试提示框显示/隐藏逻辑
    - _Requirements: 2.1, 3.1, 3.7_

- [x] 7. 编写属性测试
  - [x] 7.1 Property 1: Realm Data Completeness
    - **Property 1: Realm Data Completeness**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 4.4**
  
  - [x] 7.2 Property 2: Current Realm Highlighting
    - **Property 2: Current Realm Highlighting**
    - **Validates: Requirements 3.6**
  
  - [x] 7.3 Property 3: Language Consistency
    - **Property 3: Language Consistency**
    - **Validates: Requirements 6.3**
  
  - [x] 7.4 Property 4: EXP Calculation Correctness
    - **Property 4: EXP Calculation Correctness**
    - **Validates: Requirements 3.4**

- [x] 8. Final Checkpoint - 确保所有测试通过
  - 运行所有单元测试
  - 运行所有属性测试
  - 确保无 TypeScript 错误
  - 确保无 ESLint 警告

## Notes

- 所有任务均为必需，包括完整的测试覆盖
- 现有的 REALMS 数据结构将被复用，无需修改
- 提示框使用绝对定位，需要注意 z-index 层级
- 响应式设计需要特别关注移动端的提示框位置
