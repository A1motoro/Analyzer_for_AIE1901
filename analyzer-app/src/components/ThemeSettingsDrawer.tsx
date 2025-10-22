import React from 'react';
import { Drawer, Radio, Space, Typography, Divider, Button } from 'antd';
import { SettingOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ThemeSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  currentTheme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
}

const ThemeSettingsDrawer: React.FC<ThemeSettingsDrawerProps> = ({
  open,
  onClose,
  currentTheme,
  onThemeChange,
}) => {
  return (
    <Drawer
      title={
        <Space>
          <SettingOutlined />
          <span>界面配置</span>
        </Space>
      }
      placement="right"
      open={open}
      onClose={onClose}
      width={320}
      bodyStyle={{
        padding: '24px',
        background: currentTheme === 'dark' ? '#2f2e27' : '#f8f9fa',
      }}
      headerStyle={{
        background: currentTheme === 'dark' ? '#49483e' : '#ffffff',
        borderBottom: currentTheme === 'dark' ? '1px solid #3e3d32' : '1px solid #dadde1',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 主题选择 */}
        <div>
          <Title level={5} style={{
            color: currentTheme === 'dark' ? '#f8f8f2' : '#1c1e21',
            marginBottom: '16px'
          }}>
            🎨 主题选择
          </Title>
          <Radio.Group
            value={currentTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `2px solid ${currentTheme === 'dark' ? '#fd971f' : 'transparent'}`,
                  borderRadius: '8px',
                  background: currentTheme === 'dark' ? '#49483e' : '#ffffff',
                  cursor: 'pointer',
                }}
                onClick={() => onThemeChange('dark')}
              >
                <Radio value="dark" style={{ marginRight: '12px' }} />
                <div style={{ flex: 1 }}>
                  <Space>
                    <MoonOutlined style={{ color: '#fd971f' }} />
                    <Text strong style={{ color: currentTheme === 'dark' ? '#f8f8f2' : '#1c1e21' }}>
                      暗色主题 (Monokai)
                    </Text>
                  </Space>
                  <Text style={{
                    fontSize: '12px',
                    color: currentTheme === 'dark' ? '#c8c8c2' : '#65676b',
                    display: 'block',
                    marginTop: '4px'
                  }}>
                    VSCode经典配色，护眼的深色主题
                  </Text>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `2px solid ${currentTheme === 'light' ? '#fd971f' : 'transparent'}`,
                  borderRadius: '8px',
                  background: currentTheme === 'dark' ? '#49483e' : '#ffffff',
                  cursor: 'pointer',
                }}
                onClick={() => onThemeChange('light')}
              >
                <Radio value="light" style={{ marginRight: '12px' }} />
                <div style={{ flex: 1 }}>
                  <Space>
                    <SunOutlined style={{ color: '#e6a23c' }} />
                    <Text strong style={{ color: currentTheme === 'dark' ? '#f8f8f2' : '#1c1e21' }}>
                      亮色主题
                    </Text>
                  </Space>
                  <Text style={{
                    fontSize: '12px',
                    color: currentTheme === 'dark' ? '#c8c8c2' : '#65676b',
                    display: 'block',
                    marginTop: '4px'
                  }}>
                    清爽的亮色界面，适合明亮环境
                  </Text>
                </div>
              </div>
            </Space>
          </Radio.Group>
        </div>

        <Divider style={{
          borderColor: currentTheme === 'dark' ? '#3e3d32' : '#dadde1'
        }} />

        {/* 其他设置 */}
        <div>
          <Title level={5} style={{
            color: currentTheme === 'dark' ? '#f8f8f2' : '#1c1e21',
            marginBottom: '16px'
          }}>
            ⚙️ 其他设置
          </Title>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              type="text"
              block
              style={{
                textAlign: 'left',
                color: currentTheme === 'dark' ? '#c8c8c2' : '#65676b',
                border: 'none',
                background: 'transparent',
              }}
            >
              🔄 重置为默认设置
            </Button>

            <Button
              type="text"
              block
              style={{
                textAlign: 'left',
                color: currentTheme === 'dark' ? '#c8c8c2' : '#65676b',
                border: 'none',
                background: 'transparent',
              }}
            >
              💾 导出配置
            </Button>

            <Button
              type="text"
              block
              style={{
                textAlign: 'left',
                color: currentTheme === 'dark' ? '#c8c8c2' : '#65676b',
                border: 'none',
                background: 'transparent',
              }}
            >
              📁 导入配置
            </Button>
          </Space>
        </div>

        <Divider style={{
          borderColor: currentTheme === 'dark' ? '#3e3d32' : '#dadde1'
        }} />

        {/* 关于信息 */}
        <div>
          <Title level={5} style={{
            color: currentTheme === 'dark' ? '#f8f8f2' : '#1c1e21',
            marginBottom: '16px'
          }}>
            ℹ️ 关于
          </Title>
          <Text style={{
            fontSize: '12px',
            color: currentTheme === 'dark' ? '#90908a' : '#8a8d91',
            lineHeight: '1.5'
          }}>
            数据分析师Web应用提供现代化的数据分析体验，
            支持多种统计方法和AI辅助分析。
          </Text>
        </div>
      </Space>
    </Drawer>
  );
};

export default ThemeSettingsDrawer;
