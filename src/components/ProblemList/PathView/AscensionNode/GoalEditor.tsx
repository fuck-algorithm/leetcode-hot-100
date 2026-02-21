import React, { useRef, useState } from 'react';
import { AscensionGoal, PresetCompany, PRESET_COMPANIES } from './types';
import { CompanyLogo } from './CompanyLogos';
import { fileToBase64, validateImageFile, logoImageDB } from './logoImageDB';

interface GoalEditorProps {
  currentLang: string;
  editingGoal: AscensionGoal;
  setEditingGoal: (goal: AscensionGoal) => void;
  onSave: () => void;
  onCancel: () => void;
}

const GoalEditor: React.FC<GoalEditorProps> = ({
  currentLang,
  editingGoal,
  setEditingGoal,
  onSave,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 选择预置公司
  const selectPresetCompany = (company: PresetCompany) => {
    setEditingGoal({
      ...editingGoal,
      companyId: company.id,
      color: company.color,
    });
  };

  // 切换到自定义模式
  const switchToCustom = () => {
    setEditingGoal({
      ...editingGoal,
      companyId: null,
    });
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || (currentLang === 'zh' ? '图片验证失败' : 'Image validation failed'));
      return;
    }

    setUploadError(null);

    try {
      // 转换为 base64
      const base64 = await fileToBase64(file);
      
      // 保存到 IndexedDB
      await logoImageDB.saveLogoImage('custom-logo', base64);
      
      // 更新状态
      setEditingGoal({
        ...editingGoal,
        customLogoImage: base64,
      });
    } catch (error) {
      console.error('上传图片失败:', error);
      setUploadError(currentLang === 'zh' ? '上传图片失败，请重试' : 'Failed to upload image, please try again');
    }
  };

  // 清除自定义图片
  const handleClearImage = async () => {
    try {
      await logoImageDB.deleteLogoImage('custom-logo');
      setEditingGoal({
        ...editingGoal,
        customLogoImage: null,
      });
    } catch (error) {
      console.error('删除图片失败:', error);
    }
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 处理关闭
  const handleClose = () => {
    onCancel();
  };

  // 处理保存
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave();
  };

  // 处理遮罩层点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="ascension-editor-overlay" onClick={handleOverlayClick}>
      <div className="ascension-editor" onClick={e => e.stopPropagation()}>
        <div className="editor-header">
          <h3>{currentLang === 'zh' ? '设置飞升目标' : 'Set Ascension Goal'}</h3>
          <button className="editor-close" onClick={handleClose} type="button">×</button>
        </div>

        <div className="editor-content">
          {/* 预置公司选择 */}
          <div className="editor-section">
            <label>{currentLang === 'zh' ? '选择目标公司' : 'Select Target Company'}</label>
            <div className="preset-companies">
              {PRESET_COMPANIES.map(company => (
                <button
                  key={company.id}
                  className={`preset-company-btn ${editingGoal.companyId === company.id ? 'selected' : ''}`}
                  style={{ '--company-color': company.color } as React.CSSProperties}
                  onClick={() => selectPresetCompany(company)}
                >
                  <span className="company-logo">
                    <CompanyLogo companyId={company.id} size={32} />
                  </span>
                  <span className="company-name">
                    {currentLang === 'zh' ? company.name : company.nameEn}
                  </span>
                </button>
              ))}
              <button
                className={`preset-company-btn custom ${editingGoal.companyId === null ? 'selected' : ''}`}
                onClick={switchToCustom}
              >
                <span className="company-logo">✏️</span>
                <span className="company-name">
                  {currentLang === 'zh' ? '自定义' : 'Custom'}
                </span>
              </button>
            </div>
          </div>

          {/* 自定义选项 */}
          {editingGoal.companyId === null && (
            <div className="editor-section custom-section">
              <div className="custom-row">
                <label>{currentLang === 'zh' ? '公司名称' : 'Company Name'}</label>
                <input
                  type="text"
                  value={editingGoal.customName}
                  onChange={e => setEditingGoal({ ...editingGoal, customName: e.target.value })}
                  placeholder={currentLang === 'zh' ? '输入公司名称' : 'Enter company name'}
                />
              </div>
              
              {/* Logo 图片上传 */}
              <div className="custom-row">
                <label>{currentLang === 'zh' ? 'Logo 图片' : 'Logo Image'}</label>
                <div className="logo-upload-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  
                  {editingGoal.customLogoImage ? (
                    <div className="logo-preview-container">
                      <img 
                        src={editingGoal.customLogoImage} 
                        alt="Company Logo" 
                        className="logo-preview-image"
                      />
                      <div className="logo-preview-actions">
                        <button 
                          type="button" 
                          className="logo-change-btn"
                          onClick={triggerFileSelect}
                        >
                          {currentLang === 'zh' ? '更换图片' : 'Change Image'}
                        </button>
                        <button 
                          type="button" 
                          className="logo-clear-btn"
                          onClick={handleClearImage}
                        >
                          {currentLang === 'zh' ? '清除' : 'Clear'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="logo-upload-btn"
                      onClick={triggerFileSelect}
                    >
                      <span className="upload-icon">📁</span>
                      <span>{currentLang === 'zh' ? '选择本地图片' : 'Select Local Image'}</span>
                    </button>
                  )}
                  
                  {uploadError && (
                    <div className="upload-error">{uploadError}</div>
                  )}
                  
                  <div className="upload-hint">
                    {currentLang === 'zh' 
                      ? '支持 JPEG、PNG、GIF、WebP，最大 2MB' 
                      : 'Supports JPEG, PNG, GIF, WebP, max 2MB'}
                  </div>
                </div>
              </div>

              {/* Emoji Logo (fallback) */}
              <div className="custom-row">
                <label>{currentLang === 'zh' ? '或 Emoji Logo' : 'Or Emoji Logo'}</label>
                <input
                  type="text"
                  value={editingGoal.customLogo}
                  onChange={e => setEditingGoal({ ...editingGoal, customLogo: e.target.value })}
                  placeholder="🎯"
                  maxLength={2}
                />
              </div>
              
              <div className="custom-row">
                <label>{currentLang === 'zh' ? '主题色' : 'Theme Color'}</label>
                <input
                  type="color"
                  value={editingGoal.color}
                  onChange={e => setEditingGoal({ ...editingGoal, color: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* 薪资包 */}
          <div className="editor-section">
            <label>{currentLang === 'zh' ? '目标薪资包（可选）' : 'Target Salary (optional)'}</label>
            <input
              type="text"
              value={editingGoal.salary}
              onChange={e => setEditingGoal({ ...editingGoal, salary: e.target.value })}
              placeholder={currentLang === 'zh' ? '例如：50万/年' : 'e.g., $200k/year'}
            />
          </div>

          {/* 勉励语 */}
          <div className="editor-section">
            <label>{currentLang === 'zh' ? '勉励自己的话（可选）' : 'Motivation (optional)'}</label>
            <textarea
              value={editingGoal.motivation}
              onChange={e => setEditingGoal({ ...editingGoal, motivation: e.target.value })}
              placeholder={currentLang === 'zh' ? '写下激励自己的话...' : 'Write something to motivate yourself...'}
              rows={2}
            />
          </div>
        </div>

        <div className="editor-footer">
          <button className="editor-cancel-btn" onClick={handleClose} type="button">
            {currentLang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button className="editor-save-btn" onClick={handleSave} type="button">
            {currentLang === 'zh' ? '保存' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalEditor;
