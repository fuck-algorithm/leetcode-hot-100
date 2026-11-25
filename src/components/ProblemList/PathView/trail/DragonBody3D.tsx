import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { samplePathPoints } from './spine';

/**
 * 整条龙身用 Three.js 渲染成真正的 3D 管体。
 *
 * 之前龙身是 SVG 描边 + 图案，本质是"扁平贴图"，没有体积、没有光照。
 * 这里沿同一条路径生成 TubeGeometry，得到有真实法线、能被光打亮的三维
 * 龙体；背脊再加一排锥形尖刺。
 *
 * 性能关键：**只渲染一次，不跑动画循环**。
 * 画布覆盖整条路径（约 860×7600），若每帧重绘，滚动必然掉帧；
 * 但内容本身是静态的，绘一帧后不再更新，滚动时就只是一张纹理在合成，
 * 代价与一张图片相同。
 *
 * 坐标系：用正交相机把 3D 空间与 SVG 像素坐标对齐
 * （left=0,right=width,top=0,bottom=height），这样节点仍落在龙身上。
 */

interface Props {
  width: number;
  height: number;
  /** 各段的 SVG path d（按顺序首尾相接） */
  paths: string[];
  /** 是否显示（false 时不渲染，省开销） */
  enabled?: boolean;
  completed: boolean;
}

/** 龙鳞法线贴图（与 DragonHead3D 同款，保证材质一致） */
const makeScaleBump = (): THREE.CanvasTexture => {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(0, 0, S, S);
  const rows = 12;
  const cols = 9;
  const w = S / cols;
  const h = S / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * w + (r % 2 ? w / 2 : 0) + w / 2;
      const cy = r * h + h / 2;
      const g = ctx.createRadialGradient(
        cx - w * 0.1, cy - h * 0.18, h * 0.04,
        cx, cy, h * 0.6
      );
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.55, '#b8b8b8');
      g.addColorStop(1, '#3c3c3c');
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.45, h * 0.40, 0, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(40, 3);
  return tex;
};

export const DragonBody3D: React.FC<Props> = ({
  width,
  height,
  paths,
  enabled = true,
  completed,
 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !enabled || !paths.length) return;
    let disposed = false;

    const scene = new THREE.Scene();

    // 正交相机：把 3D 坐标与 SVG 像素坐标对齐。
    // 注意 OrthographicCamera(left, right, top, bottom) 要求 top > bottom；
    // 而我们的世界坐标里 y 已经取反（-p.y），所以画面纵向范围是
    // [-height, 0]，即 top=0、bottom=-height。
    const cam = new THREE.OrthographicCamera(0, width, 0, -height, -1000, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = `${width}px`;
    renderer.domElement.style.height = `${height}px`;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ---- 光照：主光从左上、补光从左下、轮廓光从右，做出圆柱体积感 ----
    scene.add(new THREE.HemisphereLight(0xfff4dc, 0x3a2a12, 0.9));
    const key = new THREE.DirectionalLight(0xfff6e2, 1.9);
    key.position.set(-400, -300, 600);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9dbbff, 0.55);
    fill.position.set(500, 200, 400);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffc266, 1.5);
    rim.position.set(300, -200, -500);
    scene.add(rim);

    // ---- 沿路径采样点，拼成一条连续中心线 ----
    const pts: THREE.Vector3[] = [];
    for (const d of paths) {
      const sampled = samplePathPoints(d, 14);
      for (const p of sampled) {
        const last = pts[pts.length - 1];
        // 段间接缝去重
        if (last && Math.hypot(last.x - p.x, last.y - p.y) < 2) continue;
        // y 取反：SVG 的 y 向下，Three 的 y 向上
        pts.push(new THREE.Vector3(p.x, -p.y, 0));
      }
    }
    if (pts.length < 4) return;

    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);

    // ---- 自定义管体：半径沿路径渐变（尾细颈粗）----
    const segments = Math.min(1400, Math.max(240, Math.floor(curve.getLength() / 8)));
    // 加粗：原来 7→13 太细，鳞片和棱面根本没有展示空间，
    // 看起来就是一根细软管。加粗到 13→22 才有"龙身"的体量。
    const radialSegs = 20;
    const r0 = 13;  // 尾端半径
    const r1 = 22;  // 颈端半径

    const radial = curve.computeFrenetFrames(segments, false);
    const pos: number[] = [];
    const col: number[] = [];
    const norm: number[] = [];
    const uv: number[] = [];
    const index: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const P = curve.getPointAt(t);
      // 半径随 t 平滑增大，中段略带起伏，看起来像有肌肉的躯体
      const bulge = 1 + 0.10 * Math.sin(t * Math.PI * 3.2);
      const R = (r0 + (r1 - r0) * Math.pow(t, 0.85)) * bulge;
      const N = radial.normals[i];
      const B = radial.binormals[i];

      for (let j = 0; j <= radialSegs; j++) {
        const v = (j / radialSegs) * Math.PI * 2;
        const sin = Math.sin(v);
        const cos = -Math.cos(v);
        const nx = cos * N.x + sin * B.x;
        const ny = cos * N.y + sin * B.y;
        const nz = cos * N.z + sin * B.z;

        // 环向起伏：让截面不是完美圆，而是有鳞片棱的圆角多边形，
        // 侧面轮廓才有"龙身"的骨感而不是一根光滑软管
        const ripple = 1 + 0.06 * Math.sin(v * 9) + 0.03 * Math.cos(v * 14 + t * 40);
        const RR = R * ripple;

        // 腹部亮、背部暗：v 在 π 附近是"下方"（对应世界坐标的腹部）
        const belly = Math.max(0, -ny);          // 朝下的分量
        const c = belly * 0.75;                  // 腹部权重
        // 背用饱和金、腹用浅金：中国龙通体金黄，靠明度区分而非色相
        const baseC = completed
          ? new THREE.Color('#6ada1c')
          : new THREE.Color('#e8b62e');
        const bellyC = completed
          ? new THREE.Color('#c9f79a')
          : new THREE.Color('#fbe7b0');
        const mixed = baseC.clone().lerp(bellyC, c);
        col.push(mixed.r, mixed.g, mixed.b);

        norm.push(nx, ny, nz);
        pos.push(P.x + RR * nx, P.y + RR * ny, P.z + RR * nz);
        uv.push(t * 26, j / radialSegs);
      }
    }
    for (let i = 1; i <= segments; i++) {
      for (let j = 1; j <= radialSegs; j++) {
        const a = (radialSegs + 1) * (i - 1) + (j - 1);
        const b = (radialSegs + 1) * i + (j - 1);
        const c = (radialSegs + 1) * i + j;
        const d = (radialSegs + 1) * (i - 1) + j;
        index.push(a, b, d, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(index);

    const scaleBump = makeScaleBump();
    const bodyMat = new THREE.MeshStandardMaterial({
      // 顶点色已经带颜色，材质底色必须是白，否则两者相乘会让金色发棕
      color: new THREE.Color(0xffffff),
      roughness: 0.42,
      metalness: 0.34,
      bumpMap: scaleBump,
      bumpScale: 1.2,
      vertexColors: true,
    });
    const body = new THREE.Mesh(geo, bodyMat);
    scene.add(body);

    // ---- 背脊尖刺：沿曲线等距放置，永远朝"上"（-y 在 Three 里是上方）----
    const spikeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(completed ? '#8fe05e' : '#f6c33f'),
      roughness: 0.35,
      metalness: 0.45,
    });
    const spikeCount = Math.floor(curve.getLength() / 26);
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < spikeCount; i++) {
      const t = (i + 0.5) / spikeCount;
      const P = curve.getPointAt(t);
      const T = curve.getTangentAt(t);
      // 背脊方向 = 切线 × Z轴，再取朝上的那支
      const side = new THREE.Vector3().crossVectors(T, new THREE.Vector3(0, 0, 1)).normalize();
      if (side.y < 0) side.negate();
      const h = 22 + 8 * Math.sin(t * Math.PI * 5);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(4.6, h, 6), spikeMat);
      // 锥的默认轴是 +Y，旋转到 side 方向
      cone.position.copy(P).addScaledVector(side, 14 + h / 2);
      cone.quaternion.setFromUnitVectors(up, side);
      scene.add(cone);
    }

    // ---- 只渲染一次：内容静态，避免滚动时每帧重绘 ----
    const draw = () => {
      if (disposed) return;
      renderer.render(scene, cam);
    };
    draw();
    // 字体/尺寸稳定后再补一帧，防止某些浏览器首帧空白
    const t1 = window.setTimeout(draw, 120);
    const t2 = window.setTimeout(draw, 500);

    return () => {
      disposed = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      bodyMat.dispose();
      spikeMat.dispose();
      scaleBump.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [width, height, paths, enabled, completed]);

  if (!enabled) return null;
  return <div ref={mountRef} className="dragon-body-3d" aria-hidden="true" />;
};

export default DragonBody3D;
