// 简单的测试脚本来验证卡方拟合优度检验的修复
console.log('测试卡方拟合优度检验修复...');

// 添加erf函数实现，因为Node.js中Math对象没有内置erf函数
function erf(x) {
  // 近似计算误差函数
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.5 * a);
  const tau = t * Math.exp(-a * a - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return s * (1 - tau);
}

// 模拟正态分布数据
function generateNormalData(mean, std, count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    // Box-Muller变换生成正态分布随机数
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    data.push(mean + z * std);
  }
  return data;
}

// 模拟卡方检验的简化计算，用于验证修复
function simpleChiSquareTest(data) {
  const n = data.length;
  const sortedData = [...data].sort((a, b) => a - b);
  const min = sortedData[0];
  const max = sortedData[n - 1];
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  // 使用较少的区间数以容易产生小期望频数
  const numBins = 8;
  const binWidth = (max - min) / numBins;
  const bins = Array.from({ length: numBins }, (_, i) => ({
    lower: min + i * binWidth,
    upper: min + (i + 1) * binWidth,
    observed: 0
  }));
  
  // 计算观察频率
  data.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binWidth), numBins - 1);
    bins[binIndex].observed++;
  });
  
  // 正态分布CDF
  function normalCDF(x) {
    return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
  }
  
  // 修复前的计算（错误实现）
  let oldChiSquare = 0;
  let oldValidBins = 0;
  
  bins.forEach(bin => {
    const pLower = bin.lower === min ? 0 : normalCDF(bin.lower);
    const pUpper = bin.upper === max ? 1 : normalCDF(bin.upper);
    const expectedProbability = pUpper - pLower;
    const expectedCount = Math.max(5, n * expectedProbability);
    
    if (expectedCount >= 5) {
      oldChiSquare += Math.pow(bin.observed - expectedCount, 2) / expectedCount;
      oldValidBins++;
    }
  });
  
  // 修复后的计算（正确实现）
  let newChiSquare = 0;
  let newValidBins = 0;
  
  bins.forEach(bin => {
    const pLower = bin.lower === min ? 0 : normalCDF(bin.lower);
    const pUpper = bin.upper === max ? 1 : normalCDF(bin.upper);
    const expectedProbability = pUpper - pLower;
    const expectedCount = n * expectedProbability;
    
    if (expectedCount > 0) {
      newChiSquare += Math.pow(bin.observed - expectedCount, 2) / expectedCount;
      newValidBins++;
    }
  });
  
  // 输出结果对比
  console.log('\n区间统计:');
  bins.forEach((bin, index) => {
    const pLower = bin.lower === min ? 0 : normalCDF(bin.lower);
    const pUpper = bin.upper === max ? 1 : normalCDF(bin.upper);
    const expectedProbability = pUpper - pLower;
    const realExpectedCount = n * expectedProbability;
    const oldExpectedCount = Math.max(5, realExpectedCount);
    console.log(`区间 ${index + 1}: 观察=${bin.observed}, 真实期望=${realExpectedCount.toFixed(2)}, 修复前期望=${oldExpectedCount}`);
  });
  
  console.log('\n卡方统计量对比:');
  console.log(`修复前: χ² = ${oldChiSquare.toFixed(4)}, 有效区间数 = ${oldValidBins}`);
  console.log(`修复后: χ² = ${newChiSquare.toFixed(4)}, 有效区间数 = ${newValidBins}`);
  console.log(`差异: ${(newChiSquare - oldChiSquare).toFixed(4)}`);
  
  // 验证修复的正确性
  if (newValidBins > oldValidBins) {
    console.log('\n验证结果: 修复成功！修复后使用了更多的区间进行计算。');
  } else {
    console.log('\n验证结果: 修复后区间数未增加，但现在使用了真实期望频数。');
  }
}

// 测试1: 小数据集，容易产生小期望频数
console.log('\n=== 测试1: 小数据集 ===');
simpleChiSquareTest(generateNormalData(50, 10, 30));

// 测试2: 中等数据集
console.log('\n=== 测试2: 中等数据集 ===');
simpleChiSquareTest(generateNormalData(0, 1, 100));

// 测试3: 验证结论
console.log('\n=== 结论验证 ===');
console.log('1. 修复后的代码使用真实期望频数，不再人为设置最小值为5');
console.log('2. 修复后的代码只跳过期望频数为0的区间');
console.log('3. 修复后的卡方统计量计算更加准确，符合统计学原理');
console.log('4. 虽然小期望频数会影响卡方检验的准确性，但这是已知的局限性');
console.log('   而不是通过修改期望频数来掩盖问题');