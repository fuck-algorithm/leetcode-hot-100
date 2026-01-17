/**
 * Unit tests for type definitions
 * 
 * These tests verify that the TypeScript types are correctly defined
 * and can be used as expected.
 */

import {
  Difficulty,
  TreasureTier,
  ProblemNode,
  TreasureNode,
  Config,
  ValidationResult,
} from '../../types';

describe('Experience System Types', () => {
  describe('Node Types', () => {
    it('should create a valid ProblemNode', () => {
      const node: ProblemNode = {
        id: 'problem-1',
        type: 'problem',
        difficulty: 'medium',
        tags: ['highFrequencyInterview'],
        title: 'Two Sum',
      };

      expect(node.type).toBe('problem');
      expect(node.difficulty).toBe('medium');
      expect(node.tags).toHaveLength(1);
    });

    it('should create a valid TreasureNode', () => {
      const node: TreasureNode = {
        id: 'treasure-1',
        type: 'treasure',
        tier: 'early',
        position: 10,
      };

      expect(node.type).toBe('treasure');
      expect(node.tier).toBe('early');
      expect(node.position).toBe(10);
    });
  });

  describe('Configuration Type', () => {
    it('should create a valid Config object', () => {
      const config: Config = {
        totalExperience: 1_000_000,
        difficultyBaseValues: {
          easy: 5000,
          medium: 8000,
          hard: 12000,
        },
        importanceMultipliers: {
          highFrequencyInterview: 1.3,
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

      expect(config.totalExperience).toBe(1_000_000);
      expect(config.realmThresholds).toHaveLength(11);
      expect(config.difficultyBaseValues.easy).toBeLessThan(config.difficultyBaseValues.medium);
    });
  });

  describe('ValidationResult Type', () => {
    it('should create a valid ValidationResult for success', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
      };

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should create a valid ValidationResult for failure', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          {
            code: 'TOTAL_MISMATCH',
            message: 'Total experience does not equal 1,000,000',
            severity: 'error',
            details: { expected: 1_000_000, actual: 999_000 },
          },
        ],
        warnings: [],
      };

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TOTAL_MISMATCH');
    });
  });
});
