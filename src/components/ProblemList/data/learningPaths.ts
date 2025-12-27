/**
 * 学习路径配置
 * 按照算法类型分类，每个类型内部按难度从简单到困难排序
 */

export interface LearningPath {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  // 题目分类的category字段值
  categories: string[];
  // 难度顺序权重
  difficultyOrder: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
}

// 学习路径定义 - 使用更符合数据结构与算法风格的图标
export const learningPaths: LearningPath[] = [
  {
    id: 'hash',
    name: '哈希表',
    nameEn: 'Hash Table',
    description: '从两数之和开始，掌握哈希表的核心思想',
    descriptionEn: 'Start with Two Sum, master the core concept of hash tables',
    icon: '{ }',  // 花括号代表键值对/哈希映射
    color: '#52c41a',
    categories: ['哈希'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'two-pointers',
    name: '双指针',
    nameEn: 'Two Pointers',
    description: '学习双指针技巧，解决数组和字符串问题',
    descriptionEn: 'Learn two-pointer techniques for array and string problems',
    icon: '↔',  // 双向箭头代表双指针
    color: '#1890ff',
    categories: ['双指针'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'sliding-window',
    name: '滑动窗口',
    nameEn: 'Sliding Window',
    description: '掌握滑动窗口，高效处理子串子数组问题',
    descriptionEn: 'Master sliding window for substring and subarray problems',
    icon: '[ ]',  // 方括号代表窗口区间
    color: '#722ed1',
    categories: ['滑动窗口', '子串'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'array',
    name: '数组与矩阵',
    nameEn: 'Array & Matrix',
    description: '数组操作和矩阵遍历的经典问题',
    descriptionEn: 'Classic problems on array operations and matrix traversal',
    icon: '▤',  // 网格代表数组/矩阵
    color: '#fa8c16',
    categories: ['普通数组', '矩阵'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'linked-list',
    name: '链表',
    nameEn: 'Linked List',
    description: '链表的基本操作和经典算法',
    descriptionEn: 'Basic operations and classic algorithms for linked lists',
    icon: '→•→',  // 箭头链代表链表
    color: '#13c2c2',
    categories: ['链表'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'binary-tree',
    name: '二叉树',
    nameEn: 'Binary Tree',
    description: '二叉树的遍历、构建和各种操作',
    descriptionEn: 'Traversal, construction and operations on binary trees',
    icon: '⋀',  // 分叉符号代表二叉树
    color: '#52c41a',
    categories: ['二叉树'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'graph',
    name: '图论',
    nameEn: 'Graph',
    description: '图的遍历、搜索和经典算法',
    descriptionEn: 'Graph traversal, search and classic algorithms',
    icon: '◇',  // 菱形节点代表图
    color: '#eb2f96',
    categories: ['图论'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'backtracking',
    name: '回溯算法',
    nameEn: 'Backtracking',
    description: '回溯法解决排列组合和搜索问题',
    descriptionEn: 'Backtracking for permutation, combination and search problems',
    icon: '↺',  // 回退箭头代表回溯
    color: '#f5222d',
    categories: ['回溯'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'binary-search',
    name: '二分查找',
    nameEn: 'Binary Search',
    description: '二分查找的各种变体和应用',
    descriptionEn: 'Variants and applications of binary search',
    icon: '½',  // 二分符号
    color: '#faad14',
    categories: ['二分查找'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'stack',
    name: '栈',
    nameEn: 'Stack',
    description: '栈的应用和单调栈技巧',
    descriptionEn: 'Stack applications and monotonic stack techniques',
    icon: '▥',  // 堆叠层代表栈
    color: '#2f54eb',
    categories: ['栈'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'heap',
    name: '堆',
    nameEn: 'Heap',
    description: '优先队列和堆的应用',
    descriptionEn: 'Priority queue and heap applications',
    icon: '△',  // 三角形代表堆的金字塔结构
    color: '#a0d911',
    categories: ['堆'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'greedy',
    name: '贪心算法',
    nameEn: 'Greedy',
    description: '贪心策略解决最优化问题',
    descriptionEn: 'Greedy strategies for optimization problems',
    icon: '★',  // 星号代表最优选择
    color: '#fadb14',
    categories: ['贪心算法'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'dynamic-programming',
    name: '动态规划',
    nameEn: 'Dynamic Programming',
    description: '从基础到进阶的动态规划问题',
    descriptionEn: 'From basic to advanced dynamic programming problems',
    icon: '▦',  // 表格代表DP状态表
    color: '#ff4d4f',
    categories: ['动态规划', '多维动态规划'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  },
  {
    id: 'techniques',
    name: '技巧',
    nameEn: 'Techniques',
    description: '位运算、数学等技巧性问题',
    descriptionEn: 'Bit manipulation, math and other technique problems',
    icon: '⊕',  // XOR符号代表位运算
    color: '#597ef7',
    categories: ['技巧'],
    difficultyOrder: { EASY: 1, MEDIUM: 2, HARD: 3 }
  }
];

// 获取题目所属的学习路径
export const getPathForProblem = (category: string | undefined): LearningPath | undefined => {
  if (!category) return undefined;
  return learningPaths.find(path => path.categories.includes(category));
};

// 获取难度排序权重
export const getDifficultyWeight = (difficulty: 'EASY' | 'MEDIUM' | 'HARD'): number => {
  const weights = { EASY: 1, MEDIUM: 2, HARD: 3 };
  return weights[difficulty] || 2;
};
