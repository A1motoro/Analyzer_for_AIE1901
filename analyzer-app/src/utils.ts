// 工具函数
export const calculateBasicStats = function(data: number[]) {
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const sortedData = [...data].sort((a, b) => a - b);
  const median = n % 2 === 0
    ? (sortedData[n/2 - 1] + sortedData[n/2]) / 2
    : sortedData[Math.floor(n/2)];

  // 计算方差和标准差
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // 计算众数
  const frequencyMap: { [key: string]: number } = {};
  data.forEach(val => {
    frequencyMap[val.toString()] = (frequencyMap[val.toString()] || 0) + 1;
  });
  let mode = sortedData[0];
  let maxFreq = 1;
  Object.entries(frequencyMap).forEach(([val, freq]) => {
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = parseFloat(val);
    }
  });

  // 计算偏度和峰度
  const skewnessNumerator = data.reduce((sum, val) => sum + Math.pow(val - mean, 3), 0) / n;
  const skewness = skewnessNumerator / Math.pow(stdDev, 3);

  const kurtosisNumerator = data.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0) / n;
  const kurtosis = kurtosisNumerator / Math.pow(stdDev, 4) - 3;

  return {
    mean,
    median,
    mode,
    variance,
    stdDev,
    skewness,
    kurtosis
  };
};

export const generateDistributionData = function(params: any) {
  const { type, params: distParams, sampleSize } = params;
  const result: number[] = [];

  switch (type) {
    case 'normal':
      const { mean = 0, stdDev = 1 } = distParams;
      for (let i = 0; i < sampleSize; i++) {
        // Box-Muller变换生成正态分布随机数
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        result.push(z0 * stdDev + mean);
      }
      break;

    case 'uniform':
      const { min = 0, max = 1 } = distParams;
      for (let i = 0; i < sampleSize; i++) {
        result.push(min + Math.random() * (max - min));
      }
      break;

    case 'exponential':
      const { lambda = 1 } = distParams;
      for (let i = 0; i < sampleSize; i++) {
        result.push(-Math.log(Math.random()) / lambda);
      }
      break;

    case 'poisson':
      const { rate = 1 } = distParams;
      for (let i = 0; i < sampleSize; i++) {
        let k = 0;
        let p = 1;
        const L = Math.exp(-rate);
        do {
          k++;
          p *= Math.random();
        } while (p > L);
        result.push(k - 1);
      }
      break;
  }

  return result;
};

export const parseCSVContent = function(content: string) {
  try {
    // 假设CSV格式，第一列是数据
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.slice(1) // 跳过标题行
      .map(line => {
        const values = line.split(',');
        return parseFloat(values[0]);
      })
      .filter(value => !isNaN(value));
  } catch (error) {
    console.error('CSV解析错误:', error);
    throw new Error('CSV文件解析失败，请检查文件格式。');
  }
};

export const calculateMLE = function(data: number[]) {
  // 假设正态分布的MLE参数估计
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;

  return {
    mean,
    variance,
    stdDev: Math.sqrt(variance)
  };
};

export const calculateMoM = function(data: number[]) {
  // 假设正态分布的MoM参数估计
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;

  return {
    mean,
    variance,
    stdDev: Math.sqrt(variance)
  };
};
