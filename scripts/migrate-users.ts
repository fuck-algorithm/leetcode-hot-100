/**
 * User Experience Migration Script
 * 
 * Migrates user experience data from the old system to the new rebalanced system.
 * Supports dry-run mode for testing and generates detailed migration reports.
 * 
 * Usage: 
 *   tsx scripts/migrate-users.ts --input users.json --output migrated-users.json
 *   tsx scripts/migrate-users.ts --input users.json --dry-run
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.5
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ExperienceSystem,
  UserData,
  MigrationResult,
  MigrationSummary,
} from '../src/services/experience-system/index';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

/**
 * Command line arguments
 */
interface Args {
  input: string;
  output?: string;
  dryRun: boolean;
  configPath?: string;
  help: boolean;
}

/**
 * Parses command line arguments
 */
function parseArgs(): Args {
  const args: Args = {
    input: '',
    dryRun: false,
    help: false,
  };

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--dry-run' || arg === '-d') {
      args.dryRun = true;
    } else if (arg === '--input' || arg === '-i') {
      args.input = process.argv[++i];
    } else if (arg === '--output' || arg === '-o') {
      args.output = process.argv[++i];
    } else if (arg === '--config' || arg === '-c') {
      args.configPath = process.argv[++i];
    }
  }

  return args;
}

/**
 * Displays help message
 */
function displayHelp(): void {
  console.log(`
${colors.cyan}User Experience Migration Script${colors.reset}

${colors.yellow}Usage:${colors.reset}
  tsx scripts/migrate-users.ts [options]

${colors.yellow}Options:${colors.reset}
  -i, --input <file>     Input JSON file with user data (required)
  -o, --output <file>    Output JSON file for migrated data (optional)
  -d, --dry-run          Run migration without saving results
  -c, --config <file>    Path to experience configuration file (optional)
  -h, --help             Display this help message

${colors.yellow}Examples:${colors.reset}
  # Migrate users and save to file
  tsx scripts/migrate-users.ts --input users.json --output migrated.json

  # Dry run to preview migration
  tsx scripts/migrate-users.ts --input users.json --dry-run

  # Use custom configuration
  tsx scripts/migrate-users.ts --input users.json --config custom-config.json

${colors.yellow}Input File Format:${colors.reset}
  {
    "oldTotalExperience": 500000,
    "oldRealmThresholds": [0, 25000, 60000, ...],
    "users": [
      {
        "userId": "user123",
        "currentExperience": 150000,
        "completedNodes": ["problem-1", "problem-2", ...]
      }
    ]
  }
`);
}

/**
 * Loads user data from JSON file
 */
function loadUserData(filePath: string): {
  oldTotalExperience: number;
  oldRealmThresholds: number[];
  users: UserData[];
} {
  console.log(`${colors.blue}Loading user data from: ${filePath}${colors.reset}`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (!data.oldTotalExperience || !data.oldRealmThresholds || !data.users) {
    throw new Error('Invalid input file format. Missing required fields.');
  }

  console.log(`${colors.green}✓ Loaded ${data.users.length} users${colors.reset}\n`);
  return data;
}

/**
 * Saves migration results to JSON file
 */
function saveMigrationResults(
  filePath: string,
  summary: MigrationSummary
): void {
  console.log(`${colors.blue}Saving migration results to: ${filePath}${colors.reset}`);
  
  const output = {
    migrationId: summary.migrationId,
    migrationDate: summary.timestamp.toISOString(),
    totalUsers: summary.totalUsers,
    successfulMigrations: summary.successfulMigrations,
    failedMigrations: summary.failedMigrations,
    adjustedForRealmPreservation: summary.adjustedForRealmPreservation,
    results: summary.results.map(r => ({
      userId: r.userId,
      oldExperience: r.oldExperience,
      newExperience: r.newExperience,
      oldRealm: r.oldRealm,
      newRealm: r.newRealm,
      adjusted: r.adjusted,
      orphanedNodes: r.orphanedNodes,
    })),
    errors: summary.errors,
  };

  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`${colors.green}✓ Results saved successfully${colors.reset}\n`);
}

/**
 * Displays migration summary
 */
function displaySummary(summary: MigrationSummary): void {
  console.log(`${colors.cyan}=== Migration Summary ===${colors.reset}\n`);
  
  const results = summary.results;
  const successful = results.filter(r => !r.orphanedNodes || r.orphanedNodes.length === 0);
  const withOrphans = results.filter(r => r.orphanedNodes && r.orphanedNodes.length > 0);
  
  console.log(`Total Users: ${summary.totalUsers}`);
  console.log(`${colors.green}Successful: ${summary.successfulMigrations}${colors.reset}`);
  if (summary.failedMigrations > 0) {
    console.log(`${colors.red}Failed: ${summary.failedMigrations}${colors.reset}`);
  }
  if (withOrphans.length > 0) {
    console.log(`${colors.yellow}With orphaned nodes: ${withOrphans.length}${colors.reset}`);
  }
  console.log();

  if (results.length > 0) {
    // Calculate statistics
    const experienceChanges = results.map(r => r.newExperience - r.oldExperience);
    const avgChange = experienceChanges.reduce((a, b) => a + b, 0) / experienceChanges.length;
    const maxIncrease = Math.max(...experienceChanges);
    const maxDecrease = Math.min(...experienceChanges);
    
    const realmChanges = results.map(r => r.newRealm - r.oldRealm);
    const realmIncreases = realmChanges.filter(c => c > 0).length;
    const realmSame = realmChanges.filter(c => c === 0).length;
    
    console.log(`${colors.cyan}Experience Changes:${colors.reset}`);
    console.log(`  Average change: ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(0)} EXP`);
    console.log(`  Largest increase: +${maxIncrease.toFixed(0)} EXP`);
    if (maxDecrease < 0) {
      console.log(`  ${colors.yellow}Largest decrease: ${maxDecrease.toFixed(0)} EXP${colors.reset}`);
    }
    console.log();

    console.log(`${colors.cyan}Realm Changes:${colors.reset}`);
    console.log(`  Realm increased: ${realmIncreases} users`);
    console.log(`  Realm unchanged: ${realmSame} users`);
    console.log(`  Adjusted for preservation: ${summary.adjustedForRealmPreservation} users`);
    console.log();
  }

  if (summary.errors.length > 0) {
    console.log(`${colors.red}Migration Errors:${colors.reset}`);
    for (const error of summary.errors) {
      console.log(`  ${error.userId}: ${error.error}`);
    }
    console.log();
  }

  // Display sample migrations
  if (results.length > 0) {
    console.log(`${colors.cyan}Sample Migrations (first 5):${colors.reset}`);
    for (const result of results.slice(0, 5)) {
      const expChange = result.newExperience - result.oldExperience;
      const expChangeStr = expChange > 0 ? `+${expChange}` : `${expChange}`;
      const realmChange = result.newRealm - result.oldRealm;
      const realmChangeStr = realmChange > 0 ? ` (↑${realmChange})` : realmChange < 0 ? ` (↓${Math.abs(realmChange)})` : '';
      const adjustedStr = result.adjusted ? ` ${colors.yellow}[adjusted]${colors.reset}` : '';
      
      console.log(`  ${result.userId}:`);
      console.log(`    Experience: ${result.oldExperience} → ${result.newExperience} (${expChangeStr})${adjustedStr}`);
      console.log(`    Realm: ${result.oldRealm} → ${result.newRealm}${realmChangeStr}`);
      if (result.orphanedNodes.length > 0) {
        console.log(`    ${colors.yellow}Orphaned nodes: ${result.orphanedNodes.length}${colors.reset}`);
      }
    }
    console.log();
  }
}

/**
 * Main migration function
 */
function main(): void {
  console.log(`${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  User Experience Migration Script         ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);

  // Parse arguments
  const args = parseArgs();

  if (args.help) {
    displayHelp();
    process.exit(0);
  }

  if (!args.input) {
    console.error(`${colors.red}Error: Input file is required${colors.reset}`);
    console.log('Use --help for usage information');
    process.exit(1);
  }

  try {
    // Load user data
    const { oldTotalExperience, oldRealmThresholds, users } = loadUserData(args.input);

    // Initialize experience system
    console.log(`${colors.blue}Initializing experience system...${colors.reset}`);
    const configPath = args.configPath || path.join(
      __dirname,
      '../src/services/experience-system/config/experience-config.json'
    );
    const experienceSystem = new ExperienceSystem(configPath);
    console.log(`${colors.green}✓ Experience system initialized${colors.reset}\n`);

    // Display migration mode
    if (args.dryRun) {
      console.log(`${colors.yellow}Running in DRY-RUN mode (no data will be saved)${colors.reset}\n`);
    }

    // Perform migration
    console.log(`${colors.blue}Migrating ${users.length} users...${colors.reset}`);
    const results = experienceSystem.migrateAllUsers(
      users,
      { thresholds: oldRealmThresholds, maxExperience: oldTotalExperience }
    );
    console.log(`${colors.green}✓ Migration completed${colors.reset}\n`);

    // Display summary
    displaySummary(results);

    // Save results (unless dry-run)
    if (!args.dryRun && args.output) {
      saveMigrationResults(args.output, results);
    } else if (!args.dryRun && !args.output) {
      console.log(`${colors.yellow}No output file specified. Results not saved.${colors.reset}`);
      console.log(`Use --output <file> to save migration results.\n`);
    }

    // Exit with appropriate code
    if (results.failedMigrations > 0) {
      console.log(`${colors.yellow}⚠ Migration completed with ${results.failedMigrations} error(s)${colors.reset}`);
      process.exit(1);
    } else {
      console.log(`${colors.green}✓ All migrations completed successfully!${colors.reset}`);
      process.exit(0);
    }
  } catch (error) {
    console.error(`${colors.red}Fatal error during migration:${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main, loadUserData, saveMigrationResults, displaySummary };
