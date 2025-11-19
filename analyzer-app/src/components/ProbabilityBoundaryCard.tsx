import React from 'react';
import { Card, Row, Col, InputNumber, Select, Typography, Alert, Tag, Space, Statistic } from 'antd';

const { Text } = Typography;

interface ProbabilityBoundaryCardProps {
  title: string;
  data: number[];
  probability: number;
  setProbability: (value: number) => void;
  direction: 'less' | 'greater' | 'two-sided';
  setDirection: (value: 'less' | 'greater' | 'two-sided') => void;
  calculateFunction: (data: number[], probability: number, direction: 'less' | 'greater' | 'two-sided') => any;
  resultConfig: {
    singleColor: string;
    upperColor?: string;
    lowerColor?: string;
    resultType: 'mean' | 'variance';
  };
}

const ProbabilityBoundaryCard: React.FC<ProbabilityBoundaryCardProps> = ({
  title,
  data,
  probability,
  setProbability,
  direction,
  setDirection,
  calculateFunction,
  resultConfig,
}) => {
  return (
    <Card title={title} style={{ backgroundColor: '#49483e' }}>
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} md={8}>
          <Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>概率值:</Text>
          <InputNumber
            value={probability}
            onChange={(value) => setProbability(value || 0.95)}
            style={{ width: '100%' }}
            precision={4}
            min={0.0001}
            max={0.9999}
            formatter={(value) => value !== undefined ? `${(value * 100).toFixed(2)}%` : '0%'}
            parser={(value) => parseFloat((value || '0').replace('%', '')) / 100}
          />
        </Col>
        <Col xs={24} md={8}>
          <Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>方向:</Text>
          <Select
            value={direction}
            onChange={(value) => setDirection(value)}
            style={{ width: '100%' }}
          >
            <Select.Option value="less">小于</Select.Option>
            <Select.Option value="greater">大于</Select.Option>
            <Select.Option value="two-sided">双侧</Select.Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Statistic
            title={<Text style={{ color: '#90908a', fontSize: '12px' }}>置信水平</Text>}
            value={(probability * 100).toFixed(2)}
            suffix="%"
            valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
          />
        </Col>
      </Row>
      
      {(() => {
        try {
          const result = calculateFunction(data, probability, direction);
          
          if (result.direction === 'two-sided') {
            return (
              <Alert
                message={
                  <Space direction="vertical">
                    <Text style={{ color: '#f8f8f2' }}>
                      {`${(probability * 100).toFixed(2)}% 置信区间的${resultConfig.resultType === 'mean' ? '均值' : '方差'}边界:`}
                    </Text>
                    <Tag color={resultConfig.lowerColor || 'blue'} style={{ fontSize: '14px' }}>
                      下界: {result.lowerBound?.toFixed(6)}
                    </Tag>
                    <Tag color={resultConfig.upperColor || 'blue'} style={{ fontSize: '14px' }}>
                      上界: {result.upperBound?.toFixed(6)}
                    </Tag>
                    <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                      {resultConfig.resultType === 'mean' ? 
                        `使用 ${result.method.toUpperCase()} 方法, 临界值: ${result.criticalValue?.toFixed(4)}` :
                        `自由度: ${result.df}, 临界值: [${result.lowerCriticalValue?.toFixed(4)}, ${result.upperCriticalValue?.toFixed(4)}]`
                      }
                    </Text>
                  </Space>
                }
                type="success"
                showIcon
                style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
              />
            );
          } else {
            return (
              <Alert
                message={
                  <Space direction="vertical">
                    <Text style={{ color: '#f8f8f2' }}>
                      {`${resultConfig.resultType === 'mean' ? '均值' : '方差'}${result.direction === 'less' ? '小于' : '大于'}边界值的概率为 ${(probability * 100).toFixed(2)}% 时:`}
                    </Text>
                    <Tag color={resultConfig.singleColor} style={{ fontSize: '14px' }}>
                      边界值: {result.boundary?.toFixed(6)}
                    </Tag>
                    <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                      {resultConfig.resultType === 'mean' ? 
                        `使用 ${result.method.toUpperCase()} 方法, 临界值: ${result.criticalValue?.toFixed(4)}` :
                        `自由度: ${result.df}, 临界值: ${result.criticalValue?.toFixed(4)}`
                      }
                    </Text>
                  </Space>
                }
                type="success"
                showIcon
                style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
              />
            );
          }
        } catch (error) {
          return (
            <Alert
              message="计算错误"
              description="请检查输入参数"
              type="error"
              showIcon
              style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
            />
          );
        }
      })()}
    </Card>
  );
};

export default ProbabilityBoundaryCard;