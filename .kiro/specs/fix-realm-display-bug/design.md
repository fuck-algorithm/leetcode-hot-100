# 修复境界显示 Bug - 设计文档

## 1. 设计概述

本设计旨在修复当前系统中境界显示的逻辑错误，确保所有组件使用统一的方式计算和显示用户当前境界。

### 1.1 核心原则
1. **单一数据源**：`totalExp` 是唯一的真实数据源
2. **统一计算逻辑**：所有组件使用 `getCurrentRealm(totalExp)` 计算境界
3. **明确字段语义**：`level` 字段始终表示 1-100 的等级，不用于存储 realm 索引

### 1.2 设计目标
- 修复境界显示错误
- 统一境界计算逻辑
- 提高代码可维护性
- 保持向后兼容性

## 2. 架构设计

### 2.1 数据流
```
totalExp (经验值)
    ↓
getCurrentRealm(totalExp) → realmIndex (0-10)
    ↓
REALMS[realmIndex] → 境界信息
    ↓
UI 显示
```

### 2.2 组件关系
```
ExperienceBar
    ├── 使用 experienceAdapter.getCurrentRealm(totalExp)
    └── 传递 totalExp 给 RealmHelpTooltip

RealmHelpTooltip
    ├── 接收 totalExp 参数
    └── 使用 experienceAdapter.getCurrentRealm(totalExp)
```

## 3. 详细设计

### 3.1 修复 UIMigrationService

**文件**：`src/services/experience-adapter/UIMigrationService.ts`

**修改点**：第 106 行

**当前代码**：
```typescript
level: newRealm,
```

**修改后**：
```typescript
level: this.experienceSystem.getCurrentLevel(newExp),
```

**说明**：
- 使用 `getCurrentLevel()` 计算正确的等级（1-100）
- 不再将 realm 索引存储到 `level` 字段

### 3.2 修复 RealmHelpTooltip

**文件**：`src/components/ExperienceBar/RealmHelpTooltip.tsx`

#### 3.2.1 修改接口定义

**当前代码**：
```typescript
interface RealmHelpTooltipProps {
  currentLang: string;
  currentLevel: number;
  isVisible: boolean;
  anchorRect?: DOMRect | null;
}
```

**修改后**：
```typescript
interface RealmHelpTooltipProps {
  currentLang: string;
  totalExp: number;  // 改为传递经验值
  isVisible: boolean;
  anchorRect?: DOMRect | null;
}
```

#### 3.2.2 修改境界计算逻辑

**删除函数**：
```typescript
const getRealmByLevel = (level: number): RealmInfo => {
  for (const realm of REALMS) {
    if (level >= realm.minLevel && level <= realm.maxLevel) {
      return realm;
    }
  }
  return REALMS[REALMS.length - 1];
};
```

**新增导入**：
```typescript
import { experienceAdapter } from '../../services/experience-adapter';
```

**修改组件内部**：
```typescript
const RealmHelpTooltip: React.FC<RealmHelpTooltipProps> = ({
  currentLang,
  totalExp,  // 使用 totalExp 而不是 currentLevel
  isVisible,
  anchorRect
}) => {
  const { t } = useTranslation();
  
  if (!isVisible) return null;

  // 使用 experienceAdapter 计算当前境界索引
  const currentRealmIndex = experienceAdapter.getCurrentRealm(totalExp);
  const currentRealm = REALMS[currentRealmIndex];
  
  // ... 其余代码
```

#### 3.2.3 修改当前境界判断

**当前代码**：
```typescript
const isCurrent = realm.name === currentRealm.name;
```

**修改后**：
```typescript
const isCurrent = index === currentRealmIndex;
```

### 3.3 修复 ExperienceBar

**文件**：`src/components/ExperienceBar/ExperienceBar.tsx`

**修改点**：第 145 行

**当前代码**：
```typescript
<RealmHelpTooltip
  currentLang={currentLang}
  currentLevel={experience.level}
  isVisible={showHelpTooltip}
  anchorRect={helpIconRect}
/>
```

**修改后**：
```typescript
<RealmHelpTooltip
  currentLang={currentLang}
  totalExp={experience.totalExp}
  isVisible={showHelpTooltip}
  anchorRect={helpIconRect}
/>
```

### 3.4 清理 RealmInfo 接口

**文件**：
- `src/components/ExperienceBar/ExperienceBar.tsx`
- `src/components/ExperienceBar/RealmHelpTooltip.tsx`

**修改 RealmInfo 接口**：

**当前代码**：
```typescript
interface RealmInfo {
  name: string;
  nameEn: string;
  translationKey: string;
  minLevel: number;  // 删除
  maxLevel: number;  // 删除
  color: string;
  icon: string;
  bgGradient?: string;
  threshold?: number;
}
```

**修改后**：
```typescript
interface RealmInfo {
  name: string;
  nameEn: string;
  translationKey: string;
  color: string;
  icon: string;
  bgGradient?: string;
  threshold?: number;
}
```

**修改 REALMS 数组**：

移除所有 `minLevel` 和 `maxLevel` 字段：

```typescript
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', translationKey: 'qiRefining', color: '#78716c', icon: '🌱', bgGradient: '...', threshold: 0 },
  { name: '筑基期', nameEn: 'Foundation', translationKey: 'foundation', color: '#22c55e', icon: '🌿', bgGradient: '...', threshold: 50000 },
  // ... 其余境界
];
```

## 4. 数据模型

### 4.1 ExperienceRecord
```typescript
interface ExperienceRecord {
  id: string;
  totalExp: number;        // 累计经验值（主要数据源）
  level: number;           // 用户等级 1-100（派生数据）
  lastUpdated: number;
  schemaVersion?: number;
  migrationDate?: number;
}
```

**字段说明**：
- `totalExp`：唯一的真实数据源，所有计算基于此值
- `level`：派生数据，表示 1-100 的等级，由 `getCurrentLevel(totalExp)` 计算
- `level` 不用于存储 realm 索引

### 4.2 RealmInfo
```typescript
interface RealmInfo {
  name: string;           // 中文名称
  nameEn: string;         // 英文名称
  translationKey: string; // i18n 键
  color: string;          // 主题颜色
  icon: string;           // 图标
  bgGradient?: string;    // 背景渐变
  threshold?: number;     // 起始经验值阈值
}
```

**说明**：
- 移除 `minLevel` 和 `maxLevel` 字段
- 使用数组索引（0-10）表示境界
- `threshold` 字段用于显示，不用于计算

## 5. API 设计

### 5.1 ExperienceAdapter

**不变的 API**：
```typescript
getCurrentRealm(experience: number): number
getRealmProgress(experience: number): number
getExperienceToNextRealm(experience: number): number
getCurrentLevel(experience: number): number
```

**使用方式**：
```typescript
const realmIndex = experienceAdapter.getCurrentRealm(totalExp);
const realm = REALMS[realmIndex];
```

### 5.2 RealmHelpTooltip

**新的 Props**：
```typescript
interface RealmHelpTooltipProps {
  currentLang: string;
  totalExp: number;      // 改为传递经验值
  isVisible: boolean;
  anchorRect?: DOMRect | null;
}
```

## 6. 测试策略

### 6.1 单元测试

#### 测试 getCurrentRealm 边界情况
```typescript
describe('getCurrentRealm', () => {
  it('should return 0 for 0 exp', () => {
    expect(experienceAdapter.getCurrentRealm(0)).toBe(0);
  });
  
  it('should return 0 for 49999 exp', () => {
    expect(experienceAdapter.getCurrentRealm(49999)).toBe(0);
  });
  
  it('should return 1 for 50000 exp', () => {
    expect(experienceAdapter.getCurrentRealm(50000)).toBe(1);
  });
  
  it('should return 10 for 1000000 exp', () => {
    expect(experienceAdapter.getCurrentRealm(1000000)).toBe(10);
  });
});
```

#### 测试迁移服务
```typescript
describe('UIMigrationService', () => {
  it('should set correct level after migration', async () => {
    const result = await migrationService.migrateUserData();
    const exp = await experienceAdapter.getTotalExperience();
    
    const expectedLevel = experienceAdapter.getCurrentLevel(exp.totalExp);
    expect(exp.level).toBe(expectedLevel);
  });
});
```

### 6.2 集成测试

#### 测试 UI 显示
```typescript
describe('ExperienceBar', () => {
  it('should display correct realm for 11 exp', () => {
    const { getByText } = render(<ExperienceBar totalExp={11} />);
    expect(getByText('练气期')).toBeInTheDocument();
  });
  
  it('should display correct realm for 50000 exp', () => {
    const { getByText } = render(<ExperienceBar totalExp={50000} />);
    expect(getByText('筑基期')).toBeInTheDocument();
  });
});
```

#### 测试帮助提示框
```typescript
describe('RealmHelpTooltip', () => {
  it('should mark correct realm as current', () => {
    const { container } = render(
      <RealmHelpTooltip totalExp={11} isVisible={true} />
    );
    
    const currentRealm = container.querySelector('.realm-item.current');
    expect(currentRealm).toHaveTextContent('练气期');
  });
});
```

## 7. 迁移计划

### 7.1 代码修改顺序
1. 修复 `UIMigrationService.ts`（最重要）
2. 修复 `RealmHelpTooltip.tsx`
3. 修复 `ExperienceBar.tsx`
4. 清理 `RealmInfo` 接口
5. 添加测试

### 7.2 数据迁移
对于已经迁移过的用户：
- 如果 `level` 字段包含错误的 realm 索引（0-10），需要重新计算
- 可以在应用启动时检查并修复：
  ```typescript
  const exp = await experienceAdapter.getTotalExperience();
  const correctLevel = experienceAdapter.getCurrentLevel(exp.totalExp);
  if (exp.level !== correctLevel) {
    // 修复错误的 level 值
    await experienceAdapter.addExperience(0); // 触发重新计算
  }
  ```

### 7.3 回滚计划
如果修复后出现问题：
1. 恢复修改前的代码
2. 使用 localStorage 中的备份数据
3. 重新运行迁移

## 8. 性能考虑

### 8.1 计算开销
- `getCurrentRealm()` 使用二分查找，时间复杂度 O(log n)
- n = 11（境界数量），性能影响可忽略

### 8.2 渲染优化
- 境界计算结果可以缓存
- 只在 `totalExp` 变化时重新计算

## 9. 安全考虑

### 9.1 数据验证
- 确保 `totalExp` 为非负数
- 确保 realm 索引在有效范围内（0-10）

### 9.2 边界情况
- 处理 `totalExp` 超过最大值的情况
- 处理 `totalExp` 为负数的情况

## 10. 文档更新

### 10.1 代码注释
在关键位置添加注释：
```typescript
// 注意：level 字段表示 1-100 的用户等级，不是 realm 索引
// 使用 getCurrentRealm(totalExp) 获取境界索引（0-10）
```

### 10.2 README 更新
更新项目文档，说明：
- `ExperienceRecord.level` 的语义
- 如何正确获取当前境界
- 境界索引与等级的区别

## 11. 正确性属性

### 11.1 属性 1：境界显示一致性
**描述**：UI 显示的境界应该与经验值对应的境界完全一致

**形式化**：
```
∀ exp ∈ [0, 1000000]:
  displayedRealm = REALMS[getCurrentRealm(exp)]
```

**测试策略**：
- 使用 property-based testing 生成随机经验值
- 验证显示的境界与计算的境界一致

### 11.2 属性 2：境界阈值正确性
**描述**：当经验值达到境界阈值时，应该晋升到下一个境界

**形式化**：
```
∀ i ∈ [0, 9]:
  getCurrentRealm(thresholds[i]) = i
  getCurrentRealm(thresholds[i+1] - 1) = i
  getCurrentRealm(thresholds[i+1]) = i + 1
```

**测试策略**：
- 测试所有境界阈值的边界情况
- 验证阈值前后的境界变化

### 11.3 属性 3：等级计算正确性
**描述**：`level` 字段应该始终等于 `getCurrentLevel(totalExp)`

**形式化**：
```
∀ record ∈ ExperienceRecords:
  record.level = getCurrentLevel(record.totalExp)
```

**测试策略**：
- 在每次更新经验值后验证 level 字段
- 使用 property-based testing 验证不变性

## 12. 实现检查清单

- [ ] 修复 `UIMigrationService.ts` 中的 level 计算
- [ ] 修改 `RealmHelpTooltip.tsx` 接口，使用 `totalExp` 参数
- [ ] 修改 `RealmHelpTooltip.tsx` 境界计算逻辑
- [ ] 修改 `ExperienceBar.tsx` 传递参数
- [ ] 移除 `RealmInfo` 中的 `minLevel` 和 `maxLevel` 字段
- [ ] 更新 `REALMS` 数组定义
- [ ] 添加单元测试
- [ ] 添加集成测试
- [ ] 添加 property-based 测试
- [ ] 更新代码注释
- [ ] 验证所有测试通过
- [ ] 手动测试 UI 显示
