# Requirements Document

## Introduction

This document specifies the requirements for redesigning the experience point system for a LeetCode Hot 100 learning platform with gamification features. The system will rebalance all experience values to sum to exactly 1,000,000 EXP, distribute experience based on problem difficulty and importance, and ensure users progress through 11 realms with a psychologically satisfying growth curve.

## Glossary

- **Experience_System**: The component responsible for calculating and managing experience point allocation
- **Problem_Node**: A LeetCode problem that users can solve to gain experience
- **Treasure_Node**: Special milestone nodes (宝箱节点) that provide bonus experience at key learning path stages
- **Ascension_Node**: Special nodes (飞升节点) that mark realm progression milestones
- **Realm**: A progression tier (境界) that users advance through as they accumulate experience
- **Base_Experience**: The fundamental experience value assigned based on problem difficulty
- **Importance_Bonus**: Additional experience multiplier for high-value problems
- **Difficulty_Level**: Problem classification (Easy, Medium, Hard)
- **Configuration_Manager**: Component that manages experience allocation weights and formulas
- **Validator**: Component that verifies the total experience allocation equals 1,000,000
- **Migration_Service**: Component that handles conversion of existing user experience data

## Requirements

### Requirement 1: Total Experience Constraint

**User Story:** As a system designer, I want the total experience across all nodes to equal exactly 1,000,000 EXP, so that the progression system has a well-defined scope and balanced growth curve.

#### Acceptance Criteria

1. THE Experience_System SHALL allocate experience values such that the sum of all Problem_Node experience plus all Treasure_Node experience equals exactly 1,000,000
2. WHEN the Validator calculates the total experience, THE Validator SHALL return an error if the sum deviates from 1,000,000 by any amount
3. THE Configuration_Manager SHALL enforce the constraint that no individual node can be assigned negative experience values
4. WHEN experience values are recalculated, THE Experience_System SHALL automatically adjust allocations to maintain the 1,000,000 total

### Requirement 2: Difficulty-Based Base Experience

**User Story:** As a learner, I want harder problems to provide more experience, so that my effort is appropriately rewarded.

#### Acceptance Criteria

1. WHEN a Problem_Node has difficulty level Easy, THE Experience_System SHALL assign it a base experience in the range appropriate for easy problems
2. WHEN a Problem_Node has difficulty level Medium, THE Experience_System SHALL assign it a base experience greater than Easy problems
3. WHEN a Problem_Node has difficulty level Hard, THE Experience_System SHALL assign it a base experience greater than Medium problems
4. THE Experience_System SHALL calculate base experience using a configurable formula that takes difficulty as input
5. FOR ALL Problem_Nodes of the same difficulty without importance bonuses, THE Experience_System SHALL assign equal base experience values

### Requirement 3: Importance Bonus System

**User Story:** As a curriculum designer, I want to assign bonus experience to important problems, so that learners focus on high-value content.

#### Acceptance Criteria

1. WHEN a Problem_Node is tagged as a high-frequency interview question, THE Experience_System SHALL apply a configurable importance multiplier to its base experience
2. WHEN a Problem_Node is tagged as a classic algorithm problem, THE Experience_System SHALL apply a configurable importance multiplier to its base experience
3. WHEN a Problem_Node has an animation, THE Experience_System SHALL apply a configurable importance multiplier to its base experience
4. WHEN a Problem_Node has multiple importance tags, THE Experience_System SHALL combine the multipliers according to a defined formula
5. THE Configuration_Manager SHALL store all importance multipliers in a configuration file that can be modified without code changes

### Requirement 4: Treasure Chest Tier System

**User Story:** As a learner, I want milestone rewards at key progression points, so that I feel a sense of achievement throughout my learning journey.

#### Acceptance Criteria

1. WHEN a Treasure_Node is classified as Early stage, THE Experience_System SHALL assign it experience appropriate for early progression milestones
2. WHEN a Treasure_Node is classified as Mid stage, THE Experience_System SHALL assign it experience greater than Early stage treasures
3. WHEN a Treasure_Node is classified as Late stage, THE Experience_System SHALL assign it experience greater than Mid stage treasures
4. WHEN a Treasure_Node is classified as Final stage, THE Experience_System SHALL assign it the highest treasure experience value
5. THE Experience_System SHALL ensure treasure experience values create psychological peaks in the progression curve

### Requirement 5: Realm Progression System

**User Story:** As a learner, I want to progress through 11 distinct realms, so that I have clear long-term goals and a sense of mastery.

#### Acceptance Criteria

1. THE Experience_System SHALL define exactly 11 realm thresholds
2. WHEN a user completes all Problem_Nodes and Treasure_Nodes, THE Experience_System SHALL ensure the user reaches the maximum (11th) realm
3. THE Experience_System SHALL calculate realm thresholds such that progression feels balanced across the learning journey
4. WHEN a user accumulates experience, THE Experience_System SHALL determine their current realm based on cumulative experience thresholds
5. THE Experience_System SHALL ensure each realm requires progressively more experience than the previous realm

### Requirement 6: Experience Calculation Formula

**User Story:** As a developer, I want a clear and maintainable experience calculation formula, so that the system is transparent and easy to modify.

#### Acceptance Criteria

1. THE Experience_System SHALL implement a documented formula that calculates final experience as: base_experience × importance_multiplier
2. THE Configuration_Manager SHALL store all formula parameters (base values, multipliers, thresholds) in a structured configuration file
3. WHEN configuration values are updated, THE Experience_System SHALL recalculate all experience allocations using the new parameters
4. THE Experience_System SHALL provide a function that explains how any specific node's experience was calculated
5. THE Configuration_Manager SHALL validate that configuration files conform to a defined schema before loading

### Requirement 7: Validation Mechanism

**User Story:** As a system administrator, I want automated validation of experience allocations, so that I can ensure system integrity before deployment.

#### Acceptance Criteria

1. THE Validator SHALL calculate the sum of all node experience values and compare it to 1,000,000
2. WHEN the total experience sum does not equal 1,000,000, THE Validator SHALL report the exact deviation and list all node allocations
3. THE Validator SHALL verify that no node has negative or zero experience values
4. THE Validator SHALL verify that all difficulty levels have appropriate relative experience values (Easy < Medium < Hard)
5. THE Validator SHALL verify that all treasure tiers have appropriate relative experience values (Early < Mid < Late < Final)
6. WHEN validation fails, THE Validator SHALL provide actionable error messages indicating which constraints are violated

### Requirement 8: Configuration Management

**User Story:** As a game designer, I want to adjust experience weights through configuration files, so that I can fine-tune the system without modifying code.

#### Acceptance Criteria

1. THE Configuration_Manager SHALL load experience parameters from a JSON or YAML configuration file
2. THE Configuration_Manager SHALL support configuration parameters for: difficulty base values, importance multipliers, treasure tier values, and realm thresholds
3. WHEN a configuration file is invalid or missing required fields, THE Configuration_Manager SHALL return descriptive error messages
4. THE Configuration_Manager SHALL provide default values for all parameters if no configuration file is present
5. THE Configuration_Manager SHALL support hot-reloading of configuration without system restart

### Requirement 9: Psychological Growth Design

**User Story:** As a learner, I want experience gains to feel rewarding and motivating, so that I stay engaged throughout the learning journey.

#### Acceptance Criteria

1. THE Experience_System SHALL ensure that early realms require less experience than later realms to provide quick initial wins
2. THE Experience_System SHALL distribute treasure nodes to create experience peaks at regular intervals
3. THE Experience_System SHALL ensure that no single problem provides more than 5% of total experience to maintain balance
4. THE Experience_System SHALL calculate realm thresholds such that users spend roughly equal time in mid-game realms
5. THE Experience_System SHALL ensure the final realm requires significant effort to create a satisfying endgame challenge

### Requirement 10: Backward Compatibility and Migration

**User Story:** As a system administrator, I want to migrate existing user data to the new experience system, so that current users don't lose their progress.

#### Acceptance Criteria

1. THE Migration_Service SHALL convert existing user experience values to the new system using a proportional scaling formula
2. WHEN a user's old experience is converted, THE Migration_Service SHALL ensure the user's realm remains the same or advances (never regresses)
3. THE Migration_Service SHALL log all migration operations for audit purposes
4. THE Migration_Service SHALL handle edge cases where users have completed nodes that no longer exist
5. WHEN migration is complete, THE Migration_Service SHALL validate that all user experience values are within valid ranges (0 to 1,000,000)
6. THE Migration_Service SHALL provide a rollback mechanism in case migration issues are discovered
