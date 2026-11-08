import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Problem } from '../types';
import TreasureNode from './TreasureNode';
import ClickBehaviorSettings from './ClickBehaviorSettings';
import ProblemNode from './ProblemNode';
import TrailConnectors, { TrailConnection } from './trail/TrailConnectors';
import { useElementWidth } from './trail/useElementWidth';
import { useNodeMenu } from './trail/useNodeMenu';
import {
  buildDetailPosition,
  buildWindingConnectorPath,
  getWindingStyle,
  midpoint,
} from './trail/geometry';
import {
  SEGMENT_GAP,
  buildSegmentInfo,
  getTreasureCountBefore,
} from './trail/segments';
import { getClickBehavior, handleNodeClickWithBehavior } from './settings';
import './DuolingoPath.css';

interface DuolingoPathProps {
  problems: Problem[];
  allProblems?: Problem[]; // 原始完整题目列表，用于宝箱判断
  currentLang: string;
  t: (key: string) => string;
  selectedTags: string[];
  toggleTag: (tagSlug: string) => void;
  handleAnimationClick: (
    event: React.MouseEvent,
    questionId: string,
    hasAnimation: boolean,
    title?: string,
    t?: (key: string) => string,
    pagesUrl?: string | null
  ) => void;
  isCompleted: (problemId: string) => boolean;
  onToggleCompletion: (problemId: string) => Promise<void>;
  pathId?: string; // 用于生成唯一的宝箱ID
}

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'difficulty-easy';
    case 'MEDIUM':
      return 'difficulty-medium';
    case 'HARD':
      return 'difficulty-hard';
    default:
      return 'difficulty-medium';
  }
};

const DuolingoPath: React.FC<DuolingoPathProps> = ({
  problems,
  allProblems,
  currentLang,
  t,
  isCompleted,
  onToggleCompletion,
  pathId = 'default',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef, 500);
  const {
    expandedNodeId,
    openMenu,
    closeMenu,
    hideMenuWithDelay,
    clearHideTimeout,
  } = useNodeMenu();

  const [isTogglingCompletion, setIsTogglingCompletion] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const originalProblems = allProblems || problems;

  /**
   * 完成状态的快照。isCompleted 的引用可能保持不变（例如测试或外部 Map），
   * 只依赖函数引用会导致完成状态变化后 memo 不刷新，这里显式把结果纳入依赖。
   */
  const completionSignature = problems
    .map(problem => (isCompleted(problem.questionFrontendId) ? '1' : '0'))
    .join('');
  const originalCompletionSignature = originalProblems
    .map(problem => (isCompleted(problem.questionFrontendId) ? '1' : '0'))
    .join('');

  /**
   * 筛选/难度过滤时不显示宝箱，也不保留宝箱占位，避免路径出现大片空白。
   */
  const showTreasures = useMemo(
    () => problems.length > 0 && problems.length === originalProblems.length,
    [problems.length, originalProblems.length]
  );

  const segmentInfo = useMemo(
    () => buildSegmentInfo(problems, isCompleted),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [problems, isCompleted, completionSignature]
  );

  const originalSegmentInfo = useMemo(
    () => buildSegmentInfo(originalProblems, isCompleted),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [originalProblems, isCompleted, originalCompletionSignature]
  );

  const allProblemsCompleted = useMemo(
    () =>
      originalProblems.length > 0 &&
      originalCompletionSignature.length > 0 &&
      !originalCompletionSignature.includes('0'),
    [originalProblems.length, originalCompletionSignature]
  );

  /** 当前进度节点：第一个尚未完成的题目 */
  const currentIndex = useMemo(
    () => completionSignature.indexOf('0'),
    [completionSignature]
  );

  /** 该路径专属的蜿蜒风格：每条路径的曲线性格都不同 */
  const windingStyle = useMemo(() => getWindingStyle(pathId), [pathId]);

  const isSegmentEnd = useCallback(
    (index: number) => {
      if (index >= problems.length - 1) return false;
      return segmentInfo.segments.some(segment => segment.endIndex === index);
    },
    [segmentInfo.segments, problems.length]
  );

  const getSegmentIndex = useCallback(
    (index: number) => {
      for (let i = 0; i < segmentInfo.segments.length; i++) {
        const segment = segmentInfo.segments[i];
        if (index >= segment.startIndex && index <= segment.endIndex) return i;
      }
      return 0;
    },
    [segmentInfo.segments]
  );

  /** 统一计算节点、宝箱、终点和容器高度 */
  const layout = useMemo(() => {
    const width = containerWidth;
    const compact = width < 480;
    // 纵向基础间距：路口离得远，段内才有空间反复缠绕。
    // 每条路径再乘上自己的 spacingScale，长度各不相同（见 geometry）。
    const spacing = compact ? 260 : 360;
    // 摆动幅度决定路径的舒展程度：太小时路径缩成中间一条细线，
    // 放大后节点分布到容器两侧，蜿蜒的形态才看得出来。
    const amplitude = compact ? 110 : 210;
    const startY = 40;
    const segmentGap = showTreasures ? SEGMENT_GAP : 0;
    const treasuresBefore = (index: number) =>
      showTreasures ? getTreasureCountBefore(segmentInfo.segments, index) : 0;

    const positionAt = (index: number) =>
      buildDetailPosition(index, {
        width,
        segmentGap,
        treasuresBefore,
        startY,
        spacing,
        amplitude,
        style: windingStyle,
      });

    const nodes = problems.map((_, index) => positionAt(index));

    const treasures = showTreasures
      ? segmentInfo.segments.slice(0, -1).map((segment, segmentIndex) => {
          const from = positionAt(segment.endIndex);
          const to = positionAt(segment.endIndex + 1);
          return {
            ...midpoint(from, to),
            segmentIndex,
          };
        })
      : [];

    const lastNode = nodes[nodes.length - 1];
    const endpoint = lastNode
      ? { x: width / 2, y: lastNode.y + spacing + 8 }
      : null;

    const height = endpoint
      ? endpoint.y + 170
      : lastNode
        ? lastNode.y + 140
        : 240;

    return { nodes, treasures, endpoint, height };
  }, [containerWidth, problems, segmentInfo.segments, showTreasures, windingStyle]);

  /** 连接线：普通段直接相连；分段末尾从宝箱顶部进、底部出。全部使用蜿蜒曲线 */
  const connections = useMemo<TrailConnection[]>(() => {
    const result: TrailConnection[] = [];
    const { nodes, treasures, endpoint } = layout;
    // 曲线与节点保持同一套安全边界，避免波浪顶到容器边缘被削平
    const bounds = { minX: 14, maxX: Math.max(14, containerWidth - 14) };
    // 段内波幅预算：比节点摆幅更宽，让弯头和回环能绕到节点外侧去
    const waveAmplitude =
      containerWidth < 480
        ? containerWidth / 2 - 20
        : Math.min(containerWidth / 2 - 14, 320);
    const winding = (index: number) =>
      ({
        style: windingStyle,
        edgeIndex: index,
        amplitude: waveAmplitude,
        ...bounds,
      }) as const;

    for (let i = 0; i < problems.length - 1; i++) {
      const currentCompleted = isCompleted(problems[i].questionFrontendId);
      const nextCompleted = isCompleted(problems[i + 1].questionFrontendId);

      if (showTreasures && isSegmentEnd(i)) {
        const segmentIndex = getSegmentIndex(i);
        const treasure = treasures[segmentIndex];
        const originalSegment = originalSegmentInfo.segments[segmentIndex];

        if (treasure) {
          result.push({
            key: `path-${i}-a`,
            d: buildWindingConnectorPath(
              nodes[i],
              treasure,
              nodes[i - 1] ?? null,
              nodes[i + 1],
              winding(i)
            ),
            completed: currentCompleted,
          });
          result.push({
            key: `path-${i}-b`,
            d: buildWindingConnectorPath(
              treasure,
              nodes[i + 1],
              nodes[i],
              nodes[i + 2] ?? null,
              winding(i + 1)
            ),
            completed:
              Boolean(originalSegment?.isComplete) && nextCompleted,
          });
          continue;
        }
      }

      result.push({
        key: `path-${i}`,
        d: buildWindingConnectorPath(
          nodes[i],
          nodes[i + 1],
          nodes[i - 1] ?? null,
          nodes[i + 2] ?? null,
          winding(i)
        ),
        completed: currentCompleted && nextCompleted,
      });
    }

    const lastNode = nodes[nodes.length - 1];
    if (lastNode && endpoint) {
      result.push({
        key: 'path-to-endpoint',
        d: buildWindingConnectorPath(
          lastNode,
          endpoint,
          nodes[nodes.length - 2] ?? null,
          null,
          winding(problems.length)
        ),
        completed: isCompleted(problems[problems.length - 1].questionFrontendId),
      });
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    layout,
    problems,
    isCompleted,
    completionSignature,
    showTreasures,
    isSegmentEnd,
    getSegmentIndex,
    originalSegmentInfo.segments,
    windingStyle,
    containerWidth,
  ]);

  const handleActivate = useCallback((problem: Problem) => {
    handleNodeClickWithBehavior(getClickBehavior(), problem);
  }, []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, problem: Problem) => {
      event.preventDefault();
      event.stopPropagation();
      openMenu(problem.questionFrontendId);
    },
    [openMenu]
  );

  const handleMouseEnter = useCallback(
    (problemId: string) => openMenu(problemId),
    [openMenu]
  );

  const handleToggleCompletion = useCallback(
    async (problem: Problem, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (isTogglingCompletion) return;

      setIsTogglingCompletion(true);
      try {
        await onToggleCompletion(problem.questionFrontendId);
      } catch (error) {
        console.error('切换完成状态失败:', error);
      } finally {
        setIsTogglingCompletion(false);
        closeMenu();
      }
    },
    [onToggleCompletion, closeMenu, isTogglingCompletion]
  );

  const openLeetCodePage = useCallback(
    (problem: Problem, event: React.MouseEvent) => {
      event.stopPropagation();
      window.open(`https://leetcode.cn/problems/${problem.titleSlug}/`, '_blank');
      closeMenu();
    },
    [closeMenu]
  );

  const openGitHubPages = useCallback(
    (problem: Problem, event: React.MouseEvent) => {
      event.stopPropagation();
      if (problem.hasAnimation && problem.repo?.pagesUrl) {
        window.open(problem.repo.pagesUrl, '_blank');
      }
      closeMenu();
    },
    [closeMenu]
  );

  const handleOpenSettings = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsSettingsOpen(true);
      closeMenu();
    },
    [closeMenu]
  );

  const handleTreasureOpen = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  if (problems.length === 0) {
    return (
      <div className="duolingo-path-empty">
        <span className="empty-icon">📭</span>
        <p>{currentLang === 'zh' ? '暂无题目' : 'No problems'}</p>
      </div>
    );
  }

  return (
    <div
      key={refreshKey}
      className="duolingo-path-container"
      style={{ minHeight: layout.height }}
      ref={containerRef}
    >
      <TrailConnectors
        className="duolingo-path-svg"
        width={containerWidth}
        height={layout.height}
        connections={connections}
      />

      <div className="duolingo-nodes-container">
        {problems.map((problem, index) => {
          const position = layout.nodes[index];
          return (
            <ProblemNode
              key={problem.id}
              problem={problem}
              title={currentLang === 'zh' ? problem.translatedTitle : problem.title}
              currentLang={currentLang}
              t={t}
              x={position.x}
              y={position.y}
              completed={isCompleted(problem.questionFrontendId)}
              isCurrent={index === currentIndex}
              isLastInSegment={isSegmentEnd(index)}
              isExpanded={expandedNodeId === problem.questionFrontendId}
              difficultyClass={getDifficultyClass(problem.difficulty)}
              pagesUrl={problem.repo?.pagesUrl || null}
              menuSide={position.x > containerWidth / 2 ? 'left' : 'right'}
              onActivate={handleActivate}
              onContextMenu={handleContextMenu}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={hideMenuWithDelay}
              onMenuMouseEnter={clearHideTimeout}
              onMenuMouseLeave={hideMenuWithDelay}
              onToggleCompletion={handleToggleCompletion}
              onOpenLeetCode={openLeetCodePage}
              onOpenAnimation={openGitHubPages}
              onOpenSettings={handleOpenSettings}
            />
          );
        })}

        {/* 分段宝箱 */}
        {showTreasures &&
          layout.treasures.map(treasure => {
            const segment = segmentInfo.segments[treasure.segmentIndex];
            const originalSegment = originalSegmentInfo.segments[treasure.segmentIndex];
            const treasureId = `detail-${pathId}-stage-${treasure.segmentIndex + 1}`;

            return (
              <div
                key={treasureId}
                className="path-treasure-wrapper"
                style={{
                  left: `${treasure.x}px`,
                  top: treasure.y - 40,
                }}
              >
                <TreasureNode
                  treasureId={treasureId}
                  stageNumber={treasure.segmentIndex + 1}
                  canOpen={originalSegment ? originalSegment.isComplete : Boolean(segment?.isComplete)}
                  currentLang={currentLang}
                  onOpen={handleTreasureOpen}
                />
              </div>
            );
          })}
      </div>

      {/* 终点宝箱 */}
      {showTreasures && layout.endpoint && (
        <div
          className="path-treasure-wrapper endpoint-treasure"
          style={{
            left: `${layout.endpoint.x}px`,
            top: layout.endpoint.y - 40,
          }}
        >
          <TreasureNode
            treasureId={`endpoint-${pathId}`}
            stageNumber={segmentInfo.segmentCount + 1}
            canOpen={allProblemsCompleted}
            currentLang={currentLang}
            onOpen={handleTreasureOpen}
            isEndpoint={true}
          />
        </div>
      )}

      <ClickBehaviorSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
};

export default DuolingoPath;
