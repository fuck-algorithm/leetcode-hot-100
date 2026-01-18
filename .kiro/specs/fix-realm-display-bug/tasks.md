# 修复境界显示 Bug - 任务列表

## 1. 修复核心逻辑

### 1.1 修复 UIMigrationService
- [ ] 修改 `UIMigrationService.ts` 第 106 行
- [ ] 将 `level: newRealm` 改为 `level: this.experienceSystem.getCurrentLevel(newExp)`
- [ ] 添加注释说明 level 字段的语义
- [ ] 验证修改后迁移逻辑正确

### 1.2 修复 RealmHelpTooltip 接口
- [ ] 修改 `RealmHelpTooltipProps` 接口
- [ ] 将 `currentLevel: number` 改为 `totalExp: number`
- [ ] 添加 `experienceAdapter` 导入
- [ ] 更新接口注释

### 1.3 修复 RealmHelpTooltip 境界计算
- [ ] 删除 `getRealmByLevel` 函数
- [ ] 在组件内使用 `experienceAdapter.getCurrentRealm(totalExp)` 计算境界索引
- [ ] 修改 `isCurrent` 判断逻辑，使用索引比较而不是名称比较
- [ ] 验证"当前"标记位置正确

### 1.4 修复 ExperienceBar 传参
- [ ] 修改 `ExperienceBar.tsx` 中 `RealmHelpTooltip` 的调用
- [ ] 将 `currentLevel={experience.level}` 改为 `totalExp={experience.totalExp}`
- [ ] 验证帮助提示框显示正确

## 2. 清理冗余代码

### 2.1 清理 RealmInfo 接口（ExperienceBar）
- [ ] 打开 `src/components/ExperienceBar/ExperienceBar.tsx`
- [ ] 从 `RealmInfo` 接口中移除 `minLevel` 字段
- [ ] 从 `RealmInfo` 接口中移除 `maxLevel` 字段
- [ ] 从 `REALMS` 数组中移除所有 `minLevel` 和 `maxLevel` 值

### 2.2 清理 RealmInfo 接口（RealmHelpTooltip）
- [ ] 打开 `src/components/ExperienceBar/RealmHelpTooltip.tsx`
- [ ] 从 `RealmInfo` 接口中移除 `minLevel` 字段
- [ ] 从 `RealmInfo` 接口中移除 `maxLevel` 字段
- [ ] 从 `REALMS` 数组中移除所有 `minLevel` 和 `maxLevel` 值
- [ ] 移除显示等级的代码（如果有使用 minLevel/maxLevel 的地方）

## 3. 添加测试

### 3.1 单元测试 - getCurrentRealm 边界情况
- [ ] 创建测试文件 `src/services/experience-system/__tests__/unit/RealmSystem.boundary.test.ts`
- [ ] 测试 `getCurrentRealm(0)` 返回 0
- [ ] 测试 `getCurrentRealm(11)` 返回 0
- [ ] 测试 `getCurrentRealm(49999)` 返回 0
- [ ] 测试 `getCurrentRealm(50000)` 返回 1
- [ ] 测试 `getCurrentRealm(119999)` 返回 1
- [ ] 测试 `getCurrentRealm(120000)` 返回 2
- [ ] 测试所有 11 个境界阈值的边界情况
- [ ] 验证所有测试通过

### 3.2 单元测试 - UIMigrationService
- [ ] 创建测试文件 `src/services/experience-adapter/__tests__/UIMigrationService.test.ts`
- [ ] 测试迁移后 `level` 字段包含正确的等级（1-100）
- [ ] 测试迁移后 `level` 等于 `getCurrentLevel(totalExp)`
- [ ] 测试不同经验值的迁移结果
- [ ] 验证所有测试通过

### 3.3 集成测试 - ExperienceBar
- [ ] 创建测试文件 `src/components/ExperienceBar/__tests__/ExperienceBar.integration.test.tsx`
- [ ] 测试 11 经验值显示"练气期"
- [ ] 测试 50000 经验值显示"筑基期"
- [ ] 测试 120000 经验值显示"金丹期"
- [ ] 测试所有境界的显示正确性
- [ ] 验证所有测试通过

### 3.4 集成测试 - RealmHelpTooltip
- [ ] 创建测试文件 `src/components/ExperienceBar/__tests__/RealmHelpTooltip.integration.test.tsx`
- [ ] 测试 11 经验值时"当前"标记在"练气期"
- [ ] 测试 50000 经验值时"当前"标记在"筑基期"
- [ ] 测试 120000 经验值时"当前"标记在"金丹期"
- [ ] 验证所有测试通过

### 3.5 Property-Based 测试 - 境界显示一致性
- [ ] 创建测试文件 `src/components/ExperienceBar/__tests__/ExperienceBar.property.test.tsx`
- [ ] 编写属性：UI 显示的境界应该与 `getCurrentRealm(totalExp)` 一致
- [ ] 使用 fast-check 生成随机经验值（0-1000000）
- [ ] 验证属性在所有随机输入下都成立
- [ ] 运行 1000 次测试，确保属性正确

### 3.6 Property-Based 测试 - 等级计算正确性
- [ ] 创建测试文件 `src/services/experience-adapter/__tests__/ExperienceAdapter.property.test.ts`
- [ ] 编写属性：`record.level` 应该始终等于 `getCurrentLevel(record.totalExp)`
- [ ] 使用 fast-check 生成随机经验值
- [ ] 调用 `addExperience()` 后验证 level 字段正确
- [ ] 运行 1000 次测试，确保属性正确

## 4. 数据修复

### 4.1 添加启动时数据修复逻辑
- [ ] 在 `src/services/experience-adapter/initializeExperienceSystem.ts` 中添加修复逻辑
- [ ] 检查 `experience.level` 是否与 `getCurrentLevel(totalExp)` 一致
- [ ] 如果不一致，重新计算并更新 level 字段
- [ ] 添加日志记录修复操作
- [ ] 测试修复逻辑正确工作

## 5. 验证和测试

### 5.1 手动测试 - 新用户
- [ ] 清除浏览器数据（localStorage 和 IndexedDB）
- [ ] 刷新页面，验证初始状态显示"练气期"
- [ ] 完成一道简单题，验证经验值增加
- [ ] 验证境界显示正确
- [ ] 打开帮助提示框，验证"当前"标记位置正确

### 5.2 手动测试 - 已有数据的用户
- [ ] 使用已有经验值的账户
- [ ] 刷新页面，验证境界显示正确
- [ ] 打开帮助提示框，验证"当前"标记位置正确
- [ ] 完成一道题，验证经验值和境界更新正确

### 5.3 手动测试 - 境界阈值边界
- [ ] 使用开发者工具手动设置经验值为 49999
- [ ] 验证显示"练气期"
- [ ] 设置经验值为 50000
- [ ] 验证显示"筑基期"
- [ ] 测试所有境界阈值的边界情况

### 5.4 回归测试
- [ ] 运行所有现有测试，确保没有破坏其他功能
- [ ] 测试宝箱开启功能正常
- [ ] 测试题目完成功能正常
- [ ] 测试经验条动画正常
- [ ] 测试重置进度功能正常

## 6. 文档更新

### 6.1 代码注释
- [ ] 在 `ExperienceRecord` 接口上添加注释说明 level 字段语义
- [ ] 在 `UIMigrationService` 中添加注释说明迁移逻辑
- [ ] 在 `RealmHelpTooltip` 中添加注释说明境界计算方式
- [ ] 在 `ExperienceBar` 中添加注释说明数据流

### 6.2 更新 README
- [ ] 在项目 README 中添加"经验系统"章节
- [ ] 说明 `level` 字段的语义（1-100 的等级）
- [ ] 说明如何获取当前境界（使用 `getCurrentRealm(totalExp)`）
- [ ] 说明境界索引与等级的区别

## 7. 部署和监控

### 7.1 部署前检查
- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 文档更新完成
- [ ] 手动测试通过

### 7.2 部署
- [ ] 合并代码到主分支
- [ ] 部署到生产环境
- [ ] 验证生产环境显示正确

### 7.3 监控
- [ ] 监控用户反馈
- [ ] 检查错误日志
- [ ] 验证数据修复逻辑正常工作
- [ ] 如有问题，准备回滚

## 任务优先级

**P0 - 必须完成**：
- 1.1 修复 UIMigrationService
- 1.2 修复 RealmHelpTooltip 接口
- 1.3 修复 RealmHelpTooltip 境界计算
- 1.4 修复 ExperienceBar 传参
- 5.1 手动测试 - 新用户
- 5.2 手动测试 - 已有数据的用户

**P1 - 应该完成**：
- 2.1 清理 RealmInfo 接口（ExperienceBar）
- 2.2 清理 RealmInfo 接口（RealmHelpTooltip）
- 3.1 单元测试 - getCurrentRealm 边界情况
- 3.3 集成测试 - ExperienceBar
- 3.4 集成测试 - RealmHelpTooltip
- 4.1 添加启动时数据修复逻辑
- 5.4 回归测试

**P2 - 可以完成**：
- 3.2 单元测试 - UIMigrationService
- 3.5 Property-Based 测试 - 境界显示一致性
- 3.6 Property-Based 测试 - 等级计算正确性
- 5.3 手动测试 - 境界阈值边界
- 6.1 代码注释
- 6.2 更新 README

## 预计工作量

- 核心修复（任务 1）：1-2 小时
- 代码清理（任务 2）：30 分钟
- 测试编写（任务 3）：2-3 小时
- 数据修复（任务 4）：1 小时
- 验证测试（任务 5）：1-2 小时
- 文档更新（任务 6）：30 分钟

**总计**：6-9 小时
