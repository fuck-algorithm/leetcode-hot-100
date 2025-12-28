# Implementation Plan: Path Treasure Spacing Fix

## Overview

修复 DuolingoPath 组件中宝箱节点的间距计算问题，并将终点"完成"标记改造为可交互的终点宝箱节点。

## Tasks

- [x] 1. 修改 TreasureNode 组件支持终点宝箱
  - [x] 1.1 添加 `isEndpoint` prop 到 TreasureNodeProps 接口
    - 在 TreasureNode.tsx 中添加可选的 `isEndpoint?: boolean` 属性
    - _Requirements: 2.2, 2.4_
  - [x] 1.2 添加终点宝箱特殊名称常量
    - 添加 `ENDPOINT_NAME_ZH = '通关宝箱'` 和 `ENDPOINT_NAME_EN = 'Completion Chest'`
    - _Requirements: 2.4_
  - [x] 1.3 修改 getTreasureName 函数处理终点宝箱
    - 当 `isEndpoint` 为 true 时返回终点宝箱名称
    - _Requirements: 2.4_

- [x] 2. 修复分段宝箱位置计算
  - [x] 2.1 修改 getTreasurePosition 函数
    - 计算上一分段最后节点和下一分段第一节点的位置
    - 宝箱 Y 位置设为两个节点 Y 位置的算术平均值
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. 添加终点宝箱功能
  - [x] 3.1 添加 getEndpointTreasurePosition 函数
    - 计算终点宝箱位置：水平居中，垂直位于最后节点下方 NODE_SPACING 距离
    - _Requirements: 4.1, 4.2_
  - [x] 3.2 添加 allProblemsCompleted 计算
    - 使用 useMemo 计算所有题目是否都已完成
    - _Requirements: 2.1, 2.5_
  - [x] 3.3 渲染终点宝箱节点
    - 替换原有的静态"完成"徽章为 TreasureNode 组件
    - 传入 `isEndpoint={true}` 和正确的 treasureId
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. 添加终点宝箱连接路径
  - [x] 4.1 修改 generatePathConnections 函数
    - 添加从最后一个题目节点到终点宝箱的 SVG 路径
    - 使用与其他路径相同的贝塞尔曲线样式
    - 根据最后题目完成状态设置路径颜色（金色/灰色）
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5. 修正容器高度计算
  - [x] 5.1 修改 containerHeight useMemo
    - 添加终点宝箱所需的额外空间
    - _Requirements: 4.3_

- [x] 6. Checkpoint - 验证功能
  - 确保所有修改正常工作，手动测试路径显示
  - 验证宝箱间距均匀
  - 验证终点宝箱可正常开启并获取经验值
  - 验证 SVG 路径正确连接

## Notes

- 所有修改集中在 `DuolingoPath.tsx` 和 `TreasureNode.tsx` 两个文件
- 终点宝箱 ID 格式：`endpoint-{pathId}`
- 复用现有的 experienceStorage 服务存储终点宝箱状态
