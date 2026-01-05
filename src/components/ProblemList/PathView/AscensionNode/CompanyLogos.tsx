import React from 'react';

// 公司Logo SVG组件
interface LogoProps {
  size?: number;
  className?: string;
}

// Google (四色G)
export const GoogleLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// Meta (蓝色无限符号)
export const MetaLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M15 50 C15 30 30 20 40 20 C50 20 55 30 60 40 C65 50 70 60 80 60 C90 60 95 50 95 50 C95 50 90 70 75 70 C60 70 55 55 50 45 C45 35 40 25 30 25 C20 25 15 35 15 50 C15 65 25 75 35 75 C45 75 50 65 50 65"
      fill="none"
      stroke="#0668E1"
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>
);

// Amazon (橙色笑脸箭头)
export const AmazonLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <text x="50" y="45" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#232F3E" fontFamily="Arial">amazon</text>
    <path d="M22 58 Q50 78 78 58" fill="none" stroke="#FF9900" strokeWidth="5" strokeLinecap="round"/>
    <path d="M72 52 L78 58 L72 66" fill="none" stroke="#FF9900" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Microsoft (四色田字格)
export const MicrosoftLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="12" y="12" width="35" height="35" fill="#F25022" />
    <rect x="53" y="12" width="35" height="35" fill="#7FBA00" />
    <rect x="12" y="53" width="35" height="35" fill="#00A4EF" />
    <rect x="53" y="53" width="35" height="35" fill="#FFB900" />
  </svg>
);

// Apple (官方苹果logo)
export const AppleLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="#555">
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
  </svg>
);

// Netflix (红色N)
export const NetflixLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M25 15 L25 85 L35 85 L35 15 Z" fill="#E50914"/>
    <path d="M35 15 L65 85 L75 85 L45 15 Z" fill="#E50914"/>
    <path d="M65 15 L65 85 L75 85 L75 15 Z" fill="#E50914"/>
  </svg>
);

// NVIDIA (绿色眼睛)
export const NvidiaLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M10 50 Q50 15 90 50 Q50 85 10 50 Z" fill="#76B900"/>
    <ellipse cx="50" cy="50" rx="20" ry="15" fill="white"/>
    <circle cx="50" cy="50" r="8" fill="#76B900"/>
  </svg>
);

// Tesla (官方logo)
export const TeslaLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#E82127">
    <path d="M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-.146-1.439-1.154-1.79-4.354-1.79L12 24 8.619 5.038c-3.18 0-4.188.351-4.335 1.79 0 0-2.148-.802-3.23-2.438C5.28 2.426 9.525 2.336 9.525 2.336L12 5.362zm0-3.676c3.419-.03 7.326.528 10.946 2.012.242-.387.484-.992.633-1.398C19.756.612 15.693.012 12 0 8.307.012 4.244.612.421 2.3c.149.406.391 1.011.633 1.398C4.674 2.214 8.581 1.656 12 1.686z"/>
  </svg>
);

// ByteDance/字节跳动 (官方logo)
export const ByteDanceLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#000">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.01-12.08z"/>
  </svg>
);

// Alibaba (官方logo - 笑脸)
export const AlibabaLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF6A00">
    <path d="M21.422 10.957c-1.617-.283-3.271-.405-4.932-.405-.6 0-1.2.018-1.8.054V6.054c.6-.036 1.2-.054 1.8-.054 1.661 0 3.315.122 4.932.405v4.552zm-9.422 0c-1.617-.283-3.271-.405-4.932-.405-.6 0-1.2.018-1.8.054V6.054c.6-.036 1.2-.054 1.8-.054 1.661 0 3.315.122 4.932.405v4.552zm9.422 6.989c-1.617.283-3.271.405-4.932.405-.6 0-1.2-.018-1.8-.054v-4.552c.6.036 1.2.054 1.8.054 1.661 0 3.315-.122 4.932-.405v4.552zm-9.422 0c-1.617.283-3.271.405-4.932.405-.6 0-1.2-.018-1.8-.054v-4.552c.6.036 1.2.054 1.8.054 1.661 0 3.315-.122 4.932-.405v4.552z"/>
    <circle cx="12" cy="12" r="1.5"/>
  </svg>
);

// Tencent (官方企鹅logo)
export const TencentLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="#12B7F5">
    <path d="M6.048 3.323c.022.277-.13.523-.338.55-.21.026-.397-.176-.419-.453s.13-.523.338-.55c.21-.026.397.176.42.453Zm2.265-.24c-.603-.146-.894.256-.936.333-.027.048-.008.117.037.15.045.035.092.025.119-.003.361-.39.751-.172.829-.129l.011.007c.053.024.147.028.193-.098.023-.063.017-.11-.006-.142-.016-.023-.089-.08-.247-.118"/>
    <path d="M11.727 6.719c0-.022.01-.375.01-.557 0-3.07-1.45-6.156-5.015-6.156S1.708 3.092 1.708 6.162c0 .182.01.535.01.557l-.72 1.795a26 26 0 0 0-.534 1.508c-.68 2.187-.46 3.093-.292 3.113.36.044 1.401-1.647 1.401-1.647 0 .979.504 2.256 1.594 3.179-.408.126-.907.319-1.228.556-.29.213-.253.43-.201.518.228.386 3.92.246 4.985.126 1.065.12 4.756.26 4.984-.126.052-.088.088-.305-.2-.518-.322-.237-.822-.43-1.23-.557 1.09-.922 1.594-2.2 1.594-3.178 0 0 1.041 1.69 1.401 1.647.168-.02.388-.926-.292-3.113a26 26 0 0 0-.534-1.508l-.72-1.795ZM9.773 5.53a.1.1 0 0 1-.009.096c-.109.159-1.554.943-3.033.943h-.017c-1.48 0-2.925-.784-3.034-.943a.1.1 0 0 1-.018-.055q0-.022.01-.04c.13-.287 1.43-.606 3.042-.606h.017c1.611 0 2.912.319 3.042.605m-4.32-.989c-.483.022-.896-.529-.922-1.229s.344-1.286.828-1.308c.483-.022.896.529.922 1.23.027.7-.344 1.286-.827 1.307Zm2.538 0c-.484-.022-.854-.607-.828-1.308.027-.7.44-1.25.923-1.23.483.023.853.608.827 1.309-.026.7-.439 1.251-.922 1.23ZM2.928 8.99q.32.063.639.117v2.336s1.104.222 2.21.068V9.363q.49.027.937.023h.017c1.117.013 2.474-.136 3.786-.396.097.622.151 1.386.097 2.284-.146 2.45-1.6 3.99-3.846 4.012h-.091c-2.245-.023-3.7-1.562-3.846-4.011-.054-.9 0-1.663.097-2.285"/>
  </svg>
);

// 华为 (官方花瓣logo)
export const HuaweiLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#E60012">
    <path d="M3.67 6.14S1.82 7.91 1.72 9.78v.35c.08 1.6 1.16 3.05 2.9 4.68 1.99 1.86 4.57 3.43 7.38 4.77 2.81-1.34 5.39-2.91 7.38-4.77 1.74-1.63 2.82-3.08 2.9-4.68v-.35c-.1-1.87-1.95-3.64-1.95-3.64s.27 1.59-.68 3.37c-.72 1.35-2.12 2.8-4.07 4.22-1.56 1.14-3.35 2.2-5.58 3.22-2.23-1.02-4.02-2.08-5.58-3.22-1.95-1.42-3.35-2.87-4.07-4.22-.95-1.78-.68-3.37-.68-3.37z"/>
    <path d="M12 .01s-2.35 1.41-3.78 3.44c-1.1 1.56-1.56 3.29-1.56 3.29s1.42-.56 3.22-.56h4.24c1.8 0 3.22.56 3.22.56s-.46-1.73-1.56-3.29C14.35 1.42 12 .01 12 .01z"/>
    <path d="M6.66 6.74s-.46 1.73.64 3.29c.85 1.2 2.35 2.35 4.7 3.44 2.35-1.09 3.85-2.24 4.7-3.44 1.1-1.56.64-3.29.64-3.29s-1.42.56-3.22.56H9.88c-1.8 0-3.22-.56-3.22-.56z"/>
  </svg>
);

// 百度 (蓝色熊掌)
export const BaiduLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <ellipse cx="30" cy="22" rx="12" ry="16" fill="#2932E1"/>
    <ellipse cx="70" cy="22" rx="12" ry="16" fill="#2932E1"/>
    <ellipse cx="18" cy="52" rx="10" ry="14" fill="#2932E1"/>
    <ellipse cx="82" cy="52" rx="10" ry="14" fill="#2932E1"/>
    <ellipse cx="50" cy="68" rx="25" ry="22" fill="#2932E1"/>
  </svg>
);

// 京东 (红色JD)
export const JDLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="20" y="20" width="60" height="60" rx="10" fill="#E1251B"/>
    <text x="50" y="62" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white" fontFamily="Arial">JD</text>
  </svg>
);

// 美团 (黄色袋鼠)
export const MeituanLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="15" y="15" width="70" height="70" rx="12" fill="#FFD100"/>
    <text x="50" y="62" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#000" fontFamily="Arial">美团</text>
  </svg>
);

// 小米 (橙色MI)
export const XiaomiLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="15" y="15" width="70" height="70" rx="15" fill="#FF6900"/>
    <text x="50" y="65" textAnchor="middle" fontSize="30" fontWeight="bold" fill="white" fontFamily="Arial">MI</text>
  </svg>
);

// 拼多多 (红色)
export const PinduoduoLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="18" y="18" width="64" height="64" rx="14" fill="#E02E24"/>
    <text x="50" y="58" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="Arial">拼多多</text>
  </svg>
);

// 快手 (橙色双箭头)
export const KuaishouLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="15" y="15" width="70" height="70" rx="15" fill="#FF4906"/>
    <path d="M32 38 L50 55 L68 38" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 55 L50 72 L68 55" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 网易 (红色)
export const NeteaseLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="18" y="18" width="64" height="64" rx="10" fill="#D43C33"/>
    <text x="50" y="58" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="Arial">网易</text>
  </svg>
);

// Stripe (紫色S)
export const StripeLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="18" y="18" width="64" height="64" rx="10" fill="#635BFF"/>
    <text x="50" y="68" textAnchor="middle" fontSize="45" fontWeight="bold" fill="white" fontFamily="Arial">S</text>
  </svg>
);

// Uber (官方logo)
export const UberLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.598 8.4h-1.2v3.6c0 .795-.645 1.44-1.44 1.44H12.84V8.4h-1.2v6.24h3.318c1.458 0 2.64-1.182 2.64-2.64V8.4zM6.402 8.4v3.6c0 1.458 1.182 2.64 2.64 2.64h2.118v-1.2H9.042c-.795 0-1.44-.645-1.44-1.44V8.4h-1.2z"/>
  </svg>
);

// Airbnb (红色A)
export const AirbnbLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 15 C35 35 25 50 25 65 C25 80 36 90 50 90 C64 90 75 80 75 65 C75 50 65 35 50 15 Z" fill="#FF5A5F"/>
    <path d="M50 30 C42 42 35 52 35 62 C35 72 42 78 50 78 C58 78 65 72 65 62 C65 52 58 42 50 30 Z" fill="white"/>
    <circle cx="50" cy="58" r="6" fill="#FF5A5F"/>
  </svg>
);

// LinkedIn (蓝色in)
export const LinkedInLogo: React.FC<LogoProps> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="15" y="15" width="70" height="70" rx="10" fill="#0A66C2"/>
    <text x="50" y="68" textAnchor="middle" fontSize="40" fontWeight="bold" fill="white" fontFamily="Arial">in</text>
  </svg>
);

// Logo映射
export const CompanyLogoMap: Record<string, React.FC<LogoProps>> = {
  google: GoogleLogo,
  meta: MetaLogo,
  amazon: AmazonLogo,
  microsoft: MicrosoftLogo,
  apple: AppleLogo,
  netflix: NetflixLogo,
  nvidia: NvidiaLogo,
  tesla: TeslaLogo,
  bytedance: ByteDanceLogo,
  alibaba: AlibabaLogo,
  tencent: TencentLogo,
  huawei: HuaweiLogo,
  baidu: BaiduLogo,
  jd: JDLogo,
  meituan: MeituanLogo,
  xiaomi: XiaomiLogo,
  pinduoduo: PinduoduoLogo,
  kuaishou: KuaishouLogo,
  netease: NeteaseLogo,
  stripe: StripeLogo,
  uber: UberLogo,
  airbnb: AirbnbLogo,
  linkedin: LinkedInLogo,
};

// 通用Logo组件
interface CompanyLogoProps {
  companyId: string;
  size?: number;
  className?: string;
  fallback?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  companyId, 
  size = 24, 
  className,
  fallback = '🎯'
}) => {
  const LogoComponent = CompanyLogoMap[companyId];
  
  if (LogoComponent) {
    return <LogoComponent size={size} className={className} />;
  }
  
  return <span style={{ fontSize: size * 0.8 }}>{fallback}</span>;
};

export default CompanyLogo;
