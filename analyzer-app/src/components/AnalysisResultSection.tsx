import React from 'react';
import { Card, Tabs, Space, Typography } from 'antd';
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

interface AnalysisResultSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  analysisResult: any;
  data: number[];
}

const AnalysisResultSection: React.FC<AnalysisResultSectionProps> = ({
  activeTab,
  setActiveTab,
  analysisResult,
  data
}) => {
  const { t } = useTranslation();
  const { Title, Paragraph } = Typography;

  const tabItems = [
    {
      key: 'basic',
      label: (
        <Space>
          <CalculatorOutlined />
          {t('analysis.basicStats')}
        </Space>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <CoreStatistics analysisResult={analysisResult} />
          <AdvancedStatistics analysisResult={analysisResult} />
          <DataVisualization data={data} analysisResult={analysisResult} />
          <StatisticsGuide />
        </Space>
      ),
    },
    {
      key: 'mle-mom',
      label: (
        <Space>
          <ExperimentOutlined />
          {t('analysis.parameterEstimation')}
        </Space>
      ),
      children: (
        <ParameterEstimation analysisResult={analysisResult} />
      ),
    },
    {
      key: 'hypothesis-testing',
      label: (
        <Space>
          <BarChartOutlined />
          {t('analysis.hypothesisTesting')}
        </Space>
      ),
      children: (
        <HypothesisTesting analysisResult={analysisResult} data={data} />
      ),
    },
    {
      key: 'confidence-intervals',
      label: (
        <Space>
          <ExperimentOutlined />
          {t('analysis.confidenceIntervals')}
        </Space>
      ),
      children: (
        <ConfidenceIntervals data={data} analysisResult={analysisResult} />
      ),
    },
    {
      key: 'power-analysis',
      label: (
        <Space>
          <ThunderboltOutlined />
          {t('analysis.powerAnalysis')}
        </Space>
      ),
      children: (
        <PowerAnalysis data={data} analysisResult={analysisResult} />
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <Title level={3} style={{ margin: 0, color: '#f8f8f2' }}>
            {t('analysis.title')}
          </Title>
        </Space>
      }
      style={{ marginBottom: 48 }}
    >
      <Paragraph style={{ color: '#90908a', marginBottom: 24 }}>
        {t('analysis.description')}
      </Paragraph>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ backgroundColor: '#2f2e27', border: 'none' }}
      />
    </Card>
  );
};

export default AnalysisResultSection;
