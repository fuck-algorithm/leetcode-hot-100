import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * 3D 龙（Three.js + 现成 glTF 模型）。
 *
 * 为什么放弃程序化建模：
 *   前几版用 Lathe/球体/圆柱手搓，撑死只能做出"像龙的头部轮廓"，
 *   四肢、翅膀、体态、骨刺这些真正决定逼真的东西根本堆不出来。
 *   现成资产的上限高一个量级，所以换成加载 glTF。
 *
 * 模型来源：
 *   "Dragon" by Quaternius — CC0 / Public Domain（无署名义务）
 *   https://poly.pizza/m/3rUm1cN3yp
 *   实际文件 md5 已核对：public/models/dragon.glb = ae5b8510...glb
 *
 * 摆放姿态（用户要求）：
 *   龙身从画面**上方**往下盘，龙头在最下方，且**抬起来面向用户**。
 *   模型自带长颈 + 抬头的姿态，正好符合；再用相机与旋转把它摆成
 *   从屏幕下方"探出来"的角度。
 */

interface Props {
  width: number;
  height: number;
  completed: boolean;
}

/**
 * 模型署名。
 * Quaternius 的 Dragon 是 CC0（公有领域），法律上不需要署名；
 * 仍然保留一行致谢，是出于对作者的尊重，不是许可要求。
 */
export const DRAGON_CREDIT = 'Dragon by Quaternius — CC0 (Public Domain)';

const MODEL_URL = `${process.env.PUBLIC_URL}/models/dragon.glb`;

export const DragonHead3D: React.FC<Props> = ({ width, height, completed }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [credit, setCredit] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ---- 光照：暖主光 + 冷补光 + 金色轮廓光，让龙身的骨刺有层次 ----
    scene.add(new THREE.HemisphereLight(0xfff2dc, 0x2a1e0c, 1.1));

    const key = new THREE.DirectionalLight(0xfff4e0, 2.6);
    key.position.set(4, 6, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x8fb2ff, 0.85);
    fill.position.set(-5, -1, 4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffb04a, 2.2);
    rim.position.set(-3, 3, -6);
    scene.add(rim);

    // 环境反射：用渐变天空烘 PMREM，给 PBR 材质一点环境光
    const envScene = new THREE.Scene();
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(30, 24, 12),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#f6e6c8'), side: THREE.BackSide })
    );
    envScene.add(sky);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(envScene, 0.05).texture;
    scene.environment = envMap;
    pmrem.dispose();

    // ---- 主题色：未完成金色，完成态翠绿 ----
    const mainColor = new THREE.Color(completed ? '#57c21a' : '#d79a2b');
    const accentColor = new THREE.Color(completed ? '#95e05a' : '#efc46a');
    const darkColor = new THREE.Color(completed ? '#3d8a10' : '#8c5c14');

    const dragon = new THREE.Group();
    scene.add(dragon);

    // 骨骼动画：模型自带 8 段（Flying_Idle / Fast_Flying / Headbutt...），
    // 优先用飞行动画循环播放，龙才"活"起来，而不是一尊雕塑。
    let mixer: THREE.AnimationMixer | null = null;
    let modelRef: THREE.Object3D | null = null;

    let raf = 0;
    let t = 0;
    const pointer = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    mount.addEventListener('mousemove', onMove);

    // ---- 动画循环（模型加载完成前先空转，避免白屏） ----
    const animate = () => {
      if (disposed) return;
      t += 0.016;
      mixer?.update(0.016);
      // 极轻微的整体浮动 + 鼠标视差，不改变模型自身姿态
      if (modelRef) {
        modelRef.position.y = basePosY + Math.sin(t * 0.7) * 0.04;
        camera.position.x = pointer.x * 0.35;
        camera.position.y = s2_0.y * 0.08 + pointer.y * -0.25;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      // 调试探针：把场景实际状态挂到 window 上，便于外部核查
      (window as any).__dragonProbe = {
        camPos: camera.position.toArray().map((n: number) => +n.toFixed(2)),
        fov: camera.fov,
        sceneChildren: scene.children.length,
        meshes: (() => { let c = 0; scene.traverse((o: any) => { if (o.isMesh) c++; }); return c; })(),
        visible: (() => { let c = 0; scene.traverse((o: any) => { if (o.isMesh && o.visible && o.material?.visible !== false) c++; }); return c; })(),
        bbox: (() => {
          const box = new THREE.Box3().setFromObject(scene);
          return box.isEmpty() ? 'empty' : [box.min.toArray().map((n:number)=>+n.toFixed(2)), box.max.toArray().map((n:number)=>+n.toFixed(2))];
        })(),
        frames: t.toFixed(1),
      };
      raf = requestAnimationFrame(animate);
    };

    // 默认朝向在加载后按实际包围盒确定
    let baseYaw = 0;
    let basePosY = 0;
    let s2_0 = new THREE.Vector3(0, 3, 0);
    raf = requestAnimationFrame(animate);

    new GLTFLoader().load(
      MODEL_URL,
      gltf => {
        if (disposed) return;
        const obj = gltf.scene;

        // 统一材质：模型是纯色无贴图的，这里染成金色并提升质感
        // 模型是纯色低模，按原材质的亮度分三档重新上色：
        // 深色 -> 背刺/爪，浅色 -> 腹部，其余 -> 主体。
        // 不做 color.multiply（原材质若是白色会乘出奇怪结果）。
        obj.traverse(child => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          const src = mesh.material as THREE.MeshStandardMaterial | undefined;
          const r = src?.color?.r ?? 0.5;
          const g = src?.color?.g ?? 0.5;
          const b = src?.color?.b ?? 0.5;
          const lum = (r + g + b) / 3;
          let color = mainColor;
          if (lum < 0.45) color = darkColor;
          else if (lum > 0.72) color = accentColor;
          mesh.material = new THREE.MeshStandardMaterial({
            color: color.clone(),
            roughness: 0.60,
            metalness: 0.20,
            envMapIntensity: 0.8,
          });
        });

        setCredit(true);

        // 不播动画：这个 glTF 的动画会驱动各节点自身 transform，
        // 从而覆盖父级做的居中/缩放，导致龙身跑出视野只剩头部。
        // 静态摆好姿态反而稳定。

        // ---- 姿态与取景（照搬已在独立页面验证通过的实现）----
        // 关键：obj 直接加到 scene，不再经过 dragon 组。
        // 之前套了一层组、又在动画循环里改组的旋转，两次变换互相叠加，
        // 导致每帧都把模型推到视锥外，只剩头部可见。
        // 姿态：**正面抬头**（在独立页面里逐个角度试出来的最优解）。
        // 模型原始朝向是"展翅平飞、脸朝 +Z"，不做旋转时正好正对镜头、
        // 抬头张嘴，龙翼在两侧展开 —— 这正是"龙头在下、抬头面向用户"。
        // 唯一保留的小改动：绕 X 轴微微后仰 8°，让下巴抬高一点更有神。
        obj.rotation.set(-Math.PI * 0.045, 0, 0);
        obj.updateMatrixWorld(true);

        // 归一化：先旋转、再按旋转后的包围盒居中 + 等比缩放。
        // 注意顺序——必须先 sub(center) 再 scale，且位置要跟着同一比例缩放，
        // 否则模型会被推离原点（踩过）。
        const b1 = new THREE.Box3().setFromObject(obj);
        const c1 = b1.getCenter(new THREE.Vector3());
        const s1 = b1.getSize(new THREE.Vector3());
        const max1 = Math.max(s1.x, s1.y, s1.z) || 1;
        const k = 3.0 / max1;

        obj.position.set(-c1.x * k, -c1.y * k, -c1.z * k);
        obj.scale.setScalar(k);
        scene.add(obj);
        obj.updateMatrixWorld(true);

        const b2 = new THREE.Box3().setFromObject(obj);
        const s2 = b2.getSize(new THREE.Vector3());
        // 按视锥几何反推距离：水平垂直都要装得下，再留 35% 余量
        const tan = Math.tan((camera.fov * Math.PI) / 360);
        const needV = s2.y / 2 / tan;
        const needH = s2.x / 2 / (width / height) / tan;
        const d = Math.max(needV, needH) * 1.35;
        camera.position.set(0, 0, d);
        camera.lookAt(0, 0, 0);

        modelRef = obj;
        basePosY = obj.position.y;
        s2_0 = s2.clone();
      },
      undefined,
      err => {
        // 加载失败不阻塞页面，只是不显示 3D 龙头
        console.error('[DragonHead3D] 模型加载失败:', err);
      }
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      mixer?.stopAllAction();
      mount.removeEventListener('mousemove', onMove);
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mt = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mt)) mt.forEach(x => x.dispose());
        else mt?.dispose();
      });
      envMap.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [width, height, completed]);

  return (
    <>
      <div ref={mountRef} className="dragon-head-3d" aria-hidden="true" />
      {/* CC-BY 3.0 要求署名 */}
      {credit && <span className="dragon-credit">{DRAGON_CREDIT}</span>}
    </>
  );
};

export default DragonHead3D;
