import React, { useState } from 'react';

const TutorialSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState('basic');

  // 教程内容
  const tutorialContents: { [key: string]: any } = {
    basic: {
      title: '基础使用指南',
      content: [
        {
          subtitle: '数据输入',
          items: [
            'CSV文件上传：点击文件上传区域，选择您的数据文件',
            '分布数据生成：选择一种概率分布，系统会自动生成对应数据',
            'AI数据生成：点击"生成数据"按钮，获取AI生成的示例数据'
          ]
        },
        {
          subtitle: '数据分析',
          items: [
            '基本统计分析：查看均值、中位数、标准差等统计指标',
            'MLE/MoM分析：了解不同参数估计方法的结果对比',
            '数据可视化：通过直方图和散点图直观了解数据分布'
          ]
        },
        {
          subtitle: '导出结果',
          items: [
            '截图保存：使用系统截图功能保存分析结果',
            '数据共享：导出处理后的数据用于其他应用'
          ]
        }
      ]
    },
    advanced: {
      title: '高级功能详解',
      content: [
        {
          subtitle: '统计指标解释',
          items: [
            '均值：数据的集中趋势度量',
            '中位数：数据排序后的中间值，不受极端值影响',
            '标准差：数据离散程度的度量',
            '偏度：数据分布的不对称性度量',
            '峰度：数据分布的陡峭程度度量'
          ]
        },
        {
          subtitle: '分布类型特点',
          items: [
            '正态分布：对称的钟形曲线，适用于许多自然现象',
            '均匀分布：所有值出现的概率相等',
            '指数分布：常用于描述事件发生的时间间隔',
            '泊松分布：用于描述在固定时间内事件发生的次数'
          ]
        },
        {
          subtitle: '参数估计方法',
          items: [
            '最大似然估计 (MLE)：在统计推断中广泛使用的方法',
            '矩法估计 (MoM)：计算简单但在某些情况下精度较低'
          ]
        }
      ]
    },
    model: {
      title: '大模型助手使用指南',
      content: [
        {
          subtitle: '配置阿里云API',
          items: [
            '前往阿里云官网开通大模型服务',
            '获取您的API Key和API Secret',
            '在应用中配置API密钥信息'
          ]
        },
        {
          subtitle: '提问技巧',
          items: [
            '明确具体问题：例如"我的数据是否符合正态分布？"',
            '请求建议：例如"基于这些统计结果，我应该使用什么分析方法？"',
            '要求解释：例如"如何解释偏度和峰度的值？"'
          ]
        },
        {
          subtitle: '常见问题',
          items: [
            'API调用失败：检查网络连接和密钥配置',
            '响应时间长：大模型处理需要一定时间，请耐心等待',
            '结果不理想：尝试调整问题的表达方式'
          ]
        }
      ]
    },
    troubleshooting: {
      title: '常见问题排查',
      content: [
        {
          subtitle: '文件上传问题',
          items: [
            '文件格式错误：确保上传的是CSV格式文件',
            '数据解析失败：检查CSV文件格式是否符合要求',
            '文件大小限制：建议单次上传数据量不超过10万条'
          ]
        },
        {
          subtitle: '分析结果问题',
          items: [
            '结果异常：检查数据是否包含异常值或缺失值',
            '图表显示问题：尝试刷新页面或使用最新版本的浏览器',
            '计算错误：确保输入的数据类型正确'
          ]
        },
        {
          subtitle: '性能优化',
          items: [
            '大数据集：对于大型数据集，可能需要更长的处理时间',
            '浏览器兼容性：推荐使用Chrome、Firefox或Edge的最新版本',
            '缓存清理：定期清理浏览器缓存以获得最佳体验'
          ]
        }
      ]
    }
  };

  const currentTopic = tutorialContents[activeTopic];

  return (
    <section className="bg-white rounded-xl shadow-card p-6 mb-12 transition-all-300 hover:shadow-card-hover animate-slide-up">
      <h2 className="text-xl font-bold mb-6">使用教程</h2>

      {/* 教程主题导航 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(tutorialContents).map(([key, topic]) => (
          <button
            key={key}
            onClick={() => setActiveTopic(key)}
            className={`px-4 py-2 rounded-lg transition-all-300 ${
              activeTopic === key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* 教程内容 */}
      <div className="space-y-6">
        {currentTopic.content.map((section: any, index: number) => (
          <div key={index} className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {section.subtitle}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="flex items-start">
                  <i className="fa fa-check-circle text-primary mt-1 mr-2 flex-shrink-0"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TutorialSection;
