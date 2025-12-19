const fs = require('fs');
const path = require('path');

// 支持的动画格式
const ANIMATION_FORMATS = ['mp4', 'webm', 'mov', 'gif', 'png', 'jpg', 'jpeg'];

// 扫描 public/animations 目录
const animationsDir = path.join(__dirname, '../public/animations');
const outputFile = path.join(__dirname, '../src/data/animation-list.json');

function generateAnimationList() {
  const animationMap = {};
  
  if (!fs.existsSync(animationsDir)) {
    console.log('animations 目录不存在，创建空清单');
    fs.writeFileSync(outputFile, JSON.stringify({ animations: {} }, null, 2));
    return;
  }
  
  const files = fs.readdirSync(animationsDir);
  
  files.forEach(file => {
    const ext = path.extname(file).slice(1).toLowerCase();
    if (!ANIMATION_FORMATS.includes(ext)) return;
    
    const problemId = path.basename(file, path.extname(file));
    
    // 记录每个题目的可用格式（优先级：视频 > 图片）
    if (!animationMap[problemId]) {
      animationMap[problemId] = { formats: [] };
    }
    animationMap[problemId].formats.push(ext);
  });
  
  // 为每个题目选择最优格式
  Object.keys(animationMap).forEach(id => {
    const formats = animationMap[id].formats;
    // 优先选择视频格式
    const videoFormat = formats.find(f => ['mp4', 'webm', 'mov'].includes(f));
    const imageFormat = formats.find(f => ['gif', 'png', 'jpg', 'jpeg'].includes(f));
    animationMap[id].preferredFormat = videoFormat || imageFormat;
    animationMap[id].type = videoFormat ? 'video' : 'image';
  });
  
  const result = {
    generatedAt: new Date().toISOString(),
    count: Object.keys(animationMap).length,
    animations: animationMap
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`✅ 生成动画清单完成！共 ${result.count} 个动画`);
  console.log(`   题目ID: ${Object.keys(animationMap).join(', ')}`);
}

generateAnimationList();
