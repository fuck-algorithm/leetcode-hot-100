# Requirements Document

## Introduction

This document specifies the requirements for integrating the new experience system into UI components. The current UI components use a legacy experience system with fixed values (TREASURE_EXP = 50, DIFFICULTY_EXP = {EASY: 10, MEDIUM: 20, HARD: 30}), while a fully implemented new system exists with configurable values and a total experience pool of 1,000,000. This integration will migrate UI components to use the new system while preserving existing user data and maintaining backward compatibility.

## Glossary

- **Old_Experience_System**: The legacy experience system in `experienceStorage.ts` using fixed values
- **New_Experience_System**: The configurable experience system in `src/services/experience-system/` with realm-based progression
- **Adapter_Layer**: A compatibility bridge that provides the old API surface while using new system calculations
- **Treasure_Tier**: Classification of treasure chests (early, mid, late, final) determining experience value
- **Realm**: A level grouping in the new experience system (e.g., Realm 1 = levels 1-10)
- **Migration_Service**: Component responsible for converting old user data to new system format
- **Experience_Calculator**: Component that calculates experience values based on configuration
- **Configuration_Manager**: Component that loads and validates experience configuration
- **UI_Component**: React components that display experience information (TreasureNode, ExperienceBar, useCompletionStatus)
- **IndexedDB**: Browser storage mechanism used by both old and new systems
- **Learning_Path**: The sequence of problems and treasures in the application

## Requirements

### Requirement 1: Adapter Layer Implementation

**User Story:** As a developer, I want an adapter layer between the new experience system and existing UI components, so that I can integrate the new system without rewriting all UI code.

#### Acceptance Criteria

1. THE Adapter_Layer SHALL provide the same API surface as Old_Experience_System
2. WHEN a UI_Component requests experience values, THE Adapter_Layer SHALL calculate them using New_Experience_System
3. WHEN a UI_Component stores experience data, THE Adapter_Layer SHALL persist it using IndexedDB with the new schema
4. THE Adapter_Layer SHALL expose methods for getTreasureExperience, getDifficultyExperience, getCurrentRealm, and getTotalExperience
5. WHEN Configuration_Manager loads experience-config.json, THE Adapter_Layer SHALL use those values for all calculations

### Requirement 2: Treasure Tier Assignment

**User Story:** As a user, I want treasure chests to display appropriate experience values based on their position in the learning path, so that later treasures feel more rewarding.

#### Acceptance Criteria

1. WHEN a treasure is in the first 25% of the Learning_Path, THE System SHALL assign it "early" tier with 15000 experience
2. WHEN a treasure is between 25-50% of the Learning_Path, THE System SHALL assign it "mid" tier with 25000 experience
3. WHEN a treasure is between 50-75% of the Learning_Path, THE System SHALL assign it "late" tier with 35000 experience
4. WHEN a treasure is in the final 25% of the Learning_Path, THE System SHALL assign it "final" tier with 45000 experience
5. THE System SHALL calculate treasure position based on its index in the complete problem list

### Requirement 3: UI Component Updates

**User Story:** As a user, I want to see accurate experience values in the UI that reflect the new experience system, so that I understand my progression correctly.

#### Acceptance Criteria

1. WHEN TreasureNode renders, THE System SHALL display the correct treasure tier experience value (15000-45000)
2. WHEN ExperienceBar renders, THE System SHALL display current experience, realm, and progress using New_Experience_System calculations
3. WHEN useCompletionStatus calculates experience, THE System SHALL use New_Experience_System difficulty-based values (5000, 8000, 12000)
4. WHEN a user completes a problem, THE UI_Component SHALL update to reflect the new experience total immediately
5. WHEN a user opens a treasure, THE UI_Component SHALL update to reflect the treasure tier experience immediately

### Requirement 4: Data Migration

**User Story:** As a user with existing progress, I want my experience data migrated to the new system, so that I don't lose my progress when the system updates.

#### Acceptance Criteria

1. WHEN Migration_Service runs, THE System SHALL scale old experience values proportionally from old maximum (~3070) to new maximum (1,000,000)
2. WHEN Migration_Service calculates new experience, THE System SHALL preserve the user's relative progression percentage
3. WHEN Migration_Service migrates data, THE System SHALL preserve all treasure chest completion status
4. WHEN Migration_Service migrates data, THE System SHALL preserve all problem completion status
5. WHEN Migration_Service completes, THE System SHALL store a migration timestamp and version number
6. IF Migration_Service encounters an error, THEN THE System SHALL rollback to the previous state and log the error
7. THE Migration_Service SHALL create a backup of old data before migration begins

### Requirement 5: Backward Compatibility

**User Story:** As a developer, I want the new system to maintain compatibility with existing storage mechanisms, so that the migration is seamless and reversible.

#### Acceptance Criteria

1. THE System SHALL continue using IndexedDB for experience data storage
2. WHEN storing experience data, THE System SHALL use a schema version identifier
3. WHEN reading experience data, THE System SHALL detect the schema version and handle both old and new formats
4. IF the new system fails, THEN THE System SHALL provide a mechanism to rollback to Old_Experience_System
5. THE System SHALL maintain the same database name and object store names as Old_Experience_System

### Requirement 6: Configuration Management

**User Story:** As a system administrator, I want experience values to be configurable, so that I can adjust game balance without code changes.

#### Acceptance Criteria

1. WHEN the application starts, THE Configuration_Manager SHALL load experience-config.json
2. IF experience-config.json is invalid, THEN THE Configuration_Manager SHALL log an error and use default values
3. THE Configuration_Manager SHALL validate that treasureTierValues contains all required tiers (early, mid, late, final)
4. THE Configuration_Manager SHALL validate that difficultyBaseValues contains all required difficulties (easy, medium, hard)
5. THE Configuration_Manager SHALL validate that totalExperience is a positive number
6. WHEN configuration values change, THE System SHALL recalculate all experience displays without requiring a page refresh

### Requirement 7: Testing and Validation

**User Story:** As a developer, I want comprehensive tests for the integration, so that I can be confident the system works correctly.

#### Acceptance Criteria

1. THE System SHALL include unit tests for the Adapter_Layer covering all API methods
2. THE System SHALL include property-based tests for treasure tier assignment across all possible positions
3. THE System SHALL include integration tests for UI_Component rendering with new experience values
4. THE System SHALL include tests for Migration_Service accuracy with various old data scenarios
5. THE System SHALL include tests verifying backward compatibility with old data formats
6. WHEN all tests run, THE System SHALL achieve at least 90% code coverage for new integration code

### Requirement 8: Error Handling and Logging

**User Story:** As a developer, I want clear error messages and logging, so that I can diagnose issues quickly.

#### Acceptance Criteria

1. WHEN Configuration_Manager fails to load configuration, THE System SHALL log a detailed error message with the failure reason
2. WHEN Migration_Service encounters invalid data, THE System SHALL log the specific data that failed validation
3. WHEN Adapter_Layer receives invalid parameters, THE System SHALL throw descriptive errors
4. WHEN IndexedDB operations fail, THE System SHALL log the error and provide a user-friendly message
5. THE System SHALL log all migration operations with timestamps for audit purposes

### Requirement 9: Performance Requirements

**User Story:** As a user, I want the experience system to respond quickly, so that the UI feels responsive.

#### Acceptance Criteria

1. WHEN calculating treasure tier experience, THE System SHALL complete the calculation in less than 10ms
2. WHEN loading experience data from IndexedDB, THE System SHALL complete the operation in less than 100ms
3. WHEN updating UI_Component with new experience values, THE System SHALL render the update in less than 50ms
4. THE System SHALL cache configuration values to avoid repeated file reads
5. THE System SHALL batch IndexedDB writes when multiple experience updates occur simultaneously

### Requirement 10: Deprecation of Old System

**User Story:** As a developer, I want the old experience system clearly marked as deprecated, so that future developers don't accidentally use it.

#### Acceptance Criteria

1. THE System SHALL add deprecation comments to all Old_Experience_System functions
2. THE System SHALL add deprecation warnings to Old_Experience_System module documentation
3. THE System SHALL update all import statements to use Adapter_Layer instead of Old_Experience_System
4. THE Old_Experience_System file SHALL remain in the codebase for reference but not be imported by any active code
5. THE System SHALL include migration guide documentation explaining the transition from old to new system
