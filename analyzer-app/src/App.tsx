import React, { useState, useEffect } from 'react';
import { ConfigProvider, Modal, Radio, Space, Typography, Divider, Button, Drawer } from 'antd';
import DataInputSection from './components/DataInputSection';
import AnalysisResultSection from './components/AnalysisResultSection';
import AIModelChat from './components/AIModelChat';
import TutorialSection from './components/TutorialSection';
import AliyunAPIConfig from './components/AliyunAPIConfig';
import { darkTheme, lightTheme } from './theme';
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

  // 主题、设置和抽屉状态
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      // 应用VSCode Light主题的CSS变量
      root.style.setProperty('--monokai-bg', '#ffffff');
      root.style.setProperty('--monokai-bg-dark', '#ffffff');
      root.style.setProperty('--monokai-bg-light', '#f3f3f3');
      root.style.setProperty('--monokai-bg-lighter', '#ffffff');
      root.style.setProperty('--monokai-fg', '#000000');
      root.style.setProperty('--monokai-fg-dim', '#6c6c6c');
      root.style.setProperty('--monokai-orange', '#007acc');
      root.style.setProperty('--monokai-yellow', '#c79100');
      root.style.setProperty('--monokai-green', '#107c10');
      root.style.setProperty('--monokai-blue', '#007acc');
      root.style.setProperty('--monokai-purple', '#007acc');
      root.style.setProperty('--monokai-pink', '#d13438');
      root.style.setProperty('--monokai-gray', '#6c6c6c');
      root.style.setProperty('--monokai-overlay', 'rgba(0, 0, 0, 0.45)');
      root.style.setProperty('--monokai-glass', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--monokai-shadow', '0 4px 20px rgba(0, 0, 0, 0.08)');
    } else {
      // 应用VSCode Dark主题的CSS变量
      root.style.setProperty('--monokai-bg', '#1e1e1e');
      root.style.setProperty('--monokai-bg-dark', '#1e1e1e');
      root.style.setProperty('--monokai-bg-light', '#252526');
      root.style.setProperty('--monokai-bg-lighter', '#2d2d30');
      root.style.setProperty('--monokai-fg', '#cccccc');
      root.style.setProperty('--monokai-fg-dim', '#8c8c8c');
      root.style.setProperty('--monokai-orange', '#fd971f');
      root.style.setProperty('--monokai-yellow', '#dcdcaa');
      root.style.setProperty('--monokai-green', '#4ec9b0');
      root.style.setProperty('--monokai-blue', '#4fc3f7');
      root.style.setProperty('--monokai-purple', '#4fc3f7');
      root.style.setProperty('--monokai-pink', '#f44747');
      root.style.setProperty('--monokai-gray', '#8c8c8c');
      root.style.setProperty('--monokai-overlay', 'rgba(0, 0, 0, 0.8)');
      root.style.setProperty('--monokai-glass', 'rgba(30, 30, 30, 0.85)');
      root.style.setProperty('--monokai-shadow', '0 4px 20px rgba(0, 0, 0, 0.3)');
    }
  };

  // 主题切换处理函数
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
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
    <ConfigProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <div className="min-h-screen">
      {/* Hero Section - 全屏 */}
      <section className="hero-section relative">
        {/* 背景装饰 */}
        <div className="hero-bg-decoration">
          <div className="hero-bg-circle"></div>
          <div className="hero-bg-circle"></div>
          <div className="hero-bg-circle"></div>
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

      {/* 设置模态框 */}
      <Modal
        title={
          <Space>
            <span>⚙️ 设置</span>
          </Space>
        }
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={[
          <Button key="close" onClick={() => setSettingsOpen(false)}>
            关闭
          </Button>
        ]}
        width={400}
        centered
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 主题选择 */}
          <div>
            <Typography.Title level={5}>🎨 主题选择</Typography.Title>
            <Radio.Group
              value={theme}
              onChange={() => {
                toggleTheme();
                setSettingsOpen(false);
              }}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: `2px solid ${theme === 'dark' ? 'var(--monokai-orange)' : 'transparent'}`,
                    borderRadius: '8px',
                    background: theme === 'dark' ? 'var(--monokai-bg-light)' : 'var(--monokai-bg-lighter)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                    setSettingsOpen(false);
                  }}
                >
                  <Radio value="dark" style={{ marginRight: '12px' }} />
                  <div style={{ flex: 1 }}>
                    <Space>
                      <span>🌙</span>
                      <Typography.Text strong style={{ color: 'var(--monokai-fg)' }}>
                        暗色主题 (VSCode Dark)
                      </Typography.Text>
                    </Space>
                    <Typography.Text style={{
                      fontSize: '12px',
                      color: 'var(--monokai-gray)',
                      display: 'block',
                      marginTop: '4px'
                    }}>
                      护眼的深色主题，适合长时间使用
                    </Typography.Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: `2px solid ${theme === 'light' ? 'var(--monokai-blue)' : 'transparent'}`,
                    borderRadius: '8px',
                    background: theme === 'light' ? 'var(--monokai-bg-light)' : 'var(--monokai-bg-lighter)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                    setSettingsOpen(false);
                  }}
                >
                  <Radio value="light" style={{ marginRight: '12px' }} />
                  <div style={{ flex: 1 }}>
                    <Space>
                      <span>☀️</span>
                      <Typography.Text strong style={{ color: 'var(--monokai-fg)' }}>
                        亮色主题 (VSCode Light)
                      </Typography.Text>
                    </Space>
                    <Typography.Text style={{
                      fontSize: '12px',
                      color: 'var(--monokai-gray)',
                      display: 'block',
                      marginTop: '4px'
                    }}>
                      清爽的亮色界面，适合明亮环境
                    </Typography.Text>
                  </div>
                </div>
              </Space>
            </Radio.Group>
          </div>

          <Divider />

          {/* 其他设置 */}
          <div>
            <Typography.Title level={5}>🔧 其他设置</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="text"
                block
                style={{
                  textAlign: 'left',
                  color: 'var(--monokai-gray)',
                  border: 'none',
                  background: 'transparent',
                }}
                onClick={() => {
                  localStorage.removeItem('app-theme');
                  window.location.reload();
                }}
              >
                🔄 重置为默认设置
              </Button>
            </Space>
          </div>
        </Space>
      </Modal>

      {/* 右侧功能抽屉切换按钮 */}
      <button
        onClick={() => setDrawerOpen(true)}
        style={{
          position: 'fixed',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          padding: '12px',
          backgroundColor: 'var(--monokai-purple)',
          color: 'var(--monokai-bg)',
          border: 'none',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
          boxShadow: 'var(--monokai-shadow)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
          e.currentTarget.style.backgroundColor = 'var(--monokai-orange)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.backgroundColor = 'var(--monokai-purple)';
        }}
        title="打开功能面板"
      >
        <i className="fa fa-arrow-left text-lg"></i>
      </button>

      {/* 右侧功能抽屉 */}
      <Drawer
        title={
          <Space>
            <span>🎛️ 功能面板</span>
          </Space>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={300}
        bodyStyle={{
          padding: '24px',
          background: theme === 'dark' ? 'var(--monokai-bg-light)' : 'var(--monokai-bg-lighter)',
        }}
        headerStyle={{
          background: theme === 'dark' ? 'var(--monokai-bg-lighter)' : 'var(--monokai-bg-light)',
          borderBottom: theme === 'dark' ? '1px solid var(--monokai-bg-lighter)' : '1px solid var(--monokai-gray)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 功能按钮 */}
          <div>
            <Typography.Title level={5} style={{ color: 'var(--monokai-fg)' }}>🚀 快捷功能</Typography.Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* 教程按钮 */}
              <Button
                type="text"
                block
                icon={<i className="fa fa-info-circle mr-2"></i>}
                onClick={() => {
                  setCurrentView('tutorial');
                  setDrawerOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  height: '48px',
                  color: 'var(--monokai-blue)',
                  border: '1px solid var(--monokai-blue)',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                className="hover:bg-monokai-blue hover:text-monokai-bg transition-all duration-200"
              >
                <span className="ml-2">使用教程</span>
              </Button>

              {/* 设置按钮 */}
              <Button
                type="text"
                block
                icon={<i className="fa fa-cog mr-2"></i>}
                onClick={() => {
                  setSettingsOpen(true);
                  setDrawerOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  height: '48px',
                  color: 'var(--monokai-purple)',
                  border: '1px solid var(--monokai-purple)',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                className="hover:bg-monokai-purple hover:text-monokai-bg transition-all duration-200"
              >
                <span className="ml-2">系统设置</span>
              </Button>

              {/* 主题切换按钮 */}
              <Button
                type="text"
                block
                icon={theme === 'dark' ? <i className="fa fa-sun-o mr-2"></i> : <i className="fa fa-moon-o mr-2"></i>}
                onClick={() => {
                  toggleTheme();
                  setDrawerOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  height: '48px',
                  color: 'var(--monokai-orange)',
                  border: '1px solid var(--monokai-orange)',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                className="hover:bg-monokai-orange hover:text-monokai-bg transition-all duration-200"
              >
                <span className="ml-2">
                  {theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
                </span>
              </Button>
            </Space>
          </div>

          <Divider style={{
            borderColor: theme === 'dark' ? 'var(--monokai-bg-lighter)' : 'var(--monokai-gray)'
          }} />

          {/* 信息 */}
          <div>
            <Typography.Title level={5} style={{ color: 'var(--monokai-fg)' }}>ℹ️ 关于</Typography.Title>
            <Typography.Text style={{
              fontSize: '12px',
              color: 'var(--monokai-gray)',
              lineHeight: '1.5'
            }}>
              数据分析师Web应用提供现代化的数据分析体验，
              支持多种统计方法和AI辅助分析。
            </Typography.Text>
          </div>
        </Space>
      </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default App;
