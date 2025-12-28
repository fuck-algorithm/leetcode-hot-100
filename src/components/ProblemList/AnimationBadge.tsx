import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Tooltip from '../Tooltip';
import './AnimationBadge.css';

// 支持的媒体格式（按优先级排序）
const VIDEO_FORMATS = ['mp4', 'webm', 'mov'];
const IMAGE_FORMATS = ['gif', 'png', 'jpg', 'jpeg'];
const ALL_FORMATS = [...VIDEO_FORMATS, ...IMAGE_FORMATS];

// 动画徽章组件接口
export interface AnimationBadgeProps {
  hasAnimation: boolean;
  animationUrl?: string;
  problemId?: string;
  problemTitle?: string;
  pagesUrl?: string | null;
  showPreview?: boolean; // 是否显示预览功能，默认true
}

// 媒体类型
type MediaType = 'video' | 'image' | null;

interface MediaInfo {
  type: MediaType;
  url: string;
}

// 预览位置样式
interface PreviewStyle {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  transform?: string;
}

const AnimationBadge: React.FC<AnimationBadgeProps> = ({
  hasAnimation,
  animationUrl,
  problemId,
  problemTitle,
  pagesUrl,
  showPreview: enablePreview = true
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<PreviewStyle>({});
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewTimeoutRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getBadgeIcon = () => {
    return hasAnimation ? '🎬' : '🚫';
  };

  const getTooltipText = () => {
    return hasAnimation 
      ? '悬停查看动画预览' 
      : '暂无动画解析';
  };

  // 检测媒体文件是否存在
  const checkMediaExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const isVideo = VIDEO_FORMATS.some(fmt => url.endsWith(`.${fmt}`));
      
      if (isVideo) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => resolve(true);
        video.onerror = () => resolve(false);
        video.src = url;
      } else {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      }
    });
  };

  // 查找可用的媒体文件
  const findAvailableMedia = async (): Promise<MediaInfo | null> => {
    if (!problemId) return null;
    
    const baseUrl = window.location.origin;
    const basePath = process.env.PUBLIC_URL || '';
    
    for (const format of ALL_FORMATS) {
      const url = `${baseUrl}${basePath}/animations/${problemId}.${format}`;
      const exists = await checkMediaExists(url);
      if (exists) {
        const type: MediaType = VIDEO_FORMATS.includes(format) ? 'video' : 'image';
        return { type, url };
      }
    }
    return null;
  };

  // problemId 变化时清除缓存的媒体信息
  useEffect(() => {
    setMediaInfo(null);
  }, [problemId]);

  // 鼠标进入徽章区域
  const handleMouseEnter = () => {
    if (hasAnimation && enablePreview) {
      previewTimeoutRef.current = window.setTimeout(async () => {
        setShowPreview(true);
        // 每次都重新加载，确保显示正确的内容
        setIsLoading(true);
        const info = await findAvailableMedia();
        setMediaInfo(info);
        setIsLoading(false);
      }, 200);
    }
  };

  // 鼠标离开徽章区域
  const handleMouseLeave = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    setShowPreview(false);
    // 暂停视频
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // 处理点击事件 - 点击图标时打开动画详情页
  const handleBadgeClick = () => {
    if (hasAnimation && pagesUrl) {
      window.open(pagesUrl, '_blank');
    }
  };

  // 视频显示后自动播放
  useEffect(() => {
    if (showPreview && mediaInfo?.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // 自动播放被阻止时忽略错误
      });
    }
  }, [showPreview, mediaInfo]);

  // 计算预览位置的函数
  const calculatePreviewPosition = () => {
    if (!badgeRef.current) return;
    
    const rect = badgeRef.current.getBoundingClientRect();
    const previewWidth = Math.min(1000, window.innerWidth * 0.7);
    const previewHeight = 600;
    const gap = 15;
    
    const style: PreviewStyle = {};
    
    // 计算各方向可用空间
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // 优先级：右侧 > 左侧 > 下方 > 上方
    if (spaceRight >= previewWidth + gap) {
      // 右侧空间足够
      style.left = rect.right + gap;
      // 垂直居中对齐badge
      let top = rect.top + rect.height / 2 - previewHeight / 2;
      // 确保不超出上下边界
      top = Math.max(gap, Math.min(top, window.innerHeight - previewHeight - gap));
      style.top = top;
    } else if (spaceLeft >= previewWidth + gap) {
      // 左侧空间足够
      style.left = rect.left - previewWidth - gap;
      let top = rect.top + rect.height / 2 - previewHeight / 2;
      top = Math.max(gap, Math.min(top, window.innerHeight - previewHeight - gap));
      style.top = top;
    } else if (spaceBelow >= previewHeight + gap) {
      // 下方空间足够
      style.top = rect.bottom + gap;
      // 水平居中
      let left = rect.left + rect.width / 2 - previewWidth / 2;
      left = Math.max(gap, Math.min(left, window.innerWidth - previewWidth - gap));
      style.left = left;
    } else if (spaceAbove >= previewHeight + gap) {
      // 上方空间足够
      style.top = rect.top - previewHeight - gap;
      let left = rect.left + rect.width / 2 - previewWidth / 2;
      left = Math.max(gap, Math.min(left, window.innerWidth - previewWidth - gap));
      style.left = left;
    } else {
      // 都不够，在右侧显示并允许滚动
      style.left = rect.right + gap;
      style.top = gap;
      // 如果右侧也放不下，就放在视口中央
      if (style.left + previewWidth > window.innerWidth - gap) {
        style.left = Math.max(gap, (window.innerWidth - previewWidth) / 2);
        style.top = Math.max(gap, (window.innerHeight - previewHeight) / 2);
      }
    }
    
    setPreviewStyle(style);
  };

  // 智能计算预览位置 - 优先右侧，其次下方，最后上方
  useEffect(() => {
    if (showPreview && badgeRef.current) {
      // 使用 requestAnimationFrame 确保在下一帧渲染时计算位置
      // 这样可以确保 DOM 已经更新完成
      requestAnimationFrame(() => {
        calculatePreviewPosition();
      });
    }
  }, [showPreview]);

  // 监听滚动事件，实时更新预览位置
  useEffect(() => {
    if (!showPreview) return;
    
    const handleScroll = () => {
      requestAnimationFrame(() => {
        calculatePreviewPosition();
      });
    };
    
    // 监听窗口滚动和可能的父容器滚动
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showPreview]);

  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  // 渲染媒体内容
  const renderMedia = () => {
    if (isLoading) {
      return <div className="animation-preview-loading">加载中...</div>;
    }
    
    if (!mediaInfo) {
      return <div className="animation-preview-loading">未找到预览文件</div>;
    }

    if (mediaInfo.type === 'video') {
      return (
        <video
          ref={videoRef}
          src={mediaInfo.url}
          className="animation-preview-video"
          muted
          loop
          playsInline
        />
      );
    }

    return (
      <img 
        src={mediaInfo.url} 
        alt="算法动画" 
        className="animation-preview-gif" 
      />
    );
  };

  // 渲染预览弹窗（使用 Portal 渲染到 body，避免被父元素的 z-index 影响）
  const renderPreview = () => {
    if (!showPreview || !hasAnimation) return null;
    
    return ReactDOM.createPortal(
      <div 
        ref={previewRef}
        className="animation-preview-container"
        style={previewStyle}
      >
        <div className="animation-preview-title">
          {problemId && problemTitle 
            ? `${problemId}. ${problemTitle}`
            : '算法动画演示'}
        </div>
        {renderMedia()}
        <div className="animation-preview-tip">
          点击图标查看完整动画解析
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div 
      className="animation-badge-container" 
      ref={badgeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Tooltip content={getTooltipText()} position="top">
        <div 
          className={`animation-badge ${hasAnimation ? 'has-animation' : 'no-animation'}`}
          onClick={handleBadgeClick}
        >
          {getBadgeIcon()}
        </div>
      </Tooltip>
      
      {renderPreview()}
    </div>
  );
};

export default AnimationBadge;