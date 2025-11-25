# STA2002 概率与统计II - Lecture 2: 最大似然估计

## 概述
本讲重点学习：
- 数据可视化
- 探索性数据分析
- 最大似然估计 (Maximum Likelihood Estimation, MLE)

## 数据可视化

### 直方图 (Histogram)
- **用途**: 将连续观测值分组显示分布情况
- **高度**: 表示相对频率或密度
- **面积**: 与观测值数量成比例
- **选择bin大小的注意事项**:
  - 过小: 产生虚假峰谷，过拟合
  - 过大: 隐藏重要细节和模式
- **软件建议**: R、Python等统计软件可自动选择合适的bin数

### 箱线图 (Boxplot/Box-and-Whisker Diagram)
- **组成部分**: 基于五数概括 (最小值、Q1、中位数、Q3、最大值)
- **四分位距 (IQR)**: Q3 - Q1
- **内围栏/外围栏**: 箱子上下1.5×IQR/3×IQR处
- **异常值识别**:
  - 内围栏到外围栏之间: 可疑异常值
  - 超出外围栏: 异常值

**箱线图解读**:
- 箱子显示中间50%的数据
- 须线显示"正常"数据范围 (1.5×IQR内)
- 分布偏斜: 上须比下须短表示右偏，下须比上须短表示左偏

## 探索性数据分析

### 实际案例: UM新冠感染分析
使用直方图和箱线图分析迈阿密大学新冠感染数据：
- 理解数据分布模式
- 预测下一年度感染情况
- 比较教职工vs其他群体的感染率

## 参数估计

### 样本与总体
- **样本**: 从总体中抽取的观测值
- **总体**: 我们感兴趣的整个群体
- **假设**: 样本代表总体，数据服从某种分布

### 参数空间 (Parameter Space)
$$f(x; \theta), \theta \in \Omega$$

**正态分布示例**:
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\left\{-\frac{(x-\mu)^2}{2\sigma^2}\right\}$$
$$\Omega = \{(\mu, \sigma^2): -\infty < \mu < \infty, 0 < \sigma^2 < \infty\}$$

### 估计量 vs 估计值
- **估计量 (Estimator)**: 基于样本的统计函数 u(X₁,...,Xn)
- **估计值 (Estimate)**: 样本观测后的具体数值

## 似然函数 (Likelihood Function)

### 定义
$$L(\theta) := f(x_1,x_2,\dots,x_n; \theta) = \prod_{i=1}^n f(x_i; \theta)$$

### 对数似然函数
$$ℓ(\theta) := \ln L(\theta)$$

**性质**: 由于对数函数严格递增，最大化ℓ(θ)等价于最大化L(θ)

## 最大似然估计 (MLE)

### 定义
$$\hat{\theta} = \arg\max_{\theta} L(\theta)$$

### 一般步骤
1. 写出似然函数 L(θ)
2. 求对数似然 ℓ(θ)
3. 对θ求导数并令为零
4. 求解方程得到$$\hat{\theta}$$

## 常见分布的MLE

### 伯努利分布 (Bernoulli)
$$X_i \sim Bern(p), \quad f(x;p) = p^x (1-p)^{1-x}$$
$$L(p) = \prod p^{x_i} (1-p)^{1-x_i} = p^{\sum x_i} (1-p)^{n - \sum x_i}$$
$$\hat{p} = \frac{1}{n} \sum X_i = \bar{X}$$

### 指数分布 (Exponential)
$$X_i \sim Exp(\theta), \quad f(x;\theta) = \frac{1}{\theta} e^{-x/\theta}$$
$$L(\theta) = \prod \frac{1}{\theta} e^{-x_i/\theta} = \theta^{-n} \exp\left(-\frac{\sum x_i}{\theta}\right)$$
$$ℓ(\theta) = -n \ln \theta - \frac{\sum x_i}{\theta}$$
$$\hat{\theta} = \frac{1}{n} \sum X_i = \bar{X}$$

### 几何分布 (Geometric)
$$f(x;p) = (1-p)^{x-1} p, \quad x=1,2,\dots$$
$$L(p) = p^n (1-p)^{\sum x_i - n}$$
$$ℓ(p) = n \ln p + (\sum x_i - n) \ln(1-p)$$
$$\hat{p} = \frac{n}{\sum X_i} = \frac{1}{\bar{X}}$$

### 均匀分布 [0,θ]
$$f(x;\theta) = \frac{1}{\theta}, \quad 0 \leq x \leq \theta$$
$$L(\theta) = \theta^{-n}, \quad \theta \geq \max\{x_1,\dots,x_n\}$$
$$\hat{\theta} = \max\{X_1,\dots,X_n\}$$

## MLE的优良性质

### 正则性条件 (Regularity Conditions)
- (R1) 不同参数对应不同分布: θ₁ ≠ θ₂ ⇒ f(x;θ₁) ≠ f(x;θ₂)
- (R2) 所有θ有相同支撑集
- (R3) θ₀是Ω的内点

### 渐进行为
在正则性条件下，
$$\lim_{n \to \infty} P[L(\theta_0; x) > L(\theta; x)] = 1, \quad \forall \theta \neq \theta_0$$

**解释**: 随着样本量增大，似然函数在真参数θ₀处取得最大值的概率趋近于1。

## 难点讲解

### 1. 似然函数的直观理解
似然函数L(θ)表示"在参数为θ时，观测到当前样本的可能性"。MLE选择使观测数据"最可能"发生的参数值。

**关键区别**:
- PDF f(x;θ): 固定θ，x的分布
- 似然L(θ): 固定观测数据x，θ的函数

### 2. MLE与样本均值
许多常见分布的MLE就是样本均值：
- 伯努利: $$\hat{p} = \bar{X}$$
- 指数: $$\hat{\theta} = \bar{X}$$
- 正态(均值): $$\hat{\mu} = \bar{X}$$

这不是巧合，而是期望值估计的自然结果。

### 3. 均匀分布的MLE
均匀分布[0,θ]的MLE是样本最大值，这很直观：要覆盖所有观测值，θ至少要等于最大观测值。

### 4. MLE的渐近性质
虽然我们常说"MLE是最好的估计"，但这只是渐进行为。随着样本量增大，MLE的表现越来越好。

### 5. 实际计算中的技巧
- 总是取对数似然：更容易求导
- 对数化后，乘积变成求和
- 求导时注意参数范围约束

**练习题**:
1. 证明泊松分布的MLE是样本均值
2. 推导几何分布MLE的表达式
3. 说明为什么均匀分布的MLE是最大值
