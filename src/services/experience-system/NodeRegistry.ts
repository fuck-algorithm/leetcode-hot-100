/**
 * Node Registry
 * 
 * Maintains the catalog of all problem and treasure nodes with their metadata.
 * Provides methods for retrieving and filtering nodes by various criteria.
 * 
 * Requirements: 2.1, 4.1
 */

import {
  Node,
  ProblemNode,
  TreasureNode,
  Difficulty,
  TreasureTier,
} from './types';

/**
 * NodeRegistry class
 * 
 * Manages the collection of all nodes in the experience system.
 * Supports loading from JSON data and provides various query methods.
 */
export class NodeRegistry {
  private nodes: Map<string, Node>;

  /**
   * Creates a new NodeRegistry instance
   * 
   * @param nodes - Optional initial array of nodes
   */
  constructor(nodes: Node[] = []) {
    this.nodes = new Map();
    for (const node of nodes) {
      this.nodes.set(node.id, node);
    }
  }

  /**
   * Loads nodes from a JSON data structure
   * 
   * @param data - Array of node objects
   * @returns The NodeRegistry instance for chaining
   */
  loadFromData(data: Node[]): NodeRegistry {
    this.nodes.clear();
    for (const node of data) {
      this.nodes.set(node.id, node);
    }
    return this;
  }

  /**
   * Gets all nodes in the registry
   * 
   * @returns Array of all nodes
   * 
   * Requirements: 2.1, 4.1
   */
  getAllNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Gets a specific node by ID
   * 
   * @param id - The node ID to retrieve
   * @returns The node if found, null otherwise
   * 
   * Requirements: 2.1, 4.1
   */
  getNode(id: string): Node | null {
    return this.nodes.get(id) || null;
  }

  /**
   * Gets all problem nodes
   * 
   * @returns Array of problem nodes only
   * 
   * Requirements: 2.1
   */
  getProblemNodes(): ProblemNode[] {
    return this.getAllNodes().filter(
      (node): node is ProblemNode => node.type === 'problem'
    );
  }

  /**
   * Gets all treasure nodes
   * 
   * @returns Array of treasure nodes only
   * 
   * Requirements: 4.1
   */
  getTreasureNodes(): TreasureNode[] {
    return this.getAllNodes().filter(
      (node): node is TreasureNode => node.type === 'treasure'
    );
  }

  /**
   * Gets problem nodes filtered by difficulty
   * 
   * @param difficulty - The difficulty level to filter by
   * @returns Array of problem nodes with the specified difficulty
   * 
   * Requirements: 2.1
   */
  getNodesByDifficulty(difficulty: Difficulty): ProblemNode[] {
    return this.getProblemNodes().filter(
      (node) => node.difficulty === difficulty
    );
  }

  /**
   * Gets treasure nodes filtered by tier
   * 
   * @param tier - The treasure tier to filter by
   * @returns Array of treasure nodes with the specified tier
   * 
   * Requirements: 4.1
   */
  getNodesByTier(tier: TreasureTier): TreasureNode[] {
    return this.getTreasureNodes().filter(
      (node) => node.tier === tier
    );
  }

  /**
   * Gets problem nodes that have a specific tag
   * 
   * @param tag - The tag to filter by
   * @returns Array of problem nodes with the specified tag
   * 
   * Requirements: 2.1
   */
  getNodesByTag(tag: string): ProblemNode[] {
    return this.getProblemNodes().filter(
      (node) => node.tags.includes(tag)
    );
  }

  /**
   * Gets the total number of nodes in the registry
   * 
   * @returns Total node count
   */
  getNodeCount(): number {
    return this.nodes.size;
  }

  /**
   * Checks if a node with the given ID exists
   * 
   * @param id - The node ID to check
   * @returns True if the node exists, false otherwise
   */
  hasNode(id: string): boolean {
    return this.nodes.has(id);
  }

  /**
   * Adds a node to the registry
   * 
   * @param node - The node to add
   * @returns The NodeRegistry instance for chaining
   */
  addNode(node: Node): NodeRegistry {
    this.nodes.set(node.id, node);
    return this;
  }

  /**
   * Removes a node from the registry
   * 
   * @param id - The ID of the node to remove
   * @returns True if the node was removed, false if it didn't exist
   */
  removeNode(id: string): boolean {
    return this.nodes.delete(id);
  }

  /**
   * Clears all nodes from the registry
   */
  clear(): void {
    this.nodes.clear();
  }
}

/**
 * Creates a NodeRegistry from an array of nodes
 * 
 * @param nodes - Array of nodes to populate the registry
 * @returns A new NodeRegistry instance
 */
export function createNodeRegistry(nodes: Node[]): NodeRegistry {
  return new NodeRegistry(nodes);
}
