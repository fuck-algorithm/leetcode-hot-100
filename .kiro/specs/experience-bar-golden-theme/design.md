# Design Document: Experience Bar Golden Theme

## Overview

将经验条组件的颜色主题从绿色系改为金色系，以更好地契合修仙/玄幻风格。金色在中国传统文化中象征着尊贵、仙气和突破，更符合"修仙"的主题意境。本设计仅涉及 CSS 样式修改，不涉及组件逻辑变更。

## Architecture

### File Changes

```
ExperienceBar/
├── ExperienceBar.css      # 修改：所有绿色替换为金色
└── (其他文件无需修改)
```

### Design Decisions

1. **金色色板选择**: 使用 Tailwind CSS 的 amber/yellow 色系作为基础，确保色彩协调
2. **渐变方向保持**: 保持现有的渐变方向和动画效果，仅替换颜色值
3. **对比度保证**: 金色需要在深色背景上保持足够的对比度和可读性

## Components and Interfaces

### Color Palette Mapping

将现有的绿色系替换为金色系：

| 原绿色值 | 用途 | 新金色值 | 说明 |
|---------|------|---------|------|
| #22c55e | 主色调 | #f59e0b | amber-500 |
| #4ade80 | 亮色调 | #fbbf24 | amber-400 |
| #86efac | 高亮色 | #fcd34d | amber-300 |
| #16a34a | 深色调 | #d97706 | amber-600 |
| #15803d | 更深色 | #b45309 | amber-700 |
| #0d5c2e | 最深色 | #92400e | amber-800 |
| #34d399 | 辅助色 | #f59e0b | amber-500 |
| #74, 222, 128 (rgba) | 透明主色 | 245, 158, 11 (rgba) | amber-500 rgba |

### CSS Variable Approach (Optional Enhancement)

可以考虑使用 CSS 变量来管理主题色，便于未来扩展：

```css
:root {
  --exp-primary: #f59e0b;
  --exp-primary-light: #fbbf24;
  --exp-primary-lighter: #fcd34d;
  --exp-primary-dark: #d97706;
  --exp-primary-darker: #b45309;
  --exp-primary-darkest: #92400e;
}
```

## Data Models

无数据模型变更，仅涉及样式修改。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Color Contrast Accessibility

*For any* text element in the Experience Bar (realm name, EXP current, EXP next), the color contrast ratio between the text color and its background SHALL meet WCAG AA standard (minimum 4.5:1 for normal text).

**Validates: Requirements 5.1, 5.2**

## Error Handling

1. **浏览器兼容性**: 使用标准 CSS 属性，确保主流浏览器兼容
2. **降级方案**: 如果某些 CSS 特性不支持，确保基本样式仍然可用

## Testing Strategy

### Unit Tests

由于这是纯 CSS 样式修改，主要通过以下方式验证：

1. **视觉回归测试**: 截图对比确保样式正确应用
2. **CSS 值验证**: 检查关键 CSS 属性包含正确的金色值

### Property-Based Tests

使用 fast-check 进行属性测试：

1. **Property 1**: 对所有文本元素，计算其与背景的对比度，验证符合 WCAG AA 标准

### Manual Testing

1. 在不同浏览器中验证视觉效果
2. 验证动画效果流畅且颜色正确
3. 验证响应式布局下颜色显示正常

## Visual Design Specifications

### Container Styles

```css
/* 容器边框和光晕 */
.experience-bar-container {
  border: 2px solid rgba(245, 158, 11, 0.5);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.02),
    0 0 80px rgba(245, 158, 11, 0.2),
    0 0 120px rgba(245, 158, 11, 0.08),
    inset 0 0 60px rgba(245, 158, 11, 0.03);
}

/* 内部装饰渐变 */
.experience-bar-container::before {
  background: 
    radial-gradient(ellipse at 10% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 35%),
    radial-gradient(ellipse at 90% 80%, rgba(251, 191, 36, 0.12) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 50%, rgba(217, 119, 6, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 20% 70%, rgba(245, 158, 11, 0.06) 0%, transparent 25%),
    radial-gradient(circle at 80% 30%, rgba(251, 191, 36, 0.06) 0%, transparent 25%);
}

/* 流光动画 */
.experience-bar-container::after {
  background: linear-gradient(
    90deg, 
    transparent 0%, 
    rgba(245, 158, 11, 0.02) 20%,
    rgba(251, 191, 36, 0.1) 45%,
    rgba(252, 211, 77, 0.15) 50%,
    rgba(251, 191, 36, 0.1) 55%,
    rgba(245, 158, 11, 0.02) 80%,
    transparent 100%
  );
}
```

### Realm Badge Styles

```css
.realm-badge {
  background: 
    linear-gradient(145deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.1) 40%, rgba(180, 83, 9, 0.15) 100%);
  border: 1px solid rgba(245, 158, 11, 0.55);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 30px rgba(245, 158, 11, 0.25),
    inset 0 0 20px rgba(245, 158, 11, 0.05);
}

.realm-name {
  color: #fbbf24;
  text-shadow: 
    0 0 12px rgba(251, 191, 36, 0.9),
    0 0 24px rgba(245, 158, 11, 0.6),
    0 0 36px rgba(245, 158, 11, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.5);
}

.realm-icon {
  filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.7));
}
```

### Progress Bar Styles

```css
.exp-bar-track {
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 
    inset 0 4px 12px rgba(0, 0, 0, 0.6),
    inset 0 -2px 4px rgba(255, 255, 255, 0.03),
    0 0 15px rgba(245, 158, 11, 0.15);
}

.exp-bar-fill {
  background: linear-gradient(
    90deg, 
    #92400e 0%, 
    #b45309 15%, 
    #d97706 30%, 
    #f59e0b 50%, 
    #fbbf24 70%, 
    #fcd34d 85%,
    #fbbf24 100%
  ) !important;
  box-shadow: 
    0 0 20px rgba(245, 158, 11, 0.9),
    0 0 40px rgba(245, 158, 11, 0.6),
    0 0 60px rgba(245, 158, 11, 0.3),
    inset 0 2px 6px rgba(255, 255, 255, 0.5),
    inset 0 -2px 6px rgba(0, 0, 0, 0.3);
}
```

### Text and Helper Elements

```css
.exp-current {
  color: #fbbf24;
  text-shadow: 
    0 0 12px rgba(251, 191, 36, 0.9),
    0 0 24px rgba(245, 158, 11, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.5);
}

.help-icon {
  border: 1px solid rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
}

.help-icon:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(251, 191, 36, 0.6);
  color: #fcd34d;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
}
```

