/**
 * RealmSystem
 * 
 * Calculates realm thresholds and determines user progression through realms.
 * Provides methods to determine current realm, progress, and experience needed
 * for the next realm based on cumulative experience.
 * 
 * Requirements: 5.1, 5.2, 5.4, 5.5
 */

import { Config } from './types';

/**
 * RealmSystem class
 * 
 * Manages realm progression calculations and threshold lookups.
 */
export class RealmSystem {
  private thresholds: number[];

  /**
   * Creates a new RealmSystem instance
   * 
   * @param config - System configuration containing realm thresholds
   */
  constructor(config: Config) {
    this.thresholds = config.realmThresholds;
  }

  /**
   * Gets the configured realm thresholds
   * 
   * Returns an array of 11 thresholds representing the minimum experience
   * required to reach each realm (0-10).
   * 
   * @returns Array of realm thresholds
   * 
   * Requirements: 5.1
   */
  getRealmThresholds(): number[] {
    return [...this.thresholds];
  }

  /**
   * Determines the current realm based on cumulative experience
   * 
   * Uses binary search to find the highest realm threshold that the user
   * has reached or exceeded. Returns the realm index (0-10).
   * 
   * @param experience - User's cumulative experience
   * @returns Current realm index (0-10)
   * 
   * Requirements: 5.4
   */
  getCurrentRealm(experience: number): number {
    // Handle edge cases
    if (experience < 0) {
      return 0;
    }
    if (experience >= this.thresholds[this.thresholds.length - 1]) {
      return this.thresholds.length - 1;
    }

    // Binary search for the largest threshold <= experience
    let left = 0;
    let right = this.thresholds.length - 1;
    let result = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (this.thresholds[mid] <= experience) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  /**
   * Calculates experience needed to reach the next realm
   * 
   * Returns the amount of additional experience required to advance
   * to the next realm. Returns 0 if already at maximum realm.
   * 
   * @param experience - User's cumulative experience
   * @returns Experience needed for next realm, or 0 if at max realm
   * 
   * Requirements: 5.2, 5.5
   */
  getExperienceToNextRealm(experience: number): number {
    const currentRealm = this.getCurrentRealm(experience);
    
    // If at maximum realm, no more experience needed
    if (currentRealm >= this.thresholds.length - 1) {
      return 0;
    }

    const nextThreshold = this.thresholds[currentRealm + 1];
    return Math.max(0, nextThreshold - experience);
  }

  /**
   * Calculates progress within the current realm
   * 
   * Returns a value between 0.0 and 1.0 representing how far the user
   * has progressed through their current realm. Returns 1.0 if at max realm.
   * 
   * @param experience - User's cumulative experience
   * @returns Progress percentage (0.0 to 1.0)
   * 
   * Requirements: 5.5
   */
  getRealmProgress(experience: number): number {
    const currentRealm = this.getCurrentRealm(experience);
    
    // If at maximum realm, progress is 100%
    if (currentRealm >= this.thresholds.length - 1) {
      return 1.0;
    }

    const currentThreshold = this.thresholds[currentRealm];
    const nextThreshold = this.thresholds[currentRealm + 1];
    
    // Calculate progress within current realm
    const realmRange = nextThreshold - currentThreshold;
    const progressInRealm = experience - currentThreshold;
    
    // Ensure progress is between 0 and 1
    return Math.max(0, Math.min(1, progressInRealm / realmRange));
  }
}

/**
 * Creates a new RealmSystem instance
 * 
 * @param config - System configuration
 * @returns A new RealmSystem instance
 */
export function createRealmSystem(config: Config): RealmSystem {
  return new RealmSystem(config);
}
