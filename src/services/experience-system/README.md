# Experience Value Rebalance System

This module implements the experience point system for the LeetCode Hot 100 learning platform. It handles calculation, validation, and management of experience allocations across all problems and treasure nodes.

## Directory Structure

```
experience-system/
├── README.md                    # This file
├── types/
│   └── index.ts                # TypeScript type definitions
├── schemas/
│   └── config-schema.json      # JSON schema for configuration validation
├── config/
│   └── (configuration files will be placed here)
├── core/
│   ├── ConfigurationManager.ts # Configuration loading and validation
│   ├── NodeRegistry.ts         # Node storage and retrieval
│   ├── ExperienceCalculator.ts # Experience calculation logic
│   ├── Validator.ts            # Validation logic
│   ├── RealmSystem.ts          # Realm progression logic
│   └── MigrationService.ts     # User data migration
├── utils/
│   └── (utility functions)
└── __tests__/
    ├── unit/                   # Unit tests
    └── property/               # Property-based tests
```

## Key Concepts

### Total Experience Constraint
All experience values across problems and treasures must sum to exactly **1,000,000 EXP**.

### Experience Calculation Formula
```
final_experience = base_experience × importance_multiplier

where:
  base_experience = config.difficultyBaseValues[difficulty]
  importance_multiplier = product of all applicable tag multipliers
```

### Realm System
Users progress through 11 realms (0-10) based on accumulated experience:
- Realm 0: 0 EXP (starting point)
- Realm 10: 1,000,000 EXP (completion)

### Node Types
- **Problem Nodes**: LeetCode problems with difficulty and importance tags
- **Treasure Nodes**: Milestone rewards with tier levels (early/mid/late/final)

## Testing Strategy

This system uses a dual testing approach:

1. **Unit Tests**: Verify specific examples, edge cases, and error conditions
2. **Property-Based Tests**: Verify universal properties across all inputs using fast-check

All property tests are tagged with the format:
```typescript
// Feature: experience-value-rebalance, Property N: [property description]
```

## Configuration

The system is driven by a JSON configuration file that defines:
- Difficulty base values
- Importance multipliers
- Treasure tier values
- Realm thresholds
- System constraints

See `schemas/config-schema.json` for the complete schema definition.

## Implementation Status

### Completed Components

✅ **ConfigurationManager** (Task 2.1)
- Loads and validates configuration from JSON
- Provides access to base values, multipliers, and thresholds
- Supports default value fallback

✅ **NodeRegistry** (Task 3.1)
- Stores and retrieves problem and treasure nodes
- Supports filtering by difficulty, tier, and tags
- Provides node count and existence checks

✅ **ExperienceCalculator** (Task 4.1)
- Calculates problem experience using base × multiplier formula
- Calculates treasure experience via direct lookup
- Normalizes all values to sum to exactly 1,000,000
- Provides detailed calculation explanations

### In Progress

🔄 **Validator** (Task 6)
- Total experience validation
- Difficulty ordering validation
- Treasure tier validation
- Realm threshold validation

### Pending

⏳ **RealmSystem** (Task 7)
⏳ **MigrationService** (Task 8)
⏳ **Configuration File** (Task 10)
⏳ **Validation Script** (Task 11)
⏳ **Integration** (Task 13)

## Requirements Traceability

This implementation satisfies the following requirements:
- 6.2: Configuration Manager stores formula parameters in structured configuration
- 8.1: Configuration Manager loads parameters from JSON configuration file
- 8.2: Configuration Manager supports all required parameter types
- 2.4: Experience Calculator implements the calculation formula
- 3.4: Experience Calculator applies importance multipliers
- 6.1: Experience Calculator computes final experience values
- 6.4: Experience Calculator provides calculation explanations
- 1.4: Experience Calculator normalizes values to sum to 1,000,000
