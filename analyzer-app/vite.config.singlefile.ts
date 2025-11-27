import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 用于构建单个HTML文件的配置
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile()
  ],
  base: './', // 使用相对路径，确保独立文件可以正常工作
  build: {
    outDir: 'dist-singlefile',
    assetsInlineLimit: 100000000, // 内联所有资源
    cssCodeSplit: false, // 不分割CSS
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // 内联动态导入
        manualChunks: undefined, // 不使用代码分割
      }
    }
  }
})

