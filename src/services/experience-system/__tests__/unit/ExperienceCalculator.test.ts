/**
 * Unit tests for ExperienceCalculator
 * 
 * Tests specific difficulty and tag combinations, normalization with known inputs,
 * and explanation output format.
 * 
 * Requirements: 2.4, 3.4, 6.1, 6.4
 */

import { ExperienceCalculator } from '../../ExperienceCalculator';
import { ConfigurationManager } from '../../ConfigurationManager';
import { NodeRegistry } from '../../NodeRegistry';
import {
  Config,
  Node,
  ProblemNode,
  TreasureNode,
  Difficulty,
  TreasureTier,
} from '../../types';

describe('ExperienceCalculator', () => {
  let calculator: ExperienceCalculator;
  let configManager: ConfigurationManager;
  let nodeRegistry: NodeRegistry;
  let testConfig: Config;

  beforeEach(() => {
    // Create a test configuration
    testConfig = {
      totalExperience: 1000000,
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
        0, 50000, 120000, 220000, 350000, 500000,
        650000, 780000, 880000, 950000, 1000000,
      ],
      constraints: {
        maxSingleNodePercentage: 0.05,
        minNodeExperience: 1,
      },
    };

    configManager = new ConfigurationManager(testConfig);
    nodeRegistry = new NodeRegistry();
    calculator = new ExperienceCalculator(configManager, nodeRegistry);
  });

  describe('calculateProblemExperience', () => {
    it('should calculate base experience for easy problem with no tags', () => {
      const experience = calculator.calculateProblemExperience('easy', []);
      expect(experience).toBe(5000);
    });

    it('should calculate base experience for medium problem with no tags', () => {
      const experience = calculator.calculateProblemExperience('medium', []);
      expect(experience).toBe(8000);
    });

    it('should calculate base experience for hard problem with no tags', () => {
      const experience = calculator.calculateProblemExperience('hard', []);
      expect(experience).toBe(12000);
    });

    it('should apply single importance multiplier', () => {
      const experience = calculator.calculateProblemExperience('easy', [
        'highFrequencyInterview',
      ]);
      // 5000 * 1.3 = 6500
      expect(experience).toBe(6500);
    });

    it('should apply multiple importance multipliers', () => {
      const experience = calculator.calculateProblemExperience('medium', [
        'highFrequencyInterview',
        'hasAnimation',
      ]);
      // 8000 * 1.3 * 1.15 = 11960
      expect(experience).toBe(11960);
    });

    it('should apply all importance multipliers', () => {
      const experience = calculator.calculateProblemExperience('hard', [
        'highFrequencyInterview',
        'classicAlgorithm',
        'hasAnimation',
      ]);
      // 12000 * 1.3 * 1.2 * 1.15 = 21528
      expect(experience).toBe(21528);
    });

    it('should ignore unknown tags', () => {
      const experience = calculator.calculateProblemExperience('easy', [
        'unknownTag',
        'anotherUnknownTag',
      ]);
      // Should be same as base (no multipliers applied)
      expect(experience).toBe(5000);
    });

    it('should handle mix of known and unknown tags', () => {
      const experience = calculator.calculateProblemExperience('medium', [
        'highFrequencyInterview',
        'unknownTag',
      ]);
      // 8000 * 1.3 = 10400 (unknown tag ignored)
      expect(experience).toBe(10400);
    });

    it('should round to nearest integer', () => {
      // Create config with multiplier that produces decimal
      const decimalConfig: Config = {
        ...testConfig,
        importanceMultipliers: {
          testTag: 1.333,
        },
      };
      const decimalConfigManager = new ConfigurationManager(decimalConfig);
      const decimalCalculator = new ExperienceCalculator(
        decimalConfigManager,
        nodeRegistry
      );

      const experience = decimalCalculator.calculateProblemExperience('easy', [
        'testTag',
      ]);
      // 5000 * 1.333 = 6665
      expect(experience).toBe(6665);
    });
  });

  describe('calculateTreasureExperience', () => {
    it('should return correct experience for early treasure', () => {
      const experience = calculator.calculateTreasureExperience('early');
      expect(experience).toBe(15000);
    });

    it('should return correct experience for mid treasure', () => {
      const experience = calculator.calculateTreasureExperience('mid');
      expect(experience).toBe(25000);
    });

    it('should return correct experience for late treasure', () => {
      const experience = calculator.calculateTreasureExperience('late');
      expect(experience).toBe(35000);
    });

    it('should return correct experience for final treasure', () => {
      const experience = calculator.calculateTreasureExperience('final');
      expect(experience).toBe(50000);
    });
  });

  describe('calculateAllExperience', () => {
    it('should return empty map for empty node array', () => {
      const result = calculator.calculateAllExperience([]);
      expect(result.size).toBe(0);
    });

    it('should calculate experience for single problem node', () => {
      const nodes: Node[] = [
        {
          id: '1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Test Problem',
        },
      ];

      const result = calculator.calculateAllExperience(nodes);
      expect(result.size).toBe(1);
      expect(result.get('1')).toBe(1000000); // Normalized to total
    });

    it('should calculate experience for single treasure node', () => {
      const nodes: Node[] = [
        {
          id: 't1',
          type: 'treasure',
          tier: 'early',
          position: 1,
        },
      ];

      const result = calculator.calculateAllExperience(nodes);
      expect(result.size).toBe(1);
      expect(result.get('t1')).toBe(1000000); // Normalized to total
    });

    it('should normalize multiple nodes to sum to 1,000,000', () => {
      const nodes: Node[] = [
        {
          id: '1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy Problem',
        },
        {
          id: '2',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Medium Problem',
        },
        {
          id: '3',
          type: 'problem',
          difficulty: 'hard',
          tags: [],
          title: 'Hard Problem',
        },
      ];

      const result = calculator.calculateAllExperience(nodes);
      
      // Calculate total
      const total = Array.from(result.values()).reduce(
        (sum, exp) => sum + exp,
        0
      );
      
      expect(total).toBe(1000000);
      expect(result.size).toBe(3);
    });

    it('should maintain proportions during normalization', () => {
      const nodes: Node[] = [
        {
          id: '1',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Easy',
        },
        {
          id: '2',
          type: 'problem',
          difficulty: 'hard',
          tags: [],
          title: 'Hard',
        },
      ];

      const result = calculator.calculateAllExperience(nodes);
      
      const exp1 = result.get('1')!;
      const exp2 = result.get('2')!;
      
      // Hard should be roughly 2.4x easy (12000 / 5000)
      const ratio = exp2 / exp1;
      expect(ratio).toBeCloseTo(2.4, 1);
    });

    it('should handle nodes with importance multipliers', () => {
      const nodes: Node[] = [
        {
          id: '1',
          type: 'problem',
          difficulty: 'easy',
          tags: ['highFrequencyInterview'],
          title: 'Important Easy',
        },
        {
          id: '2',
          type: 'problem',
          difficulty: 'easy',
          tags: [],
          title: 'Normal Easy',
        },
      ];

      const result = calculator.calculateAllExperience(nodes);
      
      const exp1 = result.get('1')!;
      const exp2 = result.get('2')!;
      
      // Important problem should have more experience
      expect(exp1).toBeGreaterThan(exp2);
      
      // Ratio should be close to 1.3
      const ratio = exp1 / exp2;
      expect(ratio).toBeCloseTo(1.3, 1);
    });

    it('should handle mix of problems and treasures', () => {
      const nodes: Node[] = [
        {
          id: '1',
          type: 'problem',
          difficulty: 'medium',
          tags: [],
          title: 'Problem',
        },
        {
          id: 't1',
          type: 'treasure',
          tier: 'mid',
          position: 1,
        },
      ];

      const result = calculator.calculateAllExperience(nodes);
      
      const total = Array.from(result.values()).reduce(
        (sum, exp) => sum + exp,
        0
      );
      
      expect(total).toBe(1000000);
      expect(result.size).toBe(2);
    });

    it('should handle large number of nodes', () => {
      // Create 100 nodes
      const nodes: Node[] = [];
      for (let i = 0; i < 100; i++) {
        nodes.push({
          id: `${i}`,
          type: 'problem',
          difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
          tags: [],
          title: `Problem ${i}`,
        });
      }

      const result = calculator.calculateAllExperience(nodes);
      
      const total = Array.from(result.values()).reduce(
        (sum, exp) => sum + exp,
        0
      );
      
      expect(total).toBe(1000000);
      expect(result.size).toBe(100);
    });
  });

  describe('explainCalculation', () => {
    beforeEach(() => {
      // Add test nodes to registry
      nodeRegistry.addNode({
        id: '1',
        type: 'problem',
        difficulty: 'easy',
        tags: [],
        title: 'Simple Problem',
      });
      
      nodeRegistry.addNode({
        id: '2',
        type: 'problem',
        difficulty: 'medium',
        tags: ['highFrequencyInterview', 'hasAnimation'],
        title: 'Important Problem',
      });
      
      nodeRegistry.addNode({
        id: 't1',
        type: 'treasure',
        tier: 'early',
        position: 1,
      });
    });

    it('should explain calculation for problem with no tags', () => {
      const explanation = calculator.explainCalculation('1');
      
      expect(explanation.nodeId).toBe('1');
      expect(explanation.baseExperience).toBe(5000);
      expect(explanation.finalExperience).toBe(5000);
      expect(explanation.steps.length).toBeGreaterThan(0);
      expect(explanation.steps.join(' ')).toContain('5000');
      expect(explanation.multipliers).toEqual({});
    });

    it('should explain calculation for problem with tags', () => {
      const explanation = calculator.explainCalculation('2');
      
      expect(explanation.nodeId).toBe('2');
      expect(explanation.baseExperience).toBe(8000);
      expect(explanation.steps.length).toBeGreaterThan(0);
      expect(explanation.steps.join(' ')).toContain('highFrequencyInterview');
      expect(explanation.steps.join(' ')).toContain('hasAnimation');
      expect(explanation.multipliers).toHaveProperty('highFrequencyInterview');
      expect(explanation.multipliers).toHaveProperty('hasAnimation');
    });

    it('should explain calculation for treasure', () => {
      const explanation = calculator.explainCalculation('t1');
      
      expect(explanation.nodeId).toBe('t1');
      expect(explanation.baseExperience).toBe(15000);
      expect(explanation.finalExperience).toBe(15000);
      expect(explanation.steps.length).toBeGreaterThan(0);
      expect(explanation.steps.join(' ')).toContain('early');
    });

    it('should handle non-existent node', () => {
      const explanation = calculator.explainCalculation('nonexistent');
      
      expect(explanation.nodeId).toBe('nonexistent');
      expect(explanation.baseExperience).toBe(0);
      expect(explanation.finalExperience).toBe(0);
      expect(explanation.steps.length).toBeGreaterThan(0);
      expect(explanation.steps[0]).toContain('not found');
    });

    it('should include normalization note', () => {
      const explanation = calculator.explainCalculation('1');
      
      const hasNormalizationNote = explanation.steps.some(
        (step) => step.toLowerCase().includes('normalization')
      );
      expect(hasNormalizationNote).toBe(true);
    });

    it('should include all calculation steps', () => {
      const explanation = calculator.explainCalculation('2');
      
      // Should have base experience step
      const hasBaseStep = explanation.steps.some(
        (step) => step.includes('Base experience')
      );
      expect(hasBaseStep).toBe(true);
      
      // Should have multiplier steps
      const hasMultiplierStep = explanation.steps.some(
        (step) => step.includes('multiplier')
      );
      expect(hasMultiplierStep).toBe(true);
      
      // Should have final calculation step
      const hasFinalStep = explanation.steps.some(
        (step) => step.includes('Final experience')
      );
      expect(hasFinalStep).toBe(true);
    });
  });
});
