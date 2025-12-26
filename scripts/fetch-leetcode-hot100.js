/**
 * 从 LeetCode 获取最新的 Hot 100 题目列表
 * 包含每道题目的通过率 (acRate)
 * 
 * 使用方法: node scripts/fetch-leetcode-hot100.js
 */

const fs = require('fs');
const path = require('path');

// LeetCode GraphQL API
const LEETCODE_API = 'https://leetcode.cn/graphql';

// 获取学习计划中的题目列表
const studyPlanQuery = `
query studyPlanV2Detail($slug: String!) {
  studyPlanV2Detail(planSlug: $slug) {
    slug
    name
    planSubGroups {
      slug
      name
      questionNum
      questions {
        translatedTitle
        titleSlug
        title
        questionFrontendId
        paidOnly
        id
        difficulty
        topicTags {
          name
          nameTranslated
          slug
        }
        status
      }
    }
  }
}
`;

// 获取单个题目的详细信息（包含 acRate）
const questionDetailQuery = `
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    acRate
    stats
  }
}
`;

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function fetchHot100() {
  console.log('正在从 LeetCode 获取最新的 Hot 100 题目列表...');

  const response = await fetchWithRetry(LEETCODE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Referer': 'https://leetcode.cn/studyplan/top-100-liked/',
      'Origin': 'https://leetcode.cn'
    },
    body: JSON.stringify({
      query: studyPlanQuery,
      variables: { slug: 'top-100-liked' },
      operationName: 'studyPlanV2Detail'
    })
  });

  const text = await response.text();
  
  if (!response.ok) {
    console.log('Response body:', text);
    throw new Error(`LeetCode API 请求失败: ${response.status}`);
  }

  const data = JSON.parse(text);
  if (data.errors) {
    console.log('GraphQL errors:', JSON.stringify(data.errors, null, 2));
    throw new Error('GraphQL 查询错误');
  }
  
  return data.data.studyPlanV2Detail;
}

async function fetchQuestionDetail(titleSlug) {
  const response = await fetchWithRetry(LEETCODE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Referer': `https://leetcode.cn/problems/${titleSlug}/`,
      'Origin': 'https://leetcode.cn'
    },
    body: JSON.stringify({
      query: questionDetailQuery,
      variables: { titleSlug },
      operationName: 'questionData'
    })
  });

  const data = await response.json();
  return data.data?.question;
}

async function main() {
  try {
    const studyPlan = await fetchHot100();
    
    // 提取所有题目
    const allQuestions = [];
    for (const group of studyPlan.planSubGroups) {
      console.log(`分类: ${group.name} (${group.questions.length} 题)`);
      for (const q of group.questions) {
        allQuestions.push({
          difficulty: q.difficulty,
          id: parseInt(q.id),
          paidOnly: q.paidOnly,
          questionFrontendId: q.questionFrontendId,
          status: q.status || 'TO_DO',
          title: q.title,
          titleSlug: q.titleSlug,
          translatedTitle: q.translatedTitle,
          topicTags: q.topicTags.map(tag => ({
            name: tag.name,
            slug: tag.slug,
            nameTranslated: tag.nameTranslated
          })),
          category: group.name,
          acRate: 0 // 默认值，后面会更新
        });
      }
    }

    console.log(`\n总题目数: ${allQuestions.length}`);
    console.log('\n正在获取每道题目的通过率...');

    // 获取每道题目的 acRate
    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      process.stdout.write(`[${i + 1}/${allQuestions.length}] ${q.questionFrontendId}. ${q.translatedTitle}... `);
      
      try {
        const detail = await fetchQuestionDetail(q.titleSlug);
        if (detail && detail.acRate) {
          q.acRate = detail.acRate;
          console.log(`${(detail.acRate * 100).toFixed(1)}%`);
        } else {
          console.log('无数据');
        }
      } catch (error) {
        console.log(`错误: ${error.message}`);
      }
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 保存为新格式
    const outputData = {
      data: {
        favoriteQuestionList: {
          questions: allQuestions
        }
      },
      meta: {
        source: 'leetcode.cn/studyplan/top-100-liked',
        fetchedAt: new Date().toISOString(),
        totalQuestions: allQuestions.length
      }
    };

    // 保存到 src/data
    const outputPath = path.join(__dirname, '../src/data/leetcode-hot-100.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
    console.log(`\n已保存到: ${outputPath}`);

    // 输出题目 ID 列表
    const ids = allQuestions.map(q => q.questionFrontendId).sort((a, b) => parseInt(a) - parseInt(b));
    console.log(`\n题目 ID 列表: ${ids.join(', ')}`);

  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

main();
