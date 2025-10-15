import React, { useEffect } from 'react';
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
  // 在组件挂载后创建图表
  useEffect(() => {
    if (data.length > 0) {
      // 创建直方图
      const histogramCtx = document.getElementById('histogram') as HTMLCanvasElement;
      if (histogramCtx) {
        // 销毁已存在的图表
        const existingChart = Chart.getChart(histogramCtx);
        if (existingChart) {
          existingChart.destroy();
        }

        // 计算直方图数据
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binCount = Math.ceil(Math.sqrt(data.length));
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
              backgroundColor: 'rgba(22, 93, 255, 0.6)',
              borderColor: 'rgba(22, 93, 255, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '数据直方图'
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
                  text: '频率'
                }
              },
              x: {
                title: {
                  display: true,
                  text: '数值区间'
                }
              }
            }
          }
        });
      }

      // 创建散点图
      const scatterCtx = document.getElementById('scatter') as HTMLCanvasElement;
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
              backgroundColor: 'rgba(54, 207, 201, 0.6)',
              borderColor: 'rgba(54, 207, 201, 1)',
              borderWidth: 1,
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '数据散点图'
              },
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: '数值'
                }
              },
              x: {
                title: {
                  display: true,
                  text: '索引'
                }
              }
            }
          }
        });
      }
    }
  }, [data]);

  return (
    <section className="bg-white rounded-xl shadow-card p-6 mb-8 transition-all-300 hover:shadow-card-hover animate-slide-up">
      <h2 className="text-xl font-bold mb-4">数据分析结果</h2>

      {/* 分析类型切换标签 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${
            activeTab === 'basic'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('basic')}
        >
          <i className="fa fa-calculator mr-2"></i>
          基本统计分析
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-all-300 ${
            activeTab === 'mle-mom'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('mle-mom')}
        >
          <i className="fa fa-flask mr-2"></i>
          MLE/MoM分析
        </button>
      </div>

      {/* 基本统计分析结果 */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* 统计指标卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 均值 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all-300">
              <p className="text-sm text-gray-500">均值</p>
              <p className="text-2xl font-bold mt-1">{analysisResult.mean?.toFixed(4)}</p>
            </div>

            {/* 中位数 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all-300">
              <p className="text-sm text-gray-500">中位数</p>
              <p className="text-2xl font-bold mt-1">{analysisResult.median?.toFixed(4)}</p>
            </div>

            {/* 标准差 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all-300">
              <p className="text-sm text-gray-500">标准差</p>
              <p className="text-2xl font-bold mt-1">{analysisResult.stdDev?.toFixed(4)}</p>
            </div>

            {/* 方差 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all-300">
              <p className="text-sm text-gray-500">方差</p>
              <p className="text-2xl font-bold mt-1">{analysisResult.variance?.toFixed(4)}</p>
            </div>
          </div>

          {/* 更多统计指标 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 众数 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all-300">
              <p className="text-sm text-gray-500">众数</p>
              <p className="text-2xl font-bold mt-1">{analysisResult.mode?.toFixed(4)}</p>
            </div>

            {/* 偏度 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all-300">
              <p className="text-sm text-gray-500">偏度</p>
              <p className="text-2xl font-bold mt-1">{analysisResult.skewness?.toFixed(4)}</p>
            </div>

            {/* 峰度 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all-300">
              <p className="text-sm text-gray-500">峰度</p>
              <p className="text-2xl font-bold mt-1">{analysisResult.kurtosis?.toFixed(4)}</p>
            </div>
          </div>

          {/* 统计指标解释 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            <p className="font-medium mb-2">📊 统计指标解释</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>• <span className="font-medium">均值</span>：数据的集中趋势度量</div>
              <div>• <span className="font-medium">中位数</span>：排序后位于中间的数值，不受极端值影响</div>
              <div>• <span className="font-medium">标准差</span>：数据离散程度的度量</div>
              <div>• <span className="font-medium">偏度</span>：衡量数据分布的不对称性</div>
              <div>• <span className="font-medium">峰度</span>：衡量数据分布的陡峭程度</div>
            </div>
          </div>

          {/* 可视化图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 直方图 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-80">
                <canvas id="histogram"></canvas>
              </div>
            </div>

            {/* 散点图 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-80">
                <canvas id="scatter"></canvas>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MLE/MoM分析结果 */}
      {activeTab === 'mle-mom' && (
        <div className="space-y-6">
          {/* MLE参数估计 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <i className="fa fa-bar-chart mr-2"></i>
              最大似然估计 (MLE)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* MLE均值 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">估计均值</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{analysisResult.mleParams?.mean?.toFixed(4)}</p>
              </div>

              {/* MLE方差 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">估计方差</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{analysisResult.mleParams?.variance?.toFixed(4)}</p>
              </div>

              {/* MLE标准差 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">估计标准差</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{analysisResult.mleParams?.stdDev?.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* MoM参数估计 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <i className="fa fa-calculator mr-2"></i>
              矩法估计 (MoM)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* MoM均值 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">估计均值</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{analysisResult.momParams?.mean?.toFixed(4)}</p>
              </div>

              {/* MoM方差 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">估计方差</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{analysisResult.momParams?.variance?.toFixed(4)}</p>
              </div>

              {/* MoM标准差 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">估计标准差</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{analysisResult.momParams?.stdDev?.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* 估计方法比较 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">估计方法比较</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最大似然估计</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">矩法估计</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">差异</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 均值比较 */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">均值</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analysisResult.mleParams?.mean?.toFixed(6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analysisResult.momParams?.mean?.toFixed(6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((analysisResult.mleParams?.mean || 0) - (analysisResult.momParams?.mean || 0)).toFixed(8)}</td>
                  </tr>
                  {/* 方差比较 */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">方差</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analysisResult.mleParams?.variance?.toFixed(6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{analysisResult.momParams?.variance?.toFixed(6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((analysisResult.mleParams?.variance || 0) - (analysisResult.momParams?.variance || 0)).toFixed(8)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MLE和MoM方法解释 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
            <p className="font-medium mb-2">🔬 参数估计方法解释</p>
            <div>
              <p className="mb-2">• <span className="font-medium">最大似然估计 (MLE)</span>：寻找最可能产生观测数据的参数值</p>
              <p>• <span className="font-medium">矩法估计 (MoM)</span>：通过匹配样本矩和理论矩来估计参数</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AnalysisResultSection;
