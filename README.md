# 数据分析师Web应用

一个简单易用的数据分析工具，支持CSV文件上传、分布数据生成和AI数据生成，提供基本统计分析和MLE/MoM参数估计功能。

## 🚀 快速开始

### 环境要求
- Node.js 16+
- pnpm 包管理器

### 本地开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm start
```

### 构建生产版本
```bash
pnpm run build
```

### 部署
应用通过GitHub Actions自动部署到：**https://a1motoro.github.io/analyzer_for_aie1901/**

## 📊 功能特点

### 数据输入方式
1. **CSV文件上传**：支持上传CSV格式的数据文件进行分析
2. **分布数据生成**：支持生成多种统计分布的数据
   - 正态分布、均匀分布、指数分布、泊松分布
3. **AI数据生成**：模拟AI生成数据

### 数据分析功能
1. **基本统计分析**：均值、中位数、众数、方差、标准差、偏度、峰度
2. **MLE/MoM参数估计**：最大似然估计和矩法估计
3. **数据可视化**：直方图、散点图等

## 🛠️ 技术栈

- React 18 + TypeScript
- Tailwind CSS (CDN)
- Font Awesome
- Chart.js (用于数据可视化)

## 📋 部署说明

- 使用GitHub Actions自动构建和部署
- 采用pnpm作为包管理器
- 支持缓存优化构建速度
- 自动部署到GitHub Pages项目页面
