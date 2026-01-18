/**
 * TreasureTierResolver - Determines treasure tier based on position
 * 
 * Assigns tiers based on treasure position in learning path:
 * - First 25%: "early" (15000 EXP)
 * - 25-50%: "mid" (25000 EXP)
 * - 50-75%: "late" (35000 EXP)
 * - 75-100%: "final" (45000 EXP)
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { TreasureTier } from '../experience-system/types';

export class TreasureTierResolver {
  private treasureTiers: Map<string, TreasureTier>;
  private totalTreasures: number;

  constructor() {
    this.treasureTiers = new Map();
    this.totalTreasures = 0;
  }

  /**
   * Initialize treasure tiers based on problem list
   * Should be called once at application startup
   * 
   * @param treasureIds - Array of treasure IDs in order
   */
  initializeTreasureTiers(treasureIds: string[]): void {
    this.totalTreasures = treasureIds.length;

    treasureIds.forEach((treasureId, index) => {
      const position = (index + 1) / this.totalTreasures;
      let tier: TreasureTier;

      if (position <= 0.25) {
        tier = 'early';
      } else if (position <= 0.50) {
        tier = 'mid';
      } else if (position <= 0.75) {
        tier = 'late';
      } else {
        tier = 'final';
      }

      this.treasureTiers.set(treasureId, tier);
    });
  }

  /**
   * Get treasure tier for a specific treasure ID
   * 
   * @param treasureId - The treasure ID
   * @returns The treasure tier (defaults to 'early' if not found)
   */
  getTreasureTier(treasureId: string): TreasureTier {
    const tier = this.treasureTiers.get(treasureId);
    if (!tier) {
      // Default to 'early' if not found
      console.warn(`Treasure tier not found for ${treasureId}, defaulting to 'early'`);
      return 'early';
    }
    return tier;
  }

  /**
   * Get all treasure tiers
   * 
   * @returns Map of treasure ID to tier
   */
  getAllTreasureTiers(): Map<string, TreasureTier> {
    return new Map(this.treasureTiers);
  }

  /**
   * Get total number of treasures
   * 
   * @returns Total treasure count
   */
  getTotalTreasures(): number {
    return this.totalTreasures;
  }

  /**
   * Check if treasure tiers have been initialized
   * 
   * @returns True if initialized
   */
  isInitialized(): boolean {
    return this.totalTreasures > 0;
  }
}

// Export singleton instance
export const treasureTierResolver = new TreasureTierResolver();
