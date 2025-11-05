import React, { useState } from 'react';
import { Card, InputNumber, Button, Space, Typography, Row, Col, Statistic, Divider, Slider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CalculatorOutlined,
  CheckCircleOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface DistributionParamInputProps {
  distributionType: string;
  onSubmit: (params: any, sampleSize: number) => void;
  onCancel?: () => void;
}

export const DistributionParamInput: React.FC<DistributionParamInputProps> = ({
  distributionType,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();

  // 数据规模参数
  const [sampleSize, setSampleSize] = useState<number>(1000);

  // 正态分布参数
  const [normalMean, setNormalMean] = useState<number>(50);
  const [normalStdDev, setNormalStdDev] = useState<number>(15);
  const [normalVariance, setNormalVariance] = useState<number>(225);

  // 均匀分布参数
  const [uniformMin, setUniformMin] = useState<number>(0);
  const [uniformMax, setUniformMax] = useState<number>(1);

  // 指数分布参数
  const [exponentialLambda, setExponentialLambda] = useState<number>(1);

  // 泊松分布参数
  const [poissonRate, setPoissonRate] = useState<number>(5);

  // 当标准差变化时，更新方差
  const handleStdDevChange = (value: number | null) => {
    const stdDev = value || 0;
    setNormalStdDev(stdDev);
    setNormalVariance(stdDev * stdDev);
  };

  // 当方差变化时，更新标准差
  const handleVarianceChange = (value: number | null) => {
    const variance = value || 0;
    setNormalVariance(variance);
    setNormalStdDev(Math.sqrt(variance));
  };

  const handleSubmit = () => {
    let params: any = {};
    switch (distributionType) {
      case 'normal':
        params = { mean: normalMean, stdDev: normalStdDev };
        break;
      case 'uniform':
        params = { min: uniformMin, max: uniformMax };
        break;
      case 'exponential':
        params = { lambda: exponentialLambda };
        break;
      case 'poisson':
        params = { rate: poissonRate };
        break;
    }
    onSubmit(params, sampleSize);
  };

  // 渲染数据规模选择器
  const renderSampleSizeSelector = (color: string) => (
    <div className="sample-size-selector">
      <Divider style={{ margin: '16px 0', borderColor: 'var(--monokai-bg-lighter)' }} />
      <div className="param-input-group">
        <label className="param-label">
          <Space>
            <DatabaseOutlined style={{ color }} />
            <Text strong style={{ color }}>{t('data.sampleSizeLabel')}</Text>
          </Space>
          <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px', display: 'block', marginTop: '8px' }}>
            {t('data.sampleSizeDesc')}
          </Text>
        </label>
        <Row gutter={16} style={{ marginTop: '12px' }}>
          <Col xs={24} sm={16}>
            <Slider
              min={100}
              max={10000}
              step={100}
              value={sampleSize}
              onChange={(value) => setSampleSize(value)}
              marks={{
                100: '100',
                1000: '1K',
                5000: '5K',
                10000: '10K'
              }}
              tooltip={{
                formatter: (value) => `${value?.toLocaleString()} ${t('data.dataPoints')}`
              }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <InputNumber
              value={sampleSize}
              onChange={(value) => setSampleSize(value || 1000)}
              style={{ width: '100%' }}
              size="large"
              min={100}
              max={10000}
              step={100}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const parsed = value!.replace(/\$\s?|(,*)/g, '');
                return parsed ? parseFloat(parsed) : 1000;
              }}
            />
          </Col>
        </Row>
        <div className="param-statistic" style={{ marginTop: '12px' }}>
          <Statistic
            value={sampleSize}
            suffix={t('data.dataPoints')}
            valueStyle={{ color, fontSize: '16px', fontFamily: 'monospace' }}
          />
        </div>
      </div>
    </div>
  );

  const renderNormalDistribution = () => (
    <Card
      className="distribution-param-card"
      style={{
        backgroundColor: 'var(--monokai-bg-light)',
        border: '2px solid var(--monokai-blue)',
        borderRadius: '12px',
        marginTop: '16px'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5} style={{ color: 'var(--monokai-fg)', marginBottom: '16px' }}>
            <Space>
              <CalculatorOutlined style={{ color: 'var(--monokai-blue)' }} />
              {t('data.normal')} {t('data.distributionParams')}
            </Space>
          </Title>
          <Text style={{ color: 'var(--monokai-gray)', fontSize: '14px' }}>
            {t('data.distributionParamsDesc.normal')}
          </Text>
        </div>

        <Divider style={{ margin: '16px 0', borderColor: 'var(--monokai-bg-lighter)' }} />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="param-input-group">
              <label className="param-label">
                <Text strong style={{ color: 'var(--monokai-blue)' }}>{t('data.paramLabels.mean')}</Text>
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {t('data.paramLabels.meanDesc')}
                </Text>
              </label>
              <InputNumber
                value={normalMean}
                onChange={(value) => setNormalMean(value || 0)}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
                min={-1000}
                max={1000}
                step={0.1}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => {
                  const parsed = value!.replace(/\$\s?|(,*)/g, '');
                  return parsed ? parseFloat(parsed) : 0;
                }}
              />
              <div className="param-statistic">
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px' }}>
                  当前值: <Text style={{ color: 'var(--monokai-blue)' }}>{normalMean.toFixed(2)}</Text>
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="param-input-group">
              <label className="param-label">
                <Text strong style={{ color: 'var(--monokai-green)' }}>{t('data.paramLabels.stdDev')}</Text>
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {t('data.paramLabels.stdDevDesc')}
                </Text>
              </label>
              <InputNumber
                value={normalStdDev}
                onChange={handleStdDevChange}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
                min={0.1}
                max={100}
                step={0.1}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => {
                  const parsed = value!.replace(/\$\s?|(,*)/g, '');
                  return parsed ? parseFloat(parsed) : 0.1;
                }}
              />
              <div className="param-statistic">
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px' }}>
                  当前值: <Text style={{ color: 'var(--monokai-green)' }}>{normalStdDev.toFixed(2)}</Text>
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="param-input-group">
              <label className="param-label">
                <Text strong style={{ color: 'var(--monokai-orange)' }}>{t('data.paramLabels.variance')}</Text>
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {t('data.paramLabels.varianceDesc')}
                </Text>
              </label>
              <InputNumber
                value={normalVariance}
                onChange={handleVarianceChange}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
                min={0.01}
                max={10000}
                step={1}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => {
                  const parsed = value!.replace(/\$\s?|(,*)/g, '');
                  return parsed ? parseFloat(parsed) : 0.01;
                }}
              />
              <div className="param-statistic">
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px' }}>
                  当前值: <Text style={{ color: 'var(--monokai-orange)' }}>{normalVariance.toFixed(2)}</Text>
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        <div className="param-preview">
          <Card
            style={{
              backgroundColor: 'var(--monokai-bg)',
              border: '1px solid var(--monokai-bg-lighter)',
              borderRadius: '8px'
            }}
          >
            <Statistic
              title={<Text style={{ color: 'var(--monokai-gray)' }}>{t('data.previewCard.title')}</Text>}
              value={`N(${normalMean.toFixed(2)}, ${normalVariance.toFixed(2)})`}
              valueStyle={{ color: 'var(--monokai-blue)', fontSize: '18px', fontFamily: 'monospace' }}
              prefix={<CalculatorOutlined />}
            />
            <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px', display: 'block', marginTop: '8px' }}>
              {t('data.previewCard.stdDev')} {normalStdDev.toFixed(2)}
            </Text>
          </Card>
        </div>

        {renderSampleSizeSelector('var(--monokai-blue)')}

        <div className="param-actions">
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, var(--monokai-blue), var(--monokai-purple))',
                border: 'none',
                fontWeight: 600
              }}
            >
              {t('data.generate')}
            </Button>
            {onCancel && (
              <Button size="large" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );

  const renderUniformDistribution = () => (
    <Card
      className="distribution-param-card"
      style={{
        backgroundColor: 'var(--monokai-bg-light)',
        border: '2px solid var(--monokai-green)',
        borderRadius: '12px',
        marginTop: '16px'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5} style={{ color: 'var(--monokai-fg)', marginBottom: '16px' }}>
            <Space>
              <CalculatorOutlined style={{ color: 'var(--monokai-green)' }} />
              {t('data.uniform')} {t('data.distributionParams')}
            </Space>
          </Title>
          <Text style={{ color: 'var(--monokai-gray)', fontSize: '14px' }}>
            {t('data.distributionParamsDesc.uniform')}
          </Text>
        </div>

        <Divider style={{ margin: '16px 0', borderColor: 'var(--monokai-bg-lighter)' }} />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="param-input-group">
              <label className="param-label">
                <Text strong style={{ color: 'var(--monokai-green)' }}>{t('data.paramLabels.min')}</Text>
              </label>
              <InputNumber
                value={uniformMin}
                onChange={(value) => setUniformMin(value || 0)}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
                step={0.1}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="param-input-group">
              <label className="param-label">
                <Text strong style={{ color: 'var(--monokai-green)' }}>{t('data.paramLabels.max')}</Text>
              </label>
              <InputNumber
                value={uniformMax}
                onChange={(value) => setUniformMax(value || 0)}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
                min={uniformMin + 0.1}
                step={0.1}
              />
            </div>
          </Col>
        </Row>

        {renderSampleSizeSelector('var(--monokai-green)')}

        <div className="param-actions">
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, var(--monokai-green), var(--monokai-blue))',
                border: 'none',
                fontWeight: 600
              }}
            >
              {t('data.generate')}
            </Button>
            {onCancel && (
              <Button size="large" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );

  const renderExponentialDistribution = () => (
    <Card
      className="distribution-param-card"
      style={{
        backgroundColor: 'var(--monokai-bg-light)',
        border: '2px solid var(--monokai-orange)',
        borderRadius: '12px',
        marginTop: '16px'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5} style={{ color: 'var(--monokai-fg)', marginBottom: '16px' }}>
            <Space>
              <CalculatorOutlined style={{ color: 'var(--monokai-orange)' }} />
              {t('data.exponential')} {t('data.distributionParams')}
            </Space>
          </Title>
          <Text style={{ color: 'var(--monokai-gray)', fontSize: '14px' }}>
            {t('data.distributionParamsDesc.exponential')}
          </Text>
        </div>

        <Divider style={{ margin: '16px 0', borderColor: 'var(--monokai-bg-lighter)' }} />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="param-input-group">
              <label className="param-label">
                <Text strong style={{ color: 'var(--monokai-orange)' }}>{t('data.paramLabels.lambda')}</Text>
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {t('data.paramLabels.lambdaDesc')}
                </Text>
              </label>
              <InputNumber
                value={exponentialLambda}
                onChange={(value) => setExponentialLambda(value || 1)}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
                min={0.1}
                step={0.1}
              />
            </div>
          </Col>
        </Row>

        {renderSampleSizeSelector('var(--monokai-orange)')}

        <div className="param-actions">
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, var(--monokai-orange), var(--monokai-pink))',
                border: 'none',
                fontWeight: 600
              }}
            >
              {t('data.generate')}
            </Button>
            {onCancel && (
              <Button size="large" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );

  const renderPoissonDistribution = () => (
    <Card
      className="distribution-param-card"
      style={{
        backgroundColor: 'var(--monokai-bg-light)',
        border: '2px solid var(--monokai-purple)',
        borderRadius: '12px',
        marginTop: '16px'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5} style={{ color: 'var(--monokai-fg)', marginBottom: '16px' }}>
            <Space>
              <CalculatorOutlined style={{ color: 'var(--monokai-purple)' }} />
              {t('data.poisson')} {t('data.distributionParams')}
            </Space>
          </Title>
          <Text style={{ color: 'var(--monokai-gray)', fontSize: '14px' }}>
            {t('data.distributionParamsDesc.poisson')}
          </Text>
        </div>

        <Divider style={{ margin: '16px 0', borderColor: 'var(--monokai-bg-lighter)' }} />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="param-input-group">
              <label className="param-label">
                <Text strong style={{ color: 'var(--monokai-purple)' }}>率参数 (λ)</Text>
                <Text style={{ color: 'var(--monokai-gray)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  必须大于 0
                </Text>
              </label>
              <InputNumber
                value={poissonRate}
                onChange={(value) => setPoissonRate(value || 5)}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
                min={0.1}
                step={0.1}
              />
            </div>
          </Col>
        </Row>

        {renderSampleSizeSelector('var(--monokai-purple)')}

        <div className="param-actions">
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, var(--monokai-purple), var(--monokai-pink))',
                border: 'none',
                fontWeight: 600
              }}
            >
              {t('data.generate')}
            </Button>
            {onCancel && (
              <Button size="large" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );

  switch (distributionType) {
    case 'normal':
      return renderNormalDistribution();
    case 'uniform':
      return renderUniformDistribution();
    case 'exponential':
      return renderExponentialDistribution();
    case 'poisson':
      return renderPoissonDistribution();
    default:
      return null;
  }
};

