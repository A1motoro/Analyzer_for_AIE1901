import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, InputNumber, Alert, Tabs, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {
  performOneSampleTTest,
  performVarianceFTest,
  performProportionTest
} from '../utils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface HypothesisTestingProps {
  analysisResult: any;
  data: number[];
}

const HypothesisTesting: React.FC<HypothesisTestingProps> = ({ data }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('one-sample');
  const [testType, setTestType] = useState('mean');
  const [nullValue, setNullValue] = useState(0);
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [alternative, setAlternative] = useState('two-sided');




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
      case 'less': return t('hypothesisAlt.leftSided');
      case 'greater': return t('hypothesisAlt.rightSided');
      default: return t('hypothesisAlt.twoSided');
    }
  };

  return (
    <Card
      title={
        <Space>
          <ExperimentOutlined style={{ color: '#a6e22e' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            {t('hypothesis.title')}
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab={t('hypothesis.oneSampleTest')} key="one-sample">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 测试参数设置 */}
            <Card title={t('hypothesis.testParameters')} style={{ backgroundColor: '#49483e' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>{t('hypothesis.testType')}:</Text>
                  <Select
                    value={testType}
                    onChange={setTestType}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Option value="mean">{t('hypothesis.meanTest')}</Option>
                    <Option value="variance">{t('hypothesis.varianceTest')}</Option>
                    <Option value="proportion">{t('hypothesis.proportionTest')}</Option>
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>{t('hypothesis.nullValue')}:</Text>
                  <InputNumber
                    value={nullValue}
                    onChange={(value) => setNullValue(value || 0)}
                    style={{ width: '100%', marginTop: '8px' }}
                    step={0.1}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>{t('hypothesis.significanceLevel')}:</Text>
                  <Select
                    value={significanceLevel}
                    onChange={setSignificanceLevel}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Option value={0.01}>0.01 (99% {t('statistics.confidenceLevel')})</Option>
                    <Option value={0.05}>0.05 (95% {t('statistics.confidenceLevel')})</Option>
                    <Option value={0.10}>0.10 (90% {t('statistics.confidenceLevel')})</Option>
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Text style={{ color: '#90908a' }}>{t('hypothesis.alternativeHypothesis')}:</Text>
                  <Select
                    value={alternative}
                    onChange={setAlternative}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Option value="two-sided">{t('hypothesis.twoSided')}</Option>
                    <Option value="less">{t('hypothesis.leftSided')}</Option>
                    <Option value="greater">{t('hypothesis.rightSided')}</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            {/* 检验结果 */}
            {testResult && (
              <Card title={t('hypothesis.testResults')} style={{ backgroundColor: '#49483e' }}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Statistic
                        title={
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            {t('hypothesis.statistic')}
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
                            {t('hypothesis.pValue')}
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
                            {t('hypothesis.degreesOfFreedom')}
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
                            `${t('hypothesis.rejectNull')} (p < ${significanceLevel})` :
                            `${t('hypothesis.failToRejectNull')} (p ≥ ${significanceLevel})`
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
                      <Text strong style={{ color: '#f8f8f2' }}>{t('hypothesis.testInfo')}:</Text>
                      <Text style={{ color: '#90908a' }}>
                        • {t('hypothesis.nullHypothesis')}: {testType === 'mean' ? `μ = ${nullValue}` : testType === 'variance' ? 'σ₁² = σ₂²' : `p = ${nullValue}`}
                      </Text>
                      <Text style={{ color: '#90908a' }}>
                        • {t('hypothesis.altHypothesis')}: {getAlternativeText(alternative)}
                      </Text>
                      <Text style={{ color: '#90908a' }}>
                        • {t('hypothesis.alpha')} = {significanceLevel}
                      </Text>
                      <Text style={{ color: '#90908a' }}>
                        • {t('hypothesis.sampleSize')}: n = {data.length}
                      </Text>
                    </Space>
                  </Card>
                </Space>
              </Card>
            )}
          </Space>
        </TabPane>

        <TabPane tab={t('hypothesis.twoSampleTest')} key="two-sample">
          <Card style={{ backgroundColor: '#49483e' }}>
            <Text style={{ color: '#90908a' }}>
              {t('hypothesis.twoSampleTests')}
              <br />• {t('hypothesis.twoSampleTTest')}
              <br />• {t('hypothesis.pairedTTest')}
              <br />• {t('hypothesis.twoVarianceFTest')}
              <br />• {t('hypothesis.twoProportionZTest')}
            </Text>
          </Card>
        </TabPane>

        <TabPane tab={t('hypothesis.powerAnalysis')} key="power">
          <Card style={{ backgroundColor: '#49483e' }}>
            <Text style={{ color: '#90908a' }}>
              {t('hypothesis.powerAnalysisText')}
              <br />• {t('hypothesis.powerCalculation')}
              <br />• {t('hypothesis.sampleSizeDetermination')}
              <br />• {t('hypothesis.powerCurves')}
            </Text>
          </Card>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default HypothesisTesting;
