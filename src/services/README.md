# 存储服务架构

## 概述

本项目使用 IndexedDB 作为客户端存储方案，采用统一的数据库管理架构。

## 架构设计

### 1. 数据库服务层 (`dbService.ts`)

**职责**：统一管理 IndexedDB 数据库的初始化和连接

- 单例模式，确保整个应用只有一个数据库连接
- 负责创建和升级数据库结构
- 管理所有 Object Stores 的创建

**数据库信息**：
- 数据库名称：`leetcode-hot-100-progress`
- 当前版本：`5`

**Object Stores**：
- `completions` - 题目完成状态
- `preferences` - 用户偏好设置
- `experience` - 经验值记录
- `treasures` - 宝箱开启记录

### 2. 业务存储服务层

#### `completionStorage.ts` - 题目完成状态管理

**职责**：
- 管理题目的完成/未完成状态
- 保存用户偏好设置（如筛选条件、排序方式等）

**主要方法**：
- `setCompletion(problemId, completed)` - 设置题目完成状态
- `getCompletion(problemId)` - 获取单个题目状态
- `getAllCompletions()` - 获取所有题目状态
- `setPreference(key, value)` - 保存用户偏好
- `getPreference(key, defaultValue)` - 获取用户偏好

#### `experienceStorage.ts` - 经验值和宝箱管理

**职责**：
- 管理用户经验值和等级
- 管理宝箱开启状态和奖励

**主要方法**：
- `getTotalExperience()` - 获取总经验值
- `addExperience(amount)` - 增加经验值
- `removeExperience(amount)` - 减少经验值
- `openTreasure(treasureId)` - 开启宝箱
- `isTreasureOpened(treasureId)` - 检查宝箱状态

## 使用示例

```typescript
// 1. 使用完成状态服务
import { completionStorage } from './services/completionStorage';

// 标记题目为已完成
await completionStorage.setCompletion('1', true);

// 获取所有完成状态
const completions = await completionStorage.getAllCompletions();

// 2. 使用经验值服务
import { experienceStorage, DIFFICULTY_EXP } from './services/experienceStorage';

// 增加经验值
const newExp = await experienceStorage.addExperience(DIFFICULTY_EXP.MEDIUM);

// 开启宝箱
const { treasure, newExp } = await experienceStorage.openTreasure('path-array-stage-1');
```

## 数据迁移

当需要升级数据库结构时：

1. 在 `dbService.ts` 中增加 `DB_VERSION` 版本号
2. 在 `onupgradeneeded` 事件中添加新的 Object Store 或索引
3. 用户刷新页面时会自动触发升级

## 注意事项

1. **单一数据库原则**：所有存储服务共享同一个 IndexedDB 数据库
2. **统一初始化**：所有 Object Stores 必须在 `dbService.ts` 中统一创建
3. **版本同步**：`dbService.ts` 中的版本号是唯一的版本号
4. **错误处理**：所有数据库操作都应该有适当的错误处理

## 故障排查

### 问题：Object Store 不存在

**原因**：浏览器中存在旧版本的数据库

**解决方案**：
1. 打开浏览器开发者工具（F12）
2. 进入 Application/应用程序 标签
3. 找到 IndexedDB
4. 删除 `leetcode-hot-100-progress` 数据库
5. 刷新页面

### 问题：数据库升级失败

**原因**：有其他标签页正在使用旧版本数据库

**解决方案**：
1. 关闭所有使用该应用的标签页
2. 重新打开应用
