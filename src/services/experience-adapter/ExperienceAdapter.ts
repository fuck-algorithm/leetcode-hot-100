/**
 * ExperienceAdapter - Adapter layer between UI and new experience system
 * 
 * Provides backward-compatible API while using new experience system internally.
 * Maintains same method signatures as old experienceStorage.ts
 * 
 * Requirements: 1.1, 1.2, 1.4
 */

import { ExperienceSystem } from '../experience-system';
import { Difficulty } from '../experience-system/types';
import { TreasureTierResolver } from './TreasureTierResolver';
import { dbService, STORES } from '../dbService';

// Re-export types for backward compatibility
export interface ExperienceRecord {
  id: string;
  totalExp: number;
  level: number;
  lastUpdated: number;
  schemaVersion?: number;
  migrationDate?: number;
}

export interface TreasureRecord {
  treasureId: string;
  opened: boolean;
  openedAt: number | null;
  expAwarded: number;
}

export class ExperienceAdapter {
  private experienceSystem: ExperienceSystem;
  private treasureTierResolver: TreasureTierResolver;

  constructor() {
    // Initialize new experience system with default config
    this.experienceSystem = new ExperienceSystem();
    this.treasureTierResolver = new TreasureTierResolver();
  }

  /**
   * Get database instance
   */
  private async getDb(): Promise<IDBDatabase> {
    return dbService.getDatabase();
  }

  /**
   * Get total experience (backward compatible)
   * Returns same format as old system
   */
  async getTotalExperience(): Promise<ExperienceRecord> {
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
            level: 1, // Level 1 in new system
            lastUpdated: Date.now(),
            schemaVersion: 2
          });
        }
      };
    });
  }

  /**
   * Add experience (backward compatible)
   * Uses new system for level calculation (1-100)
   */
  async addExperience(amount: number): Promise<ExperienceRecord> {
    const db = await this.getDb();
    const current = await this.getTotalExperience();

    const newExp = current.totalExp + amount;
    const newLevel = this.experienceSystem.getCurrentLevel(newExp);

    const record: ExperienceRecord = {
      id: 'total',
      totalExp: newExp,
      level: newLevel,
      lastUpdated: Date.now(),
      schemaVersion: 2
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.EXPERIENCE], 'readwrite');
      const store = transaction.objectStore(STORES.EXPERIENCE);
      const request = store.put(record);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(record);
    });
  }

  /**
   * Remove experience (backward compatible)
   */
  async removeExperience(amount: number): Promise<ExperienceRecord> {
    const db = await this.getDb();
    const current = await this.getTotalExperience();

    const newExp = Math.max(0, current.totalExp - amount);
    const newLevel = this.experienceSystem.getCurrentLevel(newExp);

    const record: ExperienceRecord = {
      id: 'total',
      totalExp: newExp,
      level: newLevel,
      lastUpdated: Date.now(),
      schemaVersion: 2
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.EXPERIENCE], 'readwrite');
      const store = transaction.objectStore(STORES.EXPERIENCE);
      const request = store.put(record);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(record);
    });
  }

  /**
   * Get treasure experience value
   * NEW: Uses treasure tier system
   */
  getTreasureExperience(treasureId: string): number {
    const tier = this.treasureTierResolver.getTreasureTier(treasureId);
    return this.experienceSystem.calculateTreasureExperience(tier);
  }

  /**
   * Get difficulty experience value
   * NEW: Uses new system values (5000, 8000, 12000)
   */
  getDifficultyExperience(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): number {
    const config = this.experienceSystem.getConfiguration();
    const difficultyMap: Record<string, Difficulty> = {
      'EASY': 'easy',
      'MEDIUM': 'medium',
      'HARD': 'hard'
    };
    return config.difficultyBaseValues[difficultyMap[difficulty]];
  }

  /**
   * Open treasure (backward compatible)
   * NEW: Uses treasure tier for experience calculation
   */
  async openTreasure(treasureId: string): Promise<{
    treasure: TreasureRecord;
    newExp: ExperienceRecord;
  }> {
    const db = await this.getDb();

    // Check if already opened
    const existing = await this.getTreasure(treasureId);
    if (existing?.opened) {
      const currentExp = await this.getTotalExperience();
      return { treasure: existing, newExp: currentExp };
    }

    // Get treasure tier and calculate experience
    const expAwarded = this.getTreasureExperience(treasureId);

    // Create treasure record
    const treasure: TreasureRecord = {
      treasureId,
      opened: true,
      openedAt: Date.now(),
      expAwarded
    };

    // Save treasure record
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readwrite');
      const store = transaction.objectStore(STORES.TREASURES);
      const request = store.put(treasure);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });

    // Add experience
    const newExp = await this.addExperience(expAwarded);

    return { treasure, newExp };
  }

  /**
   * Check if treasure is opened (backward compatible)
   */
  async isTreasureOpened(treasureId: string): Promise<boolean> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readonly');
      const store = transaction.objectStore(STORES.TREASURES);
      const request = store.get(treasureId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as TreasureRecord | undefined;
        resolve(result?.opened ?? false);
      };
    });
  }

  /**
   * Get treasure record
   */
  async getTreasure(treasureId: string): Promise<TreasureRecord | null> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readonly');
      const store = transaction.objectStore(STORES.TREASURES);
      const request = store.get(treasureId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  /**
   * Get current realm
   * NEW: Uses new realm system (0-10)
   */
  getCurrentRealm(experience: number): number {
    return this.experienceSystem.getCurrentRealm(experience);
  }

  /**
   * Get realm progress
   * NEW: Uses new realm system
   */
  getRealmProgress(experience: number): number {
    return this.experienceSystem.getRealmProgress(experience);
  }

  /**
   * Get experience to next realm
   * NEW: Uses new realm system
   */
  getExperienceToNextRealm(experience: number): number {
    return this.experienceSystem.getExperienceToNextRealm(experience);
  }

  /**
   * Get current level
   * NEW: Uses new level system (1-100)
   */
  getCurrentLevel(experience: number): number {
    return this.experienceSystem.getCurrentLevel(experience);
  }

  /**
   * Get level progress
   * NEW: Uses new level system
   */
  getLevelProgress(experience: number): number {
    return this.experienceSystem.getLevelProgress(experience);
  }

  /**
   * Get experience to next level
   * NEW: Uses new level system
   */
  getExperienceToNextLevel(experience: number): number {
    return this.experienceSystem.getExperienceToNextLevel(experience);
  }

  /**
   * Reset all progress (backward compatible)
   */
  async resetAll(): Promise<void> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.EXPERIENCE, STORES.TREASURES], 'readwrite');

      transaction.objectStore(STORES.EXPERIENCE).clear();
      transaction.objectStore(STORES.TREASURES).clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Reset path treasures (backward compatible)
   */
  async resetPathTreasures(pathId: string): Promise<void> {
    const db = await this.getDb();
    const treasures = await this.getAllOpenedTreasures();

    // Find treasures related to this path
    const pathTreasures = treasures.filter(t =>
      t.treasureId.includes(`path-${pathId}-`) ||
      t.treasureId.includes(`detail-${pathId}-`) ||
      t.treasureId.includes(`endpoint-${pathId}`)
    );

    if (pathTreasures.length === 0) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readwrite');
      const store = transaction.objectStore(STORES.TREASURES);

      pathTreasures.forEach(treasure => {
        store.delete(treasure.treasureId);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Get all opened treasures (backward compatible)
   */
  async getAllOpenedTreasures(): Promise<TreasureRecord[]> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TREASURES], 'readonly');
      const store = transaction.objectStore(STORES.TREASURES);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const allTreasures = request.result as TreasureRecord[] || [];
        const openedTreasures = allTreasures.filter(t => t.opened);
        resolve(openedTreasures);
      };
    });
  }

  /**
   * Initialize treasure tier resolver
   * Should be called at application startup
   */
  initializeTreasureTiers(treasureIds: string[]): void {
    this.treasureTierResolver.initializeTreasureTiers(treasureIds);
  }

  /**
   * Get experience system instance (for advanced usage)
   */
  getExperienceSystem(): ExperienceSystem {
    return this.experienceSystem;
  }

  /**
   * Get treasure tier resolver instance (for advanced usage)
   */
  getTreasureTierResolver(): TreasureTierResolver {
    return this.treasureTierResolver;
  }
}

// Export singleton instance
export const experienceAdapter = new ExperienceAdapter();
