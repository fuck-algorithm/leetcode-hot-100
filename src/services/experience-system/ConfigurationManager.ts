/**
 * Configuration Manager
 * 
 * Handles loading, validating, and providing access to experience system configuration.
 * Supports both JSON and YAML configuration files with schema validation.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import Ajv, { ValidateFunction } from 'ajv';
import {
  Config,
  Difficulty,
  TreasureTier,
  ValidationResult,
  ValidationError,
} from './types';
import configSchema from './schemas/config-schema.json';
import defaultConfig from './config/experience-config.json';

/**
 * Default configuration values used when no config file is provided
 * or when specific fields are missing.
 */
const DEFAULT_CONFIG: Config = defaultConfig as Config;

/**
 * ConfigurationManager class
 * 
 * Manages loading, validation, and access to experience system configuration.
 * Provides methods to retrieve configuration values and validate configuration objects.
 */
export class ConfigurationManager {
  private config: Config;
  private validator: ValidateFunction;

  /**
   * Creates a new ConfigurationManager instance
   * 
   * @param config - Optional initial configuration. If not provided, uses default config.
   */
  constructor(config?: Config) {
    this.config = config || DEFAULT_CONFIG;
    
    // Initialize JSON schema validator
    const ajv = new Ajv({ allErrors: true, strict: false });
    this.validator = ajv.compile(configSchema);
  }

  /**
   * Loads configuration from a config object
   * 
   * In browser environment, configuration is loaded from imported JSON.
   * Falls back to default configuration if config is invalid.
   * 
   * @param config - Configuration object to load
   * @returns Loaded and validated configuration
   * @throws Error if config is invalid
   * 
   * Requirements: 8.1, 8.3, 8.4
   */
  loadConfig(config?: Partial<Config>): Config {
    try {
      if (!config) {
        console.warn('No configuration provided. Using default configuration.');
        this.config = DEFAULT_CONFIG;
        return this.config;
      }

      // Merge with defaults to handle missing optional fields
      const mergedConfig = this.mergeWithDefaults(config);

      // Validate the configuration
      const validationResult = this.validateConfig(mergedConfig);
      if (!validationResult.valid) {
        const errorMessages = validationResult.errors
          .map(e => `${e.code}: ${e.message}`)
          .join('\n');
        throw new Error(`Configuration validation failed:\n${errorMessages}`);
      }

      this.config = mergedConfig;
      return this.config;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load configuration: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Validates a configuration object against the JSON schema
   * 
   * Checks that all required fields are present, values are within valid ranges,
   * and the configuration structure matches the expected schema.
   * 
   * @param config - Configuration object to validate
   * @returns ValidationResult indicating whether validation passed and any errors/warnings
   * 
   * Requirements: 8.2, 8.3
   */
  validateConfig(config: Config): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate against JSON schema
    const valid = this.validator(config);
    if (!valid && this.validator.errors) {
      for (const error of this.validator.errors) {
        errors.push({
          code: 'SCHEMA_VALIDATION_ERROR',
          message: `${error.instancePath || 'root'} ${error.message}`,
          severity: 'error',
          details: {
            keyword: error.keyword,
            params: error.params,
            schemaPath: error.schemaPath,
          },
        });
      }
      // Return early if schema validation fails - don't attempt semantic validations
      return {
        valid: false,
        errors,
        warnings,
      };
    }

    // Additional semantic validations
    
    // Check difficulty ordering
    if (config.difficultyBaseValues.easy > config.difficultyBaseValues.medium) {
      warnings.push({
        code: 'DIFFICULTY_ORDERING',
        message: 'Easy difficulty has higher base experience than Medium',
        severity: 'warning',
        details: {
          easy: config.difficultyBaseValues.easy,
          medium: config.difficultyBaseValues.medium,
        },
      });
    }
    if (config.difficultyBaseValues.medium > config.difficultyBaseValues.hard) {
      warnings.push({
        code: 'DIFFICULTY_ORDERING',
        message: 'Medium difficulty has higher base experience than Hard',
        severity: 'warning',
        details: {
          medium: config.difficultyBaseValues.medium,
          hard: config.difficultyBaseValues.hard,
        },
      });
    }

    // Check treasure tier ordering
    const tiers = config.treasureTierValues;
    if (tiers.early > tiers.mid) {
      warnings.push({
        code: 'TREASURE_TIER_ORDERING',
        message: 'Early tier has higher experience than Mid tier',
        severity: 'warning',
        details: { early: tiers.early, mid: tiers.mid },
      });
    }
    if (tiers.mid > tiers.late) {
      warnings.push({
        code: 'TREASURE_TIER_ORDERING',
        message: 'Mid tier has higher experience than Late tier',
        severity: 'warning',
        details: { mid: tiers.mid, late: tiers.late },
      });
    }
    if (tiers.late > tiers.final) {
      warnings.push({
        code: 'TREASURE_TIER_ORDERING',
        message: 'Late tier has higher experience than Final tier',
        severity: 'warning',
        details: { late: tiers.late, final: tiers.final },
      });
    }

    // Check realm thresholds
    if (config.realmThresholds.length !== 11) {
      errors.push({
        code: 'REALM_THRESHOLD_COUNT',
        message: `Expected 11 realm thresholds, got ${config.realmThresholds.length}`,
        severity: 'error',
        details: { count: config.realmThresholds.length },
      });
    }

    // Check level thresholds
    if (config.levelThresholds.length !== 100) {
      errors.push({
        code: 'LEVEL_THRESHOLD_COUNT',
        message: `Expected 100 level thresholds, got ${config.levelThresholds.length}`,
        severity: 'error',
        details: { count: config.levelThresholds.length },
      });
    }

    // Check level threshold monotonicity
    for (let i = 1; i < config.levelThresholds.length; i++) {
      if (config.levelThresholds[i] <= config.levelThresholds[i - 1]) {
        errors.push({
          code: 'LEVEL_THRESHOLD_MONOTONICITY',
          message: `Level threshold at index ${i} (${config.levelThresholds[i]}) is not greater than previous threshold (${config.levelThresholds[i - 1]})`,
          severity: 'error',
          details: {
            index: i,
            current: config.levelThresholds[i],
            previous: config.levelThresholds[i - 1],
          },
        });
      }
    }

    // Check first and last level thresholds
    if (config.levelThresholds[0] !== 0) {
      errors.push({
        code: 'LEVEL_THRESHOLD_START',
        message: `First level threshold must be 0, got ${config.levelThresholds[0]}`,
        severity: 'error',
        details: { value: config.levelThresholds[0] },
      });
    }
    if (config.levelThresholds[config.levelThresholds.length - 1] !== config.totalExperience) {
      errors.push({
        code: 'LEVEL_THRESHOLD_END',
        message: `Last level threshold must equal totalExperience (${config.totalExperience}), got ${config.levelThresholds[config.levelThresholds.length - 1]}`,
        severity: 'error',
        details: {
          expected: config.totalExperience,
          actual: config.levelThresholds[config.levelThresholds.length - 1],
        },
      });
    }

    // Check realm threshold monotonicity
    for (let i = 1; i < config.realmThresholds.length; i++) {
      if (config.realmThresholds[i] <= config.realmThresholds[i - 1]) {
        errors.push({
          code: 'REALM_THRESHOLD_MONOTONICITY',
          message: `Realm threshold at index ${i} (${config.realmThresholds[i]}) is not greater than previous threshold (${config.realmThresholds[i - 1]})`,
          severity: 'error',
          details: {
            index: i,
            current: config.realmThresholds[i],
            previous: config.realmThresholds[i - 1],
          },
        });
      }
    }

    // Check first and last realm thresholds
    if (config.realmThresholds[0] !== 0) {
      errors.push({
        code: 'REALM_THRESHOLD_START',
        message: `First realm threshold must be 0, got ${config.realmThresholds[0]}`,
        severity: 'error',
        details: { value: config.realmThresholds[0] },
      });
    }
    if (config.realmThresholds[config.realmThresholds.length - 1] !== config.totalExperience) {
      errors.push({
        code: 'REALM_THRESHOLD_END',
        message: `Last realm threshold must equal totalExperience (${config.totalExperience}), got ${config.realmThresholds[config.realmThresholds.length - 1]}`,
        severity: 'error',
        details: {
          expected: config.totalExperience,
          actual: config.realmThresholds[config.realmThresholds.length - 1],
        },
      });
    }

    // Check importance multipliers are >= 1.0
    for (const [tag, multiplier] of Object.entries(config.importanceMultipliers)) {
      if (multiplier < 1.0) {
        errors.push({
          code: 'INVALID_MULTIPLIER',
          message: `Importance multiplier for '${tag}' must be >= 1.0, got ${multiplier}`,
          severity: 'error',
          details: { tag, multiplier },
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Gets the base experience value for a given difficulty level
   * 
   * @param difficulty - The difficulty level (easy, medium, or hard)
   * @returns Base experience value for the difficulty
   * 
   * Requirements: 8.2
   */
  getBaseExperience(difficulty: Difficulty): number {
    return this.config.difficultyBaseValues[difficulty];
  }

  /**
   * Calculates the combined importance multiplier for a set of tags
   * 
   * Multiplies all applicable multipliers together. Tags not found in the
   * configuration are ignored (treated as 1.0 multiplier).
   * 
   * @param tags - Array of importance tags
   * @returns Combined multiplier (product of all applicable multipliers)
   * 
   * Requirements: 8.2
   */
  getImportanceMultiplier(tags: string[]): number {
    let multiplier = 1.0;
    for (const tag of tags) {
      if (tag in this.config.importanceMultipliers) {
        multiplier *= this.config.importanceMultipliers[tag];
      }
    }
    return multiplier;
  }

  /**
   * Gets the experience value for a given treasure tier
   * 
   * @param tier - The treasure tier (early, mid, late, or final)
   * @returns Experience value for the tier
   * 
   * Requirements: 8.2
   */
  getTreasureExperience(tier: TreasureTier): number {
    return this.config.treasureTierValues[tier];
  }

  /**
   * Gets the array of realm thresholds
   * 
   * @returns Array of 11 realm thresholds from 0 to totalExperience
   * 
   * Requirements: 8.2
   */
  getRealmThresholds(): number[] {
    return [...this.config.realmThresholds];
  }

  /**
   * Gets the current configuration object
   * 
   * @returns Current configuration
   */
  getConfig(): Config {
    return { ...this.config };
  }

  /**
   * Gets the total experience value from configuration
   * 
   * @returns Total experience (should always be 1,000,000)
   */
  getTotalExperience(): number {
    return this.config.totalExperience;
  }

  /**
   * Gets the constraints from configuration
   * 
   * @returns Constraints object
   */
  getConstraints() {
    return { ...this.config.constraints };
  }

  /**
   * Merges a partial configuration with default values
   * 
   * Ensures all required fields are present by filling in defaults
   * for any missing fields.
   * 
   * @param partial - Partial configuration object
   * @returns Complete configuration with defaults filled in
   * 
   * Requirements: 8.4
   */
  private mergeWithDefaults(partial: Partial<Config>): Config {
    return {
      totalExperience: partial.totalExperience ?? DEFAULT_CONFIG.totalExperience,
      difficultyBaseValues: {
        ...DEFAULT_CONFIG.difficultyBaseValues,
        ...partial.difficultyBaseValues,
      },
      importanceMultipliers: {
        ...DEFAULT_CONFIG.importanceMultipliers,
        ...partial.importanceMultipliers,
      },
      treasureTierValues: {
        ...DEFAULT_CONFIG.treasureTierValues,
        ...partial.treasureTierValues,
      },
      realmThresholds: partial.realmThresholds ?? DEFAULT_CONFIG.realmThresholds,
      levelThresholds: partial.levelThresholds ?? DEFAULT_CONFIG.levelThresholds,
      constraints: {
        ...DEFAULT_CONFIG.constraints,
        ...partial.constraints,
      },
    };
  }
}

/**
 * Creates a ConfigurationManager with default configuration
 * 
 * @returns ConfigurationManager instance with default config
 */
export function createDefaultConfigurationManager(): ConfigurationManager {
  return new ConfigurationManager(DEFAULT_CONFIG);
}

/**
 * Creates a ConfigurationManager by loading from a config object
 * 
 * @param config - Configuration object
 * @returns ConfigurationManager instance with loaded config
 */
export function createConfigurationManagerFromConfig(config: Partial<Config>): ConfigurationManager {
  const manager = new ConfigurationManager();
  manager.loadConfig(config);
  return manager;
}
