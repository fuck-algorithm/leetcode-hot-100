# 境界显示 Bug 修复 - 验证指南

## 快速验证步骤

### 方法 1：使用浏览器开发者工具

1. **打开应用**
   - 访问 http://localhost:40140/leetcode-hot-100

2. **打开浏览器开发者工具**
   - 按 F12 或右键 → 检查

3. **清除现有数据**
   ```javascript
   // 在 Console 中执行
   localStorage.clear();
   indexedDB.deleteDatabase('leetcode-hot-100-db');
   location.reload();
   ```

4. **验证初始状态**
   - 刷新页面后，应该看到"练气期"
   - 经验值应该是 0
   - 帮助提示框中"当前"标记应该在"练气期"

5. **测试经验值增加**
   ```javascript
   // 在 Console 中执行，模拟完成一道简单题
   const event = new CustomEvent('expChange', {
     detail: { amount: 5000, newExp: { totalExp: 5000, level: 1 } }
   });
   window.dispatchEvent(event);
   ```
   - 应该仍然显示"练气期"（因为 5000 < 50000）

6. **测试境界晋升**
   ```javascript
   // 在 Console 中执行，设置经验值为 50000
   const event = new CustomEvent('expChange', {
     detail: { amount: 45000, newExp: { totalExp: 50000, level: 2 } }
   });
   window.dispatchEvent(event);
   ```
   - 应该显示"筑基期"
   - 帮助提示框中"当前"标记应该在"筑基期"

### 方法 2：使用测试脚本

1. **运行测试脚本**
   ```bash
   npx ts-node scripts/test-realm-fix.ts
   ```

2. **验证输出**
   - 所有测试应该通过（10/10）
   - 应该看到 "✨ All tests passed! Realm display bug is fixed."

### 方法 3：手动测试

1. **清除浏览器数据**
   - 打开浏览器设置
   - 清除站点数据（localStorage 和 IndexedDB）
   - 或者使用隐私模式

2. **访问应用**
   - 打开 http://localhost:40140/leetcode-hot-100

3. **验证初始状态**
   - 应该显示"练气期"
   - 经验值为 0

4. **完成题目**
   - 点击任意题目的复选框
   - 观察经验值增加
   - 验证境界显示正确

5. **打开帮助提示框**
   - 点击境界旁边的 "?" 图标
   - 验证"当前"标记在正确的境界上

## 预期结果

### 经验值 → 境界对应关系

| 经验值范围 | 境界 | Realm 索引 |
|-----------|------|-----------|
| 0 - 49,999 | 练气期 | 0 |
| 50,000 - 119,999 | 筑基期 | 1 |
| 120,000 - 209,999 | 金丹期 | 2 |
| 210,000 - 319,999 | 元婴期 | 3 |
| 320,000 - 449,999 | 化神期 | 4 |
| 450,000 - 599,999 | 炼虚期 | 5 |
| 600,000 - 769,999 | 合体期 | 6 |
| 770,000 - 899,999 | 大乘期 | 7 |
| 900,000 - 949,999 | 渡劫期 | 8 |
| 950,000 - 999,999 | 大罗金仙 | 9 |
| 1,000,000+ | 飞升仙界 | 10 |

### 关键验证点

✅ **初始状态**
- 新用户应该显示"练气期"
- 经验值为 0

✅ **境界显示**
- 主界面显示的境界与经验值对应
- 帮助提示框中"当前"标记位置正确

✅ **境界晋升**
- 经验值达到阈值时，境界正确晋升
- 进度条正确显示到下一境界的进度

✅ **数据修复**
- 已有错误数据的用户，刷新后自动修复
- Console 中应该看到修复日志

## 常见问题

### Q: 刷新后境界显示还是错误的？
A: 检查 Console 是否有错误日志。可能需要手动清除浏览器数据。

### Q: 帮助提示框中"当前"标记位置不对？
A: 确保已经刷新页面，让数据修复逻辑运行。

### Q: 测试脚本失败？
A: 检查是否有 TypeScript 编译错误。确保所有依赖已安装。

## 调试技巧

### 查看当前经验值和境界
```javascript
// 在 Console 中执行
const exp = await experienceAdapter.getTotalExperience();
console.log('Total Exp:', exp.totalExp);
console.log('Level:', exp.level);
console.log('Realm Index:', experienceAdapter.getCurrentRealm(exp.totalExp));
```

### 手动设置经验值
```javascript
// 在 Console 中执行
// 注意：这会修改数据库
await experienceAdapter.addExperience(50000 - exp.totalExp);
location.reload();
```

### 查看数据修复日志
打开 Console，刷新页面，查找以下日志：
```
[ExperienceSystem] Initializing...
[ExperienceSystem] No migration needed
[ExperienceSystem] Fixing incorrect level value: 0 -> 1
[ExperienceSystem] Level value fixed
[ExperienceSystem] Initialization complete
```

## 回归测试清单

- [ ] 新用户初始状态正确
- [ ] 完成题目后经验值增加
- [ ] 境界显示与经验值对应
- [ ] 帮助提示框"当前"标记正确
- [ ] 宝箱开启功能正常
- [ ] 重置进度功能正常
- [ ] 经验条动画正常
- [ ] 多语言切换正常

## 性能检查

- [ ] 页面加载速度正常
- [ ] 数据修复逻辑不影响启动速度
- [ ] 境界计算不影响 UI 响应速度

## 浏览器兼容性

测试以下浏览器：
- [ ] Chrome/Edge (最新版本)
- [ ] Firefox (最新版本)
- [ ] Safari (最新版本)

## 完成标准

当以下所有项都通过时，验证完成：
- ✅ 测试脚本全部通过
- ✅ 手动测试所有场景通过
- ✅ 回归测试清单全部通过
- ✅ 无 Console 错误
- ✅ 无编译警告
