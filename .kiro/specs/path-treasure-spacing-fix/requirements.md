# Requirements Document

## Introduction

修复 DuolingoPath 组件中宝箱节点的间距计算问题，并将终点"完成"标记改造为可交互的终点宝箱节点，使其能够获取经验值并有路径连接。

## Glossary

- **DuolingoPath**: 多邻国风格的学习路径组件，展示题目节点和宝箱节点
- **TreasureNode**: 宝箱节点组件，用户完成一定数量题目后可开启获取经验值
- **Segment**: 分段，每5道题目为一个分段，分段之间有宝箱节点
- **EndpointTreasure**: 终点宝箱，路径最后的特殊宝箱节点，完成所有题目后可开启
- **NODE_SPACING**: 普通节点之间的基础间距（180px）
- **SEGMENT_GAP**: 分段之间的额外间距（220px）

## Requirements

### Requirement 1: 修复分段宝箱节点间距

**User Story:** As a user, I want the treasure nodes to be evenly spaced between problem nodes, so that the path layout looks visually balanced.

#### Acceptance Criteria

1. WHEN a treasure node is placed between segments, THE DuolingoPath SHALL position it at the vertical center between the last node of the previous segment and the first node of the next segment
2. WHEN calculating treasure node position, THE DuolingoPath SHALL ensure equal spacing above and below the treasure node
3. THE DuolingoPath SHALL maintain consistent visual spacing regardless of the number of segments

### Requirement 2: 终点宝箱节点

**User Story:** As a user, I want the completion marker to be an interactive treasure node, so that I can earn experience points for completing all problems in a path.

#### Acceptance Criteria

1. WHEN all problems in a path are completed, THE System SHALL display an endpoint treasure node instead of a static "完成" badge
2. THE EndpointTreasure SHALL be a TreasureNode component with a unique treasure ID based on the path ID
3. WHEN the endpoint treasure is opened, THE System SHALL award experience points to the user
4. THE EndpointTreasure SHALL display a special name indicating completion (e.g., "通关宝箱" / "Completion Chest")
5. WHEN the endpoint treasure is locked, THE System SHALL display it in a locked state similar to other treasure nodes

### Requirement 3: 终点宝箱路径连接

**User Story:** As a user, I want to see a path connecting the last problem node to the endpoint treasure, so that the visual flow is complete.

#### Acceptance Criteria

1. THE DuolingoPath SHALL render an SVG path from the last problem node to the endpoint treasure node
2. WHEN the last problem is completed, THE connecting path SHALL be displayed in gold color
3. WHEN the last problem is not completed, THE connecting path SHALL be displayed in gray color
4. THE connecting path SHALL use the same curved Bezier style as other path connections

### Requirement 4: 终点宝箱位置计算

**User Story:** As a user, I want the endpoint treasure to be properly positioned below the last problem node, so that the layout is consistent.

#### Acceptance Criteria

1. THE EndpointTreasure SHALL be positioned at the horizontal center of the container
2. THE EndpointTreasure SHALL be positioned with appropriate vertical spacing below the last problem node
3. THE container height calculation SHALL account for the endpoint treasure node height
