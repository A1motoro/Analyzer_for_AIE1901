import React, { useState } from 'react';
import { Card, Row, Col, Space, Typography, Tooltip, Tag } from 'antd';
import {
  BulbOutlined,
  NumberOutlined,
  LineChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface StatisticsGuideProps {}

const StatisticsGuide: React.FC<StatisticsGuideProps> = () => {
  const [hoveredConcept, setHoveredConcept] = useState<string | null>(null);
  const [activePanels, setActivePanels] = useState<string[]>([]);

  const concepts = [
    {
      key: 'mean',
      title: '均值 (Mean)',
      description: '所有数据点的算术平均值',
      icon: <NumberOutlined />,
      color: '#66d9ef',
      details: '均值是最基本的集中趋势度量，表示数据的平均水平。对于正态分布的数据，均值、中位数和众数相等。',
      formula: 'μ = (x₁ + x₂ + ... + xn) / n'
    },
    {
      key: 'median',
      title: '中位数 (Median)',
      description: '排序后位于中间位置的值',
      icon: <LineChartOutlined />,
      color: '#a6e22e',
      details: '中位数是将数据排序后位于中间的值。对异常值不敏感，比均值更能反映数据的中心位置。',
      formula: '排序后第 (n+1)/2 个值'
    },
    {
      key: 'std',
      title: '标准差 (Std Dev)',
      description: '衡量数据分散程度的统计量',
      icon: <BarChartOutlined />,
      color: '#fd971f',
      details: '标准差反映数据的变异程度。标准差越大，数据越分散；标准差越小，数据越集中。',
      formula: 'σ = √[Σ(xi - μ)² / n]'
    },
    {
      key: 'variance',
      title: '方差 (Variance)',
      description: '标准差的平方，衡量数据变异性',
      icon: <DotChartOutlined />,
      color: '#ae81ff',
      details: '方差是标准差的平方，用于度量数据的离散程度。在统计推断中有重要应用。',
      formula: 'σ² = Σ(xi - μ)² / n'
    },
    {
      key: 'mode',
      title: '众数 (Mode)',
      description: '数据集中出现频率最高的值',
      icon: <NumberOutlined />,
      color: '#e6db74',
      details: '众数是数据中最常出现的值。一个数据集可能有多个众数，也可能没有众数。',
      formula: '出现频率最高的值'
    },
    {
      key: 'skewness',
      title: '偏度 (Skewness)',
      description: '描述分布不对称程度的指标',
      icon: <BarChartOutlined />,
      color: '#f92672',
      details: '偏度衡量分布的倾斜程度。正值表示右偏（长尾在右），负值表示左偏（长尾在左）。',
      formula: '偏度 = E[(X-μ)³/σ³]'
    },
    {
      key: 'kurtosis',
      title: '峰度 (Kurtosis)',
      description: '衡量分布尾部厚度的统计量',
      icon: <DotChartOutlined />,
      color: '#66d9ef',
      details: '峰度描述分布尾部的相对陡峭程度。正值表示尾部较厚，负值表示尾部较薄。',
      formula: '峰度 = E[(X-μ)⁴/σ⁴] - 3'
    }
  ];

  return (
    <Card
      title={
        <Space>
          <BulbOutlined style={{ color: '#fd971f' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            统计概念指南
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Paragraph style={{ color: '#90908a', marginBottom: '24px' }}>
        深入理解数据分析中的核心统计概念
      </Paragraph>

      <Row gutter={[16, 16]}>
        {concepts.map((concept) => (
          <Col xs={24} md={12} key={concept.key}>
            <Tooltip
              title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{concept.title}</div>
                  <div>{concept.details}</div>
                  <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
                    {concept.formula}
                  </div>
                </div>
              }
              placement="top"
              overlayStyle={{ maxWidth: '300px' }}
            >
              <Card
                size="small"
                style={{
                  backgroundColor: hoveredConcept === concept.key ? '#49483e' : '#49483e',
                  border: hoveredConcept === concept.key ? `2px solid ${concept.color}40` : '1px solid #3e3d32',
                  transition: 'all 0.3s ease',
                  transform: hoveredConcept === concept.key ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: hoveredConcept === concept.key ? `0 4px 12px ${concept.color}20` : 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredConcept(concept.key)}
                onMouseLeave={() => setHoveredConcept(null)}
                onClick={() => {
                  const newPanels = activePanels.includes(concept.key)
                    ? activePanels.filter(p => p !== concept.key)
                    : [...activePanels, concept.key];
                  setActivePanels(newPanels);
                }}
              >
                <Space align="start" style={{ width: '100%' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: concept.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {React.cloneElement(concept.icon, { style: { color: '#272822', fontSize: '12px' } })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ color: concept.color, display: 'block' }}>
                      {concept.title}
                    </Text>
                    <Text style={{ color: '#90908a', fontSize: '12px', display: 'block', marginTop: '2px' }}>
                      {concept.description}
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag
                        style={{
                          backgroundColor: concept.color + '20',
                          color: concept.color,
                          border: `1px solid ${concept.color}40`,
                          fontSize: '12px'
                        }}
                      >
                        点击查看详情
                      </Tag>
                    </div>
                  </div>
                </Space>

                {activePanels.includes(concept.key) && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '4px',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <Space direction="vertical" size="small">
                      <Text style={{ color: '#f8f8f2', fontSize: '14px' }}>
                        {concept.details}
                      </Text>
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#49483e',
                        borderRadius: '4px',
                        border: `1px solid ${concept.color}40`
                      }}>
                        <Text style={{ color: concept.color, fontSize: '12px', fontFamily: 'monospace' }}>
                          {concept.formula}
                        </Text>
                      </div>
                    </Space>
                  </div>
                )}
              </Card>
            </Tooltip>
          </Col>
        ))}
      </Row>

      {/* 快速导航 */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#49483e', borderRadius: '6px' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong style={{ color: '#f8f8f2' }}>
            <QuestionCircleOutlined style={{ marginRight: '8px' }} />
            快速导航
          </Text>
          <Text style={{ color: '#90908a', fontSize: '14px' }}>
            点击任意概念卡片查看详细解释，或悬停查看快速提示。
            每个统计量都有其独特的数学含义和应用场景。
          </Text>
          <Space wrap style={{ marginTop: '8px' }}>
            <Tag color="blue">集中趋势</Tag>
            <Tag color="green">离散程度</Tag>
            <Tag color="orange">分布形状</Tag>
            <Tag color="purple">概率统计</Tag>
          </Space>
        </Space>
      </div>
    </Card>
  );
};

export default StatisticsGuide;
