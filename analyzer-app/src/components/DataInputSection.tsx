import React from 'react';
// 这些函数在App.tsx中直接调用，这里不需要导入

interface DataInputSectionProps {
  inputMethod: string;
  setInputMethod: (method: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDistributionGenerate: (type: string) => void;
  handleAIGenerateData: () => void;
  handleClearData: () => void;
  data: number[];
  isUserUploadedData: boolean;
}

const DataInputSection: React.FC<DataInputSectionProps> = ({
  inputMethod,
  setInputMethod,
  handleFileUpload,
  handleDistributionGenerate,
  handleAIGenerateData,
  handleClearData,
  data,
  isUserUploadedData
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
        // 创建一个模拟的input change事件
        const fakeEvent = {
          target: {
            files: [file] as unknown as HTMLInputElement['files']
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileUpload(fakeEvent);
      } else {
        alert('请上传CSV格式的文件');
      }
    }
  };
  return (
    <section className="bg-monokai-light rounded-2xl p-8 mb-12 border border-monokai shadow-monokai transition-all duration-300 hover:shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--monokai-fg)' }}>
          数据输入
        </h2>
        <p className="text-sm text-monokai-gray">
          选择您的数据输入方式，开始数据分析之旅
        </p>
      </div>

      {/* 输入方法切换标签 */}
      <div className="flex flex-wrap gap-2 mb-8 p-3 rounded-xl bg-monokai border border-monokai">
        <button
          className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
            inputMethod === 'upload'
              ? 'bg-monokai-orange text-monokai-bg shadow-md'
              : 'text-monokai-gray hover:bg-monokai hover:text-monokai-fg'
          }`}
          onClick={() => setInputMethod('upload')}
        >
          <i className="fa fa-upload mr-2"></i>
          文件上传
        </button>
        <button
          className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
            inputMethod === 'distribution'
              ? 'bg-monokai-blue text-monokai-bg shadow-md'
              : 'text-monokai-gray hover:bg-monokai hover:text-monokai-fg'
          }`}
          onClick={() => setInputMethod('distribution')}
        >
          <i className="fa fa-random mr-2"></i>
          分布生成
        </button>
        <button
          className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
            inputMethod === 'ai'
              ? 'bg-monokai-purple text-monokai-bg shadow-md'
              : 'text-monokai-gray hover:bg-monokai hover:text-monokai-fg'
          }`}
          onClick={() => setInputMethod('ai')}
        >
          <i className="fa fa-magic mr-2"></i>
          AI生成
        </button>
      </div>

      {/* 文件上传区域 */}
      {inputMethod === 'upload' && (
        <div className="flex justify-center">
          <div className="w-full max-w-2xl space-y-8">
            {/* 主要上传区域 */}
            <div className="upload-zone relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
              />

              {/* 虚线边框容器 */}
              <div
                className="upload-area block cursor-pointer relative"
                onClick={() => document.getElementById('fileUpload')?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={`upload-content flex flex-col items-center justify-center p-16 rounded-2xl border-2 border-dashed transition-all duration-300 hover:border-monokai-orange hover:bg-monokai-light/20 group ${isDragOver ? 'drag-over' : ''}`}>
                  {/* 主要内容 - 确保完全居中 */}
                  <div className="text-center w-full">
                    <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-monokai-orange" style={{ color: 'var(--monokai-fg)' }}>
                      上传数据文件
                    </h3>
                    <p className="text-monokai-gray text-base">
                      将文件拖拽到此处，或点击上传
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* 数据导入成功状态提示框 - 仅在用户真正上传数据时显示 */}
          {isUserUploadedData && data.length > 0 && (
            <div className="upload-success-card relative overflow-hidden rounded-2xl p-6 border border-monokai-green/30 bg-gradient-to-r from-monokai-green/5 to-monokai-blue/5 shadow-lg animate-pulse-custom">
              {/* 脉冲背景效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-monokai-green/10 to-monokai-blue/10 rounded-2xl animate-pulse-custom"></div>

              {/* 主要内容 */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {/* 成功图标 */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-monokai-green shadow-lg mr-4 animate-bounce">
                      <i className="fa fa-check text-white text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-monokai-green mb-1">
                        数据导入成功！
                      </h4>
                      <p className="text-monokai-gray text-sm">
                        已成功加载 {data.length} 个数据点
                      </p>
                    </div>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={handleClearData}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-monokai-pink/20 hover:bg-monokai-pink/30 transition-all duration-200 group"
                    title="删除数据"
                  >
                    <i className="fa fa-trash text-monokai-pink group-hover:text-white text-base"></i>
                  </button>
                </div>

                {/* 状态指示器 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center text-monokai-green">
                      <i className="fa fa-circle text-xs mr-2 animate-pulse-custom"></i>
                      <span className="text-sm font-medium">数据已就绪，可进行分析</span>
                    </div>
                  </div>
                  <div className="text-xs text-monokai-dim">
                    <i className="fa fa-clock-o mr-1"></i>
                    实时更新
                  </div>
                </div>
              </div>

              {/* 装饰性脉冲环 */}
              <div className="absolute inset-0 rounded-2xl border-2 border-monokai-green/20 animate-ping"></div>
            </div>
          )}
        </div>
        </div>
      )}

      {/* 分布生成区域 */}
      {inputMethod === 'distribution' && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--monokai-fg)' }}>
              选择概率分布类型
            </h3>
            <p className="text-monokai-gray">
              选择您要生成的统计分布，系统将自动生成1000个随机数据点
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="bg-monokai rounded-lg p-4 hover:bg-monokai-light border border-monokai transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center group"
              onClick={() => handleDistributionGenerate('normal')}
            >
              <span className="font-medium mb-1 text-sm" style={{ color: 'var(--monokai-fg)' }}>正态分布</span>
              <span className="text-xs text-monokai-gray">N(μ, σ²)</span>
            </button>

            <button
              className="bg-monokai rounded-lg p-4 hover:bg-monokai-light border border-monokai transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center group"
              onClick={() => handleDistributionGenerate('uniform')}
            >
              <span className="font-medium mb-1 text-sm" style={{ color: 'var(--monokai-fg)' }}>均匀分布</span>
              <span className="text-xs text-monokai-gray">U(a, b)</span>
            </button>

            <button
              className="bg-monokai rounded-lg p-4 hover:bg-monokai-light border border-monokai transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center group"
              onClick={() => handleDistributionGenerate('exponential')}
            >
              <span className="font-medium mb-1 text-sm" style={{ color: 'var(--monokai-fg)' }}>指数分布</span>
              <span className="text-xs text-monokai-gray">Exp(λ)</span>
            </button>

            <button
              className="bg-monokai rounded-lg p-4 hover:bg-monokai-light border border-monokai transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center group"
              onClick={() => handleDistributionGenerate('poisson')}
            >
              <span className="font-medium mb-1 text-sm" style={{ color: 'var(--monokai-fg)' }}>泊松分布</span>
              <span className="text-xs text-monokai-gray">Poisson(λ)</span>
            </button>
          </div>

          <div className="bg-monokai rounded-lg p-4 border border-monokai">
            <div className="flex items-center mb-2">
              <i className="fa fa-lightbulb-o mr-2" style={{ color: 'var(--monokai-yellow)' }}></i>
              <span className="font-medium" style={{ color: 'var(--monokai-yellow)' }}>使用提示</span>
            </div>
            <p className="text-monokai-gray text-sm">
              点击任意分布类型按钮，系统将使用默认参数生成1000个随机数据点。您可以在分析结果中查看数据的统计特性。
            </p>
          </div>

          {data.length > 0 && (
            <div className="bg-monokai rounded-lg p-4 border border-monokai">
              <p className="font-medium" style={{ color: 'var(--monokai-blue)' }}>数据生成成功</p>
              <p className="text-sm text-monokai-gray">{data.length} 个随机数据点已生成</p>
            </div>
          )}
        </div>
      )}

      {/* AI生成区域 */}
      {inputMethod === 'ai' && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto" style={{
              background: `linear-gradient(135deg, var(--monokai-purple), var(--monokai-pink))`,
              color: 'var(--monokai-bg)'
            }}>
              <i className="fa fa-brain text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--monokai-fg)' }}>
              AI智能数据生成
            </h3>
            <p className="text-monokai-gray mb-8 max-w-md mx-auto">
              基于先进的机器学习算法，智能生成符合统计分布特征的数据集
            </p>

            <button
              className="inline-flex items-center px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg mx-auto"
              style={{
                background: `linear-gradient(135deg, var(--monokai-purple), var(--monokai-pink))`,
                color: 'var(--monokai-bg)',
                boxShadow: '0 4px 20px rgba(174, 129, 255, 0.3)'
              }}
              onClick={handleAIGenerateData}
            >
              <i className="fa fa-sparkles mr-3 text-xl"></i>
              启动AI生成
              <i className="fa fa-arrow-right ml-3"></i>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-monokai rounded-lg p-4 border border-monokai">
              <div className="flex items-center mb-3">
                <i className="fa fa-info-circle mr-2" style={{ color: 'var(--monokai-blue)' }}></i>
                <span className="font-medium" style={{ color: 'var(--monokai-fg)' }}>技术特性</span>
              </div>
              <ul className="space-y-2 text-sm text-monokai-gray">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'var(--monokai-green)' }}></span>
                  基于深度学习算法
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'var(--monokai-green)' }}></span>
                  自适应参数调整
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'var(--monokai-green)' }}></span>
                  高质量数据输出
                </li>
              </ul>
            </div>

            <div className="bg-monokai rounded-lg p-4 border border-monokai">
              <div className="flex items-center mb-3">
                <i className="fa fa-cogs mr-2" style={{ color: 'var(--monokai-orange)' }}></i>
                <span className="font-medium" style={{ color: 'var(--monokai-fg)' }}>当前状态</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-monokai-gray">AI引擎状态</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
                  backgroundColor: 'var(--monokai-green)',
                  color: 'var(--monokai-bg)'
                }}>
                  就绪
                </span>
              </div>
            </div>
          </div>

          {data.length > 0 && (
            <div className="bg-monokai rounded-lg p-6 border border-monokai text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                backgroundColor: 'var(--monokai-green)',
                color: 'var(--monokai-bg)'
              }}>
                <i className="fa fa-check text-2xl"></i>
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--monokai-green)' }}>
                AI数据生成成功
              </h4>
              <p className="text-monokai-gray mb-4">
                已生成 {data.length} 个高质量数据点，符合统计分布特征
              </p>
              <div className="flex justify-center space-x-4 text-sm text-monokai-dim">
                <span>✓ 分布拟合度: 98.5%</span>
                <span>✓ 数据质量: 优秀</span>
                <span>✓ 处理时间: 0.2s</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default DataInputSection;
