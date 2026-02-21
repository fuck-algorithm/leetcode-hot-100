// 预置公司列表
export interface PresetCompany {
  id: string;
  name: string;
  nameEn: string;
  logo: string; // emoji或图标
  color: string;
}

export const PRESET_COMPANIES: PresetCompany[] = [
  // 国际大厂
  { id: 'google', name: '谷歌', nameEn: 'Google', logo: 'G', color: '#4285F4' },
  { id: 'meta', name: 'Meta', nameEn: 'Meta', logo: '∞', color: '#0668E1' },
  { id: 'amazon', name: 'Amazon', nameEn: 'Amazon', logo: 'a', color: '#FF9900' },
  { id: 'microsoft', name: '微软', nameEn: 'Microsoft', logo: '⊞', color: '#00A4EF' },
  { id: 'apple', name: '苹果', nameEn: 'Apple', logo: '', color: '#555555' },
  { id: 'netflix', name: 'Netflix', nameEn: 'Netflix', logo: 'N', color: '#E50914' },
  { id: 'nvidia', name: 'NVIDIA', nameEn: 'NVIDIA', logo: '👁', color: '#76B900' },
  { id: 'tesla', name: '特斯拉', nameEn: 'Tesla', logo: 'T', color: '#E82127' },
  // 中国大厂
  { id: 'bytedance', name: '字节跳动', nameEn: 'ByteDance', logo: '♪', color: '#000000' },
  { id: 'alibaba', name: '阿里巴巴', nameEn: 'Alibaba', logo: '阿', color: '#FF6A00' },
  { id: 'tencent', name: '腾讯', nameEn: 'Tencent', logo: '企', color: '#12B7F5' },
  { id: 'huawei', name: '华为', nameEn: 'Huawei', logo: '华', color: '#E60012' },
  { id: 'baidu', name: '百度', nameEn: 'Baidu', logo: '百', color: '#2932E1' },
  { id: 'jd', name: '京东', nameEn: 'JD', logo: 'JD', color: '#E1251B' },
  { id: 'meituan', name: '美团', nameEn: 'Meituan', logo: '美', color: '#FFD100' },
  { id: 'xiaomi', name: '小米', nameEn: 'Xiaomi', logo: 'MI', color: '#FF6900' },
  { id: 'pinduoduo', name: '拼多多', nameEn: 'Pinduoduo', logo: '拼', color: '#E02E24' },
  { id: 'kuaishou', name: '快手', nameEn: 'Kuaishou', logo: '快', color: '#FF4906' },
  { id: 'netease', name: '网易', nameEn: 'NetEase', logo: '网', color: '#D43C33' },
  // 其他知名公司
  { id: 'stripe', name: 'Stripe', nameEn: 'Stripe', logo: 'S', color: '#635BFF' },
  { id: 'uber', name: 'Uber', nameEn: 'Uber', logo: 'U', color: '#000000' },
  { id: 'airbnb', name: 'Airbnb', nameEn: 'Airbnb', logo: 'A', color: '#FF5A5F' },
  { id: 'linkedin', name: 'LinkedIn', nameEn: 'LinkedIn', logo: 'in', color: '#0A66C2' },
];

// 用户目标配置
export interface AscensionGoal {
  companyId: string | null; // 预置公司ID，null表示自定义
  customName: string; // 自定义公司名称
  customLogo: string; // 自定义logo（emoji）
  customLogoImage: string | null; // 自定义logo图片（base64或blob URL）
  salary: string; // 薪资包
  motivation: string; // 勉励自己的话
  color: string; // 主题色
}

// 默认目标
export const DEFAULT_GOAL: AscensionGoal = {
  companyId: 'google',
  customName: '',
  customLogo: '',
  customLogoImage: null,
  salary: '100万',
  motivation: '',
  color: '#4285F4',
};

// 本地存储key
export const STORAGE_KEY = 'leetcode-hot-100-ascension-goal';

// 显示信息
export interface DisplayInfo {
  name: string;
  logo: string;
  logoImage: string | null; // 自定义图片logo
  color: string;
}
