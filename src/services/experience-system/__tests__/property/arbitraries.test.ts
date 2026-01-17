/**
 * Property-based tests for arbitraries
 * 
 * These tests verify that our test data generators (arbitraries) produce
 * valid data that meets the system's constraints.
 */

import * as fc from 'fast-check';
import {
  difficultyArbitrary,
  treasureTierArbitrary,
  problemNodeArbitrary,
  treasureNodeArbitrary,
  difficultyBaseValuesArbitrary,
  treasureTierValuesArbitrary,
  realmThresholdsArbitrary,
  configArbitrary,
} from '../arbitraries';
import { TEST_CONFIG } from '../setup';

describe('Arbitraries Property Tests', () => {
  describe('Difficulty Base Values Arbitrary', () => {
    // Feature: experience-value-rebalance, Property: Difficulty ordering in generated configs
    it('should always generate difficulty values in ascending order', () => {
      fc.assert(
        fc.property(difficultyBaseValuesArbitrary(), (values) => {
          expect(values.easy).toBeLessThanOrEqual(values.medium);
          expect(values.medium).toBeLessThanOrEqual(values.hard);
          expect(values.easy).toBeGreaterThan(0);
        }),
        { numRuns: TEST_CONFIG.propertyTests.numRuns }
      );
    });
  });

  describe('Treasure Tier Values Arbitrary', () => {
    // Feature: experience-value-rebalance, Property: Treasure tier ordering in generated configs
    it('should always generate treasure values in ascending order', () => {
      fc.assert(
        fc.property(treasureTierValuesArbitrary(), (values) => {
          expect(values.early).toBeLessThan(values.mid);
          expect(values.mid).toBeLessThan(values.late);
          expect(values.late).toBeLessThan(values.final);
          expect(values.early).toBeGreaterThan(0);
        }),
        { numRuns: TEST_CONFIG.propertyTests.numRuns }
      );
    });
  });

  describe('Realm Thresholds Arbitrary', () => {
    // Feature: experience-value-rebalance, Property: Realm threshold monotonicity in generated configs
    it('should always generate strictly increasing realm thresholds', () => {
      fc.assert(
        fc.property(realmThresholdsArbitrary(), (thresholds) => {
          expect(thresholds).toHaveLength(11);
          expect(thresholds[0]).toBe(0);
          expect(thresholds[10]).toBe(1_000_000);
          
          // Check monotonicity
          for (let i = 1; i < thresholds.length; i++) {
            expect(thresholds[i]).toBeGreaterThan(thresholds[i - 1]);
          }
        }),
        { numRuns: TEST_CONFIG.propertyTests.numRuns }
      );
    });
  });

  describe('Config Arbitrary', () => {
    // Feature: experience-value-rebalance, Property: Generated configs are structurally valid
    it('should always generate valid configuration objects', () => {
      fc.assert(
        fc.property(configArbitrary(), (config) => {
          // Check required fields exist
          expect(config.totalExperience).toBe(1_000_000);
          expect(config.difficultyBaseValues).toBeDefined();
          expect(config.importanceMultipliers).toBeDefined();
          expect(config.treasureTierValues).toBeDefined();
          expect(config.realmThresholds).toBeDefined();
          expect(config.constraints).toBeDefined();
          
          // Check difficulty ordering
          expect(config.difficultyBaseValues.easy).toBeLessThanOrEqual(
            config.difficultyBaseValues.medium
          );
          expect(config.difficultyBaseValues.medium).toBeLessThanOrEqual(
            config.difficultyBaseValues.hard
          );
          
          // Check treasure ordering
          expect(config.treasureTierValues.early).toBeLessThan(
            config.treasureTierValues.mid
          );
          expect(config.treasureTierValues.mid).toBeLessThan(
            config.treasureTierValues.late
          );
          expect(config.treasureTierValues.late).toBeLessThan(
            config.treasureTierValues.final
          );
          
          // Check realm thresholds
          expect(config.realmThresholds).toHaveLength(11);
          expect(config.realmThresholds[0]).toBe(0);
          expect(config.realmThresholds[10]).toBe(1_000_000);
        }),
        { numRuns: TEST_CONFIG.propertyTests.numRuns }
      );
    });
  });

  describe('Node Arbitraries', () => {
    // Feature: experience-value-rebalance, Property: Generated problem nodes are valid
    it('should generate valid problem nodes', () => {
      fc.assert(
        fc.property(problemNodeArbitrary(), (node) => {
          expect(node.type).toBe('problem');
          expect(node.id).toBeTruthy();
          expect(['easy', 'medium', 'hard']).toContain(node.difficulty);
          expect(Array.isArray(node.tags)).toBe(true);
          expect(node.title.length).toBeGreaterThan(0);
        }),
        { numRuns: TEST_CONFIG.propertyTests.numRuns }
      );
    });

    // Feature: experience-value-rebalance, Property: Generated treasure nodes are valid
    it('should generate valid treasure nodes', () => {
      fc.assert(
        fc.property(treasureNodeArbitrary(), (node) => {
          expect(node.type).toBe('treasure');
          expect(node.id).toBeTruthy();
          expect(['early', 'mid', 'late', 'final']).toContain(node.tier);
          expect(node.position).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: TEST_CONFIG.propertyTests.numRuns }
      );
    });
  });
});
