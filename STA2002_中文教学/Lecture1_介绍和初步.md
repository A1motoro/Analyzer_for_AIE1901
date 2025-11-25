# STA2002 概率与统计II - Lecture 1: 介绍和初步

## 课程概述

本课程是概率与统计II的进阶课程，重点学习高级统计概念和方法。

### 课程基本信息
- **授课教师**: 宋方达 (Fangda Song) 和 柯伟文 (Ka Wai Tsang)
- **授课地点**: 深圳大学城数据科学学院
- **参考教材**: Hogg, R. V. 等人的《Probability and Statistical Inference》第9版
- **课程重点**: 第6-9章内容

### 课程安排
- **时间**: 每周二/四上午10:30-11:50 (宋老师), 周一/三上午8:30-9:50 (柯老师)
- **助教**: 包括王瑞聪、任雯迪、俞博坤、高志奇等
- **教学助理**: Frederick Khasanto等同学

### 考核方式
- **作业**: 占一定比例，定期提交，**严格截止时间，不接受补交**
- **期中考试**: 闭卷，允许携带一张A4大小的手写小抄
- **期末考试**: 闭卷，允许携带两张A4大小的手写小抄
- **学术诚信**: 严格要求，不容忍任何学术不端行为

## 概率 vs 统计

### 核心区别

**概率 (Probability)**: 基于已知的数学模型，预测可能发生的结果
- 问题示例: 掷一枚均匀硬币5次，出现同一面的概率是多少？

**统计 (Statistics)**: 基于观测数据，推断产生数据的模型或过程
- 问题示例: 掷硬币5次都出现正面，应该得出硬币不均匀的结论吗？
- 另一个示例: 掷硬币20次出现14次正面，或1000次出现700次正面，哪个更可信？

### 统计学的关键概念
- **假设检验**: 比较统计测量值与概率预测
- **参数估计**: 使用统计测量值推断概率模型
- **置信区间**: 评估推断的可信度

## 随机变量和分布函数

### 随机变量定义
随机变量X是从样本空间Ω到实数集R的函数。

### 随机变量类型
- **离散型**: 取值在可数集SX中，如掷骰子结果
- **连续型**: 由密度函数描述，如身高、体重

### 累积分布函数 (CDF)
$$F_X(x) = Pr(X \leq x)$$

**性质**:
- 非递减、右连续
- $$\lim_{x \to -\infty} F_X(x) = 0, \lim_{x \to \infty} F_X(x) = 1$$

### 支撑集 (Support)
- 离散型: $$S_X = \{x: Pr(X=x) > 0\}$$
- 连续型: $$S_X = \{x: f_X(x) > 0\}$$

## 离散分布

### 期望值 (Expectation)
$$E(X) = \sum_{k \in S_X} k \cdot p_X(k)$$

**期望的线性性质**:
$$E(a+bX) = a + bE(X)$$
$$E\left(\sum_{i=1}^n b_i X_i\right) = \sum_{i=1}^n b_i E(X_i)$$

### 方差 (Variance)
$$Var(X) = E[(X - E(X))^2] = E[X^2] - (E(X))^2$$

**方差性质**:
$$Var(a+bX) = b^2 Var(X)$$
$$Var(X+Y) = Var(X) + Var(Y) + 2Cov(X,Y)$$
若X,Y独立: $$Var(X+Y) = Var(X) + Var(Y)$$

### 常见离散分布

#### 二项分布 (Binomial)
$$X \sim Bin(n,p)$$
$$Pr(X=k) = \binom{n}{k} p^k (1-p)^{n-k}, k=0,1,\dots,n$$
$$E(X)=np, Var(X)=np(1-p)$$

#### 泊松分布 (Poisson)
$$X \sim Pois(\lambda)$$
$$Pr(X=k) = \frac{\lambda^k}{k!} e^{-\lambda}, k=0,1,2,\dots$$
$$E(X)=\lambda, Var(X)=\lambda$$

## 连续分布

### 概率密度函数 (PDF)
$$Pr(a < X \leq b) = \int_a^b f_X(x) \, dx$$
$$F_X(x) = \int_{-\infty}^x f_X(t) \, dt$$

### 期望值
$$E(X) = \int_{-\infty}^{\infty} x f_X(x) \, dx$$

### 常见连续分布

#### 指数分布 (Exponential)
$$f(x) = \frac{1}{\theta} e^{-x/\theta}, x>0$$
$$E(X)=\theta, Var(X)=\theta^2$$

#### 伽马分布 (Gamma)
$$f(x) = \frac{1}{\Gamma(\alpha) \theta^\alpha} x^{\alpha-1} e^{-x/\theta}, x>0$$
$$E(X)=\alpha\theta, Var(X)=\alpha\theta^2$$

#### 卡方分布 (Chi-square)
$$X \sim \chi^2(r)$$
$$f(x) = \frac{1}{\Gamma(r/2) 2^{r/2}} x^{r/2-1} e^{-x/2}, x>0$$
$$E(X)=r, Var(X)=2r$$

#### 正态分布 (Normal)
$$X \sim N(\mu, \sigma^2)$$
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\left\{-\frac{(x-\mu)^2}{2\sigma^2}\right\}$$
$$E(X)=\mu, Var(X)=\sigma^2$$

**正态分布性质**:
- 若$$X \sim N(\mu, \sigma^2)$$，则$$Z = \frac{X-\mu}{\sigma} \sim N(0,1)$$
- 若$$X \sim N(\mu, \sigma^2)$$，则$$Z^2 = \frac{(X-\mu)^2}{\sigma^2} \sim \chi^2(1)$$

## 三大重要定理

### 大数定律 (Law of Large Numbers)
$$n \to \infty$$时，对于任意$$\epsilon > 0$$，
$$Pr(|\bar{X} - \mu| > \epsilon) \to 0$$

**解释**: 重复实验多次后，平均值越来越接近真实期望值。

### 中心极限定理 (Central Limit Theorem)
$$n \to \infty$$时，
$$\frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \to N(0,1)$$

**解释**: 大量独立同分布随机变量的和(或平均)近似服从正态分布。

### 学生t定理 (Student's Theorem)
设$$X_1, \dots, X_n \sim N(\mu, \sigma^2)$$，定义
$$\bar{X} = \frac{1}{n} \sum X_i, \quad S^2 = \frac{1}{n-1} \sum (X_i - \bar{X})^2$$

则:
1. $$\bar{X} \sim N(\mu, \sigma^2/n)$$
2. $$\bar{X}$$与$$S^2$$独立
3. $$(n-1)S^2/\sigma^2 \sim \chi^2(n-1)$$
4. $$\frac{\bar{X} - \mu}{S/\sqrt{n}} \sim t(n-1)$$

## 难点讲解

### 1. 概率与统计的区别
许多学生容易混淆概率和统计。记住这个比喻：
- **概率**: 像天气预报，基于历史数据预测明天天气
- **统计**: 像天气分析，基于今天天气推断气候模式

### 2. 期望值的线性性质
期望的线性性质非常强大，但有个常见误区：只有当随机变量**独立**时，$$E(XY) = E(X)E(Y)$$才成立。期望的线性性质对独立性没有要求！

### 3. 方差的性质
方差不具有期望那样的线性性质：$$Var(X+Y) \neq Var(X) + Var(Y)$$，除非X,Y独立。协方差$$Cov(X,Y) = E[(X-E(X))(Y-E(Y))]$$在方差计算中扮演重要角色。

### 4. 中心极限定理的应用
CLT告诉我们，足够大的样本量下，样本均值近似正态分布。这解释了为什么现实中很多现象看起来"服从正态分布"。

### 5. 学生t分布
当总体方差未知时，我们用样本方差估计，用t分布代替正态分布。自由度$$n-1$$很重要：样本量越大，t分布越接近正态分布。
