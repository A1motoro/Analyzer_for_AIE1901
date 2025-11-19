import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, Alert, Tabs, Divider, Tag, InputNumber, Button } from 'antd';
import {
  CalculatorOutlined
} from '@ant-design/icons';
import {
  calculateTwoSampleMeanCI,
  calculatePairedMeanCI,
  calculateTwoProportionCI,
  calculateVarianceCI,
  calculateConfidenceInterval,
  calculateMeanProbabilityFromData,
  calculateVarianceProbability,
  calculateMeanBoundary,
  calculateVarianceBoundary
} from '../utils';
import { useTranslation } from 'react-i18next';
import ProbabilityBoundaryCard from './ProbabilityBoundaryCard';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface ConfidenceIntervalsProps {
  data: number[];
  analysisResult: any;
}

const ConfidenceIntervals: React.FC<ConfidenceIntervalsProps> = ({ data, analysisResult }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('mean');
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);
  const [currentLevel, setCurrentLevel] = useState(0.95); // 当前置信水平
  const [useCustomLevel, setUseCustomLevel] = useState(false); // 是否使用自定义置信水平
  const [boundaryValue, setBoundaryValue] = useState<number>(analysisResult.mean || 0); // 边界值
  const [probabilityResult] = useState<any>(null); // 概率计算结果
  const [equalVariance, setEqualVariance] = useState(true);
    // 概率计算相关状态
    const [meanBoundary, setMeanBoundary] = useState<number>(analysisResult.mean || 0);
    const [varianceBoundary, setVarianceBoundary] = useState<number>(analysisResult.variance || 1);
    const [meanDirection, setMeanDirection] = useState<'less' | 'greater' | 'two-sided'>('two-sided');
    const [varianceDirection, setVarianceDirection] = useState<'less' | 'greater'>('greater');
    // 概率求边界值相关状态
    const [meanProbabilityForBoundary, setMeanProbabilityForBoundary] = useState<number>(0.95);
    const [varianceProbabilityForBoundary, setVarianceProbabilityForBoundary] = useState<number>(0.95);
    const [meanDirectionForBoundary, setMeanDirectionForBoundary] = useState<'less' | 'greater' | 'two-sided'>('two-sided');
    const [varianceDirectionForBoundary, setVarianceDirectionForBoundary] = useState<'less' | 'greater' | 'two-sided'>('two-sided');

  // 生成第二个数据集用于演示（在实际应用中应该让用户输入）
  const generateSecondDataset = (size: number) => {
    const mean = analysisResult.mean || 0;
    const std = analysisResult.stdDev || 1;
    return Array.from({ length: size }, () => mean + (Math.random() - 0.5) * 2 * std + (Math.random() > 0.5 ? 5 : -5));
  };

  // 获取当前置信水平
  const getCurrentConfidenceLevel = () => {
    return useCustomLevel ? currentLevel : confidenceLevel;
  };

  // 渲染置信水平选择器
  const renderConfidenceLevelSelector = () => {
    return (
      <div>
        <Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>
          {t('confidence.confidenceLevel')}:
        </Text>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Select
            value={useCustomLevel ? 'custom' : confidenceLevel.toString()}
            onChange={(value) => {
              if (value === 'custom') {
                setUseCustomLevel(true);
              } else {
                setUseCustomLevel(false);
                setConfidenceLevel(parseFloat(value));
                setCurrentLevel(parseFloat(value));
              }
            }}
            style={{ width: '120px' }}
          >
            <Option value="0.90">90%</Option>
            <Option value="0.95">95%</Option>
            <Option value="0.99">99%</Option>
            <Option value="custom">自定义</Option>
          </Select>
          {useCustomLevel && (
            <InputNumber
              value={currentLevel}
              onChange={(value) => setCurrentLevel(value || 0.95)}
              style={{ width: '120px' }}
              min={0.01}
              max={0.99}
              precision={3}
              formatter={(value) => value !== undefined ? `${(value * 100).toFixed(1)}%` : '95%'}
              parser={(value) => parseFloat((value || '95').replace('%', '')) / 100}
            />
          )}
        </div>
      </div>
    );
  };

  const renderOneSampleCI = () => {
      // 使用自定义置信水平重新计算均值置信区间
      const basicCI = calculateConfidenceInterval(data, getCurrentConfidenceLevel());
      const varianceCI = calculateVarianceCI(data, getCurrentConfidenceLevel());
      
      // 计算概率
      const meanProb = calculateMeanProbabilityFromData(data, meanBoundary, meanDirection);
      const varianceProb = calculateVarianceProbability(data, varianceBoundary, varianceDirection);
      
      

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('confidence.meanCI')} style={{ backgroundColor: '#49483e' }}>
          <div style={{ marginBottom: '16px' }}>
            {renderConfidenceLevelSelector()}
          </div>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.sampleMean')}</Text>}
                value={basicCI?.mean?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.standardError')}</Text>}
                value={basicCI?.standardError?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.confidenceLevel')}</Text>}
                value={`${(currentLevel * 100).toFixed(useCustomLevel ? 2 : 0)}%`}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
          </Row>
          <Divider />
          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.meanCI95', { level: (currentLevel * 100).toFixed(useCustomLevel ? 2 : 0) })}:
                </Text>
                <Tag color="blue" style={{ fontSize: '14px' }}>
                  [{basicCI?.interval?.lower?.toFixed(4) || '0.0000'},
                  {basicCI?.interval?.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Space>
            }
            type="info"
            showIcon
            style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
          />
          
          {/* 边界值概率分析 */}
          <Divider />
          <div style={{ marginTop: '16px' }}>
            <Title level={5} style={{ color: '#f8f8f2', marginBottom: '12px' }}>
              {t('confidence.boundaryAnalysis')}
            </Title>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} md={16}>
                <Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>
                  {t('confidence.boundaryValue')}:
                </Text>
                <InputNumber
                  value={boundaryValue}
                  onChange={(value) => setBoundaryValue(value ?? boundaryValue)}
                  placeholder={t('confidence.boundaryPlaceholder')}
                  style={{ width: '100%' }}
                  precision={4}
                />
              </Col>
              <Col xs={24} md={8}>
                <Button
                  onClick={() => setBoundaryValue(basicCI?.mean ?? boundaryValue)}
                  style={{ marginTop: '29px', width: '100%' }}
                >
                  {t('confidence.useSampleMean')}
                </Button>
              </Col>
            </Row>
            
            {probabilityResult && (
              <Card
                style={{
                  backgroundColor: '#2f2e27',
                  border: '1px solid #49483e',
                  marginTop: '16px'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>
                      {t('confidence.probabilityResults')}:
                    </Text>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Statistic
                          title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.probGreaterThan')}</Text>}
                          value={(probabilityResult.probabilityGreater * 100).toFixed(2)}
                          suffix="%"
                          valueStyle={{ color: '#a6e22e', fontSize: '18px' }}
                        />
                        <Text style={{ color: '#75715e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          P(μ &gt; {boundaryValue?.toFixed(4)})
                        </Text>
                      </Col>
                      <Col xs={24} md={12}>
                        <Statistic
                          title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.probLessThan')}</Text>}
                          value={(probabilityResult.probabilityLess * 100).toFixed(2)}
                          suffix="%"
                          valueStyle={{ color: '#f92672', fontSize: '18px' }}
                        />
                        <Text style={{ color: '#75715e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          P(μ &lt; {boundaryValue?.toFixed(4)})
                        </Text>
                      </Col>
                    </Row>
                  </div>
                  <Divider style={{ borderColor: '#49483e', margin: '8px 0' }} />
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.zScore')}:</Text>
                      <Text style={{ color: '#66d9ef', fontSize: '14px', display: 'block', marginTop: '4px' }}>
                        {probabilityResult.zScore}
                      </Text>
                    </Col>
                    <Col xs={24} md={8}>
                      <Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.method')}:</Text>
                      <Tag color={probabilityResult.method === 'z' ? 'blue' : 'purple'} style={{ marginTop: '4px' }}>
                        {probabilityResult.method === 'z' ? 'Z-test' : 'T-test'}
                      </Tag>
                    </Col>
                    <Col xs={24} md={8}>
                      <Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.boundaryPosition')}:</Text>
                      <Text style={{ color: '#fd971f', fontSize: '14px', display: 'block', marginTop: '4px' }}>
                        {boundaryValue! < basicCI.interval.lower
                          ? t('confidence.belowCI')
                          : boundaryValue! > basicCI.interval.upper
                          ? t('confidence.aboveCI')
                          : t('confidence.withinCI')}
                      </Text>
                    </Col>
                  </Row>
                </Space>
              </Card>
            )}
          </div>
        </Card>

        <Card title={t('confidence.varianceCI')} style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.sampleVariance')}</Text>}
                value={varianceCI.variance?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#f92672', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.degreesOfFreedom')}</Text>}
                value={varianceCI.degreesOfFreedom || 0}
                valueStyle={{ color: '#ae81ff', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.confidenceLevel')}</Text>}
                value={`${(currentLevel * 100).toFixed(useCustomLevel ? 2 : 0)}%`}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
          </Row>
          <Divider />
          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.varianceCI95', { level: (currentLevel * 100).toFixed(useCustomLevel ? 2 : 0) })}:
                </Text>
                <Tag color="purple" style={{ fontSize: '14px' }}>
                  [{varianceCI.interval.lower?.toFixed(4) || '0.0000'},
                  {varianceCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Space>
            }
            type="info"
            showIcon
            style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
          />
        </Card>

          <Card title="均值概率计算" style={{ backgroundColor: '#49483e' }}>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>边界值:</Typography.Text>
                <InputNumber
                  value={meanBoundary}
                  onChange={(value) => setMeanBoundary(value || 0)}
                  style={{ width: '100%' }}
                  precision={4}
                />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>方向:</Typography.Text>
                <Select
                  value={meanDirection}
                  onChange={(value) => setMeanDirection(value)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="less">小于</Select.Option>
                  <Select.Option value="greater">大于</Select.Option>
                  <Select.Option value="two-sided">双侧</Select.Option>
                </Select>
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={<Typography.Text style={{ color: '#90908a', fontSize: '12px' }}>概率值</Typography.Text>}
                  value={(meanProb.probability * 100).toFixed(4)}
                  suffix="%"
                  valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
                />
              </Col>
            </Row>
            <Alert
              message={
                <Space direction="vertical">
                  <Typography.Text style={{ color: '#f8f8f2' }}>
                    {meanDirection === 'less' ? '均值小于' : meanDirection === 'greater' ? '均值大于' : '均值不等于'} {meanBoundary} 的概率:
                  </Typography.Text>
                  <Tag color="green" style={{ fontSize: '14px' }}>
                    {meanProb.probability.toFixed(6)} ({(meanProb.probability * 100).toFixed(4)}%)
                  </Tag>
                  <Typography.Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                    使用 {meanProb.method.toUpperCase()} 方法, {meanProb.method.toUpperCase()}分数: {(meanProb.method === 'z' ? meanProb.zScore : meanProb.tScore)?.toFixed(4)}
                    {meanProb.method === 't' && meanProb.degreesOfFreedom && `, 自由度: ${meanProb.degreesOfFreedom}`}
                  </Typography.Text>
                </Space>
              }
              type="info"
              showIcon
              style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
            />
          </Card>

          <Card title="方差概率计算" style={{ backgroundColor: '#49483e' }}>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>边界值:</Typography.Text>
                <InputNumber
                  value={varianceBoundary}
                  onChange={(value) => setVarianceBoundary(value || 1)}
                  style={{ width: '100%' }}
                  precision={4}
                  min={0.0001}
                />
              </Col>
              <Col xs={24} md={8}>
                <Typography.Text style={{ color: '#90908a', display: 'block', marginBottom: '8px' }}>方向:</Typography.Text>
                <Select
                  value={varianceDirection}
                  onChange={(value) => setVarianceDirection(value)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="less">小于</Select.Option>
                  <Select.Option value="greater">大于</Select.Option>
                </Select>
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={<Typography.Text style={{ color: '#90908a', fontSize: '12px' }}>概率值</Typography.Text>}
                  value={(varianceProb.probability * 100).toFixed(4)}
                  suffix="%"
                  valueStyle={{ color: '#f92672', fontSize: '16px' }}
                />
              </Col>
            </Row>
            <Alert
              message={
                <Space direction="vertical">
                  <Typography.Text style={{ color: '#f8f8f2' }}>
                    方差{varianceDirection === 'less' ? '小于' : '大于'} {varianceBoundary} 的概率:
                  </Typography.Text>
                  <Tag color="red" style={{ fontSize: '14px' }}>
                    {varianceProb.probability.toFixed(6)} ({(varianceProb.probability * 100).toFixed(4)}%)
                  </Tag>
                  <Typography.Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                    自由度: {varianceProb.degreesOfFreedom}, 卡方统计量: {varianceProb.chiSquare.toFixed(4)}
                  </Typography.Text>
                </Space>
              }
              type="info"
              showIcon
              style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
            />
          </Card>

          {/* 通过概率值求均值边界值 */}
          <ProbabilityBoundaryCard
            title="概率求均值边界值"
            data={data}
            probability={meanProbabilityForBoundary}
            setProbability={setMeanProbabilityForBoundary}
            direction={meanDirectionForBoundary}
            setDirection={setMeanDirectionForBoundary}
            calculateFunction={calculateMeanBoundary}
            resultConfig={{
              singleColor: 'green',
              upperColor: 'blue',
              lowerColor: 'blue',
              resultType: 'mean'
            }}
          />

          {/* 通过概率值求方差边界值 */}
          <ProbabilityBoundaryCard
            title="概率求方差边界值"
            data={data}
            probability={varianceProbabilityForBoundary}
            setProbability={setVarianceProbabilityForBoundary}
            direction={varianceDirectionForBoundary}
            setDirection={setVarianceDirectionForBoundary}
            calculateFunction={calculateVarianceBoundary}
            resultConfig={{
              singleColor: 'red',
              upperColor: 'purple',
              lowerColor: 'purple',
              resultType: 'variance'
            }}
          />
        </Space>
      );
  };

  const renderTwoSampleCI = () => {
    const secondData = generateSecondDataset(data.length);
    const twoSampleCI = calculateTwoSampleMeanCI(data, secondData, getCurrentConfidenceLevel(), equalVariance);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('confidence.twoSampleMeanDiff')} style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={12}>
              <Text style={{ color: '#90908a' }}>{t('confidence.equalVariance')}</Text>
              <Select
                value={equalVariance}
                onChange={setEqualVariance}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={true}>{t('confidence.assumeEqual')}</Option>
                <Option value={false}>{t('confidence.assumeUnequal')}</Option>
              </Select>
            </Col>
            <Col xs={24} md={12}>
              {renderConfidenceLevelSelector()}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.sample1Mean')}</Text>}
                value={twoSampleCI.mean1?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#66d9ef', fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.sample2Mean')}</Text>}
                value={twoSampleCI.mean2?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#fd971f', fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.meanDiff')}</Text>}
                value={twoSampleCI.meanDiff?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#f92672', fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.degreesOfFreedom')}</Text>}
                value={Math.round(twoSampleCI.degreesOfFreedom || 0)}
                valueStyle={{ color: '#ae81ff', fontSize: '14px' }}
              />
            </Col>
          </Row>

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.meanDiffCI', { 
                    level: (currentLevel * 100).toFixed(useCustomLevel ? 2 : 0),
                    method: twoSampleCI.method 
                  })}:
                </Text>
                <Tag color="green" style={{ fontSize: '14px' }}>
                  [{twoSampleCI.interval.lower?.toFixed(4) || '0.0000'},
                  {twoSampleCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  {t('confidence.sampleSize', { n1: twoSampleCI.sampleSize1, n2: twoSampleCI.sampleSize2 })}
                </Text>
              </Space>
            }
            type="success"
            showIcon
            style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
          />
        </Card>
      </Space>
    );
  };

  const renderPairedCI = () => {
    const secondData = generateSecondDataset(data.length);
    const currentLevel = getCurrentConfidenceLevel();
    let pairedCI;

    try {
      pairedCI = calculatePairedMeanCI(data, secondData, currentLevel);
    } catch (error) {
      return (
        <Alert
          message={t('confidence.pairedError')}
          description={t('confidence.pairedErrorDesc')}
          type="error"
          showIcon
          style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
        />
      );
    }

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('confidence.pairedMeanDiff')} style={{ backgroundColor: '#49483e' }}>
          <div style={{ marginBottom: '16px' }}>
            {renderConfidenceLevelSelector()}
          </div>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.diffMean')}</Text>}
                value={pairedCI.meanDiff?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.standardError')}</Text>}
                value={pairedCI.standardError?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.degreesOfFreedom')}</Text>}
                value={pairedCI.degreesOfFreedom || 0}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.confidenceLevel')}</Text>}
                value={`${(currentLevel * 100).toFixed(useCustomLevel ? 2 : 0)}%`}
                valueStyle={{ color: '#f92672', fontSize: '16px' }}
              />
            </Col>
          </Row>

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.pairedDiffCI', { level: (currentLevel * 100).toFixed(useCustomLevel ? 2 : 0) })}:
                </Text>
                <Tag color="cyan" style={{ fontSize: '14px' }}>
                  [{pairedCI.interval.lower?.toFixed(4) || '0.0000'},
                  {pairedCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  {t('confidence.pairedCount', { n: pairedCI.sampleSize })}
                </Text>
              </Space>
            }
            type="info"
            showIcon
            style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
          />
        </Card>
      </Space>
    );
  };

  const renderProportionCI = () => {
    const successCount = Math.round(data.filter(x => x > analysisResult.mean).length);
    const totalCount = data.length;
    const mockSuccess2 = Math.round(totalCount * 0.4);
    const currentLevel = getCurrentConfidenceLevel();
    const proportionCI = calculateTwoProportionCI(successCount, totalCount, mockSuccess2, totalCount, currentLevel);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('confidence.twoProportionDiff')} style={{ backgroundColor: '#49483e' }}>
          <div style={{ marginBottom: '16px' }}>
            {renderConfidenceLevelSelector()}
          </div>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.proportion1')}</Text>}
                value={`${proportionCI.proportion1?.toFixed(4) || '0.0000'}`}
                suffix={<Text style={{ color: '#75715e' }}>({proportionCI.success1}/{proportionCI.sampleSize1})</Text>}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.proportion2')}</Text>}
                value={`${proportionCI.proportion2?.toFixed(4) || '0.0000'}`}
                suffix={<Text style={{ color: '#75715e' }}>({proportionCI.success2}/{proportionCI.sampleSize2})</Text>}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.proportionDiff')}</Text>}
                value={proportionCI.proportionDiff?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#f92672', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('confidence.confidenceLevel')}</Text>}
                value={`${(currentLevel * 100).toFixed(useCustomLevel ? 2 : 0)}%`}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
          </Row>

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.proportionDiffCI', { level: (currentLevel * 100).toFixed(useCustomLevel ? 2 : 0) })}:
                </Text>
                <Tag color="orange" style={{ fontSize: '14px' }}>
                  [{proportionCI.interval.lower?.toFixed(4) || '0.0000'},
                  {proportionCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Space>
            }
            type="warning"
            showIcon
            style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
          />
        </Card>
      </Space>
    );
  };

  return (
    <Card
      title={
        <Space>
          <CalculatorOutlined style={{ color: '#a6e22e' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            {t('confidence.title')}
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab={t('confidence.singleSample')} key="mean">
          {renderOneSampleCI()}
        </TabPane>

        <TabPane tab={t('confidence.twoSampleMean')} key="two-sample-mean">
          {renderTwoSampleCI()}
        </TabPane>

        <TabPane tab={t('confidence.pairedSample')} key="paired">
          {renderPairedCI()}
        </TabPane>

        <TabPane tab={t('confidence.proportion')} key="proportion">
          {renderProportionCI()}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ConfidenceIntervals;
