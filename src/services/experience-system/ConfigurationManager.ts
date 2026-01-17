/**
 * Configuration Manager
 * 
 * Handles loading, validating, and providing access to experience system configuration.
 * Supports both JSON and YAML configuration files with schema validation.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv, { ValidateFunction } from 'ajv';
import * as yaml from 'js-yaml';
import {
  Config,
  Difficulty,
  TreasureTier,
  ValidationResult,
  ValidationError,
  DifficultyBaseValues,
  ImportanceMultipliers,
  TreasureTierValues,
} from './types';
import configSchema from './schemas/config-schema.json';

/**
 * Default configuration values used when no config file is provided
 * or when specific fields are missing.
 */
const DEFAULT_CONFIG: Config = {
  totalExperience: 1_000_000,
  difficultyBaseValues: {
    easy: 5000,
    medium: 8000,
    hard: 12000,
  },
  importanceMultipliers: {
    highFrequencyInterview: 1.3,
    classicAlgorithm: 1.2,
    hasAnimation: 1.15,
  },
  treasureTierValues: {
    early: 15000,
    mid: 25000,
    late: 35000,
    final: 50000,
  },
  realmThresholds: [
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
    1000000,
  ],
  constraints: {
    maxSingleNodePercentage: 0.05,
    minNodeExperience: 1,
  },
};

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
   * Loads configuration from a JSON or YAML file
   * 
   * Supports both .json and .yaml/.yml file extensions.
   * Falls back to default configuration if file is missing or invalid.
   * 
   * @param filePath - Path to the configuration file (relative or absolute)
   * @returns Loaded and validated configuration
   * @throws Error if file exists but cannot be parsed or is invalid
   * 
   * Requirements: 8.1, 8.3, 8.4
   */
  loadConfig(filePath: string): Config {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.warn(`Configuration file not found: ${filePath}. Using default configuration.`);
        this.config = DEFAULT_CONFIG;
        return this.config;
      }

      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const ext = path.extname(filePath).toLowerCase();

      // Parse based on file extension
      let parsedConfig: any;
      if (ext === '.json') {
        parsedConfig = JSON.parse(fileContent);
      } else if (ext === '.yaml' || ext === '.yml') {
        parsedConfig = yaml.load(fileContent);
      } else {
        throw new Error(`Unsupported file format: ${ext}. Use .json, .yaml, or .yml`);
      }

      // Merge with defaults to handle missing optional fields
      const mergedConfig = this.mergeWithDefaults(parsedConfig);

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
        throw new Error(`Failed to load configuration from ${filePath}: ${error.message}`);
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
 * Creates a ConfigurationManager by loading from a file
 * 
 * @param filePath - Path to configuration file
 * @returns ConfigurationManager instance with loaded config
 */
export function createConfigurationManagerFromFile(filePath: string): ConfigurationManager {
  const manager = new ConfigurationManager();
  manager.loadConfig(filePath);
  return manager;
}
