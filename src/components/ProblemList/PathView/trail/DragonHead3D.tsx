import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js 龙首。
 *
 * 上一版失败的原因很明确：**用球体/圆柱去堆**，堆出来只能是一盘香肠。
 * 这一步改成"雕刻"：
 *
 *   1. 取一个高细分球体，逐顶点用参数化变形雕刻出头骨轮廓
 *      （长吻收窄、下颌下垂、额脊隆起、颊部收边），再重算法线 ——
 *      轮廓来自形变，而不是若干独立几何体的并集
 *   2. 表面真实感靠**程序化鳞片法线贴图**（canvas 画好鳞片后当 bumpMap），
 *      鳞片在光照下有实际起伏，这是"看起来像鳞甲而不是塑料皮"的关键
 *   3. 环境贴图（PMREM）让 PBR 材质有真实反射，眼珠用 clearcoat 做出湿滑感
 *   4. 角用 TubeGeometry 沿曲线、半径递减；牙沿颌线排布
 *
 * 仍然只在这一处挂 WebGL 画布：整页 7500px，龙身继续走 SVG。
 */

interface Props {
  width: number;
  height: number;
  completed: boolean;
}

/** 程序化生成鳞片法线/凹凸贴图 */
const makeScaleTexture = (): THREE.CanvasTexture => {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext('2d')!;

  // 底色中灰（凹凸贴图以 128 为基准）
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, S, S);

  const rows = 8;
  const cols = 6;
  const w = S / cols;
  const h = S / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offset = r % 2 === 0 ? 0 : w / 2;
      const cx = c * w + offset + w / 2;
      const cy = r * h + h / 2;

      // 每片鳞：中心亮、边缘暗，形成凸起的穹顶
      const g = ctx.createRadialGradient(cx - w * 0.12, cy - h * 0.18, h * 0.08, cx, cy, h * 0.72);
      g.addColorStop(0, '#f2f2f2');
      g.addColorStop(0.55, '#c8c8c8');
      g.addColorStop(1, '#565656');

      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.46, h * 0.42, 0, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // 鳞片下缘压一道深缝，强化层次
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.30, w * 0.42, h * 0.16, 0, 0, Math.PI);
      ctx.fillStyle = 'rgba(40,40,40,0.5)';
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
};

/**
 * 雕刻头骨。
 *
 * 之前用球体做逐顶点形变失败了：球体极点分布在 Z 轴，沿 X 判断"吻部"
 * 实际落在错误的经纬度上，拉长之后依然是颗球。
 *
 * 改用 LatheGeometry：先定义一条"侧视轮廓线"（半高 -> 半径），
 * 绕轴旋转成实体。轮廓完全由这条线决定，所以吻部能明确地拉长、收窄，
 * 额骨能明确地隆起 —— 形状可控，不靠运气。
 */
const sculptSkull = (): THREE.BufferGeometry => {
  // 从左（吻尖，x=-1）到右（后脑，x=+1）的半径序列。
  // 每条: [x 位置, 半径(相对头高)]
  const spine: Array<[number, number]> = [
    [-1.00, 0.02],  // 吻尖
    [-0.94, 0.13],  // 吻端
    [-0.86, 0.20],
    [-0.74, 0.27],
    [-0.60, 0.34],  // 吻部
    [-0.44, 0.42],
    [-0.26, 0.54],  // 颊部最宽
    [-0.06, 0.62],
    [0.14, 0.63],   // 颅顶最宽
    [0.34, 0.58],
    [0.54, 0.48],
    [0.72, 0.34],
    [0.86, 0.20],
    [0.97, 0.08],   // 后脑收口
    [1.00, 0.02],
  ];

  // Lathe 绕 Y 轴旋转；半径用轮廓值，高度方向取"头长"
  const pts = spine.map(([x, r]) => new THREE.Vector2(Math.max(r, 0.006), x));

  const geo = new THREE.LatheGeometry(pts, 48, 0, Math.PI * 2);
  // 旋转轴从 Y 换成 X：吻部朝 -X
  geo.rotateZ(-Math.PI / 2);
  // 纵向压扁（爬行类头部偏扁），横向略收
  geo.scale(1.0, 0.78, 0.86);

  // 额骨隆起：把后段上表面顶高一点，做出一条脊
  const attr = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < attr.count; i++) {
    v.fromBufferAttribute(attr, i);
    if (v.y > 0) {
      const spineX = Math.exp(-Math.pow((v.x - 0.10) / 0.30, 2));
      v.y += spineX * 0.16;
    } else {
      // 下颌下垂一点
      const jawX = Math.exp(-Math.pow((v.x + 0.55) / 0.42, 2));
      v.y -= jawX * 0.10;
    }
  }
  geo.computeVertexNormals();
  return geo;
};

/**
 * 下颌：比头短、更扁，独立一块便于张开。
 */
const sculptJaw = (): THREE.BufferGeometry => {
  const spine: Array<[number, number]> = [
    [-0.85, 0.02],
    [-0.75, 0.14],
    [-0.60, 0.22],
    [-0.42, 0.28],
    [-0.20, 0.30],
    [0.05, 0.28],
    [0.28, 0.22],
    [0.48, 0.14],
    [0.60, 0.04],
  ];
  const pts = spine.map(([x, r]) => new THREE.Vector2(Math.max(r, 0.006), x));
  const geo = new THREE.LatheGeometry(pts, 40, 0, Math.PI * 2);
  geo.rotateZ(-Math.PI / 2);
  geo.scale(1.0, 0.56, 0.80);
  geo.computeVertexNormals();
  return geo;
};

export const DragonHead3D: React.FC<Props> = ({ width, height, completed }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 200);
    // 侧前方视角：吻部朝 -X，把相机放在 -X 与 +Z 之间，才看得到侧脸
    camera.position.set(-3.6, 1.15, 5.2);
    camera.lookAt(-0.7, 0.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ---- 环境贴图：用渐变天空生成 PMREM，给 PBR 材质真实反射 ----
    const envScene = new THREE.Scene();
    const skyGeo = new THREE.SphereGeometry(50, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      vertexColors: true,
    });
    // 顶点色：顶部暖白、地平线暖橙、底部深棕
    const skyPos = skyGeo.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    for (let i = 0; i < skyPos.count; i++) {
      const y = skyPos.getY(i) / 50;
      if (y > 0.2) {
        colors.push(1.0, 0.95, 0.85);
      } else if (y > -0.2) {
        colors.push(1.0, 0.72, 0.38);
      } else {
        colors.push(0.24, 0.16, 0.08);
      }
    }
    skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    envScene.add(new THREE.Mesh(skyGeo, skyMat));

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;
    pmrem.dispose();

    // ---- 光照 ----
    scene.add(new THREE.HemisphereLight(0xfff3dc, 0x2b1d0b, 0.55));

    const key = new THREE.DirectionalLight(0xfff4e2, 3.2);
    key.position.set(4.5, 5.5, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x7f9fff, 0.75);
    fill.position.set(-5, -1.5, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffb452, 2.4);
    rim.position.set(-3, 2.5, -5.5);
    scene.add(rim);

    // ---- 材质 ----
    const scales = makeScaleTexture();
    const scaleBump = makeScaleTexture();

    const skinColor = completed ? '#4aa915' : '#c98a2c';
    const skin = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinColor),
      roughness: 0.52,
      metalness: 0.28,
      bumpMap: scaleBump,
      bumpScale: 0.055,
      envMapIntensity: 0.9,
    });

    const bellyColor = completed ? '#86d552' : '#e8cb8a';
    const belly = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bellyColor),
      roughness: 0.66,
      metalness: 0.10,
      bumpMap: scaleBump,
      bumpScale: 0.03,
      envMapIntensity: 0.7,
    });

    const hornMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d8c9a4'),
      roughness: 0.72,
      metalness: 0.05,
      envMapIntensity: 0.6,
    });

    const toothMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fcf7e9'),
      roughness: 0.28,
      metalness: 0.02,
      envMapIntensity: 0.5,
    });

    // 眼珠：clearcoat 做出角膜的反光层
    const eyeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(completed ? '#bbff7a' : '#ffcf4a'),
      roughness: 0.08,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.6,
    });

    const pupilMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0b0a06'),
      roughness: 0.04,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 1.2,
    });

    const mouthMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#48181a'),
      roughness: 0.95,
      metalness: 0.0,
    });

    const dragon = new THREE.Group();
    // 侧脸朝镜头：脸朝 -X，绕 Y 转一点露出 3/4 面
    // 让龙身从右后方延伸、吻部朝左前，形成 3/4 侧脸构图
    dragon.rotation.y = -Math.PI * 0.30;
    scene.add(dragon);

    // ---- 头骨 ----
    const skull = new THREE.Mesh(sculptSkull(), skin);
    skull.scale.set(1.0, 1.0, 0.94);
    skull.position.set(0, 0.08, 0);
    dragon.add(skull);

    // ---- 下颌（微张） ----
    const jaw = new THREE.Mesh(sculptJaw(), belly);
    jaw.position.set(-0.34, -0.40, 0);
    jaw.rotation.z = -0.14;
    jaw.scale.set(1.06, 0.92, 0.90);
    dragon.add(jaw);

    // 口腔：张嘴时避免看穿
    const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 14), mouthMat);
    mouth.position.set(-0.62, -0.22, 0);
    mouth.scale.set(1.30, 0.26, 0.46);
    dragon.add(mouth);

    // ---- 眼睛：眼窝凹陷 + 角膜 + 竖瞳 ----
    for (const side of [-1, 1]) {
      // 眶骨隆起
      const socket = new THREE.Mesh(new THREE.SphereGeometry(0.22, 22, 16), skin);
      socket.position.set(-0.50, 0.26, 0.26 * side);
      socket.scale.set(1.15, 0.72, 0.85);
      dragon.add(socket);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 26, 20), eyeMat);
      eye.position.set(-0.57, 0.26, 0.30 * side);
      eye.scale.set(0.92, 1.05, 0.96);
      dragon.add(eye);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.062, 18, 14), pupilMat);
      pupil.position.set(-0.61, 0.26, 0.315 * side);
      pupil.scale.set(0.32, 1.5, 0.55);
      dragon.add(pupil);

      // 眉脊：压住眼上缘，形成凶相
      const brow = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.055, 0.30, 4, 12),
        skin
      );
      brow.position.set(-0.46, 0.40, 0.27 * side);
      brow.rotation.z = -0.32;
      brow.rotation.x = 0.22 * side;
      dragon.add(brow);
    }

    // ---- 鼻孔：两个内凹的小坑 ----
    for (const side of [-1, 1]) {
      const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 10), mouthMat);
      nostril.position.set(-0.88, 0.14, 0.10 * side);
      nostril.scale.set(1.3, 0.7, 0.85);
      dragon.add(nostril);
    }

    // ---- 角：沿曲线、半径递减，做出弯曲且变细的骨角 ----
    const addHorn = (side: number) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.02, 0.52, 0.22 * side),
        new THREE.Vector3(0.28, 0.82, 0.34 * side),
        new THREE.Vector3(0.54, 1.02, 0.42 * side),
        new THREE.Vector3(0.78, 1.08, 0.46 * side),
      ]);
      const segs = 16;
      for (let i = 0; i < segs; i++) {
        const t0 = i / segs;
        const t1 = (i + 1) / segs;
        const p0 = curve.getPoint(t0);
        const p1 = curve.getPoint(t1);
        const r0 = 0.10 * Math.pow(1 - t0, 1.3) + 0.010;
        const r1 = 0.10 * Math.pow(1 - t1, 1.3) + 0.010;
        const dir = new THREE.Vector3().subVectors(p1, p0);
        const len = dir.length();
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(r1, r0, len, 12, 1),
          hornMat
        );
        mesh.position.copy(p0).add(p1).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        dragon.add(mesh);
      }
      // 角尖小球收口
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), hornMat);
      tip.position.copy(curve.getPoint(1));
      dragon.add(tip);
    };
    addHorn(1);
    addHorn(-1);

    // ---- 牙：沿颌线排布，上颚朝下、下颚朝上 ----
    const addTooth = (
      x: number, y: number, z: number, len: number, down: boolean
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.030, len, 8),
        toothMat
      );
      mesh.position.set(x, y, z);
      mesh.rotation.z = down ? Math.PI : 0;
      dragon.add(mesh);
    };
    // 上颚
    addTooth(-0.84, -0.14, 0.08, 0.24, true);
    addTooth(-0.84, -0.14, -0.08, 0.24, true);
    addTooth(-0.64, -0.16, 0.12, 0.20, true);
    addTooth(-0.64, -0.16, -0.12, 0.20, true);
    addTooth(-0.44, -0.14, 0.15, 0.13, true);
    // 下颚
    addTooth(-0.80, -0.30, 0.08, 0.14, false);
    addTooth(-0.80, -0.30, -0.08, 0.14, false);
    addTooth(-0.56, -0.30, 0.11, 0.11, false);

    // ---- 龙须 ----
    for (const side of [-1, 1]) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.86, -0.12, 0.10 * side),
        new THREE.Vector3(-1.24, -0.20, 0.26 * side),
        new THREE.Vector3(-1.58, -0.12, 0.12 * side),
        new THREE.Vector3(-1.80, 0.06, 0.02 * side),
      ]);
      const whisker = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.028, 7, false),
        hornMat
      );
      dragon.add(whisker);
    }

    // 颈部不在这里画：右侧那块管道截面很突兀，
    // 改由页面上的 SVG"龙脖"从上方接入，3D 只负责头本身。

    // ---- 渲染循环：呼吸 + 鼠标视差 ----
    let raf = 0;
    let t = 0;
    const pointer = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    mount.addEventListener('mousemove', onMove);

    const animate = () => {
      t += 0.016;
      dragon.position.y = Math.sin(t * 0.75) * 0.045;
      dragon.rotation.y = -Math.PI * 0.30 + pointer.x * 0.14 + Math.sin(t * 0.5) * 0.03;
      dragon.rotation.x = pointer.y * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeEventListener('mousemove', onMove);
      scene.traverse(obj => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      [skin, belly, hornMat, toothMat, eyeMat, pupilMat, mouthMat, skyMat].forEach(m => m.dispose());
      scales.dispose();
      scaleBump.dispose();
      envMap.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [width, height, completed]);

  return <div ref={mountRef} className="dragon-head-3d" aria-hidden="true" />;
};

export default DragonHead3D;
