/**
 * Unit tests for ConfigurationManager
 * 
 * Tests configuration loading, validation, and default value fallback.
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ConfigurationManager,
  createDefaultConfigurationManager,
  createConfigurationManagerFromFile,
} from '../../ConfigurationManager';
import { Config } from '../../types';
import { createMockConfig, suppressConsole } from '../setup';

describe('ConfigurationManager', () => {
  let tempDir: string;

  beforeAll(() => {
    // Create a temporary directory for test files
    tempDir = path.join(__dirname, 'temp-config-test');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('constructor', () => {
    it('should create instance with default config when no config provided', () => {
      const manager = new ConfigurationManager();
      const config = manager.getConfig();
      
      expect(config.totalExperience).toBe(1_000_000);
      expect(config.difficultyBaseValues.easy).toBe(5000);
      expect(config.realmThresholds).toHaveLength(11);
    });

    it('should create instance with provided config', () => {
      const customConfig = createMockConfig();
      customConfig.difficultyBaseValues.easy = 6000;
      
      const manager = new ConfigurationManager(customConfig);
      const config = manager.getConfig();
      
      expect(config.difficultyBaseValues.easy).toBe(6000);
    });
  });

  describe('loadConfig - JSON files', () => {
    it('should load valid JSON configuration file', () => {
      const configPath = path.join(tempDir, 'valid-config.json');
      const validConfig = createMockConfig();
      fs.writeFileSync(configPath, JSON.stringify(validConfig, null, 2));

      const manager = new ConfigurationManager();
      const loadedConfig = manager.loadConfig(configPath);

      expect(loadedConfig.totalExperience).toBe(1_000_000);
      expect(loadedConfig.difficultyBaseValues.easy).toBe(5000);
      expect(loadedConfig.realmThresholds).toHaveLength(11);
    });

    it('should use default config when file does not exist', () => {
      const manager = new ConfigurationManager();
      const nonExistentPath = path.join(tempDir, 'non-existent.json');
      
      // Suppress console warning
      const originalWarn = console.warn;
      console.warn = jest.fn();
      
      const config = manager.loadConfig(nonExistentPath);
      
      expect(config.totalExperience).toBe(1_000_000);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Configuration file not found')
      );
      
      console.warn = originalWarn;
    });

    it('should throw error for invalid JSON syntax', () => {
      const configPath = path.join(tempDir, 'invalid-json.json');
      fs.writeFileSync(configPath, '{ invalid json }');

      const manager = new ConfigurationManager();
      
      expect(() => manager.loadConfig(configPath)).toThrow(/Failed to load configuration/);
    });

    it('should throw error for configuration that fails validation', () => {
      const configPath = path.join(tempDir, 'invalid-config.json');
      const invalidConfig = {
        totalExperience: 500000, // Wrong value, must be 1,000,000
        difficultyBaseValues: { easy: 5000, medium: 8000, hard: 12000 },
        importanceMultipliers: {},
        treasureTierValues: { early: 15000, mid: 25000, late: 35000, final: 50000 },
        realmThresholds: [0, 50000, 120000, 220000, 350000, 500000, 650000, 780000, 880000, 950000, 1000000],
        constraints: { maxSingleNodePercentage: 0.05, minNodeExperience: 1 },
      };
      fs.writeFileSync(configPath, JSON.stringify(invalidConfig, null, 2));

      const manager = new ConfigurationManager();
      
      expect(() => manager.loadConfig(configPath)).toThrow(/Configuration validation failed/);
    });
  });

  describe('loadConfig - YAML files', () => {
    it('should load valid YAML configuration file', () => {
      const configPath = path.join(tempDir, 'valid-config.yaml');
      const yamlContent = `
totalExperience: 1000000
difficultyBaseValues:
  easy: 5000
  medium: 8000
  hard: 12000
importanceMultipliers:
  highFrequencyInterview: 1.3
  classicAlgorithm: 1.2
treasureTierValues:
  early: 15000
  mid: 25000
  late: 35000
  final: 50000
realmThresholds:
  - 0
  - 50000
  - 120000
  - 220000
  - 350000
  - 500000
  - 650000
  - 780000
  - 880000
  - 950000
  - 1000000
constraints:
  maxSingleNodePercentage: 0.05
  minNodeExperience: 1
`;
      fs.writeFileSync(configPath, yamlContent);

      const manager = new ConfigurationManager();
      const loadedConfig = manager.loadConfig(configPath);

      expect(loadedConfig.totalExperience).toBe(1_000_000);
      expect(loadedConfig.difficultyBaseValues.medium).toBe(8000);
    });

    it('should load .yml extension files', () => {
      const configPath = path.join(tempDir, 'valid-config.yml');
      const yamlContent = `
totalExperience: 1000000
difficultyBaseValues:
  easy: 5000
  medium: 8000
  hard: 12000
importanceMultipliers: {}
treasureTierValues:
  early: 15000
  mid: 25000
  late: 35000
  final: 50000
realmThresholds: [0, 50000, 120000, 220000, 350000, 500000, 650000, 780000, 880000, 950000, 1000000]
constraints:
  maxSingleNodePercentage: 0.05
  minNodeExperience: 1
`;
      fs.writeFileSync(configPath, yamlContent);

      const manager = new ConfigurationManager();
      const loadedConfig = manager.loadConfig(configPath);

      expect(loadedConfig.totalExperience).toBe(1_000_000);
    });

    it('should throw error for unsupported file format', () => {
      const configPath = path.join(tempDir, 'config.txt');
      fs.writeFileSync(configPath, 'some content');

      const manager = new ConfigurationManager();
      
      expect(() => manager.loadConfig(configPath)).toThrow(/Unsupported file format/);
    });
  });

  describe('validateConfig', () => {
    it('should validate correct configuration', () => {
      const manager = new ConfigurationManager();
      const validConfig = createMockConfig();
      
      const result = manager.validateConfig(validConfig);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = {
        totalExperience: 1_000_000,
        // Missing difficultyBaseValues
      } as any;
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('SCHEMA_VALIDATION_ERROR');
    });

    it('should detect invalid totalExperience value', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.totalExperience = 500000; // Must be 1,000,000
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('totalExperience'))).toBe(true);
    });

    it('should detect incorrect number of realm thresholds', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.realmThresholds = [0, 50000, 100000]; // Should be 11
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_COUNT')).toBe(true);
    });

    it('should detect non-monotonic realm thresholds', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.realmThresholds = [0, 50000, 40000, 220000, 350000, 500000, 650000, 780000, 880000, 950000, 1000000];
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_MONOTONICITY')).toBe(true);
    });

    it('should detect invalid first realm threshold', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.realmThresholds = [100, 50000, 120000, 220000, 350000, 500000, 650000, 780000, 880000, 950000, 1000000];
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_START')).toBe(true);
    });

    it('should detect invalid last realm threshold', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.realmThresholds = [0, 50000, 120000, 220000, 350000, 500000, 650000, 780000, 880000, 950000, 900000];
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_END')).toBe(true);
    });

    it('should detect importance multipliers less than 1.0', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.importanceMultipliers.highFrequencyInterview = 0.8; // Must be >= 1.0
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_MULTIPLIER')).toBe(true);
    });

    it('should warn about difficulty ordering issues', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.difficultyBaseValues.easy = 10000;
      invalidConfig.difficultyBaseValues.medium = 8000; // Less than easy
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.warnings.some(w => w.code === 'DIFFICULTY_ORDERING')).toBe(true);
    });

    it('should warn about treasure tier ordering issues', () => {
      const manager = new ConfigurationManager();
      const invalidConfig = createMockConfig();
      invalidConfig.treasureTierValues.early = 30000;
      invalidConfig.treasureTierValues.mid = 25000; // Less than early
      
      const result = manager.validateConfig(invalidConfig);
      
      expect(result.warnings.some(w => w.code === 'TREASURE_TIER_ORDERING')).toBe(true);
    });
  });

  describe('getBaseExperience', () => {
    it('should return correct base experience for each difficulty', () => {
      const manager = new ConfigurationManager();
      
      expect(manager.getBaseExperience('easy')).toBe(5000);
      expect(manager.getBaseExperience('medium')).toBe(8000);
      expect(manager.getBaseExperience('hard')).toBe(12000);
    });
  });

  describe('getImportanceMultiplier', () => {
    it('should return 1.0 for empty tags array', () => {
      const manager = new ConfigurationManager();
      
      expect(manager.getImportanceMultiplier([])).toBe(1.0);
    });

    it('should return correct multiplier for single tag', () => {
      const manager = new ConfigurationManager();
      
      expect(manager.getImportanceMultiplier(['highFrequencyInterview'])).toBe(1.3);
      expect(manager.getImportanceMultiplier(['classicAlgorithm'])).toBe(1.2);
      expect(manager.getImportanceMultiplier(['hasAnimation'])).toBe(1.15);
    });

    it('should multiply all applicable multipliers for multiple tags', () => {
      const manager = new ConfigurationManager();
      
      const multiplier = manager.getImportanceMultiplier(['highFrequencyInterview', 'hasAnimation']);
      expect(multiplier).toBeCloseTo(1.3 * 1.15, 5);
    });

    it('should ignore unknown tags', () => {
      const manager = new ConfigurationManager();
      
      const multiplier = manager.getImportanceMultiplier(['unknownTag', 'highFrequencyInterview']);
      expect(multiplier).toBe(1.3);
    });

    it('should return 1.0 for all unknown tags', () => {
      const manager = new ConfigurationManager();
      
      expect(manager.getImportanceMultiplier(['unknownTag1', 'unknownTag2'])).toBe(1.0);
    });
  });

  describe('getTreasureExperience', () => {
    it('should return correct experience for each tier', () => {
      const manager = new ConfigurationManager();
      
      expect(manager.getTreasureExperience('early')).toBe(15000);
      expect(manager.getTreasureExperience('mid')).toBe(25000);
      expect(manager.getTreasureExperience('late')).toBe(35000);
      expect(manager.getTreasureExperience('final')).toBe(50000);
    });
  });

  describe('getRealmThresholds', () => {
    it('should return array of 11 thresholds', () => {
      const manager = new ConfigurationManager();
      const thresholds = manager.getRealmThresholds();
      
      expect(thresholds).toHaveLength(11);
      expect(thresholds[0]).toBe(0);
      expect(thresholds[10]).toBe(1_000_000);
    });

    it('should return a copy of the thresholds array', () => {
      const manager = new ConfigurationManager();
      const thresholds1 = manager.getRealmThresholds();
      const thresholds2 = manager.getRealmThresholds();
      
      expect(thresholds1).not.toBe(thresholds2); // Different array instances
      expect(thresholds1).toEqual(thresholds2); // Same values
    });
  });

  describe('getConfig', () => {
    it('should return complete configuration object', () => {
      const manager = new ConfigurationManager();
      const config = manager.getConfig();
      
      expect(config).toHaveProperty('totalExperience');
      expect(config).toHaveProperty('difficultyBaseValues');
      expect(config).toHaveProperty('importanceMultipliers');
      expect(config).toHaveProperty('treasureTierValues');
      expect(config).toHaveProperty('realmThresholds');
      expect(config).toHaveProperty('constraints');
    });

    it('should return a copy of the configuration', () => {
      const manager = new ConfigurationManager();
      const config1 = manager.getConfig();
      const config2 = manager.getConfig();
      
      expect(config1).not.toBe(config2); // Different object instances
      expect(config1).toEqual(config2); // Same values
    });
  });

  describe('getTotalExperience', () => {
    it('should return 1,000,000', () => {
      const manager = new ConfigurationManager();
      
      expect(manager.getTotalExperience()).toBe(1_000_000);
    });
  });

  describe('getConstraints', () => {
    it('should return constraints object', () => {
      const manager = new ConfigurationManager();
      const constraints = manager.getConstraints();
      
      expect(constraints.maxSingleNodePercentage).toBe(0.05);
      expect(constraints.minNodeExperience).toBe(1);
    });
  });

  describe('default value fallback', () => {
    it('should merge partial config with defaults', () => {
      const configPath = path.join(tempDir, 'partial-config.json');
      const partialConfig = {
        totalExperience: 1000000,
        difficultyBaseValues: {
          easy: 6000, // Custom value
          medium: 8000,
          hard: 12000,
        },
        importanceMultipliers: {
          customTag: 1.5, // Custom multiplier
        },
        treasureTierValues: {
          early: 15000,
          mid: 25000,
          late: 35000,
          final: 50000,
        },
        realmThresholds: [0, 50000, 120000, 220000, 350000, 500000, 650000, 780000, 880000, 950000, 1000000],
        constraints: {
          maxSingleNodePercentage: 0.05,
          minNodeExperience: 1,
        },
      };
      fs.writeFileSync(configPath, JSON.stringify(partialConfig, null, 2));

      const manager = new ConfigurationManager();
      const config = manager.loadConfig(configPath);

      // Custom values should be preserved
      expect(config.difficultyBaseValues.easy).toBe(6000);
      expect(config.importanceMultipliers.customTag).toBe(1.5);
      
      // Default multipliers should still be present
      expect(config.importanceMultipliers.highFrequencyInterview).toBe(1.3);
      expect(config.importanceMultipliers.classicAlgorithm).toBe(1.2);
    });
  });

  describe('factory functions', () => {
    it('createDefaultConfigurationManager should create manager with defaults', () => {
      const manager = createDefaultConfigurationManager();
      const config = manager.getConfig();
      
      expect(config.totalExperience).toBe(1_000_000);
      expect(config.difficultyBaseValues.easy).toBe(5000);
    });

    it('createConfigurationManagerFromFile should load from file', () => {
      const configPath = path.join(tempDir, 'factory-test.json');
      const testConfig = createMockConfig();
      testConfig.difficultyBaseValues.easy = 7000;
      fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

      const manager = createConfigurationManagerFromFile(configPath);
      const config = manager.getConfig();
      
      expect(config.difficultyBaseValues.easy).toBe(7000);
    });
  });
});
