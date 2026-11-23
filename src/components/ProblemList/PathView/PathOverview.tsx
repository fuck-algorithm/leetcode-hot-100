import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { LearningPath } from '../data/learningPaths';
import AscensionNode from './AscensionNode';
import { DragonHead3D } from './trail/DragonHead3D';
import OverviewPathNode, {
  OverviewCompletionStats,
  OverviewPathStats,
} from './OverviewPathNode';
import TrailConnectors, {
  TrailConnection,
  RoadMaterial,
} from './trail/TrailConnectors';
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

  /**
   * 每条路挑一种路面材质。
   *
   * 按分类语义固定分配（而不是随机），这样同一分类的路材始终一致，
   * 用户第二次进来看到的还是同一条"红砖路"，不会觉得页面在乱跳。
   * 四种材质在整页交替出现，避免整页看起来只有一种路。
   */
  /**
   * 整条学习之路就是一条龙，所以**所有**路段都用龙鳞材质。
   * 之前按分类混用砖/木/碎石，整页看是"一条龙身上夹着几段别的东西"，
   * 割裂了"一条连续龙"的观感——用户要的是一条龙，不是拼贴画。
   */
  const materialOf = useCallback((): RoadMaterial => 'scale', []);


  const compact = width <= 560;
  /** 与 PathOverview.css 中的节点尺寸保持一致 */
  const nodeRadius = width <= 480 ? 44 : width <= 768 ? 48 : 56;

  const layout = useMemo(() => {
    // 纵向间距：够放下节点与标签即可。原先 560 叠加 spacingRhythm（0.78~1.34）
    // 与 spacingScale（0.94~1.5）后单段常接近 900px，两个节点之间空跑太久，
    // 整页被拉到一万像素高，滚动起来像在爬长坡。
    // 用户要求：在原来的基础上再收到约 2/3（560 -> 约 370）
    const spacing = compact ? 265 : 370;
    // 节点摆幅：左右错开、看得到蜿蜒即可，不铺满容器。
    const amplitude = compact ? 80 : 130;
    // 给「开始/继续」气泡留出空间，避免压到页头。
    // 再多留 100px 给顶端的龙尾（尾鳍向下垂，需要独立的一段空间）。
    const startY = nodeRadius + 158;
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

    // 龙形：用户要的是"尾巴在上、龙头在下"的一条龙。
    // 龙的脊柱就是这条学习之路本身：顶端收尾，底端飞升节点处是龙首。
    //
    // 位置要留足空隙，否则会被圆形节点和"飞升目标"卡片盖住（踩过）：
    //   尾 —— 在首节点之上，尾鳍再往下垂一点，不压住节点圆
    //   首 —— 在飞升光球之下，独占页面最底部
    const dragonScale = compact ? 1.3 : 1.9;
    const firstNode = positions[0];
    const dragon = {
      tail: firstNode
        ? {
            // 尾尖放在首节点正上方但避开"开始"胶囊与节点圆：
            // 胶囊在节点上方约 90px，尾鳍还要再往下伸 ~70px，
            // 所以起点要抬到 nodeRadius + 165 才不会压字。
            x: firstNode.x,
            // "开始"胶囊约占节点上方 90px，尾鳍再垂下约 70px(×scale)，
            // 起点取 -140 时尾鳍恰好落在节点圆顶上方，且不超出画布。
            y: firstNode.y - nodeRadius - 140,
            scale: dragonScale,
            completed: overallStats.percentage >= 100,
          }
        : undefined,
      head: lastNode
        ? {
            // 龙头紧接龙身末端——用户要的是"一条龙"，不是"路 + 一个雕塑"。
            // 所以龙头必须和最后一段龙身首尾相连，中间不能夹卡片。
            // 卡片挪到龙头下方（见渲染部分），不再挡在龙身和头之间。
            x: width / 2,
            y: ascensionY + orbRadius + 60,
            scale: dragonScale,
            completed: overallStats.percentage >= 100,
          }
        : undefined,
    };

    return {
      positions,
      ascension: { x: width / 2, y: ascensionY },
      // 底部要容纳"飞升目标"卡片（约 340）+ 龙脖 + 放大的龙头
      // （含龙须约 120*scale），再留 120 缓冲避免被裁
      // 底部要容纳：龙头（400/300 高）+ 其下方的飞升卡片（约 300）
      height: ascensionY + orbRadius + (compact ? 820 : 880),
      orbRadius,
      labelSpace,
      dragon,
      // 段内波幅预算：原先 0.30×width（上限 215）几乎每段都甩到画布边缘，
      // 看着像在画大浪。收紧到 0.18×width（上限 130），曲线仍明显弯曲，
      // 但横向不再顶边，和节点摆幅（amplitude）保持同一量级。
      waveAmplitude: Math.max(60, Math.min(130, width * 0.18)),
    };
  }, [compact, nodeRadius, width, decoratedPaths, overallStats.percentage]);

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
        material: materialOf(),
        // 龙身粗细：从顶部（尾巴）到底部（颈）逐渐变粗，0.78 -> 1.22
        girth: 0.78 + (i / Math.max(1, decoratedPaths.length - 1)) * 0.44,
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
        material: materialOf(),
        girth: 1.24,   // 接到龙头处最粗，形成"颈"的体量
      });

      // 龙脖不再用 SVG 补：3D 龙首自带颈部与身体，
      // 再加一段 SVG 反而会插进模型里、露出断头（踩过）。
    }

    return result;
  }, [decoratedPaths, layout, overallStats.percentage, width, materialOf]);

  const handlePathOpen = useCallback(
    (pathId: string) => onPathClick(pathId),
    [onPathClick]
  );

  return (
    <div className="path-overview-container">
      {/* 标题区域 */}
      <div className="path-overview-header">
        <div className="header-mascot" aria-hidden="true">🐲</div>
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
          dragon={layout.dragon}
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
              // 卡片挪到龙头下方，避免插在龙身与龙头之间把一条龙切成两段
              top: (layout.dragon?.head?.y ?? layout.ascension.y) + (compact ? 265 : 340) + 40,
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

        {/* 龙头：Three.js 渲染。整页七千多像素，只有这一处上 WebGL，
            龙身继续用 SVG，避免滚动时整屏重绘掉帧。 */}
        {layout.dragon?.head && (
          <div
            className="dragon-head3d-wrapper"
            style={{
              left: `${layout.dragon.head.x}px`,
              top: `${layout.dragon.head.y - 250}px`,
              // 尺寸必须与传给 canvas 的 width/height **完全一致**：
              // 不一致会让 canvas 被 CSS 拉伸，宽高比变形（踩过）
              width: compact ? 300 : 520,
              height: compact ? 265 : 340,
            }}
          >
            <DragonHead3D
              width={compact ? 300 : 520}
              height={compact ? 265 : 340}
              completed={overallStats.percentage >= 100}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PathOverview;
