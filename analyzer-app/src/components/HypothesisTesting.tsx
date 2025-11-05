import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, InputNumber, Alert, Tabs, Divider, Tag, Button, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {
  performOneSampleTTest,
  performVarianceFTest,
  performProportionTest,
  performTwoSampleTTest,
  performPairedTTest,
  performTwoProportionTest,
  calculateConfidenceInterval
} from '../utils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface HypothesisTestingProps {
  analysisResult: any;
  data: number[];
}

const HypothesisTesting: React.FC<HypothesisTestingProps> = ({ data, analysisResult }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('one-sample');
  
  // 单样本检验状态
  const [testType, setTestType] = useState('mean');
  const [nullValue, setNullValue] = useState(0);
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [alternative, setAlternative] = useState('two-sided');

  // 两样本检验状态
  const [twoSampleTestType, setTwoSampleTestType] = useState('two-sample-t');
  const [twoSampleAlternative, setTwoSampleAlternative] = useState('two-sided');
  const [twoSampleSignificanceLevel, setTwoSampleSignificanceLevel] = useState(0.05);
  const [equalVariance, setEqualVariance] = useState(true);
  const [secondData, setSecondData] = useState<number[]>([]);
  const [useGeneratedData, setUseGeneratedData] = useState(true);

  // 生成第二个数据集
  const generateSecondDataset = () => {
    if (data.length === 0) return [];
    const mean = analysisResult?.mean || 0;
    const std = analysisResult?.stdDev || 1;
    // 生成与第一个数据集略有差异的第二个数据集
    const generated = Array.from({ length: data.length }, () => 
      mean + (Math.random() - 0.5) * 2 * std + (Math.random() > 0.5 ? 3 : -3)
    );
    setSecondData(generated);
    return generated;
  };

  // 初始化第二个数据集
  React.useEffect(() => {
    if (useGeneratedData && data.length > 0 && secondData.length === 0) {
      generateSecondDataset();
    }
  }, [data.length, useGeneratedData]);

  const handleSecondDataUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const parsed = lines.map(line => parseFloat(line.trim())).filter(val => !isNaN(val));
      if (parsed.length > 0) {
        setSecondData(parsed);
        setUseGeneratedData(false);
      }
    };
    reader.readAsText(file);
    return false;
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
      case 'less': return t('hypothesisAlt.leftSided');
      case 'greater': return t('hypothesisAlt.rightSided');
      default: return t('hypothesisAlt.twoSided');
    }
  };

  // 运行两样本检验
  const runTwoSampleTest = () => {
    if (data.length === 0 || secondData.length === 0) return null;

    let result;
    try {
      switch (twoSampleTestType) {
        case 'two-sample-t':
          result = performTwoSampleTTest(
            data, 
            secondData, 
            twoSampleSignificanceLevel, 
            twoSampleAlternative,
            equalVariance
          );
          break;
        case 'paired':
          result = performPairedTTest(
            data, 
            secondData, 
            twoSampleSignificanceLevel, 
            twoSampleAlternative
          );
          break;
        case 'variance':
          result = performVarianceFTest(data, secondData, twoSampleSignificanceLevel);
          break;
        case 'proportion':
          const successes1 = Math.round(data.filter(x => x > (analysisResult?.mean || 0)).length);
          const successes2 = Math.round(secondData.filter(x => x > (analysisResult?.mean || 0)).length);
          result = performTwoProportionTest(
            successes1,
            data.length,
            successes2,
            secondData.length,
            twoSampleSignificanceLevel,
            twoSampleAlternative
          );
          break;
        default:
          return null;
      }
      return result;
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const twoSampleTestResult = runTwoSampleTest();

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
                    style={{ marginTop: '16px', backgroundColor: '#2f2e27', color: '#f8f8f2' }}
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

            {/* 双侧检验对比数据 */}
            {testResult && alternative === 'two-sided' && testType === 'mean' && 'sampleMean' in testResult && (
              <Card title={t('hypothesis.twoSidedComparison')} style={{ backgroundColor: '#49483e' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* 对比数据说明 */}
                  <Alert
                    message={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text strong style={{ color: '#f8f8f2', fontSize: '14px' }}>
                          {t('hypothesis.comparisonDataTitle')}
                        </Text>
                        <Text style={{ color: '#90908a', fontSize: '13px' }}>
                          {t('hypothesis.comparisonDataDesc')}
                        </Text>
                        <Text style={{ color: '#66d9ef', fontSize: '13px', marginTop: '8px' }}>
                          • {t('hypothesis.sampleStatistic')}: <Text style={{ color: '#f8f8f2' }}>x̄ = {testResult.sampleMean?.toFixed(4)}</Text> - {t('hypothesis.sampleMeanDesc')}
                        </Text>
                        <Text style={{ color: '#fd971f', fontSize: '13px' }}>
                          • {t('hypothesis.nullHypothesisValue')}: <Text style={{ color: '#f8f8f2' }}>μ₀ = {nullValue.toFixed(4)}</Text> - {t('hypothesis.nullValueDesc')}
                        </Text>
                        <Text style={{ color: '#a6e22e', fontSize: '13px' }}>
                          • {t('hypothesis.difference')}: <Text style={{ color: '#f8f8f2' }}>x̄ - μ₀ = {(testResult.sampleMean - nullValue).toFixed(4)}</Text> - {t('hypothesis.differenceDesc')}
                        </Text>
                      </Space>
                    }
                    type="info"
                    showIcon
                    style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />

                  {/* 调整对比数据 */}
                  <Card size="small" style={{ backgroundColor: '#2f2e27' }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Text strong style={{ color: '#f8f8f2' }}>
                        {t('hypothesis.adjustComparisonData')}:
                      </Text>
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Text style={{ color: '#90908a', fontSize: '13px' }}>
                            {t('hypothesis.adjustNullValue')}:
                          </Text>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <Text style={{ color: '#90908a', fontSize: '14px', whiteSpace: 'nowrap' }}>μ₀ =</Text>
                            <InputNumber
                              value={nullValue}
                              onChange={(value) => setNullValue(value || 0)}
                              style={{ flex: 1 }}
                              size="large"
                              step={0.1}
                              precision={4}
                            />
                          </div>
                          <Text style={{ color: '#90908a', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {t('hypothesis.adjustNullValueHint')}
                          </Text>
                        </Col>
                        <Col xs={24} md={12}>
                          <Text style={{ color: '#90908a', fontSize: '13px' }}>
                            {t('hypothesis.currentComparison')}:
                          </Text>
                          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#1e1e1e', borderRadius: '4px' }}>
                            <Text style={{ color: '#66d9ef', fontSize: '14px' }}>
                              x̄ = <Text style={{ color: '#f8f8f2' }}>{testResult.sampleMean?.toFixed(4)}</Text>
                            </Text>
                            <Text style={{ color: '#90908a', margin: '0 8px' }}>vs</Text>
                            <Text style={{ color: '#fd971f', fontSize: '14px' }}>
                              μ₀ = <Text style={{ color: '#f8f8f2' }}>{nullValue.toFixed(4)}</Text>
                            </Text>
                            <div style={{ marginTop: '8px' }}>
                              <Text style={{ color: '#a6e22e', fontSize: '14px' }}>
                                {t('hypothesis.difference')}: <Text style={{ color: '#f8f8f2' }}>{(testResult.sampleMean - nullValue).toFixed(4)}</Text>
                              </Text>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Space>
                  </Card>

                  {/* 对比数据统计 */}
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Statistic
                        title={
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            {t('hypothesis.sampleStatistic')}
                          </Text>
                        }
                        value={testResult.sampleMean?.toFixed(4) || 'N/A'}
                        prefix={<Text style={{ color: '#90908a', fontSize: '14px' }}>x̄ =</Text>}
                        valueStyle={{ color: '#66d9ef', fontSize: '18px' }}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <Statistic
                        title={
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            {t('hypothesis.nullHypothesisValue')}
                          </Text>
                        }
                        value={nullValue.toFixed(4)}
                        prefix={<Text style={{ color: '#90908a', fontSize: '14px' }}>μ₀ =</Text>}
                        valueStyle={{ color: '#fd971f', fontSize: '18px' }}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <Statistic
                        title={
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            {t('hypothesis.difference')}
                          </Text>
                        }
                        value={(testResult.sampleMean - nullValue).toFixed(4)}
                        prefix={<Text style={{ color: '#90908a', fontSize: '14px' }}>x̄ - μ₀ =</Text>}
                        valueStyle={{
                          color: Math.abs(testResult.sampleMean - nullValue) > 0 ? '#a6e22e' : '#90908a',
                          fontSize: '18px'
                        }}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  <Alert
                    message={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text style={{ color: '#f8f8f2', fontWeight: 'bold' }}>
                          {t('hypothesis.twoSidedComparisonTitle')}
                        </Text>
                        <Text style={{ color: '#90908a', fontSize: '13px' }}>
                          {t('hypothesis.twoSidedComparisonDesc')}
                        </Text>
                        <Text style={{ color: '#f8f8f2', marginTop: '8px' }}>
                          {t('hypothesis.twoSidedComparisonConclusion')}: {
                            testResult.rejectNull ? (
                              <Tag color="red" style={{ fontSize: '13px' }}>
                                {t('hypothesis.rejectNull')} - {t('hypothesis.sampleDiffersFromNull')}
                              </Tag>
                            ) : (
                              <Tag color="green" style={{ fontSize: '13px' }}>
                                {t('hypothesis.failToRejectNull')} - {t('hypothesis.sampleNotDiffersFromNull')}
                              </Tag>
                            )
                          }
                        </Text>
                      </Space>
                    }
                    type={testResult.rejectNull ? 'warning' : 'info'}
                    showIcon
                    style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />

                  {/* 双侧检验的置信区间 */}
                  {(() => {
                    const confidenceLevel = 1 - significanceLevel;
                    const ci = calculateConfidenceInterval(data, confidenceLevel);
                    return (
                      <Card size="small" style={{ backgroundColor: '#2f2e27' }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong style={{ color: '#f8f8f2' }}>
                            {t('hypothesis.confidenceIntervalForComparison')} ({confidenceLevel * 100}%):
                          </Text>
                          <Tag color="blue" style={{ fontSize: '14px' }}>
                            [{ci.interval.lower.toFixed(4)}, {ci.interval.upper.toFixed(4)}]
                          </Tag>
                          <Text style={{ color: '#90908a', fontSize: '12px' }}>
                            {t('hypothesis.confidenceIntervalInterpretation')}: {
                              (ci.interval.lower <= nullValue && ci.interval.upper >= nullValue) ? (
                                <Text style={{ color: '#a6e22e' }}>
                                  {t('hypothesis.nullValueInCI')}
                                </Text>
                              ) : (
                                <Text style={{ color: '#f92672' }}>
                                  {t('hypothesis.nullValueNotInCI')}
                                </Text>
                              )
                            }
                          </Text>
                        </Space>
                      </Card>
                    );
                  })()}
                </Space>
              </Card>
            )}
          </Space>
        </TabPane>

        <TabPane tab={t('hypothesis.twoSampleTest')} key="two-sample">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 第二个数据集输入 */}
            <Card title={t('hypothesis.secondDataset')} style={{ backgroundColor: '#49483e' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Text style={{ color: '#90908a' }}>{t('hypothesis.dataSource')}:</Text>
                    <Select
                      value={useGeneratedData ? 'generate' : 'upload'}
                      onChange={(value) => {
                        setUseGeneratedData(value === 'generate');
                        if (value === 'generate') {
                          generateSecondDataset();
                        }
                      }}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <Option value="generate">{t('hypothesis.generateSecondData')}</Option>
                      <Option value="upload">{t('hypothesis.uploadSecondData')}</Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    {useGeneratedData && (
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={generateSecondDataset}
                        style={{ marginTop: '24px' }}
                      >
                        {t('hypothesis.regenerateSecondData')}
                      </Button>
                    )}
                  </Col>
                </Row>

                {!useGeneratedData && (
                  <Upload.Dragger
                    accept=".csv,.txt"
                    beforeUpload={handleSecondDataUpload}
                    showUploadList={false}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ color: '#66d9ef' }} />
                    </p>
                    <p className="ant-upload-text" style={{ color: '#f8f8f2' }}>
                      {t('hypothesis.clickOrDragSecondFile')}
                    </p>
                    <p className="ant-upload-hint" style={{ color: '#90908a' }}>
                      {t('hypothesis.uploadSecondDataHint')}
                    </p>
                  </Upload.Dragger>
                )}

                {secondData.length > 0 && (
                  <Alert
                    message={t('hypothesis.secondDataLoaded', { count: secondData.length })}
                    type="success"
                    showIcon
                    style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />
                )}
              </Space>
            </Card>

            {/* 两样本检验参数设置 */}
            {secondData.length > 0 && (
              <Card title={t('hypothesis.testParameters')} style={{ backgroundColor: '#49483e' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={6}>
                    <Text style={{ color: '#90908a' }}>{t('hypothesis.testType')}:</Text>
                    <Select
                      value={twoSampleTestType}
                      onChange={setTwoSampleTestType}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <Option value="two-sample-t">{t('hypothesis.twoSampleTTest')}</Option>
                      <Option value="paired">{t('hypothesis.pairedTTest')}</Option>
                      <Option value="variance">{t('hypothesis.twoVarianceFTest')}</Option>
                      <Option value="proportion">{t('hypothesis.twoProportionZTest')}</Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={6}>
                    <Text style={{ color: '#90908a' }}>{t('hypothesis.significanceLevel')}:</Text>
                    <Select
                      value={twoSampleSignificanceLevel}
                      onChange={setTwoSampleSignificanceLevel}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <Option value={0.01}>0.01 (99% {t('statistics.confidenceLevel')})</Option>
                      <Option value={0.05}>0.05 (95% {t('statistics.confidenceLevel')})</Option>
                      <Option value={0.10}>0.10 (90% {t('statistics.confidenceLevel')})</Option>
                    </Select>
                  </Col>
                  {twoSampleTestType !== 'variance' && (
                    <Col xs={24} md={6}>
                      <Text style={{ color: '#90908a' }}>{t('hypothesis.alternativeHypothesis')}:</Text>
                      <Select
                        value={twoSampleAlternative}
                        onChange={setTwoSampleAlternative}
                        style={{ width: '100%', marginTop: '8px' }}
                      >
                        <Option value="two-sided">{t('hypothesis.twoSided')}</Option>
                        <Option value="less">{t('hypothesis.leftSided')}</Option>
                        <Option value="greater">{t('hypothesis.rightSided')}</Option>
                      </Select>
                    </Col>
                  )}
                  {twoSampleTestType === 'two-sample-t' && (
                    <Col xs={24} md={6}>
                      <Text style={{ color: '#90908a' }}>{t('confidence.equalVariance')}:</Text>
                      <Select
                        value={equalVariance}
                        onChange={setEqualVariance}
                        style={{ width: '100%', marginTop: '8px' }}
                      >
                        <Option value={true}>{t('confidence.assumeEqual')}</Option>
                        <Option value={false}>{t('confidence.assumeUnequal')}</Option>
                      </Select>
                    </Col>
                  )}
                </Row>
              </Card>
            )}

            {/* 两样本检验结果 */}
            {twoSampleTestResult && !('error' in twoSampleTestResult) && (
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
                        value={twoSampleTestResult.statistic?.toFixed(4) || 'N/A'}
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
                        value={twoSampleTestResult.pValue?.toFixed(4) || 'N/A'}
                        valueStyle={{
                          color: (twoSampleTestResult.pValue || 1) < twoSampleSignificanceLevel ? '#f92672' : '#a6e22e',
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
                          'df' in twoSampleTestResult ? twoSampleTestResult.df :
                          'df1' in twoSampleTestResult && 'df2' in twoSampleTestResult ? 
                            `${twoSampleTestResult.df1}, ${twoSampleTestResult.df2}` :
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
                        {twoSampleTestResult.rejectNull ?
                          <CloseCircleOutlined style={{ color: '#f92672' }} /> :
                          <CheckCircleOutlined style={{ color: '#a6e22e' }} />
                        }
                        <Text style={{ color: '#f8f8f2', fontWeight: 'bold' }}>
                          {twoSampleTestResult.rejectNull ?
                            `${t('hypothesis.rejectNull')} (p < ${twoSampleSignificanceLevel})` :
                            `${t('hypothesis.failToRejectNull')} (p ≥ ${twoSampleSignificanceLevel})`
                          }
                        </Text>
                      </Space>
                    }
                    type={twoSampleTestResult.rejectNull ? 'warning' : 'success'}
                    showIcon={false}
                    style={{ marginTop: '16px', backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />

                  {/* 两样本检验的详细信息 */}
                  <Card size="small" style={{ backgroundColor: '#2f2e27' }}>
                    <Space direction="vertical" size="small">
                      <Text strong style={{ color: '#f8f8f2' }}>{t('hypothesis.testInfo')}:</Text>
                      {twoSampleTestType === 'two-sample-t' && 'mean1' in twoSampleTestResult && (
                        <>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.nullHypothesis')}: μ₁ = μ₂
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.altHypothesis')}: {getAlternativeText(twoSampleAlternative)}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.sampleSize')}: n₁ = {'sampleSize1' in twoSampleTestResult ? twoSampleTestResult.sampleSize1 : data.length}, n₂ = {'sampleSize2' in twoSampleTestResult ? twoSampleTestResult.sampleSize2 : secondData.length}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.sampleMean')}: x̄₁ = {twoSampleTestResult.mean1?.toFixed(4)}, x̄₂ = {twoSampleTestResult.mean2?.toFixed(4)}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.meanDiff')}: {twoSampleTestResult.meanDiff?.toFixed(4)}
                          </Text>
                        </>
                      )}
                      {twoSampleTestType === 'paired' && 'sampleSize' in twoSampleTestResult && (
                        <>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.nullHypothesis')}: μ_d = 0
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.altHypothesis')}: {getAlternativeText(twoSampleAlternative)}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.sampleSize')}: n = {twoSampleTestResult.sampleSize}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.diffMean')}: {twoSampleTestResult.meanDiff?.toFixed(4)}
                          </Text>
                        </>
                      )}
                      {twoSampleTestType === 'variance' && 'variance1' in twoSampleTestResult && (
                        <>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.nullHypothesis')}: σ₁² = σ₂²
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.sampleSize')}: n₁ = {data.length}, n₂ = {secondData.length}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.variance')}: s₁² = {twoSampleTestResult.variance1?.toFixed(4)}, s₂² = {twoSampleTestResult.variance2?.toFixed(4)}
                          </Text>
                        </>
                      )}
                      {twoSampleTestType === 'proportion' && 'proportion1' in twoSampleTestResult && (
                        <>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.nullHypothesis')}: p₁ = p₂
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.altHypothesis')}: {getAlternativeText(twoSampleAlternative)}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.sampleSize')}: n₁ = {'sampleSize1' in twoSampleTestResult ? twoSampleTestResult.sampleSize1 : data.length}, n₂ = {'sampleSize2' in twoSampleTestResult ? twoSampleTestResult.sampleSize2 : secondData.length}
                          </Text>
                          <Text style={{ color: '#90908a' }}>
                            • {t('hypothesis.proportion')}: p₁ = {twoSampleTestResult.proportion1?.toFixed(4)}, p₂ = {twoSampleTestResult.proportion2?.toFixed(4)}
                          </Text>
                        </>
                      )}
                      <Text style={{ color: '#90908a' }}>
                        • {t('hypothesis.alpha')} = {twoSampleSignificanceLevel}
                      </Text>
                    </Space>
                  </Card>
                </Space>
              </Card>
            )}

            {'error' in (twoSampleTestResult || {}) && (
              <Alert
                message={(twoSampleTestResult as any).error}
                type="error"
                showIcon
                style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
              />
            )}
          </Space>
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
