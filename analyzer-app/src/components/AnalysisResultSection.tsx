import { Space, Typography } from 'antd';
import {
  CalculatorOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

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
}

const AnalysisResultSection = ({
  activeTab,
  setActiveTab,
  analysisResult,
  data
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
      default:
        return null;
    }
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
