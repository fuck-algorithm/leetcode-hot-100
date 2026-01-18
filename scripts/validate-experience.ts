/**
 * Experience Validation Script
 * 
 * Validates that the experience configuration meets all system constraints.
 * This script should be run before deployment to ensure correctness.
 * 
 * Usage: ts-node scripts/validate-experience.ts
 * 
 * Requirements: 1.1, 1.2, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ConfigurationManager,
  ExperienceCalculator,
  NodeRegistry,
  Validator,
  Config,
  Node,
  ProblemNode,
  TreasureNode,
} from '../src/services/experience-system/index';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Loads the experience configuration
 */
function loadConfiguration(): Config {
  const configPath = path.join(__dirname, '../src/services/experience-system/config/experience-config.json');
  const configManager = new ConfigurationManager();
  
  console.log(`${colors.blue}Loading configuration from: ${configPath}${colors.reset}`);
  
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const validationResult = configManager.validateConfig(configData);
  
  if (!validationResult.valid) {
    console.error(`${colors.red}Configuration validation failed:${colors.reset}`);
    for (const error of validationResult.errors) {
      console.error(`  ${colors.red}✗${colors.reset} ${error.message}`);
    }
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ Configuration loaded successfully${colors.reset}\n`);
  return configData as Config;
}

/**
 * Loads node data (problems and treasures)
 * 
 * In a real implementation, this would load from a database or JSON file.
 * For validation, we create a realistic sample dataset that mimics the actual
 * LeetCode Hot 100 distribution to ensure proper normalization.
 */
function loadNodes(): Node[] {
  console.log(`${colors.blue}Loading node data...${colors.reset}`);
  
  // Create a realistic sample dataset that mimics LeetCode Hot 100
  // Distribution: ~30 easy, ~45 medium, ~25 hard problems
  const nodes: Node[] = [];
  
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  const counts = { easy: 30, medium: 45, hard: 25 };
  
  // Tag distribution (approximate real-world distribution)
  const tagSets = [
    [], // No tags (40%)
    [], // No tags
    ['highFrequencyInterview'], // Interview only (25%)
    ['classicAlgorithm'], // Classic only (15%)
    ['hasAnimation'], // Animation only (10%)
    ['highFrequencyInterview', 'classicAlgorithm'], // Interview + Classic (7%)
    ['highFrequencyInterview', 'hasAnimation'], // Interview + Animation (2%)
    ['classicAlgorithm', 'hasAnimation'], // Classic + Animation (1%)
  ];
  
  let nodeId = 1;
  for (const difficulty of difficulties) {
    const count = counts[difficulty];
    for (let i = 0; i < count; i++) {
      // Distribute tags according to the pattern above
      const tagIndex = i % tagSets.length;
      const node: ProblemNode = {
        id: `problem-${nodeId}`,
        type: 'problem',
        difficulty,
        tags: tagSets[tagIndex],
        title: `Problem ${nodeId}`,
      };
      nodes.push(node);
      nodeId++;
    }
  }
  
  // Add treasure nodes (4 tiers)
  const tiers: Array<'early' | 'mid' | 'late' | 'final'> = ['early', 'mid', 'late', 'final'];
  for (let i = 0; i < tiers.length; i++) {
    const node: TreasureNode = {
      id: `treasure-${i + 1}`,
      type: 'treasure',
      tier: tiers[i],
      position: i * 25,
    };
    nodes.push(node);
  }
  
  console.log(`${colors.green}✓ Loaded ${nodes.length} nodes (${nodes.filter(n => n.type === 'problem').length} problems, ${nodes.filter(n => n.type === 'treasure').length} treasures)${colors.reset}\n`);
  return nodes;
}

/**
 * Calculates experience allocations for all nodes
 */
function calculateExperience(config: Config, nodes: Node[]): Map<string, number> {
  console.log(`${colors.blue}Calculating experience allocations...${colors.reset}`);
  
  const configPath = path.join(__dirname, '../src/services/experience-system/config/experience-config.json');
  const configManager = new ConfigurationManager();
  configManager.loadConfig(configPath);
  
  const nodeRegistry = new NodeRegistry(nodes);
  const calculator = new ExperienceCalculator(configManager, nodeRegistry);
  const allocations = calculator.calculateAllExperience(nodes);
  
  console.log(`${colors.green}✓ Calculated experience for ${allocations.size} nodes${colors.reset}\n`);
  return allocations;
}

/**
 * Validates experience allocations
 */
function validateAllocations(
  allocations: Map<string, number>,
  nodes: Node[],
  config: Config
): boolean {
  console.log(`${colors.blue}Running validation checks...${colors.reset}\n`);
  
  const validator = new Validator();
  const result = validator.validateAll(allocations, nodes, config);
  
  // Display results
  if (result.valid) {
    console.log(`${colors.green}✓ All validation checks passed!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Validation failed with ${result.errors.length} error(s)${colors.reset}\n`);
  }
  
  // Display errors
  if (result.errors.length > 0) {
    console.log(`${colors.red}Errors:${colors.reset}`);
    for (const error of result.errors) {
      console.log(`  ${colors.red}✗${colors.reset} [${error.code}] ${error.message}`);
      if (error.details) {
        console.log(`    Details: ${JSON.stringify(error.details, null, 2)}`);
      }
    }
    console.log();
  }
  
  // Display warnings
  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}Warnings:${colors.reset}`);
    for (const warning of result.warnings) {
      console.log(`  ${colors.yellow}⚠${colors.reset} [${warning.code}] ${warning.message}`);
    }
    console.log();
  }
  
  return result.valid;
}

/**
 * Displays detailed report of experience allocations
 */
function displayReport(
  allocations: Map<string, number>,
  nodes: Node[],
  config: Config
): void {
  console.log(`${colors.cyan}=== Experience Allocation Report ===${colors.reset}\n`);
  
  // Total experience
  const total = Array.from(allocations.values()).reduce((sum, exp) => sum + exp, 0);
  console.log(`Total Experience: ${total.toLocaleString()} / ${config.totalExperience.toLocaleString()}`);
  console.log(`Deviation: ${total - config.totalExperience}\n`);
  
  // Problem nodes by difficulty
  const problemNodes = nodes.filter((n): n is ProblemNode => n.type === 'problem');
  const byDifficulty: Record<string, number[]> = { easy: [], medium: [], hard: [] };
  
  for (const node of problemNodes) {
    const exp = allocations.get(node.id);
    if (exp !== undefined) {
      byDifficulty[node.difficulty].push(exp);
    }
  }
  
  console.log(`${colors.cyan}Problem Nodes by Difficulty:${colors.reset}`);
  for (const [difficulty, values] of Object.entries(byDifficulty)) {
    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      console.log(`  ${difficulty.padEnd(8)}: ${values.length} nodes, avg: ${avg.toFixed(0)}, range: ${min}-${max}`);
    }
  }
  console.log();
  
  // Treasure nodes by tier
  const treasureNodes = nodes.filter((n): n is TreasureNode => n.type === 'treasure');
  console.log(`${colors.cyan}Treasure Nodes by Tier:${colors.reset}`);
  for (const node of treasureNodes) {
    const exp = allocations.get(node.id);
    console.log(`  ${node.tier.padEnd(8)}: ${exp?.toLocaleString() || 'N/A'} EXP`);
  }
  console.log();
  
  // Realm thresholds
  console.log(`${colors.cyan}Realm Thresholds:${colors.reset}`);
  for (let i = 0; i < config.realmThresholds.length; i++) {
    const threshold = config.realmThresholds[i];
    const percentage = ((threshold / config.totalExperience) * 100).toFixed(1);
    console.log(`  Realm ${i.toString().padStart(2)}: ${threshold.toLocaleString().padStart(10)} EXP (${percentage}%)`);
  }
  console.log();
  
  // Top 10 highest experience nodes
  const sortedAllocations = Array.from(allocations.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  console.log(`${colors.cyan}Top 10 Highest Experience Nodes:${colors.reset}`);
  for (const [nodeId, exp] of sortedAllocations) {
    const node = nodes.find(n => n.id === nodeId);
    const percentage = ((exp / config.totalExperience) * 100).toFixed(2);
    const nodeInfo = node ? `(${node.type})` : '';
    console.log(`  ${nodeId.padEnd(20)} ${nodeInfo.padEnd(12)}: ${exp.toLocaleString().padStart(8)} EXP (${percentage}%)`);
  }
  console.log();
}

/**
 * Main validation function
 */
function main(): void {
  console.log(`${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  Experience System Validation Script      ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);
  
  try {
    // Step 1: Load configuration
    const config = loadConfiguration();
    
    // Step 2: Load node data
    const nodes = loadNodes();
    
    // Step 3: Calculate experience allocations
    const allocations = calculateExperience(config, nodes);
    
    // Step 4: Validate allocations
    const isValid = validateAllocations(allocations, nodes, config);
    
    // Step 5: Display detailed report
    displayReport(allocations, nodes, config);
    
    // Exit with appropriate code
    if (isValid) {
      console.log(`${colors.green}✓ Validation completed successfully!${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`${colors.red}✗ Validation failed. Please fix the errors above.${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}Fatal error during validation:${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main, loadConfiguration, loadNodes, calculateExperience, validateAllocations };
