# Design Document: Experience Value Rebalance

## Overview

This design document specifies the architecture and implementation approach for rebalancing the experience point system in a LeetCode Hot 100 learning platform. The system will redistribute experience values across all nodes (problems and treasures) to sum to exactly 1,000,000 EXP, with allocations based on difficulty, importance, and psychological progression principles.

The design follows a configuration-driven approach where all experience parameters are externalized to JSON configuration files, enabling game designers to fine-tune values without code changes. A validation system ensures mathematical correctness, and a migration service handles conversion of existing user data.

## Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Experience System                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  Configuration   │      │   Experience     │            │
│  │    Manager       │─────▶│   Calculator     │            │
│  └──────────────────┘      └──────────────────┘            │
│           │                         │                        │
│           │                         ▼                        │
│           │                ┌──────────────────┐            │
│           │                │    Validator     │            │
│           │                └──────────────────┘            │
│           │                         │                        │
│           ▼                         ▼                        │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  Node Registry   │      │  Realm System    │            │
│  └──────────────────┘      └──────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Migration Service│
                    └──────────────────┘
```

### Component Responsibilities

1. **Configuration Manager**: Loads and validates experience configuration from JSON files
2. **Experience Calculator**: Computes final experience values using base values and multipliers
3. **Node Registry**: Maintains the catalog of all problem and treasure nodes with their metadata
4. **Validator**: Ensures all experience allocations meet system constraints
5. **Realm System**: Calculates realm thresholds and determines user progression
6. **Migration Service**: Converts existing user experience data to the new system

## Components and Interfaces

### Configuration Manager

**Purpose**: Load, validate, and provide access to experience configuration parameters.

**Configuration Schema**:
```json
{
  "totalExperience": 1000000,
  "difficultyBaseValues": {
    "easy": 5000,
    "medium": 8000,
    "hard": 12000
  },
  "importanceMultipliers": {
    "highFrequencyInterview": 1.3,
    "classicAlgorithm": 1.2,
    "hasAnimation": 1.15
  },
  "treasureTierValues": {
    "early": 15000,
    "mid": 25000,
    "late": 35000,
    "final": 50000
  },
  "realmThresholds": [
    0,
    50000,
    120000,
    220000,
    350000,
    500000,
    650000,
    780000,
    880000,
    950000,
    1000000
  ],
  "constraints": {
    "maxSingleNodePercentage": 0.05,
    "minNodeExperience": 1
  }
}
```

**Interface**:
```typescript
interface ConfigurationManager {
  loadConfig(filePath: string): Config
  validateConfig(config: Config): ValidationResult
  getBaseExperience(difficulty: Difficulty): number
  getImportanceMultiplier(tags: string[]): number
  getTreasureExperience(tier: TreasureTier): number
  getRealmThresholds(): number[]
}
```

### Experience Calculator

**Purpose**: Calculate final experience values for all nodes based on configuration.

**Calculation Formula**:
```
final_experience = base_experience × importance_multiplier

where:
  base_experience = config.difficultyBaseValues[difficulty]
  importance_multiplier = product of all applicable multipliers from config.importanceMultipliers
```

**Interface**:
```typescript
interface ExperienceCalculator {
  calculateProblemExperience(
    difficulty: Difficulty,
    tags: string[]
  ): number
  
  calculateTreasureExperience(tier: TreasureTier): number
  
  calculateAllExperience(nodes: Node[]): Map<NodeId, number>
  
  explainCalculation(nodeId: NodeId): CalculationExplanation
}
```

**Algorithm**:
1. For each problem node:
   - Retrieve base experience from configuration based on difficulty
   - Calculate importance multiplier by multiplying all applicable tag multipliers
   - Compute final experience = base × multiplier
   - Round to nearest integer

2. For each treasure node:
   - Retrieve experience directly from configuration based on tier

3. Normalize all values:
   - Calculate total sum of all node experience
   - If sum ≠ 1,000,000, apply proportional scaling: `adjusted = original × (1000000 / sum)`
   - Round adjusted values and handle rounding errors by adjusting the largest node

### Node Registry

**Purpose**: Maintain the catalog of all nodes with their metadata.

**Data Model**:
```typescript
interface ProblemNode {
  id: string
  type: 'problem'
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]  // e.g., ['highFrequencyInterview', 'hasAnimation']
  title: string
}

interface TreasureNode {
  id: string
  type: 'treasure'
  tier: 'early' | 'mid' | 'late' | 'final'
  position: number  // Position in learning path
}

type Node = ProblemNode | TreasureNode
```

**Interface**:
```typescript
interface NodeRegistry {
  getAllNodes(): Node[]
  getNode(id: string): Node | null
  getProblemNodes(): ProblemNode[]
  getTreasureNodes(): TreasureNode[]
  getNodesByDifficulty(difficulty: Difficulty): ProblemNode[]
}
```

### Validator

**Purpose**: Verify that experience allocations meet all system constraints.

**Validation Checks**:
1. Total experience sum equals exactly 1,000,000
2. All nodes have positive experience values
3. Difficulty ordering: Easy < Medium < Hard (on average)
4. Treasure tier ordering: Early < Mid < Late < Final
5. No single node exceeds maximum percentage of total
6. Realm thresholds are strictly increasing
7. Maximum realm threshold equals total experience

**Interface**:
```typescript
interface Validator {
  validateTotalExperience(
    allocations: Map<NodeId, number>
  ): ValidationResult
  
  validateDifficultyOrdering(
    allocations: Map<NodeId, number>,
    nodes: Node[]
  ): ValidationResult
  
  validateTreasureTiers(
    allocations: Map<NodeId, number>,
    nodes: Node[]
  ): ValidationResult
  
  validateRealmThresholds(
    thresholds: number[],
    totalExperience: number
  ): ValidationResult
  
  validateAll(
    allocations: Map<NodeId, number>,
    nodes: Node[],
    config: Config
  ): ValidationResult
}

interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}
```

### Realm System

**Purpose**: Calculate realm thresholds and determine user progression.

**Realm Calculation Strategy**:
- 11 realms total (indexed 0-10)
- Realm 0: 0 EXP (starting point)
- Realms 1-3: Quick early progression (smaller gaps)
- Realms 4-8: Steady mid-game progression (larger gaps)
- Realms 9-10: Endgame challenge (largest gaps)
- Realm 10: 1,000,000 EXP (completion)

**Threshold Distribution**:
```
Realm 0:  0 EXP       (0%)
Realm 1:  50,000 EXP  (5%)
Realm 2:  120,000 EXP (12%)
Realm 3:  220,000 EXP (22%)
Realm 4:  350,000 EXP (35%)
Realm 5:  500,000 EXP (50%)
Realm 6:  650,000 EXP (65%)
Realm 7:  780,000 EXP (78%)
Realm 8:  880,000 EXP (88%)
Realm 9:  950,000 EXP (95%)
Realm 10: 1,000,000 EXP (100%)
```

**Interface**:
```typescript
interface RealmSystem {
  getRealmThresholds(): number[]
  getCurrentRealm(experience: number): number
  getExperienceToNextRealm(experience: number): number
  getRealmProgress(experience: number): number  // 0.0 to 1.0
}
```

### Migration Service

**Purpose**: Convert existing user experience data to the new system.

**Migration Strategy**:
1. **Proportional Scaling**: Scale old experience proportionally to new system
   ```
   new_experience = (old_experience / old_max_experience) × 1,000,000
   ```

2. **Realm Preservation**: Ensure users don't regress in realm
   - Calculate old realm based on old thresholds
   - Calculate new realm based on scaled experience
   - If new realm < old realm, adjust to old realm threshold

3. **Audit Logging**: Log all migrations for verification

**Interface**:
```typescript
interface MigrationService {
  migrateUserExperience(
    userId: string,
    oldExperience: number,
    oldMaxExperience: number
  ): MigrationResult
  
  migrateAllUsers(
    users: User[],
    oldMaxExperience: number
  ): MigrationSummary
  
  rollbackMigration(migrationId: string): RollbackResult
  
  validateMigration(
    migrationId: string
  ): ValidationResult
}

interface MigrationResult {
  userId: string
  oldExperience: number
  newExperience: number
  oldRealm: number
  newRealm: number
  adjusted: boolean  // true if realm preservation adjustment was applied
}
```

## Data Models

### Experience Allocation

```typescript
interface ExperienceAllocation {
  nodeId: string
  nodeType: 'problem' | 'treasure'
  baseExperience: number
  importanceMultiplier: number
  finalExperience: number
  calculationSteps: string[]  // For explanation
}
```

### User Progress

```typescript
interface UserProgress {
  userId: string
  totalExperience: number
  currentRealm: number
  completedNodes: string[]
  experienceByNode: Map<string, number>
  lastUpdated: Date
}
```

### Validation Error

```typescript
interface ValidationError {
  code: string
  message: string
  severity: 'error' | 'warning'
  details: Record<string, any>
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Total Experience Conservation

*For any* valid configuration and node set, the sum of all allocated experience values (problems + treasures) should equal exactly 1,000,000.

**Validates: Requirements 1.1, 7.1**

### Property 2: Experience Normalization Invariant

*For any* set of raw calculated experience values, after normalization the sum should equal exactly 1,000,000 regardless of the initial sum.

**Validates: Requirements 1.4**

### Property 3: Non-Negative Experience Values

*For any* node in the system, the allocated experience value should be strictly positive (greater than zero).

**Validates: Requirements 1.3, 7.3**

### Property 4: Difficulty Ordering

*For any* two problems with the same importance tags, if one has higher difficulty than the other, it should have higher or equal base experience (Easy ≤ Medium ≤ Hard).

**Validates: Requirements 2.2, 2.3, 7.4**

### Property 5: Difficulty Consistency

*For any* two problems with the same difficulty level and no importance bonuses, they should have equal base experience values.

**Validates: Requirements 2.5**

### Property 6: Importance Multiplier Application

*For any* problem with importance tags, the final experience should equal base experience multiplied by the product of all applicable importance multipliers from the configuration.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 6.1**

### Property 7: Treasure Tier Ordering

*For any* two treasure nodes, if one has a higher tier than the other, it should have strictly greater experience (Early < Mid < Late < Final).

**Validates: Requirements 4.2, 4.3, 4.4, 7.5**

### Property 8: Treasure Tier Consistency

*For any* two treasure nodes of the same tier, they should have equal experience values.

**Validates: Requirements 4.1**

### Property 9: Realm Threshold Monotonicity

*For any* two consecutive realm thresholds in the array, the later threshold should be strictly greater than the earlier one.

**Validates: Requirements 5.5, 9.1**

### Property 10: Realm Lookup Correctness

*For any* experience value E and realm thresholds array, the calculated realm should be the largest index i where thresholds[i] ≤ E.

**Validates: Requirements 5.4**

### Property 11: Maximum Experience Percentage Constraint

*For any* node in the system, its allocated experience should not exceed 5% of the total experience (50,000 EXP).

**Validates: Requirements 9.3**

### Property 12: Configuration Change Propagation

*For any* two different valid configurations, calculating experience with each should produce different allocations (unless configurations are functionally equivalent).

**Validates: Requirements 6.3**

### Property 13: Calculation Explanation Completeness

*For any* node in the system, the explanation function should return a non-empty explanation containing at least the base experience and final experience values.

**Validates: Requirements 6.4**

### Property 14: Configuration Schema Validation

*For any* configuration object missing required fields or containing invalid values, the validator should reject it and return descriptive error messages.

**Validates: Requirements 6.5, 8.3**

### Property 15: Validation Error Reporting

*For any* invalid experience allocation, the validator should report specific errors indicating which constraints are violated and by how much.

**Validates: Requirements 1.2, 7.2, 7.6**

### Property 16: Migration Proportional Scaling

*For any* user with old experience value E_old and old maximum M_old, the migrated experience should equal (E_old / M_old) × 1,000,000, rounded appropriately.

**Validates: Requirements 10.1**

### Property 17: Migration Realm Preservation

*For any* user being migrated, their new realm should be greater than or equal to their old realm (no regression).

**Validates: Requirements 10.2**

### Property 18: Migration Range Validation

*For any* migrated user, their new experience value should be within the valid range [0, 1,000,000].

**Validates: Requirements 10.5**

### Property 19: Migration Orphaned Node Handling

*For any* user with references to non-existent nodes, the migration should complete without errors and exclude the orphaned node experience.

**Validates: Requirements 10.4**

## Error Handling

### Configuration Errors

1. **Missing Configuration File**: Use default values and log warning
2. **Invalid JSON/YAML**: Return parse error with line number
3. **Missing Required Fields**: Return validation error listing missing fields
4. **Invalid Value Types**: Return type error with expected vs actual types
5. **Invalid Value Ranges**: Return range error (e.g., negative multipliers)

### Validation Errors

1. **Total Sum Mismatch**: Report exact deviation and suggest normalization
2. **Negative Experience**: List all nodes with invalid values
3. **Ordering Violations**: Report which difficulty/tier pairs violate ordering
4. **Percentage Violations**: List nodes exceeding maximum percentage
5. **Realm Threshold Errors**: Report which thresholds violate monotonicity

### Migration Errors

1. **Invalid Old Experience**: Clamp to valid range and log warning
2. **Missing User Data**: Skip user and log error
3. **Realm Calculation Failure**: Use experience-based realm and log warning
4. **Database Errors**: Rollback transaction and return error

### Runtime Errors

1. **Node Not Found**: Return null and log warning
2. **Invalid Difficulty**: Throw error with valid options
3. **Invalid Tier**: Throw error with valid options
4. **Calculation Overflow**: Use safe math operations and clamp results

## Testing Strategy

### Dual Testing Approach

This system requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

We will use **fast-check** (for TypeScript/JavaScript) as the property-based testing library. Each property test will:

- Run a minimum of 100 iterations with randomized inputs
- Be tagged with a comment referencing the design property
- Tag format: `// Feature: experience-value-rebalance, Property N: [property text]`

**Example Property Test Structure**:
```typescript
// Feature: experience-value-rebalance, Property 1: Total Experience Conservation
test('total experience equals 1,000,000', () => {
  fc.assert(
    fc.property(
      nodeSetArbitrary(),
      configArbitrary(),
      (nodes, config) => {
        const allocations = calculator.calculateAllExperience(nodes, config);
        const total = Array.from(allocations.values()).reduce((a, b) => a + b, 0);
        expect(total).toBe(1_000_000);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Focus Areas

1. **Configuration Loading**:
   - Valid configuration files load correctly
   - Default values are used when no config present
   - Invalid configs produce appropriate errors

2. **Experience Calculation**:
   - Specific difficulty values produce expected base experience
   - Specific tag combinations produce expected multipliers
   - Edge cases: zero tags, all tags, unknown tags

3. **Validation**:
   - Specific invalid allocations are caught
   - Error messages contain expected information
   - Valid allocations pass all checks

4. **Realm System**:
   - Boundary experience values return correct realms
   - Progress calculations are accurate
   - Edge cases: 0 EXP, max EXP, threshold boundaries

5. **Migration**:
   - Specific old values convert to expected new values
   - Realm preservation works for boundary cases
   - Orphaned nodes are handled correctly

### Integration Testing

1. **End-to-End Calculation**:
   - Load real configuration
   - Calculate experience for real node set
   - Validate results meet all constraints
   - Verify total equals 1,000,000

2. **Migration Workflow**:
   - Create test users with old experience
   - Run migration
   - Verify all users have valid new experience
   - Verify no realm regressions
   - Test rollback functionality

3. **Configuration Hot-Reload**:
   - Start system with config A
   - Update to config B
   - Verify calculations use new values
   - Verify validation still passes

### Test Data Generation

For property-based tests, we need arbitraries (generators) for:

1. **Node Sets**: Random collections of problems and treasures
2. **Configurations**: Valid config objects with random but constrained values
3. **User Data**: Random user experience values and completion states
4. **Invalid Inputs**: Intentionally malformed data for error testing

### Coverage Goals

- **Line Coverage**: Minimum 90%
- **Branch Coverage**: Minimum 85%
- **Property Coverage**: 100% (all 19 properties must have tests)
- **Requirement Coverage**: 100% (all testable acceptance criteria covered)

