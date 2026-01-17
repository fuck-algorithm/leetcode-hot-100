# Implementation Plan: Experience Value Rebalance

## Overview

This implementation plan breaks down the experience value rebalance system into discrete coding tasks. The approach follows a bottom-up strategy: first implementing core data structures and configuration management, then building the calculation and validation logic, followed by the realm system and migration service, and finally integration and testing.

## Tasks

- [x] 1. Set up project structure and configuration schema
  - Create directory structure for the experience system module
  - Define TypeScript interfaces for Config, Node types, and ValidationResult
  - Create JSON schema for configuration validation
  - Set up testing framework (Jest + fast-check for property-based testing)
  - _Requirements: 6.2, 8.1, 8.2_


- [ ] 2. Implement Configuration Manager
  - [x] 2.1 Create ConfigurationManager class with loadConfig and validateConfig methods
    - Implement JSON/YAML file loading
    - Implement schema validation using JSON schema validator
    - Implement default value fallback logic
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 2.2 Write property test for configuration validation
    - **Property 14: Configuration Schema Validation**
    - **Validates: Requirements 6.5, 8.3**
  
  - [ ]* 2.3 Write unit tests for ConfigurationManager
    - Test loading valid configuration files
    - Test error handling for missing/invalid files
    - Test default value fallback
    - _Requirements: 8.1, 8.3, 8.4_

- [ ] 3. Implement Node Registry
  - [x] 3.1 Create NodeRegistry class with node storage and retrieval methods
    - Implement getAllNodes, getNode, getProblemNodes, getTreasureNodes methods
    - Support filtering by difficulty and tier
    - Load node data from JSON file or database
    - _Requirements: 2.1, 4.1_
  
  - [x]* 3.2 Write unit tests for NodeRegistry
    - Test node retrieval and filtering
    - Test edge cases (empty registry, non-existent nodes)
    - _Requirements: 2.1, 4.1_

- [ ] 4. Implement Experience Calculator
  - [x] 4.1 Create ExperienceCalculator class with calculation methods
    - Implement calculateProblemExperience (base × multiplier formula)
    - Implement calculateTreasureExperience (direct lookup)
    - Implement calculateAllExperience with normalization
    - Implement explainCalculation for debugging
    - _Requirements: 2.4, 3.4, 6.1, 6.4_
  
  - [ ]* 4.2 Write property test for experience calculation formula
    - **Property 6: Importance Multiplier Application**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 6.1**
  
  - [ ]* 4.3 Write property test for normalization
    - **Property 2: Experience Normalization Invariant**
    - **Validates: Requirements 1.4**
  
  - [ ]* 4.4 Write property test for difficulty consistency
    - **Property 5: Difficulty Consistency**
    - **Validates: Requirements 2.5**
  
  - [ ]* 4.5 Write unit tests for ExperienceCalculator
    - Test specific difficulty and tag combinations
    - Test normalization with known inputs
    - Test explanation output format
    - _Requirements: 2.4, 3.4, 6.1, 6.4_

- [-] 5. Checkpoint - Ensure calculation logic works correctly
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 6. Implement Validator
  - [x] 6.1 Create Validator class with validation methods
    - Implement validateTotalExperience (sum check)
    - Implement validateDifficultyOrdering (average comparison)
    - Implement validateTreasureTiers (tier ordering)
    - Implement validateRealmThresholds (monotonicity check)
    - Implement validateAll (comprehensive validation)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 6.2 Write property test for total experience conservation
    - **Property 1: Total Experience Conservation**
    - **Validates: Requirements 1.1, 7.1**
  
  - [ ]* 6.3 Write property test for non-negative values
    - **Property 3: Non-Negative Experience Values**
    - **Validates: Requirements 1.3, 7.3**
  
  - [ ]* 6.4 Write property test for difficulty ordering
    - **Property 4: Difficulty Ordering**
    - **Validates: Requirements 2.2, 2.3, 7.4**
  
  - [ ]* 6.5 Write property test for treasure tier ordering
    - **Property 7: Treasure Tier Ordering**
    - **Validates: Requirements 4.2, 4.3, 4.4, 7.5**
  
  - [ ]* 6.6 Write property test for validation error reporting
    - **Property 15: Validation Error Reporting**
    - **Validates: Requirements 1.2, 7.2, 7.6**
  
  - [ ]* 6.7 Write unit tests for Validator
    - Test specific validation scenarios
    - Test error message content
    - Test edge cases (empty allocations, single node)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 7. Implement Realm System
  - [x] 7.1 Create RealmSystem class with realm calculation methods
    - Implement getRealmThresholds (return configured thresholds)
    - Implement getCurrentRealm (binary search for realm)
    - Implement getExperienceToNextRealm
    - Implement getRealmProgress (percentage calculation)
    - _Requirements: 5.1, 5.2, 5.4, 5.5_
  
  - [ ]* 7.2 Write property test for realm threshold monotonicity
    - **Property 9: Realm Threshold Monotonicity**
    - **Validates: Requirements 5.5, 9.1**
  
  - [ ]* 7.3 Write property test for realm lookup correctness
    - **Property 10: Realm Lookup Correctness**
    - **Validates: Requirements 5.4**
  
  - [ ]* 7.4 Write unit tests for RealmSystem
    - Test boundary experience values (0, thresholds, max)
    - Test progress calculations
    - Test edge cases
    - _Requirements: 5.1, 5.2, 5.4, 5.5_


- [ ] 8. Implement Migration Service
  - [ ] 8.1 Create MigrationService class with migration methods
    - Implement migrateUserExperience (proportional scaling)
    - Implement realm preservation logic
    - Implement migrateAllUsers (batch processing)
    - Implement validateMigration
    - Implement rollbackMigration (store old values)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 8.2 Write property test for migration proportional scaling
    - **Property 16: Migration Proportional Scaling**
    - **Validates: Requirements 10.1**
  
  - [ ]* 8.3 Write property test for migration realm preservation
    - **Property 17: Migration Realm Preservation**
    - **Validates: Requirements 10.2**
  
  - [ ]* 8.4 Write property test for migration range validation
    - **Property 18: Migration Range Validation**
    - **Validates: Requirements 10.5**
  
  - [ ]* 8.5 Write property test for orphaned node handling
    - **Property 19: Migration Orphaned Node Handling**
    - **Validates: Requirements 10.4**
  
  - [ ]* 8.6 Write unit tests for MigrationService
    - Test specific migration scenarios
    - Test rollback functionality
    - Test edge cases (zero experience, max experience)
    - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.6_

- [ ] 9. Checkpoint - Ensure all core components work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Create default configuration file
  - [ ] 10.1 Create config/experience-config.json with balanced values
    - Set totalExperience to 1,000,000
    - Define difficulty base values (Easy: 5000, Medium: 8000, Hard: 12000)
    - Define importance multipliers (interview: 1.3, classic: 1.2, animation: 1.15)
    - Define treasure tier values (early: 15000, mid: 25000, late: 35000, final: 50000)
    - Define 11 realm thresholds with psychological progression curve
    - _Requirements: 1.1, 2.1, 3.5, 4.1, 5.1, 8.2_
  
  - [ ] 10.2 Run validation script to verify configuration
    - Calculate total experience from configuration
    - Verify it sums to exactly 1,000,000
    - Adjust values if needed to meet constraint
    - _Requirements: 1.1, 1.2, 7.1_


- [ ] 11. Create validation script
  - [ ] 11.1 Create scripts/validate-experience.ts
    - Load configuration and node data
    - Calculate all experience allocations
    - Run all validation checks
    - Output detailed report (total, per-node, violations)
    - Exit with error code if validation fails
    - _Requirements: 1.1, 1.2, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 11.2 Write property test for maximum percentage constraint
    - **Property 11: Maximum Experience Percentage Constraint**
    - **Validates: Requirements 9.3**
  
  - [ ]* 11.3 Write unit tests for validation script
    - Test with valid configuration
    - Test with invalid configurations
    - Test output format
    - _Requirements: 7.1, 7.2, 7.6_

- [ ] 12. Implement additional property tests
  - [ ]* 12.1 Write property test for treasure tier consistency
    - **Property 8: Treasure Tier Consistency**
    - **Validates: Requirements 4.1**
  
  - [ ]* 12.2 Write property test for configuration change propagation
    - **Property 12: Configuration Change Propagation**
    - **Validates: Requirements 6.3**
  
  - [ ]* 12.3 Write property test for calculation explanation completeness
    - **Property 13: Calculation Explanation Completeness**
    - **Validates: Requirements 6.4**

- [ ] 13. Integration and wiring
  - [ ] 13.1 Create main ExperienceSystem facade class
    - Wire together ConfigurationManager, Calculator, Validator, RealmSystem
    - Provide high-level API for experience operations
    - Add error handling and logging
    - _Requirements: 1.1, 2.4, 6.1, 7.1_
  
  - [ ]* 13.2 Write integration tests
    - Test end-to-end experience calculation workflow
    - Test configuration reload workflow
    - Test migration workflow
    - _Requirements: 1.1, 6.3, 10.1, 10.2_

- [ ] 14. Create migration utilities
  - [ ] 14.1 Create scripts/migrate-users.ts
    - Load old user data from database/file
    - Run migration for all users
    - Generate migration report
    - Provide dry-run mode for testing
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [ ]* 14.2 Write unit tests for migration script
    - Test with sample user data
    - Test dry-run mode
    - Test report generation
    - _Requirements: 10.1, 10.2, 10.5_

- [ ] 15. Final checkpoint - Ensure all tests pass and system is ready
  - Run full test suite (unit + property tests)
  - Run validation script with real configuration
  - Verify all 19 properties are tested
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check library with minimum 100 iterations
- All property tests are tagged with format: `// Feature: experience-value-rebalance, Property N: [text]`
- Checkpoints ensure incremental validation throughout development
- The validation script should be run before any deployment to ensure correctness
