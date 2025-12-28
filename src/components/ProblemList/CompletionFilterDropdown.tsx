import React, { useState, useRef, useEffect } from 'react';
import { CompletionFilterType } from '../../services/completionStorage';
import './CompletionFilterDropdown.css';

interface CompletionFilterDropdownProps {
  value: CompletionFilterType;
  onChange: (value: CompletionFilterType) => void;
  t: (key: string) => string;
}

const CompletionFilterDropdown: React.FC<CompletionFilterDropdownProps> = ({
  value,
  onChange,
  t
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { value: CompletionFilterType; labelKey: string }[] = [
    { value: 'all', labelKey: 'completionFilter.all' },
    { value: 'completed', labelKey: 'completionFilter.completed' },
    { value: 'incomplete', labelKey: 'completionFilter.incomplete' }
  ];

  const currentOption = options.find(opt => opt.value === value);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: CompletionFilterType) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="completion-filter-dropdown" ref={dropdownRef}>
      <button
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="dropdown-text">{currentOption ? t(currentOption.labelKey) : ''}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {options.map(option => (
            <div
              key={option.value}
              className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.value === value && <span className="check-icon">✓</span>}
              <span className="option-text">{t(option.labelKey)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletionFilterDropdown;
