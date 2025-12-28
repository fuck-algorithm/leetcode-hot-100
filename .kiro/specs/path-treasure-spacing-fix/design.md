# Design Document: Path Treasure Spacing Fix

## Overview

本设计文档描述如何修复 DuolingoPath 组件中宝箱节点的间距计算问题，并将终点"完成"标记改造为可交互的终点宝箱节点。

主要改动：
1. 修正 `getTreasurePosition` 函数的计算逻辑，使宝箱在分段间隙中居中
2. 新增终点宝箱节点，替换静态的"完成"徽章
3. 添加从最后一个题目节点到终点宝箱的 SVG 连接路径
4. 调整容器高度计算以容纳终点宝箱

## Architecture

```
DuolingoPath.tsx
├── getNodePosition(index)        // 计算普通节点位置
├── getTreasurePosition(segmentIndex)  // 计算分段宝箱位置 [修改]
├── getEndpointTreasurePosition() // 计算终点宝箱位置 [新增]
├── generatePathConnections()     // 生成 SVG 连接线 [修改]
├── generateTreasureNodes()       // 生成分段宝箱 [保持]
└── renderEndpointTreasure()      // 渲染终点宝箱 [新增]
```

## Components and Interfaces

### 修改: getTreasurePosition 函数

当前实现问题：
```typescript
// 当前实现 - 宝箱位置计算不对称
const getTreasurePosition = (segmentIndex: number) => {
  const lastNodePos = getNodePosition(lastNodeIndex);
  return {
    yPosition: lastNodePos.yPosition + NODE_SPACING / 2 + 30  // 120px below last node
  };
};
```

修正后的实现：
```typescript
const getTreasurePosition = (segmentIndex: number) => {
  const lastNodeIndex = (segmentIndex + 1) * SEGMENT_SIZE - 1;
  const firstNodeOfNextSegment = (segmentIndex + 1) * SEGMENT_SIZE;
  
  const lastNodePos = getNodePosition(Math.min(lastNodeIndex, problems.length - 1));
  const nextNodePos = getNodePosition(Math.min(firstNodeOfNextSegment, problems.length - 1));
  
  // 宝箱放在两个节点的垂直中点
  return {
    xPercent: 50,
    xPixel: containerWidth / 2,
    yPosition: (lastNodePos.yPosition + nextNodePos.yPosition) / 2
  };
};
```

### 新增: getEndpointTreasurePosition 函数

```typescript
const getEndpointTreasurePosition = useCallback(() => {
  const lastNodePos = getNodePosition(problems.length - 1);
  
  return {
    xPercent: 50,
    xPixel: containerWidth / 2,
    yPosition: lastNodePos.yPosition + NODE_SPACING  // 与普通节点间距一致
  };
}, [getNodePosition, problems.length, containerWidth]);
```

### 新增: 终点宝箱渲染

在 JSX 中替换静态的"完成"徽章：

```tsx
{/* 终点宝箱节点 - 替换原来的静态徽章 */}
<div
  className="path-treasure-wrapper endpoint-treasure"
  style={{
    left: `${endpointPos.xPercent}%`,
    top: endpointPos.yPosition - 40
  }}
>
  <TreasureNode
    treasureId={`endpoint-${pathId}`}
    stageNumber={segmentInfo.segmentCount + 1}  // 使用最后一个宝箱名称之后的
    canOpen={allProblemsCompleted}
    currentLang={currentLang}
    onOpen={handleTreasureOpen}
    isEndpoint={true}  // 新增 prop 标识终点宝箱
  />
</div>
```

### 修改: TreasureNode 组件

添加 `isEndpoint` prop 以支持终点宝箱的特殊显示：

```typescript
interface TreasureNodeProps {
  treasureId: string;
  stageNumber: number;
  canOpen: boolean;
  currentLang: string;
  onOpen?: (treasureId: string, expAwarded: number) => void;
  isEndpoint?: boolean;  // 新增：是否为终点宝箱
}

// 终点宝箱特殊名称
const ENDPOINT_NAME_ZH = '通关宝箱';
const ENDPOINT_NAME_EN = 'Completion Chest';

// 在 getTreasureName 中处理
const getTreasureName = () => {
  if (isEndpoint) {
    return currentLang === 'zh' ? ENDPOINT_NAME_ZH : ENDPOINT_NAME_EN;
  }
  // ... 原有逻辑
};
```

### 修改: generatePathConnections 函数

添加从最后一个节点到终点宝箱的连接线：

```typescript
const generatePathConnections = () => {
  const paths: JSX.Element[] = [];
  
  // ... 现有的节点间连接线逻辑 ...
  
  // 添加：最后一个节点到终点宝箱的连接线
  const lastNodePos = getNodePosition(problems.length - 1);
  const endpointPos = getEndpointTreasurePosition();
  const lastCompleted = isCompleted(problems[problems.length - 1].questionFrontendId);
  
  const midY = (lastNodePos.yPosition + endpointPos.yPosition - 50) / 2;
  paths.push(
    <path
      key="path-to-endpoint"
      d={`M ${lastNodePos.xPixel} ${lastNodePos.yPosition} 
          C ${lastNodePos.xPixel} ${midY}, ${endpointPos.xPixel} ${midY}, ${endpointPos.xPixel} ${endpointPos.yPosition - 50}`}
      stroke={lastCompleted ? '#ffd700' : '#d0d0d0'}
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
    />
  );
  
  return paths;
};
```

### 修改: containerHeight 计算

```typescript
const containerHeight = useMemo(() => {
  const baseHeight = problems.length * NODE_SPACING + 100;
  const segmentGapTotal = (segmentInfo.segmentCount - 1) * SEGMENT_GAP;
  const endpointTreasureSpace = NODE_SPACING + 100;  // 终点宝箱额外空间
  return baseHeight + segmentGapTotal + endpointTreasureSpace;
}, [problems.length, segmentInfo.segmentCount]);
```

## Data Models

无新增数据模型，复用现有的 `TreasureRecord` 结构存储终点宝箱状态。

终点宝箱 ID 格式：`endpoint-{pathId}`

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 分段宝箱垂直居中

*For any* segment index and valid problem list, the treasure node Y position SHALL equal the arithmetic mean of the last node of the current segment and the first node of the next segment.

**Validates: Requirements 1.1, 1.2**

### Property 2: 终点宝箱 ID 唯一性

*For any* path ID, the endpoint treasure ID SHALL follow the format `endpoint-{pathId}` and be unique within the application.

**Validates: Requirements 2.2**

### Property 3: 终点宝箱水平居中

*For any* container width, the endpoint treasure xPercent SHALL equal 50.

**Validates: Requirements 4.1**

### Property 4: 容器高度包含终点宝箱

*For any* problem list, the container height SHALL be greater than or equal to the endpoint treasure Y position plus the treasure node height.

**Validates: Requirements 4.3**

## Error Handling

1. **空题目列表**: 当 `problems.length === 0` 时，不渲染任何宝箱节点
2. **单分段路径**: 当题目数量不足一个完整分段时，仍显示终点宝箱
3. **宝箱开启失败**: 复用 TreasureNode 现有的错误处理逻辑

## Testing Strategy

### Unit Tests
- 测试 `getTreasurePosition` 返回正确的居中位置
- 测试 `getEndpointTreasurePosition` 返回正确的终点位置
- 测试容器高度计算包含终点宝箱空间

### Property Tests
- 使用 fast-check 生成随机的 problems 数组和 pathId
- 验证宝箱位置计算的数学正确性
- 验证终点宝箱 ID 格式一致性

### Integration Tests
- 验证终点宝箱在所有题目完成后可开启
- 验证 SVG 路径正确连接到终点宝箱
- 验证经验值正确增加
