import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // 主色调 - 使用 monokai 橙色
    colorPrimary: '#fd971f',

    // 背景色 - 增强对比度的monokai主题色
    colorBgBase: '#272822',        // 主背景
    colorBgContainer: '#2f2e27',   // 容器背景 - 更深的对比
    colorBgElevated: '#49483e',    // 提升的背景
    colorBgLayout: '#1e1e1e',      // 布局背景

    // 文字颜色 - 增强对比度
    colorText: '#f8f8f2',          // 主要文字 - 高对比度白色
    colorTextSecondary: '#c8c8c2', // 次要文字 - 更亮的灰色
    colorTextTertiary: '#90908a',  // 三级文字 - 中等灰色
    colorTextQuaternary: '#49483e', // 四级文字

    // 边框颜色
    colorBorder: '#49483e',
    colorBorderSecondary: '#3e3d32',

    // 成功、警告、错误颜色
    colorSuccess: '#a6e22e',
    colorWarning: '#e6db74',
    colorError: '#f92672',
    colorInfo: '#66d9ef',

    // 其他颜色
    colorLink: '#66d9ef',
    colorLinkHover: '#ae81ff',

    // 字体设置
    fontFamily: `'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB',
      'Source Han Sans SC', 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif`,

    // 圆角
    borderRadius: 8,

    // 阴影
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  components: {
    // Card 组件配置
    Card: {
      colorBgContainer: '#2f2e27',   // 使用新的容器背景色
      colorBorderSecondary: '#49483e',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    },

    // Button 组件配置
    Button: {
      colorBgContainer: '#2f2e27',   // 使用新的容器背景色
      colorBorder: '#49483e',
      colorText: '#f8f8f2',
      borderRadius: 6,
    },

    // Tabs 组件配置
    Tabs: {
      colorBgContainer: '#2f2e27',   // 使用新的容器背景色
      colorBorderSecondary: '#49483e',
      colorText: '#f8f8f2',
    },

    // Table 组件配置
    Table: {
      colorBgContainer: '#2f2e27',   // 使用新的容器背景色
      colorBorderSecondary: '#49483e',
      colorText: '#f8f8f2',
      colorTextHeading: '#f8f8f2',
      colorBgElevated: '#49483e',
    },

    // Statistic 组件配置
    Statistic: {
      colorText: '#f8f8f2',
      colorTextDescription: '#c8c8c2',  // 使用更亮的次要文字色
    },

    // Input 组件配置
    Input: {
      colorBgContainer: '#2f2e27',   // 使用新的容器背景色
      colorBorder: '#49483e',
      colorText: '#f8f8f2',
      colorTextPlaceholder: '#c8c8c2',  // 使用更亮的占位符色
    },

    // Modal 组件配置
    Modal: {
      colorBgElevated: '#2f2e27',    // 使用新的容器背景色
      colorBgMask: 'rgba(39, 40, 34, 0.8)',
      colorText: '#f8f8f2',
      colorTextHeading: '#f8f8f2',
    },

    // Layout 组件配置
    Layout: {
      colorBgHeader: '#1e1e1e',
      colorBgBody: '#272822',
      colorBgTrigger: '#2f2e27',     // 使用新的容器背景色
    },
  },
};
