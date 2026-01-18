# Design Document: Experience System UI Integration

## Overview

This design document specifies the integration of the new experience system into UI components. The integration will be achieved through an adapter layer that provides backward compatibility while leveraging the new system's configurable values and realm-based progression. The design ensures seamless migration of existing user data and maintains the same API surface for UI components.

### Key Design Principles

1. **Adapter Pattern**: Use an adapter layer to bridge old and new systems without rewriting UI code
2. **Backward Compatibility**: Maintain IndexedDB storage and existing API surface
3. **Progressive Enhancement**: Enhance functionality while preserving existing behavior
4. **Data Integrity**: Ensure user progress is preserved during migration
5. **Configuration-Driven**: Use experience-config.json for all experience values

### System Context

**Current State**:
- Old system: Fixed values (TREASURE_EXP = 50, DIFFICULTY_EXP = {EASY: 10, MEDIUM: 20, HARD: 30})
- Maximum experience: ~3070 (100 problems + 23 treasures)
- UI components: TreasureNode, ExperienceBar, useCompletionStatus
- Storage: IndexedDB via experienceStorage.ts

**Target State**:
- New system: Configurable values from experience-config.json
- Maximum experience: 1,000,000
- Treasure tiers: 15000 (early), 25000 (mid), 35000 (late), 45000 (final)
- Difficulty values: 5000 (easy), 8000 (medium), 12000 (hard)
- Realm system: 10 realms with progressive thresholds

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      UI Components                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ TreasureNode │  │ExperienceBar │  │useCompletionStatus│  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                  │                    │             │
│         └──────────────────┼────────────────────┘             │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Adapter Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         ExperienceAdapter (Facade)                   │   │
│  │  - getTreasureExperience(treasureId)                 │   │
│  │  - getDifficultyExperience(difficulty)               │   │
│  │  - getCurrentRealm(experience)                       │   │
│  │  - getTotalExperience()                              │   │
│  │  - addExperience(amount)                             │   │
│  │  - openTreasure(treasureId)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                     │
│         ├─────────────────┬──────────────────┬──────────────┤
│         ▼                 ▼                  ▼              ▼│
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐│
│  │ Treasure │  │ Experience   │  │  Realm   │  │Migration ││
│  │  Tier    │  │ Calculator   │  │ System   │  │ Service  ││
│  │ Resolver │  │              │  │          │  │          ││
│  └──────────┘  └──────────────┘  └──────────┘  └──────────┘│
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              New Experience System                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         ExperienceSystem (Existing)                  │   │
│  │  - ConfigurationManager                              │   │
│  │  - ExperienceCalculator                              │   │
│  │  - RealmSystem                                       │   │
│  │  - Validator                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Storage Layer                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              IndexedDB                               │   │
│  │  - experience store (with schema version)            │   │
│  │  - treasures store                                   │   │
│  │  - completions store                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

**Treasure Opening Flow**:
```
User clicks treasure
    ↓
TreasureNode.handleOpenTreasure()
    ↓
ExperienceAdapter.openTreasure(treasureId)
    ↓
TreasureTierResolver.getTreasureTier(treasureId)
    ↓
ExperienceCalculator.calculateTreasureExperience(tier)
    ↓
IndexedDB.saveTreasure() + IndexedDB.updateExperience()
    ↓
Dispatch 'expChange' event
    ↓
ExperienceBar updates display
```

**Problem Completion Flow**:
```
User completes problem
    ↓
useCompletionStatus.toggleCompletion(problemId, difficulty)
    ↓
ExperienceAdapter.getDifficultyExperience(difficulty)
    ↓
ExperienceCalculator (uses config values)
    ↓
ExperienceAdapter.addExperience(amount)
    ↓
IndexedDB.updateExperience()
    ↓
Dispatch 'expChange' event
    ↓
ExperienceBar updates display
```

## Components and Interfaces

### 1. ExperienceAdapter (Facade)

The main adapter that provides the same API as the old experienceStorage while using the new system internally.

```typescript
/**
 * ExperienceAdapter - Adapter layer between UI and new experience system
 * 
 * Provides backward-compatible API while using new experience system internally.
 * Maintains same method signatures as old experienceStorage.ts
 */
export class ExperienceAdapter {
  private experienceSystem: ExperienceSystem;
  private treasureTierResolver: TreasureTierResolver;
  private db: IDBDatabase;
  
  constructor(configPath?: string) {
    // Initialize new experience system
    this.experienceSystem = new ExperienceSystem(configPath);
    this.treasureTierResolver = new TreasureTierResolver();
  }
  
  /**
   * Get total experience (backward compatible)
   * Returns same format as old system
   */
  async getTotalExperience(): Promise<ExperienceRecord> {
    // Read from IndexedDB
    // Return format: { id: 'total', totalExp: number, level: number, lastUpdated: number }
  }
  
  /**
   * Add experience (backward compatible)
   * Uses new system for realm calculation
   */
  async addExperience(amount: number): Promise<ExperienceRecord> {
    // Update IndexedDB
    // Calculate new realm using experienceSystem.getCurrentRealm()
    // Return updated record
  }
  
  /**
   * Remove experience (backward compatible)
   */
  async removeExperience(amount: number): Promise<ExperienceRecord> {
    // Update IndexedDB
    // Recalculate realm
    // Return updated record
  }
  
  /**
   * Get treasure experience value
   * NEW: Uses treasure tier system
   */
  getTreasureExperience(treasureId: string): number {
    const tier = this.treasureTierResolver.getTreasureTier(treasureId);
    return this.experienceSystem.calculateTreasureExperience(tier);
  }
  
  /**
   * Get difficulty experience value
   * NEW: Uses new system values (5000, 8000, 12000)
   */
  getDifficultyExperience(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): number {
    const config = this.experienceSystem.getConfiguration();
    const difficultyMap = {
      'EASY': 'easy' as Difficulty,
      'MEDIUM': 'medium' as Difficulty,
      'HARD': 'hard' as Difficulty
    };
    return config.difficultyBaseValues[difficultyMap[difficulty]];
  }
  
  /**
   * Open treasure (backward compatible)
   * NEW: Uses treasure tier for experience calculation
   */
  async openTreasure(treasureId: string): Promise<{ 
    treasure: TreasureRecord; 
    newExp: ExperienceRecord 
  }> {
    // Check if already opened
    // Get treasure tier
    // Calculate experience using new system
    // Save to IndexedDB
    // Return result
  }
  
  /**
   * Check if treasure is opened (backward compatible)
   */
  async isTreasureOpened(treasureId: string): Promise<boolean> {
    // Query IndexedDB
  }
  
  /**
   * Get current realm
   * NEW: Uses new realm system (0-10)
   */
  getCurrentRealm(experience: number): number {
    return this.experienceSystem.getCurrentRealm(experience);
  }
  
  /**
   * Get realm progress
   * NEW: Uses new realm system
   */
  getRealmProgress(experience: number): number {
    return this.experienceSystem.getRealmProgress(experience);
  }
  
  /**
   * Get experience to next realm
   * NEW: Uses new realm system
   */
  getExperienceToNextRealm(experience: number): number {
    return this.experienceSystem.getExperienceToNextRealm(experience);
  }
  
  /**
   * Reset all progress (backward compatible)
   */
  async resetAll(): Promise<void> {
    // Clear IndexedDB stores
  }
  
  /**
   * Reset path treasures (backward compatible)
   */
  async resetPathTreasures(pathId: string): Promise<void> {
    // Clear path-specific treasures from IndexedDB
  }
  
  /**
   * Get all opened treasures (backward compatible)
   */
  async getAllOpenedTreasures(): Promise<TreasureRecord[]> {
    // Query IndexedDB
  }
}

// Export singleton instance
export const experienceAdapter = new ExperienceAdapter(
  'src/services/experience-system/config/experience-config.json'
);
```

### 2. TreasureTierResolver

Determines treasure tier based on position in learning path.

```typescript
/**
 * TreasureTierResolver - Determines treasure tier based on position
 * 
 * Assigns tiers based on treasure position in learning path:
 * - First 25%: "early" (15000 EXP)
 * - 25-50%: "mid" (25000 EXP)
 * - 50-75%: "late" (35000 EXP)
 * - 75-100%: "final" (45000 EXP)
 */
export class TreasureTierResolver {
  private treasureTiers: Map<string, TreasureTier>;
  private totalTreasures: number;
  
  constructor() {
    this.treasureTiers = new Map();
    this.totalTreasures = 0;
  }
  
  /**
   * Initialize treasure tiers based on problem list
   * Should be called once at application startup
   */
  initializeTreasureTiers(treasureIds: string[]): void {
    this.totalTreasures = treasureIds.length;
    
    treasureIds.forEach((treasureId, index) => {
      const position = (index + 1) / this.totalTreasures;
      let tier: TreasureTier;
      
      if (position <= 0.25) {
        tier = 'early';
      } else if (position <= 0.50) {
        tier = 'mid';
      } else if (position <= 0.75) {
        tier = 'late';
      } else {
        tier = 'final';
      }
      
      this.treasureTiers.set(treasureId, tier);
    });
  }
  
  /**
   * Get treasure tier for a specific treasure ID
   */
  getTreasureTier(treasureId: string): TreasureTier {
    const tier = this.treasureTiers.get(treasureId);
    if (!tier) {
      // Default to 'early' if not found
      console.warn(`Treasure tier not found for ${treasureId}, defaulting to 'early'`);
      return 'early';
    }
    return tier;
  }
  
  /**
   * Get all treasure tiers
   */
  getAllTreasureTiers(): Map<string, TreasureTier> {
    return new Map(this.treasureTiers);
  }
}
```

### 3. Migration Service Integration

Extends the existing MigrationService to handle UI-specific migration needs.

```typescript
/**
 * UIMigrationService - Handles migration of UI-specific data
 * 
 * Extends MigrationService to handle:
 * - IndexedDB schema migration
 * - Treasure completion status migration
 * - Problem completion status migration
 */
export class UIMigrationService {
  private migrationService: MigrationService;
  private experienceSystem: ExperienceSystem;
  
  constructor(experienceSystem: ExperienceSystem) {
    this.experienceSystem = experienceSystem;
    this.migrationService = new MigrationService(
      experienceSystem.getConfiguration()
    );
  }
  
  /**
   * Migrate user data from old system to new system
   * 
   * Steps:
   * 1. Backup old data
   * 2. Calculate scaling factor (old max ~3070 → new max 1,000,000)
   * 3. Scale experience proportionally
   * 4. Preserve treasure completion status
   * 5. Preserve problem completion status
   * 6. Update schema version
   * 7. Commit changes
   */
  async migrateUserData(): Promise<MigrationResult> {
    // 1. Backup old data
    const backup = await this.backupOldData();
    
    try {
      // 2. Read old experience data
      const oldExp = await this.readOldExperience();
      
      // 3. Calculate new experience
      const oldMaxExp = 3070; // Approximate old maximum
      const newMaxExp = 1000000;
      const scalingFactor = newMaxExp / oldMaxExp;
      const newExp = Math.floor(oldExp.totalExp * scalingFactor);
      
      // 4. Calculate new realm
      const newRealm = this.experienceSystem.getCurrentRealm(newExp);
      
      // 5. Preserve completion status (no changes needed)
      // Treasures and problems remain the same
      
      // 6. Update experience record with new values
      await this.writeNewExperience({
        id: 'total',
        totalExp: newExp,
        level: newRealm,
        lastUpdated: Date.now(),
        schemaVersion: 2 // NEW: Schema version identifier
      });
      
      // 7. Mark migration as complete
      await this.markMigrationComplete();
      
      return {
        success: true,
        oldExperience: oldExp.totalExp,
        newExperience: newExp,
        oldRealm: oldExp.level,
        newRealm: newRealm,
        scalingFactor: scalingFactor
      };
    } catch (error) {
      // Rollback on error
      await this.rollbackMigration(backup);
      throw error;
    }
  }
  
  /**
   * Check if migration is needed
   */
  async needsMigration(): Promise<boolean> {
    const exp = await this.readExperience();
    // Check schema version
    return !exp.schemaVersion || exp.schemaVersion < 2;
  }
  
  /**
   * Backup old data before migration
   */
  private async backupOldData(): Promise<MigrationBackup> {
    // Read all data from IndexedDB
    // Return backup object
  }
  
  /**
   * Rollback migration on error
   */
  private async rollbackMigration(backup: MigrationBackup): Promise<void> {
    // Restore backup data to IndexedDB
  }
  
  /**
   * Mark migration as complete
   */
  private async markMigrationComplete(): Promise<void> {
    // Store migration timestamp and version
  }
}
```

### 4. Updated UI Components

#### TreasureNode Updates

```typescript
// Changes to TreasureNode.tsx

// OLD:
import { experienceStorage, TREASURE_EXP } from '../../../services/experienceStorage';

// NEW:
import { experienceAdapter } from '../../../services/experience-adapter';

// OLD:
<span className="treasure-reward">
  {isOpened 
    ? (currentLang === 'zh' ? '✓ 已领取' : '✓ Claimed')
    : `+${TREASURE_EXP} EXP`
  }
</span>

// NEW:
const treasureExp = experienceAdapter.getTreasureExperience(treasureId);
<span className="treasure-reward">
  {isOpened 
    ? (currentLang === 'zh' ? '✓ 已领取' : '✓ Claimed')
    : `+${treasureExp.toLocaleString()} EXP`
  }
</span>

// OLD:
const { treasure, newExp } = await experienceStorage.openTreasure(treasureId);

// NEW:
const { treasure, newExp } = await experienceAdapter.openTreasure(treasureId);
```

#### ExperienceBar Updates

```typescript
// Changes to ExperienceBar.tsx

// OLD:
import { experienceStorage, ExperienceRecord, calculateLevelProgress } from '../../services/experienceStorage';

// NEW:
import { experienceAdapter, ExperienceRecord } from '../../services/experience-adapter';

// OLD:
const REALMS: RealmInfo[] = [
  { name: '练气期', nameEn: 'Qi Refining', minLevel: 1, maxLevel: 3, ... },
  // ... 10 realms based on old level system
];

// NEW:
// Use new realm system (0-10) from experienceAdapter
const currentRealm = experienceAdapter.getCurrentRealm(experience.totalExp);
const realmProgress = experienceAdapter.getRealmProgress(experience.totalExp);
const expToNextRealm = experienceAdapter.getExperienceToNextRealm(experience.totalExp);

// OLD:
const exp = await experienceStorage.getTotalExperience();

// NEW:
const exp = await experienceAdapter.getTotalExperience();
```

#### useCompletionStatus Updates

```typescript
// Changes to useCompletionStatus.ts

// OLD:
import { experienceStorage, DIFFICULTY_EXP, ExperienceRecord } from '../../../services/experienceStorage';

// NEW:
import { experienceAdapter, ExperienceRecord } from '../../../services/experience-adapter';

// OLD:
const expAmount = DIFFICULTY_EXP[difficulty];

// NEW:
const expAmount = experienceAdapter.getDifficultyExperience(difficulty);

// OLD:
newExp = await experienceStorage.addExperience(expAmount);

// NEW:
newExp = await experienceAdapter.addExperience(expAmount);
```

## Data Models

### ExperienceRecord (Enhanced)

```typescript
/**
 * Experience record stored in IndexedDB
 * Enhanced with schema version for migration support
 */
export interface ExperienceRecord {
  id: string;              // 'total' or user identifier
  totalExp: number;        // Total experience points
  level: number;           // Current realm (0-10 in new system)
  lastUpdated: number;     // Timestamp of last update
  schemaVersion?: number;  // NEW: Schema version (1 = old, 2 = new)
  migrationDate?: number;  // NEW: When migration occurred
}
```

### TreasureRecord (Unchanged)

```typescript
/**
 * Treasure record stored in IndexedDB
 * No changes needed - compatible with both systems
 */
export interface TreasureRecord {
  treasureId: string;      // Format: 'path-{pathId}-stage-{stageIndex}'
  opened: boolean;         // Whether treasure is opened
  openedAt: number | null; // Timestamp when opened
  expAwarded: number;      // Experience awarded (will be new values)
}
```

### MigrationResult

```typescript
/**
 * Result of migration operation
 */
export interface MigrationResult {
  success: boolean;
  oldExperience: number;
  newExperience: number;
  oldRealm: number;
  newRealm: number;
  scalingFactor: number;
  error?: string;
}
```

### MigrationBackup

```typescript
/**
 * Backup of old data for rollback
 */
export interface MigrationBackup {
  experience: ExperienceRecord;
  treasures: TreasureRecord[];
  completions: CompletionRecord[];
  timestamp: number;
}
```

### TreasureTier (From New System)

```typescript
/**
 * Treasure tier classification
 */
export type TreasureTier = 'early' | 'mid' | 'late' | 'final';
```

### Difficulty (From New System)

```typescript
/**
 * Problem difficulty levels
 */
export type Difficulty = 'easy' | 'medium' | 'hard';
```

## Data Flow

### Initialization Flow

```
Application Start
    ↓
Check if migration needed
    ├─ Yes → Run UIMigrationService.migrateUserData()
    │         ├─ Backup old data
    │         ├─ Scale experience (3070 → 1,000,000)
    │         ├─ Update schema version
    │         └─ Commit changes
    │
    └─ No → Continue with normal initialization
    ↓
Initialize ExperienceAdapter
    ├─ Load ExperienceSystem with config
    ├─ Initialize TreasureTierResolver
    └─ Load treasure tier mappings
    ↓
Initialize UI Components
    ├─ TreasureNode (uses experienceAdapter)
    ├─ ExperienceBar (uses experienceAdapter)
    └─ useCompletionStatus (uses experienceAdapter)
```

### Experience Calculation Flow

```
User Action (complete problem / open treasure)
    ↓
UI Component calls ExperienceAdapter method
    ↓
ExperienceAdapter determines experience value
    ├─ For treasure: TreasureTierResolver.getTreasureTier()
    │                → ExperienceSystem.calculateTreasureExperience()
    │
    └─ For problem: ExperienceSystem.getConfiguration()
                    → difficultyBaseValues[difficulty]
    ↓
ExperienceAdapter updates IndexedDB
    ├─ Read current experience
    ├─ Add/remove experience amount
    ├─ Calculate new realm using ExperienceSystem.getCurrentRealm()
    └─ Write updated record
    ↓
Dispatch 'expChange' event
    ↓
UI Components update display
```

### Migration Flow

```
User opens application
    ↓
Check schema version in IndexedDB
    ├─ schemaVersion === undefined or < 2
    │   ↓
    │   Run Migration
    │   ├─ Create backup
    │   ├─ Read old experience (e.g., 1535 EXP)
    │   ├─ Calculate scaling factor (1,000,000 / 3070 ≈ 325.73)
    │   ├─ Scale experience (1535 * 325.73 ≈ 500,000)
    │   ├─ Calculate new realm (getCurrentRealm(500,000) = 5)
    │   ├─ Update IndexedDB with new values
    │   ├─ Set schemaVersion = 2
    │   └─ Mark migration complete
    │
    └─ schemaVersion === 2
        ↓
        Continue with normal operation
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Adapter Experience Calculation Consistency

*For any* difficulty level or treasure ID, when a UI component requests experience values through the Adapter_Layer, the returned values SHALL match what the New_Experience_System would calculate directly.

**Validates: Requirements 1.2**

### Property 2: Experience Data Persistence with Schema Version

*For any* experience value stored through the Adapter_Layer, reading it back from IndexedDB SHALL return the same value with schemaVersion field set to 2.

**Validates: Requirements 1.3, 5.2**

### Property 3: Configuration-Driven Calculations

*For any* valid experience configuration, when Configuration_Manager loads it, all subsequent experience calculations SHALL use the values from that configuration.

**Validates: Requirements 1.5**

### Property 4: Treasure Tier Assignment by Position

*For any* treasure at position P in a list of N treasures, the assigned tier SHALL be:
- "early" if P/N ≤ 0.25
- "mid" if 0.25 < P/N ≤ 0.50
- "late" if 0.50 < P/N ≤ 0.75
- "final" if P/N > 0.75

And the experience value SHALL match the configured value for that tier.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 5: UI Component Experience Display Accuracy

*For any* treasure ID or experience value, when UI components render, the displayed experience values SHALL match the values calculated by the New_Experience_System.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 6: UI State Updates After Experience Changes

*For any* problem completion or treasure opening, the UI components SHALL update to reflect the new experience total, and the new total SHALL equal the old total plus the experience gained.

**Validates: Requirements 3.4, 3.5**

### Property 7: Proportional Experience Scaling During Migration

*For any* old experience value E_old, when Migration_Service scales it to the new system, the new experience E_new SHALL equal floor(E_old × (1,000,000 / 3070)), preserving proportional progression.

**Validates: Requirements 4.1**

### Property 8: Migration Preserves Progression Percentage

*For any* old experience value E_old with old maximum M_old = 3070, after migration to new experience E_new with new maximum M_new = 1,000,000, the progression percentage SHALL be preserved: (E_old / M_old) ≈ (E_new / M_new) within rounding tolerance.

**Validates: Requirements 4.2**

### Property 9: Migration Preserves Completion Status

*For any* set of completed problems and opened treasures before migration, after migration completes, the same set of problems SHALL be marked complete and the same treasures SHALL be marked opened.

**Validates: Requirements 4.3, 4.4**

### Property 10: Migration Rollback on Error

*For any* migration that encounters an error, the system SHALL rollback to the pre-migration state, and all experience data, treasure status, and problem completion status SHALL match the backup.

**Validates: Requirements 4.6**

### Property 11: Schema Version Detection and Handling

*For any* experience data with schemaVersion 1 (old format) or schemaVersion 2 (new format), the system SHALL correctly read and interpret the data according to its schema version.

**Validates: Requirements 5.3**

### Property 12: Rollback Capability on System Failure

*For any* system failure during operation, if rollback is triggered, the system SHALL restore the Old_Experience_System state from backup, and all experience values SHALL match the pre-failure state.

**Validates: Requirements 5.4**

### Property 13: Configuration Validation

*For any* configuration object, Configuration_Manager SHALL validate that:
- treasureTierValues contains keys: early, mid, late, final
- difficultyBaseValues contains keys: easy, medium, hard
- totalExperience is a positive number

If validation fails, default values SHALL be used.

**Validates: Requirements 6.2, 6.3, 6.4, 6.5**

### Property 14: Configuration Change Reactivity

*For any* configuration change, when Configuration_Manager reloads the config, all subsequent experience calculations SHALL use the new values without requiring application restart.

**Validates: Requirements 6.6**

### Property 15: Invalid Parameter Error Handling

*For any* invalid parameter passed to Adapter_Layer methods (null, undefined, invalid difficulty, non-existent treasure ID), the system SHALL throw a descriptive error with the parameter name and expected type.

**Validates: Requirements 8.3**

## Error Handling

### Error Categories

1. **Configuration Errors**
   - Invalid JSON in experience-config.json
   - Missing required configuration fields
   - Invalid value types or ranges
   - **Handling**: Log detailed error, use default configuration, continue operation

2. **Migration Errors**
   - IndexedDB read/write failures during migration
   - Invalid old data format
   - Backup creation failures
   - **Handling**: Rollback to pre-migration state, log error with details, notify user

3. **Storage Errors**
   - IndexedDB connection failures
   - Transaction failures
   - Quota exceeded errors
   - **Handling**: Log error, retry with exponential backoff, show user-friendly message

4. **Validation Errors**
   - Invalid treasure ID
   - Invalid difficulty level
   - Negative experience values
   - **Handling**: Throw descriptive error, log with context, use safe defaults where possible

5. **Calculation Errors**
   - Division by zero in tier calculation
   - Overflow in experience scaling
   - **Handling**: Log error, use safe fallback values, continue operation

### Error Handling Patterns

```typescript
/**
 * Configuration loading with error handling
 */
async function loadConfiguration(): Promise<Config> {
  try {
    const config = await ConfigurationManager.load(configPath);
    return config;
  } catch (error) {
    console.error('Failed to load configuration:', error);
    console.warn('Using default configuration values');
    return getDefaultConfiguration();
  }
}

/**
 * Migration with rollback on error
 */
async function migrateUserData(): Promise<MigrationResult> {
  const backup = await createBackup();
  
  try {
    const result = await performMigration();
    await markMigrationComplete();
    return result;
  } catch (error) {
    console.error('Migration failed:', error);
    await rollbackFromBackup(backup);
    throw new MigrationError('Migration failed and was rolled back', error);
  }
}

/**
 * IndexedDB operations with retry
 */
async function writeExperience(
  exp: ExperienceRecord,
  retries = 3
): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await db.put(STORES.EXPERIENCE, exp);
      return;
    } catch (error) {
      if (i === retries - 1) {
        console.error('Failed to write experience after retries:', error);
        throw new StorageError('Failed to save experience data', error);
      }
      await delay(Math.pow(2, i) * 100); // Exponential backoff
    }
  }
}

/**
 * Parameter validation with descriptive errors
 */
function getDifficultyExperience(difficulty: string): number {
  const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
  
  if (!validDifficulties.includes(difficulty)) {
    throw new ValidationError(
      `Invalid difficulty: "${difficulty}". Expected one of: ${validDifficulties.join(', ')}`
    );
  }
  
  // ... calculation
}
```

### Logging Strategy

All errors SHALL be logged with:
- Timestamp
- Error type/category
- Detailed error message
- Context (user action, component, data involved)
- Stack trace (for unexpected errors)

Example log format:
```
[2024-01-15 10:30:45] ERROR [Migration] Failed to scale experience
  Context: userId=user123, oldExp=1535, scalingFactor=325.73
  Error: IndexedDB transaction failed: QuotaExceededError
  Stack: ...
```

## Testing Strategy

### Dual Testing Approach

This integration requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Specific treasure tier assignments (first treasure, last treasure, middle treasure)
- Migration with known old values (0, 1535, 3070)
- Configuration loading with valid and invalid JSON
- Error handling with specific failure scenarios
- Integration points between adapter and UI components

**Property-Based Tests**: Verify universal properties across all inputs
- Treasure tier assignment for any position in any-sized list
- Experience scaling for any old experience value
- Configuration validation for any configuration object
- UI updates for any experience change
- Migration preservation for any completion status set

### Property-Based Testing Configuration

**Library**: fast-check (for TypeScript/JavaScript)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: experience-system-ui-integration, Property N: [property text]`

**Example Property Test**:
```typescript
import fc from 'fast-check';

describe('Property 4: Treasure Tier Assignment by Position', () => {
  it('assigns correct tier based on position', () => {
    // Feature: experience-system-ui-integration, Property 4: Treasure tier assignment by position
    
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // total treasures
        fc.integer({ min: 0, max: 99 }),  // treasure index
        (totalTreasures, index) => {
          fc.pre(index < totalTreasures); // Precondition
          
          const position = (index + 1) / totalTreasures;
          const tier = resolver.getTreasureTier(treasureIds[index]);
          const expectedExp = experienceSystem.calculateTreasureExperience(tier);
          
          if (position <= 0.25) {
            expect(tier).toBe('early');
            expect(expectedExp).toBe(15000);
          } else if (position <= 0.50) {
            expect(tier).toBe('mid');
            expect(expectedExp).toBe(25000);
          } else if (position <= 0.75) {
            expect(tier).toBe('late');
            expect(expectedExp).toBe(35000);
          } else {
            expect(tier).toBe('final');
            expect(expectedExp).toBe(45000);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Requirements

- Adapter layer: 100% coverage (all methods tested)
- TreasureTierResolver: 100% coverage
- UIMigrationService: 95% coverage (excluding error paths that are hard to simulate)
- UI component updates: Integration tests for all components
- Error handling: All error paths tested with unit tests

### Testing Phases

**Phase 1: Unit Tests**
- Test adapter methods with known inputs
- Test treasure tier resolver with specific positions
- Test migration with known old values
- Test configuration loading with valid/invalid configs

**Phase 2: Property-Based Tests**
- Test treasure tier assignment across all positions
- Test experience scaling across all old values
- Test migration preservation across all completion sets
- Test configuration validation across all config variations

**Phase 3: Integration Tests**
- Test UI components with adapter
- Test end-to-end flows (problem completion, treasure opening)
- Test migration with real IndexedDB
- Test error recovery and rollback

**Phase 4: Manual Testing**
- Visual verification of UI updates
- Performance testing (response times)
- User acceptance testing
- Cross-browser compatibility

### Test Data Generators

For property-based tests, we need generators for:

```typescript
// Generate random treasure IDs
const treasureIdArb = fc.string().map(s => `treasure-${s}`);

// Generate random difficulty levels
const difficultyArb = fc.constantFrom('EASY', 'MEDIUM', 'HARD');

// Generate random experience values (old system range)
const oldExpArb = fc.integer({ min: 0, max: 3070 });

// Generate random experience values (new system range)
const newExpArb = fc.integer({ min: 0, max: 1000000 });

// Generate random treasure positions
const treasurePositionArb = fc.record({
  index: fc.integer({ min: 0, max: 99 }),
  total: fc.integer({ min: 1, max: 100 })
}).filter(({ index, total }) => index < total);

// Generate random completion status sets
const completionSetArb = fc.array(
  fc.record({
    problemId: fc.string(),
    completed: fc.boolean()
  })
);

// Generate random configuration objects
const configArb = fc.record({
  totalExperience: fc.integer({ min: 1, max: 10000000 }),
  difficultyBaseValues: fc.record({
    easy: fc.integer({ min: 1, max: 50000 }),
    medium: fc.integer({ min: 1, max: 50000 }),
    hard: fc.integer({ min: 1, max: 50000 })
  }),
  treasureTierValues: fc.record({
    early: fc.integer({ min: 1, max: 100000 }),
    mid: fc.integer({ min: 1, max: 100000 }),
    late: fc.integer({ min: 1, max: 100000 }),
    final: fc.integer({ min: 1, max: 100000 })
  })
});
```
