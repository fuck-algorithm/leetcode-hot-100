/**
 * Initialize Experience System
 * 
 * Handles application startup initialization:
 * - Check if migration is needed
 * - Run migration if necessary
 * - Initialize treasure tiers
 * 
 * Requirements: 4.1, 4.2, 4.6, 6.1
 */

import { experienceAdapter } from './ExperienceAdapter';
import { UIMigrationService } from './UIMigrationService';

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize the experience system
 * Should be called once at application startup
 */
export async function initializeExperienceSystem(): Promise<void> {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('[ExperienceSystem] Initializing...');

      // Create migration service
      const migrationService = new UIMigrationService(
        experienceAdapter.getExperienceSystem()
      );

      // Check if migration is needed
      const needsMigration = await migrationService.needsMigration();

      if (needsMigration) {
        console.log('[ExperienceSystem] Migration needed, starting migration...');
        
        // Show migration status to user (optional)
        showMigrationStatus('正在升级经验值系统... / Upgrading experience system...');

        // Run migration
        const result = await migrationService.migrateUserData();

        if (result.success) {
          console.log('[ExperienceSystem] Migration completed successfully');
          console.log(`[ExperienceSystem] Old: ${result.oldExperience} EXP (Realm ${result.oldRealm})`);
          console.log(`[ExperienceSystem] New: ${result.newExperience} EXP (Realm ${result.newRealm})`);
          console.log(`[ExperienceSystem] Scaling factor: ${result.scalingFactor.toFixed(2)}`);
          
          // Hide migration status
          hideMigrationStatus();
          
          // Show success message (optional)
          showMigrationSuccess(result);
        } else {
          console.error('[ExperienceSystem] Migration failed:', result.error);
          hideMigrationStatus();
          showMigrationError(result.error || 'Unknown error');
        }
      } else {
        console.log('[ExperienceSystem] No migration needed');
        
        // Check and fix incorrect level values
        await fixIncorrectLevelValues();
      }

      // Mark as initialized
      isInitialized = true;
      console.log('[ExperienceSystem] Initialization complete');
    } catch (error) {
      console.error('[ExperienceSystem] Initialization failed:', error);
      hideMigrationStatus();
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Initialize treasure tiers for a learning path
 * Should be called when treasure IDs are available
 */
export function initializeTreasureTiers(treasureIds: string[]): void {
  if (treasureIds.length === 0) {
    console.warn('[ExperienceSystem] No treasure IDs provided for initialization');
    return;
  }

  console.log(`[ExperienceSystem] Initializing ${treasureIds.length} treasure tiers...`);
  experienceAdapter.initializeTreasureTiers(treasureIds);
  console.log('[ExperienceSystem] Treasure tiers initialized');
}

/**
 * Show migration status message
 */
function showMigrationStatus(message: string): void {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'migration-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  // Create message box
  const messageBox = document.createElement('div');
  messageBox.style.cssText = `
    background: linear-gradient(135deg, #1a2332 0%, #0d1117 100%);
    border: 2px solid #fbbf24;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    color: #fbbf24;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(251, 191, 36, 0.3);
    max-width: 400px;
  `;

  // Add spinner
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 48px;
    height: 48px;
    border: 4px solid rgba(251, 191, 36, 0.2);
    border-top-color: #fbbf24;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  messageBox.appendChild(spinner);
  messageBox.appendChild(document.createTextNode(message));
  overlay.appendChild(messageBox);
  document.body.appendChild(overlay);
}

/**
 * Hide migration status message
 */
function hideMigrationStatus(): void {
  const overlay = document.getElementById('migration-overlay');
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Show migration success message
 */
function showMigrationSuccess(result: any): void {
  // Optional: Show a brief success notification
  console.log('[ExperienceSystem] Migration successful, experience upgraded!');
  
  // You could add a toast notification here if desired
  // For now, we'll just log it
}

/**
 * Show migration error message
 */
function showMigrationError(error: string): void {
  console.error('[ExperienceSystem] Migration error:', error);
  
  // Show error to user
  alert(`经验值系统升级失败 / Experience system upgrade failed:\n${error}\n\n请刷新页面重试 / Please refresh the page to try again.`);
}

/**
 * Check if experience system is initialized
 */
export function isExperienceSystemInitialized(): boolean {
  return isInitialized;
}

/**
 * Fix incorrect level values in existing data
 * This fixes the bug where level field was incorrectly set to realm index (0-10)
 * instead of user level (1-100)
 */
async function fixIncorrectLevelValues(): Promise<void> {
  try {
    const exp = await experienceAdapter.getTotalExperience();
    const correctLevel = experienceAdapter.getCurrentLevel(exp.totalExp);
    
    // Check if level is incorrect (likely a realm index 0-10 instead of level 1-100)
    if (exp.level !== correctLevel) {
      console.log(`[ExperienceSystem] Fixing incorrect level value: ${exp.level} -> ${correctLevel}`);
      
      // Fix by triggering a zero-experience update (which recalculates level)
      await experienceAdapter.addExperience(0);
      
      console.log('[ExperienceSystem] Level value fixed');
    }
  } catch (error) {
    console.warn('[ExperienceSystem] Failed to fix level values:', error);
    // Don't throw - this is a non-critical fix
  }
}
