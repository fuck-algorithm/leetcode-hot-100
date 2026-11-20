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
  const materialOf = useCallback((pathId?: string): RoadMaterial => {
    // 按页面实际出现顺序逐段指定，保证相邻两段材质不同。
    // （分类顺序：hash, two-pointers, sliding-window, array, linked-list,
    //   binary-tree, graph, backtracking, binary-search, stack, heap,
    //   greedy, dynamic-programming, techniques）
    // 整条路现在读作一条龙，所以主体统一用金色龙鳞；
    // 只在个别段落掺入别的材质做节奏变化，避免十四段一模一样。
    const MAP: Record<string, RoadMaterial> = {
      hash: 'scale',
      'two-pointers': 'scale',
      'sliding-window': 'cobble',
      array: 'scale',
      'linked-list': 'scale',
      'binary-tree': 'wood',
      graph: 'scale',
      backtracking: 'scale',
      'binary-search': 'cobble',
      stack: 'scale',
      heap: 'scale',
      greedy: 'wood',
      'dynamic-programming': 'scale',
      techniques: 'scale',
    };
    return (pathId && MAP[pathId]) || 'scale';
  }, []);

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
            // 龙头放在"飞升目标"卡片下方（卡片占约 340px），
            // 再用一段短龙身把卡片和龙头连起来，避免视觉断成两截。
            x: width / 2,
            y: ascensionY + orbRadius + 400,
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
      height: ascensionY + orbRadius + (compact ? 720 : 760),
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
        material: materialOf(decoratedPaths[i].path.id),
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
        material: materialOf(
          decoratedPaths[decoratedPaths.length - 1]?.path.id
        ),
      });

      // 卡片下方补一小段龙身，把"飞升目标"和龙头接起来：
      // 否则龙头孤悬在页面最底部，看起来和整条龙没有关系。
      if (layout.dragon?.head) {
        const h = layout.dragon.head;
        // 龙脖终点落进龙头内部（脸的范围），从下巴下面探出来会像多余尾巴。
        // 起点也贴着卡片下沿，整段尽量短，减少可摆动长度。
        // 从卡片下沿稍远处起笔画，做出"脖子从卡片后面垂下来"的纵深感
        const from = {
          x: width / 2,
          y: h.y - 200,
        };
        // 侧视龙头：脸朝左、后脑在右侧。龙脖要从"脑后"接进来，
        // 即 x 偏右、y 略低于头顶，才会被头骨盖住，不会像插在头上的一根管子。
        // 3D 龙头朝左，头在画布中心偏左；龙脖从上方偏右位置接入，
        // 视觉上像从颈后伸进头骨
        const to = { x: h.x + 30, y: h.y - 40 };
        result.push({
          key: 'overview-dragon-neck',
          // 龙脖不用大摆幅：这里只是把卡片和龙头接起来，
          // 扭得太厉害会像面条，压成一条柔和的小弧即可。
          d: buildWindingConnectorPath(from, to, null, null, {
            style: getWindingStyle(
              decoratedPaths[decoratedPaths.length - 1]?.path.id
            ),
            edgeIndex: decoratedPaths.length + 1,
            // 极小的摆幅：这一段只求"接上"，任何明显摆动都会像面条
            amplitude: 8,
            forceMeander: true,
            wavelengthRatio: 3.2,
            ...bounds,
          }),
          completed: overallStats.percentage >= 100,
          material: 'scale',
        });
      }
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

        {/* 龙头：Three.js 渲染。整页七千多像素，只有这一处上 WebGL，
            龙身继续用 SVG，避免滚动时整屏重绘掉帧。 */}
        {layout.dragon?.head && (
          <div
            className="dragon-head3d-wrapper"
            style={{
              left: `${layout.dragon.head.x}px`,
              top: `${layout.dragon.head.y - 130}px`,
            }}
          >
            <DragonHead3D
              width={compact ? 260 : 380}
              height={compact ? 210 : 300}
              completed={overallStats.percentage >= 100}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PathOverview;
