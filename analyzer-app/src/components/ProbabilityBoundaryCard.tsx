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

  useEffect(() => {
    if (data && data.length > 0) {
      const boundaryResult = calculateFunction(data, probability, direction);
      setResult(boundaryResult);
    }
  }, [data, probability, direction, calculateFunction]);

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
                const boundaryResult = calculateFunction(data, probability, direction);
                setResult(boundaryResult);
              }
            }}
            style={{ marginTop: '29px', width: '100%' }}
          >
            重新计算
          </Button>
        </Col>
      </Row>

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
                        value={result.lowerBoundary?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: resultConfig.lowerColor === 'blue' ? '#1890ff' : '#52c41a', fontSize: '16px' }}
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>上界值</Text>}
                        value={result.upperBoundary?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: resultConfig.upperColor === 'blue' ? '#1890ff' : '#52c41a', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                  <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                    {resultConfig.resultType === 'mean' ? '均值' : '方差'}在 [{result.lowerBoundary?.toFixed(4)}, {result.upperBoundary?.toFixed(4)}] 范围内的概率为 {(probability * 100).toFixed(1)}%
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
              {result.method && (
                <Tag color={result.method === 'z' ? 'blue' : 'purple'}>
                  {result.method === 'z' ? 'Z-test' : result.method === 't' ? 'T-test' : 'Chi-square'}
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