# 贡献指南

感谢您对数据分析师Web应用项目的贡献！请遵循以下指南来确保协作顺利进行。

## 开发流程

### 1. 分支管理
- `main` 分支：生产环境代码，受到保护
- `develop` 分支：开发主分支，用于集成新功能
- 功能分支：`feature/功能名` 格式
- 修复分支：`fix/问题描述` 格式

### 2. 开发步骤

#### 开始新功能开发
```bash
# 1. 确保在develop分支上
git checkout develop
git pull origin develop

# 2. 创建功能分支
git checkout -b feature/你的功能名

# 3. 开发功能
# ... 编写代码 ...

# 4. 提交更改
git add .
git commit -m "feat: 添加新功能描述"

# 5. 推送到远程
git push origin feature/你的功能名

# 6. 创建Pull Request到develop分支
```

#### 修复bug
```bash
# 1. 从develop分支创建修复分支
git checkout develop
git pull origin develop
git checkout -b fix/问题描述

# 2. 修复问题
# ... 修复代码 ...

# 3. 提交并创建PR
git add .
git commit -m "fix: 修复问题描述"
git push origin fix/问题描述
```

### 3. 提交信息规范

提交信息请遵循以下格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type类型：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或工具配置

#### 示例：
```
feat: 添加数据可视化图表组件

- 实现直方图和散点图
- 支持数据交互
- 优化图表样式

Closes #123
```

### 4. Pull Request要求

在提交PR之前，请确保：

1. **代码质量**
   - 运行 `pnpm run build` 确保无编译错误
   - 代码符合TypeScript类型要求
   - 添加了适当的注释

2. **测试**
   - 功能在本地测试通过
   - 没有破坏现有功能

3. **文档**
   - 更新了相关的README或文档
   - 添加了必要的代码注释

4. **PR描述**
   - 清晰描述更改内容
   - 说明测试方法
   - 添加相关截图（如果有界面更改）

### 5. 代码审查

所有PR都需要至少一个团队成员的批准才能合并。

审查要点：
- 代码逻辑正确性
- 性能影响
- 安全性
- 可维护性
- 符合项目规范

### 6. 合并到主分支

当功能开发完成并通过测试后：

1. 将 `develop` 分支合并到 `main`
2. 触发自动部署到GitHub Pages
3. 创建发布标签（如果需要）

## 环境设置

### 本地开发环境
```bash
# 安装依赖
cd analyzer-app
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build
```

### 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **包管理**: pnpm
- **部署**: GitHub Pages

## 问题反馈

如果您遇到问题或有建议，请：

1. 检查现有的Issues
2. 创建新的Issue（使用适当的标签）
3. 在讨论区参与讨论

感谢您的贡献！🎉
