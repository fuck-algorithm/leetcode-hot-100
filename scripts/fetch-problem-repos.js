/**
 * 根据 LeetCode Hot 100 题目数据，直接拼接 GitHub 仓库地址
 * 并检查仓库是否公开，公开的仓库才有演示动画
 * 
 * 仓库格式: leetcode-{id}-{titleSlug}
 * GitHub Pages 格式: https://fuck-algorithm.github.io/leetcode-{id}-{titleSlug}/
 * 
 * 使用方法: node scripts/fetch-problem-repos.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 代理配置
const PROXY = 'http://127.0.0.1:7890';

// 检查仓库是否公开
function checkRepoPublic(repoName) {
  const url = `https://github.com/fuck-algorithm/${repoName}`;
  try {
    const result = execSync(
      `curl -x ${PROXY} -s -o /dev/null -w "%{http_code}" "${url}"`,
      { encoding: 'utf-8', timeout: 10000 }
    ).trim();
    return result === '200';
  } catch (error) {
    return false;
  }
}

async function main() {
  try {
    // 1. 读取 leetcode-hot-100.json
    const dataPath = path.join(__dirname, '../src/data/leetcode-hot-100.json');
    const leetcodeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const questions = leetcodeData.data.favoriteQuestionList.questions;

    console.log(`总题目数: ${questions.length}`);
    console.log(`使用代理: ${PROXY}`);
    console.log('正在检查仓库是否公开...\n');

    const problemRepoMap = {};
    let publicCount = 0;
    let privateCount = 0;

    // 2. 遍历每个题目，拼接仓库地址并检查是否公开
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const repoName = `leetcode-${question.questionFrontendId}-${question.titleSlug}`;
      const repoUrl = `https://github.com/fuck-algorithm/${repoName}`;
      const pagesUrl = `https://fuck-algorithm.github.io/${repoName}/`;

      process.stdout.write(`[${i + 1}/${questions.length}] #${question.questionFrontendId} ${question.titleSlug}... `);

      const isPublic = checkRepoPublic(repoName);

      question.repo = {
        name: repoName,
        url: repoUrl,
        isPublic: isPublic,
        pagesUrl: isPublic ? pagesUrl : null
      };

      // hasAnimation 根据仓库是否公开来判断
      question.hasAnimation = isPublic;

      problemRepoMap[question.questionFrontendId] = question.repo;

      if (isPublic) {
        console.log('✓ 公开');
        publicCount++;
      } else {
        console.log('✗ 私有/不存在');
        privateCount++;
      }

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 3. 保存更新后的数据
    fs.writeFileSync(dataPath, JSON.stringify(leetcodeData, null, 2), 'utf-8');

    // 4. 输出统计信息
    console.log('\n========== 统计信息 ==========');
    console.log(`总题目数: ${questions.length}`);
    console.log(`公开仓库 (有演示): ${publicCount}`);
    console.log(`私有/不存在 (无演示): ${privateCount}`);

    // 5. 保存仓库映射到单独文件
    const repoMapPath = path.join(__dirname, '../src/data/problem-repos.json');
    fs.writeFileSync(repoMapPath, JSON.stringify(problemRepoMap, null, 2), 'utf-8');
    console.log(`\n仓库映射已保存到: ${repoMapPath}`);

    console.log('\n✅ 完成！');

  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

main();
