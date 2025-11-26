import { Space, Typography, Table, Card, Divider } from 'antd';
import {
  CalculatorOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { GoodnessOfFitResult, QQPlotPoint } from '../types';

// 导入子组件
import { CoreStatistics } from './StatisticCard';
import AdvancedStatistics from './AdvancedStatistics';
import DataVisualization from './DataVisualization';
import ParameterEstimation from './ParameterEstimation';
import StatisticsGuide from './StatisticsGuide';
import HypothesisTesting from './HypothesisTesting';
import ConfidenceIntervals from './ConfidenceIntervals';
import PowerAnalysis from './PowerAnalysis';
import { AnalysisTabButton } from './analysis/AnalysisTabButton';
import { AnalysisResultCard } from './analysis/AnalysisResultCard';

interface AnalysisResultSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  analysisResult: any;
  data: number[];
  goodnessOfFitResult?: GoodnessOfFitResult;
  qqPlotData?: QQPlotPoint[];
}

const AnalysisResultSection = ({
  activeTab,
  setActiveTab,
  analysisResult,
  data,
  goodnessOfFitResult,
  qqPlotData
}: AnalysisResultSectionProps) => {
  const { t } = useTranslation();
  const { Paragraph } = Typography;

  const tabs = [
    {
      key: 'basic',
      icon: <CalculatorOutlined />,
      label: t('analysis.basicStats'),
      color: '#66d9ef',
    },
    {
      key: 'mle-mom',
      icon: <ExperimentOutlined />,
      label: t('analysis.parameterEstimation'),
      color: '#a6e22e',
    },
    {
      key: 'hypothesis-testing',
      icon: <BarChartOutlined />,
      label: t('analysis.hypothesisTesting'),
      color: '#fd971f',
    },
    {
      key: 'confidence-intervals',
      icon: <ExperimentOutlined />,
      label: t('analysis.confidenceIntervals'),
      color: '#ae81ff',
    },
    {
      key: 'power-analysis',
      icon: <ThunderboltOutlined />,
      label: t('analysis.powerAnalysis'),
      color: '#f92672',
    },
    {
      key: 'distribution-fit',
      icon: <LineChartOutlined />,
      label: t('analysis.distributionFit'),
      color: '#26a69a',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CoreStatistics analysisResult={analysisResult} />
            <AdvancedStatistics analysisResult={analysisResult} />
            <DataVisualization data={data} analysisResult={analysisResult} />
            <StatisticsGuide />
          </Space>
        );
      case 'mle-mom':
        return <ParameterEstimation analysisResult={analysisResult} />;
      case 'hypothesis-testing':
        return <HypothesisTesting analysisResult={analysisResult} data={data} />;
      case 'confidence-intervals':
        return <ConfidenceIntervals data={data} analysisResult={analysisResult} />;
      case 'power-analysis':
        return <PowerAnalysis data={data} analysisResult={analysisResult} />;
      case 'distribution-fit':
        return renderGoodnessOfFitResults();
      default:
        return null;
    }
  };

  const renderGoodnessOfFitResults = () => {
    if (!goodnessOfFitResult) {
      return (
        <div className="no-data-message">
          <Paragraph>{t('analysis.noFitData')}</Paragraph>
        </div>
      );
    }

    const columns = [
      {
        title: t('analysis.distributionType'),
        dataIndex: 'distribution',
        key: 'distribution',
        render: (text: string) => t(`analysis.${text}`),
      },
      {
        title: t('analysis.chisquareStatistic'),
        dataIndex: 'chiSquare',
        key: 'chiSquare',
        render: (value: number) => value.toFixed(4),
      },
      {
        title: t('analysis.dof'),
        dataIndex: 'degreesOfFreedom',
        key: 'degreesOfFreedom',
      },
      {
        title: t('analysis.pValue'),
        dataIndex: 'pValue',
        key: 'pValue',
        render: (value: number) => value.toFixed(4),
      },
      {
        title: t('analysis.fitRecommendation'),
        dataIndex: 'recommendation',
        key: 'recommendation',
        render: (value: boolean) => value ? (
          <span style={{ color: 'green' }}>{t('analysis.recommended')}</span>
        ) : (
          <span style={{ color: 'red' }}>{t('analysis.notRecommended')}</span>
        ),
      },
    ];

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={t('analysis.goodnessOfFitResults')}>
          {goodnessOfFitResult.bestFit && (
            <div className="best-fit-message" style={{ marginBottom: 16 }}>
              <Paragraph>
                {t('analysis.bestFitDistribution', {
                  distribution: t(`analysis.${goodnessOfFitResult.bestFit}`)
                })}
              </Paragraph>
            </div>
          )}
          <Table 
            dataSource={goodnessOfFitResult.results} 
            columns={columns} 
            pagination={false} 
            rowKey="distribution"
          />
        </Card>
        
        {renderQQPlot()}
      </Space>
    );
  };

  const renderQQPlot = () => {
    if (!qqPlotData || qqPlotData.length === 0) {
      return null;
    }

    return (
      <Card title={t('analysis.qqPlot')}>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qqPlotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="theoreticalQuantiles" 
                label={{ value: t('analysis.theoreticalQuantiles'), position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis 
                label={{ value: t('analysis.sampleQuantiles'), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value: any) => value.toFixed(4)} />
              <ReferenceLine x={0} stroke="#ccc" />
              <ReferenceLine y={0} stroke="#ccc" />
              <Line 
                type="monotone" 
                dataKey="sampleQuantiles" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="theoreticalQuantiles" 
                stroke="#ff7300" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Divider />
        <Paragraph type="secondary">
          {t('analysis.qqPlotDescription')}
        </Paragraph>
      </Card>
    );
  };

  return (
    <div className="analysis-result-section">
      <AnalysisResultCard
        title={t('analysis.title')}
        icon={<BarChartOutlined />}
        iconColor="#4fc3f7"
      >
        <Paragraph style={{ color: 'var(--monokai-gray)', marginBottom: 24 }}>
          {t('analysis.description')}
        </Paragraph>

        {/* 自定义标签切换栏 */}
        <div className="analysis-tabs-container">
          <div className="analysis-tabs-wrapper">
            {tabs.map((tab) => (
              <AnalysisTabButton
                key={tab.key}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                color={tab.color}
              />
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="analysis-content-wrapper">
          {renderContent()}
        </div>
      </AnalysisResultCard>
    </div>
  );
};

export default AnalysisResultSection;
