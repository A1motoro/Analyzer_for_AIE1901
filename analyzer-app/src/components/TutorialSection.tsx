import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Steps, Divider, Typography, Space, Tag } from 'antd';
import {
  UploadOutlined,
  ExperimentOutlined,
  RobotOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  ThunderboltOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TutorialSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('quickstart');

  // 快速开始步骤
  const quickStartSteps = [
    {
      title: t('tutorial.quickStart.step1.title'),
      description: t('tutorial.quickStart.step1.desc'),
      icon: <UploadOutlined />,
      content: [
        t('tutorial.quickStart.step1.content1'),
        t('tutorial.quickStart.step1.content2'),
        t('tutorial.quickStart.step1.content3')
      ]
    },
    {
      title: t('tutorial.quickStart.step2.title'),
      description: t('tutorial.quickStart.step2.desc'),
      icon: <BarChartOutlined />,
      content: [
        t('tutorial.quickStart.step2.content1'),
        t('tutorial.quickStart.step2.content2'),
        t('tutorial.quickStart.step2.content3')
      ]
    },
    {
      title: t('tutorial.quickStart.step3.title'),
      description: t('tutorial.quickStart.step3.desc'),
      icon: <CalculatorOutlined />,
      content: [
        t('tutorial.quickStart.step3.content1'),
        t('tutorial.quickStart.step3.content2'),
        t('tutorial.quickStart.step3.content3')
      ]
    },
    {
      title: t('tutorial.quickStart.step4.title'),
      description: t('tutorial.quickStart.step4.desc'),
      icon: <RobotOutlined />,
      content: [
        t('tutorial.quickStart.step4.content1'),
        t('tutorial.quickStart.step4.content2')
      ]
    }
  ];

  // 数据输入方式
  const dataInputMethods = [
    {
      key: 'upload',
      icon: <UploadOutlined />,
      title: t('data.upload'),
      color: '#fd971f',
      steps: [
        t('tutorial.dataInput.upload.step1'),
        t('tutorial.dataInput.upload.step2'),
        t('tutorial.dataInput.upload.step3')
      ],
      tips: t('tutorial.dataInput.upload.tips')
    },
    {
      key: 'distribution',
      icon: <ExperimentOutlined />,
      title: t('data.distribution'),
      color: '#66d9ef',
      steps: [
        t('tutorial.dataInput.distribution.step1'),
        t('tutorial.dataInput.distribution.step2'),
        t('tutorial.dataInput.distribution.step3'),
        t('tutorial.dataInput.distribution.step4')
      ],
      tips: t('tutorial.dataInput.distribution.tips')
    },
    {
      key: 'ai',
      icon: <RobotOutlined />,
      title: t('data.aiGenerate'),
      color: '#ae81ff',
      steps: [
        t('tutorial.dataInput.ai.step1'),
        t('tutorial.dataInput.ai.step2')
      ],
      tips: t('tutorial.dataInput.ai.tips')
    }
  ];

  // 分析功能标签页
  const analysisTabs = [
    {
      key: 'basic',
      icon: <CalculatorOutlined />,
      title: t('analysis.basicStats'),
      color: '#66d9ef',
      features: [
        t('tutorial.analysis.basic.feature1'),
        t('tutorial.analysis.basic.feature2'),
        t('tutorial.analysis.basic.feature3'),
        t('tutorial.analysis.basic.feature4')
      ]
    },
    {
      key: 'mle-mom',
      icon: <ExperimentOutlined />,
      title: t('analysis.parameterEstimation'),
      color: '#a6e22e',
      features: [
        t('tutorial.analysis.parameter.feature1'),
        t('tutorial.analysis.parameter.feature2'),
        t('tutorial.analysis.parameter.feature3')
      ]
    },
    {
      key: 'hypothesis-testing',
      icon: <BarChartOutlined />,
      title: t('analysis.hypothesisTesting'),
      color: '#fd971f',
      features: [
        t('tutorial.analysis.hypothesis.feature1'),
        t('tutorial.analysis.hypothesis.feature2'),
        t('tutorial.analysis.hypothesis.feature3')
      ]
    },
    {
      key: 'confidence-intervals',
      icon: <QuestionCircleOutlined />,
      title: t('analysis.confidenceIntervals'),
      color: '#ae81ff',
      features: [
        t('tutorial.analysis.confidence.feature1'),
        t('tutorial.analysis.confidence.feature2'),
        t('tutorial.analysis.confidence.feature3')
      ]
    },
    {
      key: 'power-analysis',
      icon: <ThunderboltOutlined />,
      title: t('analysis.powerAnalysis'),
      color: '#f92672',
      features: [
        t('tutorial.analysis.power.feature1'),
        t('tutorial.analysis.power.feature2'),
        t('tutorial.analysis.power.feature3')
      ]
    }
  ];

  // 侧边栏导航
  const sidebarItems = [
    { key: 'quickstart', label: t('tutorial.nav.quickStart'), icon: <ThunderboltOutlined /> },
    { key: 'dataInput', label: t('tutorial.nav.dataInput'), icon: <UploadOutlined /> },
    { key: 'analysis', label: t('tutorial.nav.analysis'), icon: <BarChartOutlined /> },
    { key: 'aiAssistant', label: t('tutorial.nav.aiAssistant'), icon: <RobotOutlined /> },
    { key: 'settings', label: t('tutorial.nav.settings'), icon: <SettingOutlined /> },
    { key: 'tips', label: t('tutorial.nav.tips'), icon: <FileTextOutlined /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'quickstart':
        return (
          <div>
            <Title level={3} style={{ color: 'var(--monokai-fg)', marginBottom: '24px' }}>
              <ThunderboltOutlined style={{ color: 'var(--monokai-orange)', marginRight: '12px' }} />
              {t('tutorial.quickStart.title')}
            </Title>
            <Paragraph style={{ color: 'var(--monokai-gray)', fontSize: '16px', marginBottom: '32px' }}>
              {t('tutorial.quickStart.description')}
            </Paragraph>
            
            <Steps
              direction="vertical"
              current={quickStartSteps.length}
              style={{ marginBottom: '32px' }}
              items={quickStartSteps.map((step, index) => ({
                title: (
                  <Title level={4} style={{ color: 'var(--monokai-fg)', margin: 0 }}>
                    {step.title}
                  </Title>
                ),
                description: (
                  <Paragraph style={{ color: 'var(--monokai-gray)', marginBottom: '16px' }}>
                    {step.description}
                  </Paragraph>
                ),
                icon: <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: `var(--monokai-${['blue', 'green', 'orange', 'purple'][index]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--monokai-bg)'
                }}>{step.icon}</div>,
                status: 'finish' as const
              }))}
            />

            {quickStartSteps.map((step, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: '24px',
                  background: 'var(--monokai-bg-light)',
                  border: `1px solid var(--monokai-bg-lighter)`,
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `var(--monokai-${['blue', 'green', 'orange', 'purple'][index]})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--monokai-bg)',
                      fontSize: '18px'
                    }}>
                      {step.icon}
                    </div>
                    <Title level={4} style={{ color: 'var(--monokai-fg)', margin: 0 }}>
                      {step.title}
                    </Title>
                  </div>
                  <Paragraph style={{ color: 'var(--monokai-gray)', marginBottom: '12px' }}>
                    {step.description}
                  </Paragraph>
                  <ul style={{ 
                    paddingLeft: '24px',
                    margin: 0,
                    color: 'var(--monokai-fg)'
                  }}>
                    {step.content.map((item, itemIndex) => (
                      <li key={itemIndex} style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                        <Text style={{ color: 'var(--monokai-fg)' }}>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </Space>
              </Card>
            ))}
          </div>
        );

      case 'dataInput':
        return (
          <div>
            <Title level={3} style={{ color: 'var(--monokai-fg)', marginBottom: '24px' }}>
              <UploadOutlined style={{ color: 'var(--monokai-orange)', marginRight: '12px' }} />
              {t('tutorial.dataInput.title')}
            </Title>
            <Paragraph style={{ color: 'var(--monokai-gray)', fontSize: '16px', marginBottom: '32px' }}>
              {t('tutorial.dataInput.description')}
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {dataInputMethods.map((method, index) => (
                <Card
                  key={method.key}
                  style={{
                    background: 'var(--monokai-bg-light)',
                    border: `2px solid ${method.color}40`,
                    borderRadius: '12px',
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${method.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: method.color,
                        fontSize: '24px'
                      }}>
                        {method.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Title level={4} style={{ color: 'var(--monokai-fg)', margin: 0 }}>
                          {method.title}
                        </Title>
                        <Tag color={method.color} style={{ marginTop: '8px' }}>
                          {t('tutorial.dataInput.method')} {index + 1}
                        </Tag>
                      </div>
                    </div>

                    <Divider style={{ borderColor: 'var(--monokai-bg-lighter)', margin: '16px 0' }} />

                    <div>
                      <Text strong style={{ color: 'var(--monokai-fg)', display: 'block', marginBottom: '12px' }}>
                        {t('tutorial.dataInput.steps')}:
                      </Text>
                      <Steps
                        direction="vertical"
                        size="small"
                        items={method.steps.map((step) => ({
                          title: (
                            <Text style={{ color: 'var(--monokai-fg)' }}>{step}</Text>
                          ),
                          icon: <CheckCircleOutlined style={{ color: method.color }} />,
                          status: 'finish' as const
                        }))}
                      />
                    </div>

                    {method.tips && (
                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: `${method.color}15`,
                        borderLeft: `3px solid ${method.color}`
                      }}>
                        <Text style={{ color: 'var(--monokai-fg)' }}>
                          <strong>💡 {t('tutorial.tips')}:</strong> {method.tips}
                        </Text>
                      </div>
                    )}
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div>
            <Title level={3} style={{ color: 'var(--monokai-fg)', marginBottom: '24px' }}>
              <BarChartOutlined style={{ color: 'var(--monokai-blue)', marginRight: '12px' }} />
              {t('tutorial.analysis.title')}
            </Title>
            <Paragraph style={{ color: 'var(--monokai-gray)', fontSize: '16px', marginBottom: '32px' }}>
              {t('tutorial.analysis.description')}
            </Paragraph>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {analysisTabs.map((tab) => (
                <Card
                  key={tab.key}
                  style={{
                    background: 'var(--monokai-bg-light)',
                    border: `1px solid ${tab.color}40`,
                    borderRadius: '12px',
                    height: '100%',
                  }}
                  bodyStyle={{ padding: '20px' }}
                  hoverable
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: `${tab.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tab.color,
                        fontSize: '20px'
                      }}>
                        {tab.icon}
                      </div>
                      <Title level={5} style={{ color: 'var(--monokai-fg)', margin: 0, flex: 1 }}>
                        {tab.title}
                      </Title>
                    </div>
                    <ul style={{ 
                      paddingLeft: '20px',
                      margin: 0,
                      color: 'var(--monokai-fg)'
                    }}>
                      {tab.features.map((feature, index) => (
                        <li key={index} style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                          <Text style={{ color: 'var(--monokai-fg)' }}>{feature}</Text>
                        </li>
                      ))}
                    </ul>
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'aiAssistant':
        return (
          <div>
            <Title level={3} style={{ color: 'var(--monokai-fg)', marginBottom: '24px' }}>
              <RobotOutlined style={{ color: 'var(--monokai-purple)', marginRight: '12px' }} />
              {t('tutorial.aiAssistant.title')}
            </Title>
            <Paragraph style={{ color: 'var(--monokai-gray)', fontSize: '16px', marginBottom: '32px' }}>
              {t('tutorial.aiAssistant.description')}
            </Paragraph>

            <Card
              style={{
                marginBottom: '24px',
                background: 'var(--monokai-bg-light)',
                border: '1px solid var(--monokai-bg-lighter)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Title level={4} style={{ color: 'var(--monokai-fg)', marginBottom: '16px' }}>
                <SettingOutlined style={{ color: 'var(--monokai-purple)', marginRight: '8px' }} />
                {t('tutorial.aiAssistant.config.title')}
              </Title>
              <Steps
                direction="vertical"
                items={[
                  {
                    title: t('tutorial.aiAssistant.config.step1'),
                    description: t('tutorial.aiAssistant.config.step1Desc'),
                    icon: <SettingOutlined style={{ color: 'var(--monokai-purple)' }} />
                  },
                  {
                    title: t('tutorial.aiAssistant.config.step2'),
                    description: t('tutorial.aiAssistant.config.step2Desc'),
                    icon: <FileTextOutlined style={{ color: 'var(--monokai-purple)' }} />
                  },
                  {
                    title: t('tutorial.aiAssistant.config.step3'),
                    description: t('tutorial.aiAssistant.config.step3Desc'),
                    icon: <CheckCircleOutlined style={{ color: 'var(--monokai-green)' }} />
                  }
                ]}
              />
            </Card>

            <Card
              style={{
                background: 'var(--monokai-bg-light)',
                border: '1px solid var(--monokai-bg-lighter)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Title level={4} style={{ color: 'var(--monokai-fg)', marginBottom: '16px' }}>
                <QuestionCircleOutlined style={{ color: 'var(--monokai-blue)', marginRight: '8px' }} />
                {t('tutorial.aiAssistant.usage.title')}
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {[
                  t('tutorial.aiAssistant.usage.item1'),
                  t('tutorial.aiAssistant.usage.item2'),
                  t('tutorial.aiAssistant.usage.item3'),
                  t('tutorial.aiAssistant.usage.item4')
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--monokai-bg)',
                    borderLeft: '3px solid var(--monokai-blue)'
                  }}>
                    <Text style={{ color: 'var(--monokai-fg)' }}>{item}</Text>
                  </div>
                ))}
              </Space>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div>
            <Title level={3} style={{ color: 'var(--monokai-fg)', marginBottom: '24px' }}>
              <SettingOutlined style={{ color: 'var(--monokai-orange)', marginRight: '12px' }} />
              {t('tutorial.settings.title')}
            </Title>
            <Paragraph style={{ color: 'var(--monokai-gray)', fontSize: '16px', marginBottom: '32px' }}>
              {t('tutorial.settings.description')}
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                {
                  title: t('tutorial.settings.theme.title'),
                  icon: <span style={{ fontSize: '20px' }}>🎨</span>,
                  content: t('tutorial.settings.theme.content')
                },
                {
                  title: t('tutorial.settings.language.title'),
                  icon: <span style={{ fontSize: '20px' }}>🌐</span>,
                  content: t('tutorial.settings.language.content')
                },
                {
                  title: t('tutorial.settings.api.title'),
                  icon: <span style={{ fontSize: '20px' }}>🔑</span>,
                  content: t('tutorial.settings.api.content')
                }
              ].map((item, index) => (
                <Card
                  key={index}
                  style={{
                    background: 'var(--monokai-bg-light)',
                    border: '1px solid var(--monokai-bg-lighter)',
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                    <div style={{ fontSize: '24px' }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <Title level={4} style={{ color: 'var(--monokai-fg)', margin: 0, marginBottom: '8px' }}>
                        {item.title}
                      </Title>
                      <Paragraph style={{ color: 'var(--monokai-gray)', margin: 0 }}>
                        {item.content}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'tips':
        return (
          <div>
            <Title level={3} style={{ color: 'var(--monokai-fg)', marginBottom: '24px' }}>
              <FileTextOutlined style={{ color: 'var(--monokai-green)', marginRight: '12px' }} />
              {t('tutorial.tips.title')}
            </Title>
            <Paragraph style={{ color: 'var(--monokai-gray)', fontSize: '16px', marginBottom: '32px' }}>
              {t('tutorial.tips.description')}
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { type: 'success', title: t('tutorial.tips.tip1.title'), content: t('tutorial.tips.tip1.content') },
                { type: 'info', title: t('tutorial.tips.tip2.title'), content: t('tutorial.tips.tip2.content') },
                { type: 'warning', title: t('tutorial.tips.tip3.title'), content: t('tutorial.tips.tip3.content') },
                { type: 'info', title: t('tutorial.tips.tip4.title'), content: t('tutorial.tips.tip4.content') }
              ].map((tip, index) => (
                <Card
                  key={index}
                  style={{
                    background: 'var(--monokai-bg-light)',
                    border: `1px solid ${
                      tip.type === 'success' ? 'var(--monokai-green)' :
                      tip.type === 'warning' ? 'var(--monokai-orange)' :
                      'var(--monokai-blue)'
                    }40`,
                    borderRadius: '12px',
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Tag color={
                        tip.type === 'success' ? 'green' :
                        tip.type === 'warning' ? 'orange' :
                        'blue'
                      }>
                        {tip.type === 'success' ? '✓' : tip.type === 'warning' ? '⚠' : 'ℹ'}
                      </Tag>
                      <Title level={5} style={{ color: 'var(--monokai-fg)', margin: 0 }}>
                        {tip.title}
                      </Title>
                    </div>
                    <Paragraph style={{ color: 'var(--monokai-gray)', margin: 0 }}>
                      {tip.content}
                    </Paragraph>
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="tutorial-section bg-white rounded-xl shadow-card p-6 mb-12 transition-all-300 hover:shadow-card-hover animate-slide-up">
      <h2 className="text-xl font-bold mb-6">{t('tutorialSection.title')}</h2>

      {/* 教程主题导航 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(tutorialContents).map(([key, topic]) => (
          <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeSection === item.key 
                      ? 'var(--monokai-purple)' 
                      : 'transparent',
                    color: activeSection === item.key 
                      ? 'var(--monokai-bg)' 
                      : 'var(--monokai-fg)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                    fontWeight: activeSection === item.key ? '600' : '400'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.key) {
                      e.currentTarget.style.background = 'var(--monokai-bg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.key) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
          </button>
        ))}
            </Space>
      </div>

          {/* 主内容区 */}
          <div style={{
            flex: 1,
            background: 'var(--monokai-bg-light)',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid var(--monokai-bg-lighter)'
          }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialSection;
