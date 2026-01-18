/**
 * Experience Adapter Module
 * 
 * Provides adapter layer between UI components and new experience system.
 * Maintains backward compatibility while using configurable experience values.
 */

export { TreasureTierResolver, treasureTierResolver } from './TreasureTierResolver';
export { 
  ExperienceAdapter, 
  experienceAdapter,
  type ExperienceRecord,
  type TreasureRecord
} from './ExperienceAdapter';
export { 
  UIMigrationService,
  type MigrationResult
} from './UIMigrationService';
export {
  initializeExperienceSystem,
  initializeTreasureTiers,
  isExperienceSystemInitialized
} from './initializeExperienceSystem';
