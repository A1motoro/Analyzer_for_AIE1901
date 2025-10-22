import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, InputNumber, Alert, Tabs, Divider, Tag } from 'antd';
import {
  BarChartOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import {
  calculateTwoSampleMeanCI,
  calculatePairedMeanCI,
  calculateTwoProportionCI,
  calculateVarianceCI
} from '../utils';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface ConfidenceIntervalsProps {
  data: number[];
  analysisResult: any;
}

const ConfidenceIntervals: React.FC<ConfidenceIntervalsProps> = ({ data, analysisResult }) => {
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
    const basicCI = analysisResult.confidenceInterval;
    const varianceCI = calculateVarianceCI(data, confidenceLevel);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="均值置信区间" style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>样本均值</Text>}
                value={basicCI?.mean?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>标准误差</Text>}
                value={basicCI?.standardError?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>置信水平</Text>}
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
                  均值 {basicCI?.confidenceLevel ? (basicCI.confidenceLevel * 100).toFixed(0) : '95'}% 置信区间:
                </Text>
                <Tag color="blue" style={{ fontSize: '14px' }}>
                  [{basicCI?.interval?.lower?.toFixed(4) || '0.0000'},
                  {basicCI?.interval?.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Space>
            }
            type="info"
            showIcon
          />
        </Card>

        <Card title="方差置信区间" style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>样本方差</Text>}
                value={varianceCI.variance?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#f92672', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>自由度</Text>}
                value={varianceCI.degreesOfFreedom || 0}
                valueStyle={{ color: '#ae81ff', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>置信水平</Text>}
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
                  方差 {(confidenceLevel * 100).toFixed(0)}% 置信区间:
                </Text>
                <Tag color="purple" style={{ fontSize: '14px' }}>
                  [{varianceCI.interval.lower?.toFixed(4) || '0.0000'},
                  {varianceCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Space>
            }
            type="info"
            showIcon
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
        <Card title="两个样本均值之差的置信区间" style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={12}>
              <Text style={{ color: '#90908a' }}>方差是否相等:</Text>
              <Select
                value={equalVariance}
                onChange={setEqualVariance}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={true}>假设方差相等 (合并方差)</Option>
                <Option value={false}>假设方差不相等 (Welch's方法)</Option>
              </Select>
            </Col>
            <Col xs={24} md={12}>
              <Text style={{ color: '#90908a' }}>置信水平:</Text>
              <Select
                value={confidenceLevel}
                onChange={setConfidenceLevel}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={0.90}>90%</Option>
                <Option value={0.95}>95%</Option>
                <Option value={0.99}>99%</Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>样本1均值</Text>}
                value={twoSampleCI.mean1?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#66d9ef', fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>样本2均值</Text>}
                value={twoSampleCI.mean2?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#fd971f', fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>均值之差</Text>}
                value={twoSampleCI.meanDiff?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#f92672', fontSize: '14px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>自由度</Text>}
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
                  均值之差 {(confidenceLevel * 100).toFixed(0)}% 置信区间 ({twoSampleCI.method} 方法):
                </Text>
                <Tag color="green" style={{ fontSize: '14px' }}>
                  [{twoSampleCI.interval.lower?.toFixed(4) || '0.0000'},
                  {twoSampleCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  样本量: n₁ = {twoSampleCI.sampleSize1}, n₂ = {twoSampleCI.sampleSize2}
                </Text>
              </Space>
            }
            type="success"
            showIcon
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
          message="配对数据错误"
          description="配对数据必须具有相同的样本量"
          type="error"
          showIcon
        />
      );
    }

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="配对样本均值之差的置信区间" style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>差值均值</Text>}
                value={pairedCI.meanDiff?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>标准误差</Text>}
                value={pairedCI.standardError?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>自由度</Text>}
                value={pairedCI.degreesOfFreedom || 0}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>置信水平</Text>}
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
                  配对差值均值 {(confidenceLevel * 100).toFixed(0)}% 置信区间:
                </Text>
                <Tag color="cyan" style={{ fontSize: '14px' }}>
                  [{pairedCI.interval.lower?.toFixed(4) || '0.0000'},
                  {pairedCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  配对数量: n = {pairedCI.sampleSize}
                </Text>
              </Space>
            }
            type="info"
            showIcon
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
        <Card title="两个比例之差的置信区间" style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>比例1</Text>}
                value={`${proportionCI.proportion1?.toFixed(4) || '0.0000'}`}
                suffix={<Text style={{ color: '#75715e' }}>({proportionCI.success1}/{proportionCI.sampleSize1})</Text>}
                valueStyle={{ color: '#a6e22e', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>比例2</Text>}
                value={`${proportionCI.proportion2?.toFixed(4) || '0.0000'}`}
                suffix={<Text style={{ color: '#75715e' }}>({proportionCI.success2}/{proportionCI.sampleSize2})</Text>}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>比例之差</Text>}
                value={proportionCI.proportionDiff?.toFixed(4) || '0.0000'}
                valueStyle={{ color: '#f92672', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text style={{ color: '#90908a', fontSize: '12px' }}>置信水平</Text>}
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
                  比例之差 {(confidenceLevel * 100).toFixed(0)}% 置信区间:
                </Text>
                <Tag color="orange" style={{ fontSize: '14px' }}>
                  [{proportionCI.interval.lower?.toFixed(4) || '0.0000'},
                  {proportionCI.interval.upper?.toFixed(4) || '0.0000'}]
                </Tag>
              </Space>
            }
            type="warning"
            showIcon
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
            置信区间 (Confidence Intervals)
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="单样本" key="mean">
          {renderOneSampleCI()}
        </TabPane>

        <TabPane tab="两样本均值" key="two-sample-mean">
          {renderTwoSampleCI()}
        </TabPane>

        <TabPane tab="配对样本" key="paired">
          {renderPairedCI()}
        </TabPane>

        <TabPane tab="比例" key="proportion">
          {renderProportionCI()}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ConfidenceIntervals;
