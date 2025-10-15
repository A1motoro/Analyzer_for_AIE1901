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
    <div className="min-h-screen flex flex-col bg-neutral">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fa fa-bar-chart text-2xl text-primary"></i>
            <h1 className="text-xl font-bold text-gray-800">数据分析师Web应用</h1>
          </div>

          {/* 主导航 */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('analysis')}
              className={`flex items-center font-medium ${
                currentView === 'analysis' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <i className="fa fa-line-chart mr-2"></i>
              数据分析
            </button>
            <button
              onClick={() => setCurrentView('tutorial')}
              className={`flex items-center font-medium ${
                currentView === 'tutorial' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <i className="fa fa-book mr-2"></i>
              使用教程
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center font-medium ${
                currentView === 'settings' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <i className="fa fa-cog mr-2"></i>
              设置
            </button>
          </nav>

          {/* 移动端菜单按钮 */}
          <button className="md:hidden text-gray-500">
            <i className="fa fa-bars text-xl"></i>
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-grow container mx-auto px-4 py-8">
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
              <div className="bg-white rounded-xl shadow-card p-6 transition-all-300 hover:shadow-card-hover">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <i className="fa fa-database text-primary mr-2"></i>
                  数据概览
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">数据点数量</p>
                    <p className="text-2xl font-bold">{data.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">数据范围</p>
                    <p className="text-lg font-medium">
                      {data.length > 0
                        ? `${Math.min(...data).toFixed(2)} - ${Math.max(...data).toFixed(2)}`
                        : '--'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">数据类型</p>
                    <p className="text-lg font-medium">
                      {data.length > 0 ? '数值型数据' : '--'}
                    </p>
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
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">© 2023 数据分析师Web应用. 保留所有权利.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
