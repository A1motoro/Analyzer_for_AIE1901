import React from 'react';
import { Card, Row, Col, Statistic, Alert, Progress, Typography, Space } from 'antd';

const { Text, Title } = Typography;

interface ROHEResultsProps {
  roheAnalysis: any;
}

const ROHEResults: React.FC<ROHEResultsProps> = ({ roheAnalysis }) => {
  if (!roheAnalysis || !roheAnalysis.valid) {
    return (
      <Card title="ROHE分析结果" style={{ backgroundColor: '#49483e' }}>
        <Alert
          message="ROHE分析不可用"
          description={roheAnalysis?.error || "数据不足以进行ROHE分析"}
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  const { outliers, heteroscedasticity, robustness, quartiles, sampleSize } = roheAnalysis;

  return (
    <Card title="ROHE分析结果" style={{ backgroundColor: '#49483e' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 样本概览 */}
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Statistic
              title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>样本量</Text>}
              value={sampleSize}
              valueStyle={{ color: '#66d9ef', fontSize: '18px' }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Statistic
              title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>异常值数量</Text>}
              value={outliers.count}
              suffix={`(${outliers.percentage.toFixed(1)}%)`}
              valueStyle={{ color: outliers.count > 0 ? '#f92672' : '#a6e22e', fontSize: '18px' }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Statistic
              title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>鲁棒性得分</Text>}
              value={`${(robustness.score * 100).toFixed(1)}%`}
              valueStyle={{
                color: robustness.score > 0.8 ? '#a6e22e' :
                       robustness.score > 0.6 ? '#fd971f' : '#f92672',
                fontSize: '18px'
              }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Statistic
              title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>鲁棒性等级</Text>}
              value={robustness.interpretation}
              valueStyle={{
                color: robustness.score > 0.8 ? '#a6e22e' :
                       robustness.score > 0.6 ? '#fd971f' : '#f92672',
                fontSize: '14px'
              }}
            />
          </Col>
        </Row>

        {/* 异方差性分析 */}
        <div>
          <Title level={5} style={{ color: '#f8f8f2', marginBottom: '16px' }}>
            🔄 异方差性分析
          </Title>
          <Alert
            message={
              heteroscedasticity.detected
                ? "检测到异方差性 (方差不齐性)"
                : "未检测到显著的异方差性"
            }
            description={
              <Space direction="vertical">
                <Text style={{ color: '#c8c8c2' }}>
                  Bartlett检验统计量: {heteroscedasticity.bartlettStatistic.toFixed(4)}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  显著性水平: {heteroscedasticity.significanceLevel}
                </Text>
              </Space>
            }
            type={heteroscedasticity.detected ? "warning" : "success"}
            showIcon
            style={{ backgroundColor: '#2f2e27', borderColor: '#49483e' }}
          />
        </div>

        {/* 鲁棒性分析 */}
        <div>
          <Title level={5} style={{ color: '#f8f8f2', marginBottom: '16px' }}>
            🛡️ 鲁棒性分析
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card size="small" style={{ backgroundColor: '#2f2e27', borderColor: '#49483e' }}>
                <Statistic
                  title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>中位数绝对偏差 (MAD)</Text>}
                  value={robustness.mad.toFixed(4)}
                  valueStyle={{ color: '#ae81ff', fontSize: '16px' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" style={{ backgroundColor: '#2f2e27', borderColor: '#49483e' }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text style={{ color: '#c8c8c2', fontSize: '12px' }}>鲁棒性进度</Text>
                </div>
                <Progress
                  percent={robustness.score * 100}
                  status={robustness.score > 0.8 ? "success" : robustness.score > 0.6 ? "active" : "exception"}
                  strokeColor={
                    robustness.score > 0.8 ? '#a6e22e' :
                    robustness.score > 0.6 ? '#fd971f' : '#f92672'
                  }
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* 异常值分析 */}
        {outliers.count > 0 && (
          <div>
            <Title level={5} style={{ color: '#f8f8f2', marginBottom: '16px' }}>
              ⚠️ 异常值分析
            </Title>
            <Alert
              message={`发现 ${outliers.count} 个异常值 (${outliers.percentage.toFixed(1)}%)`}
              description={
                <div>
                  <Text style={{ color: '#c8c8c2' }}>
                    异常值范围: {quartiles.lowerFence.toFixed(2)} - {quartiles.upperFence.toFixed(2)}
                  </Text>
                  <br />
                  <Text style={{ color: '#c8c8c2', fontSize: '12px' }}>
                    异常值: {outliers.values.slice(0, 10).join(', ')}
                    {outliers.values.length > 10 && '...'}
                  </Text>
                </div>
              }
              type="warning"
              showIcon
              style={{ backgroundColor: '#2f2e27', borderColor: '#49483e' }}
            />
          </div>
        )}

        {/* 四分位数信息 */}
        <div>
          <Title level={5} style={{ color: '#f8f8f2', marginBottom: '16px' }}>
            📊 四分位数统计
          </Title>
          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>Q1 (25%)</Text>}
                value={quartiles.q1.toFixed(3)}
                valueStyle={{ color: '#66d9ef', fontSize: '14px' }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>Q3 (75%)</Text>}
                value={quartiles.q3.toFixed(3)}
                valueStyle={{ color: '#66d9ef', fontSize: '14px' }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>IQR</Text>}
                value={quartiles.iqr.toFixed(3)}
                valueStyle={{ color: '#66d9ef', fontSize: '14px' }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>边界范围</Text>}
                value={`${quartiles.lowerFence.toFixed(1)} - ${quartiles.upperFence.toFixed(1)}`}
                valueStyle={{ color: '#ae81ff', fontSize: '12px' }}
              />
            </Col>
          </Row>
        </div>

        {/* 分析建议 */}
        <Alert
          message="ROHE分析建议"
          description={
            <Space direction="vertical">
              {heteroscedasticity.detected && (
                <Text style={{ color: '#c8c8c2' }}>
                  • 检测到异方差性，建议使用鲁棒统计方法或方差稳定化变换
                </Text>
              )}
              {robustness.score < 0.6 && (
                <Text style={{ color: '#c8c8c2' }}>
                  • 数据鲁棒性较低，建议检查数据质量或使用稳健统计方法
                </Text>
              )}
              {outliers.count > sampleSize * 0.1 && (
                <Text style={{ color: '#c8c8c2' }}>
                  • 异常值比例较高，建议进一步调查数据分布特征
                </Text>
              )}
              <Text style={{ color: '#c8c8c2' }}>
                • ROHE分析提供了数据异方差性和鲁棒性的综合评估
              </Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#2f2e27', borderColor: '#49483e' }}
        />
      </Space>
    </Card>
  );
};

export default ROHEResults;
