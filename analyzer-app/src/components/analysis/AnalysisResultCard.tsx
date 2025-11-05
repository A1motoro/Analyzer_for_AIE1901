import React from 'react';
import { Card, Space, Typography } from 'antd';

const { Title } = Typography;

interface AnalysisResultCardProps {
  title: string;
  icon?: React.ReactNode;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  title,
  icon,
  iconColor = '#66d9ef',
  children,
  className = ''
}) => {
  return (
    <Card
      className={`analysis-result-card ${className}`}
      title={
        <Space>
          {icon && (
            <span style={{ color: iconColor, fontSize: '18px' }}>
              {icon}
            </span>
          )}
          <Title level={4} style={{ margin: 0, color: 'var(--monokai-fg)' }}>
            {title}
          </Title>
        </Space>
      }
      style={{
        backgroundColor: 'var(--monokai-bg-light)',
        border: '1px solid var(--monokai-bg-lighter)',
        borderRadius: '12px',
        marginBottom: '24px',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </Card>
  );
};

