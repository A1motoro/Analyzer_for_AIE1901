import React, { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import DataInputSection from './components/DataInputSection';
import AnalysisResultSection from './components/AnalysisResultSection';
import AIModelChat from './components/AIModelChat';
import TutorialSection from './components/TutorialSection';
import AliyunAPIConfig from './components/AliyunAPIConfig';
import ThemeSettingsDrawer from './components/ThemeSettingsDrawer';
import { antdTheme, lightTheme } from './theme';
import {
  calculateBasicStats,
  parseCSVContent,
  generateDistributionData,
  calculateMLE,
  calculateMoM,
  calculateConfidenceInterval,
  calculateWilsonConfidenceInterval,
  calculateMLEForDistributions,
  calculateGammaMoM,
  calculateBootstrapConfidenceInterval,
  analyzeDistribution,
  performROHEAnalysis
} from './utils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [inputMethod, setInputMethod] = useState('upload');
  const [data, setData] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>({});
  const [currentView, setCurrentView] = useState<'analysis' | 'tutorial' | 'settings'>('analysis');
  const [isUserUploadedData, setIsUserUploadedData] = useState(false);

  // 主题和配置栏状态
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      // 应用保存的主题
      applyTheme(savedTheme);
    } else {
      // 默认应用暗色主题
      applyTheme('dark');
    }
  }, []);

  // 应用主题的辅助函数
  const applyTheme = (newTheme: 'dark' | 'light') => {
    const root = document.documentElement;
    if (newTheme === 'light') {
      // 应用亮色主题的CSS变量
      root.style.setProperty('--monokai-bg', '#ffffff');
      root.style.setProperty('--monokai-fg', '#1c1e21');
      root.style.setProperty('--monokai-purple', '#409eff');
      root.style.setProperty('--monokai-gray', '#65676b');
      root.style.setProperty('--monokai-dim', '#8a8d91');
      root.style.setProperty('--monokai-dark', '#f0f2f5');
      root.style.setProperty('--monokai-light', '#f8f9fa');
    } else {
      // 恢复暗色主题的CSS变量
      root.style.setProperty('--monokai-bg', '#272822');
      root.style.setProperty('--monokai-fg', '#f8f8f2');
      root.style.setProperty('--monokai-purple', '#fd971f');
      root.style.setProperty('--monokai-gray', '#90908a');
      root.style.setProperty('--monokai-dim', '#75715e');
      root.style.setProperty('--monokai-dark', '#1e1e1e');
      root.style.setProperty('--monokai-light', '#3e3d32');
    }
  };

  // 主题切换处理函数
  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    applyTheme(newTheme);
  };

  // 处理数据分析
  const analyzeData = () => {
    if (data.length === 0) return;
    const basicStats = calculateBasicStats(data);
    const mleParams = calculateMLE(data);
    const momParams = calculateMoM(data);

    // 集成新增的统计分析功能
    const confidenceInterval = calculateConfidenceInterval(data);

    // 假设数据是二项分布的结果（0或1），计算Wilson置信区间
    const successCount = data.filter(val => val === 1).length;
    const totalCount = data.length;
    const wilsonInterval = calculateWilsonConfidenceInterval(successCount, totalCount);

    // 计算多种分布的MLE参数估计
    const distributionsMLE = calculateMLEForDistributions(data);

    // 计算Gamma分布的矩估计
    const gammaMoM = calculateGammaMoM(basicStats.mean, basicStats.variance);

    // 计算小样本Bootstrap置信区间
    const bootstrapInterval = calculateBootstrapConfidenceInterval(data);

    // 执行ROHE分析
    const roheAnalysis = performROHEAnalysis(data);

    // 计算分布特征分析（偏度、峰度、正态性检验等）
    const distributionAnalysis = analyzeDistribution(data);

    // 添加用户特定例子的数据（用于演示）
    const userExamples = {
      meanConfidenceInterval: calculateConfidenceInterval(new Array(27).fill(1478), 0.95, 36 * 36),
      wilsonIntervalExample: calculateWilsonConfidenceInterval(40, 100, 0.95)
    };

    setAnalysisResult({
      ...basicStats,
      mleParams,
      momParams,
      confidenceInterval,
      wilsonInterval,
      distributionsMLE,
      gammaMoM,
      bootstrapInterval,
      roheAnalysis,
      distributionAnalysis,
      userExamples
    });
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const parsedData = parseCSVContent(content);
        setData(parsedData);
        setIsUserUploadedData(true);
      } catch (error) {
        console.error('文件解析错误:', error);
        alert('文件解析错误，请确保上传的是有效的CSV文件。');
      }
    };
    reader.readAsText(file);
  };

  // 处理分布生成
  const handleDistributionGenerate = (type: string) => {
    const params = {
      type,
      params: {} as any,
      sampleSize: 1000
    };

    // 设置默认参数
    switch (type) {
      case 'normal':
        params.params = { mean: 0, stdDev: 1 };
        break;
      case 'uniform':
        params.params = { min: 0, max: 1 };
        break;
      case 'exponential':
        params.params = { lambda: 1 };
        break;
      case 'poisson':
        params.params = { rate: 5 };
        break;
    }

    const generatedData = generateDistributionData(params);
    setData(generatedData);
    setIsUserUploadedData(true);
  };

  // 处理AI生成数据
  const handleAIGenerateData = () => {
    // 这里是一个模拟实现，实际应用中应该连接到AI API
    const mockData: number[] = [];
    for (let i = 0; i < 500; i++) {
      mockData.push(20 + Math.random() * 60); // 生成20-80之间的随机数
    }
    setData(mockData);
    setIsUserUploadedData(true);
    alert('AI生成数据功能：这里是模拟数据，实际应用中应连接到AI API。');
  };

  // 处理清除数据
  const handleClearData = () => {
    setData([]);
    setAnalysisResult({});
    setIsUserUploadedData(false);
  };

  // 数据变化时自动分析
  useEffect(() => {
    if (data.length > 0) {
      analyzeData();
    }
  }, [data]);

  // 首次加载时生成示例数据
  useEffect(() => {
    if (data.length === 0) {
      const params = {
        type: 'normal',
        params: { mean: 50, stdDev: 15 },
        sampleSize: 1000
      };
      const exampleData = generateDistributionData(params);
      setData(exampleData);
    }
  }, []);

  return (
    <ConfigProvider theme={theme === 'dark' ? antdTheme : lightTheme}>
      <div className="min-h-screen">
      {/* Hero Section - 全屏 */}
      <section className="hero-section relative">
        {/* 背景装饰 */}
        <div className="hero-bg-decoration">
          <div className="hero-bg-circle"></div>
          <div className="hero-bg-circle"></div>
          <div className="hero-bg-circle"></div>
        </div>

        {/* 右上角功能按钮 - 在hero section背景上 */}
        <div className="absolute top-6 right-6 z-30 flex items-center space-x-3">
          <button
            onClick={() => {
              console.log('点击教程按钮');
              setCurrentView('tutorial');
            }}
            className="w-14 h-14 rounded-full bg-monokai/90 backdrop-blur-md border-2 border-monokai-blue/50 flex items-center justify-center text-monokai-blue hover:bg-monokai-blue hover:text-monokai-bg transition-all duration-300 shadow-xl hover:shadow-monokai hover:scale-110"
            title="使用教程"
          >
            <i className="fa fa-info-circle text-2xl"></i>
          </button>
          <button
            onClick={() => {
              console.log('点击设置按钮');
              setCurrentView('settings');
            }}
            className="w-14 h-14 rounded-full bg-monokai/90 backdrop-blur-md border-2 border-monokai-orange/50 flex items-center justify-center text-monokai-orange hover:bg-monokai-orange hover:text-monokai-bg transition-all duration-300 shadow-xl hover:shadow-monokai hover:scale-110"
            title="设置"
          >
            <i className="fa fa-cog text-2xl"></i>
          </button>
        </div>

        {/* Hero 内容 */}
        <div className="hero-content">
          <h1 className="hero-title">
            <span style={{ color: 'var(--monokai-orange)' }}>数据分析师</span> Web应用
          </h1>
          <p className="hero-subtitle">
            基于AI驱动的数据分析平台，支持多种数据源输入、统计分析、可视化展示和智能数据生成
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => {
                setCurrentView('analysis');
                // 自动滚动到分析区域
                setTimeout(() => {
                  const analysisSection = document.querySelector('.analysis-section');
                  if (analysisSection) {
                    analysisSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="hero-primary-btn"
            >
              <i className="fa fa-rocket mr-2"></i>
              开始分析
            </button>
            <button
              onClick={() => setCurrentView('tutorial')}
              className="hero-secondary-btn"
            >
              <i className="fa fa-book mr-2"></i>
              学习教程
            </button>
          </div>
        </div>
      </section>

      {/* 主内容区域 */}
      <main className="flex-grow bg-monokai">
        <div className="container mx-auto px-4 py-8">
          {/* 数据分析视图 */}
          {currentView === 'analysis' && (
            <div className="analysis-section grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-12">
                <DataInputSection
                  inputMethod={inputMethod}
                  setInputMethod={setInputMethod}
                  handleFileUpload={handleFileUpload}
                  handleDistributionGenerate={handleDistributionGenerate}
                  handleAIGenerateData={handleAIGenerateData}
                  handleClearData={handleClearData}
                  data={data}
                  isUserUploadedData={isUserUploadedData}
                />
                {data.length > 0 && (
                  <AnalysisResultSection
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    analysisResult={analysisResult}
                    data={data}
                  />
                )}
              </div>

              {/* 侧边栏：AI助手和数据信息 */}
              <div className="space-y-6">
                {/* 数据概览 */}
                <div className="bg-monokai-light rounded-2xl p-6 border border-monokai shadow-monokai">
                  <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: 'var(--monokai-fg)' }}>
                    <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'var(--monokai-blue)', color: 'var(--monokai-bg)' }}>
                      <i className="fa fa-database"></i>
                    </div>
                    数据概览
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-monokai border border-monokai">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--monokai-blue)' }}>数据点数量</p>
                          <p className="text-3xl font-bold" style={{ color: 'var(--monokai-fg)' }}>{data.length}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--monokai-blue)', color: 'var(--monokai-bg)' }}>
                          <i className="fa fa-chart-line"></i>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-monokai border border-monokai">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--monokai-green)' }}>数据范围</p>
                          <p className="text-lg font-semibold" style={{ color: 'var(--monokai-fg)' }}>
                            {data.length > 0
                              ? `${Math.min(...data).toFixed(2)} - ${Math.max(...data).toFixed(2)}`
                              : '--'
                            }
                          </p>
                        </div>
                        <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--monokai-green)', color: 'var(--monokai-bg)' }}>
                          <i className="fa fa-arrows-alt-h"></i>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-monokai border border-monokai">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--monokai-purple)' }}>数据类型</p>
                          <p className="text-lg font-semibold" style={{ color: 'var(--monokai-fg)' }}>
                            {data.length > 0 ? '数值型数据' : '--'}
                          </p>
                        </div>
                        <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--monokai-purple)', color: 'var(--monokai-bg)' }}>
                          <i className="fa fa-hashtag"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI助手 */}
                <AIModelChat analysisResult={analysisResult} data={data} />
              </div>
            </div>
          )}

          {/* 教程视图 */}
          {currentView === 'tutorial' && (
            <TutorialSection />
          )}

          {/* 设置视图 */}
          {currentView === 'settings' && (
            <AliyunAPIConfig />
          )}
        </div>
      </main>

      {/* 右侧配置栏切换按钮 */}
      <button
        onClick={() => setSettingsDrawerOpen(true)}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-monokai rounded-l-lg shadow-lg hover:bg-monokai-light transition-colors"
        style={{
          backgroundColor: 'var(--monokai-purple)',
          color: 'var(--monokai-bg)',
        }}
        title="界面配置"
      >
        <i className="fa fa-cog text-lg"></i>
      </button>

      {/* 主题设置抽屉 */}
      <ThemeSettingsDrawer
        open={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* 页脚 */}
      <footer className="bg-monokai-dark border-t border-monokai py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="mb-3">
                <h3 className="text-lg font-bold" style={{ color: 'var(--monokai-fg)' }}>数据分析师Web应用</h3>
                <p className="text-sm text-monokai-gray">AI驱动的数据分析平台</p>
              </div>
              <p className="text-sm text-monokai-dim">© 2024 数据分析师Web应用. 保留所有权利.</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com/A1motoro/Analyzer_for_AIE1901" target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-lg bg-monokai-light hover:bg-monokai text-monokai-gray hover:text-monokai-fg transition">
                <i className="fa fa-github text-xl"></i>
              </a>
              <a href="#" className="p-3 rounded-lg bg-monokai-light hover:bg-monokai text-monokai-gray hover:text-monokai-fg transition">
                <i className="fa fa-twitter text-xl"></i>
              </a>
              <a href="#" className="p-3 rounded-lg bg-monokai-light hover:bg-monokai text-monokai-gray hover:text-monokai-fg transition">
                <i className="fa fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          {/* 装饰性分割线 */}
          <div className="mt-8 pt-8 border-t border-monokai">
            <div className="flex justify-center space-x-8 text-sm text-monokai-dim">
              <span>🚀 现代化设计</span>
              <span>🤖 AI驱动</span>
              <span>📊 数据可视化</span>
              <span>⚡ 高性能</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </ConfigProvider>
  );
};

export default App;
