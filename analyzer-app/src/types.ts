// 类型定义文件

export interface BasicStats {
  mean: number;
  median: number;
  mode: number;
  variance: number;
  stdDev: number;
  skewness: number;
  kurtosis: number;
}

// 卡方拟合优度检验结果接口
export interface GoodnessOfFitResult {
  bestFit: string;
  results: Array<{
    distribution: string;
    chiSquare: number;
    degreesOfFreedom: number;
    pValue: number;
    recommendation: boolean;
  }>;
  sampleSize: number;
}

// Q-Q图数据点接口
export interface QQPlotPoint {
  sampleQuantiles: number;
  theoreticalQuantiles: number;
}

// 分布分析结果接口
export interface DistributionAnalysis {
  distributionType: string;
  parameters?: Record<string, number>;
  goodnessOfFit?: GoodnessOfFitResult;
}

// 置信区间接口
export interface ConfidenceInterval {
  mean?: number;
  lowerBound: number;
  upperBound: number;
  confidenceLevel: number;
}

// 参数估计结果接口
export interface ParameterEstimates {
  [paramName: string]: number;
}

export interface AnalysisResult {
  // Basic stats
  mean?: number;
  median?: number;
  mode?: number;
  variance?: number;
  stdDev?: number;
  skewness?: number;
  kurtosis?: number;
  
  // MLE and MoM params
  mleParams?: ParameterEstimates;
  momParams?: ParameterEstimates;
  
  // Confidence intervals
  confidenceInterval?: ConfidenceInterval;
  wilsonInterval?: ConfidenceInterval;
  bootstrapInterval?: ConfidenceInterval;
  
  // Distribution analysis
  distributionsMLE?: Record<string, ParameterEstimates>;
  gammaMoM?: ParameterEstimates;
  distributionAnalysis?: DistributionAnalysis;
  
  // Other analyses
  roheAnalysis?: Record<string, any>; // 暂时保留any，后续可以进一步细化
  userExamples?: Array<Record<string, any>>; // 暂时保留any，后续可以进一步细化
  
  // Goodness of fit and QQ plot data
  goodnessOfFitResult?: GoodnessOfFitResult;
  qqPlotData?: QQPlotPoint[];
  
  // Allow additional properties
  [key: string]: any;
}

