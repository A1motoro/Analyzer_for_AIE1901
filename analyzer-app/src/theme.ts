import type { ThemeConfig } from 'antd';

// VSCode Dark (Monokai) 主题配置
export const darkTheme: ThemeConfig = {
  token: {
    // 主色调 - VSCode Monokai 橙色
    colorPrimary: '#fd971f',

    // 背景色 - VSCode Dark 配色
    colorBgBase: '#1e1e1e',        // 主背景
    colorBgContainer: '#252526',   // 容器背景
    colorBgElevated: '#2d2d30',    // 提升的背景
    colorBgLayout: '#1e1e1e',      // 布局背景

    // 文字颜色 - VSCode Dark 配色
    colorText: '#cccccc',          // 主要文字
    colorTextSecondary: '#cccccc', // 次要文字
    colorTextTertiary: '#8c8c8c',  // 三级文字
    colorTextQuaternary: '#6c6c6c', // 四级文字

    // 边框颜色
    colorBorder: '#3e3e42',
    colorBorderSecondary: '#2d2d30',

    // 状态颜色 - VSCode 配色
    colorSuccess: '#4ec9b0',
    colorWarning: '#dcdcaa',
    colorError: '#f44747',
    colorInfo: '#4fc3f7',

    // 链接颜色
    colorLink: '#4fc3f7',
    colorLinkHover: '#5cbaff',

    // 字体设置
    fontFamily: `'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB',
      'Source Han Sans SC', 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif`,

    // 圆角
    borderRadius: 6,

    // 阴影
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  components: {
    // Card 组件配置
    Card: {
      colorBgContainer: '#252526',
      colorBorderSecondary: '#3e3e42',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    },

    // Button 组件配置
    Button: {
      colorBgContainer: '#252526',
      colorBorder: '#3e3e42',
      colorText: '#cccccc',
      borderRadius: 6,
    },

    // Tabs 组件配置
    Tabs: {
      colorBgContainer: '#252526',
      colorBorderSecondary: '#3e3e42',
      colorText: '#cccccc',
    },

    // Table 组件配置
    Table: {
      colorBgContainer: '#252526',
      colorBorderSecondary: '#3e3e42',
      colorText: '#cccccc',
      colorTextHeading: '#cccccc',
      colorBgElevated: '#2d2d30',
    },

    // Statistic 组件配置
    Statistic: {
      colorText: '#cccccc',
      colorTextDescription: '#cccccc',
    },

    // Input 组件配置
    Input: {
      colorBgContainer: '#252526',
      colorBorder: '#3e3e42',
      colorText: '#cccccc',
      colorTextPlaceholder: '#8c8c8c',
    },

    // Modal 组件配置
    Modal: {
      colorBgElevated: '#252526',
      colorBgMask: 'rgba(0, 0, 0, 0.8)',
      colorText: '#cccccc',
      colorTextHeading: '#cccccc',
    },

    // Layout 组件配置
    Layout: {
      colorBgHeader: '#1e1e1e',
      colorBgBody: '#1e1e1e',
      colorBgTrigger: '#252526',
    },
  },
};

// VSCode Light 主题配置
export const lightTheme: ThemeConfig = {
  token: {
    // 主色调 - VSCode Light 蓝色
    colorPrimary: '#007acc',

    // 背景色 - VSCode Light 配色
    colorBgBase: '#ffffff',        // 主背景
    colorBgContainer: '#f3f3f3',   // 容器背景
    colorBgElevated: '#ffffff',    // 提升的背景
    colorBgLayout: '#ffffff',      // 布局背景

    // 文字颜色 - VSCode Light 配色
    colorText: '#000000',          // 主要文字
    colorTextSecondary: '#6c6c6c', // 次要文字
    colorTextTertiary: '#cccccc',  // 三级文字
    colorTextQuaternary: '#cccccc', // 四级文字

    // 边框颜色
    colorBorder: '#e5e5e5',
    colorBorderSecondary: '#cccccc',

    // 状态颜色 - VSCode Light 配色
    colorSuccess: '#107c10',
    colorWarning: '#c79100',
    colorError: '#d13438',
    colorInfo: '#007acc',

    // 链接颜色
    colorLink: '#007acc',
    colorLinkHover: '#005a9e',

    // 字体设置
    fontFamily: `'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB',
      'Source Han Sans SC', 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif`,

    // 圆角
    borderRadius: 6,

    // 阴影
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  components: {
    // Card 组件配置
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#e5e5e5',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },

    // Button 组件配置
    Button: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e5e5e5',
      colorText: '#000000',
      borderRadius: 6,
    },

    // Tabs 组件配置
    Tabs: {
      colorBgContainer: '#f3f3f3',
      colorBorderSecondary: '#e5e5e5',
      colorText: '#000000',
    },

    // Table 组件配置
    Table: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#e5e5e5',
      colorText: '#000000',
      colorTextHeading: '#000000',
      colorBgElevated: '#f3f3f3',
    },

    // Statistic 组件配置
    Statistic: {
      colorText: '#000000',
      colorTextDescription: '#6c6c6c',
    },

    // Input 组件配置
    Input: {
      colorBgContainer: '#ffffff',
      colorBorder: '#e5e5e5',
      colorText: '#000000',
      colorTextPlaceholder: '#cccccc',
    },

    // Modal 组件配置
    Modal: {
      colorBgElevated: '#ffffff',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorText: '#000000',
      colorTextHeading: '#000000',
    },

    // Layout 组件配置
    Layout: {
      colorBgHeader: '#ffffff',
      colorBgBody: '#ffffff',
      colorBgTrigger: '#f3f3f3',
    },
  },
};
