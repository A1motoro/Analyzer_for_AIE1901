import React, { useState, useEffect, useRef } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, InputNumber, Alert, Tabs, Divider, Progress, Radio } from 'antd';
import { Chart, registerables } from 'chart.js';
import { useTranslation } from 'react-i18next';
import {
  ThunderboltOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import {
  calculatePowerOneSampleT,
  calculateSampleSizeOneSampleT,
  calculatePowerTwoSampleT,
  calculateSampleSizeTwoSampleT,
  calculatePowerProportionTest,
  calculateSampleSizeProportionTest,
  generatePowerFunctionData
} from '../utils';

// 注册Chart.js组件
Chart.register(...registerables);

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface PowerAnalysisProps {
  data: number[];
  analysisResult: any;
}

const PowerAnalysis: React.FC<PowerAnalysisProps> = ({ data }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('power');
  const [testType, setTestType] = useState('one-sample-t');
  const [effectSize, setEffectSize] = useState(0.5);
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [sampleSize, setSampleSize] = useState(data.length);
  const [alternative, setAlternative] = useState('two-sided');
  const [p0, setP0] = useState(0.5);
  const [p1, setP1] = useState(0.6);
  
  // Power function chart相关状态
  const [powerChartType, setPowerChartType] = useState<'effect-size' | 'sample-size'>('effect-size');
  const powerChartRef = useRef<HTMLCanvasElement>(null);

  const runPowerAnalysis = () => {
    let result;

    switch (testType) {
      case 'one-sample-t':
        result = calculatePowerOneSampleT(sampleSize, effectSize, alpha, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'two-sample-t':
        result = calculatePowerTwoSampleT(sampleSize, sampleSize, effectSize, alpha, true, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'proportion':
        result = calculatePowerProportionTest(sampleSize, p0, p1, alpha, alternative as 'two-sided' | 'less' | 'greater');
        break;
      default:
        return null;
    }

    return result;
  };

  const runSampleSizeCalculation = () => {
    let result;

    switch (testType) {
      case 'one-sample-t':
        result = calculateSampleSizeOneSampleT(effectSize, alpha, power, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'two-sample-t':
        result = calculateSampleSizeTwoSampleT(effectSize, alpha, power, true, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'proportion':
        result = calculateSampleSizeProportionTest(p0, p1, alpha, power, alternative as 'two-sided' | 'less' | 'greater');
        break;
      default:
        return null;
    }

    return result;
  };

  const powerResult = runPowerAnalysis();
  const sampleSizeResult = runSampleSizeCalculation();

  // 生成并绘制 Power Function 图表
  useEffect(() => {
    if (!powerChartRef.current || !powerResult) return;

    const ctx = powerChartRef.current.getContext('2d');
    if (!ctx) return;

    // 销毁现有图表
    const existingChart = Chart.getChart(powerChartRef.current);
    if (existingChart) existingChart.destroy();

    // 准备参数
    const fixedParams: any = {
      alpha,
      alternative: alternative as 'less' | 'greater' | 'two-sided'
    };

    let xRange: { min: number; max: number; steps: number };
    let xLabel: string;
    let yLabel = t('power.power');

    if (powerChartType === 'effect-size') {
      fixedParams.sampleSize = sampleSize;
      if (testType === 'proportion') {
        fixedParams.p0 = p0;
      }
      xRange = { min: 0.1, max: 2.0, steps: 50 };
      xLabel = t('power.effectSize');
    } else {
      fixedParams.effectSize = effectSize;
      if (testType === 'proportion') {
        fixedParams.p0 = p0;
        fixedParams.p1 = p1;
      }
      xRange = { min: 10, max: 200, steps: 50 };
      xLabel = t('power.sampleSize');
    }

    // 生成数据
    const chartData = generatePowerFunctionData(
      testType as 'one-sample-t' | 'two-sample-t' | 'proportion',
      powerChartType,
      fixedParams,
      xRange
    );

    // 创建图表
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(d => d.x.toFixed(2)),
        datasets: [{
          label: yLabel,
          data: chartData.map(d => d.y),
          borderColor: '#f92672',
          backgroundColor: 'rgba(249, 38, 114, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#f92672',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5
          }
        },
        resizeDelay: 0,
        plugins: {
            title: {
              display: true,
              text: powerChartType === 'effect-size' 
                ? t('power.powerVsEffectSize')
                : t('power.powerVsSampleSize'),
              color: '#f8f8f2',
              font: { size: 14, weight: 'bold' },
              padding: {
                top: 10,
                bottom: 15
              }
            },
          legend: {
            display: true,
            labels: {
              color: '#f8f8f2'
            }
          },
          tooltip: {
            backgroundColor: '#2f2e27',
            titleColor: '#f8f8f2',
            bodyColor: '#f8f8f2',
            borderColor: '#49483e',
            borderWidth: 1,
            callbacks: {
              title: (tooltipItems) => {
                const value = parseFloat(tooltipItems[0].label);
                return `${xLabel}: ${value.toFixed(3)}`;
              },
              label: (context) => {
                const powerValue = context.parsed.y;
                if (powerValue === null || powerValue === undefined) {
                  return `${yLabel}: N/A`;
                }
                return `${yLabel}: ${(powerValue * 100).toFixed(2)}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            title: {
              display: true,
              text: yLabel,
              color: '#f8f8f2'
            },
            ticks: {
              color: '#90908a',
              callback: function(value) {
                return ((value as number) * 100).toFixed(0) + '%';
              }
            },
            grid: {
              color: '#49483e'
            }
          },
          x: {
            title: {
              display: true,
              text: xLabel,
              color: '#f8f8f2',
              font: {
                size: 12
              }
            },
            ticks: {
              color: '#90908a',
              maxTicksLimit: 10,
              maxRotation: 45,
              minRotation: 0
            },
            grid: {
              color: '#49483e'
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }, [powerChartType, testType, effectSize, alpha, sampleSize, alternative, p0, p1, powerResult, t]);

  const getAlternativeText = (alt: string) => {
    switch (alt) {
      case 'less': return t('hypothesisAlt.leftSided');
      case 'greater': return t('hypothesisAlt.rightSided');
      default: return t('hypothesisAlt.twoSided');
    }
  };

  const renderPowerAnalysis = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 参数设置 */}
      <Card title={t('power.testParams')} style={{ backgroundColor: '#49483e' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.testType')}</Text>
            <Select
              value={testType}
              onChange={setTestType}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="one-sample-t">{t('power.oneSampleT')}</Option>
              <Option value="two-sample-t">{t('power.twoSampleT')}</Option>
              <Option value="proportion">{t('power.proportionTest')}</Option>
            </Select>
          </Col>

          {testType === 'proportion' ? (
            <>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>{t('power.nullProp')}</Text>
                <InputNumber
                  value={p0}
                  onChange={(value) => setP0(value || 0.5)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>{t('power.altProp')}</Text>
                <InputNumber
                  value={p1}
                  onChange={(value) => setP1(value || 0.6)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
            </>
          ) : (
            <Col xs={24} md={6}>
              <Text style={{ color: '#c8c8c2' }}>{t('power.effectSize')}</Text>
              <InputNumber
                value={effectSize}
                onChange={(value) => setEffectSize(value || 0.5)}
                min={0.01}
                step={0.1}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </Col>
          )}

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.significanceLevel')}</Text>
            <Select
              value={alpha}
              onChange={setAlpha}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value={0.01}>0.01</Option>
              <Option value={0.05}>0.05</Option>
              <Option value={0.10}>0.10</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.sampleSize')}</Text>
            <InputNumber
              value={sampleSize}
              onChange={(value) => setSampleSize(value || 30)}
              min={2}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.alternative')}</Text>
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

      {/* 功效分析结果 */}
      {powerResult && (
        <Card title={t('power.powerResults')} style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.testPower')}</Text>}
                value={`${(powerResult.power * 100).toFixed(2)}%`}
                valueStyle={{
                  color: powerResult.power > 0.8 ? '#a6e22e' : powerResult.power > 0.6 ? '#fd971f' : '#f92672',
                  fontSize: '20px'
                }}
              />
              <Progress
                percent={powerResult.power * 100}
                status={powerResult.power > 0.8 ? 'success' : powerResult.power > 0.6 ? 'active' : 'exception'}
                strokeColor={powerResult.power > 0.8 ? '#a6e22e' : powerResult.power > 0.6 ? '#fd971f' : '#f92672'}
                style={{ marginTop: '8px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.effectSizeValue')}</Text>}
                value={powerResult.effectSize?.toFixed(3) || 'N/A'}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.nonCentralParam')}</Text>}
                value={powerResult.nonCentralityParameter?.toFixed(3) || 'N/A'}
                valueStyle={{ color: '#ae81ff', fontSize: '16px' }}
              />
            </Col>
          </Row>

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('power.powerAnalysisResult')}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • {t('power.currentPower', { power: (powerResult.power * 100).toFixed(2) })}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • {t('power.rejectProb', { power: (powerResult.power * 100).toFixed(2) })}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • {t('power.powerDesc', { alpha, alt: getAlternativeText(alternative) })}
                </Text>
              </Space>
            }
            type={powerResult.power > 0.8 ? 'success' : powerResult.power > 0.6 ? 'warning' : 'error'}
            showIcon
            style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
          />

          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#2f2e27', borderRadius: '6px' }}>
            <Text strong style={{ color: '#f8f8f2' }}>{t('power.powerExplanation')}</Text>
            <br />
            <Text style={{ color: '#c8c8c2', fontSize: '12px' }}>
              • {t('power.highPower')}
              <br />
              • {t('power.mediumPower')}
              <br />
              • {t('power.lowPower')}
            </Text>
          </div>
        </Card>
      )}

      {/* Power Function 图表 */}
      {powerResult && (
        <Card 
          title={
            <Space>
              <LineChartOutlined style={{ color: '#f92672' }} />
              <Text style={{ color: '#f8f8f2' }}>{t('power.powerFunction')}</Text>
            </Space>
          }
          style={{ backgroundColor: '#49483e' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message={
                <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>
                  {t('power.powerFunctionDesc')}
                </Text>
              }
              type="info"
              showIcon
              style={{ backgroundColor: '#2f2e27', borderColor: '#49483e' }}
            />

            {/* 图表类型选择 */}
            <Radio.Group
              value={powerChartType}
              onChange={(e) => setPowerChartType(e.target.value)}
              style={{ width: '100%' }}
            >
              <Radio.Button value="effect-size" style={{ color: '#f8f8f2' }}>
                {t('power.powerVsEffectSize')}
              </Radio.Button>
              <Radio.Button value="sample-size" style={{ color: '#f8f8f2' }}>
                {t('power.powerVsSampleSize')}
              </Radio.Button>
            </Radio.Group>

            {/* 图表容器 */}
            <div
              style={{
                backgroundColor: '#1e1e1e',
                width: '100%',
                height: '400px',
                padding: '16px',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <canvas ref={powerChartRef} />
              </div>
            </div>

            {/* 图表说明 */}
            <div style={{ padding: '12px', backgroundColor: '#2f2e27', borderRadius: '6px' }}>
              <Text strong style={{ color: '#f8f8f2' }}>{t('power.powerFunctionNotes')}</Text>
              <br />
              <Text style={{ color: '#c8c8c2', fontSize: '12px' }}>
                • {powerChartType === 'effect-size' 
                  ? t('power.effectSizeNote')
                  : t('power.sampleSizeNote')}
                <br />
                • {t('power.powerFunctionNote2')}
                <br />
                • {t('power.powerFunctionNote3')}
              </Text>
            </div>
          </Space>
        </Card>
      )}
    </Space>
  );

  const renderSampleSizeCalculation = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 参数设置 */}
      <Card title={t('power.sampleSizeParams')} style={{ backgroundColor: '#49483e' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.testType')}</Text>
            <Select
              value={testType}
              onChange={setTestType}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="one-sample-t">{t('power.oneSampleT')}</Option>
              <Option value="two-sample-t">{t('power.twoSampleT')}</Option>
              <Option value="proportion">{t('power.proportionTest')}</Option>
            </Select>
          </Col>

          {testType === 'proportion' ? (
            <>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>{t('power.nullProp')}</Text>
                <InputNumber
                  value={p0}
                  onChange={(value) => setP0(value || 0.5)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>{t('power.altProp')}</Text>
                <InputNumber
                  value={p1}
                  onChange={(value) => setP1(value || 0.6)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
            </>
          ) : (
            <Col xs={24} md={6}>
              <Text style={{ color: '#c8c8c2' }}>{t('power.effectSize')}</Text>
              <InputNumber
                value={effectSize}
                onChange={(value) => setEffectSize(value || 0.5)}
                min={0.01}
                step={0.1}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </Col>
          )}

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.significanceLevel')}</Text>
            <Select
              value={alpha}
              onChange={setAlpha}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value={0.01}>0.01</Option>
              <Option value={0.05}>0.05</Option>
              <Option value={0.10}>0.10</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.targetPower')}</Text>
            <Select
              value={power}
              onChange={setPower}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value={0.8}>0.80 (80%)</Option>
              <Option value={0.9}>0.90 (90%)</Option>
              <Option value={0.95}>0.95 (95%)</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>{t('power.alternative')}</Text>
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

      {/* 样本大小计算结果 */}
      {sampleSizeResult && (
        <Card title={t('power.sampleSizeResult')} style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.requiredSampleSize')}</Text>}
                value={'sampleSize' in sampleSizeResult ? sampleSizeResult.sampleSize : sampleSizeResult.sampleSizePerGroup}
                valueStyle={{ color: '#a6e22e', fontSize: '24px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.effectSizeValue')}</Text>}
                value={sampleSizeResult.effectSize?.toFixed(3) || 'N/A'}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.targetPower')}</Text>}
                value={`${(sampleSizeResult.power * 100).toFixed(0)}%`}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
          </Row>

          {'totalSampleSize' in sampleSizeResult && sampleSizeResult.totalSampleSize && (
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} md={12}>
                <Statistic
                  title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.sampleSizePerGroup')}</Text>}
                  value={'sampleSizePerGroup' in sampleSizeResult ? sampleSizeResult.sampleSizePerGroup : 'N/A'}
                  valueStyle={{ color: '#ae81ff', fontSize: '18px' }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Statistic
                  title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>{t('power.totalSampleSize')}</Text>}
                  value={'totalSampleSize' in sampleSizeResult ? sampleSizeResult.totalSampleSize : 'N/A'}
                  valueStyle={{ color: '#f92672', fontSize: '18px' }}
                />
              </Col>
            </Row>
          )}

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('power.sampleSizeResultDesc')}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • {t('power.reachPower', { power: (sampleSizeResult.power * 100).toFixed(0), alpha })}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • {t('power.detectEffect', { effect: sampleSizeResult.effectSize?.toFixed(3) || 'N/A' })}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • {t('power.minSampleSize', { size: 'sampleSize' in sampleSizeResult ? sampleSizeResult.sampleSize : sampleSizeResult.sampleSizePerGroup })}
                </Text>
              </Space>
            }
            type="info"
            showIcon
            style={{ backgroundColor: '#2f2e27', color: '#f8f8f2' }}
          />

          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#2f2e27', borderRadius: '6px' }}>
            <Text strong style={{ color: '#f8f8f2' }}>{t('power.sampleSizeExplanation')}</Text>
            <br />
            <Text style={{ color: '#c8c8c2', fontSize: '12px' }}>
              • {t('power.sampleSizeTip1')}
              <br />
              • {t('power.sampleSizeTip2')}
              <br />
              • {t('power.sampleSizeTip3')}
              <br />
              • {t('power.sampleSizeTip4')}
            </Text>
          </div>
        </Card>
      )}
    </Space>
  );

  return (
    <Card
      title={
        <Space>
          <ThunderboltOutlined style={{ color: '#a6e22e' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            {t('power.title')}
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab={t('power.powerAnalysis')} key="power">
          {renderPowerAnalysis()}
        </TabPane>

        <TabPane tab={t('power.sampleSizeCalc')} key="sample-size">
          {renderSampleSizeCalculation()}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default PowerAnalysis;
