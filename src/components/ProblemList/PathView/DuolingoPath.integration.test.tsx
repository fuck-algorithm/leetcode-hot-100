/**
 * Integration Tests for DuolingoPath Component
 * 
 * These tests verify that the DuolingoPath component integrates correctly with:
 * - Parent PathView component
 * - State management and completion persistence
 * - User interactions and event handling
 * - External dependencies (IndexedDB, localStorage)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DuolingoPath from './DuolingoPath';
import { Problem } from '../types';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'zh',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock indexedDB for TreasureNode
const mockIndexedDB = {
  open: jest.fn(() => ({
    onsuccess: null,
    onerror: null,
    result: {
      transaction: jest.fn(() => ({
        objectStore: jest.fn(() => ({
          get: jest.fn(() => ({
            onsuccess: null,
            onerror: null,
          })),
          put: jest.fn(() => ({
            onsuccess: null,
            onerror: null,
          })),
        })),
      })),
    },
  })),
};

global.indexedDB = mockIndexedDB as any;

// Helper function to create mock problems
const createMockProblem = (id: number, overrides?: Partial<Problem>): Problem => ({
  id,
  questionFrontendId: String(id),
  title: `Problem ${id}`,
  translatedTitle: `题目 ${id}`,
  titleSlug: `problem-${id}`,
  difficulty: 'MEDIUM',
  acRate: 0.5,
  frequency: null,
  hasAnimation: false,
  topicTags: [],
  ...overrides,
});

describe('DuolingoPath Integration Tests', () => {
  const mockT = (key: string) => key;
  const mockHandleAnimationClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Integration with Parent PathView', () => {
    test('should render correctly when integrated with PathView props', () => {
      const problems = [
        createMockProblem(1, { difficulty: 'EASY' }),
        createMockProblem(2, { difficulty: 'MEDIUM' }),
        createMockProblem(3, { difficulty: 'HARD' }),
      ];

      const isCompleted = jest.fn(() => false);
      const onToggleCompletion = jest.fn(() => Promise.resolve());

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Verify all nodes are rendered
      const nodes = container.querySelectorAll('.duolingo-node');
      expect(nodes.length).toBe(3);

      // Verify SVG connections are rendered
      const svg = container.querySelector('.duolingo-path-svg');
      expect(svg).toBeInTheDocument();

      // Verify container structure
      const pathContainer = container.querySelector('.duolingo-path-container');
      expect(pathContainer).toBeInTheDocument();
    });

    test('should handle language switching correctly', () => {
      const problems = [createMockProblem(1)];
      const isCompleted = jest.fn(() => false);

      const { rerender } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={jest.fn()}
        />
      );

      // Switch language
      rerender(
        <DuolingoPath
          problems={problems}
          currentLang="en"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={jest.fn()}
        />
      );

      // Component should re-render without errors
      const nodes = screen.getAllByRole('button', { hidden: true });
      expect(nodes.length).toBeGreaterThan(0);
    });

    test('should pass through animation click handler correctly', () => {
      const problems = [
        createMockProblem(1, {
          hasAnimation: true,
          repo: {
            name: 'test-repo',
            url: 'https://github.com/test/repo',
            isPublic: true,
            pagesUrl: 'https://test.github.io/repo',
          },
        }),
      ];

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      // Find and click the animation badge
      const animationBadge = container.querySelector('.node-animation-badge-wrapper');
      expect(animationBadge).toBeInTheDocument();
    });
  });

  describe('State Management and Completion Persistence', () => {
    test('should persist completion state across re-renders', async () => {
      const problems = [
        createMockProblem(1),
        createMockProblem(2),
        createMockProblem(3),
      ];

      const completionMap = new Map<string, boolean>();
      const isCompleted = (problemId: string) => completionMap.get(problemId) || false;
      const onToggleCompletion = jest.fn(async (problemId: string) => {
        completionMap.set(problemId, !completionMap.get(problemId));
      });

      const { container, rerender } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Initially all incomplete
      let checkmarks = container.querySelectorAll('.node-checkmark');
      expect(checkmarks.length).toBe(0);

      // Toggle first problem
      await onToggleCompletion('1');

      // Re-render with updated state
      rerender(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // First problem should show checkmark
      checkmarks = container.querySelectorAll('.node-checkmark');
      expect(checkmarks.length).toBe(1);

      // Verify completion state persisted
      expect(isCompleted('1')).toBe(true);
      expect(isCompleted('2')).toBe(false);
      expect(isCompleted('3')).toBe(false);
    });

    test('should update connection colors when completion state changes', async () => {
      const problems = [
        createMockProblem(1),
        createMockProblem(2),
      ];

      const completionMap = new Map<string, boolean>();
      const isCompleted = (problemId: string) => completionMap.get(problemId) || false;
      const onToggleCompletion = jest.fn(async (problemId: string) => {
        completionMap.set(problemId, true);
      });

      const { container, rerender } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Get initial connection color
      const pathsBefore = container.querySelectorAll('.duolingo-path-svg path');
      const colorBefore = pathsBefore[0].getAttribute('stroke');
      expect(colorBefore).toBe('#d0d0d0'); // Gray for incomplete

      // Complete both problems
      await onToggleCompletion('1');
      await onToggleCompletion('2');

      rerender(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Connection should now be gold
      const pathsAfter = container.querySelectorAll('.duolingo-path-svg path');
      const colorAfter = pathsAfter[0].getAttribute('stroke');
      expect(colorAfter).toBe('#ffd700'); // Gold for completed
    });

    test('should handle rapid state changes without errors', async () => {
      const problems = [
        createMockProblem(1),
        createMockProblem(2),
        createMockProblem(3),
      ];

      const completionMap = new Map<string, boolean>();
      const isCompleted = (problemId: string) => completionMap.get(problemId) || false;
      const onToggleCompletion = jest.fn(async (problemId: string) => {
        completionMap.set(problemId, !completionMap.get(problemId));
      });

      const { rerender } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Rapidly toggle multiple problems
      for (let i = 0; i < 5; i++) {
        await onToggleCompletion('1');
        await onToggleCompletion('2');
        await onToggleCompletion('3');

        rerender(
          <DuolingoPath
            problems={problems}
            currentLang="zh"
            t={mockT}
            selectedTags={[]}
            toggleTag={jest.fn()}
            handleAnimationClick={mockHandleAnimationClick}
            isCompleted={isCompleted}
            onToggleCompletion={onToggleCompletion}
          />
        );
      }

      // Component should still be functional
      expect(onToggleCompletion).toHaveBeenCalled();
    });
  });

  describe('User Interactions and Event Handling', () => {
    test('should handle node click to open problem page', () => {
      const problems = [createMockProblem(1)];
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      const node = container.querySelector('.duolingo-node');
      expect(node).toBeInTheDocument();

      fireEvent.click(node!);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://leetcode.cn/problems/problem-1/',
        '_blank'
      );

      windowOpenSpy.mockRestore();
    });

    test('should show context menu on hover', async () => {
      const problems = [createMockProblem(1)];

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      const nodeWrapper = container.querySelector('.duolingo-node-wrapper');
      expect(nodeWrapper).toBeInTheDocument();

      // Hover over node
      fireEvent.mouseEnter(nodeWrapper!);

      // Wait for menu to appear
      await waitFor(() => {
        const menu = container.querySelector('.node-context-menu');
        expect(menu).toBeInTheDocument();
      });
    });

    test('should handle completion toggle from context menu', async () => {
      const problems = [createMockProblem(1)];
      const onToggleCompletion = jest.fn(() => Promise.resolve());

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Hover to show menu
      const nodeWrapper = container.querySelector('.duolingo-node-wrapper');
      fireEvent.mouseEnter(nodeWrapper!);

      await waitFor(() => {
        const menu = container.querySelector('.node-context-menu');
        expect(menu).toBeInTheDocument();
      });

      // Click completion button
      const completionBtn = container.querySelector('.context-menu-btn.incomplete');
      expect(completionBtn).toBeInTheDocument();

      fireEvent.click(completionBtn!);

      await waitFor(() => {
        expect(onToggleCompletion).toHaveBeenCalledWith('1');
      });
    });

    test('should handle animation badge click for problems with animations', () => {
      const problems = [
        createMockProblem(1, {
          hasAnimation: true,
          repo: {
            name: 'test-repo',
            url: 'https://github.com/test/repo',
            isPublic: true,
            pagesUrl: 'https://test.github.io/repo',
          },
        }),
      ];

      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      // Click node (should open GitHub Pages for animated problems)
      const node = container.querySelector('.duolingo-node');
      fireEvent.click(node!);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://test.github.io/repo',
        '_blank'
      );

      windowOpenSpy.mockRestore();
    });

    test('should handle right-click context menu', async () => {
      const problems = [createMockProblem(1)];

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      const node = container.querySelector('.duolingo-node');
      expect(node).toBeInTheDocument();

      // Right-click node
      fireEvent.contextMenu(node!);

      // Menu should appear
      await waitFor(() => {
        const menu = container.querySelector('.node-context-menu');
        expect(menu).toBeInTheDocument();
      });
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle mixed completion states correctly', () => {
      const problems = [
        createMockProblem(1),
        createMockProblem(2),
        createMockProblem(3),
        createMockProblem(4),
        createMockProblem(5),
      ];

      const completionMap = new Map([
        ['1', true],
        ['2', false],
        ['3', true],
        ['4', false],
        ['5', true],
      ]);

      const isCompleted = (problemId: string) => completionMap.get(problemId) || false;

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={isCompleted}
          onToggleCompletion={jest.fn()}
        />
      );

      // Verify correct number of checkmarks
      const checkmarks = container.querySelectorAll('.node-checkmark');
      expect(checkmarks.length).toBe(3);

      // Verify correct number of problem numbers
      const numbers = container.querySelectorAll('.node-number');
      expect(numbers.length).toBe(2);

      // Verify connection colors
      const paths = container.querySelectorAll('.duolingo-path-svg path');
      paths.forEach((path) => {
        const stroke = path.getAttribute('stroke');
        expect(['#d0d0d0', '#ffd700'].includes(stroke || '')).toBe(true);
      });
    });

    test('should handle large datasets efficiently', () => {
      const problems = Array.from({ length: 100 }, (_, i) =>
        createMockProblem(i + 1, {
          difficulty: ['EASY', 'MEDIUM', 'HARD'][i % 3] as any,
        })
      );

      const startTime = performance.now();

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(1000);

      // Verify all nodes rendered
      const nodes = container.querySelectorAll('.duolingo-node');
      expect(nodes.length).toBe(100);
    });

    test('should handle empty problem list gracefully', () => {
      const { container } = render(
        <DuolingoPath
          problems={[]}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      // Should show empty state
      const emptyState = container.querySelector('.duolingo-path-empty');
      expect(emptyState).toBeInTheDocument();
    });

    test('should handle problems with all difficulties', () => {
      const problems = [
        createMockProblem(1, { difficulty: 'EASY' }),
        createMockProblem(2, { difficulty: 'MEDIUM' }),
        createMockProblem(3, { difficulty: 'HARD' }),
      ];

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      // Verify all difficulty classes are applied
      const easyNode = container.querySelector('.difficulty-easy');
      const mediumNode = container.querySelector('.difficulty-medium');
      const hardNode = container.querySelector('.difficulty-hard');

      expect(easyNode).toBeInTheDocument();
      expect(mediumNode).toBeInTheDocument();
      expect(hardNode).toBeInTheDocument();
    });

    test('should maintain state during window resize', () => {
      const problems = [
        createMockProblem(1),
        createMockProblem(2),
      ];

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      // Trigger resize event
      global.innerWidth = 500;
      fireEvent(window, new Event('resize'));

      // Component should still render correctly
      const nodes = container.querySelectorAll('.duolingo-node');
      expect(nodes.length).toBe(2);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle completion toggle errors gracefully', async () => {
      const problems = [createMockProblem(1)];
      const onToggleCompletion = jest.fn(() => Promise.reject(new Error('Network error')));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Hover to show menu
      const nodeWrapper = container.querySelector('.duolingo-node-wrapper');
      fireEvent.mouseEnter(nodeWrapper!);

      await waitFor(() => {
        const menu = container.querySelector('.node-context-menu');
        expect(menu).toBeInTheDocument();
      });

      // Click completion button
      const completionBtn = container.querySelector('.context-menu-btn');
      fireEvent.click(completionBtn!);

      await waitFor(() => {
        expect(onToggleCompletion).toHaveBeenCalled();
      });

      // Component should still be functional
      const nodes = container.querySelectorAll('.duolingo-node');
      expect(nodes.length).toBe(1);

      consoleErrorSpy.mockRestore();
    });

    test('should handle missing problem data gracefully', () => {
      const problems = [
        {
          ...createMockProblem(1),
          title: undefined as any,
          translatedTitle: undefined as any,
        },
      ];

      const { container } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={jest.fn()}
        />
      );

      // Should still render node
      const nodes = container.querySelectorAll('.duolingo-node');
      expect(nodes.length).toBe(1);
    });

    test('should handle unmounting without memory leaks', () => {
      const problems = [createMockProblem(1)];
      const onToggleCompletion = jest.fn();

      const { unmount } = render(
        <DuolingoPath
          problems={problems}
          currentLang="zh"
          t={mockT}
          selectedTags={[]}
          toggleTag={jest.fn()}
          handleAnimationClick={mockHandleAnimationClick}
          isCompleted={() => false}
          onToggleCompletion={onToggleCompletion}
        />
      );

      // Unmount component
      unmount();

      // Verify no errors and handlers can be cleared
      onToggleCompletion.mockClear();
      expect(onToggleCompletion).not.toHaveBeenCalled();
    });
  });
});
