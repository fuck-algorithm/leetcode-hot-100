/**
 * Experience Value Rebalance System
 * 
 * Main entry point for the experience system module.
 * This file exports all public types and interfaces.
 */

// Export all types
export * from './types';

// Export ConfigurationManager
export {
  ConfigurationManager,
  createDefaultConfigurationManager,
  createConfigurationManagerFromFile,
} from './ConfigurationManager';

// Export NodeRegistry
export {
  NodeRegistry,
  createNodeRegistry,
} from './NodeRegistry';

// Export ExperienceCalculator
export {
  ExperienceCalculator,
  createExperienceCalculator,
} from './ExperienceCalculator';

// Export Validator
export {
  Validator,
  createValidator,
} from './Validator';

// Export RealmSystem
export {
  RealmSystem,
  createRealmSystem,
} from './RealmSystem';

// Export JSON schema (for runtime validation)
export { default as configSchema } from './schemas/config-schema.json';

/**
 * Version information
 */
export const VERSION = '1.0.0';

/**
 * System constants
 */
export const CONSTANTS = {
  TOTAL_EXPERIENCE: 1_000_000,
  NUM_REALMS: 11,
  DEFAULT_MAX_NODE_PERCENTAGE: 0.05,
  DEFAULT_MIN_NODE_EXPERIENCE: 1,
} as const;
