import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, InputNumber, Alert, Tabs, Divider } from 'antd';
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface HypothesisTestingProps {
  analysisResult: any;
  data: number[];
}

const HypothesisTesting: React.FC<HypothesisTestingProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('one-sample');
  const [testType, setTestType] = useState('mean');
  const [nullValue, setNullValue] = useState(0);
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [alternative, setAlternative] = useState('two-sided');

  // 单样本t检验
  const performOneSampleTTest = (sampleData: number[], mu0: number, alpha: number, alt: string) => {
    const n = sampleData.length;
    const sampleMean = sampleData.reduce((sum, val) => sum + val, 0) / n;
    const sampleVariance = sampleData.reduce((sum, val) => sum + Math.pow(val - sampleMean, 2), 0) / (n - 1);
    const sampleStd = Math.sqrt(sampleVariance);

    const tStatistic = (sampleMean - mu0) / (sampleStd / Math.sqrt(n));
    const df = n - 1;

    // 近似计算p值 (使用标准正态分布近似)
    let pValue;
    switch (alt) {
      case 'less':
        pValue = tStatistic <= 0 ? 0.5 : 0.5 * Math.exp(-0.717 * tStatistic - 0.416 * tStatistic * tStatistic);
        break;
      case 'greater':
        pValue = tStatistic >= 0 ? 0.5 : 0.5 * Math.exp(-0.717 * Math.abs(tStatistic) - 0.416 * tStatistic * tStatistic);
        break;
      default: // two-sided
        const absT = Math.abs(tStatistic);
        pValue = 2 * (absT <= 0 ? 0.5 : 0.5 * Math.exp(-0.717 * absT - 0.416 * absT * absT));
    }

    const rejectNull = pValue < alpha;

    return {
      statistic: tStatistic,
      df,
      pValue,
      rejectNull,
      sampleMean,
      sampleStd,
      nullValue: mu0,
      significanceLevel: alpha,
      alternative: alt
    };
  };

  // 方差F检验
  const performVarianceFTest = (sampleData1: number[], sampleData2: number[], alpha: number) => {
    const n1 = sampleData1.length;
    const n2 = sampleData2.length;

    const mean1 = sampleData1.reduce((sum, val) => sum + val, 0) / n1;
    const mean2 = sampleData2.reduce((sum, val) => sum + val, 0) / n2;

    const var1 = sampleData1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1);
    const var2 = sampleData2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1);

    // 确保较大的方差在分子
    const [largerVar, smallerVar, largerN, smallerN] = var1 >= var2 ?
      [var1, var2, n1, n2] : [var2, var1, n2, n1];

    const fStatistic = largerVar / smallerVar;
    const df1 = largerN - 1;
    const df2 = smallerN - 1;

    // 近似p值 (使用F分布近似)
    const pValue = 1 - Math.exp(-0.5 * fStatistic);
    const rejectNull = pValue < alpha;

    return {
      statistic: fStatistic,
      df1,
      df2,
      pValue,
      rejectNull,
      variance1: var1,
      variance2: var2,
      significanceLevel: alpha
    };
  };

  // 比例检验
  const performProportionTest = (successes: number, trials: number, p0: number, alpha: number, alt: string) => {
    const sampleProportion = successes / trials;
    const standardError = Math.sqrt(p0 * (1 - p0) / trials);

    const zStatistic = (sampleProportion - p0) / standardError;

    // 计算p值
    let pValue;
    switch (alt) {
      case 'less':
        pValue = zStatistic <= 0 ? 0.5 : 0.5 * Math.exp(-0.717 * zStatistic - 0.416 * zStatistic * zStatistic);
        break;
      case 'greater':
        pValue = zStatistic >= 0 ? 0.5 : 0.5 * Math.exp(-0.717 * Math.abs(zStatistic) - 0.416 * zStatistic * zStatistic);
        break;
      default: // two-sided
        const absZ = Math.abs(zStatistic);
        pValue = 2 * (absZ <= 0 ? 0.5 : 0.5 * Math.exp(-0.717 * absZ - 0.416 * absZ * absZ));
    }

    const rejectNull = pValue < alpha;

    return {
      statistic: zStatistic,
      pValue,
      rejectNull,
      sampleProportion,
      nullProportion: p0,
      successes,
      trials,
      significanceLevel: alpha,
      alternative: alt
    };
  };

  const runTest = () => {
    let result;
    switch (testType) {
      case 'mean':
        result = performOneSampleTTest(data, nullValue, significanceLevel, alternative);
        break;
      case 'variance':
        // 对于方差检验，我们需要第二个数据集，这里使用模拟数据作为示例
        const mockData2 = data.map(x => x + (Math.random() - 0.5) * 10);
        result = performVarianceFTest(data, mockData2, significanceLevel);
        break;
      case 'proportion':
        const successes = Math.round(nullValue * data.length);
        result = performProportionTest(successes, data.length, nullValue, significanceLevel, alternative);
        break;
      default:
        return null;
    }
    return result;
  };

  const testResult = runTest();

  const getAlternativeText = (alt: string) => {
    switch (alt) {
      case 'less': return '左单侧 (H₁: 参数 < 零值)';
      case 'greater': return '右单侧 (H₁: 参数 > 零值)';
      default: return '双侧 (H₁: 参数 ≠ 零值)';
    }
  };

  return (
    <Card
      title={
        <Space>
          <ExperimentOutlined style={{ color: '#a6e22e' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            假设检验 (Hypothesis Testing)
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="单样本检验" key="one-sample">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 测试参数设置 */}
            <Card title="测试参数设置" style={{ backgroundColor: '#49483e' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>检验类型:</Text>
                  <Select
                    value={testType}
                    onChange={setTestType}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Option value="mean">均值检验 (t检验)</Option>
                    <Option value="variance">方差检验 (F检验)</Option>
                    <Option value="proportion">比例检验 (z检验)</Option>
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>零假设值:</Text>
                  <InputNumber
                    value={nullValue}
                    onChange={(value) => setNullValue(value || 0)}
                    style={{ width: '100%', marginTop: '8px' }}
                    step={0.1}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>显著性水平:</Text>
                  <Select
                    value={significanceLevel}
                    onChange={setSignificanceLevel}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Option value={0.01}>0.01 (99% 置信)</Option>
                    <Option value={0.05}>0.05 (95% 置信)</Option>
                    <Option value={0.10}>0.10 (90% 置信)</Option>
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>备择假设:</Text>
                  <Select
                    value={alternative}
                    onChange={setAlternative}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Option value="two-sided">双侧检验</Option>
                    <Option value="less">左单侧检验</Option>
                    <Option value="greater">右单侧检验</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            {/* 检验结果 */}
            {testResult && (
              <Card title="检验结果" style={{ backgroundColor: '#49483e' }}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Statistic
                        title={
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            检验统计量
                          </Text>
                        }
                        value={testResult.statistic?.toFixed(4) || 'N/A'}
                        valueStyle={{ color: '#66d9ef', fontSize: '18px' }}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <Statistic
                        title={
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            p值
                          </Text>
                        }
                        value={testResult.pValue?.toFixed(4) || 'N/A'}
                        valueStyle={{
                          color: (testResult.pValue || 1) < significanceLevel ? '#f92672' : '#a6e22e',
                          fontSize: '18px'
                        }}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <Statistic
                        title={
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            自由度
                          </Text>
                        }
                        value={
                          'df' in testResult ? testResult.df :
                          'df1' in testResult && 'df2' in testResult ? `${testResult.df1}, ${testResult.df2}` :
                          'N/A'
                        }
                        valueStyle={{ color: '#fd971f', fontSize: '18px' }}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  <Alert
                    message={
                      <Space>
                        {testResult.rejectNull ?
                          <CloseCircleOutlined style={{ color: '#f92672' }} /> :
                          <CheckCircleOutlined style={{ color: '#a6e22e' }} />
                        }
                        <Text style={{ color: '#f8f8f2', fontWeight: 'bold' }}>
                          {testResult.rejectNull ?
                            `拒绝零假设 (p < ${significanceLevel})` :
                            `无法拒绝零假设 (p ≥ ${significanceLevel})`
                          }
                        </Text>
                      </Space>
                    }
                    type={testResult.rejectNull ? 'warning' : 'success'}
                    showIcon={false}
                    style={{ marginTop: '16px' }}
                  />

                  <Card size="small" style={{ backgroundColor: '#2f2e27' }}>
                    <Space direction="vertical" size="small">
                      <Text strong style={{ color: '#f8f8f2' }}>检验信息:</Text>
                      <Text style={{ color: '#90908a' }}>
                        • 零假设 H₀: {testType === 'mean' ? `μ = ${nullValue}` : testType === 'variance' ? 'σ₁² = σ₂²' : `p = ${nullValue}`}
                      </Text>
                      <Text style={{ color: '#90908a' }}>
                        • 备择假设 H₁: {getAlternativeText(alternative)}
                      </Text>
                      <Text style={{ color: '#90908a' }}>
                        • 显著性水平: α = {significanceLevel}
                      </Text>
                      <Text style={{ color: '#90908a' }}>
                        • 样本量: n = {data.length}
                      </Text>
                    </Space>
                  </Card>
                </Space>
              </Card>
            )}
          </Space>
        </TabPane>

        <TabPane tab="两样本检验" key="two-sample">
          <Card style={{ backgroundColor: '#49483e' }}>
            <Text style={{ color: '#90908a' }}>
              两样本检验功能正在开发中，包括：
              <br />• 两个均值之差的t检验
              <br />• 配对样本t检验
              <br />• 两个方差的F检验
              <br />• 两个比例的z检验
            </Text>
          </Card>
        </TabPane>

        <TabPane tab="功效分析" key="power">
          <Card style={{ backgroundColor: '#49483e' }}>
            <Text style={{ color: '#90908a' }}>
              功效分析功能正在开发中，包括：
              <br />• 检验功效计算
              <br />• 样本大小确定
              <br />• 功效曲线绘制
            </Text>
          </Card>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default HypothesisTesting;
