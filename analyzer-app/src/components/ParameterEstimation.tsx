import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Space, Typography, Table, Tooltip, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ExperimentOutlined,
  CalculatorOutlined,
  BarChartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ParameterEstimationProps {
  analysisResult: any;
}

const ParameterEstimation: React.FC<ParameterEstimationProps> = ({ analysisResult }) => {
  const { t } = useTranslation();
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);


  const comparisonColumns = [
    {
      title: t('parameter.parameter'),
      dataIndex: 'parameter',
      key: 'parameter',
      render: (text: string, record: any) => (
        <Space>
          <Tag color={record.color} style={{ width: '8px', height: '8px', borderRadius: '50%', margin: 0 }} />
          <Text style={{ color: '#f8f8f2' }}>{text}</Text>
        </Space>
      )
    },
    {
      title: t('parameter.mleTitle'),
      dataIndex: 'mle',
      key: 'mle',
      render: (text: string) => <Text style={{ color: '#66d9ef', fontFamily: 'monospace' }}>{text}</Text>
    },
    {
      title: t('parameter.momTitle'),
      dataIndex: 'mom',
      key: 'mom',
      render: (text: string) => <Text style={{ color: '#ae81ff', fontFamily: 'monospace' }}>{text}</Text>
    },
    {
      title: t('parameter.absoluteDiff'),
      dataIndex: 'difference',
      key: 'difference',
      render: (text: string, record: any) => (
        <Text
          style={{
            color: Math.abs(record.rawDiff) < 0.001 ? '#a6e22e' : '#fd971f',
            fontFamily: 'monospace'
          }}
        >
          {text}
        </Text>
      )
    }
  ];

  const mleData = [
    {
      key: 'mean',
      parameter: t('parameter.mean'),
      value: analysisResult.mleParams?.mean?.toFixed(6) || '0.000000',
      symbol: 'μ̂',
      color: '#66d9ef'
    },
    {
      key: 'variance',
      parameter: t('parameter.variance'),
      value: analysisResult.mleParams?.variance?.toFixed(6) || '0.000000',
      symbol: 'σ²̂',
      color: '#a6e22e'
    },
    {
      key: 'stdDev',
      parameter: t('parameter.stdDev'),
      value: analysisResult.mleParams?.stdDev?.toFixed(6) || '0.000000',
      symbol: 'σ̂',
      color: '#fd971f'
    }
  ];

  const momData = [
    {
      key: 'mean',
      parameter: t('parameter.mean'),
      value: analysisResult.momParams?.mean?.toFixed(6) || '0.000000',
      symbol: 'μ̃',
      color: '#ae81ff'
    },
    {
      key: 'variance',
      parameter: t('parameter.variance'),
      value: analysisResult.momParams?.variance?.toFixed(6) || '0.000000',
      symbol: 'σ²̃',
      color: '#f92672'
    },
    {
      key: 'stdDev',
      parameter: t('parameter.stdDev'),
      value: analysisResult.momParams?.stdDev?.toFixed(6) || '0.000000',
      symbol: 'σ̃',
      color: '#e6db74'
    }
  ];

  const comparisonData = [
    {
      key: 'mean',
      parameter: `${t('parameter.mean')} (μ)`,
      mle: analysisResult.mleParams?.mean?.toFixed(8) || '0.00000000',
      mom: analysisResult.momParams?.mean?.toFixed(8) || '0.00000000',
      difference: Math.abs((analysisResult.mleParams?.mean || 0) - (analysisResult.momParams?.mean || 0)).toFixed(10),
      rawDiff: (analysisResult.mleParams?.mean || 0) - (analysisResult.momParams?.mean || 0),
      color: '#66d9ef'
    },
    {
      key: 'variance',
      parameter: `${t('parameter.variance')} (σ²)`,
      mle: analysisResult.mleParams?.variance?.toFixed(8) || '0.00000000',
      mom: analysisResult.momParams?.variance?.toFixed(8) || '0.00000000',
      difference: Math.abs((analysisResult.mleParams?.variance || 0) - (analysisResult.momParams?.variance || 0)).toFixed(10),
      rawDiff: (analysisResult.mleParams?.variance || 0) - (analysisResult.momParams?.variance || 0),
      color: '#a6e22e'
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* MLE参数估计 */}
      <Card
        title={
          <Space>
            <ExperimentOutlined style={{ color: '#66d9ef' }} />
            <Title level={4} style={{ margin: 0, color: '#66d9ef' }}>
              {t('parameter.mle')}
            </Title>
          </Space>
        }
        style={{
          backgroundColor: '#2f2e27',
          transition: 'all 0.3s ease',
          transform: hoveredMethod === 'mle' ? 'scale(1.01)' : 'scale(1)',
          boxShadow: hoveredMethod === 'mle' ? '0 4px 12px rgba(102, 217, 239, 0.2)' : 'none'
        }}
        onMouseEnter={() => setHoveredMethod('mle')}
        onMouseLeave={() => setHoveredMethod(null)}
        onClick={() => setExpandedMethod(expandedMethod === 'mle' ? null : 'mle')}
        extra={
          <Tooltip title={expandedMethod === 'mle' ? t('parameter.collapse') : t('parameter.expand')}>
            <InfoCircleOutlined
              style={{
                color: '#66d9ef',
                cursor: 'pointer',
                transform: expandedMethod === 'mle' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </Tooltip>
        }
      >
        <Paragraph style={{ color: '#90908a', marginBottom: '24px' }}>
          {t('parameter.mleDesc')}
        </Paragraph>

        <Row gutter={[16, 16]}>
          {mleData.map((item) => (
            <Col xs={24} md={8} key={item.key}>
              <Card bordered={false} style={{ backgroundColor: '#49483e', textAlign: 'center' }}>
                <Statistic
                  title={<Text style={{ color: '#90908a' }}>{item.parameter}</Text>}
                  value={item.value}
                  valueStyle={{ color: item.color, fontSize: '20px' }}
                  suffix={<Text style={{ color: '#75715e', fontSize: '12px' }}>{item.symbol}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {expandedMethod === 'mle' && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#49483e',
            borderRadius: '6px',
            animation: 'slideDown 0.3s ease'
          }}>
            <Space direction="vertical">
              <Text strong style={{ color: '#f8f8f2' }}>{t('parameter.principle')}</Text>
              <Text style={{ color: '#90908a' }}>
                {t('parameter.mlePrinciple')}
              </Text>
              <div style={{
                padding: '8px',
                backgroundColor: '#1e1e1e',
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                <Text style={{ color: '#75715e', fontSize: '12px', fontFamily: 'monospace' }}>
                  L(θ|x) = ∏ f(xᵢ|θ) → max
                </Text>
              </div>
            </Space>
          </div>
        )}
      </Card>

      {/* MoM参数估计 */}
      <Card
        title={
          <Space>
            <CalculatorOutlined style={{ color: '#ae81ff' }} />
            <Title level={4} style={{ margin: 0, color: '#ae81ff' }}>
              {t('parameter.mom')}
            </Title>
          </Space>
        }
        style={{
          backgroundColor: '#2f2e27',
          transition: 'all 0.3s ease',
          transform: hoveredMethod === 'mom' ? 'scale(1.01)' : 'scale(1)',
          boxShadow: hoveredMethod === 'mom' ? '0 4px 12px rgba(174, 129, 255, 0.2)' : 'none'
        }}
        onMouseEnter={() => setHoveredMethod('mom')}
        onMouseLeave={() => setHoveredMethod(null)}
        onClick={() => setExpandedMethod(expandedMethod === 'mom' ? null : 'mom')}
        extra={
          <Tooltip title={expandedMethod === 'mom' ? t('parameter.collapse') : t('parameter.expand')}>
            <InfoCircleOutlined
              style={{
                color: '#ae81ff',
                cursor: 'pointer',
                transform: expandedMethod === 'mom' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </Tooltip>
        }
      >
        <Paragraph style={{ color: '#90908a', marginBottom: '24px' }}>
          {t('parameter.momDesc')}
        </Paragraph>

        <Row gutter={[16, 16]}>
          {momData.map((item) => (
            <Col xs={24} md={8} key={item.key}>
              <Card bordered={false} style={{ backgroundColor: '#49483e', textAlign: 'center' }}>
                <Statistic
                  title={<Text style={{ color: '#90908a' }}>{item.parameter}</Text>}
                  value={item.value}
                  valueStyle={{ color: item.color, fontSize: '20px' }}
                  suffix={<Text style={{ color: '#75715e', fontSize: '12px' }}>{item.symbol}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {expandedMethod === 'mom' && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#49483e',
            borderRadius: '6px',
            animation: 'slideDown 0.3s ease'
          }}>
            <Space direction="vertical">
              <Text strong style={{ color: '#f8f8f2' }}>{t('parameter.principle')}</Text>
              <Text style={{ color: '#90908a' }}>
                {t('parameter.momPrinciple')}
              </Text>
              <div style={{
                padding: '8px',
                backgroundColor: '#1e1e1e',
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                <Text style={{ color: '#75715e', fontSize: '12px', fontFamily: 'monospace' }}>
                  E[X] = μ̂, Var(X) = σ̂²
                </Text>
              </div>
            </Space>
          </div>
        )}
      </Card>

      {/* 参数估计方法比较 */}
      <Card
        title={
          <Space>
            <BarChartOutlined style={{ color: '#e6db74' }} />
            <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
              {t('parameter.comparison')}
            </Title>
          </Space>
        }
        style={{ backgroundColor: '#2f2e27' }}
      >
        <Paragraph style={{ color: '#90908a', marginBottom: '24px' }}>
          {t('parameter.comparisonDesc')}
        </Paragraph>

        <Table
          dataSource={comparisonData}
          columns={comparisonColumns}
          pagination={false}
          style={{ backgroundColor: '#2f2e27' }}
          rowClassName={() => 'custom-table-row'}
        />
      </Card>
    </Space>
  );
};

export default ParameterEstimation;
