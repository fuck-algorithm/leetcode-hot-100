/**
 * Type definitions for the Experience Value Rebalance System
 * 
 * This module defines all core types, interfaces, and enums used throughout
 * the experience system for calculating, validating, and managing experience
 * point allocations.
 */

// ============================================================================
// Node Types
// ============================================================================

/**
 * Difficulty levels for problem nodes
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Treasure chest tier levels
 */
export type TreasureTier = 'early' | 'mid' | 'late' | 'final';

/**
 * Base interface for all nodes in the system
 */
export interface BaseNode {
  id: string;
  type: 'problem' | 'treasure';
}

/**
 * Problem node representing a LeetCode problem
 * 
 * @property difficulty - The difficulty level of the problem
 * @property tags - Array of importance tags (e.g., 'highFrequencyInterview', 'hasAnimation')
 * @property title - Human-readable title of the problem
 */
export interface ProblemNode extends BaseNode {
  type: 'problem';
  difficulty: Difficulty;
  tags: string[];
  title: string;
}

/**
 * Treasure node representing a milestone reward
 * 
 * @property tier - The tier level of the treasure chest
 * @property position - Position in the learning path
 */
export interface TreasureNode extends BaseNode {
  type: 'treasure';
  tier: TreasureTier;
  position: number;
}

/**
 * Union type for all node types
 */
export type Node = ProblemNode | TreasureNode;

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Base experience values for each difficulty level
 */
export interface DifficultyBaseValues {
  easy: number;
  medium: number;
  hard: number;
}

/**
 * Importance multipliers for problem tags
 * 
 * Keys are tag names, values are multipliers (e.g., 1.3 = 30% bonus)
 */
export interface ImportanceMultipliers {
  [tagName: string]: number;
}

/**
 * Experience values for each treasure tier
 */
export interface TreasureTierValues {
  early: number;
  mid: number;
  late: number;
  final: number;
}

/**
 * System constraints for experience allocation
 */
export interface Constraints {
  maxSingleNodePercentage: number;  // Maximum percentage of total (e.g., 0.05 = 5%)
  minNodeExperience: number;         // Minimum experience per node
}

/**
 * Complete configuration for the experience system
 * 
 * This configuration drives all experience calculations and can be
 * modified without code changes to adjust game balance.
 */
export interface Config {
  totalExperience: number;
  difficultyBaseValues: DifficultyBaseValues;
  importanceMultipliers: ImportanceMultipliers;
  treasureTierValues: TreasureTierValues;
  realmThresholds: number[];  // Array of 11 thresholds (0 to 1,000,000)
  levelThresholds: number[];  // Array of 100 thresholds for levels 1-100
  constraints: Constraints;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Severity level for validation issues
 */
export type ValidationSeverity = 'error' | 'warning';

/**
 * A single validation error or warning
 * 
 * @property code - Machine-readable error code (e.g., 'TOTAL_MISMATCH')
 * @property message - Human-readable error message
 * @property severity - Whether this is an error or warning
 * @property details - Additional context about the error
 */
export interface ValidationError {
  code: string;
  message: string;
  severity: ValidationSeverity;
  details: Record<string, any>;
}

/**
 * Result of a validation operation
 * 
 * @property valid - Whether validation passed (no errors)
 * @property errors - Array of validation errors
 * @property warnings - Array of validation warnings
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================================================
// Experience Allocation Types
// ============================================================================

/**
 * Detailed breakdown of how experience was calculated for a node
 * 
 * @property nodeId - The node this allocation is for
 * @property nodeType - Type of node (problem or treasure)
 * @property baseExperience - Base experience before multipliers
 * @property importanceMultiplier - Combined multiplier from all tags
 * @property finalExperience - Final experience after all calculations
 * @property calculationSteps - Human-readable explanation of calculation
 */
export interface ExperienceAllocation {
  nodeId: string;
  nodeType: 'problem' | 'treasure';
  baseExperience: number;
  importanceMultiplier: number;
  finalExperience: number;
  calculationSteps: string[];
}

/**
 * Explanation of how a specific node's experience was calculated
 */
export interface CalculationExplanation {
  nodeId: string;
  steps: string[];
  baseExperience: number;
  finalExperience: number;
  multipliers: Record<string, number>;
}

// ============================================================================
// User Progress Types
// ============================================================================

/**
 * User's progress through the experience system
 * 
 * @property userId - Unique identifier for the user
 * @property totalExperience - Total accumulated experience
 * @property currentRealm - Current realm (0-10)
 * @property completedNodes - Array of completed node IDs
 * @property experienceByNode - Map of node ID to experience earned
 * @property lastUpdated - Timestamp of last update
 */
export interface UserProgress {
  userId: string;
  totalExperience: number;
  currentRealm: number;
  completedNodes: string[];
  experienceByNode: Map<string, number>;
  lastUpdated: Date;
}

// ============================================================================
// Migration Types
// ============================================================================

/**
 * Result of migrating a single user's experience
 * 
 * @property userId - The user being migrated
 * @property oldExperience - Experience value before migration
 * @property newExperience - Experience value after migration
 * @property oldRealm - Realm before migration
 * @property newRealm - Realm after migration
 * @property adjusted - Whether realm preservation adjustment was applied
 */
export interface MigrationResult {
  userId: string;
  oldExperience: number;
  newExperience: number;
  oldRealm: number;
  newRealm: number;
  adjusted: boolean;
}

/**
 * Summary of a batch migration operation
 * 
 * @property totalUsers - Total number of users migrated
 * @property successCount - Number of successful migrations
 * @property failureCount - Number of failed migrations
 * @property results - Individual migration results
 * @property errors - Any errors encountered
 */
export interface MigrationSummary {
  totalUsers: number;
  successCount: number;
  failureCount: number;
  results: MigrationResult[];
  errors: Array<{ userId: string; error: string }>;
}

/**
 * Result of a rollback operation
 */
export interface RollbackResult {
  success: boolean;
  message: string;
  usersRolledBack: number;
}
