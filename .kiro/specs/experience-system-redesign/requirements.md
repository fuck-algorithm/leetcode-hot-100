# Requirements Document

## Introduction

本文档定义了 LeetCode Hot 100 学习平台经验值系统的重构需求。该平台采用修仙主题的游戏化设计，用户通过完成题目和开启宝箱获得经验值，提升修仙境界。当前系统的总经验值仅为 3,070 EXP，数值设计过于简单，缺乏游戏感和成就感。本次重构将总经验值扩展至 1,000,000 EXP，重新设计经验值分配机制，提升用户体验。

## Glossary

- **Experience_System**: 经验值系统，负责计算、存储和管理用户的经验值
- **Problem_Node**: 题目节点，用户可完成的 LeetCode 题目，共 100 道
- **Treasure_Node**: 宝箱节点，分布在学习路径中的奖励节点，约 23 个
- **Realm**: 修仙境界，共 11 个境界，从炼气期到飞升成仙
- **Base_Experience**: 基础经验值，根据题目难度确定的基础数值
- **Importance_Multiplier**: 重要性加成系数，根据题目特性（高频面试题、经典算法、动画演示）计算的加成
- **Total_Experience**: 总经验值，固定为 1,000,000 EXP
- **Experience_Threshold**: 境界阈值，达到某个境界所需的累计经验值

## Requirements

### Requirement 1: 总经验值约束

**User Story:** 作为系统设计者，我需要确保所有节点的经验值总和精确等于 1,000,000 EXP，以便维护系统的数值平衡。

#### Acceptance Criteria

1. THE Experience_System SHALL define Total_Experience as exactly 1,000,000 EXP
2. WHEN all Problem_Node experience values and all Treasure_Node experience values are summed, THE Experience_System SHALL produce a total equal to Total_Experience
3. THE Experience_System SHALL include exactly 100 Problem_Nodes and approximately 23 Treasure_Nodes in the calculation
4. WHEN the experience distribution is modified, THE Experience_System SHALL validate that the sum equals Total_Experience

### Requirement 2: 题目基础经验值分配

**User Story:** 作为用户，我希望不同难度的题目给予不同的基础经验值，以便体现题目难度的差异。

#### Acceptance Criteria

1. WHEN a Problem_Node has difficulty "Easy", THE Experience_System SHALL assign a Base_Experience in the lower range
2. WHEN a Problem_Node has difficulty "Medium", THE Experience_System SHALL assign a Base_Experience in the middle range
3. WHEN a Problem_Node has difficulty "Hard", THE Experience_System SHALL assign a Base_Experience in the higher range
4. THE Experience_System SHALL distribute Base_Experience across 20 Easy problems, 68 Medium problems, and 12 Hard problems
5. WHEN calculating Base_Experience ranges, THE Experience_System SHALL ensure Hard problems receive at least 2x the Base_Experience of Easy problems

### Requirement 3: 题目重要性加成

**User Story:** 作为用户，我希望重要的题目（高频面试题、经典算法题、有动画演示的题目）能获得额外经验值，以便体现这些题目的特殊价值。

#### Acceptance Criteria

1. WHEN a Problem_Node is marked as a high-frequency interview question, THE Experience_System SHALL apply an Importance_Multiplier greater than 1.0
2. WHEN a Problem_Node is marked as a classic algorithm problem, THE Experience_System SHALL apply an Importance_Multiplier greater than 1.0
3. WHEN a Problem_Node has an animation demonstration, THE Experience_System SHALL apply an Importance_Multiplier greater than 1.0
4. WHEN a Problem_Node has multiple importance attributes, THE Experience_System SHALL combine the multipliers appropriately
5. THE Experience_System SHALL calculate final problem experience as Base_Experience multiplied by Importance_Multiplier

### Requirement 4: 宝箱经验值分层

**User Story:** 作为用户，我希望不同阶段的宝箱给予不同的经验值，以便在学习过程中感受到进度和成就感。

#### Acceptance Criteria

1. WHEN a Treasure_Node is in the early learning path stage, THE Experience_System SHALL assign lower experience values
2. WHEN a Treasure_Node is in the middle learning path stage, THE Experience_System SHALL assign medium experience values
3. WHEN a Treasure_Node is in the late learning path stage, THE Experience_System SHALL assign higher experience values
4. WHEN a Treasure_Node is at a path endpoint, THE Experience_System SHALL assign the highest experience values
5. THE Experience_System SHALL ensure treasure experience values create a progressive growth curve

### Requirement 5: 境界系统阈值

**User Story:** 作为用户，我希望通过完成题目逐步提升修仙境界，最终在完成所有 100 题时达到最高境界（飞升成仙 Lv.31）。

#### Acceptance Criteria

1. THE Experience_System SHALL maintain exactly 11 distinct Realms
2. WHEN a user completes all 100 Problem_Nodes, THE Experience_System SHALL ensure the user reaches the maximum Realm (飞升成仙 Lv.31)
3. THE Experience_System SHALL define Experience_Threshold values for each Realm level
4. WHEN a user's accumulated experience reaches an Experience_Threshold, THE Experience_System SHALL advance the user to the next Realm level
5. THE Experience_System SHALL ensure Experience_Threshold values create a progressive growth curve that matches the learning journey

### Requirement 6: 经验值计算公式

**User Story:** 作为开发者，我需要一个明确的经验值计算公式，以便系统能够一致地计算每个节点的经验值。

#### Acceptance Criteria

1. THE Experience_System SHALL define a formula for calculating Problem_Node experience as: Base_Experience × Importance_Multiplier
2. THE Experience_System SHALL provide a configuration mechanism for defining Base_Experience ranges by difficulty
3. THE Experience_System SHALL provide a configuration mechanism for defining Importance_Multiplier values by attribute
4. WHEN a Problem_Node has no importance attributes, THE Experience_System SHALL use an Importance_Multiplier of 1.0
5. THE Experience_System SHALL round all calculated experience values to integers

### Requirement 7: 经验值分配验证

**User Story:** 作为开发者，我需要验证经验值分配的正确性，以便确保系统数值设计符合要求。

#### Acceptance Criteria

1. THE Experience_System SHALL provide a validation function that sums all node experience values
2. WHEN the validation function is executed, THE Experience_System SHALL report whether the sum equals Total_Experience
3. IF the sum does not equal Total_Experience, THEN THE Experience_System SHALL report the difference
4. THE Experience_System SHALL validate that no Problem_Node has zero or negative experience
5. THE Experience_System SHALL validate that no Treasure_Node has zero or negative experience

### Requirement 8: 配置文件管理

**User Story:** 作为开发者，我需要通过配置文件管理题目的重要性权重和经验值参数，以便于维护和调整数值设计。

#### Acceptance Criteria

1. THE Experience_System SHALL load problem importance attributes from a configuration file
2. THE Experience_System SHALL load experience calculation parameters from a configuration file
3. WHEN the configuration file is modified, THE Experience_System SHALL recalculate all experience values
4. THE Experience_System SHALL use TypeScript types to ensure configuration file structure validity
5. THE Experience_System SHALL provide default values when configuration entries are missing

### Requirement 9: 数值设计心理学

**User Story:** 作为用户，我希望经验值的增长有节奏感和成就感，而不是平均分配，以便保持学习动力。

#### Acceptance Criteria

1. THE Experience_System SHALL ensure that important milestone Problem_Nodes provide noticeably higher experience rewards
2. THE Experience_System SHALL ensure that experience growth accelerates in later stages of the learning path
3. THE Experience_System SHALL ensure that Treasure_Nodes provide significant experience boosts compared to average Problem_Nodes
4. THE Experience_System SHALL avoid uniform experience distribution across all nodes
5. WHEN a user completes a high-value node, THE Experience_System SHALL provide experience values that feel rewarding (not too small relative to Total_Experience)

### Requirement 10: 向后兼容性

**User Story:** 作为开发者，我需要确保新的经验值系统能够处理现有用户的进度数据，以便平滑迁移。

#### Acceptance Criteria

1. WHEN the Experience_System loads existing user progress data, THE Experience_System SHALL recalculate experience values using the new formula
2. THE Experience_System SHALL preserve which Problem_Nodes and Treasure_Nodes the user has completed
3. WHEN recalculating user experience, THE Experience_System SHALL update the user's Realm based on new Experience_Threshold values
4. THE Experience_System SHALL provide a migration function that converts old experience values to new values
5. IF a user's Realm decreases after migration, THEN THE Experience_System SHALL maintain the user's previous Realm as a minimum
