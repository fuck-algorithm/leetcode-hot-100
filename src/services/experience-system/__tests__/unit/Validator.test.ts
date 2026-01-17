/**
 * Unit tests for Validator
 * 
 * Tests validation methods for experience allocations and system constraints.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

import { Validator } from '../../Validator';
import {
  Node,
  ProblemNode,
  TreasureNode,
  Config,
  ValidationResult,
} from '../../types';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  describe('validateTotalExperience', () => {
    it('should pass when total equals target', () => {
      const allocations = new Map([
        ['node1', 500000],
        ['node2', 300000],
        ['node3', 200000],
      ]);

      const result = validator.validateTotalExperience(allocations, 1_000_000);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when total is less than target', () => {
      const allocations = new Map([
        ['node1', 400000],
        ['node2', 300000],
      ]);

      const result = validator.validateTotalExperience(allocations, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TOTAL_EXPERIENCE_MISMATCH');
      expect(result.errors[0].details.deviation).toBe(-300000);
    });

    it('should fail when total is greater than target', () => {
      const allocations = new Map([
        ['node1', 600000],
        ['node2', 500000],
      ]);

      const result = validator.validateTotalExperience(allocations, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TOTAL_EXPERIENCE_MISMATCH');
      expect(result.errors[0].details.deviation).toBe(100000);
    });

    it('should fail when a node has zero experience', () => {
      const allocations = new Map([
        ['node1', 500000],
        ['node2', 500000],
        ['node3', 0],
      ]);

      const result = validator.validateTotalExperience(allocations, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_EXPERIENCE_VALUE')).toBe(true);
    });

    it('should fail when a node has negative experience', () => {
      const allocations = new Map([
        ['node1', 600000],
        ['node2', 500000],
        ['node3', -100000],
      ]);

      const result = validator.validateTotalExperience(allocations, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_EXPERIENCE_VALUE')).toBe(true);
    });

    it('should handle empty allocations', () => {
      const allocations = new Map<string, number>();

      const result = validator.validateTotalExperience(allocations, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors[0].code).toBe('TOTAL_EXPERIENCE_MISMATCH');
      expect(result.errors[0].details.actual).toBe(0);
    });
  });

  describe('validateDifficultyOrdering', () => {
    it('should pass when difficulty ordering is correct', () => {
      const nodes: Node[] = [
        {
          id: 'easy1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem',
        },
        {
          id: 'medium1',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Medium Problem',
        },
        {
          id: 'hard1',
          type: 'problem',
          difficulty: 'hard',
          tags: [],
          title: 'Hard Problem',
        },
      ];

      const allocations = new Map([
        ['easy1', 5000],
        ['medium1', 8000],
        ['hard1', 12000],
      ]);

      const result = validator.validateDifficultyOrdering(allocations, nodes);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when easy average is greater than medium', () => {
      const nodes: Node[] = [
        {
          id: 'easy1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem',
        },
        {
          id: 'medium1',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Medium Problem',
        },
      ];

      const allocations = new Map([
        ['easy1', 10000],
        ['medium1', 5000],
      ]);

      const result = validator.validateDifficultyOrdering(allocations, nodes);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('DIFFICULTY_ORDERING_VIOLATION');
      expect(result.errors[0].message).toContain('Easy');
      expect(result.errors[0].message).toContain('Medium');
    });

    it('should fail when medium average is greater than hard', () => {
      const nodes: Node[] = [
        {
          id: 'medium1',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Medium Problem',
        },
        {
          id: 'hard1',
          type: 'problem',
          difficulty: 'hard',
          tags: [],
          title: 'Hard Problem',
        },
      ];

      const allocations = new Map([
        ['medium1', 15000],
        ['hard1', 10000],
      ]);

      const result = validator.validateDifficultyOrdering(allocations, nodes);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('DIFFICULTY_ORDERING_VIOLATION');
      expect(result.errors[0].message).toContain('Medium');
      expect(result.errors[0].message).toContain('Hard');
    });

    it('should handle multiple nodes of same difficulty', () => {
      const nodes: Node[] = [
        {
          id: 'easy1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem 1',
        },
        {
          id: 'easy2',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem 2',
        },
        {
          id: 'medium1',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Medium Problem',
        },
      ];

      const allocations = new Map([
        ['easy1', 5000],
        ['easy2', 6000],
        ['medium1', 8000],
      ]);

      const result = validator.validateDifficultyOrdering(allocations, nodes);

      expect(result.valid).toBe(true);
    });

    it('should ignore treasure nodes', () => {
      const nodes: Node[] = [
        {
          id: 'easy1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem',
        },
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
      ];

      const allocations = new Map([
        ['easy1', 5000],
        ['treasure1', 15000],
      ]);

      const result = validator.validateDifficultyOrdering(allocations, nodes);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateTreasureTiers', () => {
    it('should pass when tier ordering is correct', () => {
      const nodes: Node[] = [
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
        {
          id: 'treasure2',
          type: 'treasure',
          tier: 'mid',
          position: 2,
        },
        {
          id: 'treasure3',
          type: 'treasure',
          tier: 'late',
          position: 3,
        },
        {
          id: 'treasure4',
          type: 'treasure',
          tier: 'final',
          position: 4,
        },
      ];

      const allocations = new Map([
        ['treasure1', 15000],
        ['treasure2', 25000],
        ['treasure3', 35000],
        ['treasure4', 50000],
      ]);

      const result = validator.validateTreasureTiers(allocations, nodes);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when early >= mid', () => {
      const nodes: Node[] = [
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
        {
          id: 'treasure2',
          type: 'treasure',
          tier: 'mid',
          position: 2,
        },
      ];

      const allocations = new Map([
        ['treasure1', 30000],
        ['treasure2', 25000],
      ]);

      const result = validator.validateTreasureTiers(allocations, nodes);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TREASURE_TIER_ORDERING_VIOLATION');
      expect(result.errors[0].message).toContain('early');
      expect(result.errors[0].message).toContain('mid');
    });

    it('should fail when mid >= late', () => {
      const nodes: Node[] = [
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'mid',
          position: 1,
        },
        {
          id: 'treasure2',
          type: 'treasure',
          tier: 'late',
          position: 2,
        },
      ];

      const allocations = new Map([
        ['treasure1', 40000],
        ['treasure2', 35000],
      ]);

      const result = validator.validateTreasureTiers(allocations, nodes);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TREASURE_TIER_ORDERING_VIOLATION');
    });

    it('should fail when late >= final', () => {
      const nodes: Node[] = [
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'late',
          position: 1,
        },
        {
          id: 'treasure2',
          type: 'treasure',
          tier: 'final',
          position: 2,
        },
      ];

      const allocations = new Map([
        ['treasure1', 55000],
        ['treasure2', 50000],
      ]);

      const result = validator.validateTreasureTiers(allocations, nodes);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('TREASURE_TIER_ORDERING_VIOLATION');
    });

    it('should warn when same tier has inconsistent values', () => {
      const nodes: Node[] = [
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
        {
          id: 'treasure2',
          type: 'treasure',
          tier: 'early',
          position: 2,
        },
      ];

      const allocations = new Map([
        ['treasure1', 15000],
        ['treasure2', 16000],
      ]);

      const result = validator.validateTreasureTiers(allocations, nodes);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].code).toBe('TREASURE_TIER_INCONSISTENCY');
    });

    it('should ignore problem nodes', () => {
      const nodes: Node[] = [
        {
          id: 'problem1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem',
        },
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
      ];

      const allocations = new Map([
        ['problem1', 5000],
        ['treasure1', 15000],
      ]);

      const result = validator.validateTreasureTiers(allocations, nodes);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateRealmThresholds', () => {
    it('should pass with valid thresholds', () => {
      const thresholds = [
        0, 50000, 120000, 220000, 350000, 500000,
        650000, 780000, 880000, 950000, 1000000,
      ];

      const result = validator.validateRealmThresholds(thresholds, 1_000_000);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when count is not 11', () => {
      const thresholds = [0, 500000, 1000000];

      const result = validator.validateRealmThresholds(thresholds, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('REALM_THRESHOLD_COUNT');
    });

    it('should fail when first threshold is not 0', () => {
      const thresholds = [
        100, 50000, 120000, 220000, 350000, 500000,
        650000, 780000, 880000, 950000, 1000000,
      ];

      const result = validator.validateRealmThresholds(thresholds, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_START')).toBe(true);
    });

    it('should fail when last threshold does not equal total', () => {
      const thresholds = [
        0, 50000, 120000, 220000, 350000, 500000,
        650000, 780000, 880000, 950000, 999999,
      ];

      const result = validator.validateRealmThresholds(thresholds, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_END')).toBe(true);
    });

    it('should fail when thresholds are not strictly increasing', () => {
      const thresholds = [
        0, 50000, 120000, 120000, 350000, 500000,
        650000, 780000, 880000, 950000, 1000000,
      ];

      const result = validator.validateRealmThresholds(thresholds, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_MONOTONICITY')).toBe(true);
    });

    it('should fail when thresholds decrease', () => {
      const thresholds = [
        0, 50000, 120000, 220000, 350000, 500000,
        650000, 780000, 880000, 900000, 850000,
      ];

      const result = validator.validateRealmThresholds(thresholds, 1_000_000);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'REALM_THRESHOLD_MONOTONICITY')).toBe(true);
    });
  });

  describe('validateAll', () => {
    const createValidConfig = (): Config => ({
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
      realmThresholds: [
        0, 50000, 120000, 220000, 350000, 500000,
        650000, 780000, 880000, 950000, 1000000,
      ],
      constraints: {
        maxSingleNodePercentage: 0.05,
        minNodeExperience: 1,
      },
    });

    it('should pass with valid allocations and config', () => {
      const nodes: Node[] = [
        {
          id: 'easy1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem',
        },
        {
          id: 'medium1',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Medium Problem',
        },
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
      ];

      const allocations = new Map([
        ['easy1', 400000],
        ['medium1', 450000],
        ['treasure1', 150000],
      ]);

      const config = createValidConfig();
      const result = validator.validateAll(allocations, nodes, config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect multiple violations', () => {
      const nodes: Node[] = [
        {
          id: 'easy1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem',
        },
        {
          id: 'medium1',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Medium Problem',
        },
      ];

      const allocations = new Map([
        ['easy1', 600000],  // Exceeds max percentage
        ['medium1', 300000], // Total is wrong (900000)
      ]);

      const config = createValidConfig();
      const result = validator.validateAll(allocations, nodes, config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors.some(e => e.code === 'TOTAL_EXPERIENCE_MISMATCH')).toBe(true);
      expect(result.errors.some(e => e.code === 'MAX_PERCENTAGE_VIOLATION')).toBe(true);
    });

    it('should detect max percentage violations', () => {
      const nodes: Node[] = [
        {
          id: 'node1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Problem',
        },
        {
          id: 'node2',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Problem 2',
        },
      ];

      const allocations = new Map([
        ['node1', 60000],  // 6% > 5% max
        ['node2', 940000],
      ]);

      const config = createValidConfig();
      const result = validator.validateAll(allocations, nodes, config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MAX_PERCENTAGE_VIOLATION')).toBe(true);
    });

    it('should detect min experience violations', () => {
      const nodes: Node[] = [
        {
          id: 'node1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Problem',
        },
        {
          id: 'node2',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Problem 2',
        },
      ];

      const allocations = new Map([
        ['node1', 0],  // Below minimum
        ['node2', 1000000],
      ]);

      const config = createValidConfig();
      const result = validator.validateAll(allocations, nodes, config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MIN_EXPERIENCE_VIOLATION')).toBe(true);
    });

    it('should include warnings in result', () => {
      const nodes: Node[] = [
        {
          id: 'treasure1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
        {
          id: 'treasure2',
          type: 'treasure',
          tier: 'early',
          position: 2,
        },
      ];

      const allocations = new Map([
        ['treasure1', 500000],
        ['treasure2', 500001],  // Inconsistent with same tier
      ]);

      const config = createValidConfig();
      const result = validator.validateAll(allocations, nodes, config);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.code === 'TREASURE_TIER_INCONSISTENCY')).toBe(true);
    });
  });
});
