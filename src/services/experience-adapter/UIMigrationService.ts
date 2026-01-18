/**
 * UIMigrationService - Handles migration of UI-specific data
 * 
 * Migrates user data from old experience system to new system:
 * - Scales experience proportionally (3070 → 1,000,000)
 * - Preserves treasure completion status
 * - Preserves problem completion status
 * - Provides rollback capability
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 */

import { ExperienceSystem } from '../experience-system';
import { dbService, STORES } from '../dbService';
import { ExperienceRecord, TreasureRecord } from './ExperienceAdapter';
import { CompletionRecord } from '../completionStorage';

export interface MigrationResult {
  success: boolean;
  oldExperience: number;
  newExperience: number;
  oldRealm: number;
  newRealm: number;
  scalingFactor: number;
  error?: string;
}

interface MigrationBackup {
  experience: ExperienceRecord;
  treasures: TreasureRecord[];
  completions: CompletionRecord[];
  timestamp: number;
}

export class UIMigrationService {
  private experienceSystem: ExperienceSystem;
  private readonly OLD_MAX_EXP = 3070; // Approximate old maximum
  private readonly NEW_MAX_EXP = 1000000;
  private readonly MIGRATION_KEY = 'migration_backup';

  constructor(experienceSystem: ExperienceSystem) {
    this.experienceSystem = experienceSystem;
  }

  /**
   * Get database instance
   */
  private async getDb(): Promise<IDBDatabase> {
    return dbService.getDatabase();
  }

  /**
   * Check if migration is needed
   * Returns true if schema version is undefined or < 2
   */
  async needsMigration(): Promise<boolean> {
    try {
      const exp = await this.readExperience();
      // Check schema version
      return !exp.schemaVersion || exp.schemaVersion < 2;
    } catch (error) {
      // If error reading, assume migration needed
      console.warn('Error checking migration status:', error);
      return true;
    }
  }

  /**
   * Migrate user data from old system to new system
   * 
   * Steps:
   * 1. Backup old data
   * 2. Calculate scaling factor
   * 3. Scale experience proportionally
   * 4. Preserve completion status
   * 5. Update schema version
   * 6. Commit changes
   */
  async migrateUserData(): Promise<MigrationResult> {
    console.log('[Migration] Starting user data migration...');

    // 1. Backup old data
    const backup = await this.backupOldData();
    console.log('[Migration] Backup created');

    try {
      // 2. Read old experience data
      const oldExp = backup.experience;
      console.log(`[Migration] Old experience: ${oldExp.totalExp}, Old level: ${oldExp.level}`);

      // 3. Calculate new experience
      const scalingFactor = this.NEW_MAX_EXP / this.OLD_MAX_EXP;
      const newExp = Math.floor(oldExp.totalExp * scalingFactor);
      console.log(`[Migration] Scaling factor: ${scalingFactor.toFixed(2)}, New experience: ${newExp}`);

      // 4. Calculate new realm
      const newRealm = this.experienceSystem.getCurrentRealm(newExp);
      console.log(`[Migration] New realm: ${newRealm}`);

      // 5. Update experience record with new values
      await this.writeNewExperience({
        id: 'total',
        totalExp: newExp,
        level: newRealm,
        lastUpdated: Date.now(),
        schemaVersion: 2,
        migrationDate: Date.now()
      });
      console.log('[Migration] Experience record updated');

      // 6. Mark migration as complete
      await this.markMigrationComplete();
      console.log('[Migration] Migration completed successfully');

      return {
        success: true,
        oldExperience: oldExp.totalExp,
        newExperience: newExp,
        oldRealm: oldExp.level,
        newRealm: newRealm,
        scalingFactor: scalingFactor
      };
    } catch (error) {
      console.error('[Migration] Migration failed:', error);
      // Rollback on error
      await this.rollbackMigration(backup);
      return {
        success: false,
        oldExperience: backup.experience.totalExp,
        newExperience: 0,
        oldRealm: backup.experience.level,
        newRealm: 0,
        scalingFactor: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Read experience record
   */
  private async readExperience(): Promise<ExperienceRecord> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.EXPERIENCE], 'readonly');
      const store = transaction.objectStore(STORES.EXPERIENCE);
      const request = store.get('total');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as ExperienceRecord | undefined;
        if (result) {
          resolve(result);
        } else {
          // Return default value
          resolve({
            id: 'total',
            totalExp: 0,
            level: 1,
            lastUpdated: Date.now()
          });
        }
      };
    });
  }

  /**
   * Write new experience record
   */
  private async writeNewExperience(record: ExperienceRecord): Promise<void> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.EXPERIENCE], 'readwrite');
      const store = transaction.objectStore(STORES.EXPERIENCE);
      const request = store.put(record);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Backup old data before migration
   */
  private async backupOldData(): Promise<MigrationBackup> {
    const db = await this.getDb();

    // Read all data
    const experience = await this.readExperience();
    const treasures = await this.readAllTreasures();
    const completions = await this.readAllCompletions();

    const backup: MigrationBackup = {
      experience,
      treasures,
      completions,
      timestamp: Date.now()
    };

    // Store backup in localStorage (IndexedDB might be cleared)
    try {
      localStorage.setItem(this.MIGRATION_KEY, JSON.stringify(backup));
    } catch (error) {
      console.warn('[Migration] Failed to store backup in localStorage:', error);
    }

    return backup;
  }

  /**
   * Read all treasures
   */
  private async readAllTreasures(): Promise<TreasureRecord[]> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readonly');
      const store = transaction.objectStore(STORES.TREASURES);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result as TreasureRecord[] || []);
      };
    });
  }

  /**
   * Read all completions
   */
  private async readAllCompletions(): Promise<CompletionRecord[]> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.COMPLETIONS], 'readonly');
      const store = transaction.objectStore(STORES.COMPLETIONS);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result as CompletionRecord[] || []);
      };
    });
  }

  /**
   * Rollback migration on error
   */
  private async rollbackMigration(backup: MigrationBackup): Promise<void> {
    console.log('[Migration] Rolling back migration...');

    try {
      const db = await this.getDb();

      // Restore experience
      await this.writeNewExperience(backup.experience);

      // Note: Treasures and completions are not modified during migration,
      // so no need to restore them

      console.log('[Migration] Rollback completed');
    } catch (error) {
      console.error('[Migration] Rollback failed:', error);
      throw new Error('Migration rollback failed');
    }
  }

  /**
   * Mark migration as complete
   */
  private async markMigrationComplete(): Promise<void> {
    try {
      localStorage.setItem('migration_complete', 'true');
      localStorage.setItem('migration_timestamp', Date.now().toString());
      localStorage.setItem('migration_version', '2');
    } catch (error) {
      console.warn('[Migration] Failed to mark migration complete:', error);
    }
  }

  /**
   * Get migration backup from localStorage
   */
  async getMigrationBackup(): Promise<MigrationBackup | null> {
    try {
      const backupStr = localStorage.getItem(this.MIGRATION_KEY);
      if (!backupStr) return null;
      return JSON.parse(backupStr) as MigrationBackup;
    } catch (error) {
      console.error('[Migration] Failed to read backup:', error);
      return null;
    }
  }

  /**
   * Clear migration backup
   */
  async clearMigrationBackup(): Promise<void> {
    try {
      localStorage.removeItem(this.MIGRATION_KEY);
    } catch (error) {
      console.warn('[Migration] Failed to clear backup:', error);
    }
  }
}
