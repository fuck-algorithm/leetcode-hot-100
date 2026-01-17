/**
 * Experience Calculator
 * 
 * Calculates final experience values for all nodes based on configuration.
 * Applies difficulty base values, importance multipliers, and normalization
 * to ensure the total experience equals exactly 1,000,000.
 * 
 * Requirements: 2.4, 3.4, 6.1, 6.4
 */

import {
  Node,
  ProblemNode,
  TreasureNode,
  Difficulty,
  TreasureTier,
  Config,
  CalculationExplanation,
} from './types';
import { ConfigurationManager } from './ConfigurationManager';
import { NodeRegistry } from './NodeRegistry';

/**
 * ExperienceCalculator class
 * 
 * Computes experience values using the formula:
 * final_experience = base_experience × importance_multiplier
 * 
 * Then normalizes all values to sum to exactly 1,000,000.
 */
export class ExperienceCalculator {
  private configManager: ConfigurationManager;
  private nodeRegistry: NodeRegistry;

  /**
   * Creates a new ExperienceCalculator instance
   * 
   * @param configManager - Configuration manager for accessing config values
   * @param nodeRegistry - Node registry for accessing node data
   */
  constructor(
    configManager: ConfigurationManager,
    nodeRegistry: NodeRegistry
  ) {
    this.configManager = configManager;
    this.nodeRegistry = nodeRegistry;
  }

  /**
   * Calculates experience for a problem node
   * 
   * Formula: base_experience × importance_multiplier
   * where importance_multiplier is the product of all applicable tag multipliers
   * 
   * @param difficulty - The difficulty level of the problem
   * @param tags - Array of importance tags
   * @returns Calculated experience value (before normalization)
   * 
   * Requirements: 2.4, 3.4, 6.1
   */
  calculateProblemExperience(difficulty: Difficulty, tags: string[]): number {
    const baseExperience = this.configManager.getBaseExperience(difficulty);
    const multiplier = this.configManager.getImportanceMultiplier(tags);
    
    const finalExperience = baseExperience * multiplier;
    return Math.round(finalExperience);
  }

  /**
   * Calculates experience for a treasure node
   * 
   * Directly retrieves the experience value from configuration based on tier.
   * 
   * @param tier - The treasure tier
   * @returns Experience value for the treasure
   * 
   * Requirements: 4.1, 6.1
   */
  calculateTreasureExperience(tier: TreasureTier): number {
    return this.configManager.getTreasureExperience(tier);
  }

  /**
   * Calculates experience for all nodes and normalizes to sum to 1,000,000
   * 
   * Algorithm:
   * 1. Calculate raw experience for each node
   * 2. Sum all raw values
   * 3. If sum ≠ 1,000,000, apply proportional scaling
   * 4. Handle rounding errors by adjusting the largest node
   * 
   * @param nodes - Array of all nodes to calculate experience for
   * @returns Map of node ID to final experience value
   * 
   * Requirements: 1.4, 2.4, 6.1
   */
  calculateAllExperience(nodes: Node[]): Map<string, number> {
    const config = this.configManager.getConfig();
    const targetTotal = config.totalExperience;
    
    // Step 1: Calculate raw experience for each node
    const rawExperience = new Map<string, number>();
    
    for (const node of nodes) {
      let experience: number;
      
      if (node.type === 'problem') {
        experience = this.calculateProblemExperience(
          node.difficulty,
          node.tags
        );
      } else {
        experience = this.calculateTreasureExperience(node.tier);
      }
      
      rawExperience.set(node.id, experience);
    }
    
    // Step 2: Calculate total
    const rawTotal = Array.from(rawExperience.values()).reduce(
      (sum, exp) => sum + exp,
      0
    );
    
    // Step 3: If already exact, return as-is
    if (rawTotal === targetTotal) {
      return rawExperience;
    }
    
    // Step 4: Apply proportional scaling
    const scaleFactor = targetTotal / rawTotal;
    const scaledExperience = new Map<string, number>();
    
    for (const [nodeId, exp] of Array.from(rawExperience.entries())) {
      const scaled = Math.round(exp * scaleFactor);
      scaledExperience.set(nodeId, scaled);
    }
    
    // Step 5: Handle rounding errors
    const scaledTotal = Array.from(scaledExperience.values()).reduce(
      (sum, exp) => sum + exp,
      0
    );
    
    const difference = targetTotal - scaledTotal;
    
    if (difference !== 0) {
      // Find the node with the largest experience value
      let largestNodeId = '';
      let largestValue = 0;
      
      for (const [nodeId, exp] of Array.from(scaledExperience.entries())) {
        if (exp > largestValue) {
          largestValue = exp;
          largestNodeId = nodeId;
        }
      }
      
      // Adjust the largest node to compensate for rounding error
      if (largestNodeId) {
        const adjusted = largestValue + difference;
        scaledExperience.set(largestNodeId, adjusted);
      }
    }
    
    return scaledExperience;
  }

  /**
   * Provides a detailed explanation of how a node's experience was calculated
   * 
   * Useful for debugging and understanding the calculation process.
   * 
   * @param nodeId - The ID of the node to explain
   * @returns Detailed calculation explanation
   * 
   * Requirements: 6.4
   */
  explainCalculation(nodeId: string): CalculationExplanation {
    const node = this.nodeRegistry.getNode(nodeId);
    
    if (!node) {
      return {
        nodeId,
        steps: [`Node ${nodeId} not found`],
        baseExperience: 0,
        finalExperience: 0,
        multipliers: {},
      };
    }
    
    const steps: string[] = [];
    const multipliers: Record<string, number> = {};
    let baseExperience: number;
    let finalExperience: number;
    
    if (node.type === 'problem') {
      // Problem node calculation
      baseExperience = this.configManager.getBaseExperience(node.difficulty);
      steps.push(`Base experience for ${node.difficulty}: ${baseExperience}`);
      
      // Calculate importance multiplier
      let totalMultiplier = 1.0;
      const config = this.configManager.getConfig();
      
      for (const tag of node.tags) {
        const tagMultiplier = config.importanceMultipliers[tag];
        if (tagMultiplier !== undefined) {
          multipliers[tag] = tagMultiplier;
          totalMultiplier *= tagMultiplier;
          steps.push(`Tag "${tag}" multiplier: ${tagMultiplier}`);
        }
      }
      
      if (node.tags.length === 0) {
        steps.push('No importance tags, multiplier: 1.0');
      } else {
        steps.push(`Total multiplier: ${totalMultiplier.toFixed(4)}`);
      }
      
      finalExperience = Math.round(baseExperience * totalMultiplier);
      steps.push(
        `Final experience: ${baseExperience} × ${totalMultiplier.toFixed(4)} = ${finalExperience}`
      );
    } else {
      // Treasure node calculation
      baseExperience = this.configManager.getTreasureExperience(node.tier);
      finalExperience = baseExperience;
      steps.push(`Treasure tier "${node.tier}": ${finalExperience}`);
    }
    
    steps.push('Note: Final values may be adjusted during normalization');
    
    return {
      nodeId,
      steps,
      baseExperience,
      finalExperience,
      multipliers,
    };
  }
}

/**
 * Creates an ExperienceCalculator instance
 * 
 * @param configManager - Configuration manager
 * @param nodeRegistry - Node registry
 * @returns A new ExperienceCalculator instance
 */
export function createExperienceCalculator(
  configManager: ConfigurationManager,
  nodeRegistry: NodeRegistry
): ExperienceCalculator {
  return new ExperienceCalculator(configManager, nodeRegistry);
}
