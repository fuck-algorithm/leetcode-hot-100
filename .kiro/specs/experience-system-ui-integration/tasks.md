# Implementation Plan: Experience System UI Integration

## Overview

This implementation plan integrates the new experience system into UI components through an adapter layer. The approach maintains backward compatibility while leveraging configurable experience values and realm-based progression. Implementation will proceed incrementally, with testing at each stage to ensure correctness.

## Tasks

- [x] 1. Create TreasureTierResolver component
  - Implement TreasureTierResolver class with tier assignment logic
  - Add initializeTreasureTiers() method to assign tiers based on position
  - Add getTreasureTier() method to retrieve tier for a treasure ID
  - Add getAllTreasureTiers() method for debugging/inspection
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 1.1 Write property test for treasure tier assignment
  - **Property 4: Treasure tier assignment by position**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
  - Test that for any position P in N treasures, correct tier is assigned
  - Test that tier experience values match configuration

- [ ]* 1.2 Write unit tests for TreasureTierResolver edge cases
  - Test with 1 treasure (should be "early")
  - Test with 4 treasures (one per tier)
  - Test with empty treasure list
  - Test with unknown treasure ID (should default to "early")
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Create ExperienceAdapter facade
  - Implement ExperienceAdapter class with constructor that initializes ExperienceSystem
  - Add getTotalExperience() method (backward compatible with old API)
  - Add addExperience() and removeExperience() methods
  - Add getTreasureExperience() method using TreasureTierResolver
  - Add getDifficultyExperience() method using new system values
  - Add getCurrentRealm(), getRealmProgress(), getExperienceToNextRealm() methods
  - _Requirements: 1.1, 1.2, 1.4_

- [ ]* 2.1 Write property test for adapter experience calculation consistency
  - **Property 1: Adapter experience calculation consistency**
  - **Validates: Requirements 1.2**
  - Test that for any difficulty/treasure ID, adapter returns same values as new system

- [ ]* 2.2 Write property test for configuration-driven calculations
  - **Property 3: Configuration-driven calculations**
  - **Validates: Requirements 1.5**
  - Test that for any valid config, all calculations use config values

- [ ]* 2.3 Write unit tests for ExperienceAdapter methods
  - Test getTreasureExperience() with various treasure IDs
  - Test getDifficultyExperience() with EASY, MEDIUM, HARD
  - Test getCurrentRealm() with various experience values
  - Test error handling for invalid parameters
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 3. Implement IndexedDB integration in ExperienceAdapter
  - Add database connection initialization
  - Implement getTotalExperience() with IndexedDB read
  - Implement addExperience() with IndexedDB write and schema version
  - Implement removeExperience() with IndexedDB write
  - Implement openTreasure() with treasure tier calculation and storage
  - Implement isTreasureOpened(), getAllOpenedTreasures() methods
  - Implement resetAll() and resetPathTreasures() methods
  - _Requirements: 1.3, 5.1, 5.2, 5.5_

- [ ]* 3.1 Write property test for experience data persistence
  - **Property 2: Experience data persistence with schema version**
  - **Validates: Requirements 1.3, 5.2**
  - Test that for any experience value stored, reading returns same value with schemaVersion=2

- [ ]* 3.2 Write unit tests for IndexedDB operations
  - Test database initialization
  - Test reading non-existent experience (should return default)
  - Test writing and reading experience
  - Test treasure opening and status checking
  - Test resetAll() clears all data
  - _Requirements: 1.3, 5.1, 5.2_

- [x] 4. Create UIMigrationService
  - Implement UIMigrationService class with constructor
  - Add needsMigration() method to check schema version
  - Add migrateUserData() method with scaling logic (3070 → 1,000,000)
  - Add backupOldData() method to create backup before migration
  - Add rollbackMigration() method for error recovery
  - Add markMigrationComplete() method to store timestamp and version
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ]* 4.1 Write property test for proportional experience scaling
  - **Property 7: Proportional experience scaling during migration**
  - **Validates: Requirements 4.1**
  - Test that for any old experience value, scaling is proportional

- [ ]* 4.2 Write property test for migration preserves progression percentage
  - **Property 8: Migration preserves progression percentage**
  - **Validates: Requirements 4.2**
  - Test that (oldExp/oldMax) ≈ (newExp/newMax) within tolerance

- [ ]* 4.3 Write property test for migration preserves completion status
  - **Property 9: Migration preserves completion status**
  - **Validates: Requirements 4.3, 4.4**
  - Test that for any set of completions, migration preserves them

- [ ]* 4.4 Write property test for migration rollback on error
  - **Property 10: Migration rollback on error**
  - **Validates: Requirements 4.6**
  - Test that for any error during migration, rollback restores original state

- [ ]* 4.5 Write unit tests for UIMigrationService
  - Test needsMigration() with old and new schema versions
  - Test migration with known values (0, 1535, 3070)
  - Test backup creation
  - Test rollback on error
  - Test migration timestamp and version storage
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 5. Add migration check and execution at application startup
  - Add migration check in application initialization code
  - If needsMigration() returns true, run migrateUserData()
  - Display migration progress/status to user
  - Handle migration errors gracefully
  - _Requirements: 4.1, 4.2, 4.6, 6.1_

- [ ]* 5.1 Write integration test for startup migration flow
  - Test application starts with old data and migrates automatically
  - Test application starts with new data and skips migration
  - Test migration error handling during startup
  - _Requirements: 4.1, 4.6, 6.1_

- [x] 6. Checkpoint - Ensure adapter and migration tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update TreasureNode component to use ExperienceAdapter
  - Replace import from experienceStorage to experienceAdapter
  - Replace TREASURE_EXP constant with experienceAdapter.getTreasureExperience(treasureId)
  - Update treasure reward display to show dynamic experience value
  - Update openTreasure call to use experienceAdapter
  - Format large numbers with toLocaleString() for readability
  - _Requirements: 3.1, 3.5_

- [ ]* 7.1 Write property test for TreasureNode experience display
  - **Property 5: UI component experience display accuracy**
  - **Validates: Requirements 3.1**
  - Test that for any treasure ID, displayed value matches calculated value

- [ ]* 7.2 Write integration test for TreasureNode with adapter
  - Test TreasureNode renders with correct experience value
  - Test opening treasure updates experience correctly
  - Test treasure status persists across re-renders
  - _Requirements: 3.1, 3.5_

- [x] 8. Update ExperienceBar component to use ExperienceAdapter
  - Replace import from experienceStorage to experienceAdapter
  - Replace old realm calculation with experienceAdapter.getCurrentRealm()
  - Replace level progress calculation with experienceAdapter.getRealmProgress()
  - Update "next realm" calculation with experienceAdapter.getExperienceToNextRealm()
  - Update realm display to use new realm system (0-10)
  - Format large experience numbers with toLocaleString()
  - _Requirements: 3.2_

- [ ]* 8.1 Write property test for ExperienceBar realm display
  - **Property 5: UI component experience display accuracy**
  - **Validates: Requirements 3.2**
  - Test that for any experience value, displayed realm matches calculated realm

- [ ]* 8.2 Write integration test for ExperienceBar with adapter
  - Test ExperienceBar renders with correct realm and progress
  - Test ExperienceBar updates when experience changes
  - Test realm transitions display correctly
  - _Requirements: 3.2_

- [x] 9. Update useCompletionStatus hook to use ExperienceAdapter
  - Replace import from experienceStorage to experienceAdapter
  - Replace DIFFICULTY_EXP constant with experienceAdapter.getDifficultyExperience()
  - Update toggleCompletion to use new difficulty values
  - Update resetPathProgress to use experienceAdapter methods
  - Ensure experience change events dispatch correctly
  - _Requirements: 3.3, 3.4_

- [ ]* 9.1 Write property test for useCompletionStatus experience calculation
  - **Property 5: UI component experience display accuracy**
  - **Validates: Requirements 3.3**
  - Test that for any difficulty, hook uses correct experience values

- [ ]* 9.2 Write property test for UI state updates after experience changes
  - **Property 6: UI state updates after experience changes**
  - **Validates: Requirements 3.4, 3.5**
  - Test that for any experience change, UI updates correctly

- [ ]* 9.3 Write integration test for useCompletionStatus with adapter
  - Test completing problem adds correct experience
  - Test uncompleting problem removes correct experience
  - Test resetPathProgress works correctly
  - _Requirements: 3.3, 3.4_

- [ ] 10. Checkpoint - Ensure UI component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Add configuration validation to ExperienceAdapter
  - Implement validateConfiguration() method in ExperienceAdapter
  - Check treasureTierValues has all required tiers (early, mid, late, final)
  - Check difficultyBaseValues has all required difficulties (easy, medium, hard)
  - Check totalExperience is positive
  - Log validation errors and use defaults if validation fails
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [ ]* 11.1 Write property test for configuration validation
  - **Property 13: Configuration validation**
  - **Validates: Requirements 6.2, 6.3, 6.4, 6.5**
  - Test that for any config, validation checks all required fields

- [ ]* 11.2 Write unit tests for configuration validation
  - Test validation with valid configuration
  - Test validation with missing treasure tiers
  - Test validation with missing difficulty values
  - Test validation with negative totalExperience
  - Test default values are used when validation fails
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [ ] 12. Add configuration reload capability
  - Implement reloadConfiguration() method in ExperienceAdapter
  - Trigger recalculation of all experience values after reload
  - Dispatch event to notify UI components of config change
  - Update UI components to listen for config change events
  - _Requirements: 6.6_

- [ ]* 12.1 Write property test for configuration change reactivity
  - **Property 14: Configuration change reactivity**
  - **Validates: Requirements 6.6**
  - Test that for any config change, calculations use new values

- [ ]* 12.2 Write integration test for configuration reload
  - Test reloading configuration updates all calculations
  - Test UI components update after configuration reload
  - _Requirements: 6.6_

- [ ] 13. Add error handling and logging
  - Add try-catch blocks to all ExperienceAdapter methods
  - Implement descriptive error messages for invalid parameters
  - Add logging for configuration load failures
  - Add logging for migration operations
  - Add logging for IndexedDB failures
  - Implement exponential backoff retry for IndexedDB operations
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 13.1 Write property test for invalid parameter error handling
  - **Property 15: Invalid parameter error handling**
  - **Validates: Requirements 8.3**
  - Test that for any invalid parameter, descriptive error is thrown

- [ ]* 13.2 Write unit tests for error handling
  - Test configuration load failure uses defaults
  - Test migration error triggers rollback
  - Test IndexedDB failure retries with backoff
  - Test invalid parameters throw descriptive errors
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 14. Add schema version detection and handling
  - Implement readExperience() method that detects schema version
  - Handle schemaVersion undefined (old format) by treating as version 1
  - Handle schemaVersion 1 (old format) by reading old fields
  - Handle schemaVersion 2 (new format) by reading new fields
  - Ensure backward compatibility with old data
  - _Requirements: 5.3_

- [ ]* 14.1 Write property test for schema version detection
  - **Property 11: Schema version detection and handling**
  - **Validates: Requirements 5.3**
  - Test that for any data with schema version 1 or 2, system reads correctly

- [ ]* 14.2 Write unit tests for schema version handling
  - Test reading data with no schema version (old format)
  - Test reading data with schemaVersion 1
  - Test reading data with schemaVersion 2
  - Test writing always uses schemaVersion 2
  - _Requirements: 5.3_

- [ ] 15. Implement rollback capability for system failures
  - Add createSystemBackup() method to backup current state
  - Add restoreFromBackup() method to restore from backup
  - Add rollback trigger mechanism for critical failures
  - Test rollback restores all data correctly
  - _Requirements: 5.4_

- [ ]* 15.1 Write property test for rollback capability
  - **Property 12: Rollback capability on system failure**
  - **Validates: Requirements 5.4**
  - Test that for any failure, rollback restores original state

- [ ]* 15.2 Write unit tests for rollback capability
  - Test backup creation
  - Test restore from backup
  - Test rollback on various failure scenarios
  - _Requirements: 5.4_

- [ ] 16. Checkpoint - Ensure all error handling and validation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Deprecate old experienceStorage.ts
  - Add @deprecated JSDoc comments to all methods in experienceStorage.ts
  - Add deprecation warning in module header
  - Update all imports in codebase to use experienceAdapter instead
  - Verify no active code imports experienceStorage.ts
  - Keep file in codebase for reference
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 18. Create migration guide documentation
  - Document the transition from old to new system
  - Explain adapter layer architecture
  - Provide examples of updating components
  - Document migration process and rollback
  - Include troubleshooting section
  - _Requirements: 10.5_

- [x] 19. Initialize treasure tiers at application startup
  - Collect all treasure IDs from problem list
  - Call treasureTierResolver.initializeTreasureTiers() with treasure IDs
  - Ensure initialization happens before any UI components render
  - Add logging for treasure tier initialization
  - _Requirements: 2.5_

- [ ]* 19.1 Write integration test for treasure tier initialization
  - Test treasure tiers are initialized correctly at startup
  - Test UI components can access treasure tiers after initialization
  - _Requirements: 2.5_

- [ ] 20. Final integration testing
  - Test complete flow: startup → migration check → UI rendering
  - Test problem completion flow with new experience values
  - Test treasure opening flow with tier-based experience
  - Test experience bar updates with realm system
  - Test configuration reload updates all components
  - Test error recovery and rollback scenarios
  - _Requirements: All_

- [ ] 21. Final checkpoint - Ensure all integration tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows
- The adapter pattern allows gradual migration without breaking existing functionality
- Migration is automatic and transparent to users
- Rollback capability ensures data safety
