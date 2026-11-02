import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { LearningPath } from '../data/learningPaths';
import AscensionNode from './AscensionNode';
import OverviewPathNode, {
  OverviewCompletionStats,
  OverviewPathStats,
} from './OverviewPathNode';
import TrailConnectors, { TrailConnection } from './trail/TrailConnectors';
import { buildConnectorPath, buildOverviewPositions } from './trail/geometry';
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
    // 节点下方是名称胶囊，间距要容纳「节点 + 胶囊」
    const spacing = compact ? 180 : 196;
    const amplitude = compact ? 62 : 118;
    // 给「开始/继续」气泡留出空间，避免压到页头
    const startY = nodeRadius + 58;
    const positions = buildOverviewPositions(decoratedPaths.length, width, {
      startY,
      spacing,
      amplitude,
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
    };
  }, [compact, nodeRadius, width, decoratedPaths.length]);

  const connections = useMemo<TrailConnection[]>(() => {
    const result: TrailConnection[] = [];
    const { positions, ascension, orbRadius } = layout;

    for (let i = 0; i < decoratedPaths.length - 1; i++) {
      result.push({
        key: `overview-path-${i}`,
        d: buildConnectorPath(positions[i], positions[i + 1], nodeRadius, nodeRadius),
        completed: decoratedPaths[i].completionStats.percentage >= 100,
      });
    }

    const lastPosition = positions[positions.length - 1];
    if (lastPosition) {
      result.push({
        key: 'overview-path-to-ascension',
        d: buildConnectorPath(lastPosition, ascension, nodeRadius, orbRadius),
        completed: overallStats.percentage >= 100,
      });
    }

    return result;
  }, [decoratedPaths, layout, nodeRadius, overallStats.percentage]);

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
