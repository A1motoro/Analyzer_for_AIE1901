import React, { useState } from 'react';
import { Card, Row, Col, Space, Typography, Tooltip, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [hoveredConcept, setHoveredConcept] = useState<string | null>(null);
  const [activePanels, setActivePanels] = useState<string[]>([]);

  const concepts = [
    {
      key: 'mean',
      title: t('statisticsGuide.mean.title'),
      description: t('statisticsGuide.mean.description'),
      icon: <NumberOutlined />,
      color: '#66d9ef',
      details: t('statisticsGuide.mean.details'),
      formula: t('statisticsGuide.mean.formula')
    },
    {
      key: 'median',
      title: t('statisticsGuide.median.title'),
      description: t('statisticsGuide.median.description'),
      icon: <LineChartOutlined />,
      color: '#a6e22e',
      details: t('statisticsGuide.median.details'),
      formula: t('statisticsGuide.median.formula')
    },
    {
      key: 'std',
      title: t('statisticsGuide.stdDev.title'),
      description: t('statisticsGuide.stdDev.description'),
      icon: <BarChartOutlined />,
      color: '#fd971f',
      details: t('statisticsGuide.stdDev.details'),
      formula: t('statisticsGuide.stdDev.formula')
    },
    {
      key: 'variance',
      title: t('statisticsGuide.variance.title'),
      description: t('statisticsGuide.variance.description'),
      icon: <DotChartOutlined />,
      color: '#ae81ff',
      details: t('statisticsGuide.variance.details'),
      formula: t('statisticsGuide.variance.formula')
    },
    {
      key: 'mode',
      title: t('statisticsGuide.mode.title'),
      description: t('statisticsGuide.mode.description'),
      icon: <NumberOutlined />,
      color: '#e6db74',
      details: t('statisticsGuide.mode.details'),
      formula: t('statisticsGuide.mode.formula')
    },
    {
      key: 'skewness',
      title: t('statisticsGuide.skewness.title'),
      description: t('statisticsGuide.skewness.description'),
      icon: <BarChartOutlined />,
      color: '#f92672',
      details: t('statisticsGuide.skewness.details'),
      formula: t('statisticsGuide.skewness.formula')
    },
    {
      key: 'kurtosis',
      title: t('statisticsGuide.kurtosis.title'),
      description: t('statisticsGuide.kurtosis.description'),
      icon: <DotChartOutlined />,
      color: '#66d9ef',
      details: t('statisticsGuide.kurtosis.details'),
      formula: t('statisticsGuide.kurtosis.formula')
    }
  ];

  return (
    <Card
      title={
        <Space>
          <BulbOutlined style={{ color: '#fd971f' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            {t('statisticsGuide.title')}
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Paragraph style={{ color: '#90908a', marginBottom: '24px' }}>
        {t('statisticsGuide.description')}
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
                        {t('statisticsGuide.clickDetails')}
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
            {t('statisticsGuide.quickNav')}
          </Text>
          <Text style={{ color: '#90908a', fontSize: '14px' }}>
            {t('statisticsGuide.quickNavDesc')}
          </Text>
          <Space wrap style={{ marginTop: '8px' }}>
            <Tag color="blue">{t('statisticsGuide.centralTendency')}</Tag>
            <Tag color="green">{t('statisticsGuide.dispersion')}</Tag>
            <Tag color="orange">{t('statisticsGuide.distributionShape')}</Tag>
            <Tag color="purple">{t('statisticsGuide.probability')}</Tag>
          </Space>
        </Space>
      </div>
    </Card>
  );
};

export default StatisticsGuide;
