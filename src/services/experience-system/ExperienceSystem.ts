/**
 * Experience System Facade
 * 
 * Main entry point for the experience system. Provides a high-level API
 * that coordinates ConfigurationManager, ExperienceCalculator, Validator,
 * RealmSystem, and MigrationService.
 * 
 * Requirements: 1.1, 2.4, 6.1, 7.1
 */

import {
  Config,
  Node,
  Difficulty,
  TreasureTier,
  ValidationResult,
  CalculationExplanation,
} from './types';
import { ConfigurationManager } from './ConfigurationManager';
import { NodeRegistry } from './NodeRegistry';
import { ExperienceCalculator } from './ExperienceCalculator';
import { Validator } from './Validator';
import { RealmSystem } from './RealmSystem';
import { MigrationService, UserData, MigrationResult, MigrationSummary } from './MigrationService';

/**
 * ExperienceSystem class
 * 
 * Facade that provides a unified interface for all experience system operations.
 * Handles initialization, configuration management, experience calculation,
 * validation, realm progression, and data migration.
 */
export class ExperienceSystem {
  private configManager: ConfigurationManager;
  private nodeRegistry: NodeRegistry;
  private calculator: ExperienceCalculator;
  private validator: Validator;
  private realmSystem: RealmSystem;
  private migrationService: MigrationService;
  private experienceAllocations: Map<string, number>;

  /**
   * Creates a new ExperienceSystem instance
   * 
   * @param config - Configuration object (optional)
   * @param nodes - Array of all nodes in the system (optional)
   */
  constructor(config?: Partial<Config>, nodes?: Node[]) {
    // Initialize configuration manager
    this.configManager = new ConfigurationManager();
    if (config) {
      this.configManager.loadConfig(config);
    }

    // Initialize node registry
    this.nodeRegistry = new NodeRegistry(nodes || []);

    // Initialize calculator
    this.calculator = new ExperienceCalculator(
      this.configManager,
      this.nodeRegistry
    );

    // Initialize validator
    this.validator = new Validator();

    // Initialize realm system
    this.realmSystem = new RealmSystem(this.configManager.getConfig());

    // Initialize migration service
    this.migrationService = new MigrationService(
      this.configManager.getConfig()
    );

    // Calculate initial experience allocations
    this.experienceAllocations = new Map();
    if (nodes && nodes.length > 0) {
      this.recalculateExperience();
    }
  }

  /**
   * Loads configuration from a config object
   * 
   * @param config - Configuration object
   * @throws Error if configuration is invalid
   */
  loadConfiguration(config: Partial<Config>): void {
    this.configManager.loadConfig(config);
    this.recalculateExperience();
  }

  /**
   * Gets the current configuration
   * 
   * @returns Current configuration object
   */
  getConfiguration(): Config {
    return this.configManager.getConfig();
  }

  /**
   * Loads nodes into the system
   * 
   * @param nodes - Array of nodes to load
   */
  loadNodes(nodes: Node[]): void {
    this.nodeRegistry = new NodeRegistry(nodes);
    this.calculator = new ExperienceCalculator(
      this.configManager,
      this.nodeRegistry
    );
    this.recalculateExperience();
  }

  /**
   * Gets all nodes in the system
   * 
   * @returns Array of all nodes
   */
  getNodes(): Node[] {
    return this.nodeRegistry.getAllNodes();
  }

  /**
   * Gets a specific node by ID
   * 
   * @param nodeId - The node ID
   * @returns The node, or undefined if not found
   */
  getNode(nodeId: string): Node | undefined {
    return this.nodeRegistry.getNode(nodeId) || undefined;
  }

  /**
   * Recalculates experience allocations for all nodes
   * 
   * This should be called after configuration changes or node updates.
   */
  recalculateExperience(): void {
    const nodes = this.nodeRegistry.getAllNodes();
    if (nodes.length === 0) {
      this.experienceAllocations = new Map();
      return;
    }

    this.experienceAllocations = this.calculator.calculateAllExperience(nodes);
  }

  /**
   * Gets the experience value for a specific node
   * 
   * @param nodeId - The node ID
   * @returns Experience value, or undefined if node not found
   */
  getNodeExperience(nodeId: string): number | undefined {
    return this.experienceAllocations.get(nodeId);
  }

  /**
   * Gets all experience allocations
   * 
   * @returns Map of node ID to experience value
   */
  getAllExperienceAllocations(): Map<string, number> {
    return new Map(this.experienceAllocations);
  }

  /**
   * Calculates experience for a problem with given difficulty and tags
   * 
   * Useful for previewing experience values before creating nodes.
   * 
   * @param difficulty - Problem difficulty
   * @param tags - Importance tags
   * @returns Calculated experience value (before normalization)
   */
  calculateProblemExperience(difficulty: Difficulty, tags: string[]): number {
    return this.calculator.calculateProblemExperience(difficulty, tags);
  }

  /**
   * Calculates experience for a treasure with given tier
   * 
   * @param tier - Treasure tier
   * @returns Experience value
   */
  calculateTreasureExperience(tier: TreasureTier): number {
    return this.calculator.calculateTreasureExperience(tier);
  }

  /**
   * Explains how a node's experience was calculated
   * 
   * @param nodeId - The node ID
   * @returns Detailed calculation explanation
   */
  explainCalculation(nodeId: string): CalculationExplanation {
    return this.calculator.explainCalculation(nodeId);
  }

  /**
   * Validates the current experience allocations
   * 
   * @returns Validation result with any errors or warnings
   */
  validate(): ValidationResult {
    const nodes = this.nodeRegistry.getAllNodes();
    const config = this.configManager.getConfig();
    return this.validator.validateAll(
      this.experienceAllocations,
      nodes,
      config
    );
  }

  /**
   * Gets the realm thresholds
   * 
   * @returns Array of experience thresholds for each realm
   */
  getRealmThresholds(): number[] {
    return this.realmSystem.getRealmThresholds();
  }

  /**
   * Gets the current realm for a given experience value
   * 
   * @param experience - Total experience
   * @returns Current realm (0-10)
   */
  getCurrentRealm(experience: number): number {
    return this.realmSystem.getCurrentRealm(experience);
  }

  /**
   * Gets the experience needed to reach the next realm
   * 
   * @param experience - Current experience
   * @returns Experience needed for next realm, or 0 if at max realm
   */
  getExperienceToNextRealm(experience: number): number {
    return this.realmSystem.getExperienceToNextRealm(experience);
  }

  /**
   * Gets the progress percentage within the current realm
   * 
   * @param experience - Current experience
   * @returns Progress percentage (0-100)
   */
  getRealmProgress(experience: number): number {
    return this.realmSystem.getRealmProgress(experience);
  }

  /**
   * Gets the level thresholds
   * 
   * @returns Array of experience thresholds for each level (1-100)
   */
  getLevelThresholds(): number[] {
    return this.realmSystem.getLevelThresholds();
  }

  /**
   * Gets the current level for a given experience value
   * 
   * @param experience - Total experience
   * @returns Current level (1-100)
   */
  getCurrentLevel(experience: number): number {
    return this.realmSystem.getCurrentLevel(experience);
  }

  /**
   * Gets the experience needed to reach the next level
   * 
   * @param experience - Current experience
   * @returns Experience needed for next level, or 0 if at max level
   */
  getExperienceToNextLevel(experience: number): number {
    return this.realmSystem.getExperienceToNextLevel(experience);
  }

  /**
   * Gets the progress percentage within the current level
   * 
   * @param experience - Current experience
   * @returns Progress percentage (0.0-1.0)
   */
  getLevelProgress(experience: number): number {
    return this.realmSystem.getLevelProgress(experience);
  }

  /**
   * Migrates a user's experience from the old system to the new system
   * 
   * @param userData - User data with old experience values
   * @param oldRealmConfig - Old system realm configuration
   * @param validNodeIds - Optional set of valid node IDs
   * @returns Migration result with new experience values
   */
  migrateUserExperience(
    userData: UserData,
    oldRealmConfig: { thresholds: number[]; maxExperience: number },
    validNodeIds?: Set<string>
  ): MigrationResult {
    return this.migrationService.migrateUserExperience(
      userData.userId,
      userData.experience,
      oldRealmConfig,
      userData.completedNodes,
      validNodeIds
    );
  }

  /**
   * Migrates multiple users' experience data
   * 
   * @param users - Array of user data
   * @param oldRealmConfig - Old system realm configuration
   * @param validNodeIds - Optional set of valid node IDs
   * @returns Migration summary with results
   */
  migrateAllUsers(
    users: UserData[],
    oldRealmConfig: { thresholds: number[]; maxExperience: number },
    validNodeIds?: Set<string>
  ): MigrationSummary {
    return this.migrationService.migrateAllUsers(users, oldRealmConfig, validNodeIds);
  }

  /**
   * Gets a summary of the experience system state
   * 
   * @returns Summary object with key metrics
   */
  getSummary(): {
    totalNodes: number;
    totalExperience: number;
    problemNodes: number;
    treasureNodes: number;
    averageExperience: number;
    minExperience: number;
    maxExperience: number;
    isValid: boolean;
  } {
    const nodes = this.nodeRegistry.getAllNodes();
    const allocations = Array.from(this.experienceAllocations.values());
    const validation = this.validate();

    return {
      totalNodes: nodes.length,
      totalExperience: allocations.reduce((sum, exp) => sum + exp, 0),
      problemNodes: nodes.filter(n => n.type === 'problem').length,
      treasureNodes: nodes.filter(n => n.type === 'treasure').length,
      averageExperience: allocations.length > 0
        ? allocations.reduce((sum, exp) => sum + exp, 0) / allocations.length
        : 0,
      minExperience: allocations.length > 0 ? Math.min(...allocations) : 0,
      maxExperience: allocations.length > 0 ? Math.max(...allocations) : 0,
      isValid: validation.valid,
    };
  }
}

/**
 * Creates an ExperienceSystem instance with default configuration
 * 
 * @returns A new ExperienceSystem instance
 */
export function createExperienceSystem(): ExperienceSystem {
  return new ExperienceSystem();
}

/**
 * Creates an ExperienceSystem instance from a configuration object
 * 
 * @param config - Configuration object
 * @param nodes - Optional array of nodes
 * @returns A new ExperienceSystem instance
 */
export function createExperienceSystemFromConfig(
  config: Partial<Config>,
  nodes?: Node[]
): ExperienceSystem {
  return new ExperienceSystem(config, nodes);
}
