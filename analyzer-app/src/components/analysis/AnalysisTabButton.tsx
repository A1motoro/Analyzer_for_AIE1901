import React from 'react';
import { Space } from 'antd';

interface AnalysisTabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  color: string;
}

// 将颜色转换为rgba格式的辅助函数
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const AnalysisTabButton: React.FC<AnalysisTabButtonProps> = ({
  icon,
  label,
  isActive,
  onClick,
  color
}) => {
  const activeBg = hexToRgba(color, 0.15);
  const activeBorder = hexToRgba(color, 0.4);
  const activeShadow = hexToRgba(color, 0.3);
  const hoverBg = hexToRgba(color, 0.1);
  const focusShadow = hexToRgba(color, 0.3);
  const textShadow = hexToRgba(color, 0.3);
  const indicatorShadow = hexToRgba(color, 0.5);

  return (
    <button
      onClick={onClick}
      className="analysis-tab-button"
      data-active={isActive}
      style={{
        '--tab-color': color,
        '--tab-active-bg': activeBg,
        '--tab-active-border': activeBorder,
        '--tab-active-shadow': activeShadow,
        '--tab-hover-bg': hoverBg,
        '--tab-focus-shadow': focusShadow,
        '--tab-text-shadow': textShadow,
        '--tab-indicator-shadow': indicatorShadow,
      } as React.CSSProperties}
    >
      <Space>
        <span className="tab-icon">{icon}</span>
        <span className="tab-label">{label}</span>
      </Space>
      {isActive && <div className="tab-indicator" />}
    </button>
  );
};

