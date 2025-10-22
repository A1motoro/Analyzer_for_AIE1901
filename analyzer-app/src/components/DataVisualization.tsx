import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card, Row, Col, Space, Typography, Tooltip, Button } from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 注册Chart.js组件
Chart.register(...registerables);

interface DataVisualizationProps {
  data: number[];
  analysisResult: any;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, analysisResult }) => {
  const histogramRef = useRef<HTMLCanvasElement>(null);
  const scatterRef = useRef<HTMLCanvasElement>(null);
  const [activeChart, setActiveChart] = useState<'histogram' | 'scatter'>('histogram');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    if (data.length > 0) {
      createCharts();
    }

    return () => {
      // 清理图表
      if (histogramRef.current) {
        const chart = Chart.getChart(histogramRef.current);
        if (chart) chart.destroy();
      }
      if (scatterRef.current) {
        const chart = Chart.getChart(scatterRef.current);
        if (chart) chart.destroy();
      }
    };
  }, [data, activeChart]);

  const createCharts = () => {
    // 创建直方图
    if (histogramRef.current && activeChart === 'histogram') {
      const existingChart = Chart.getChart(histogramRef.current);
      if (existingChart) existingChart.destroy();

      const min = Math.min(...data);
      const max = Math.max(...data);
      const binCount = Math.min(15, Math.ceil(Math.sqrt(data.length)));
      const binWidth = (max - min) / binCount;
      const bins = new Array(binCount).fill(0);

      data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
        bins[binIndex]++;
      });

      const labels = bins.map((_, index) =>
        `${(min + index * binWidth).toFixed(2)} - ${(min + (index + 1) * binWidth).toFixed(2)}`
      );

      new Chart(histogramRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '频次',
            data: bins,
            backgroundColor: '#66d9ef',
            borderWidth: 0,
            hoverBackgroundColor: '#ae81ff',
            borderRadius: 4,
            borderSkipped: false,
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
              font: { size: 16, weight: 'bold' }
            },
            legend: { display: false },
            tooltip: {
              backgroundColor: '#2f2e27',
              titleColor: '#f8f8f2',
              bodyColor: '#f8f8f2',
              borderColor: '#49483e',
              borderWidth: 1,
              callbacks: {
                label: (context) => `频次: ${context.parsed.y}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: '频次', color: '#f8f8f2' },
              ticks: { color: '#90908a' },
              grid: { color: '#49483e' }
            },
            x: {
              title: { display: true, text: '数值区间', color: '#f8f8f2' },
              ticks: { color: '#90908a', maxRotation: 45 },
              grid: { color: '#49483e' }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          }
        }
      });
    }

    // 创建散点图
    if (scatterRef.current && activeChart === 'scatter') {
      const existingChart = Chart.getChart(scatterRef.current);
      if (existingChart) existingChart.destroy();

      const scatterData = data.map((value, index) => ({
        x: index,
        y: value
      }));

      new Chart(scatterRef.current, {
        type: 'scatter',
        data: {
          datasets: [{
            label: '数据点',
            data: scatterData,
            backgroundColor: '#ae81ff',
            borderWidth: 0,
            pointRadius: 3,
            pointHoverRadius: 6,
            hoverBackgroundColor: '#f92672',
            pointBorderColor: '#66d9ef',
            pointBorderWidth: 1,
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
              font: { size: 16, weight: 'bold' }
            },
            legend: { display: false },
            tooltip: {
              backgroundColor: '#2f2e27',
              titleColor: '#f8f8f2',
              bodyColor: '#f8f8f2',
              borderColor: '#49483e',
              borderWidth: 1,
                callbacks: {
                  title: (tooltipItems) => `索引: ${tooltipItems[0].parsed.x}`,
                  label: (context) => `数值: ${context.parsed.y?.toFixed(4) || 'N/A'}`
                }
            }
          },
          scales: {
            y: {
              title: { display: true, text: '数值', color: '#f8f8f2' },
              ticks: { color: '#90908a' },
              grid: { color: '#49483e' }
            },
            x: {
              title: { display: true, text: '数据索引', color: '#f8f8f2' },
              ticks: { color: '#90908a' },
              grid: { color: '#49483e' }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
  };

  const switchChart = (chartType: 'histogram' | 'scatter') => {
    setActiveChart(chartType);
  };

  return (
    <Card
      title={
        <Space>
          <PieChartOutlined style={{ color: '#fd971f' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            数据可视化分析
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
      extra={
        <Space>
          <Tooltip title="刷新图表">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={createCharts}
              style={{ color: '#fd971f' }}
            />
          </Tooltip>
        </Space>
      }
    >
      {/* 图表类型切换 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: activeChart === 'histogram' ? '#49483e' : '#3e3d32',
              border: activeChart === 'histogram' ? '2px solid #66d9ef' : '1px solid #49483e',
              transition: 'all 0.3s ease',
              transform: hoveredCard === 'histogram' ? 'scale(1.05)' : 'scale(1)'
            }}
            onClick={() => switchChart('histogram')}
            onMouseEnter={() => setHoveredCard('histogram')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <BarChartOutlined style={{ color: '#66d9ef', fontSize: '20px' }} />
            <div style={{ marginTop: '4px' }}>
              <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>直方图</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: activeChart === 'scatter' ? '#49483e' : '#3e3d32',
              border: activeChart === 'scatter' ? '2px solid #ae81ff' : '1px solid #49483e',
              transition: 'all 0.3s ease',
              transform: hoveredCard === 'scatter' ? 'scale(1.05)' : 'scale(1)'
            }}
            onClick={() => switchChart('scatter')}
            onMouseEnter={() => setHoveredCard('scatter')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <DotChartOutlined style={{ color: '#ae81ff', fontSize: '20px' }} />
            <div style={{ marginTop: '4px' }}>
              <Text style={{ color: '#f8f8f2', fontSize: '12px' }}>散点图</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表显示区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            bordered={false}
            style={{
              backgroundColor: '#1e1e1e',
              height: '400px',
              transition: 'all 0.3s ease',
              boxShadow: hoveredCard ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'
            }}
            onMouseEnter={() => setHoveredCard('chart')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ height: '350px', position: 'relative' }}>
              {activeChart === 'histogram' && (
                <canvas ref={histogramRef} style={{ width: '100%', height: '100%' }} />
              )}
              {activeChart === 'scatter' && (
                <canvas ref={scatterRef} style={{ width: '100%', height: '100%' }} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表统计信息 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ backgroundColor: '#49483e', textAlign: 'center' }}>
            <Text style={{ color: '#90908a', fontSize: '12px' }}>数据点数</Text>
            <div style={{ color: '#66d9ef', fontSize: '18px', fontWeight: 'bold' }}>
              {data.length}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ backgroundColor: '#49483e', textAlign: 'center' }}>
            <Text style={{ color: '#90908a', fontSize: '12px' }}>均值</Text>
            <div style={{ color: '#a6e22e', fontSize: '18px', fontWeight: 'bold' }}>
              {analysisResult.mean?.toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ backgroundColor: '#49483e', textAlign: 'center' }}>
            <Text style={{ color: '#90908a', fontSize: '12px' }}>标准差</Text>
            <div style={{ color: '#fd971f', fontSize: '18px', fontWeight: 'bold' }}>
              {analysisResult.stdDev?.toFixed(2)}
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DataVisualization;
