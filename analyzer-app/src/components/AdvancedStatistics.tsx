import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Tooltip, Tag, Alert, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  BulbOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  ExperimentOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface AdvancedStatisticsProps {
  analysisResult: any;
}

const AdvancedStatistics: React.FC<AdvancedStatisticsProps> = ({ analysisResult }) => {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const getTooltipContent = (type: string) => {
    switch (type) {
      case 'mode':
        return t('advanced.hoverMode');
      case 'skewness':
        return t('advanced.hoverSkewness');
      case 'kurtosis':
        return t('advanced.hoverKurtosis');
      case 'distributionType':
        return t('advanced.hoverDistribution');
      case 'normality':
        return t('advanced.hoverDistribution');
      default:
        return '';
    }
  };

  const getValueColor = (type: string, value: number) => {
    switch (type) {
      case 'skewness':
        return Math.abs(value) > 0.5 ? '#f92672' : '#a6e22e';
      case 'kurtosis':
        return value > 0 ? '#fd971f' : '#66d9ef';
      default:
        return '#e6db74';
    }
  };

  const getDistributionColor = (type: string) => {
    switch (type) {
      case '近似正态':
      case 'approxNormal':
        return '#a6e22e';
      case '右偏':
      case 'leftSided':
      case '左偏':
      case 'rightSided':
        return '#fd971f';
      case '右偏厚尾':
      case 'rightSidedThickTail':
      case '左偏厚尾':
      case 'leftSidedThickTail':
        return '#f92672';
      default:
        return '#66d9ef';
    }
  };

  const distributionAnalysis = analysisResult.distributionAnalysis;

  return (
    <Card
      title={
        <Space>
          <BulbOutlined style={{ color: '#e6db74' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            {t('advanced.title')}
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        {/* 基础统计特性 */}
        <TabPane tab={t('advanced.basicStats')} key="basic">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Tooltip title={getTooltipContent('mode')} placement="top">
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: hoveredCard === 'mode' ? '#49483e' : '#49483e',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === 'mode' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: hoveredCard === 'mode' ? '0 4px 12px rgba(230, 219, 116, 0.2)' : 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCard('mode')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Statistic
                    title={
                      <Text style={{ color: '#90908a', fontSize: '14px' }}>
                        {t('advanced.mode')}
                      </Text>
                    }
                    value={analysisResult.mode?.toFixed(4) || 'N/A'}
                    valueStyle={{
                      color: '#e6db74',
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    {t('advanced.mostFrequent')}
                  </Text>
                </Card>
              </Tooltip>
            </Col>

            <Col xs={24} md={6}>
              <Tooltip title={getTooltipContent('skewness')} placement="top">
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: hoveredCard === 'skewness' ? '#49483e' : '#49483e',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === 'skewness' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: hoveredCard === 'skewness' ? '0 4px 12px rgba(249, 38, 114, 0.2)' : 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCard('skewness')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Statistic
                    title={
                      <Text style={{ color: '#90908a', fontSize: '14px' }}>
                        {t('advanced.skewness')}
                      </Text>
                    }
                    value={analysisResult.skewness?.toFixed(4) || '0.0000'}
                    valueStyle={{
                      color: getValueColor('skewness', analysisResult.skewness || 0),
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    {Math.abs(analysisResult.skewness || 0) > 0.5 ? t('advanced.asymmetric') : t('advanced.symmetric')}
                  </Text>
                </Card>
              </Tooltip>
            </Col>

            <Col xs={24} md={6}>
              <Tooltip title={getTooltipContent('kurtosis')} placement="top">
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: hoveredCard === 'kurtosis' ? '#49483e' : '#49483e',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === 'kurtosis' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: hoveredCard === 'kurtosis' ? '0 4px 12px rgba(102, 217, 239, 0.2)' : 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCard('kurtosis')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Statistic
                    title={
                      <Text style={{ color: '#90908a', fontSize: '14px' }}>
                        {t('advanced.kurtosis')}
                      </Text>
                    }
                    value={analysisResult.kurtosis?.toFixed(4) || '0.0000'}
                    valueStyle={{
                      color: getValueColor('kurtosis', analysisResult.kurtosis || 0),
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    {(analysisResult.kurtosis || 0) > 0 ? t('advanced.thickTail') : t('advanced.thinTail')}
                  </Text>
                </Card>
              </Tooltip>
            </Col>

            <Col xs={24} md={6}>
              <Tooltip title={getTooltipContent('distributionType')} placement="top">
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: hoveredCard === 'distributionType' ? '#49483e' : '#49483e',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === 'distributionType' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: hoveredCard === 'distributionType' ? '0 4px 12px rgba(166, 226, 46, 0.2)' : 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCard('distributionType')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Statistic
                    title={
                      <Text style={{ color: '#90908a', fontSize: '14px' }}>
                        {t('advanced.distributionType')}
                      </Text>
                    }
                    value={distributionAnalysis?.distributionType || t('advanced.unknown')}
                    valueStyle={{
                      color: getDistributionColor(distributionAnalysis?.distributionType || t('advanced.unknown')),
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    {t('advanced.autoDetect')}
                  </Text>
                </Card>
              </Tooltip>
            </Col>
          </Row>
        </TabPane>

        {/* 偏度和峰度检验 */}
        <TabPane tab={t('advanced.skewnessKurtosis')} key="skewness-kurtosis">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#f92672' }} />
                    <Text style={{ color: '#f8f8f2' }}>{t('advanced.skewnessTest')}</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.skewnessValue')}</Text>}
                        value={distributionAnalysis?.skewness?.value?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#f92672', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.standardError')}</Text>}
                        value={distributionAnalysis?.skewness?.standardError?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#fd971f', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.zStatistic')}</Text>}
                        value={distributionAnalysis?.skewness?.zStatistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('hypothesis.pValue')}</Text>}
                        value={distributionAnalysis?.skewness?.pValue?.toFixed(4) || '0.0000'}
                        valueStyle={{
                          color: (distributionAnalysis?.skewness?.pValue || 1) < 0.05 ? '#f92672' : '#a6e22e',
                          fontSize: '16px'
                        }}
                      />
                    </Col>
                  </Row>
                  <Alert
                    message={
                      <Space>
                        {distributionAnalysis?.skewness?.isSignificant ?
                          <CloseCircleOutlined style={{ color: '#f92672' }} /> :
                          <CheckCircleOutlined style={{ color: '#a6e22e' }} />
                        }
                        <Text style={{ color: '#f8f8f2' }}>
                          {distributionAnalysis?.skewness?.isSignificant ?
                            t('advanced.significant') :
                            t('advanced.notSignificant')
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.skewness?.isSignificant ? 'warning' : 'success'}
                    showIcon={false}
                    style={{ marginTop: '8px', backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#fd971f' }} />
                    <Text style={{ color: '#f8f8f2' }}>{t('advanced.kurtosisTest')}</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.kurtosisValue')}</Text>}
                        value={distributionAnalysis?.kurtosis?.value?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#fd971f', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.standardError')}</Text>}
                        value={distributionAnalysis?.kurtosis?.standardError?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#f92672', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.zStatistic')}</Text>}
                        value={distributionAnalysis?.kurtosis?.zStatistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('hypothesis.pValue')}</Text>}
                        value={distributionAnalysis?.kurtosis?.pValue?.toFixed(4) || '0.0000'}
                        valueStyle={{
                          color: (distributionAnalysis?.kurtosis?.pValue || 1) < 0.05 ? '#f92672' : '#a6e22e',
                          fontSize: '16px'
                        }}
                      />
                    </Col>
                  </Row>
                  <Alert
                    message={
                      <Space>
                        {distributionAnalysis?.kurtosis?.isSignificant ?
                          <CloseCircleOutlined style={{ color: '#f92672' }} /> :
                          <CheckCircleOutlined style={{ color: '#a6e22e' }} />
                        }
                        <Text style={{ color: '#f8f8f2' }}>
                          {distributionAnalysis?.kurtosis?.isSignificant ?
                            t('advanced.kurtosisSignificant') :
                            t('advanced.kurtosisNotSignificant')
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.kurtosis?.isSignificant ? 'warning' : 'success'}
                    showIcon={false}
                    style={{ marginTop: '8px', backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 正态性检验 */}
        <TabPane tab={t('advanced.normality')} key="normality">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ExperimentOutlined style={{ color: '#a6e22e' }} />
                    <Text style={{ color: '#f8f8f2' }}>{t('advanced.jarqueBera')}</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.jbStatistic')}</Text>}
                        value={distributionAnalysis?.normalityTests?.jarqueBera?.statistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('hypothesis.pValue')}</Text>}
                        value={distributionAnalysis?.normalityTests?.jarqueBera?.pValue?.toFixed(4) || '0.0000'}
                        valueStyle={{
                          color: (distributionAnalysis?.normalityTests?.jarqueBera?.pValue || 1) < 0.05 ? '#f92672' : '#a6e22e',
                          fontSize: '16px'
                        }}
                      />
                    </Col>
                  </Row>
                  <Alert
                    message={
                      <Space>
                        {distributionAnalysis?.normalityTests?.jarqueBera?.isNormal ?
                          <CheckCircleOutlined style={{ color: '#a6e22e' }} /> :
                          <CloseCircleOutlined style={{ color: '#f92672' }} />
                        }
                        <Text style={{ color: '#f8f8f2' }}>
                          {distributionAnalysis?.normalityTests?.jarqueBera?.isNormal ?
                            t('advanced.normalDist') :
                            t('advanced.notNormalDist')
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.normalityTests?.jarqueBera?.isNormal ? 'success' : 'warning'}
                    showIcon={false}
                    style={{ marginTop: '8px', backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    {t('advanced.jbDesc')}
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ExperimentOutlined style={{ color: '#66d9ef' }} />
                    <Text style={{ color: '#f8f8f2' }}>{t('advanced.shapiroWilk')}</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('advanced.wStatistic')}</Text>}
                        value={distributionAnalysis?.normalityTests?.shapiroWilk?.statistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>{t('hypothesis.pValue')}</Text>}
                        value={distributionAnalysis?.normalityTests?.shapiroWilk?.pValue?.toFixed(4) || '0.0000'}
                        valueStyle={{
                          color: (distributionAnalysis?.normalityTests?.shapiroWilk?.pValue || 1) < 0.05 ? '#f92672' : '#a6e22e',
                          fontSize: '16px'
                        }}
                      />
                    </Col>
                  </Row>
                  <Alert
                    message={
                      <Space>
                        {distributionAnalysis?.normalityTests?.shapiroWilk?.isNormal ?
                          <CheckCircleOutlined style={{ color: '#a6e22e' }} /> :
                          <CloseCircleOutlined style={{ color: '#f92672' }} />
                        }
                        <Text style={{ color: '#f8f8f2' }}>
                          {distributionAnalysis?.normalityTests?.shapiroWilk?.isNormal ?
                            t('advanced.normalDist') :
                            t('advanced.notNormalDist')
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.normalityTests?.shapiroWilk?.isNormal ? 'success' : 'warning'}
                    showIcon={false}
                    style={{ marginTop: '8px', backgroundColor: '#2f2e27', color: '#f8f8f2' }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    {t('advanced.swDesc')}
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* 置信区间 */}
          <Card
            title={t('advanced.confidenceIntervalTitle')}
            style={{ backgroundColor: '#49483e', marginTop: '16px' }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Text style={{ color: '#90908a' }}>{t('advanced.skewnessCI')} </Text>
                <Tag color="magenta">
                  [{distributionAnalysis?.confidence?.skewnessCI?.lower?.toFixed(4) || '0.0000'},
                  {distributionAnalysis?.confidence?.skewnessCI?.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Col>
              <Col xs={24} md={12}>
                <Text style={{ color: '#90908a' }}>{t('advanced.kurtosisCI')} </Text>
                <Tag color="orange">
                  [{distributionAnalysis?.confidence?.kurtosisCI?.lower?.toFixed(4) || '0.0000'},
                  {distributionAnalysis?.confidence?.kurtosisCI?.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* 动态提示区域 */}
      {hoveredCard && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#49483e',
          borderRadius: '6px',
          border: '1px solid #3e3d32',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Space>
            <QuestionCircleOutlined style={{ color: '#fd971f' }} />
            <Text style={{ color: '#f8f8f2' }}>
              {hoveredCard === 'mode' && t('advanced.hoverMode')}
              {hoveredCard === 'skewness' && t('advanced.hoverSkewness')}
              {hoveredCard === 'kurtosis' && t('advanced.hoverKurtosis')}
              {hoveredCard === 'distributionType' && t('advanced.hoverDistribution')}
            </Text>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default AdvancedStatistics;
