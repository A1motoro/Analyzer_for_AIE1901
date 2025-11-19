# 数据分析师Web应用

一个现代化、美观的数据分析工具，采用VSCode Monokai配色方案，支持CSV文件上传、分布数据生成和AI数据生成，提供完整的统计分析和可视化功能。

🌐 **在线体验**
- **正式版本**: https://a1motoro.github.io/Analyzer_for_AIE1901/
- **开发预览**: https://a1motoro.github.io/Analyzer_for_AIE1901/develop/ *(最后更新: 2025年)*

## 🚀 快速开始

### 环境要求
- Node.js 18+ （下载：https://nodejs.org/）
- pnpm 包管理器（或使用 npm）

### 本地开发

**⚠️ 重要提示**：所有命令必须在 `analyzer-app` 目录下执行！

```bash
# 1. 进入项目目录
cd analyzer-app

# 2. 安装依赖
pnpm install
# 或使用 npm: npm install

# 3. 启动开发服务器
pnpm run dev
# 或使用 npm: npm run dev

# 4. 在浏览器中打开 http://localhost:5173/
```

### 📖 详细运行指南

如果您是第一次运行此项目，或遇到问题，请查看：
- **详细指南**：`本地运行指南.md` - 包含完整的安装和运行步骤
- **快速参考**：`快速开始.txt` - 简化的快速开始步骤

### 🔧 常见问题

- **找不到 node 命令**：请先安装 Node.js
- **找不到 pnpm**：运行 `npm install -g pnpm` 或直接使用 `npm`
- **安装很慢**：使用国内镜像 `npm config set registry https://registry.npmmirror.com`
- **端口被占用**：关闭占用 5173 端口的程序

### 构建生产版本
```bash
cd analyzer-app
pnpm run build
```

## 📊 功能特点

### 🎯 数据输入方式
1. **CSV文件上传**：拖拽上传或点击选择，支持实时数据预览
2. **分布数据生成**：支持多种统计分布
   - 正态分布、均匀分布、指数分布、泊松分布
   - 参数可调节，实时生成样本
3. **AI数据生成**：集成AI模型生成模拟数据

### 📈 数据分析功能
1. **基本统计分析**：均值、中位数、众数、方差、标准差、偏度、峰度
2. **高级统计特性**：MLE/MoM参数估计、置信区间计算
3. **数据可视化**：优化的直方图和散点图，支持交互
4. **AI智能分析**：集成AI助手进行数据解读

### 🎨 界面特色
- VSCode Monokai配色方案
- 响应式设计，支持多设备
- 流畅动画和过渡效果
- 玻璃拟态设计元素

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS 4.0
- **图标库**: Font Awesome 6
- **图表库**: Chart.js
- **包管理**: pnpm
- **部署**: GitHub Pages + GitHub Actions

## 🤝 协作开发

本项目采用Git Flow工作流，支持多人协作开发。

### 分支管理
- `main`: 生产环境代码（受保护分支）
- `develop`: 开发主分支
- `feature/*`: 功能开发分支
- `fix/*`: 问题修复分支

### 贡献指南
请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 获取详细的贡献指南。

### 分支保护
请参考 [.github/BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md) 设置分支保护规则。

## 📋 部署说明

### GitHub Pages 配置

1. **启用 GitHub Pages**:
   - 进入仓库的 **Settings** 页面
   - 找到 **Pages** 部分
   - 在 **Source** 中选择 **GitHub Actions**

2. **自动部署流程**:
   - 推送代码到 `main` 分支 → 部署到正式版本
   - 推送代码到 `develop` 分支 → 部署到开发预览版本

3. **访问地址**:
- **正式版本**: `https://A1motoro.github.io/Analyzer_for_AIE1901/`
- **开发预览**: `https://A1motoro.github.io/Analyzer_for_AIE1901/develop/`

### CI/CD 工作流

项目使用GitHub Actions实现自动CI/CD：

1. **代码质量检查**: 每次推送自动运行TypeScript检查和构建测试
2. **自动部署**: 分支推送触发自动构建和部署
3. **预览功能**: 团队成员可以实时预览develop分支的最新功能

## 📁 项目结构

```
Analyzer_for_AIE1901-1/
├── analyzer-app/          # 主应用目录
│   ├── src/
│   │   ├── components/    # React组件
│   │   │   ├── analysis/  # 分析相关组件
│   │   │   └── data/      # 数据输入相关组件
│   │   ├── i18n/          # 国际化配置
│   │   ├── App.tsx        # 主应用组件
│   │   ├── main.tsx       # 应用入口
│   │   └── index.css      # 全局样式
│   ├── public/
│   │   └── data/          # 示例数据文件
│   ├── scripts/           # 脚本文件
│   ├── package.json       # 项目配置
│   └── tailwind.config.js # Tailwind配置
├── docs/                  # 项目文档
│   ├── current_progress_report.md
│   ├── v1.0.0_report.md
│   └── 数据分析师app（旧版）.html
├── resources/             # 资源文件
│   ├── STA2002/          # 课程资料
│   └── sta2002_summary.txt
├── README.md             # 项目说明
└── CONTRIBUTING.md       # 贡献指南
```
