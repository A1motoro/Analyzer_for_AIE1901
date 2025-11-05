import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, Alert, Tabs, Divider, Tag } from 'antd';
import {
  CalculatorOutlined
} from '@ant-design/icons';
import {
  calculateTwoSampleMeanCI,
  calculatePairedMeanCI,
  calculateTwoProportionCI,
  calculateVarianceCI,
  calculateConfidenceInterval
} from '../utils';
import { useTranslation } from 'react-i18next';

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
  const [equalVariance, setEqualVariance] = useState(true);

  // 生成第二个数据集用于演示（在实际应用中应该让用户输入）
  const generateSecondDataset = (size: number) => {
    const mean = analysisResult.mean || 0;
    const std = analysisResult.stdDev || 1;
    return Array.from({ length: size }, () => mean + (Math.random() - 0.5) * 2 * std + (Math.random() > 0.5 ? 5 : -5));
  };

  const renderOneSampleCI = () => {
    // 使用自定义置信水平重新计算均值置信区间
    const basicCI = calculateConfidenceInterval(data, confidenceLevel);
    const varianceCI = calculateVarianceCI(data, confidenceLevel);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('confidence.meanCI')} style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={12}>
              <Text style={{ color: '#90908a' }}>{t('confidence.confidenceLevel')}:</Text>
              <Select
                value={confidenceLevel}
                onChange={setConfidenceLevel}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={0.80}>80%</Option>
                <Option value={0.90}>90%</Option>
                <Option value={0.95}>95%</Option>
                <Option value={0.99}>99%</Option>
                <Option value={0.999}>99.9%</Option>
              </Select>
            </Col>
          </Row>
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
                value={`${(confidenceLevel * 100).toFixed(0)}%`}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
          </Row>
          <Divider />
          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.meanCI95', { level: (confidenceLevel * 100).toFixed(0) })}:
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
                value={`${(confidenceLevel * 100).toFixed(0)}%`}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
          </Row>
          <Divider />
          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.varianceCI95', { level: (confidenceLevel * 100).toFixed(0) })}:
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
      </Space>
    );
  };

  const renderTwoSampleCI = () => {
    const secondData = generateSecondDataset(data.length);
    const twoSampleCI = calculateTwoSampleMeanCI(data, secondData, confidenceLevel, equalVariance);

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
              <Text style={{ color: '#90908a' }}>{t('confidence.confidenceLevel')}:</Text>
              <Select
                value={confidenceLevel}
                onChange={setConfidenceLevel}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={0.80}>80%</Option>
                <Option value={0.90}>90%</Option>
                <Option value={0.95}>95%</Option>
                <Option value={0.99}>99%</Option>
                <Option value={0.999}>99.9%</Option>
              </Select>
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
                    level: (confidenceLevel * 100).toFixed(0),
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
    let pairedCI;

    try {
      pairedCI = calculatePairedMeanCI(data, secondData, confidenceLevel);
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
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={12}>
              <Text style={{ color: '#90908a' }}>{t('confidence.confidenceLevel')}:</Text>
              <Select
                value={confidenceLevel}
                onChange={setConfidenceLevel}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={0.80}>80%</Option>
                <Option value={0.90}>90%</Option>
                <Option value={0.95}>95%</Option>
                <Option value={0.99}>99%</Option>
                <Option value={0.999}>99.9%</Option>
              </Select>
            </Col>
          </Row>
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
                value={`${(confidenceLevel * 100).toFixed(0)}%`}
                valueStyle={{ color: '#f92672', fontSize: '16px' }}
              />
            </Col>
          </Row>

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.pairedDiffCI', { level: (confidenceLevel * 100).toFixed(0) })}:
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
    const proportionCI = calculateTwoProportionCI(successCount, totalCount, mockSuccess2, totalCount, confidenceLevel);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('confidence.twoProportionDiff')} style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={12}>
              <Text style={{ color: '#90908a' }}>{t('confidence.confidenceLevel')}:</Text>
              <Select
                value={confidenceLevel}
                onChange={setConfidenceLevel}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={0.80}>80%</Option>
                <Option value={0.90}>90%</Option>
                <Option value={0.95}>95%</Option>
                <Option value={0.99}>99%</Option>
                <Option value={0.999}>99.9%</Option>
              </Select>
            </Col>
          </Row>
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
                value={`${(confidenceLevel * 100).toFixed(0)}%`}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
          </Row>

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  {t('confidence.proportionDiffCI', { level: (confidenceLevel * 100).toFixed(0) })}:
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
