import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Tooltip, Tag, Alert, Tabs } from 'antd';
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const getTooltipContent = (type: string) => {
    switch (type) {
      case 'mode':
        return '数据集中出现频率最高的值';
      case 'skewness':
        return '描述分布不对称程度的指标。正值表示右偏，负值表示左偏';
      case 'kurtosis':
        return '衡量分布尾部厚度的统计量。正值表示尾部较厚';
      case 'distributionType':
        return '基于偏度和峰度自动识别的分布类型';
      case 'normality':
        return '正态性检验结果：Jarque-Bera和Shapiro-Wilk检验';
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
        return '#a6e22e';
      case '右偏':
      case '左偏':
        return '#fd971f';
      case '右偏厚尾':
      case '左偏厚尾':
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
            高级统计特性与分布分析
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        {/* 基础统计特性 */}
        <TabPane tab="基础统计" key="basic">
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
                        众数 (Mode)
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
                    最频繁出现的值
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
                        偏度 (Skewness)
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
                    {Math.abs(analysisResult.skewness || 0) > 0.5 ? '分布不对称' : '分布对称'}
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
                        峰度 (Kurtosis)
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
                    {(analysisResult.kurtosis || 0) > 0 ? '尾部较厚' : '尾部较薄'}
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
                        分布类型
                      </Text>
                    }
                    value={distributionAnalysis?.distributionType || '未知'}
                    valueStyle={{
                      color: getDistributionColor(distributionAnalysis?.distributionType || '未知'),
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    自动识别类型
                  </Text>
                </Card>
              </Tooltip>
            </Col>
          </Row>
        </TabPane>

        {/* 偏度和峰度检验 */}
        <TabPane tab="偏度峰度检验" key="skewness-kurtosis">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#f92672' }} />
                    <Text style={{ color: '#f8f8f2' }}>偏度检验 (Skewness Test)</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>偏度值</Text>}
                        value={distributionAnalysis?.skewness?.value?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#f92672', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>标准误差</Text>}
                        value={distributionAnalysis?.skewness?.standardError?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#fd971f', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>Z统计量</Text>}
                        value={distributionAnalysis?.skewness?.zStatistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>p值</Text>}
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
                            '偏度显著不为0 (p < 0.05)' :
                            '偏度不显著不为0 (p ≥ 0.05)'
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.skewness?.isSignificant ? 'warning' : 'success'}
                    showIcon={false}
                    style={{ marginTop: '8px' }}
                  />
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#fd971f' }} />
                    <Text style={{ color: '#f8f8f2' }}>峰度检验 (Kurtosis Test)</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>峰度值</Text>}
                        value={distributionAnalysis?.kurtosis?.value?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#fd971f', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>标准误差</Text>}
                        value={distributionAnalysis?.kurtosis?.standardError?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#f92672', fontSize: '16px' }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>Z统计量</Text>}
                        value={distributionAnalysis?.kurtosis?.zStatistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>p值</Text>}
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
                            '峰度显著不为0 (p < 0.05)' :
                            '峰度不显著不为0 (p ≥ 0.05)'
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.kurtosis?.isSignificant ? 'warning' : 'success'}
                    showIcon={false}
                    style={{ marginTop: '8px' }}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 正态性检验 */}
        <TabPane tab="正态性检验" key="normality">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ExperimentOutlined style={{ color: '#a6e22e' }} />
                    <Text style={{ color: '#f8f8f2' }}>Jarque-Bera检验</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>JB统计量</Text>}
                        value={distributionAnalysis?.normalityTests?.jarqueBera?.statistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>p值</Text>}
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
                            '数据服从正态分布 (p ≥ 0.05)' :
                            '数据不服从正态分布 (p < 0.05)'
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.normalityTests?.jarqueBera?.isNormal ? 'success' : 'warning'}
                    showIcon={false}
                    style={{ marginTop: '8px' }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    基于偏度和峰度的正态性检验，适用于大样本
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ExperimentOutlined style={{ color: '#66d9ef' }} />
                    <Text style={{ color: '#f8f8f2' }}>Shapiro-Wilk检验</Text>
                  </Space>
                }
                style={{ backgroundColor: '#49483e' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>W统计量</Text>}
                        value={distributionAnalysis?.normalityTests?.shapiroWilk?.statistic?.toFixed(4) || '0.0000'}
                        valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: '#90908a', fontSize: '12px' }}>p值</Text>}
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
                            '数据服从正态分布 (p ≥ 0.05)' :
                            '数据不服从正态分布 (p < 0.05)'
                          }
                        </Text>
                      </Space>
                    }
                    type={distributionAnalysis?.normalityTests?.shapiroWilk?.isNormal ? 'success' : 'warning'}
                    showIcon={false}
                    style={{ marginTop: '8px' }}
                  />
                  <Text style={{ color: '#75715e', fontSize: '12px' }}>
                    基于排序数据的正态性检验，适用于小到中等样本
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* 置信区间 */}
          <Card
            title="偏度和峰度的置信区间 (95%)"
            style={{ backgroundColor: '#49483e', marginTop: '16px' }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Text style={{ color: '#90908a' }}>偏度置信区间: </Text>
                <Tag color="magenta">
                  [{distributionAnalysis?.confidence?.skewnessCI?.lower?.toFixed(4) || '0.0000'},
                  {distributionAnalysis?.confidence?.skewnessCI?.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Col>
              <Col xs={24} md={12}>
                <Text style={{ color: '#90908a' }}>峰度置信区间: </Text>
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
              {hoveredCard === 'mode' && '众数是数据集中出现频率最高的值，可以有多个或不存在。'}
              {hoveredCard === 'skewness' && '偏度描述分布形状的倾斜程度，影响数据分析和建模。'}
              {hoveredCard === 'kurtosis' && '峰度反映分布尾部的相对陡峭程度，影响风险评估。'}
              {hoveredCard === 'distributionType' && '基于偏度和峰度自动识别的分布类型，帮助理解数据特征。'}
            </Text>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default AdvancedStatistics;
