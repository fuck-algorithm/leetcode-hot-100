# Bug 修复总结

## 问题描述
题目节点无法标记为已完成

## 根本原因

### 1. IndexedDB 存储层架构混乱
- `completionStorage.ts` 和 `experienceStorage.ts` 各自独立管理同一个数据库
- 两个服务在各自的 `onupgradeneeded` 中只创建自己需要的 Object Stores
- 导致后初始化的服务覆盖前一个的数据库结构，造成 Object Store 缺失
- 错误信息：`NotFoundError: One of the specified object stores was not found`

### 2. 菜单交互体验问题
- 菜单显示/隐藏的延迟时间太短（150ms）
- 鼠标在节点和菜单之间移动时触发快速切换，导致"闪烁"

## 解决方案

### 1. 重构存储层架构

创建统一的数据库管理服务：

#### `src/services/dbService.ts` - 数据库管理中心
```typescript
- 单例模式管理数据库连接
- 统一创建所有 Object Stores
- 统一版本管理（版本 5）
- 提供 getDatabase() 方法供其他服务使用
```

#### 重构 `completionStorage.ts`
```typescript
- 移除独立的数据库初始化逻辑
- 通过 dbService.getDatabase() 获取数据库连接
- 专注于题目完成状态和用户偏好的业务逻辑
```

#### 重构 `experienceStorage.ts`
```typescript
- 移除独立的数据库初始化逻辑
- 通过 dbService.getDatabase() 获取数据库连接
- 专注于经验值和宝箱的业务逻辑
```

### 2. 优化菜单交互

#### 增加延迟时间
```typescript
// 从 150ms 增加到 300ms
hideTimeoutRef.current = setTimeout(() => {
  setExpandedNodeId(null);
}, 300);
```

#### 添加防抖机制
```typescript
// 防止重复点击
const [isTogglingCompletion, setIsTogglingCompletion] = useState(false);

if (isTogglingCompletion) {
  return; // 忽略重复点击
}
```

## 架构优势

✅ **单一职责**：每个服务只负责自己的业务逻辑  
✅ **统一管理**：数据库结构在一个地方定义  
✅ **易于维护**：添加新的 Object Store 只需修改 `dbService.ts`  
✅ **避免冲突**：不会出现 Object Store 缺失的问题  
✅ **更好的用户体验**：菜单交互更流畅

## 数据库结构

**数据库名称**：`leetcode-hot-100-progress`  
**版本**：5

**Object Stores**：
- `completions` - 题目完成状态
- `preferences` - 用户偏好设置
- `experience` - 经验值记录
- `treasures` - 宝箱开启记录

## 测试步骤

1. 清除旧数据库（F12 → Application → IndexedDB → 删除数据库）
2. 刷新页面（Ctrl+Shift+R）
3. 进入学习路径
4. 悬停在题目节点上
5. 点击"标记为已完成"
6. 验证节点状态变化和经验值增加

## 相关文件

- `src/services/dbService.ts` - 新增
- `src/services/completionStorage.ts` - 重构
- `src/services/experienceStorage.ts` - 重构
- `src/services/README.md` - 新增（架构文档）
- `src/components/ProblemList/PathView/DuolingoPath.tsx` - 优化
- `src/components/ProblemList/hooks/useCompletionStatus.ts` - 清理日志

## 注意事项

⚠️ 用户需要清除浏览器中的旧数据库才能使用新版本  
⚠️ 数据库版本号已升级到 5，确保触发 `onupgradeneeded`  
⚠️ 所有 Object Stores 必须在 `dbService.ts` 中统一创建
