import React, { useState } from 'react';
import { Card, Statistic, Space, Tooltip, Typography } from 'antd';
import {
  NumberOutlined,
  LineChartOutlined,
  BarChartOutlined,
  DotChartOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface StatisticCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  tooltip?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  suffix,
  icon,
  color,
  description,
  tooltip
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip title={tooltip} placement="top">
      <Card
        bordered={false}
        style={{
          backgroundColor: '#2f2e27',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered
            ? '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(253, 151, 31, 0.15)'
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
          border: isHovered ? `1px solid ${color}40` : 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Statistic
          title={
            <Space style={{ color: '#90908a', fontSize: '12px' }}>
              <span style={{ color, transition: 'color 0.3s ease' }}>{icon}</span>
              <Text style={{ color: '#90908a', transition: 'color 0.3s ease' }}>
                {title}
              </Text>
            </Space>
          }
          value={value}
          valueStyle={{
            color,
            fontSize: '24px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            textShadow: isHovered ? `0 0 8px ${color}30` : 'none'
          }}
          suffix={
            suffix && (
              <Text
                style={{
                  color: '#75715e',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  transition: 'color 0.3s ease'
                }}
              >
                {suffix}
              </Text>
            )
          }
        />
        {description && (
          <Text
            style={{
              color: '#90908a',
              fontSize: '14px',
              display: 'block',
              marginTop: '4px',
              transition: 'color 0.3s ease'
            }}
          >
            {description}
          </Text>
        )}
      </Card>
    </Tooltip>
  );
};

interface CoreStatisticsProps {
  analysisResult: any;
}

export const CoreStatistics: React.FC<CoreStatisticsProps> = ({ analysisResult }) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 核心统计指标 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <StatisticCard
          title="MEAN"
          value={analysisResult.mean?.toFixed(4) || '0.0000'}
          suffix="平均值"
          icon={<NumberOutlined />}
          color="#66d9ef"
          tooltip="算术平均值，表示数据的中心位置"
        />
        <StatisticCard
          title="MEDIAN"
          value={analysisResult.median?.toFixed(4) || '0.0000'}
          suffix="中位数"
          icon={<LineChartOutlined />}
          color="#a6e22e"
          tooltip="排序后位于中间位置的值，对异常值不敏感"
        />
        <StatisticCard
          title="STD DEV"
          value={analysisResult.stdDev?.toFixed(4) || '0.0000'}
          suffix="标准差"
          icon={<BarChartOutlined />}
          color="#fd971f"
          tooltip="衡量数据分散程度的统计量"
        />
        <StatisticCard
          title="VARIANCE"
          value={analysisResult.variance?.toFixed(4) || '0.0000'}
          suffix="方差"
          icon={<DotChartOutlined />}
          color="#ae81ff"
          tooltip="标准差的平方，衡量数据变异性"
        />
      </div>
    </Space>
  );
};

export default StatisticCard;
