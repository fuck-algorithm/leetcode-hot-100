# 宝箱经验值系统不一致问题

## 问题描述
系统中存在两套独立的经验值系统，导致配置和实际使用不一致。

## 当前状态

### 旧系统（正在使用）
- 文件：`src/services/experienceStorage.ts`
- 宝箱经验值：`TREASURE_EXP = 50`
- 使用组件：
  - `TreasureNode.tsx` - 显示宝箱奖励
  - `ExperienceBar.tsx` - 显示经验值进度

### 新系统（未使用）
- 目录：`src/services/experience-system/`
- 配置文件：`experience-config.json`
- 宝箱经验值：
  ```json
  "treasureTierValues": {
    "early": 15000,
    "mid": 25000,
    "late": 35000,
    "final": 45000
  }
  ```
- 状态：有完整的实现、测试和验证，但**没有被任何UI组件使用**

## 问题根源
文案显示"通关宝箱+50 EXP"是**正确的**，因为代码实际使用的就是旧系统的 `TREASURE_EXP = 50`。

但是，新的经验值系统设计了更大的数值范围（15000-45000），这表明可能有计划迁移到新系统。

## 可能的解决方案

### 方案1：继续使用旧系统（简单）
- 保持 `TREASURE_EXP = 50`
- 删除或归档新的 `experience-system/` 目录
- 更新配置文件中的 `treasureTierValues` 为 50

### 方案2：迁移到新系统（推荐）
- 更新 `TreasureNode.tsx` 使用新的经验值系统
- 更新 `ExperienceBar.tsx` 使用新的经验值系统
- 根据宝箱类型（early/mid/late/final）分配不同的经验值
- 更新文案显示对应的经验值（15000-45000）
- 迁移现有用户数据

### 方案3：统一配置
- 在 `experience-config.json` 中添加简单宝箱配置
- 让旧系统读取新配置文件
- 保持向后兼容

## 建议
根据代码结构和测试覆盖率，**建议采用方案2**，迁移到新的经验值系统，因为：
1. 新系统有完整的类型定义和验证
2. 新系统支持不同等级的宝箱（early/mid/late/final）
3. 新系统有完整的单元测试和属性测试
4. 新系统的数值设计更合理（总经验值1,000,000）

## 相关文件
- `src/services/experienceStorage.ts` - 旧系统
- `src/services/experience-system/` - 新系统
- `src/components/ProblemList/PathView/TreasureNode.tsx` - 宝箱组件
- `src/components/ExperienceBar/ExperienceBar.tsx` - 经验条组件
- `src/services/experience-system/config/experience-config.json` - 配置文件
