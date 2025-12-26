// 定义仓库信息类型
export interface RepoInfo {
  name: string;
  url: string;
  isPublic: boolean;
  pagesUrl: string | null;
}

// 定义问题类型接口
export interface Problem {
  id: number;
  questionFrontendId: string;
  title: string;
  translatedTitle: string;
  titleSlug: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  acRate: number;
  frequency: number | null;
  hasAnimation: boolean;
  category?: string;
  repo?: RepoInfo;
  topicTags: Array<{
    name: string;
    nameTranslated: string;
    slug: string;
  }>;
}

// 定义标签类型
export interface Tag {
  name: string;
  nameTranslated: string;
  slug: string;
  count: number;
}

// 传统排序选项（为了保持向后兼容）
export type LegacySortOption = '默认' | '难度' | '通过率' | '题号' | '标签';

// 定义排序类型
export type SortOption = LegacySortOption | {
  field: string;
  direction: 'asc' | 'desc';
};
