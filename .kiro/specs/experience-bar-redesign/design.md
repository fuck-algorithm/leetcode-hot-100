# Design Document: Experience Bar Redesign

## Overview

重新设计经验条组件，采用更现代的扁平化设计风格（小圆角），并添加帮助图标功能。当用户悬停在帮助图标上时，显示完整的境界系统说明，包括所有等级、经验值需求和刷题数量参考。

## Architecture

### Component Structure

```
ExperienceBar/
├── ExperienceBar.tsx      # 主组件（修改）
├── ExperienceBar.css      # 样式文件（修改）
├── RealmHelpTooltip.tsx   # 新增：帮助提示框组件
├── RealmHelpTooltip.css   # 新增：帮助提示框样式
└── index.ts               # 导出文件
```

### Design Decisions

1. **小圆角设计**: 所有圆角统一使用 4px，保持现代扁平风格
2. **帮助图标位置**: 放置在境界徽章右侧，使用问号图标
3. **提示框实现**: 创建独立的 RealmHelpTooltip 组件，支持复杂内容展示
4. **经验值计算**: 复用现有的 REALMS 数据结构，添加计算辅助函数

## Components and Interfaces

### ExperienceBar Component (Modified)

```typescript
interface ExperienceBarProps {
  currentLang: string;
  refreshTrigger?: number;
}

// 现有 REALMS 数据结构保持不变
interface RealmInfo {
  name: string;
  nameEn: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  icon: string;
  bgGradient: string;
}
```

### RealmHelpTooltip Component (New)

```typescript
interface RealmHelpTooltipProps {
  currentLang: string;
  currentLevel: number;
  isVisible: boolean;
  onClose: () => void;
}

interface RealmEstimate {
  realm: RealmInfo;
  totalExpRequired: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}
```

### Helper Functions

```typescript
// 计算达到某个境界所需的总经验值
function calculateExpForRealm(realm: RealmInfo): number {
  // 每个等级需要100 EXP，境界从 minLevel 开始
  return (realm.minLevel - 1) * 100;
}

// 计算达到某个境界的推荐刷题数量
function calculateProblemEstimate(totalExp: number): {
  easyCount: number;
  mediumCount: number;
  hardCount: number;
} {
  // 基于 LeetCode Hot 100 的题目分布：
  // Easy: 20题 (10 EXP each)
  // Medium: 68题 (20 EXP each)
  // Hard: 12题 (30 EXP each)
  // 加上宝箱奖励约 1150 EXP
  
  // 简化计算：假设用户按比例刷题
  // 平均每题约 19.2 EXP (不含宝箱)
  // 含宝箱后平均约 30.7 EXP
  
  const avgExpPerProblem = 19.2;
  const treasureBonus = Math.min(totalExp * 0.375, 1150); // 宝箱最多贡献约37.5%
  const problemExp = totalExp - treasureBonus;
  const totalProblems = Math.ceil(problemExp / avgExpPerProblem);
  
  // 按 Hot 100 比例分配: Easy 20%, Medium 68%, Hard 12%
  return {
    easyCount: Math.ceil(totalProblems * 0.2),
    mediumCount: Math.ceil(totalProblems * 0.68),
    hardCount: Math.ceil(totalProblems * 0.12)
  };
}
```

## Data Models

### Realm Data (Existing)

```typescript
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', minLevel: 1, maxLevel: 3, ... },
  { name: '筑基期', nameEn: 'Foundation', minLevel: 4, maxLevel: 6, ... },
  { name: '金丹期', nameEn: 'Golden Core', minLevel: 7, maxLevel: 9, ... },
  { name: '元婴期', nameEn: 'Nascent Soul', minLevel: 10, maxLevel: 12, ... },
  { name: '化神期', nameEn: 'Spirit Severing', minLevel: 13, maxLevel: 15, ... },
  { name: '炼虚期', nameEn: 'Void Refining', minLevel: 16, maxLevel: 18, ... },
  { name: '合体期', nameEn: 'Body Integration', minLevel: 19, maxLevel: 21, ... },
  { name: '大乘期', nameEn: 'Mahayana', minLevel: 22, maxLevel: 24, ... },
  { name: '渡劫期', nameEn: 'Tribulation', minLevel: 25, maxLevel: 27, ... },
  { name: '大罗金仙', nameEn: 'Golden Immortal', minLevel: 28, maxLevel: 999, ... },
];
```

### Experience Calculation Reference

| 境界 | 等级范围 | 所需总EXP | 预估刷题数 |
|------|----------|-----------|------------|
| 练气期 | 1-3 | 0 | 起始 |
| 筑基期 | 4-6 | 300 | ~10题 |
| 金丹期 | 7-9 | 600 | ~20题 |
| 元婴期 | 10-12 | 900 | ~30题 |
| 化神期 | 13-15 | 1200 | ~40题 |
| 炼虚期 | 16-18 | 1500 | ~50题 |
| 合体期 | 19-21 | 1800 | ~60题 |
| 大乘期 | 22-24 | 2100 | ~70题 |
| 渡劫期 | 25-27 | 2400 | ~80题 |
| 大罗金仙 | 28+ | 2700 | ~90题 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Realm Data Completeness

*For any* realm in the REALMS array, the tooltip SHALL display the realm's name, icon, level range (minLevel-maxLevel), total EXP required ((minLevel-1) * 100), and estimated problem counts.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5, 4.4**

### Property 2: Current Realm Highlighting

*For any* user level, exactly one realm in the tooltip SHALL be highlighted as the current realm, and that realm's minLevel <= userLevel <= maxLevel.

**Validates: Requirements 3.6**

### Property 3: Language Consistency

*For any* supported language (zh, en) and any realm, the displayed realm name SHALL match the corresponding language field (name for zh, nameEn for en).

**Validates: Requirements 6.3**

### Property 4: EXP Calculation Correctness

*For any* realm, the displayed total EXP required SHALL equal (realm.minLevel - 1) * 100.

**Validates: Requirements 3.4**

## Error Handling

1. **Missing Language**: 如果 currentLang 不是 'zh' 或 'en'，默认使用 'en'
2. **Invalid Level**: 如果用户等级超出预期范围，显示最高境界
3. **Tooltip Overflow**: 使用 CSS 确保提示框不会超出视口边界

## Testing Strategy

### Unit Tests

1. 测试 `calculateExpForRealm` 函数对所有境界返回正确的经验值
2. 测试 `calculateProblemEstimate` 函数返回合理的题目数量估算
3. 测试帮助图标的渲染和可见性

### Property-Based Tests

使用 fast-check 库进行属性测试：

1. **Property 1**: 生成随机境界索引，验证所有必需字段都被正确显示
2. **Property 2**: 生成随机用户等级，验证正确的境界被高亮
3. **Property 3**: 对所有语言和境界组合，验证翻译正确性
4. **Property 4**: 对所有境界，验证 EXP 计算公式正确

### Integration Tests

1. 测试悬停交互：鼠标进入/离开时提示框的显示/隐藏
2. 测试响应式布局：不同视口宽度下的表现
3. 测试语言切换：切换语言后内容正确更新

## Visual Design Specifications

### Border Radius

```css
/* 旧设计 */
.experience-bar-container { border-radius: 18px; }
.realm-badge { border-radius: 16px; }
.exp-bar-track { border-radius: 12px; }

/* 新设计 */
.experience-bar-container { border-radius: 4px; }
.realm-badge { border-radius: 4px; }
.exp-bar-track { border-radius: 4px; }
```

### Help Icon Design

```css
.help-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-icon:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}
```

### Tooltip Design

```css
.realm-help-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  min-width: 320px;
  max-width: 400px;
  z-index: 1000;
}

.realm-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
}

.realm-item.current {
  background: #fef3c7;
  border: 1px solid #f59e0b;
}
```
