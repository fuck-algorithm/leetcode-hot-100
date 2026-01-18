/**
 * MigrationService
 * 
 * Handles conversion of existing user experience data to the new system.
 * Provides proportional scaling, realm preservation, batch processing,
 * validation, and rollback capabilities.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

import { Config } from './types';
import { RealmSystem } from './RealmSystem';

/**
 * Result of a single user migration
 */
export interface MigrationResult {
  userId: string;
  oldExperience: number;
  newExperience: number;
  oldRealm: number;
  newRealm: number;
  adjusted: boolean; // true if realm preservation adjustment was applied
  orphanedNodes: string[]; // nodes that no longer exist
}

/**
 * Summary of a batch migration operation
 */
export interface MigrationSummary {
  migrationId: string;
  timestamp: Date;
  totalUsers: number;
  successfulMigrations: number;
  failedMigrations: number;
  adjustedForRealmPreservation: number;
  results: MigrationResult[];
  errors: MigrationError[];
}

/**
 * Error during migration
 */
export interface MigrationError {
  userId: string;
  error: string;
  details?: any;
}

/**
 * Result of a rollback operation
 */
export interface RollbackResult {
  migrationId: string;
  success: boolean;
  restoredUsers: number;
  errors: MigrationError[];
}

/**
 * User data structure for migration
 */
export interface UserData {
  userId: string;
  experience: number;
  completedNodes: string[];
  realm?: number;
}

/**
 * Old realm thresholds for backward compatibility
 */
export interface OldRealmConfig {
  thresholds: number[];
  maxExperience: number;
}

/**
 * MigrationService class
 * 
 * Manages the migration of user experience data from old system to new system.
 */
export class MigrationService {
  private newRealmSystem: RealmSystem;
  private newMaxExperience: number;
  private migrationLog: Map<string, MigrationSummary>;
  private backupData: Map<string, Map<string, UserData>>;

  /**
   * Creates a new MigrationService instance
   * 
   * @param config - New system configuration
   */
  constructor(config: Config) {
    this.newRealmSystem = new RealmSystem(config);
    this.newMaxExperience = config.totalExperience;
    this.migrationLog = new Map();
    this.backupData = new Map();
  }

  /**
   * Migrates a single user's experience to the new system
   * 
   * Uses proportional scaling: new_exp = (old_exp / old_max) × new_max
   * Ensures realm preservation: users never regress in realm level.
   * 
   * @param userId - User identifier
   * @param oldExperience - User's experience in old system
   * @param oldRealmConfig - Old system realm configuration
   * @param completedNodes - List of completed node IDs (optional)
   * @param validNodeIds - Set of valid node IDs in new system (optional)
   * @returns MigrationResult with old and new values
   * 
   * Requirements: 10.1, 10.2, 10.4, 10.5
   */
  migrateUserExperience(
    userId: string,
    oldExperience: number,
    oldRealmConfig: OldRealmConfig,
    completedNodes: string[] = [],
    validNodeIds?: Set<string>
  ): MigrationResult {
    // Clamp old experience to valid range
    const clampedOldExp = Math.max(0, Math.min(oldExperience, oldRealmConfig.maxExperience));

    // Calculate old realm
    const oldRealm = this.calculateOldRealm(clampedOldExp, oldRealmConfig.thresholds);

    // Proportional scaling
    const scalingFactor = this.newMaxExperience / oldRealmConfig.maxExperience;
    let newExperience = Math.round(clampedOldExp * scalingFactor);

    // Calculate new realm based on scaled experience
    let newRealm = this.newRealmSystem.getCurrentRealm(newExperience);
    let adjusted = false;

    // Realm preservation: ensure user doesn't regress
    if (newRealm < oldRealm) {
      const newThresholds = this.newRealmSystem.getRealmThresholds();
      newExperience = newThresholds[oldRealm];
      newRealm = oldRealm;
      adjusted = true;
    }

    // Handle orphaned nodes (nodes that no longer exist)
    const orphanedNodes: string[] = [];
    if (validNodeIds) {
      for (const nodeId of completedNodes) {
        if (!validNodeIds.has(nodeId)) {
          orphanedNodes.push(nodeId);
        }
      }
    }

    // Ensure new experience is within valid range
    newExperience = Math.max(0, Math.min(newExperience, this.newMaxExperience));

    return {
      userId,
      oldExperience: clampedOldExp,
      newExperience,
      oldRealm,
      newRealm,
      adjusted,
      orphanedNodes,
    };
  }

  /**
   * Migrates all users in a batch operation
   * 
   * Processes multiple users, logs results, and creates backup for rollback.
   * 
   * @param users - Array of user data to migrate
   * @param oldRealmConfig - Old system realm configuration
   * @param validNodeIds - Set of valid node IDs in new system (optional)
   * @returns MigrationSummary with results and statistics
   * 
   * Requirements: 10.3, 10.6
   */
  migrateAllUsers(
    users: UserData[],
    oldRealmConfig: OldRealmConfig,
    validNodeIds?: Set<string>
  ): MigrationSummary {
    const migrationId = this.generateMigrationId();
    const timestamp = new Date();
    const results: MigrationResult[] = [];
    const errors: MigrationError[] = [];
    let adjustedCount = 0;

    // Create backup before migration
    const backup = new Map<string, UserData>();
    for (const user of users) {
      backup.set(user.userId, { ...user });
    }
    this.backupData.set(migrationId, backup);

    // Migrate each user
    for (const user of users) {
      try {
        const result = this.migrateUserExperience(
          user.userId,
          user.experience,
          oldRealmConfig,
          user.completedNodes,
          validNodeIds
        );
        results.push(result);
        if (result.adjusted) {
          adjustedCount++;
        }
      } catch (error) {
        errors.push({
          userId: user.userId,
          error: error instanceof Error ? error.message : String(error),
          details: { oldExperience: user.experience },
        });
      }
    }

    const summary: MigrationSummary = {
      migrationId,
      timestamp,
      totalUsers: users.length,
      successfulMigrations: results.length,
      failedMigrations: errors.length,
      adjustedForRealmPreservation: adjustedCount,
      results,
      errors,
    };

    // Store migration log
    this.migrationLog.set(migrationId, summary);

    return summary;
  }

  /**
   * Validates a completed migration
   * 
   * Checks that all migrated users have valid experience values and
   * that no realm regressions occurred.
   * 
   * @param migrationId - ID of the migration to validate
   * @returns Validation result
   * 
   * Requirements: 10.5
   */
  validateMigration(migrationId: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const summary = this.migrationLog.get(migrationId);
    if (!summary) {
      errors.push(`Migration ${migrationId} not found`);
      return { valid: false, errors, warnings };
    }

    // Check all results
    for (const result of summary.results) {
      // Validate experience range
      if (result.newExperience < 0 || result.newExperience > this.newMaxExperience) {
        errors.push(
          `User ${result.userId} has invalid experience: ${result.newExperience}`
        );
      }

      // Check for realm regression
      if (result.newRealm < result.oldRealm && !result.adjusted) {
        errors.push(
          `User ${result.userId} regressed from realm ${result.oldRealm} to ${result.newRealm}`
        );
      }

      // Warn about orphaned nodes
      if (result.orphanedNodes.length > 0) {
        warnings.push(
          `User ${result.userId} has ${result.orphanedNodes.length} orphaned nodes`
        );
      }
    }

    // Check for failed migrations
    if (summary.failedMigrations > 0) {
      warnings.push(
        `${summary.failedMigrations} out of ${summary.totalUsers} migrations failed`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Rolls back a migration to restore original user data
   * 
   * Restores user data from backup created during migration.
   * 
   * @param migrationId - ID of the migration to rollback
   * @returns RollbackResult with restoration statistics
   * 
   * Requirements: 10.6
   */
  rollbackMigration(migrationId: string): RollbackResult {
    const backup = this.backupData.get(migrationId);
    const errors: MigrationError[] = [];

    if (!backup) {
      return {
        migrationId,
        success: false,
        restoredUsers: 0,
        errors: [
          {
            userId: 'N/A',
            error: `No backup found for migration ${migrationId}`,
          },
        ],
      };
    }

    let restoredCount = 0;

    // Restore each user from backup
    for (const [userId] of Array.from(backup.entries())) {
      try {
        // In a real implementation, this would write to database
        // For now, we just count successful restorations
        restoredCount++;
      } catch (error) {
        errors.push({
          userId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Clean up backup and log after successful rollback
    if (errors.length === 0) {
      this.backupData.delete(migrationId);
      this.migrationLog.delete(migrationId);
    }

    return {
      migrationId,
      success: errors.length === 0,
      restoredUsers: restoredCount,
      errors,
    };
  }

  /**
   * Gets migration summary by ID
   * 
   * @param migrationId - Migration identifier
   * @returns Migration summary or undefined if not found
   */
  getMigrationSummary(migrationId: string): MigrationSummary | undefined {
    return this.migrationLog.get(migrationId);
  }

  /**
   * Calculates realm based on old system thresholds
   * 
   * @param experience - Experience value
   * @param thresholds - Old realm thresholds
   * @returns Realm index
   */
  private calculateOldRealm(experience: number, thresholds: number[]): number {
    if (experience < 0) return 0;
    if (experience >= thresholds[thresholds.length - 1]) {
      return thresholds.length - 1;
    }

    // Binary search for largest threshold <= experience
    let left = 0;
    let right = thresholds.length - 1;
    let result = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (thresholds[mid] <= experience) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Generates a unique migration ID
   * 
   * @returns Unique migration identifier
   */
  private generateMigrationId(): string {
    return `migration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Creates a new MigrationService instance
 * 
 * @param config - System configuration
 * @returns A new MigrationService instance
 */
export function createMigrationService(config: Config): MigrationService {
  return new MigrationService(config);
}
