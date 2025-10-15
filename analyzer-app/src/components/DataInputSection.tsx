import React from 'react';
// 这些函数在App.tsx中直接调用，这里不需要导入

interface DataInputSectionProps {
  inputMethod: string;
  setInputMethod: (method: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDistributionGenerate: (type: string) => void;
  handleAIGenerateData: () => void;
  data: number[];
}

const DataInputSection: React.FC<DataInputSectionProps> = ({
  inputMethod,
  setInputMethod,
  handleFileUpload,
  handleDistributionGenerate,
  handleAIGenerateData,
  data
}) => {
  return (
    <section className="bg-white rounded-xl shadow-card p-6 mb-8 transition-all-300 hover:shadow-card-hover animate-slide-up">
      <h2 className="text-xl font-bold mb-4">数据输入</h2>

      {/* 输入方法切换标签 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${
            inputMethod === 'upload'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setInputMethod('upload')}
        >
          <i className="fa fa-upload mr-2"></i>
          文件上传
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${
            inputMethod === 'distribution'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setInputMethod('distribution')}
        >
          <i className="fa fa-random mr-2"></i>
          分布生成
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${
            inputMethod === 'ai'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setInputMethod('ai')}
        >
          <i className="fa fa-magic mr-2"></i>
          AI生成
        </button>
      </div>

      {/* 文件上传区域 */}
      {inputMethod === 'upload' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition-all-300">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <i className="fa fa-file-text-o text-5xl text-gray-400 mb-4"></i>
              <br />
              <span className="font-medium text-primary">点击上传CSV文件</span>
              <p className="text-sm text-gray-500 mt-2">或拖拽文件到此处</p>
            </label>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium mb-1 flex items-center">
              <i className="fa fa-info-circle text-primary mr-2"></i>
              文件格式要求
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>支持CSV格式的文件</li>
              <li>第一列应为数值数据</li>
              <li>第一行为可选的标题行</li>
            </ul>
          </div>
          {data.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <i className="fa fa-check-circle text-green-500 mr-3"></i>
              <span className="text-green-700">已成功导入 {data.length} 个数据点</span>
            </div>
          )}
        </div>
      )}

      {/* 分布生成区域 */}
      {inputMethod === 'distribution' && (
        <div className="space-y-4">
          <p className="text-gray-600">选择分布类型并生成数据：</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="bg-white border border-gray-300 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all-300 flex flex-col items-center"
              onClick={() => handleDistributionGenerate('normal')}
            >
              <i className="fa fa-bell text-2xl text-primary mb-2"></i>
              <span className="font-medium">正态分布</span>
              <span className="text-xs text-gray-500">N(μ, σ²)</span>
            </button>
            <button
              className="bg-white border border-gray-300 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all-300 flex flex-col items-center"
              onClick={() => handleDistributionGenerate('uniform')}
            >
              <i className="fa fa-arrows-h text-2xl text-primary mb-2"></i>
              <span className="font-medium">均匀分布</span>
              <span className="text-xs text-gray-500">U(a, b)</span>
            </button>
            <button
              className="bg-white border border-gray-300 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all-300 flex flex-col items-center"
              onClick={() => handleDistributionGenerate('exponential')}
            >
              <i className="fa fa-line-chart text-2xl text-primary mb-2"></i>
              <span className="font-medium">指数分布</span>
              <span className="text-xs text-gray-500">Exp(λ)</span>
            </button>
            <button
              className="bg-white border border-gray-300 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all-300 flex flex-col items-center"
              onClick={() => handleDistributionGenerate('poisson')}
            >
              <i className="fa fa-dot-circle-o text-2xl text-primary mb-2"></i>
              <span className="font-medium">泊松分布</span>
              <span className="text-xs text-gray-500">Poisson(λ)</span>
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium mb-1 flex items-center">
              <i className="fa fa-lightbulb-o text-primary mr-2"></i>
              提示
            </p>
            <p>点击任意分布类型按钮，将使用默认参数生成1000个随机数据点。</p>
          </div>
          {data.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <i className="fa fa-check-circle text-blue-500 mr-3"></i>
              <span className="text-blue-700">已成功生成 {data.length} 个随机数据点</span>
            </div>
          )}
        </div>
      )}

      {/* AI生成区域 */}
      {inputMethod === 'ai' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6 text-center">
            <i className="fa fa-magic text-5xl text-purple-500 mb-4"></i>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">AI 数据生成</h3>
            <p className="text-gray-600 mb-6">使用先进的AI算法生成符合您需求的数据集</p>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all-300 flex items-center justify-center mx-auto"
              onClick={handleAIGenerateData}
            >
              <i className="fa fa-cog fa-spin mr-2"></i>
              生成数据
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium mb-1 flex items-center">
              <i className="fa fa-info-circle text-primary mr-2"></i>
              关于AI数据生成
            </p>
            <p>此功能使用模拟数据生成算法，实际应用中可连接到真实的AI API生成更符合特定需求的数据。</p>
          </div>
          {data.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center">
              <i className="fa fa-check-circle text-purple-500 mr-3"></i>
              <span className="text-purple-700">已成功生成 {data.length} 个AI数据点</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default DataInputSection;
