import React, { useState, useEffect, useCallback } from 'react';
import './AscensionNode.css';

// 预置公司列表
export interface PresetCompany {
  id: string;
  name: string;
  nameEn: string;
  logo: string; // emoji或图标
  color: string;
}

export const PRESET_COMPANIES: PresetCompany[] = [
  { id: 'meta', name: 'Meta', nameEn: 'Meta', logo: '🔵', color: '#0668E1' },
  { id: 'amazon', name: 'Amazon', nameEn: 'Amazon', logo: '📦', color: '#FF9900' },
  { id: 'microsoft', name: '微软', nameEn: 'Microsoft', logo: '🪟', color: '#00A4EF' },
  { id: 'google', name: '谷歌', nameEn: 'Google', logo: '🔍', color: '#4285F4' },
  { id: 'apple', name: '苹果', nameEn: 'Apple', logo: '🍎', color: '#555555' },
  { id: 'bytedance', name: '字节跳动', nameEn: 'ByteDance', logo: '🎵', color: '#000000' },
  { id: 'alibaba', name: '阿里巴巴', nameEn: 'Alibaba', logo: '🛒', color: '#FF6A00' },
  { id: 'tencent', name: '腾讯', nameEn: 'Tencent', logo: '🐧', color: '#12B7F5' },
  { id: 'netflix', name: 'Netflix', nameEn: 'Netflix', logo: '🎬', color: '#E50914' },
  { id: 'nvidia', name: 'NVIDIA', nameEn: 'NVIDIA', logo: '💚', color: '#76B900' },
];

// 用户目标配置
export interface AscensionGoal {
  companyId: string | null; // 预置公司ID，null表示自定义
  customName: string; // 自定义公司名称
  customLogo: string; // 自定义logo（emoji）
  salary: string; // 薪资包
  motivation: string; // 勉励自己的话
  color: string; // 主题色
}

// 默认目标
const DEFAULT_GOAL: AscensionGoal = {
  companyId: 'google',
  customName: '',
  customLogo: '',
  salary: '',
  motivation: '',
  color: '#4285F4',
};

// 本地存储key
const STORAGE_KEY = 'leetcode-hot-100-ascension-goal';

interface AscensionNodeProps {
  currentLang: string;
  completionPercentage: number; // 整体完成进度 0-100
  totalProblems: number;
  completedProblems: number;
}

const AscensionNode: React.FC<AscensionNodeProps> = ({
  currentLang,
  completionPercentage,
  totalProblems,
  completedProblems,
}) => {
  const [goal, setGoal] = useState<AscensionGoal>(DEFAULT_GOAL);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState<AscensionGoal>(DEFAULT_GOAL);
  const [isHovered, setIsHovered] = useState(false);

  // 加载保存的目标
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setGoal(parsed);
        setEditingGoal(parsed);
      }
    } catch (error) {
      console.error('加载飞升目标失败:', error);
    }
  }, []);

  // 保存目标
  const saveGoal = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editingGoal));
      setGoal(editingGoal);
      setIsEditing(false);
    } catch (error) {
      console.error('保存飞升目标失败:', error);
    }
  }, [editingGoal]);

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setEditingGoal(goal);
    setIsEditing(false);
  }, [goal]);

  // 获取当前显示的公司信息
  const getDisplayInfo = useCallback(() => {
    if (goal.companyId) {
      const preset = PRESET_COMPANIES.find(c => c.id === goal.companyId);
      if (preset) {
        return {
          name: currentLang === 'zh' ? preset.name : preset.nameEn,
          logo: preset.logo,
          color: preset.color,
        };
      }
    }
    return {
      name: goal.customName || (currentLang === 'zh' ? '设置目标' : 'Set Goal'),
      logo: goal.customLogo || '🎯',
      color: goal.color || '#FFD700',
    };
  }, [goal, currentLang]);

  const displayInfo = getDisplayInfo();

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

  return (
    <div 
      className={`ascension-node ${isEditing ? 'editing' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 主节点 */}
      <div 
        className="ascension-main"
        style={{ '--ascension-color': displayInfo.color } as React.CSSProperties}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {/* 进度环 */}
        <svg className="ascension-progress-ring" viewBox="0 0 120 120">
          <circle
            className="progress-bg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
          />
          <circle
            className="progress-fill"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${completionPercentage * 3.39} 339`}
            strokeLinecap="round"
            style={{ stroke: displayInfo.color }}
          />
        </svg>

        {/* 节点内容 */}
        <div 
          className="ascension-content"
          style={{ backgroundColor: displayInfo.color }}
        >
          <span className="ascension-logo">{displayInfo.logo}</span>
        </div>

        {/* 飞升光效 */}
        {completionPercentage === 100 && (
          <div className="ascension-glow"></div>
        )}
      </div>

      {/* 节点信息卡片 */}
      <div className="ascension-info">
        <h3 className="ascension-company-name">{displayInfo.name}</h3>
        
        {/* 进度显示 */}
        <div className="ascension-progress-text">
          <span className="progress-completed">{completedProblems}</span>
          <span className="progress-separator">/</span>
          <span className="progress-total">{totalProblems}</span>
          <span className="progress-label">
            {currentLang === 'zh' ? ' 题' : ' problems'}
          </span>
        </div>

        {/* 进度百分比 */}
        <div className="ascension-percentage">
          {completionPercentage.toFixed(0)}%
        </div>

        {/* 薪资包（如果设置了） */}
        {goal.salary && (
          <div className="ascension-salary">
            💰 {goal.salary}
          </div>
        )}

        {/* 勉励语（如果设置了） */}
        {goal.motivation && (
          <div className="ascension-motivation">
            "{goal.motivation}"
          </div>
        )}

        {/* 编辑提示 */}
        {isHovered && !isEditing && (
          <div className="ascension-edit-hint">
            {currentLang === 'zh' ? '点击编辑目标' : 'Click to edit goal'}
          </div>
        )}
      </div>

      {/* 飞升标签 */}
      <div className="ascension-label">
        🚀 {currentLang === 'zh' ? '飞升目标' : 'Ascension Goal'}
      </div>

      {/* 编辑弹窗 */}
      {isEditing && (
        <div className="ascension-editor-overlay" onClick={cancelEdit}>
          <div className="ascension-editor" onClick={e => e.stopPropagation()}>
            <div className="editor-header">
              <h3>{currentLang === 'zh' ? '设置飞升目标' : 'Set Ascension Goal'}</h3>
              <button className="editor-close" onClick={cancelEdit}>×</button>
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
                      <span className="company-logo">{company.logo}</span>
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
                  <div className="custom-row">
                    <label>{currentLang === 'zh' ? 'Logo (emoji)' : 'Logo (emoji)'}</label>
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
              <button className="editor-cancel-btn" onClick={cancelEdit}>
                {currentLang === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button className="editor-save-btn" onClick={saveGoal}>
                {currentLang === 'zh' ? '保存' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AscensionNode;
