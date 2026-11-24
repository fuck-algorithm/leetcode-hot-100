import React from 'react';

/**
 * 中国龙头（矢量插画）
 *
 * 之前用的是西方龙（蝙蝠翅、獠牙、爬行类尖吻），完全不是中国龙的样子。
 * 中国龙的核心特征，这张图逐一做出：
 *   - 方吻（不是尖吻），额头宽而平
 *   - 分叉的鹿角（不是独角）
 *   - 两根长须从吻侧甩出
 *   - 嗔目圆睁（眼球外凸、竖瞳、粗眉弓）
 *   - 脑后一圈火焰状鬃毛
 *   - 颊侧鳞甲、双排獠牙
 *   - 通体金色，与上方龙身同色系
 *
 * 用 SVG 画而不是 3D：免费渠道拿不到中式龙的 3D 模型（Sketchfab 需登录），
 * 而矢量插画可以把线条画到足够精细，且与页面整体风格统一。
 */

interface Props {
  width: number;
  height: number;
  completed: boolean;
}

const GOLD = '#e8b23a';
const GOLD_L = '#f7d268';
const GOLD_D = '#b0761b';
const GOLD_DD = '#7d4f0d';
const HORN = '#efe3c4';
const HORN_D = '#c9b98f';
const TOOTH = '#fffdf5';
const MOUTH = '#8e2f2a';
const EYE = '#ffe066';
const PUPIL = '#140f08';

export const ChineseDragonHead: React.FC<Props> = ({
  width,
  height,
  completed,
}) => {
  const main = completed ? '#5fce12' : GOLD;
  const light = completed ? '#a8f06a' : GOLD_L;
  const dark = completed ? '#3f9a00' : GOLD_D;
  const deep = completed ? '#2f7000' : GOLD_DD;

  const W = 400;
  const H = 400;

  return (
    <svg
      className="cn-dragon-head"
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="cn-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={main} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="cn-face" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="65%" stopColor={main} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="cn-horn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={HORN} />
          <stop offset="100%" stopColor={HORN_D} />
        </linearGradient>
        <radialGradient id="cn-eye" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff7c4" />
          <stop offset="60%" stopColor={EYE} />
          <stop offset="100%" stopColor="#c9920d" />
        </radialGradient>
      </defs>

      {/* ============ 脑后鬃毛：贴在头轮廓两侧，往后上方飘的火焰簇 ============
          之前画成横向伸出的叶子，远看像翅膀；改成贴着颊部、朝后上方飘。 */}
      {[-1, 1].map(s =>
        [0, 1, 2].map(i => {
          // 粗短的火焰簇：根部宽、尖端圆，贴着颊部向后上方翘
          const bx = 200 + s * (95 + i * 4);
          const by = 138 + i * 24;
          const len = 30 + i * 4;
          const wide = 9 - i * 1.5;
          const tipX = bx + s * (len * 0.75);
          const tipY = by - len * 0.85;
          return (
            <path
              key={`mane-${s}-${i}`}
              d={`M ${bx - wide} ${by + 10}
                  C ${bx - wide * 0.6} ${by - 6}, ${tipX - wide * 0.7} ${tipY + 8}, ${tipX} ${tipY}
                  C ${tipX - wide * 0.2} ${tipY + 14}, ${bx + wide * 0.8} ${by + 14}, ${bx + wide} ${by + 10} Z`}
              fill={deep}
              opacity={0.82 - i * 0.12}
            />
          );
        })
      )}

      {/* ============ 鹿角（分叉枝状，向后上方） ============ */}
      {[-1, 1].map(s => (
        <g key={`antler-${s}`} transform={`translate(${200 + s * 62} 132) scale(${s} 1)`}>
          {/* 主干：从额角向上外弯 */}
          <path
            d="M 0 0 C 10 -26, 22 -48, 30 -74"
            stroke="url(#cn-horn)"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          {/* 第一分叉：向外 */}
          <path
            d="M 13 -34 C 26 -40, 38 -44, 50 -48"
            stroke="url(#cn-horn)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          {/* 第二分叉：向上内弯 */}
          <path
            d="M 24 -58 C 34 -70, 40 -82, 42 -96"
            stroke="url(#cn-horn)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* 第三小叉：向前 */}
          <path
            d="M 5 -16 C 2 -30, -4 -40, -10 -48"
            stroke="url(#cn-horn)"
            strokeWidth="6.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* 角根凸起 */}
          <ellipse cx="0" cy="2" rx="11" ry="8" fill={dark} />
        </g>
      ))}

      {/* ============ 龙头主体 ============
          中国龙的脸不是圆的：额头宽平有棱角，下颊向内收，
          整体呈"倒梯形"，再配上方吻才有龙的样子。
          之前画成一个大圆，远看像青蛙脸。 */}
      <path
        d="
          M 106 150
          L 118 112
          C 140 100, 172 94, 200 94
          C 228 94, 260 100, 282 112
          L 294 150
          C 294 178, 286 202, 272 220
          C 258 236, 232 246, 200 248
          C 168 246, 142 236, 128 220
          C 114 202, 106 178, 106 150
          Z"
        fill="url(#cn-face)"
      />

      {/* 额骨棱线：两道斜向的暗描，强化"骨相"而非"肉球" */}
      <path d="M 130 124 C 160 112, 240 112, 270 124" stroke="#a8761d" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M 122 142 L 278 142" stroke="#c08c28" strokeWidth="2" fill="none" opacity="0.35" />

      {/* ============ 方吻 ============
          中国龙的吻是"向前方伸出的方盒"，有清楚的正面、顶面、侧面。
          之前只画了一个扁平椭圆贴在脸上，完全没有纵深。
          这里用三块面拼出体积：顶面（亮）、正面（中）、底部阴影。 */}
      {/* 吻部侧面（暗，制造纵深） */}
      <path
        d="M 132 196 C 130 206, 134 218, 144 226 L 152 222 C 142 212, 140 202, 142 194 Z"
        fill={dark}
      />
      <path
        d="M 268 196 C 270 206, 266 218, 256 226 L 248 222 C 258 212, 260 202, 258 194 Z"
        fill={dark}
      />
      {/* 吻部主体（方盒正面） */}
      <path
        d="
          M 140 192
          L 146 176
          C 168 170, 232 170, 254 176
          L 260 192
          C 262 206, 254 218, 240 224
          C 220 230, 180 230, 160 224
          C 146 218, 138 206, 140 192
          Z"
        fill="url(#cn-gold)"
      />
      {/* 顶面：一道窄亮条，做出"上表面受光" */}
      <path
        d="M 146 176 C 168 170, 232 170, 254 176 L 252 184 C 232 178, 168 178, 148 184 Z"
        fill={light}
        opacity={0.75}
      />
      {/* 鼻端凸起：向前伸出的短方盒（正对镜头时是深色块） */}
      <path
        d="M 162 188 L 168 178 C 186 174, 214 174, 232 178 L 238 188 C 240 196, 232 202, 218 204 C 200 206, 180 206, 166 204 C 156 202, 160 194, 162 188 Z"
        fill={light}
        opacity={0.5}
      />
      {/* 鼻孔：两个朝天的深洞 */}
      {[-1, 1].map(s => (
        <ellipse
          key={`nostril-${s}`}
          cx={200 + s * 22}
          cy={200}
          rx={7}
          ry={4.5}
          fill={deep}
          transform={`rotate(${s * -12} ${200 + s * 22} 200)`}
        />
      ))}

      {/* ============ 嘴：微张，露出獠牙 ============ */}
      <path
        d="M 150 232 C 170 244, 230 244, 250 232 C 244 252, 214 260, 200 260 C 186 260, 156 252, 150 232 Z"
        fill={MOUTH}
      />
      {/* 舌 */}
      <path
        d="M 176 244 C 190 250, 210 250, 224 244 C 214 254, 186 254, 176 244 Z"
        fill="#b8433c"
        opacity={0.9}
      />
      {/* 上排獠牙 */}
      {[-1, 1].map(s => (
        <g key={`ft-${s}`}>
          <path d={`M ${168 + s * 6} 234 L ${171 + s * 6} 248 L ${176 + s * 6} 234 Z`} fill={TOOTH} />
          <path d={`M ${192 + s * 6} 236 L ${194 + s * 6} 247 L ${198 + s * 6} 236 Z`} fill={TOOTH} />
          <path d={`M ${216 + s * 6} 234 L ${219 + s * 6} 246 L ${223 + s * 6} 234 Z`} fill={TOOTH} />
        </g>
      ))}
      {/* 下排小牙 */}
      {[-1, 1].map(s => (
        <g key={`fb-${s}`}>
          <path d={`M ${178 + s * 8} 250 L ${180 + s * 8} 240 L ${183 + s * 8} 250 Z`} fill={TOOTH} opacity={0.95} />
          <path d={`M ${210 + s * 8} 250 L ${212 + s * 8} 241 L ${215 + s * 8} 250 Z`} fill={TOOTH} opacity={0.95} />
        </g>
      ))}

      {/* ============ 大嗔目：外凸圆眼 + 粗眉弓 ============ */}
      {[-1, 1].map(s => (
        <g key={`eye-${s}`}>
          {/* 眼眶凸起 */}
          <ellipse
            cx={200 + s * 54}
            cy={172}
            rx={30}
            ry={26}
            fill={light}
            opacity={0.85}
          />
          {/* 眼球 */}
          <circle cx={200 + s * 54} cy={172} r={23} fill="url(#cn-eye)" />
          {/* 竖瞳 */}
          <ellipse
            cx={200 + s * 54}
            cy={172}
            rx={6.5}
            ry={17}
            fill={PUPIL}
          />
          {/* 高光 */}
          <circle cx={200 + s * 54 - 7} cy={162} r={5} fill="#ffffff" opacity={0.92} />
          {/* 粗眉弓：上扬的斜条 */}
          <path
            d={`M ${200 + s * 26} ${150} C ${200 + s * 46} ${138}, ${200 + s * 70} ${136}, ${200 + s * 84} ${144} L ${200 + s * 82} ${156} C ${200 + s * 68} ${148}, ${200 + s * 46} ${150}, ${200 + s * 30} ${160} Z`}
            fill={deep}
          />
          {/* 眉端火焰尖 */}
          <path
            d={`M ${200 + s * 82} ${146} C ${200 + s * 96} ${132}, ${200 + s * 104} ${122}, ${200 + s * 108} ${110} C ${200 + s * 96} ${124}, ${200 + s * 88} ${134}, ${200 + s * 78} ${140} Z`}
            fill={dark}
          />
        </g>
      ))}

      {/* ============ 颊侧鳞甲 ============ */}
      {[-1, 1].map(s =>
        [0, 1, 2].map(i => (
          <path
            key={`sc-${s}-${i}`}
            d={`M ${200 + s * (76 + i * 3)} ${196 + i * 18} q ${s * 9} ${-7} ${s * 15} ${3} q ${-s * 7} ${7} ${-s * 15} ${-3} Z`}
            fill={deep}
            opacity={0.45 - i * 0.08}
          />
        ))
      )}

      {/* ============ 龙须：从吻侧向前甩出的长须 ============ */}
      {[-1, 1].map(s => (
        <g key={`whisker-${s}`}>
          <path
            d={`M ${200 + s * 48} 214 C ${200 + s * 92} 208, ${200 + s * 128} 222, ${200 + s * 152} 250 C ${200 + s * 128} 232, ${200 + s * 96} 222, ${200 + s * 52} 224 Z`}
            fill="url(#cn-horn)"
          />
          <path
            d={`M ${200 + s * 46} 226 C ${200 + s * 80} 232, ${200 + s * 108} 254, ${200 + s * 124} 282 C ${200 + s * 104} 258, ${200 + s * 78} 240, ${200 + s * 48} 234 Z`}
            fill="url(#cn-horn)"
            opacity={0.85}
          />
        </g>
      ))}
    </svg>
  );
};

export default ChineseDragonHead;
