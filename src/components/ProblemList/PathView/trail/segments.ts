/**
 * 分段与宝箱计算
 *
 * 每一段题目的末尾放一个宝箱，最后一段之后放终点宝箱。
 */
import { Problem } from '../../types';

/** 每段的题目数量 */
export const SEGMENT_SIZE = 5;
/** 分段之间的额外间距（给宝箱留位置） */
export const SEGMENT_GAP = 176;

export interface Segment {
  startIndex: number;
  endIndex: number;
  completedCount: number;
  isComplete: boolean;
}

export interface SegmentInfo {
  segmentCount: number;
  segments: Segment[];
  segmentSizes: number[];
}

/**
 * 把总题数切成若干段，避免最后一段太短。
 */
export const calculateSegments = (totalProblems: number): number[] => {
  if (totalProblems <= 0) return [];
  if (totalProblems <= 5) return [totalProblems];

  if (totalProblems <= 7) {
    const firstHalf = Math.floor(totalProblems / 2);
    return [firstHalf, totalProblems - firstHalf];
  }

  const segments: number[] = [];
  let remaining = totalProblems;

  while (remaining > 0) {
    if (remaining <= 7) {
      if (remaining <= 5) {
        segments.push(remaining);
      } else {
        const firstHalf = Math.floor(remaining / 2);
        segments.push(firstHalf);
        segments.push(remaining - firstHalf);
      }
      break;
    }
    segments.push(SEGMENT_SIZE);
    remaining -= SEGMENT_SIZE;
  }

  return segments;
};

export const buildSegmentInfo = (
  problems: Problem[],
  isCompleted: (problemId: string) => boolean
): SegmentInfo => {
  const segmentSizes = calculateSegments(problems.length);
  const segments: Segment[] = [];

  let currentIndex = 0;
  segmentSizes.forEach(size => {
    const startIndex = currentIndex;
    const endIndex = currentIndex + size - 1;
    let completedCount = 0;

    for (let i = startIndex; i <= endIndex; i++) {
      if (isCompleted(problems[i].questionFrontendId)) {
        completedCount++;
      }
    }

    segments.push({
      startIndex,
      endIndex,
      completedCount,
      isComplete: completedCount === size,
    });
    currentIndex = endIndex + 1;
  });

  return { segmentCount: segments.length, segments, segmentSizes };
};

/**
 * 某个节点之前一共有几个宝箱（最后一个分段后面是终点宝箱，不算在内）。
 */
export const getTreasureCountBefore = (segments: Segment[], index: number): number => {
  let count = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    if (index > segments[i].endIndex) count++;
  }
  return count;
};
