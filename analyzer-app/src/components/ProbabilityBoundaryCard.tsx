import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Alert, Tag, InputNumber, Button, Select } from 'antd';

const { Text } = Typography;
const { Option } = Select;

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
    upperColor: string;
    lowerColor: string;
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
  resultConfig
}) => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      try {
        setError(null);
        const boundaryResult = calculateFunction(data, probability, direction);
        setResult(boundaryResult);
      } catch (err) {
        console.error('Error calculating boundary:', err);
        setError(err instanceof Error ? err.message : '计算过程中发生未知错误');
        setResult(null);
      }
    }
  }, [data, probability, direction, calculateFunction]);

  // 获取检验方法和对应的颜色
  const getTestMethodInfo = () => {
    if (!result) return { method: '', color: 'purple' };
    
    // 处理均值边界计算的方法
    if (result.method === 'z-test' || result.method === 't-test') {
      return {
        method: result.method === 'z-test' ? 'Z-test' : 'T-test',
        color: result.method === 'z-test' ? 'blue' : 'purple'
      };
    }
    
    // 处理方差边界计算（使用卡方检验）
    if (resultConfig.resultType === 'variance') {
      return {
        method: 'Chi-square',
        color: 'purple'
      };
    }
    
    // 默认情况
    return { method: '', color: 'purple' };
  };

  const { method: testMethod, color: tagColor } = getTestMethodInfo();

  return (
    <Card title={title} style={{ backgroundColor: '#49483e' }}>
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} md={8}>
          <Typography.Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>
            概率值:
          </Typography.Text>
          <InputNumber
            value={probability}
            onChange={(value) => setProbability(value || 0.95)}
            style={{ width: '100%' }}
            min={0.01}
            max={0.99}
            precision={3}
            formatter={(value) => value !== undefined ? `${(value * 100).toFixed(1)}%` : '95%'}
            parser={(value) => parseFloat((value || '95').replace('%', '')) / 100}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>
            方向:
          </Typography.Text>
          <Select
            value={direction}
            onChange={(value) => setDirection(value)}
            style={{ width: '100%' }}
          >
            <Option value="less">小于</Option>
            <Option value="greater">大于</Option>
            <Option value="two-sided">双侧</Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Button
            onClick={() => {
              if (data && data.length > 0) {
                try {
                  setError(null);
                  const boundaryResult = calculateFunction(data, probability, direction);
                  setResult(boundaryResult);
                } catch (err) {
                  console.error('Error calculating boundary:', err);
                  setError(err instanceof Error ? err.message : '计算过程中发生未知错误');
                  setResult(null);
                }
              }
            }}
            style={{ marginTop: '29px', width: '100%' }}
          >
            重新计算
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert
          message="计算错误"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px', backgroundColor: '#2f2e27', color: '#f8f8f2' }}
        />
      )}

      {result && (
        <Alert
          message={
            <Space direction="vertical" style={{ width: '100%' }}>
              {direction === 'two-sided' ? (
                <>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>下界值</Text>}
                        value={result.lowerBound?.toFixed(4) || result.lowerBoundary?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: resultConfig.lowerColor === 'blue' ? '#1890ff' : '#52c41a', fontSize: '16px' }}
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>上界值</Text>}
                        value={result.upperBound?.toFixed(4) || result.upperBoundary?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: resultConfig.upperColor === 'blue' ? '#1890ff' : '#52c41a', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                  <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                    {resultConfig.resultType === 'mean' ? '均值' : '方差'}在 [{result.lowerBound?.toFixed(4) || result.lowerBoundary?.toFixed(4)}, {result.upperBound?.toFixed(4) || result.upperBoundary?.toFixed(4)}] 范围内的概率为 {(probability * 100).toFixed(1)}%
                  </Text>
                </>
              ) : (
                <>
                  <Statistic
                    title={<Text style={{ color: '#90908a', fontSize: '12px' }}>
                      {direction === 'less' ? '上界值' : '下界值'}
                    </Text>}
                    value={result.boundary?.toFixed(4) || '0.0000'}
                    valueStyle={{ color: resultConfig.singleColor === 'green' ? '#52c41a' : '#1890ff', fontSize: '16px' }}
                  />
                  <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                    {resultConfig.resultType === 'mean' ? '均值' : '方差'}
                    {direction === 'less' ? '小于' : '大于'} {result.boundary?.toFixed(4)} 的概率为 {(probability * 100).toFixed(1)}%
                  </Text>
                </>
              )}
              {testMethod && (
                <Tag color={tagColor}>
                  {testMethod}
                </Tag>
              )}
            </Space>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
        />
      )}
    </Card>
  );
};

export default ProbabilityBoundaryCard;