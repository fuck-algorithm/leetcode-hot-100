import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { LearningPath } from '../data/learningPaths';
import AscensionNode from './AscensionNode';
import OverviewPathNode, {
  OverviewCompletionStats,
  OverviewPathStats,
} from './OverviewPathNode';
import TrailConnectors, { TrailConnection } from './trail/TrailConnectors';
import {
  buildOverviewPositions,
  buildWindingConnectorPath,
  getWindingStyle,
} from './trail/geometry';
import { useElementWidth } from './trail/useElementWidth';
import './PathOverview.css';

interface PathWithStats {
  path: LearningPath;
  problems: any[];
  stats: OverviewPathStats;
  completionStats: OverviewCompletionStats;
}

interface PathOverviewProps {
  pathsWithProblems: Array<{
    path: LearningPath;
    problems: any[];
    stats: OverviewPathStats;
  }>;
  currentLang: string;
  onPathClick: (pathId: string) => void;
  getStatsForProblems: (problemIds: string[]) => OverviewCompletionStats;
  // 新增：返回时需要滚动到的路径ID
  scrollToPathId?: string;
}

const PathOverview: React.FC<PathOverviewProps> = ({
  pathsWithProblems,
  currentLang,
  onPathClick,
  getStatsForProblems,
  scrollToPathId,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(stageRef, 680);

  // 滚动到指定路径节点 - 无动画直接定位
  useEffect(() => {
    if (!scrollToPathId || !nodesRef.current) return;
    const targetNode = nodesRef.current.querySelector(
      `[data-path-id="${scrollToPathId}"]`
    ) as HTMLElement | null;
    targetNode?.scrollIntoView({ behavior: 'auto', block: 'center' });
  }, [scrollToPathId]);

  const decoratedPaths = useMemo<PathWithStats[]>(
    () =>
      pathsWithProblems.map(item => ({
        ...item,
        completionStats: getStatsForProblems(
          item.problems.map((problem: any) => problem.questionFrontendId)
        ),
      })),
    [pathsWithProblems, getStatsForProblems]
  );

  const overallStats = useMemo(() => {
    const total = decoratedPaths.reduce((sum, item) => sum + item.stats.total, 0);
    const completed = decoratedPaths.reduce(
      (sum, item) => sum + item.completionStats.completed,
      0
    );
    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [decoratedPaths]);

  /** 当前进度：第一个未完成的路径 */
  const currentIndex = useMemo(
    () => decoratedPaths.findIndex(item => item.completionStats.percentage < 100),
    [decoratedPaths]
  );

  const compact = width <= 560;
  /** 与 PathOverview.css 中的节点尺寸保持一致 */
  const nodeRadius = width <= 480 ? 44 : width <= 768 ? 48 : 56;

  const layout = useMemo(() => {
    // 间距拉大：每段「路」更长，蜿蜒才有施展空间
    const spacing = compact ? 400 : 560;
    // 节点摆幅收敛一点，把两侧的空间让给连接曲线的波头
    const amplitude = compact ? 100 : 180;
    // 给「开始/继续」气泡留出空间，避免压到页头
    const startY = nodeRadius + 58;
    // 每条路径用自己的蜿蜒风格：节点骨架与连接曲线的性格都不同
    const styleAt = (index: number) =>
      getWindingStyle(decoratedPaths[index]?.path.id);
    // 每段「路」的长度也随两端分类的风格变化，14 段长短不一
    const spacingAt = (index: number) => {
      const prev = getWindingStyle(decoratedPaths[index - 1]?.path.id);
      const next = getWindingStyle(decoratedPaths[index]?.path.id);
      return (prev.spacingScale + next.spacingScale) / 2;
    };
    const positions = buildOverviewPositions(decoratedPaths.length, width, {
      startY,
      spacing,
      amplitude,
      styleAt,
      spacingAt,
    });

    const lastNode = positions[positions.length - 1];
    const orbRadius = compact ? 64 : 75;
    const labelSpace = compact ? 44 : 48;
    // 飞升节点：上一节点胶囊底部 + 间距 + 标签 + 光球
    const ascensionY = lastNode
      ? lastNode.y + nodeRadius + 41 + 24 + labelSpace + orbRadius
      : 260;

    return {
      positions,
      ascension: { x: width / 2, y: ascensionY },
      height: ascensionY + (compact ? 300 : 340),
      orbRadius,
      labelSpace,
      // 段内波幅预算：大幅甩开到两侧，但离画布边缘留出安全余量
      waveAmplitude: Math.max(70, Math.min(215, width * 0.30)),
    };
  }, [compact, nodeRadius, width, decoratedPaths]);

  const connections = useMemo<TrailConnection[]>(() => {
    const result: TrailConnection[] = [];
    const { positions, ascension, waveAmplitude } = layout;
    const bounds = { minX: 10, maxX: Math.max(10, width - 10) };

    for (let i = 0; i < decoratedPaths.length - 1; i++) {
      result.push({
        key: `overview-path-${i}`,
        d: buildWindingConnectorPath(
          positions[i],
          positions[i + 1],
          positions[i - 1] ?? null,
          positions[i + 2] ?? null,
          {
            style: getWindingStyle(decoratedPaths[i].path.id),
            edgeIndex: i,
            amplitude: waveAmplitude,
            // 总览页统一用不自交的正弦蜿蜒：段内每段约 1.5 个波，
            // 波长比放大到 1.8 让峰顶曲率半径（~20px）明显大于 14px 描边
            forceMeander: true,
            wavelengthRatio: 1.9,
            ...bounds,
          }
        ),
        completed: decoratedPaths[i].completionStats.percentage >= 100,
      });
    }

    const lastPosition = positions[positions.length - 1];
    if (lastPosition) {
      result.push({
        key: 'overview-path-to-ascension',
        d: buildWindingConnectorPath(
          lastPosition,
          ascension,
          positions[positions.length - 2] ?? null,
          null,
          {
            style: getWindingStyle(
              decoratedPaths[decoratedPaths.length - 1]?.path.id
            ),
            edgeIndex: decoratedPaths.length,
            amplitude: waveAmplitude,
            forceMeander: true,
            wavelengthRatio: 1.9,
            ...bounds,
          }
        ),
        completed: overallStats.percentage >= 100,
      });
    }

    return result;
  }, [decoratedPaths, layout, overallStats.percentage, width]);

  const handlePathOpen = useCallback(
    (pathId: string) => onPathClick(pathId),
    [onPathClick]
  );

  return (
    <div className="path-overview-container">
      {/* 标题区域 */}
      <div className="path-overview-header">
        <div className="header-mascot" aria-hidden="true">🦉</div>
        <h2 className="path-overview-title">
          {currentLang === 'zh' ? '算法学习之旅' : 'Algorithm Learning Journey'}
        </h2>
        <p className="path-overview-subtitle">
          {currentLang === 'zh'
            ? '跟随路径，从入门到精通，一步一个脚印'
            : 'Follow the path, step by step from beginner to master'}
        </p>
      </div>

      {/* 路径画布 */}
      <div
        className="path-overview-path"
        style={{ minHeight: layout.height }}
        ref={stageRef}
      >
        <TrailConnectors
          className="path-overview-svg"
          width={width}
          height={layout.height}
          connections={connections}
          variant="raised"
        />

        <div className="path-overview-nodes" ref={nodesRef}>
          {decoratedPaths.map((item, index) => (
            <OverviewPathNode
              key={item.path.id}
              path={item.path}
              stats={item.stats}
              completionStats={item.completionStats}
              position={layout.positions[index]}
              currentLang={currentLang}
              isCurrent={index === currentIndex}
              isLast={index === decoratedPaths.length - 1}
              nodeRadius={nodeRadius}
              onOpen={() => handlePathOpen(item.path.id)}
            />
          ))}
        </div>

        {/* 飞升目标 */}
        {decoratedPaths.length > 0 && (
          <div
            className="ascension-node-wrapper"
            style={{
              left: `${layout.ascension.x}px`,
              top: layout.ascension.y - layout.labelSpace - layout.orbRadius,
            }}
          >
            <AscensionNode
              currentLang={currentLang}
              completionPercentage={overallStats.percentage}
              totalProblems={overallStats.total}
              completedProblems={overallStats.completed}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PathOverview;
