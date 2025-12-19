import React, { useState } from 'react';
import './WeChatFloat.css';

const WeChatFloat: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="wechat-float"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`wechat-trigger ${isExpanded ? 'expanded' : ''}`}>
        <svg className="wechat-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
        </svg>
        <span className="wechat-text">算法交流群</span>
      </div>
      
      {isExpanded && (
        <div className="wechat-panel">
          <div className="wechat-content">
            <div className="qrcode-section">
              <h4>扫码加入微信交流群</h4>
              <img 
                src={`${process.env.PUBLIC_URL}/qrcode/wechat-group-qrcode.jpg`}
                alt="微信群二维码"
                className="qrcode-img"
              />
            </div>
            <div className="qrcode-divider"></div>
            <div className="qrcode-section backup">
              <p className="backup-tip">👆 群二维码过期？扫下方二维码</p>
              <img 
                src={`${process.env.PUBLIC_URL}/qrcode/cc11001100-wechat-qrcode.jpg`}
                alt="个人微信二维码"
                className="qrcode-img small"
              />
              <p className="backup-hint">发送 <strong>"leetcode"</strong> 拉你入群</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeChatFloat;
