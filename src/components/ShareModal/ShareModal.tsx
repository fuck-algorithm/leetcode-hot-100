import React, { useRef, useState, useCallback } from 'react';
import domtoimage from 'dom-to-image';
import { useTranslation } from 'react-i18next';
import './ShareModal.css';
import ShareCard from './ShareCard';

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
}) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        bgcolor: '#ffffff',
        style: {
          transform: 'none',
        },
      });
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error('生成分享图片失败:', error);
    } finally {
      setIsGenerating(false);
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

        {/* 分享卡片区域 */}
        <div className="share-card-container">
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
          />
        </div>

        {/* 生成的图片预览 */}
        {generatedImage && (
          <div className="share-preview-container">
            <p className="share-preview-title">{t('share.preview', '生成的图片')}</p>
            <img src={generatedImage} alt="Share preview" className="share-preview-image" />
          </div>
        )}

        {/* 操作按钮 */}
        <div className="share-actions">
          {!generatedImage ? (
            <button
              className="share-btn share-btn-primary"
              onClick={handleGenerateImage}
              disabled={isGenerating}
            >
              {isGenerating
                ? t('share.generating', '生成中...')
                : t('share.generateImage', '生成分享图片')}
            </button>
          ) : (
            <>
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
              <button
                className="share-btn share-btn-tertiary"
                onClick={() => setGeneratedImage(null)}
              >
                {t('share.regenerate', '重新生成')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
