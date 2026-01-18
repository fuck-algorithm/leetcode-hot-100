/**
 * 使用实际的ExperienceSystem测试等级系统
 */

import { ExperienceSystem } from '../src/services/experience-system/ExperienceSystem.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '../src/services/experience-system/config/experience-config.json');
const experienceConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

console.log('=== 使用ExperienceSystem测试等级系统 ===\n');

// 创建ExperienceSystem实例
const system = new ExperienceSystem(experienceConfig);

// 1. 测试getLevelThresholds
const levelThresholds = system.getLevelThresholds();
console.log(`1. 等级门槛数组长度: ${levelThresholds.length}`);
console.log(`   结果: ${levelThresholds.length === 100 ? '✓ 正好100个门槛' : '✗ 不是100个门槛'}\n`);

// 2. 测试getCurrentLevel方法
console.log('2. 测试getCurrentLevel方法:');
const levelTests = [
  { exp: 0, expected: 1 },
  { exp: 102, expected: 2 },
  { exp: 408, expected: 3 },
  { exp: 50000, expected: 10 },
  { exp: 500000, expected: 71 },
  { exp: 999999, expected: 99 },
  { exp: 1000000, expected: 100 },
  { exp: 2000000, expected: 100 },
];

let allLevelTestsPassed = true;
for (const test of levelTests) {
  const actual = system.getCurrentLevel(test.exp);
  const passed = actual === test.expected;
  if (!passed) allLevelTestsPassed = false;
  console.log(`   经验${test.exp.toLocaleString()}: ${actual}级 (预期${test.expected}级) ${passed ? '✓' : '✗'}`);
}
console.log(`   结果: ${allLevelTestsPassed ? '✓ 所有测试通过' : '✗ 有测试失败'}\n`);

// 3. 测试getExperienceToNextLevel
console.log('3. 测试getExperienceToNextLevel方法:');
const nextLevelTests = [
  { exp: 0, expectedNext: 102 },
  { exp: 50, expectedNext: 52 },
  { exp: 102, expectedNext: 306 },
  { exp: 999999, expectedNext: 1 },
  { exp: 1000000, expectedNext: 0 },
];

let allNextLevelTestsPassed = true;
for (const test of nextLevelTests) {
  const actual = system.getExperienceToNextLevel(test.exp);
  const passed = actual === test.expectedNext;
  if (!passed) allNextLevelTestsPassed = false;
  console.log(`   经验${test.exp.toLocaleString()}: 还需${actual}经验 (预期${test.expectedNext}) ${passed ? '✓' : '✗'}`);
}
console.log(`   结果: ${allNextLevelTestsPassed ? '✓ 所有测试通过' : '✗ 有测试失败'}\n`);

// 4. 测试getLevelProgress
console.log('4. 测试getLevelProgress方法:');
const progressTests = [
  { exp: 0, desc: '1级起点' },
  { exp: 51, desc: '1级中间' },
  { exp: 101, desc: '1级末尾' },
  { exp: 102, desc: '2级起点' },
  { exp: 1000000, desc: '100级（满级）' },
];

for (const test of progressTests) {
  const progress = system.getLevelProgress(test.exp);
  const level = system.getCurrentLevel(test.exp);
  console.log(`   ${test.desc}(${test.exp}经验): ${level}级, 进度${(progress * 100).toFixed(2)}%`);
}
console.log();

// 5. 验证每个等级的连续性
console.log('5. 验证等级连续性:');
let continuityPassed = true;
for (let i = 0; i < levelThresholds.length - 1; i++) {
  const currentThreshold = levelThresholds[i];
  const nextThreshold = levelThresholds[i + 1];
  
  // 测试当前门槛应该是当前等级
  const levelAtThreshold = system.getCurrentLevel(currentThreshold);
  const expectedLevel = i + 1;
  
  if (levelAtThreshold !== expectedLevel) {
    console.log(`   ✗ 错误: 经验${currentThreshold}应该是${expectedLevel}级，实际是${levelAtThreshold}级`);
    continuityPassed = false;
  }
  
  // 测试下一个门槛-1应该还是当前等级
  if (nextThreshold > currentThreshold + 1) {
    const levelBeforeNext = system.getCurrentLevel(nextThreshold - 1);
    if (levelBeforeNext !== expectedLevel) {
      console.log(`   ✗ 错误: 经验${nextThreshold - 1}应该是${expectedLevel}级，实际是${levelBeforeNext}级`);
      continuityPassed = false;
    }
  }
}
console.log(`   结果: ${continuityPassed ? '✓ 等级连续性正确' : '✗ 等级连续性有问题'}\n`);

// 6. 显示等级分布
console.log('6. 等级分布（每10级）:');
for (let level = 10; level <= 100; level += 10) {
  const threshold = levelThresholds[level - 1];
  const percentage = (threshold / experienceConfig.totalExperience * 100).toFixed(2);
  console.log(`   ${level}级: ${threshold.toLocaleString()}经验 (${percentage}%)`);
}
console.log();

// 7. 总结
console.log('=== 测试总结 ===');
const allPassed = allLevelTestsPassed && allNextLevelTestsPassed && continuityPassed;
console.log(`最终结果: ${allPassed ? '✓ 等级系统完全正确，正好是100级' : '✗ 等级系统存在问题'}`);
console.log(`最大等级: ${system.getCurrentLevel(experienceConfig.totalExperience)}级`);
console.log(`总经验值: ${experienceConfig.totalExperience.toLocaleString()}`);
