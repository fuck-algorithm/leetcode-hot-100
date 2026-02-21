import React, { useRef, useState, useCallback, useEffect } from 'react';
import domtoimage from 'dom-to-image';
import { useTranslation } from 'react-i18next';
import './ShareModal.css';
import ShareCard from './ShareCard';
import { Problem } from '../ProblemList/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
  // 经验值数据
  totalExp: number;
  currentRealm: {
    name: string;
    nameEn: string;
    icon: string;
    color: string;
  };
  realmProgress: number;
  expToNextRealm: number;
  // 题目完成数据
  completedProblems: number;
  totalProblems: number;
  // 路径进度数据
  pathProgress: Array<{
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    completed: number;
    total: number;
  }>;
  // 题目列表数据
  problems: Problem[];
  // 完成状态数据
  completions: Map<string, boolean>;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  totalExp,
  currentRealm,
  realmProgress,
  expToNextRealm,
  completedProblems,
  totalProblems,
  pathProgress,
  problems,
  completions,
}) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Auto-generate image when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      // Delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        generateImage();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      // 临时将卡片显示在视口内但不可见，以便正确渲染
      const originalStyle = cardRef.current.style.cssText;
      cardRef.current.style.cssText = `${originalStyle}; position: fixed; left: 0; top: 0; opacity: 0; pointer-events: none; z-index: -9999;`;
      
      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        bgcolor: '#ffffff',
        style: {
          transform: 'none',
          position: 'relative',
          left: '0',
          top: '0',
          opacity: '1',
        },
        // 过滤掉可能导致问题的元素
        filter: (node: Node) => {
          // 保留所有元素，但确保样式正确
          return true;
        }
      });
      
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error('生成分享图片失败:', error);
    } finally {
      setIsGenerating(false);
      // 恢复原始样式
      if (cardRef.current) {
        cardRef.current.style.cssText = cardRef.current.style.cssText
          .replace(/position: fixed; left: 0; top: 0; opacity: 0; pointer-events: none; z-index: -9999;/g, '');
      }
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.download = `leetcode-hot-100-share-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  }, [generatedImage]);

  const handleCopyImage = useCallback(async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      alert(t('share.copiedSuccess', '图片已复制到剪贴板'));
    } catch (error) {
      console.error('复制图片失败:', error);
      alert(t('share.copiedFailed', '复制失败，请尝试下载'));
    }
  }, [generatedImage, t]);

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button className="share-modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="share-modal-title">{t('share.title', '分享我的算法学习进度')}</h2>

        {/* ShareCard for image generation - positioned in viewport but invisible */}
        <div style={{ 
          position: 'fixed',
          left: '0',
          top: '0',
          width: '720px',
          opacity: '0',
          pointerEvents: 'none',
          zIndex: '-9999'
        }}>
          <ShareCard
            ref={cardRef}
            currentLang={currentLang}
            totalExp={totalExp}
            currentRealm={currentRealm}
            realmProgress={realmProgress}
            expToNextRealm={expToNextRealm}
            completedProblems={completedProblems}
            totalProblems={totalProblems}
            pathProgress={pathProgress}
            problems={problems}
            completions={completions}
          />
        </div>

        {/* Generated Image Display */}
        <div className="share-image-container">
          {isGenerating ? (
            <div className="share-loading">
              <div className="share-loading-spinner"></div>
              <p>{t('share.generating', '生成分享图片中...')}</p>
            </div>
          ) : generatedImage ? (
            <img 
              src={generatedImage} 
              alt="Share Card" 
              className="share-generated-image"
            />
          ) : (
            <div className="share-error">
              <p>{t('share.generateFailed', '生成失败，请重试')}</p>
              <button onClick={generateImage}>{t('share.retry', '重试')}</button>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {!isGenerating && generatedImage && (
          <div className="share-actions">
            <button
              className="share-btn share-btn-primary"
              onClick={handleDownload}
            >
              {t('share.download', '下载图片')}
            </button>
            <button
              className="share-btn share-btn-secondary"
              onClick={handleCopyImage}
            >
              {t('share.copyImage', '复制图片')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
