import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Select, InputNumber, Alert, Tabs, Divider, Progress } from 'antd';
import {
  ThunderboltOutlined
} from '@ant-design/icons';
import {
  calculatePowerOneSampleT,
  calculateSampleSizeOneSampleT,
  calculatePowerTwoSampleT,
  calculateSampleSizeTwoSampleT,
  calculatePowerProportionTest,
  calculateSampleSizeProportionTest
} from '../utils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface PowerAnalysisProps {
  data: number[];
  analysisResult: any;
}

const PowerAnalysis: React.FC<PowerAnalysisProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('power');
  const [testType, setTestType] = useState('one-sample-t');
  const [effectSize, setEffectSize] = useState(0.5);
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [sampleSize, setSampleSize] = useState(data.length);
  const [alternative, setAlternative] = useState('two-sided');
  const [p0, setP0] = useState(0.5);
  const [p1, setP1] = useState(0.6);

  const runPowerAnalysis = () => {
    let result;

    switch (testType) {
      case 'one-sample-t':
        result = calculatePowerOneSampleT(sampleSize, effectSize, alpha, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'two-sample-t':
        result = calculatePowerTwoSampleT(sampleSize, sampleSize, effectSize, alpha, true, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'proportion':
        result = calculatePowerProportionTest(sampleSize, p0, p1, alpha, alternative as 'two-sided' | 'less' | 'greater');
        break;
      default:
        return null;
    }

    return result;
  };

  const runSampleSizeCalculation = () => {
    let result;

    switch (testType) {
      case 'one-sample-t':
        result = calculateSampleSizeOneSampleT(effectSize, alpha, power, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'two-sample-t':
        result = calculateSampleSizeTwoSampleT(effectSize, alpha, power, true, alternative as 'two-sided' | 'less' | 'greater');
        break;
      case 'proportion':
        result = calculateSampleSizeProportionTest(p0, p1, alpha, power, alternative as 'two-sided' | 'less' | 'greater');
        break;
      default:
        return null;
    }

    return result;
  };

  const powerResult = runPowerAnalysis();
  const sampleSizeResult = runSampleSizeCalculation();

  const getAlternativeText = (alt: string) => {
    switch (alt) {
      case 'less': return '左单侧 (H₁: 参数 < 零值)';
      case 'greater': return '右单侧 (H₁: 参数 > 零值)';
      default: return '双侧 (H₁: 参数 ≠ 零值)';
    }
  };

  const renderPowerAnalysis = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 参数设置 */}
      <Card title="检验参数设置" style={{ backgroundColor: '#49483e' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>检验类型:</Text>
            <Select
              value={testType}
              onChange={setTestType}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="one-sample-t">单样本t检验</Option>
              <Option value="two-sample-t">两样本t检验</Option>
              <Option value="proportion">比例检验</Option>
            </Select>
          </Col>

          {testType === 'proportion' ? (
            <>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>零假设比例 (p₀):</Text>
                <InputNumber
                  value={p0}
                  onChange={(value) => setP0(value || 0.5)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>备择假设比例 (p₁):</Text>
                <InputNumber
                  value={p1}
                  onChange={(value) => setP1(value || 0.6)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
            </>
          ) : (
            <Col xs={24} md={6}>
              <Text style={{ color: '#c8c8c2' }}>效应量 (Effect Size):</Text>
              <InputNumber
                value={effectSize}
                onChange={(value) => setEffectSize(value || 0.5)}
                min={0.01}
                step={0.1}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </Col>
          )}

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>显著性水平 (α):</Text>
            <Select
              value={alpha}
              onChange={setAlpha}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value={0.01}>0.01</Option>
              <Option value={0.05}>0.05</Option>
              <Option value={0.10}>0.10</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>样本量:</Text>
            <InputNumber
              value={sampleSize}
              onChange={(value) => setSampleSize(value || 30)}
              min={2}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>备择假设:</Text>
            <Select
              value={alternative}
              onChange={setAlternative}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="two-sided">双侧检验</Option>
              <Option value="less">左单侧检验</Option>
              <Option value="greater">右单侧检验</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 功效分析结果 */}
      {powerResult && (
        <Card title="功效分析结果" style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>检验功效 (1-β)</Text>}
                value={`${(powerResult.power * 100).toFixed(2)}%`}
                valueStyle={{
                  color: powerResult.power > 0.8 ? '#a6e22e' : powerResult.power > 0.6 ? '#fd971f' : '#f92672',
                  fontSize: '20px'
                }}
              />
              <Progress
                percent={powerResult.power * 100}
                status={powerResult.power > 0.8 ? 'success' : powerResult.power > 0.6 ? 'active' : 'exception'}
                strokeColor={powerResult.power > 0.8 ? '#a6e22e' : powerResult.power > 0.6 ? '#fd971f' : '#f92672'}
                style={{ marginTop: '8px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>效应量</Text>}
                value={powerResult.effectSize?.toFixed(3) || 'N/A'}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>非中心参数</Text>}
                value={powerResult.nonCentralityParameter?.toFixed(3) || 'N/A'}
                valueStyle={{ color: '#ae81ff', fontSize: '16px' }}
              />
            </Col>
          </Row>

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  检验功效分析结果:
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • 当前参数下，检验的功效为 {(powerResult.power * 100).toFixed(2)}%
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • 这意味着当备择假设为真时，正确拒绝零假设的概率为 {(powerResult.power * 100).toFixed(2)}%
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • 显著性水平 α = {alpha}，备择假设: {getAlternativeText(alternative)}
                </Text>
              </Space>
            }
            type={powerResult.power > 0.8 ? 'success' : powerResult.power > 0.6 ? 'warning' : 'error'}
            showIcon
          />

          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#2f2e27', borderRadius: '6px' }}>
            <Text strong style={{ color: '#f8f8f2' }}>功效解释:</Text>
            <br />
            <Text style={{ color: '#c8c8c2', fontSize: '12px' }}>
              • 高功效 (&gt;80%): 检验能够很好地检测到效应
              <br />
              • 中等功效 (60-80%): 检验有中等能力检测到效应
              <br />
              • 低功效 (&lt;60%): 检验难以检测到效应，可能需要更大的样本量
            </Text>
          </div>
        </Card>
      )}
    </Space>
  );

  const renderSampleSizeCalculation = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 参数设置 */}
      <Card title="样本大小计算参数" style={{ backgroundColor: '#49483e' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>检验类型:</Text>
            <Select
              value={testType}
              onChange={setTestType}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="one-sample-t">单样本t检验</Option>
              <Option value="two-sample-t">两样本t检验</Option>
              <Option value="proportion">比例检验</Option>
            </Select>
          </Col>

          {testType === 'proportion' ? (
            <>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>零假设比例 (p₀):</Text>
                <InputNumber
                  value={p0}
                  onChange={(value) => setP0(value || 0.5)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
              <Col xs={24} md={6}>
                <Text style={{ color: '#c8c8c2' }}>备择假设比例 (p₁):</Text>
                <InputNumber
                  value={p1}
                  onChange={(value) => setP1(value || 0.6)}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </Col>
            </>
          ) : (
            <Col xs={24} md={6}>
              <Text style={{ color: '#c8c8c2' }}>效应量 (Effect Size):</Text>
              <InputNumber
                value={effectSize}
                onChange={(value) => setEffectSize(value || 0.5)}
                min={0.01}
                step={0.1}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </Col>
          )}

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>显著性水平 (α):</Text>
            <Select
              value={alpha}
              onChange={setAlpha}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value={0.01}>0.01</Option>
              <Option value={0.05}>0.05</Option>
              <Option value={0.10}>0.10</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>目标功效 (1-β):</Text>
            <Select
              value={power}
              onChange={setPower}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value={0.8}>0.80 (80%)</Option>
              <Option value={0.9}>0.90 (90%)</Option>
              <Option value={0.95}>0.95 (95%)</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Text style={{ color: '#c8c8c2' }}>备择假设:</Text>
            <Select
              value={alternative}
              onChange={setAlternative}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="two-sided">双侧检验</Option>
              <Option value="less">左单侧检验</Option>
              <Option value="greater">右单侧检验</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 样本大小计算结果 */}
      {sampleSizeResult && (
        <Card title="样本大小计算结果" style={{ backgroundColor: '#49483e' }}>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>所需样本量</Text>}
                value={'sampleSize' in sampleSizeResult ? sampleSizeResult.sampleSize : sampleSizeResult.sampleSizePerGroup}
                valueStyle={{ color: '#a6e22e', fontSize: '24px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>效应量</Text>}
                value={sampleSizeResult.effectSize?.toFixed(3) || 'N/A'}
                valueStyle={{ color: '#66d9ef', fontSize: '16px' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>目标功效</Text>}
                value={`${(sampleSizeResult.power * 100).toFixed(0)}%`}
                valueStyle={{ color: '#fd971f', fontSize: '16px' }}
              />
            </Col>
          </Row>

          {'totalSampleSize' in sampleSizeResult && sampleSizeResult.totalSampleSize && (
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} md={12}>
                <Statistic
                  title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>每组样本量</Text>}
                  value={'sampleSizePerGroup' in sampleSizeResult ? sampleSizeResult.sampleSizePerGroup : 'N/A'}
                  valueStyle={{ color: '#ae81ff', fontSize: '18px' }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Statistic
                  title={<Text style={{ color: '#c8c8c2', fontSize: '12px' }}>总样本量</Text>}
                  value={'totalSampleSize' in sampleSizeResult ? sampleSizeResult.totalSampleSize : 'N/A'}
                  valueStyle={{ color: '#f92672', fontSize: '18px' }}
                />
              </Col>
            </Row>
          )}

          <Divider />

          <Alert
            message={
              <Space direction="vertical">
                <Text style={{ color: '#f8f8f2' }}>
                  样本大小计算结果:
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • 要达到 {(sampleSizeResult.power * 100).toFixed(0)}% 的检验功效，显著性水平为 {alpha}
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • 检测效应量为 {sampleSizeResult.effectSize?.toFixed(3) || 'N/A'} 的差异
                </Text>
                <Text style={{ color: '#c8c8c2' }}>
                  • 需要的最小样本量为 {'sampleSize' in sampleSizeResult ? sampleSizeResult.sampleSize : sampleSizeResult.sampleSizePerGroup} 个观测值
                </Text>
              </Space>
            }
            type="info"
            showIcon
          />

          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#2f2e27', borderRadius: '6px' }}>
            <Text strong style={{ color: '#f8f8f2' }}>样本大小解释:</Text>
            <br />
            <Text style={{ color: '#c8c8c2', fontSize: '12px' }}>
              • 样本量越大，检验的功效越高，能够检测到的效应越小
              <br />
              • 显著性水平越低，需要的样本量越大
              <br />
              • 目标功效越高，需要的样本量越大
              <br />
              • 效应量越大，需要的样本量越小
            </Text>
          </div>
        </Card>
      )}
    </Space>
  );

  return (
    <Card
      title={
        <Space>
          <ThunderboltOutlined style={{ color: '#a6e22e' }} />
          <Title level={4} style={{ margin: 0, color: '#f8f8f2' }}>
            功效分析与样本大小计算 (Power Analysis)
          </Title>
        </Space>
      }
      style={{ backgroundColor: '#2f2e27' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="功效分析" key="power">
          {renderPowerAnalysis()}
        </TabPane>

        <TabPane tab="样本大小计算" key="sample-size">
          {renderSampleSizeCalculation()}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default PowerAnalysis;
