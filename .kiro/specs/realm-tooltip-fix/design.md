# Design Document: Realm Tooltip Fix

## Overview

本设计文档描述如何修复 RealmHelpTooltip 组件的显示问题。主要解决两个问题：
1. Tooltip 被其他元素遮挡导致无法正常查看
2. 深色玄幻风格与页面金色浅色主题不协调

解决方案是重新设计 tooltip 的 CSS 样式，将其从深色主题改为与 ExperienceBar 一致的金色浅色主题，同时修复 z-index 和定位问题。

## Architecture

### 组件结构（保持不变）

```
ExperienceBar
├── realm-section
│   ├── realm-badge (境界徽章)
│   └── help-icon-wrapper
│       ├── help-icon (问号按钮)
│       └── RealmHelpTooltip (帮助提示框) ← 需要修复
└── exp-bar-wrapper (经验条)
```

### 样式修改范围

仅修改 `RealmHelpTooltip.css` 文件，不涉及组件逻辑变更。

## Components and Interfaces

### RealmHelpTooltip 组件

组件接口保持不变：

```typescript
interface RealmHelpTooltipProps {
  currentLang: string;      // 当前语言 'zh' | 'en'
  currentLevel: number;     // 当前等级
  isVisible: boolean;       // 是否显示
}
```

### CSS 类结构

```
.realm-help-tooltip          // 主容器
├── .tooltip-header          // 标题区域
│   └── .tooltip-title       // 标题文字
├── .exp-rules               // 经验规则区域
│   ├── .exp-rule-title      // 规则标题
│   └── .exp-rule-items      // 规则项容器
│       └── .exp-rule-item   // 单个规则项 (.easy/.medium/.hard/.treasure)
└── .realm-list              // 境界列表
    └── .realm-item          // 单个境界项 (.current 当前境界)
        ├── .realm-item-left
        │   ├── .realm-item-icon
        │   └── .realm-item-info
        │       ├── .realm-item-name
        │       └── .current-badge
        └── .realm-item-right
            ├── .realm-item-level
            ├── .realm-item-exp
            └── .realm-item-estimate
```

## Data Models

无数据模型变更，仅涉及 CSS 样式修改。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tooltip 视口边界约束

*For any* viewport size and tooltip position, when the tooltip is visible, its bounding box SHALL be completely within the viewport boundaries (no clipping or overflow outside visible area).

**Validates: Requirements 1.3**

### Property 2: 难度徽章颜色唯一性

*For any* set of difficulty badges (easy, medium, hard, treasure), each badge type SHALL have a distinct primary color that is visually distinguishable from the others.

**Validates: Requirements 2.4**

### Property 3: 文字对比度可访问性

*For any* text element within the tooltip, the contrast ratio between the text color and its background color SHALL meet WCAG AA standard (minimum 4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 3.1**

## Error Handling

### 定位边界处理

当 tooltip 可能超出视口时：
- 如果右侧空间不足，tooltip 向左偏移
- 如果底部空间不足，tooltip 显示在触发元素上方
- 移动端使用固定定位，居中显示

### 样式降级

如果浏览器不支持某些 CSS 特性（如 backdrop-filter），提供合理的降级样式。

## Testing Strategy

### 单元测试

- 验证 tooltip 在不同语言下正确渲染
- 验证当前境界高亮显示正确

### 属性测试

使用 fast-check 进行属性测试：
- **Property 1**: 生成随机视口尺寸，验证 tooltip 始终在视口内
- **Property 2**: 验证四种徽章颜色互不相同
- **Property 3**: 计算所有文字/背景色对的对比度，验证符合 WCAG 标准

### 视觉回归测试

- 截图对比确保样式修改符合预期
- 验证金色主题与 ExperienceBar 协调

### 测试框架

- 测试框架: Jest + React Testing Library
- 属性测试库: fast-check
- 最小迭代次数: 100 次

## Style Specification

### 颜色方案

| 元素 | 当前值 | 新值 |
|------|--------|------|
| 背景色 | `#0f1419` (深蓝黑) | `#fffbeb` (浅金) |
| 边框色 | `rgba(34, 197, 94, 0.4)` (绿) | `rgba(245, 158, 11, 0.4)` (金) |
| 标题色 | `#4ade80` (绿) | `#b45309` (琥珀棕) |
| 正文色 | `#e5e7eb` (浅灰) | `#78716c` (暖灰) |
| 高亮色 | `#4ade80` (绿) | `#f59e0b` (金) |
| 阴影色 | `rgba(34, 197, 94, x)` (绿) | `rgba(245, 158, 11, x)` (金) |

### Z-Index 层级

```css
.realm-help-tooltip {
  z-index: 9999; /* 确保在所有元素之上 */
}
```

### 定位策略

```css
.realm-help-tooltip {
  position: absolute;
  top: calc(100% + 12px); /* 增加间距避免遮挡 */
  left: 50%;
  transform: translateX(-50%); /* 居中对齐 */
}
```
