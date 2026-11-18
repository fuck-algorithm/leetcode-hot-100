import React from 'react';

export interface TrailConnection {
  key: string;
  /** SVG path 的 d 属性 */
  d: string;
  completed: boolean;
}

interface TrailConnectorsProps {
  className: string;
  width: number;
  height: number;
  connections: TrailConnection[];
  /**
   * simple: 详情页使用的单层路径（保持既有的视觉契约）
   * raised: 概览页使用的多层路径，画成有厚度、有纹理的路面
   */
  variant?: 'simple' | 'raised';
}

const SIMPLE_COMPLETED = '#ffd700';
const SIMPLE_PENDING = '#d0d0d0';

/**
 * 概览页路面：一条路 = 五层叠出来的立体感
 *
 *   1. 投影       — 柔和落下，让路面浮起
 *   2. 路基(深色) — 路沿/侧壁，比路面整体下移几个像素
 *   3. 路面(浅色) — 主体
 *   4. 内阴影     — 贴着路沿的暗边，做出"路是凹进去的"错觉
 *   5. 高光       — 顶部一道细亮线，模拟光照
 *
 * 外加一条与路面等宽的虚线车道标记（stroke-dasharray），
 * 让"线"变成"路"。
 *
 * 全部用 SVG 原生 path/filter 完成，不引入任何 3D 或渲染库：
 * 这是纵向超过一万像素的长滚动列表，WebGL 层要跟着滚动重绘，
 * 移动端必卡，而这些细节用 SVG 就能画得足够精致。
 */
const RaisedRoad: React.FC<{ connection: TrailConnection }> = ({ connection }) => {
  const done = connection.completed;
  return (
    <g key={connection.key} className="trail-link-group">
      {/* 1. 投影 */}
      <path
        className="trail-road-shadow"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={18}
        transform="translate(0 9)"
        opacity={0.28}
      />
      {/* 2. 路基：略粗、下沉，形成厚度 */}
      <path
        className={`trail-road-base ${done ? 'is-completed' : ''}`}
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={17}
        transform="translate(0 6)"
      />
      {/* 3. 路面主体 + 极轻的柏油颗粒 */}
      <path
        className={`trail-road-surface ${done ? 'is-completed' : ''}`}
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={15}
        filter="url(#trail-asphalt)"
      />
      {/* 4. 内阴影：只留边缘一圈暗色，做出凹槽感 */}
      <path
        className="trail-road-inner-shadow"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={15}
      />
      {/* 5. 沿路面的横向明暗渐变：用三层由粗到细、由暗到亮的描边叠出
           "中间亮、两侧暗"的圆柱感。
           不用 translate 偏移，因为那是固定方向：曲线转弯时会错位。
           同一 path 叠不同宽度是最稳的做法，且在任意弯折处都贴合路面。 */}
      <path
        className="trail-road-tone-1"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={13}
      />
      <path
        className="trail-road-tone-2"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={9}
      />
      <path
        className="trail-road-highlight"
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
      />
      {/* 6. 车道虚线：让"线"看起来像"路"。
          必须最后画，否则会被上面的路面盖住。 */}
      <path
        className={`trail-road-dash ${done ? 'is-completed' : ''}`}
        d={connection.d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        strokeDasharray="8 12"
      />
    </g>
  );
};

const TrailConnectors: React.FC<TrailConnectorsProps> = ({
  className,
  width,
  height,
  connections,
  variant = 'simple',
}) => {
  return (
    <svg
      className={className}
      style={{ height }}
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'raised' ? (
        <>
          {/* 内阴影滤镜：源图形描边后模糊，再反相挖空内部，
              只留下贴着外沿的一圈暗色 */}
          <defs>
            <filter id="trail-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="2.2" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feFlood className="trail-inner-shadow-flood" floodColor="#000" floodOpacity="0.22" />
              <feComposite in2="offsetblur" operator="in" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 投影滤镜 */}
            <filter id="trail-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            {/* 路面颗粒：细碎高频噪点，叠在路面主体上做轻微的柏油质感。
                baseFrequency 取很小值 + 低 opacity，远看是均匀的哑光表面，
               近看才有一点颗粒，不会抢车道线的注意力。 */}
            <filter id="trail-asphalt" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" result="gray" />
              <feComponentTransfer in="gray" result="soft">
                <feFuncA type="linear" slope="0.18" intercept="0" />
              </feComponentTransfer>
              {/* 关键：噪点必须裁到路面范围内，再叠在路面上，
                  不能替换掉路面本身（feComposite 用 in 会只剩噪点） */}
              <feComposite in="soft" in2="SourceAlpha" operator="in" result="clipped" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="clipped" />
              </feMerge>
            </filter>
          </defs>
          {connections.map(connection => (
            <RaisedRoad key={connection.key} connection={connection} />
          ))}
        </>
      ) : (
        connections.map(connection => (
          <path
            key={connection.key}
            className={`trail-link ${connection.completed ? 'is-completed' : ''}`}
            d={connection.d}
            stroke={connection.completed ? SIMPLE_COMPLETED : SIMPLE_PENDING}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        ))
      )}
    </svg>
  );
};

export default TrailConnectors;
