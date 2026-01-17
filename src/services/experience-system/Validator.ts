/**
 * Validator
 * 
 * Verifies that experience allocations meet all system constraints.
 * Provides comprehensive validation checks for total experience, difficulty ordering,
 * treasure tier ordering, realm thresholds, and other system invariants.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

import {
  Node,
  ProblemNode,
  TreasureNode,
  Config,
  ValidationResult,
  ValidationError,
  Difficulty,
  TreasureTier,
} from './types';

/**
 * Validator class
 * 
 * Performs validation checks on experience allocations and system configuration
 * to ensure mathematical correctness and constraint satisfaction.
 */
export class Validator {
  /**
   * Validates that the total experience sum equals exactly 1,000,000
   * 
   * Checks that the sum of all node experience values matches the target total.
   * Reports the exact deviation if the sum is incorrect.
   * 
   * @param allocations - Map of node ID to experience value
   * @param targetTotal - Expected total experience (default: 1,000,000)
   * @returns ValidationResult indicating whether the total is correct
   * 
   * Requirements: 7.1, 7.2
   */
  validateTotalExperience(
    allocations: Map<string, number>,
    targetTotal: number = 1_000_000
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Calculate the sum of all experience values
    const actualTotal = Array.from(allocations.values()).reduce(
      (sum, exp) => sum + exp,
      0
    );

    // Check if total matches target
    if (actualTotal !== targetTotal) {
      const deviation = actualTotal - targetTotal;
      errors.push({
        code: 'TOTAL_EXPERIENCE_MISMATCH',
        message: `Total experience is ${actualTotal}, expected ${targetTotal}. Deviation: ${deviation > 0 ? '+' : ''}${deviation}`,
        severity: 'error',
        details: {
          actual: actualTotal,
          expected: targetTotal,
          deviation,
          nodeCount: allocations.size,
        },
      });
    }

    // Check for negative or zero experience values
    for (const [nodeId, experience] of Array.from(allocations.entries())) {
      if (experience <= 0) {
        errors.push({
          code: 'INVALID_EXPERIENCE_VALUE',
          message: `Node ${nodeId} has invalid experience value: ${experience}`,
          severity: 'error',
          details: {
            nodeId,
            experience,
          },
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
   * Validates that difficulty ordering is correct (Easy ≤ Medium ≤ Hard)
   * 
   * Compares average experience values for each difficulty level.
   * Problems with the same difficulty and no importance tags should have equal base experience.
   * 
   * @param allocations - Map of node ID to experience value
   * @param nodes - Array of all nodes
   * @returns ValidationResult indicating whether difficulty ordering is correct
   * 
   * Requirements: 7.4
   */
  validateDifficultyOrdering(
    allocations: Map<string, number>,
    nodes: Node[]
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Group problem nodes by difficulty
    const problemNodes = nodes.filter(
      (node): node is ProblemNode => node.type === 'problem'
    );

    const byDifficulty: Record<Difficulty, number[]> = {
      easy: [],
      medium: [],
      hard: [],
    };

    for (const node of problemNodes) {
      const experience = allocations.get(node.id);
      if (experience !== undefined) {
        byDifficulty[node.difficulty].push(experience);
      }
    }

    // Calculate average experience for each difficulty
    const averages: Record<Difficulty, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    for (const difficulty of ['easy', 'medium', 'hard'] as Difficulty[]) {
      const values = byDifficulty[difficulty];
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        averages[difficulty] = sum / values.length;
      }
    }

    // Check ordering: Easy ≤ Medium ≤ Hard
    if (averages.easy > averages.medium && byDifficulty.medium.length > 0) {
      errors.push({
        code: 'DIFFICULTY_ORDERING_VIOLATION',
        message: `Average Easy experience (${averages.easy.toFixed(2)}) is greater than Medium (${averages.medium.toFixed(2)})`,
        severity: 'error',
        details: {
          easyAverage: averages.easy,
          mediumAverage: averages.medium,
          easyCount: byDifficulty.easy.length,
          mediumCount: byDifficulty.medium.length,
        },
      });
    }

    if (averages.medium > averages.hard && byDifficulty.hard.length > 0) {
      errors.push({
        code: 'DIFFICULTY_ORDERING_VIOLATION',
        message: `Average Medium experience (${averages.medium.toFixed(2)}) is greater than Hard (${averages.hard.toFixed(2)})`,
        severity: 'error',
        details: {
          mediumAverage: averages.medium,
          hardAverage: averages.hard,
          mediumCount: byDifficulty.medium.length,
          hardCount: byDifficulty.hard.length,
        },
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates that treasure tier ordering is correct (Early < Mid < Late < Final)
   * 
   * Checks that each tier has strictly greater experience than the previous tier.
   * All treasures of the same tier should have equal experience values.
   * 
   * @param allocations - Map of node ID to experience value
   * @param nodes - Array of all nodes
   * @returns ValidationResult indicating whether treasure tier ordering is correct
   * 
   * Requirements: 7.5
   */
  validateTreasureTiers(
    allocations: Map<string, number>,
    nodes: Node[]
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Group treasure nodes by tier
    const treasureNodes = nodes.filter(
      (node): node is TreasureNode => node.type === 'treasure'
    );

    const byTier: Record<TreasureTier, number[]> = {
      early: [],
      mid: [],
      late: [],
      final: [],
    };

    for (const node of treasureNodes) {
      const experience = allocations.get(node.id);
      if (experience !== undefined) {
        byTier[node.tier].push(experience);
      }
    }

    // Check consistency within each tier (all should be equal)
    for (const tier of ['early', 'mid', 'late', 'final'] as TreasureTier[]) {
      const values = byTier[tier];
      if (values.length > 1) {
        const first = values[0];
        const allEqual = values.every(v => v === first);
        if (!allEqual) {
          warnings.push({
            code: 'TREASURE_TIER_INCONSISTENCY',
            message: `Treasure tier "${tier}" has inconsistent values: ${values.join(', ')}`,
            severity: 'warning',
            details: {
              tier,
              values,
            },
          });
        }
      }
    }

    // Get representative value for each tier (use first value or 0 if empty)
    const tierValues: Record<TreasureTier, number> = {
      early: byTier.early[0] || 0,
      mid: byTier.mid[0] || 0,
      late: byTier.late[0] || 0,
      final: byTier.final[0] || 0,
    };

    // Check ordering: Early < Mid < Late < Final
    const tierOrder: TreasureTier[] = ['early', 'mid', 'late', 'final'];
    
    for (let i = 0; i < tierOrder.length - 1; i++) {
      const currentTier = tierOrder[i];
      const nextTier = tierOrder[i + 1];
      
      const currentValue = tierValues[currentTier];
      const nextValue = tierValues[nextTier];
      
      // Only check if both tiers have values
      if (currentValue > 0 && nextValue > 0) {
        if (currentValue >= nextValue) {
          errors.push({
            code: 'TREASURE_TIER_ORDERING_VIOLATION',
            message: `Treasure tier "${currentTier}" (${currentValue}) is not less than "${nextTier}" (${nextValue})`,
            severity: 'error',
            details: {
              currentTier,
              currentValue,
              nextTier,
              nextValue,
            },
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates that realm thresholds are strictly monotonically increasing
   * 
   * Checks that:
   * - There are exactly 11 thresholds
   * - First threshold is 0
   * - Last threshold equals total experience
   * - Each threshold is strictly greater than the previous one
   * 
   * @param thresholds - Array of realm thresholds
   * @param totalExperience - Total experience value (default: 1,000,000)
   * @returns ValidationResult indicating whether realm thresholds are valid
   * 
   * Requirements: 7.6
   */
  validateRealmThresholds(
    thresholds: number[],
    totalExperience: number = 1_000_000
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check count
    if (thresholds.length !== 11) {
      errors.push({
        code: 'REALM_THRESHOLD_COUNT',
        message: `Expected 11 realm thresholds, got ${thresholds.length}`,
        severity: 'error',
        details: {
          expected: 11,
          actual: thresholds.length,
        },
      });
      // Return early if count is wrong - other checks may not make sense
      return {
        valid: false,
        errors,
        warnings,
      };
    }

    // Check first threshold is 0
    if (thresholds[0] !== 0) {
      errors.push({
        code: 'REALM_THRESHOLD_START',
        message: `First realm threshold must be 0, got ${thresholds[0]}`,
        severity: 'error',
        details: {
          expected: 0,
          actual: thresholds[0],
        },
      });
    }

    // Check last threshold equals total experience
    if (thresholds[thresholds.length - 1] !== totalExperience) {
      errors.push({
        code: 'REALM_THRESHOLD_END',
        message: `Last realm threshold must equal totalExperience (${totalExperience}), got ${thresholds[thresholds.length - 1]}`,
        severity: 'error',
        details: {
          expected: totalExperience,
          actual: thresholds[thresholds.length - 1],
        },
      });
    }

    // Check monotonicity (strictly increasing)
    for (let i = 1; i < thresholds.length; i++) {
      if (thresholds[i] <= thresholds[i - 1]) {
        errors.push({
          code: 'REALM_THRESHOLD_MONOTONICITY',
          message: `Realm threshold at index ${i} (${thresholds[i]}) is not greater than previous threshold (${thresholds[i - 1]})`,
          severity: 'error',
          details: {
            index: i,
            current: thresholds[i],
            previous: thresholds[i - 1],
          },
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
   * Performs comprehensive validation of all system constraints
   * 
   * Runs all validation checks:
   * - Total experience sum
   * - Non-negative values
   * - Difficulty ordering
   * - Treasure tier ordering
   * - Realm thresholds
   * - Maximum percentage constraint
   * 
   * @param allocations - Map of node ID to experience value
   * @param nodes - Array of all nodes
   * @param config - System configuration
   * @returns ValidationResult with all errors and warnings
   * 
   * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
   */
  validateAll(
    allocations: Map<string, number>,
    nodes: Node[],
    config: Config
  ): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    // 1. Validate total experience
    const totalResult = this.validateTotalExperience(
      allocations,
      config.totalExperience
    );
    allErrors.push(...totalResult.errors);
    allWarnings.push(...totalResult.warnings);

    // 2. Validate difficulty ordering
    const difficultyResult = this.validateDifficultyOrdering(
      allocations,
      nodes
    );
    allErrors.push(...difficultyResult.errors);
    allWarnings.push(...difficultyResult.warnings);

    // 3. Validate treasure tiers
    const treasureResult = this.validateTreasureTiers(
      allocations,
      nodes
    );
    allErrors.push(...treasureResult.errors);
    allWarnings.push(...treasureResult.warnings);

    // 4. Validate realm thresholds
    const realmResult = this.validateRealmThresholds(
      config.realmThresholds,
      config.totalExperience
    );
    allErrors.push(...realmResult.errors);
    allWarnings.push(...realmResult.warnings);

    // 5. Validate maximum percentage constraint
    const maxPercentage = config.constraints.maxSingleNodePercentage;
    const maxAllowed = config.totalExperience * maxPercentage;

    for (const [nodeId, experience] of Array.from(allocations.entries())) {
      if (experience > maxAllowed) {
        const percentage = (experience / config.totalExperience) * 100;
        allErrors.push({
          code: 'MAX_PERCENTAGE_VIOLATION',
          message: `Node ${nodeId} exceeds maximum percentage: ${experience} (${percentage.toFixed(2)}%) > ${maxAllowed} (${maxPercentage * 100}%)`,
          severity: 'error',
          details: {
            nodeId,
            experience,
            percentage,
            maxAllowed,
            maxPercentage,
          },
        });
      }
    }

    // 6. Validate minimum experience constraint
    const minExperience = config.constraints.minNodeExperience;

    for (const [nodeId, experience] of Array.from(allocations.entries())) {
      if (experience < minExperience) {
        allErrors.push({
          code: 'MIN_EXPERIENCE_VIOLATION',
          message: `Node ${nodeId} has experience below minimum: ${experience} < ${minExperience}`,
          severity: 'error',
          details: {
            nodeId,
            experience,
            minExperience,
          },
        });
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}

/**
 * Creates a new Validator instance
 * 
 * @returns A new Validator instance
 */
export function createValidator(): Validator {
  return new Validator();
}
