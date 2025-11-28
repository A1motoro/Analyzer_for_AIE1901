import React, { useState, useEffect, useCallback } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Alert, Tag, InputNumber, Button, Select } from 'antd';

const { Text } = Typography;

// 定义边界计算结果的类型
interface BoundaryResult {
  // 单边界结果
  boundary?: number;
  // 双边界结果
  lowerBound?: number;
  upperBound?: number;
  lowerBoundary?: number; // 兼容旧属性名
  upperBoundary?: number; // 兼容旧属性名
  // 检验方法
  method?: 'z-test' | 't-test' | 'chi-square';
  // 其他可能的属性
  sampleVariance?: number;
  df?: number;
  criticalValue?: number;
  direction?: 'less' | 'greater' | 'two-sided';
}

// 定义检验方法信息的类型
interface TestMethodInfo {
  method: string;
  color: string;
}

interface ProbabilityBoundaryCardProps {
  title: string;
  data: number[];
  probability: number;
  setProbability: (value: number) => void;
  direction: 'less' | 'greater' | 'two-sided';
  setDirection: (value: 'less' | 'greater' | 'two-sided') => void;
  calculateFunction: (data: number[], probability: number, direction: 'less' | 'greater' | 'two-sided') => BoundaryResult;
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
  const [result, setResult] = useState<BoundaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 提取计算逻辑到单独的函数，避免重复
  const calculateBoundary = useCallback(() => {
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

  // 使用useEffect在依赖项变化时自动计算
  useEffect(() => {
    calculateBoundary();
  }, [calculateBoundary]);

  // 增强getTestMethodInfo函数的健壮性
  const getTestMethodInfo = useCallback((): TestMethodInfo => {
    if (!result) return { method: '', color: 'purple' };
    
    // 处理均值边界计算的方法
    if (result.method === 'z-test' || result.method === 't-test') {
      return {
        method: result.method === 'z-test' ? 'Z-test' : 'T-test',
        color: result.method === 'z-test' ? 'blue' : 'purple'
      };
    }
    
    // 处理方差边界计算（使用卡方检验）
    if (resultConfig.resultType === 'variance' || result.method === 'chi-square') {
      return {
        method: 'Chi-square',
        color: 'purple'
      };
    }
    
    // 默认情况
    return { method: '', color: 'purple' };
  }, [result, resultConfig.resultType]);

  const { method: testMethod, color: tagColor } = getTestMethodInfo();

  // 定义方向选项
  const directionOptions = [
    { value: 'less', label: '小于' },
    { value: 'greater', label: '大于' },
    { value: 'two-sided', label: '双侧' }
  ];

  // 安全地获取边界值，处理可能不存在的属性
  const getBoundaryValue = (property: keyof BoundaryResult, defaultValue: number = 0): string => {
    const value = result?.[property];
    return typeof value === 'number' ? value.toFixed(4) : defaultValue.toFixed(4);
  };

  // 获取下界值（兼容两种属性名）
  const getLowerBound = (): string => {
    const value = result?.lowerBound ?? result?.lowerBoundary;
    return typeof value === 'number' ? value.toFixed(4) : (0).toFixed(4);
  };

  // 获取上界值（兼容两种属性名）
  const getUpperBound = (): string => {
    const value = result?.upperBound ?? result?.upperBoundary;
    return typeof value === 'number' ? value.toFixed(4) : (0).toFixed(4);
  };

  // 获取单边界值
  const getSingleBoundary = (): string => {
    return getBoundaryValue('boundary');
  };

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
            options={directionOptions}
          />
        </Col>
        <Col xs={24} md={8}>
          <Button
            onClick={calculateBoundary}
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
                        value={getLowerBound()}
                        valueStyle={{ color: resultConfig.lowerColor === 'blue' ? '#1890ff' : '#52c41a', fontSize: '16px' }}
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>上界值</Text>}
                        value={getUpperBound()}
                        valueStyle={{ color: resultConfig.upperColor === 'blue' ? '#1890ff' : '#52c41a', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                  <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                    {resultConfig.resultType === 'mean' ? '均值' : '方差'}在 [{getLowerBound()}, {getUpperBound()}] 范围内的概率为 {(probability * 100).toFixed(1)}%
                  </Text>
                </>
              ) : (
                <>
                  <Statistic
                    title={<Text style={{ color: '#90908a', fontSize: '12px' }}>
                      {direction === 'less' ? '上界值' : '下界值'}
                    </Text>}
                    value={getSingleBoundary()}
                    valueStyle={{ color: resultConfig.singleColor === 'green' ? '#52c41a' : '#1890ff', fontSize: '16px' }}
                  />
                  <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                    {resultConfig.resultType === 'mean' ? '均值' : '方差'}
                    {direction === 'less' ? '小于' : '大于'} {getSingleBoundary()} 的概率为 {(probability * 100).toFixed(1)}%
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