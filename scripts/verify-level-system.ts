/**
 * 验证等级系统是否正好是100级
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取配置文件
const configPath = path.join(__dirname, '../src/services/experience-system/config/experience-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

console.log('=== 等级系统验证 ===\n');

// 1. 检查levelThresholds数组长度
const levelThresholds = config.levelThresholds;
console.log(`1. levelThresholds数组长度: ${levelThresholds.length}`);
console.log(`   预期: 100`);
console.log(`   结果: ${levelThresholds.length === 100 ? '✓ 通过' : '✗ 失败'}\n`);

// 2. 检查第一个元素
console.log(`2. 第一个等级门槛（1级）: ${levelThresholds[0]}`);
console.log(`   预期: 0`);
console.log(`   结果: ${levelThresholds[0] === 0 ? '✓ 通过' : '✗ 失败'}\n`);

// 3. 检查最后一个元素
const lastThreshold = levelThresholds[levelThresholds.length - 1];
console.log(`3. 最后一个等级门槛（100级）: ${lastThreshold}`);
console.log(`   预期: ${config.totalExperience}`);
console.log(`   结果: ${lastThreshold === config.totalExperience ? '✓ 通过' : '✗ 失败'}\n`);

// 4. 检查数组是否严格递增
let isStrictlyIncreasing = true;
for (let i = 1; i < levelThresholds.length; i++) {
  if (levelThresholds[i] <= levelThresholds[i - 1]) {
    isStrictlyIncreasing = false;
    console.log(`   ✗ 错误: 索引${i}处不是严格递增 (${levelThresholds[i - 1]} -> ${levelThresholds[i]})`);
  }
}
console.log(`4. 数组是否严格递增: ${isStrictlyIncreasing ? '✓ 通过' : '✗ 失败'}\n`);

// 5. 模拟getCurrentLevel方法
function getCurrentLevel(experience: number): number {
  if (experience < 0) return 1;
  if (experience >= levelThresholds[levelThresholds.length - 1]) {
    return levelThresholds.length;
  }

  let left = 0;
  let right = levelThresholds.length - 1;
  let result = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (levelThresholds[mid] <= experience) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result + 1;
}

// 6. 测试边界情况
console.log('5. 边界情况测试:');
const testCases = [
  { exp: 0, expected: 1, desc: '0经验' },
  { exp: 1, expected: 1, desc: '1经验' },
  { exp: 101, expected: 1, desc: '101经验（刚好低于2级）' },
  { exp: 102, expected: 2, desc: '102经验（刚好2级）' },
  { exp: 103, expected: 2, desc: '103经验（2级）' },
  { exp: 999999, expected: 99, desc: '999999经验（接近满级）' },
  { exp: 1000000, expected: 100, desc: '1000000经验（满级）' },
  { exp: 1000001, expected: 100, desc: '1000001经验（超过满级）' },
];

let allTestsPassed = true;
for (const test of testCases) {
  const actual = getCurrentLevel(test.exp);
  const passed = actual === test.expected;
  if (!passed) allTestsPassed = false;
  console.log(`   ${test.desc}: ${actual}级 (预期${test.expected}级) ${passed ? '✓' : '✗'}`);
}
console.log(`   总体结果: ${allTestsPassed ? '✓ 通过' : '✗ 失败'}\n`);

// 7. 检查每10级的经验值
console.log('6. 每10级的经验值门槛:');
for (let level = 10; level <= 100; level += 10) {
  const threshold = levelThresholds[level - 1];
  console.log(`   ${level}级: ${threshold.toLocaleString()}经验`);
}

// 8. 总结
console.log('\n=== 验证总结 ===');
const allChecks = [
  levelThresholds.length === 100,
  levelThresholds[0] === 0,
  lastThreshold === config.totalExperience,
  isStrictlyIncreasing,
  allTestsPassed
];
const passedCount = allChecks.filter(c => c).length;
console.log(`通过检查: ${passedCount}/${allChecks.length}`);
console.log(`最终结果: ${passedCount === allChecks.length ? '✓ 等级系统正确，正好是100级' : '✗ 等级系统存在问题'}`);
