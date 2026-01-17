/**
 * Test setup and configuration for the Experience System
 * 
 * This file configures Jest and fast-check for testing the experience
 * value rebalance system.
 */

import '@testing-library/jest-dom';

/**
 * Global test configuration
 */
export const TEST_CONFIG = {
  // Property-based test configuration
  propertyTests: {
    numRuns: 100,  // Minimum number of iterations for property tests
    verbose: false,
  },
  
  // Test data constants
  constants: {
    TOTAL_EXPERIENCE: 1_000_000,
    NUM_REALMS: 11,
    MAX_NODE_PERCENTAGE: 0.05,
  },
};

/**
 * Helper function to suppress console output during tests
 * Useful for testing error conditions without cluttering test output
 */
export function suppressConsole() {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
}

/**
 * Helper to create a mock configuration for testing
 */
export function createMockConfig() {
  return {
    totalExperience: 1_000_000,
    difficultyBaseValues: {
      easy: 5000,
      medium: 8000,
      hard: 12000,
    },
    importanceMultipliers: {
      highFrequencyInterview: 1.3,
      classicAlgorithm: 1.2,
      hasAnimation: 1.15,
    },
    treasureTierValues: {
      early: 15000,
      mid: 25000,
      late: 35000,
      final: 50000,
    },
    realmThresholds: [
      0,
      50000,
      120000,
      220000,
      350000,
      500000,
      650000,
      780000,
      880000,
      950000,
      1000000,
    ],
    constraints: {
      maxSingleNodePercentage: 0.05,
      minNodeExperience: 1,
    },
  };
}
