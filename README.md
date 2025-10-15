# 数据分析师Web应用

一个简单易用的数据分析工具，支持CSV文件上传、分布数据生成和AI数据生成，提供基本统计分析和MLE/MoM参数估计功能。

## 快速开始

### 环境要求

- Node.js 16+
- pnpm 包管理器

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
pnpm run build
```

### 部署到GitHub Pages

```bash
pnpm run deploy
```

应用将部署到 `https://a1motoro.github.io/analyze`

## 功能特点

### 数据输入方式

1. **CSV文件上传**：支持上传CSV格式的数据文件进行分析
2. **分布数据生成**：支持生成多种统计分布的数据
   - 正态分布
   - 均匀分布
   - 指数分布
   - 泊松分布
3. **AI数据生成**：模拟AI生成数据（实际应用中可连接到真实AI API）

### 数据分析功能

1. **基本统计分析**
   - 均值、中位数、众数
   - 方差、标准差
   - 偏度、峰度
   - 数据可视化（直方图、散点图）

2. **MLE/MoM参数估计**
   - 最大似然估计（MLE）
   - 矩法估计（MoM）
   - 估计方法比较

## 技术说明

本应用采用了以下技术：

- React 18：用于构建用户界面
- Chart.js：用于数据可视化
- Tailwind CSS：用于样式设计
- Font Awesome：用于图标显示

## 解决方案说明

原始应用遇到的白屏问题主要是由于TypeScript模块系统和浏览器环境的兼容性问题导致的。我们的解决方案是：

1. 创建了一个单文件HTML应用（`simple_app.html`）
2. 移除了模块导入/导出，改为直接在全局作用域定义函数
3. 使用纯JavaScript而非TypeScript，避免编译相关问题
4. 通过CDN引入所有依赖，简化部署过程
5. 使用原生的React.createElement而非JSX，避免额外的编译步骤

这种方式确保了应用可以在任何现代浏览器中直接运行，无需复杂的构建工具。

## 开发说明

项目结构：
- `src/App.tsx` - 主应用组件
- `src/index.tsx` - 应用入口点
- `src/utils.ts` - 工具函数
- `src/types.ts` - TypeScript类型定义
- `public/index.html` - HTML模板

**重要：** 此项目配置为仅使用pnpm包管理器。请勿使用npm、yarn或其他包管理器。

## 注意事项

- 本应用使用的是CDN引入的Tailwind CSS，不建议在生产环境中使用这种方式
- 对于生产环境部署，建议使用正规的构建工具（如Vite、Webpack等）
- 所有的数据处理都在客户端完成，不会上传到服务器

## License

MIT