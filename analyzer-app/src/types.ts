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

// 置信区间接口（支持多种格式）
export interface ConfidenceInterval {
  mean?: number;
  lowerBound?: number;
  upperBound?: number;
  confidenceLevel: number;
  // 支持旧的interval格式
  interval?: {
    lower: number;
    upper: number;
  };
  // 允许其他属性
  [key: string]: any;
}

// 参数估计结果接口（支持包含valid等额外属性的结构）
export interface ParameterEstimates {
  [paramName: string]: number | boolean | null | string | undefined;
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
  distributionsMLE?: Record<string, any>; // MLE结果可能包含valid等非数字属性
  gammaMoM?: ParameterEstimates | {
    shape: number | null;
    scale: number | null;
    valid: boolean;
    message?: string;
    mean?: number;
    variance?: number;
    feasibleRange?: string;
    warning?: string;
  };
  distributionAnalysis?: DistributionAnalysis;
  
  // Other analyses
  roheAnalysis?: Record<string, any>; // 暂时保留any，后续可以进一步细化
  userExamples?: Record<string, any>; // 改为Record类型，因为实际是对象而非数组
  
  // Goodness of fit and QQ plot data
  goodnessOfFitResult?: GoodnessOfFitResult;
  qqPlotData?: QQPlotPoint[];
  
  // Allow additional properties
  [key: string]: any;
}

