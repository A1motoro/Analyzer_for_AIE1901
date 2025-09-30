import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// 类型定义
declare global {
  interface Window {
    calculateBasicStats(data: number[]): any;
    generateDistributionData(params: any): number[];
    parseCSVContent(content: string): number[];
    calculateMLE(data: number[]): any;
    calculateMoM(data: number[]): any;
    mountApp(): void;
  }
}

// 主应用组件定义
const DataAnalysisApp = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [inputMethod, setInputMethod] = useState('upload');
  const [data, setData] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState({});
  
  // 处理数据分析
  const analyzeData = () => {
    if (data.length === 0) return;
    const basicStats = window.calculateBasicStats(data);
      const mleParams = window.calculateMLE(data);
      const momParams = window.calculateMoM(data);
    
    setAnalysisResult({
      ...basicStats,
      mleParams,
      momParams
    });
  };
  
  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const parsedData = window.parseCSVContent(content);
        setData(parsedData);
      } catch (error) {
        console.error('文件解析错误:', error);
        alert('文件解析错误，请确保上传的是有效的CSV文件。');
      }
    };
    reader.readAsText(file);
  };
  
  // 处理分布生成
  const handleDistributionGenerate = (type) => {
    const params = {
      type,
      params: {} as Record<string, number>,
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
    
    const generatedData = window.generateDistributionData(params);
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
  
  useEffect(() => {
    if (data.length > 0) {
      analyzeData();
    }
  }, [data]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* 应用头部 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa fa-bar-chart text-primary text-2xl"></i>
            <h1 className="text-xl font-bold text-neutral-dark">数据分析师</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-primary font-medium">主页</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-all-300">文档</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-all-300">教程</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-all-300">关于</a>
          </nav>
          <button className="md:hidden text-gray-600">
            <i className="fa fa-bars text-xl"></i>
          </button>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 数据输入区域 */}
        <DataInputSection
          inputMethod={inputMethod}
          setInputMethod={setInputMethod}
          handleFileUpload={handleFileUpload}
          handleDistributionGenerate={handleDistributionGenerate}
          handleAIGenerateData={handleAIGenerateData}
          data={data}
        />
        
        {/* 数据分析结果区域 */}
        {data.length > 0 && (
          <AnalysisResultSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            analysisResult={analysisResult}
            data={data}
          />
        )}
      </main>
      
      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">© 2023 数据分析师Web应用. 保留所有权利.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-all-300">
                <i className="fa fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-all-300">
                <i className="fa fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-all-300">
                <i className="fa fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// 数据输入区域组件
// 数据输入区域组件
const DataInputSection = ({
  inputMethod,
  setInputMethod,
  handleFileUpload,
  handleDistributionGenerate,
  handleAIGenerateData,
  data
}) => {
  return (
    <section className="bg-white rounded-xl card-shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">数据输入</h2>
      
      {/* 输入方法切换标签 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${inputMethod === 'upload' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setInputMethod('upload')}
        >
          <i className="fa fa-upload mr-2"></i>文件上传
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${inputMethod === 'distribution' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setInputMethod('distribution')}
        >
          <i className="fa fa-random mr-2"></i>分布生成
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${inputMethod === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setInputMethod('ai')}
        >
          <i className="fa fa-magic mr-2"></i>AI生成
        </button>
      </div>
      
      {/* 文件上传区域 */}
      {inputMethod === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-all-300 cursor-pointer">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".csv,.txt"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-700 mb-2">拖放文件到此处，或点击上传</p>
            <p className="text-sm text-gray-500">支持 CSV, TXT 格式文件</p>
          </label>
          {data.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 flex items-center">
                <i className="fa fa-check-circle mr-2"></i>
                已成功加载 {data.length} 条数据
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* 分布生成区域 */}
      {inputMethod === 'distribution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 hover:border-primary transition-all-300 cursor-pointer">
            <button 
              className="w-full text-left" 
              onClick={() => handleDistributionGenerate('normal')}
            >
              <h3 className="font-medium text-gray-800">正态分布</h3>
              <p className="text-sm text-gray-500 mt-1">生成符合正态分布的随机数据</p>
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:border-primary transition-all-300 cursor-pointer">
            <button 
              className="w-full text-left" 
              onClick={() => handleDistributionGenerate('uniform')}
            >
              <h3 className="font-medium text-gray-800">均匀分布</h3>
              <p className="text-sm text-gray-500 mt-1">生成符合均匀分布的随机数据</p>
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:border-primary transition-all-300 cursor-pointer">
            <button 
              className="w-full text-left" 
              onClick={() => handleDistributionGenerate('exponential')}
            >
              <h3 className="font-medium text-gray-800">指数分布</h3>
              <p className="text-sm text-gray-500 mt-1">生成符合指数分布的随机数据</p>
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:border-primary transition-all-300 cursor-pointer">
            <button 
              className="w-full text-left" 
              onClick={() => handleDistributionGenerate('poisson')}
            >
              <h3 className="font-medium text-gray-800">泊松分布</h3>
              <p className="text-sm text-gray-500 mt-1">生成符合泊松分布的随机数据</p>
            </button>
          </div>
        </div>
      )}
      
      {/* AI生成区域 */}
      {inputMethod === 'ai' && (
        <div className="text-center">
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <i className="fa fa-magic text-5xl text-accent mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI 数据生成</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              通过人工智能算法生成符合特定模式的数据，无需手动输入或上传文件。
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <button
              className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-medium transition-all-300 flex items-center"
              onClick={handleAIGenerateData}
            >
              <i className="fa fa-play-circle mr-2"></i>
              生成示例数据
            </button>
            <p className="text-sm text-gray-500">点击按钮生成示例数据进行分析</p>
          </div>
        </div>
      )}
    </section>
  );
};

// 分析结果区域组件
const AnalysisResultSection = ({
  activeTab,
  setActiveTab,
  analysisResult,
  data
}) => {
  return (
    <section className="bg-white rounded-xl card-shadow p-6">
      <h2 className="text-xl font-bold mb-4">数据分析结果</h2>
      
      {/* 分析类型切换标签 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('basic')}
        >
          基本统计
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${activeTab === 'advanced' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('advanced')}
        >
          MLE/MoM 分析
        </button>
      </div>
      
      {/* 基本统计结果 */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">均值</p>
            <p className="text-xl font-bold text-gray-800">{analysisResult.mean?.toFixed(4)}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">中位数</p>
            <p className="text-xl font-bold text-gray-800">{analysisResult.median?.toFixed(4)}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">众数</p>
            <p className="text-xl font-bold text-gray-800">{analysisResult.mode?.toFixed(4)}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">方差</p>
            <p className="text-xl font-bold text-gray-800">{analysisResult.variance?.toFixed(4)}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">标准差</p>
            <p className="text-xl font-bold text-gray-800">{analysisResult.stdDev?.toFixed(4)}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">偏度</p>
            <p className="text-xl font-bold text-gray-800">{analysisResult.skewness?.toFixed(4)}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">峰度</p>
            <p className="text-xl font-bold text-gray-800">{analysisResult.kurtosis?.toFixed(4)}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">数据量</p>
            <p className="text-xl font-bold text-gray-800">{data.length}</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="text-sm text-gray-500">范围</p>
            <p className="text-xl font-bold text-gray-800">
              {Math.min(...data).toFixed(2)} - {Math.max(...data).toFixed(2)}
            </p>
          </div>
        </div>
      )}
      
      {/* MLE/MoM 分析结果 */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">最大似然估计 (MLE)</h3>
            <p className="text-sm text-gray-600">
              最大似然估计是一种参数估计方法，通过最大化似然函数来确定参数值。
              对于当前数据分布，估计的参数如下：
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">均值 (μ)</p>
                <p className="text-lg font-bold text-gray-800">{analysisResult.mleParams?.mean?.toFixed(4)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">方差 (σ²)</p>
                <p className="text-lg font-bold text-gray-800">{analysisResult.mleParams?.variance?.toFixed(4)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">标准差 (σ)</p>
                <p className="text-lg font-bold text-gray-800">{analysisResult.mleParams?.stdDev?.toFixed(4)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-800 mb-2">矩法估计 (MoM)</h3>
            <p className="text-sm text-gray-600">
              矩法估计是一种通过样本矩来估计总体矩，进而估计参数的方法。
              对于当前数据分布，估计的参数如下：
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">均值 (μ)</p>
                <p className="text-lg font-bold text-gray-800">{analysisResult.momParams?.mean?.toFixed(4)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">方差 (σ²)</p>
                <p className="text-lg font-bold text-gray-800">{analysisResult.momParams?.variance?.toFixed(4)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">标准差 (σ)</p>
                <p className="text-lg font-bold text-gray-800">{analysisResult.momParams?.stdDev?.toFixed(4)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">分析说明</h3>
            <p className="text-sm text-gray-600">
              本分析假设数据符合正态分布。对于不同的分布类型，MLE和MoM的估计公式和结果会有所不同。
              在实际应用中，建议先进行分布拟合检验，确定数据最可能符合的分布类型，再进行相应的参数估计。
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

// 将组件挂载到DOM
function mountApp() {
  // 检查必要的工具函数是否已加载
  if (typeof window.calculateBasicStats === 'function' &&
      typeof window.generateDistributionData === 'function' &&
      typeof window.parseCSVContent === 'function' &&
      typeof window.calculateMLE === 'function' &&
      typeof window.calculateMoM === 'function') {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(DataAnalysisApp, null)
      )
    );
  } else {
    console.error('工具函数未正确加载');
    alert('应用加载失败，请刷新页面重试。');
  }
}

// 在全局对象上注册mountApp函数，以便在编译完成后调用
window.mountApp = mountApp;