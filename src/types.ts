// 数据点接口
export interface DataPoint {
  [key: string]: number | string;
}

// 分布参数接口
export interface DistributionParams {
  type: 'normal' | 'uniform' | 'exponential' | 'poisson';
  params: Record<string, number>;
  sampleSize: number;
}

// 分析结果接口
export interface AnalysisResult {
  mean?: number;
  median?: number;
  mode?: number;
  variance?: number;
  stdDev?: number;
  skewness?: number;
  kurtosis?: number;
  mleParams?: Record<string, number>;
  momParams?: Record<string, number>;
}

// 输入方法类型
export type InputMethod = 'upload' | 'distribution' | 'ai';

// 分析标签类型
export type AnalysisTab = 'basic' | 'mle-mom';