import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// 注册Chart.js组件
Chart.register(...registerables);

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
  const histogramRef = useRef<HTMLCanvasElement>(null);
  const scatterRef = useRef<HTMLCanvasElement>(null);
  // 在组件挂载后创建图表
  useEffect(() => {
    if (data.length > 0 && activeTab === 'basic') {
      // 创建直方图
      const histogramCtx = histogramRef.current;
      if (histogramCtx) {
        // 销毁已存在的图表
        const existingChart = Chart.getChart(histogramCtx);
        if (existingChart) {
          existingChart.destroy();
        }

        // 计算直方图数据
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binCount = Math.min(15, Math.ceil(Math.sqrt(data.length))); // 限制最大bin数为15
        const binWidth = (max - min) / binCount;
        const bins = new Array(binCount).fill(0);

        data.forEach(value => {
          const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
          bins[binIndex]++;
        });

        const labels = bins.map((_, index) =>
          `${(min + index * binWidth).toFixed(2)} - ${(min + (index + 1) * binWidth).toFixed(2)}`
        );

        new Chart(histogramCtx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: '数据分布',
              data: bins,
              backgroundColor: '#66d9ef',
              borderWidth: 0,
              hoverBackgroundColor: '#ae81ff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '数据分布直方图',
                color: '#f8f8f2',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: '频次',
                  color: '#f8f8f2'
                },
                ticks: {
                  color: '#90908a'
                },
                grid: {
                  color: '#49483e'
                }
              },
              x: {
                title: {
                  display: true,
                  text: '数值区间',
                  color: '#f8f8f2'
                },
                ticks: {
                  color: '#90908a'
                },
                grid: {
                  color: '#49483e'
                }
              }
            }
          }
        });
      }

      // 创建散点图
      const scatterCtx = scatterRef.current;
      if (scatterCtx) {
        // 销毁已存在的图表
        const existingChart = Chart.getChart(scatterCtx);
        if (existingChart) {
          existingChart.destroy();
        }

        // 准备散点图数据
        const scatterData = data.map((value, index) => ({
          x: index,
          y: value
        }));

        new Chart(scatterCtx, {
          type: 'scatter',
          data: {
            datasets: [{
              label: '数据点',
              data: scatterData,
              backgroundColor: '#ae81ff',
              borderWidth: 0,
              pointRadius: 3,
              pointHoverRadius: 5,
              hoverBackgroundColor: '#f92672'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '数据散点分布图',
                color: '#f8f8f2',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: '数值',
                  color: '#f8f8f2'
                },
                ticks: {
                  color: '#90908a'
                },
                grid: {
                  color: '#49483e'
                }
              },
              x: {
                title: {
                  display: true,
                  text: '数据索引',
                  color: '#f8f8f2'
                },
                ticks: {
                  color: '#90908a'
                },
                grid: {
                  color: '#49483e'
                }
              }
            }
          }
        });
      }
    }
  }, [data, activeTab]);

  return (
    <section className="bg-monokai-light rounded-2xl p-8 mb-12 border border-monokai shadow-monokai transition-all duration-300 hover:shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--monokai-fg)' }}>
          数据分析结果
        </h2>
        <p className="text-sm text-monokai-gray">
          深入分析您的数据特征和统计特性
        </p>
      </div>

      {/* 分析类型切换标签 */}
      <div className="flex mb-8 bg-monokai border border-monokai rounded-lg p-1">
        <button
          className={`flex items-center px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 flex-1 ${
            activeTab === 'basic'
              ? 'bg-monokai-orange text-monokai-bg shadow-md'
              : 'text-monokai-gray hover:bg-monokai hover:text-monokai-fg'
          }`}
          onClick={() => setActiveTab('basic')}
        >
          <i className="fa fa-calculator mr-2"></i>
          基本统计分析
        </button>
        <button
          className={`flex items-center px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 flex-1 ${
            activeTab === 'mle-mom'
              ? 'bg-monokai-purple text-monokai-bg shadow-md'
              : 'text-monokai-gray hover:bg-monokai hover:text-monokai-fg'
          }`}
          onClick={() => setActiveTab('mle-mom')}
        >
          <i className="fa fa-flask mr-2"></i>
          参数估计分析
        </button>
      </div>

      {/* 基本统计分析结果 */}
      {activeTab === 'basic' && (
        <div className="space-y-8">
          {/* 核心统计指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-monokai rounded-lg p-6 border border-monokai hover:border-monokai-blue transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--monokai-blue)', color: 'var(--monokai-bg)' }}>
                  <i className="fa fa-crosshairs text-sm"></i>
                </div>
                <span className="text-xs text-monokai-gray font-medium">MEAN</span>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-blue)' }}>
                {analysisResult.mean?.toFixed(4)}
              </p>
              <p className="text-sm text-monokai-gray">平均值</p>
            </div>

            <div className="bg-monokai rounded-lg p-6 border border-monokai hover:border-monokai-green transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--monokai-green)', color: 'var(--monokai-bg)' }}>
                  <i className="fa fa-balance-scale text-sm"></i>
                </div>
                <span className="text-xs text-monokai-gray font-medium">MEDIAN</span>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-green)' }}>
                {analysisResult.median?.toFixed(4)}
              </p>
              <p className="text-sm text-monokai-gray">中位数</p>
            </div>

            <div className="bg-monokai rounded-lg p-6 border border-monokai hover:border-monokai-orange transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--monokai-orange)', color: 'var(--monokai-bg)' }}>
                  <i className="fa fa-chart-line text-sm"></i>
                </div>
                <span className="text-xs text-monokai-gray font-medium">STD DEV</span>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-orange)' }}>
                {analysisResult.stdDev?.toFixed(4)}
              </p>
              <p className="text-sm text-monokai-gray">标准差</p>
            </div>

            <div className="bg-monokai rounded-lg p-6 border border-monokai hover:border-monokai-purple transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--monokai-purple)', color: 'var(--monokai-bg)' }}>
                  <i className="fa fa-square text-sm"></i>
                </div>
                <span className="text-xs text-monokai-gray font-medium">VARIANCE</span>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-purple)' }}>
                {analysisResult.variance?.toFixed(4)}
              </p>
              <p className="text-sm text-monokai-gray">方差</p>
            </div>
          </div>

          {/* 高级统计指标 */}
          <div className="bg-monokai rounded-lg p-6 border border-monokai">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--monokai-fg)' }}>
              高级统计特性
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-monokai border border-monokai">
                <p className="text-sm text-monokai-gray mb-2">众数 (Mode)</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--monokai-yellow)' }}>
                  {analysisResult.mode?.toFixed(4)}
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-monokai border border-monokai">
                <p className="text-sm text-monokai-gray mb-2">偏度 (Skewness)</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--monokai-pink)' }}>
                  {analysisResult.skewness?.toFixed(4)}
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-monokai border border-monokai">
                <p className="text-sm text-monokai-gray mb-2">峰度 (Kurtosis)</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--monokai-blue)' }}>
                  {analysisResult.kurtosis?.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* 数据可视化 */}
          <div className="bg-monokai rounded-lg p-6 border border-monokai">
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--monokai-fg)' }}>
              数据可视化分析
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 直方图 */}
              <div className="bg-monokai-dark rounded-lg p-4">
                <div className="h-96">
                  <canvas ref={histogramRef}></canvas>
                </div>
              </div>

              {/* 散点图 */}
              <div className="bg-monokai-dark rounded-lg p-4">
                <div className="h-96">
                  <canvas ref={scatterRef}></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* 统计概念解释 */}
          <div className="bg-monokai rounded-lg p-6 border border-monokai">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--monokai-fg)' }}>
              统计概念指南
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: 'var(--monokai-blue)' }}></div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--monokai-blue)' }}>均值 (Mean)</p>
                    <p className="text-sm text-monokai-gray">所有数据点的算术平均值</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: 'var(--monokai-green)' }}></div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--monokai-green)' }}>中位数 (Median)</p>
                    <p className="text-sm text-monokai-gray">排序后位于中间位置的值</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: 'var(--monokai-orange)' }}></div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--monokai-orange)' }}>标准差 (Std Dev)</p>
                    <p className="text-sm text-monokai-gray">衡量数据分散程度的统计量</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: 'var(--monokai-purple)' }}></div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--monokai-purple)' }}>方差 (Variance)</p>
                    <p className="text-sm text-monokai-gray">标准差的平方，衡量数据变异性</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: 'var(--monokai-pink)' }}></div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--monokai-pink)' }}>偏度 (Skewness)</p>
                    <p className="text-sm text-monokai-gray">描述分布不对称程度的指标</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: 'var(--monokai-yellow)' }}></div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--monokai-yellow)' }}>峰度 (Kurtosis)</p>
                    <p className="text-sm text-monokai-gray">衡量分布尾部厚度的统计量</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 参数估计分析结果 */}
      {activeTab === 'mle-mom' && (
        <div className="space-y-8">
          {/* MLE参数估计 */}
          <div className="bg-monokai rounded-lg p-6 border border-monokai">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--monokai-blue)' }}>
                最大似然估计 (MLE)
              </h3>
              <p className="text-sm text-monokai-gray">
                Maximum Likelihood Estimation - 基于概率的最大化
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-monokai-dark rounded-lg p-4 border border-monokai text-center hover:scale-105 transition-all duration-300">
                <p className="text-sm text-monokai-gray mb-2">估计均值</p>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-blue)' }}>
                  {analysisResult.mleParams?.mean?.toFixed(6)}
                </p>
                <p className="text-xs text-monokai-dim">μ̂</p>
              </div>

              <div className="bg-monokai-dark rounded-lg p-4 border border-monokai text-center hover:scale-105 transition-all duration-300">
                <p className="text-sm text-monokai-gray mb-2">估计方差</p>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-green)' }}>
                  {analysisResult.mleParams?.variance?.toFixed(6)}
                </p>
                <p className="text-xs text-monokai-dim">σ²̂</p>
              </div>

              <div className="bg-monokai-dark rounded-lg p-4 border border-monokai text-center hover:scale-105 transition-all duration-300">
                <p className="text-sm text-monokai-gray mb-2">估计标准差</p>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-orange)' }}>
                  {analysisResult.mleParams?.stdDev?.toFixed(6)}
                </p>
                <p className="text-xs text-monokai-dim">σ̂</p>
              </div>
            </div>
          </div>

          {/* MoM参数估计 */}
          <div className="bg-monokai rounded-lg p-6 border border-monokai">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--monokai-purple)' }}>
                矩法估计 (MoM)
              </h3>
              <p className="text-sm text-monokai-gray">
                Method of Moments - 基于样本矩的估计方法
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-monokai-dark rounded-lg p-4 border border-monokai text-center hover:scale-105 transition-all duration-300">
                <p className="text-sm text-monokai-gray mb-2">估计均值</p>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-purple)' }}>
                  {analysisResult.momParams?.mean?.toFixed(6)}
                </p>
                <p className="text-xs text-monokai-dim">μ̃</p>
              </div>

              <div className="bg-monokai-dark rounded-lg p-4 border border-monokai text-center hover:scale-105 transition-all duration-300">
                <p className="text-sm text-monokai-gray mb-2">估计方差</p>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-pink)' }}>
                  {analysisResult.momParams?.variance?.toFixed(6)}
                </p>
                <p className="text-xs text-monokai-dim">σ²̃</p>
              </div>

              <div className="bg-monokai-dark rounded-lg p-4 border border-monokai text-center hover:scale-105 transition-all duration-300">
                <p className="text-sm text-monokai-gray mb-2">估计标准差</p>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--monokai-yellow)' }}>
                  {analysisResult.momParams?.stdDev?.toFixed(6)}
                </p>
                <p className="text-xs text-monokai-dim">σ̃</p>
              </div>
            </div>
          </div>

          {/* 估计方法比较 */}
          <div className="bg-monokai rounded-lg p-6 border border-monokai">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl mr-4" style={{ backgroundColor: 'var(--monokai-yellow)', color: 'var(--monokai-bg)' }}>
                <i className="fa fa-balance-scale text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--monokai-fg)' }}>
                  参数估计方法比较
                </h3>
                <p className="text-sm text-monokai-gray mt-1">
                  对比MLE与MoM两种经典参数估计方法的差异
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-monokai">
                    <th className="px-6 py-3 text-left text-xs font-medium text-monokai-gray uppercase tracking-wider">参数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-monokai-gray uppercase tracking-wider">最大似然估计</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-monokai-gray uppercase tracking-wider">矩法估计</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-monokai-gray uppercase tracking-wider">绝对差异</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-monokai">
                  {/* 均值比较 */}
                  <tr className="hover:bg-monokai-light transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--monokai-fg)' }}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'var(--monokai-blue)' }}></div>
                        均值 (μ)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: 'var(--monokai-blue)' }}>
                      {analysisResult.mleParams?.mean?.toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: 'var(--monokai-purple)' }}>
                      {analysisResult.momParams?.mean?.toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: 'var(--monokai-orange)' }}>
                      {Math.abs((analysisResult.mleParams?.mean || 0) - (analysisResult.momParams?.mean || 0)).toFixed(10)}
                    </td>
                  </tr>
                  {/* 方差比较 */}
                  <tr className="hover:bg-monokai-light transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--monokai-fg)' }}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'var(--monokai-green)' }}></div>
                        方差 (σ²)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: 'var(--monokai-blue)' }}>
                      {analysisResult.mleParams?.variance?.toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: 'var(--monokai-purple)' }}>
                      {analysisResult.momParams?.variance?.toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: 'var(--monokai-orange)' }}>
                      {Math.abs((analysisResult.mleParams?.variance || 0) - (analysisResult.momParams?.variance || 0)).toFixed(10)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 参数估计方法详解 */}
          <div className="bg-monokai rounded-lg p-6 border border-monokai">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--monokai-fg)' }}>
                参数估计方法详解
              </h3>
              <p className="text-sm text-monokai-gray">
                深入理解两种经典的参数估计方法
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--monokai-blue)', color: 'var(--monokai-bg)' }}>
                    <i className="fa fa-brain text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: 'var(--monokai-blue)' }}>
                      最大似然估计 (MLE)
                    </h4>
                    <p className="text-sm text-monokai-gray leading-relaxed">
                      寻找最可能产生观测数据的参数值。通过最大化似然函数来确定参数，使得在当前参数下观测到现有数据的概率最大。
                    </p>
                    <div className="mt-3 p-3 rounded bg-monokai-dark border border-monokai">
                      <p className="text-xs text-monokai-dim font-mono">
                        L(θ|x) = ∏ f(xᵢ|θ) → max
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--monokai-purple)', color: 'var(--monokai-bg)' }}>
                    <i className="fa fa-calculator text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: 'var(--monokai-purple)' }}>
                      矩法估计 (MoM)
                    </h4>
                    <p className="text-sm text-monokai-gray leading-relaxed">
                      通过匹配样本矩和理论矩来估计参数。设置样本矩等于理论矩，然后求解参数。
                    </p>
                    <div className="mt-3 p-3 rounded bg-monokai-dark border border-monokai">
                      <p className="text-xs text-monokai-dim font-mono">
                        E[X] = μ̂, Var(X) = σ̂²
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AnalysisResultSection;
