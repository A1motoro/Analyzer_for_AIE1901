import React, { useState, useEffect } from 'react';
import DataInputSection from './components/DataInputSection';
import AnalysisResultSection from './components/AnalysisResultSection';
import AIModelChat from './components/AIModelChat';
import TutorialSection from './components/TutorialSection';
import AliyunAPIConfig from './components/AliyunAPIConfig';
import { calculateBasicStats, parseCSVContent, generateDistributionData, calculateMLE, calculateMoM } from './utils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [inputMethod, setInputMethod] = useState('upload');
  const [data, setData] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>({});
  const [currentView, setCurrentView] = useState<'analysis' | 'tutorial' | 'settings'>('analysis');

  // 处理数据分析
  const analyzeData = () => {
    if (data.length === 0) return;
    const basicStats = calculateBasicStats(data);
    const mleParams = calculateMLE(data);
    const momParams = calculateMoM(data);

    setAnalysisResult({
      ...basicStats,
      mleParams,
      momParams
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
  };

  // 处理AI生成数据
  const handleAIGenerateData = () => {
    // 这里是一个模拟实现，实际应用中应该连接到AI API
    const mockData: number[] = [];
    for (let i = 0; i < 500; i++) {
      mockData.push(20 + Math.random() * 60); // 生成20-80之间的随机数
    }
    setData(mockData);
    alert('AI生成数据功能：这里是模拟数据，实际应用中应连接到AI API。');
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
    <div className="min-h-screen flex flex-col gradient-bg">
      {/* 顶部导航栏 */}
      <header className="glass sticky top-0 z-10 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="p-2 rounded-xl gradient-primary text-white shadow-lg">
              <i className="fa fa-bar-chart text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-dark">数据分析师Web应用</h1>
              <p className="text-xs text-neutral-dark/70">AI驱动的数据分析平台</p>
            </div>
          </div>

          {/* 主导航 */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('analysis')}
              className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all-300 hover-lift ${
                currentView === 'analysis'
                  ? 'gradient-primary text-white shadow-lg glow-primary'
                  : 'text-neutral-dark hover:bg-white/60 hover:text-primary'
              }`}
            >
              <i className="fa fa-line-chart mr-2"></i>
              数据分析
            </button>
            <button
              onClick={() => setCurrentView('tutorial')}
              className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all-300 hover-lift ${
                currentView === 'tutorial'
                  ? 'gradient-primary text-white shadow-lg glow-primary'
                  : 'text-neutral-dark hover:bg-white/60 hover:text-primary'
              }`}
            >
              <i className="fa fa-book mr-2"></i>
              使用教程
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all-300 hover-lift ${
                currentView === 'settings'
                  ? 'gradient-primary text-white shadow-lg glow-primary'
                  : 'text-neutral-dark hover:bg-white/60 hover:text-primary'
              }`}
            >
              <i className="fa fa-cog mr-2"></i>
              设置
            </button>
          </nav>

          {/* 移动端菜单按钮 */}
          <button className="md:hidden p-2 rounded-xl text-neutral-dark hover:bg-white/60 transition-all-300 hover-lift">
            <i className="fa fa-bars text-xl"></i>
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        {/* 数据分析视图 */}
        {currentView === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              <DataInputSection
                inputMethod={inputMethod}
                setInputMethod={setInputMethod}
                handleFileUpload={handleFileUpload}
                handleDistributionGenerate={handleDistributionGenerate}
                handleAIGenerateData={handleAIGenerateData}
                data={data}
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
              <div className="glass rounded-2xl p-6 transition-all-500 hover-lift card-shadow hover:card-shadow-hover animate-slide-in-right">
                <h3 className="text-lg font-bold mb-4 flex items-center text-neutral-dark">
                  <div className="p-2 rounded-lg gradient-secondary text-white mr-3">
                    <i className="fa fa-database"></i>
                  </div>
                  数据概览
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">数据点数量</p>
                        <p className="text-3xl font-bold text-blue-800">{data.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-500 text-white">
                        <i className="fa fa-chart-line"></i>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">数据范围</p>
                        <p className="text-lg font-semibold text-green-800">
                          {data.length > 0
                            ? `${Math.min(...data).toFixed(2)} - ${Math.max(...data).toFixed(2)}`
                            : '--'
                          }
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-green-500 text-white">
                        <i className="fa fa-arrows-alt-h"></i>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">数据类型</p>
                        <p className="text-lg font-semibold text-purple-800">
                          {data.length > 0 ? '数值型数据' : '--'}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-purple-500 text-white">
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
      </main>

      {/* 页脚 */}
      <footer className="glass-dark mt-16 py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                <div className="p-2 rounded-xl gradient-primary text-white">
                  <i className="fa fa-bar-chart"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">数据分析师Web应用</h3>
                  <p className="text-sm text-white/70">AI驱动的数据分析平台</p>
                </div>
              </div>
              <p className="text-sm text-white/60">© 2024 数据分析师Web应用. 保留所有权利.</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com/A1motoro/Analyzer_for_AIE1901" target="_blank" rel="noopener noreferrer"
                 className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all-300 hover-lift">
                <i className="fa fa-github text-xl"></i>
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all-300 hover-lift">
                <i className="fa fa-twitter text-xl"></i>
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all-300 hover-lift">
                <i className="fa fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          {/* 装饰性分割线 */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex justify-center space-x-8 text-sm text-white/50">
              <span>🚀 现代化设计</span>
              <span>🤖 AI驱动</span>
              <span>📊 数据可视化</span>
              <span>⚡ 高性能</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
