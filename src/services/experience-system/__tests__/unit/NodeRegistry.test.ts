/**
 * Unit tests for NodeRegistry
 * 
 * Tests node storage, retrieval, and filtering functionality.
 * Requirements: 2.1, 4.1
 */

import { NodeRegistry, createNodeRegistry } from '../../NodeRegistry';
import { Node, ProblemNode, TreasureNode } from '../../types';

describe('NodeRegistry', () => {
  // Sample test data
  const sampleProblemNodes: ProblemNode[] = [
    {
      id: 'p1',
      type: 'problem',
      difficulty: 'easy',
      tags: ['highFrequencyInterview'],
      title: 'Two Sum',
    },
    {
      id: 'p2',
      type: 'problem',
      difficulty: 'medium',
      tags: ['classicAlgorithm', 'hasAnimation'],
      title: 'Add Two Numbers',
    },
    {
      id: 'p3',
      type: 'problem',
      difficulty: 'hard',
      tags: ['highFrequencyInterview', 'classicAlgorithm'],
      title: 'Median of Two Sorted Arrays',
    },
    {
      id: 'p4',
      type: 'problem',
      difficulty: 'easy',
      tags: [],
      title: 'Palindrome Number',
    },
    {
      id: 'p5',
      type: 'problem',
      difficulty: 'medium',
      tags: ['hasAnimation'],
      title: 'Longest Substring',
    },
  ];

  const sampleTreasureNodes: TreasureNode[] = [
    {
      id: 't1',
      type: 'treasure',
      tier: 'early',
      position: 10,
    },
    {
      id: 't2',
      type: 'treasure',
      tier: 'mid',
      position: 50,
    },
    {
      id: 't3',
      type: 'treasure',
      tier: 'late',
      position: 80,
    },
    {
      id: 't4',
      type: 'treasure',
      tier: 'final',
      position: 100,
    },
  ];

  const allSampleNodes: Node[] = [...sampleProblemNodes, ...sampleTreasureNodes];

  describe('constructor', () => {
    it('should create empty registry when no nodes provided', () => {
      const registry = new NodeRegistry();
      
      expect(registry.getNodeCount()).toBe(0);
      expect(registry.getAllNodes()).toEqual([]);
    });

    it('should create registry with provided nodes', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      expect(registry.getNodeCount()).toBe(9);
      expect(registry.getAllNodes()).toHaveLength(9);
    });
  });

  describe('loadFromData', () => {
    it('should load nodes from data array', () => {
      const registry = new NodeRegistry();
      registry.loadFromData(allSampleNodes);
      
      expect(registry.getNodeCount()).toBe(9);
    });

    it('should replace existing nodes when loading new data', () => {
      const registry = new NodeRegistry(sampleProblemNodes);
      expect(registry.getNodeCount()).toBe(5);
      
      registry.loadFromData(sampleTreasureNodes);
      expect(registry.getNodeCount()).toBe(4);
      expect(registry.getProblemNodes()).toHaveLength(0);
      expect(registry.getTreasureNodes()).toHaveLength(4);
    });

    it('should return registry instance for chaining', () => {
      const registry = new NodeRegistry();
      const result = registry.loadFromData(allSampleNodes);
      
      expect(result).toBe(registry);
    });
  });

  describe('getAllNodes', () => {
    it('should return all nodes in the registry', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const nodes = registry.getAllNodes();
      
      expect(nodes).toHaveLength(9);
      expect(nodes).toEqual(expect.arrayContaining(allSampleNodes));
    });

    it('should return empty array for empty registry', () => {
      const registry = new NodeRegistry();
      
      expect(registry.getAllNodes()).toEqual([]);
    });
  });

  describe('getNode', () => {
    it('should return node when it exists', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      const node = registry.getNode('p1');
      expect(node).not.toBeNull();
      expect(node?.id).toBe('p1');
      expect(node?.type).toBe('problem');
    });

    it('should return null when node does not exist', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      const node = registry.getNode('nonexistent');
      expect(node).toBeNull();
    });

    it('should return treasure node correctly', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      const node = registry.getNode('t1');
      expect(node).not.toBeNull();
      expect(node?.type).toBe('treasure');
      if (node?.type === 'treasure') {
        expect(node.tier).toBe('early');
      }
    });
  });

  describe('getProblemNodes', () => {
    it('should return only problem nodes', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const problems = registry.getProblemNodes();
      
      expect(problems).toHaveLength(5);
      expect(problems.every(node => node.type === 'problem')).toBe(true);
    });

    it('should return empty array when no problem nodes exist', () => {
      const registry = new NodeRegistry(sampleTreasureNodes);
      
      expect(registry.getProblemNodes()).toEqual([]);
    });
  });

  describe('getTreasureNodes', () => {
    it('should return only treasure nodes', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const treasures = registry.getTreasureNodes();
      
      expect(treasures).toHaveLength(4);
      expect(treasures.every(node => node.type === 'treasure')).toBe(true);
    });

    it('should return empty array when no treasure nodes exist', () => {
      const registry = new NodeRegistry(sampleProblemNodes);
      
      expect(registry.getTreasureNodes()).toEqual([]);
    });
  });

  describe('getNodesByDifficulty', () => {
    it('should return nodes with easy difficulty', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const easyNodes = registry.getNodesByDifficulty('easy');
      
      expect(easyNodes).toHaveLength(2);
      expect(easyNodes.every(node => node.difficulty === 'easy')).toBe(true);
    });

    it('should return nodes with medium difficulty', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const mediumNodes = registry.getNodesByDifficulty('medium');
      
      expect(mediumNodes).toHaveLength(2);
      expect(mediumNodes.every(node => node.difficulty === 'medium')).toBe(true);
    });

    it('should return nodes with hard difficulty', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const hardNodes = registry.getNodesByDifficulty('hard');
      
      expect(hardNodes).toHaveLength(1);
      expect(hardNodes[0].id).toBe('p3');
    });

    it('should return empty array when no nodes match difficulty', () => {
      const registry = new NodeRegistry(sampleTreasureNodes);
      
      expect(registry.getNodesByDifficulty('easy')).toEqual([]);
    });
  });

  describe('getNodesByTier', () => {
    it('should return nodes with early tier', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const earlyNodes = registry.getNodesByTier('early');
      
      expect(earlyNodes).toHaveLength(1);
      expect(earlyNodes[0].tier).toBe('early');
    });

    it('should return nodes with mid tier', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const midNodes = registry.getNodesByTier('mid');
      
      expect(midNodes).toHaveLength(1);
      expect(midNodes[0].tier).toBe('mid');
    });

    it('should return nodes with late tier', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const lateNodes = registry.getNodesByTier('late');
      
      expect(lateNodes).toHaveLength(1);
      expect(lateNodes[0].tier).toBe('late');
    });

    it('should return nodes with final tier', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const finalNodes = registry.getNodesByTier('final');
      
      expect(finalNodes).toHaveLength(1);
      expect(finalNodes[0].tier).toBe('final');
    });

    it('should return empty array when no nodes match tier', () => {
      const registry = new NodeRegistry(sampleProblemNodes);
      
      expect(registry.getNodesByTier('early')).toEqual([]);
    });
  });

  describe('getNodesByTag', () => {
    it('should return nodes with highFrequencyInterview tag', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const nodes = registry.getNodesByTag('highFrequencyInterview');
      
      expect(nodes).toHaveLength(2);
      expect(nodes.every(node => node.tags.includes('highFrequencyInterview'))).toBe(true);
    });

    it('should return nodes with hasAnimation tag', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const nodes = registry.getNodesByTag('hasAnimation');
      
      expect(nodes).toHaveLength(2);
      expect(nodes.every(node => node.tags.includes('hasAnimation'))).toBe(true);
    });

    it('should return empty array when no nodes have the tag', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      expect(registry.getNodesByTag('nonexistentTag')).toEqual([]);
    });

    it('should return empty array for empty registry', () => {
      const registry = new NodeRegistry();
      
      expect(registry.getNodesByTag('anyTag')).toEqual([]);
    });
  });

  describe('getNodeCount', () => {
    it('should return correct count for populated registry', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      expect(registry.getNodeCount()).toBe(9);
    });

    it('should return 0 for empty registry', () => {
      const registry = new NodeRegistry();
      
      expect(registry.getNodeCount()).toBe(0);
    });
  });

  describe('hasNode', () => {
    it('should return true when node exists', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      expect(registry.hasNode('p1')).toBe(true);
      expect(registry.hasNode('t1')).toBe(true);
    });

    it('should return false when node does not exist', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      expect(registry.hasNode('nonexistent')).toBe(false);
    });
  });

  describe('addNode', () => {
    it('should add a new node to the registry', () => {
      const registry = new NodeRegistry();
      const newNode: ProblemNode = {
        id: 'new1',
        type: 'problem',
        difficulty: 'easy',
        tags: [],
        title: 'New Problem',
      };
      
      registry.addNode(newNode);
      
      expect(registry.getNodeCount()).toBe(1);
      expect(registry.getNode('new1')).toEqual(newNode);
    });

    it('should replace existing node with same ID', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const updatedNode: ProblemNode = {
        id: 'p1',
        type: 'problem',
        difficulty: 'hard',
        tags: ['updated'],
        title: 'Updated Problem',
      };
      
      registry.addNode(updatedNode);
      
      expect(registry.getNodeCount()).toBe(9); // Same count
      expect(registry.getNode('p1')).toEqual(updatedNode);
    });

    it('should return registry instance for chaining', () => {
      const registry = new NodeRegistry();
      const newNode: ProblemNode = {
        id: 'new1',
        type: 'problem',
        difficulty: 'easy',
        tags: [],
        title: 'New Problem',
      };
      
      const result = registry.addNode(newNode);
      
      expect(result).toBe(registry);
    });
  });

  describe('removeNode', () => {
    it('should remove existing node and return true', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      const result = registry.removeNode('p1');
      
      expect(result).toBe(true);
      expect(registry.getNodeCount()).toBe(8);
      expect(registry.hasNode('p1')).toBe(false);
    });

    it('should return false when node does not exist', () => {
      const registry = new NodeRegistry(allSampleNodes);
      
      const result = registry.removeNode('nonexistent');
      
      expect(result).toBe(false);
      expect(registry.getNodeCount()).toBe(9);
    });
  });

  describe('clear', () => {
    it('should remove all nodes from registry', () => {
      const registry = new NodeRegistry(allSampleNodes);
      expect(registry.getNodeCount()).toBe(9);
      
      registry.clear();
      
      expect(registry.getNodeCount()).toBe(0);
      expect(registry.getAllNodes()).toEqual([]);
    });

    it('should work on empty registry', () => {
      const registry = new NodeRegistry();
      
      registry.clear();
      
      expect(registry.getNodeCount()).toBe(0);
    });
  });

  describe('factory function', () => {
    it('createNodeRegistry should create registry with nodes', () => {
      const registry = createNodeRegistry(allSampleNodes);
      
      expect(registry.getNodeCount()).toBe(9);
      expect(registry).toBeInstanceOf(NodeRegistry);
    });
  });

  describe('edge cases', () => {
    it('should handle nodes with empty tags array', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const node = registry.getNode('p4');
      
      expect(node).not.toBeNull();
      if (node?.type === 'problem') {
        expect(node.tags).toEqual([]);
      }
    });

    it('should handle nodes with multiple tags', () => {
      const registry = new NodeRegistry(allSampleNodes);
      const node = registry.getNode('p2');
      
      expect(node).not.toBeNull();
      if (node?.type === 'problem') {
        expect(node.tags).toHaveLength(2);
        expect(node.tags).toContain('classicAlgorithm');
        expect(node.tags).toContain('hasAnimation');
      }
    });

    it('should handle filtering when all nodes match', () => {
      const easyNodes = sampleProblemNodes.filter(n => n.difficulty === 'easy');
      const registry = new NodeRegistry(easyNodes);
      
      const result = registry.getNodesByDifficulty('easy');
      expect(result).toHaveLength(easyNodes.length);
    });

    it('should handle filtering when no nodes match', () => {
      const easyNodes = sampleProblemNodes.filter(n => n.difficulty === 'easy');
      const registry = new NodeRegistry(easyNodes);
      
      const result = registry.getNodesByDifficulty('hard');
      expect(result).toEqual([]);
    });
  });
});
