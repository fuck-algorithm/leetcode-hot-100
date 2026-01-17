/**
 * Fast-check arbitraries (generators) for property-based testing
 * 
 * This module provides generators for creating random but valid test data
 * for the experience system components.
 */

import * as fc from 'fast-check';
import {
  Difficulty,
  TreasureTier,
  ProblemNode,
  TreasureNode,
  Node,
  Config,
  DifficultyBaseValues,
  ImportanceMultipliers,
  TreasureTierValues,
  Constraints,
} from '../types';

// ============================================================================
// Basic Type Arbitraries
// ============================================================================

/**
 * Generate random difficulty levels
 */
export const difficultyArbitrary = (): fc.Arbitrary<Difficulty> =>
  fc.constantFrom<Difficulty>('easy', 'medium', 'hard');

/**
 * Generate random treasure tiers
 */
export const treasureTierArbitrary = (): fc.Arbitrary<TreasureTier> =>
  fc.constantFrom<TreasureTier>('early', 'mid', 'late', 'final');

/**
 * Generate random importance tags
 */
export const importanceTagsArbitrary = (): fc.Arbitrary<string[]> =>
  fc.subarray(
    ['highFrequencyInterview', 'classicAlgorithm', 'hasAnimation'],
    { minLength: 0, maxLength: 3 }
  );

// ============================================================================
// Node Arbitraries
// ============================================================================

/**
 * Generate random problem nodes
 */
export const problemNodeArbitrary = (): fc.Arbitrary<ProblemNode> =>
  fc.record({
    id: fc.uuid(),
    type: fc.constant('problem' as const),
    difficulty: difficultyArbitrary(),
    tags: importanceTagsArbitrary(),
    title: fc.string({ minLength: 5, maxLength: 50 }),
  });

/**
 * Generate random treasure nodes
 */
export const treasureNodeArbitrary = (): fc.Arbitrary<TreasureNode> =>
  fc.record({
    id: fc.uuid(),
    type: fc.constant('treasure' as const),
    tier: treasureTierArbitrary(),
    position: fc.integer({ min: 0, max: 200 }),
  });

/**
 * Generate random nodes (problems or treasures)
 */
export const nodeArbitrary = (): fc.Arbitrary<Node> =>
  fc.oneof(problemNodeArbitrary(), treasureNodeArbitrary());

/**
 * Generate arrays of random nodes
 * 
 * @param minLength Minimum number of nodes
 * @param maxLength Maximum number of nodes
 */
export const nodeArrayArbitrary = (
  minLength: number = 10,
  maxLength: number = 150
): fc.Arbitrary<Node[]> =>
  fc.array(nodeArbitrary(), { minLength, maxLength });

/**
 * Generate a realistic node set with both problems and treasures
 */
export const nodeSetArbitrary = (): fc.Arbitrary<Node[]> =>
  fc.tuple(
    fc.array(problemNodeArbitrary(), { minLength: 50, maxLength: 100 }),
    fc.array(treasureNodeArbitrary(), { minLength: 5, maxLength: 15 })
  ).map(([problems, treasures]) => [...problems, ...treasures]);

// ============================================================================
// Configuration Arbitraries
// ============================================================================

/**
 * Generate random difficulty base values
 * Ensures proper ordering: easy <= medium <= hard
 */
export const difficultyBaseValuesArbitrary = (): fc.Arbitrary<DifficultyBaseValues> =>
  fc
    .tuple(
      fc.integer({ min: 1000, max: 10000 }),  // easy
      fc.integer({ min: 0, max: 5000 }),      // medium bonus
      fc.integer({ min: 0, max: 5000 })       // hard bonus
    )
    .map(([easy, mediumBonus, hardBonus]) => ({
      easy,
      medium: easy + mediumBonus,
      hard: easy + mediumBonus + hardBonus,
    }));

/**
 * Generate random importance multipliers
 */
export const importanceMultipliersArbitrary = (): fc.Arbitrary<ImportanceMultipliers> =>
  fc.record({
    highFrequencyInterview: fc.double({ min: 1.0, max: 2.0 }),
    classicAlgorithm: fc.double({ min: 1.0, max: 2.0 }),
    hasAnimation: fc.double({ min: 1.0, max: 1.5 }),
  });

/**
 * Generate random treasure tier values
 * Ensures proper ordering: early < mid < late < final
 */
export const treasureTierValuesArbitrary = (): fc.Arbitrary<TreasureTierValues> =>
  fc
    .tuple(
      fc.integer({ min: 5000, max: 20000 }),   // early
      fc.integer({ min: 5000, max: 15000 }),   // mid bonus
      fc.integer({ min: 5000, max: 15000 }),   // late bonus
      fc.integer({ min: 10000, max: 20000 })   // final bonus
    )
    .map(([early, midBonus, lateBonus, finalBonus]) => ({
      early,
      mid: early + midBonus,
      late: early + midBonus + lateBonus,
      final: early + midBonus + lateBonus + finalBonus,
    }));

/**
 * Generate random realm thresholds
 * Ensures proper ordering and bounds
 */
export const realmThresholdsArbitrary = (): fc.Arbitrary<number[]> => {
  return fc
    .array(fc.integer({ min: 1, max: 100000 }), { minLength: 9, maxLength: 9 })
    .map((increments) => {
      const thresholds = [0];
      let current = 0;
      
      for (const increment of increments) {
        current += increment;
        thresholds.push(current);
      }
      
      thresholds.push(1_000_000);
      return thresholds;
    });
};

/**
 * Generate random constraints
 */
export const constraintsArbitrary = (): fc.Arbitrary<Constraints> =>
  fc.record({
    maxSingleNodePercentage: fc.double({ min: 0.01, max: 0.1 }),
    minNodeExperience: fc.integer({ min: 1, max: 100 }),
  });

/**
 * Generate random valid configurations
 */
export const configArbitrary = (): fc.Arbitrary<Config> =>
  fc.record({
    totalExperience: fc.constant(1_000_000),
    difficultyBaseValues: difficultyBaseValuesArbitrary(),
    importanceMultipliers: importanceMultipliersArbitrary(),
    treasureTierValues: treasureTierValuesArbitrary(),
    realmThresholds: realmThresholdsArbitrary(),
    constraints: constraintsArbitrary(),
  });

// ============================================================================
// Experience Value Arbitraries
// ============================================================================

/**
 * Generate random experience values
 */
export const experienceValueArbitrary = (
  min: number = 0,
  max: number = 1_000_000
): fc.Arbitrary<number> =>
  fc.integer({ min, max });

/**
 * Generate a map of node IDs to experience values
 */
export const experienceAllocationArbitrary = (
  nodes: Node[]
): fc.Arbitrary<Map<string, number>> =>
  fc
    .array(
      fc.integer({ min: 100, max: 50000 }),
      { minLength: nodes.length, maxLength: nodes.length }
    )
    .map((values) => {
      const map = new Map<string, number>();
      nodes.forEach((node, index) => {
        map.set(node.id, values[index]);
      });
      return map;
    });

// ============================================================================
// User Data Arbitraries
// ============================================================================

/**
 * Generate random user IDs
 */
export const userIdArbitrary = (): fc.Arbitrary<string> =>
  fc.uuid();

/**
 * Generate random old experience values for migration testing
 */
export const oldExperienceArbitrary = (): fc.Arbitrary<{
  oldExperience: number;
  oldMaxExperience: number;
}> =>
  fc
    .tuple(
      fc.integer({ min: 100000, max: 10000000 }),  // old max
      fc.double({ min: 0, max: 1 })                 // progress percentage
    )
    .map(([oldMax, progress]) => ({
      oldMaxExperience: oldMax,
      oldExperience: Math.floor(oldMax * progress),
    }));
