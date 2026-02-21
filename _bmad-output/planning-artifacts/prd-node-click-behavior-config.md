---
title: '节点单击默认行为配置功能'
slug: 'node-click-behavior-config'
created: '2026-02-21T08:01:00Z'
status: 'draft'
author: 'BMAD Analyst'
---

# PRD: 节点单击默认行为配置功能

**Version:** 1.0
**Status:** Draft
**Date:** 2026-02-21

---

## 1. 问题陈述 (Problem Statement)

### 当前行为

在多邻国风格的路径视图中，用户单击题目节点时：
- **有动画的题目**: 直接打开 GitHub Pages 动画演示站点
- **无动画的题目**: 直接打开 LeetCode 题目页面

### 用户痛点

1. **灵活性不足**: 部分用户可能更倾向于直接跳转 LeetCode 刷题，而非观看动画演示
2. **学习场景差异**: 
   - 初次学习者：希望看动画理解思路
   - 复习者：希望直接跳转 LeetCode 刷题
3. **无法自定义**: 不同用户有不同的使用习惯，但当前没有配置选项

### 目标用户

- 想要自定义单击行为的高级用户
- 偏好直接刷题而非观看动画的用户
- 教育机构或团队管理者

---

## 2. 解决方案 (Solution)

### 核心功能

添加用户可配置的"节点单击默认行为"设置，允许用户选择单击节点时的目标：

| 选项 | 行为 |
|------|------|
| **动画演示** (默认) | 打开 GitHub Pages 动画演示站点 |
| **LeetCode** | 打开 LeetCode 题目页面 |
| **无动作** | 单击仅选中节点，不跳转 |

### 附加功能

- 设置入口：节点右键菜单底部添加"设置"选项
- 即时生效：修改设置后立即生效，无需刷新
- 持久化：设置保存到 localStorage

---

## 3. 范围 (Scope)

### In Scope

- 添加节点单击行为配置入口
- 实现三种点击行为选项
- 设置持久化到 localStorage
- 动画徽章点击行为保持不变（始终打开动画）

### Out of Scope

- 移动端适配（后续版本）
- 批量导入/导出设置（后续版本）
- 云端同步设置（后续版本）

---

## 4. 功能需求 (Functional Requirements)

### FR-001: 设置入口

- 复用现有的节点右键菜单 (`onContextMenu`)
- 在右键菜单底部添加"设置默认行为"选项
- 点击后打开设置弹窗/抽屉

### FR-002: 行为选项

- 提供单选按钮组，包含三个选项
- 默认选中"动画演示"
- 选项带有简短描述

### FR-003: 设置持久化

- 使用 localStorage 保存用户偏好
- 存储键名建议: `path_node_click_behavior`
- 值: `animation` | `leetcode` | `none`

### FR-004: 行为执行

- 读取用户设置并执行对应行为
- 设置变更即时生效

---

## 5. 非功能需求 (Non-Functional Requirements)

### 性能

- 设置读取应在组件渲染时同步完成
- 无额外网络请求

### 兼容性

- 支持最新 Chrome、Firefox、Safari、Edge
- 兼容 React 18

### 可访问性

- 设置按钮应有 aria-label
- 选项应可通过键盘选择

---

## 6. 技术实现提示

### 相关文件

- `src/components/ProblemList/PathView/DuolingoPath.tsx` - 主组件，右键菜单渲染位置（约第672-715行）
- `src/components/ProblemList/PathView/PathProblemItem.tsx` - 列表视图点击逻辑
- `src/components/ProblemList/utils/animationUtils.ts` - 动画点击工具函数
- `src/i18n/locales/` - 需要添加新的国际化文本

### 右键菜单集成

在 `DuolingoPath.tsx` 的 `node-context-menu` 区域（约第685-714行）添加：

```tsx
{/* 菜单项分割线 */}
<div className="context-menu-divider"></div>

{/* 设置入口 */}
<button 
  className="context-menu-btn settings-btn"
  onClick={(e) => openSettingsModal(e)}
>
  ⚙️ {currentLang === 'zh' ? '设置默认行为' : 'Set Default Behavior'}
</button>
```

### 存储结构

```typescript
interface NodeClickBehaviorSettings {
  behavior: 'animation' | 'leetcode' | 'none';
}
```

---

## 7. 验收标准 (Acceptance Criteria)

- [ ] AC-001: 用户可以在路径视图找到设置入口
- [ ] AC-002: 用户可以选择三种点击行为之一
- [ ] AC-003: 设置保存后刷新页面仍然有效
- [ ] AC-004: 单击节点时按设置执行对应行为
- [ ] AC-005: 动画徽章点击始终打开动画（不受此设置影响）
- [ ] AC-006: 中英文文本正确显示

---

## 8. 优先级

**Medium** - 增强用户体验的功能，非核心功能

---

## 9. 后续迭代

- 移动端适配
- 批量设置导入/导出
- 云端设置同步
