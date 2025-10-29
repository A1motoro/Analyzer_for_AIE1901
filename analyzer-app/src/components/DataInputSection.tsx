import React from 'react';
import {
  Card,
  Radio,
  Upload,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Alert,
  Tag
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UploadOutlined,
  ExperimentOutlined,
  RobotOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
// 这些函数在App.tsx中直接调用，这里不需要导入

interface DataInputSectionProps {
  inputMethod: string;
  setInputMethod: (method: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDistributionGenerate: (type: string) => void;
  handleAIGenerateData: () => void;
  handleClearData: () => void;
  data: number[];
  isUserUploadedData: boolean;
}

const DataInputSection: React.FC<DataInputSectionProps> = ({
  inputMethod,
  setInputMethod,
  handleFileUpload,
  handleDistributionGenerate,
  handleAIGenerateData,
  handleClearData,
  data,
  isUserUploadedData
}) => {
  const { t } = useTranslation();
  const { Title, Text, Paragraph } = Typography;

  return (
    <Card
      title={
        <Space>
          <FileTextOutlined />
          <Title level={3} style={{ margin: 0, color: '#f8f8f2' }}>
            {t('data.input')}
          </Title>
        </Space>
      }
      style={{ marginBottom: 48 }}
    >
      <Paragraph style={{ color: '#90908a', marginBottom: 24 }}>
        {t('data.inputDescription')}
      </Paragraph>

      {/* 输入方法切换 */}
      <div style={{ marginBottom: 24 }}>
        <Radio.Group
          value={inputMethod}
          onChange={(e) => setInputMethod(e.target.value)}
          size="large"
        >
          <Radio.Button value="upload">
            <Space>
              <UploadOutlined />
              {t('data.upload')}
            </Space>
          </Radio.Button>
          <Radio.Button value="distribution">
            <Space>
              <ExperimentOutlined />
              {t('data.distribution')}
            </Space>
          </Radio.Button>
          <Radio.Button value="ai">
            <Space>
              <RobotOutlined />
              {t('data.aiGenerate')}
            </Space>
          </Radio.Button>
        </Radio.Group>
      </div>

      {/* 文件上传区域 */}
      {inputMethod === 'upload' && (
        <Row justify="center">
          <Col xs={24} lg={16}>
            <Card style={{ backgroundColor: '#2f2e27' }}>
              <Upload.Dragger
                accept=".csv"
                showUploadList={false}
                beforeUpload={(file) => {
                  const fakeEvent = {
                    target: { files: [file] }
                  } as any;
                  handleFileUpload(fakeEvent);
                  return false; // 阻止默认上传行为
                }}
                style={{
                  backgroundColor: '#49483e',
                  borderColor: '#3e3d32',
                  borderRadius: '8px'
                }}
              >
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <UploadOutlined style={{ fontSize: '48px', color: '#fd971f', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#f8f8f2', margin: '0 0 8px 0' }}>
                    {t('data.uploadFile')}
                  </Title>
                  <Text style={{ color: '#90908a' }}>
                    {t('data.uploadHint')}
                  </Text>
                </div>
              </Upload.Dragger>
            </Card>

            {/* 数据导入成功状态提示 */}
            {isUserUploadedData && data.length > 0 && (
              <Alert
                message={
                  <Space>
                    <Text strong style={{ color: '#a6e22e' }}>
                      {t('data.uploadSuccess')}
                    </Text>
                    <Text style={{ color: '#90908a' }}>
                      {t('data.dataPointsLoaded', { count: data.length })}
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical">
                    <Text style={{ color: '#a6e22e' }}>
                      {t('data.dataReady')}
                    </Text>
                    <Button
                      type="link"
                      danger
                      size="small"
                      onClick={handleClearData}
                      icon={<i className="fa fa-trash" />}
                    >
                      {t('data.delete')}
                    </Button>
                  </Space>
                }
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Col>
        </Row>
      )}

      {/* 分布生成区域 */}
      {inputMethod === 'distribution' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ color: '#f8f8f2', margin: '0 0 8px 0' }}>
              {t('data.selectDistribution')}
            </Title>
            <Text style={{ color: '#90908a' }}>
              {t('data.distributionHint')}
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card
                hoverable
                style={{ backgroundColor: '#2f2e27', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleDistributionGenerate('normal')}
              >
                <Title level={5} style={{ color: '#66d9ef', margin: '0 0 4px 0' }}>
                  {t('data.normal')}
                </Title>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  N(μ, σ²)
                </Text>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                hoverable
                style={{ backgroundColor: '#2f2e27', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleDistributionGenerate('uniform')}
              >
                <Title level={5} style={{ color: '#a6e22e', margin: '0 0 4px 0' }}>
                  {t('data.uniform')}
                </Title>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  U(a, b)
                </Text>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                hoverable
                style={{ backgroundColor: '#2f2e27', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleDistributionGenerate('exponential')}
              >
                <Title level={5} style={{ color: '#fd971f', margin: '0 0 4px 0' }}>
                  {t('data.exponential')}
                </Title>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  Exp(λ)
                </Text>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                hoverable
                style={{ backgroundColor: '#2f2e27', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleDistributionGenerate('poisson')}
              >
                <Title level={5} style={{ color: '#ae81ff', margin: '0 0 4px 0' }}>
                  {t('data.poisson')}
                </Title>
                <Text style={{ color: '#90908a', fontSize: '12px' }}>
                  Poisson(λ)
                </Text>
              </Card>
            </Col>
          </Row>

          <Alert
            message={
              <Space>
                <Text strong style={{ color: '#e6db74' }}>{t('data.useHint')}</Text>
              </Space>
            }
            description={t('data.useHintDesc')}
            type="info"
            showIcon
          />

          {data.length > 0 && (
            <Alert
              message={t('data.generateSuccess')}
              description={t('data.pointsGenerated', { count: data.length })}
              type="success"
              showIcon
            />
          )}
        </div>
      )}

      {/* AI生成区域 */}
      {inputMethod === 'ai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ae81ff, #f92672)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#272822'
            }}>
              <RobotOutlined style={{ fontSize: '32px' }} />
            </div>
            <Title level={2} style={{ color: '#f8f8f2', margin: '0 0 12px 0' }}>
              {t('data.aiGenerateTitle')}
            </Title>
            <Paragraph style={{ color: '#90908a', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              {t('data.aiGenerateDesc')}
            </Paragraph>

            <Button
              type="primary"
              size="large"
              onClick={handleAIGenerateData}
              style={{
                background: 'linear-gradient(135deg, #ae81ff, #f92672)',
                border: 'none',
                height: '48px',
                fontSize: '16px'
              }}
              icon={<RobotOutlined />}
            >
              {t('data.clickGenerate')}
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <ExperimentOutlined style={{ color: '#66d9ef' }} />
                    <Text style={{ color: '#f8f8f2' }}>{t('data.features')}</Text>
                  </Space>
                }
                style={{ backgroundColor: '#2f2e27' }}
              >
                <Space direction="vertical" size="small">
                  <Text style={{ color: '#a6e22e' }}>✓ {t('data.deepLearning')}</Text>
                  <Text style={{ color: '#a6e22e' }}>✓ {t('data.adaptiveParams')}</Text>
                  <Text style={{ color: '#a6e22e' }}>✓ {t('data.highQuality')}</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#fd971f' }} />
                    <Text style={{ color: '#f8f8f2' }}>{t('data.status')}</Text>
                  </Space>
                }
                style={{ backgroundColor: '#2f2e27' }}
              >
                <Space direction="vertical">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#90908a' }}>{t('data.aiEngine')}</Text>
                    <Tag color="success" style={{ margin: 0 }}>{t('data.ready')}</Tag>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {data.length > 0 && (
            <Alert
              message={
                <Space>
                  <Text strong style={{ color: '#a6e22e' }}>{t('data.aiGenerateSuccess')}</Text>
                </Space>
              }
              description={
                <Space direction="vertical">
                  <Text>{t('data.generatedHighQuality', { count: data.length })}</Text>
                  <Space size="large">
                    <Text style={{ color: '#75715e' }}>✓ {t('data.fitScore')}</Text>
                    <Text style={{ color: '#75715e' }}>✓ {t('data.dataQuality')}</Text>
                    <Text style={{ color: '#75715e' }}>✓ {t('data.processTime')}</Text>
                  </Space>
                </Space>
              }
              type="success"
              showIcon
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default DataInputSection;
