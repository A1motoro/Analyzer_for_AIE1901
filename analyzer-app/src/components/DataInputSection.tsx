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
    <section className="glass rounded-2xl p-8 mb-8 transition-all-500 hover-lift card-shadow hover:card-shadow-hover animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-neutral-dark">
        <div className="p-3 rounded-xl gradient-accent text-white mr-4">
          <i className="fa fa-upload"></i>
        </div>
        数据输入
      </h2>

      {/* 输入方法切换标签 */}
      <div className="flex flex-wrap gap-3 mb-8 p-2 rounded-xl bg-white/50">
        <button
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all-300 hover-lift ${
            inputMethod === 'upload'
              ? 'gradient-primary text-white shadow-lg glow-primary'
              : 'bg-white/60 text-neutral-dark hover:bg-white hover:text-primary'
          }`}
          onClick={() => setInputMethod('upload')}
        >
          <i className="fa fa-upload mr-2"></i>
          文件上传
        </button>
        <button
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all-300 hover-lift ${
            inputMethod === 'distribution'
              ? 'gradient-secondary text-white shadow-lg'
              : 'bg-white/60 text-neutral-dark hover:bg-white hover:text-secondary'
          }`}
          onClick={() => setInputMethod('distribution')}
        >
          <i className="fa fa-random mr-2"></i>
          分布生成
        </button>
        <button
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all-300 hover-lift ${
            inputMethod === 'ai'
              ? 'gradient-accent text-white shadow-lg'
              : 'bg-white/60 text-neutral-dark hover:bg-white hover:text-accent'
          }`}
          onClick={() => setInputMethod('ai')}
        >
          <i className="fa fa-magic mr-2"></i>
          AI生成
        </button>
      </div>

      {/* 文件上传区域 */}
      {inputMethod === 'upload' && (
        <div className="space-y-6">
          <div className="relative border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all-500 hover-lift group">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-primary mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <i className="fa fa-file-text-o text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">点击上传CSV文件</h3>
              <p className="text-neutral-dark/70">或拖拽文件到此处</p>
              <div className="mt-4 text-sm text-neutral-dark/50">
                <i className="fa fa-info-circle mr-1"></i>
                支持 .csv 格式文件
              </div>
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
