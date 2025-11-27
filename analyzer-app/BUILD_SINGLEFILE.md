# 构建单个HTML文件

本项目支持构建成一个完全独立的单个HTML文件，可以在没有服务器的情况下直接在浏览器中打开使用。

## 构建命令

```bash
pnpm run build:singlefile
```

或者使用npm：

```bash
npm run build:singlefile
```

## 输出文件

构建完成后，单个HTML文件将生成在 `dist-singlefile/index.html`。

这个文件包含了：
- ✅ 所有JavaScript代码（内联）
- ✅ 所有CSS样式（内联）
- ✅ 所有依赖库（React、Ant Design、Chart.js等）
- ✅ 所有资源文件（如果有）

## 使用方法

1. 构建完成后，找到 `dist-singlefile/index.html` 文件
2. 双击该文件，或在浏览器中打开
3. 无需任何服务器，即可直接使用所有功能

## 注意事项

- 文件大小约为 2MB（压缩后约 626KB）
- 首次加载可能需要几秒钟时间
- 所有功能与正常构建版本完全相同
- 支持离线使用（除了AI功能需要网络连接）

## 文件大小优化

如果需要减小文件大小，可以考虑：
- 移除未使用的依赖
- 使用代码分割（但这会生成多个文件）
- 压缩图片资源（如果有）

## 与正常构建的区别

- **正常构建** (`pnpm run build`): 生成多个文件，需要服务器部署
- **单文件构建** (`pnpm run build:singlefile`): 生成单个HTML文件，可直接打开

两种构建方式功能完全相同，只是部署方式不同。

