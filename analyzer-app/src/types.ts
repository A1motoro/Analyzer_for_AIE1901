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
  mleParams?: any;
  momParams?: any;
  
  // Confidence intervals
  confidenceInterval?: any;
  wilsonInterval?: any;
  bootstrapInterval?: any;
  
  // Distribution analysis
  distributionsMLE?: any;
  gammaMoM?: any;
  distributionAnalysis?: any;
  
  // Other analyses
  roheAnalysis?: any;
  userExamples?: any;
  
  // Allow additional properties
  [key: string]: any;
}

