import { useState, useEffect } from 'react';
import { Modal, Input, Button, Space, Typography, message, Spin } from 'antd';
import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { callAliyunAPI } from '../api';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface AIDataGenerateDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (data: number[]) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIDataGenerateDialog = ({ open, onClose, onGenerate }: AIDataGenerateDialogProps) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<any>(null);

  // 加载API配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('aliyunApiConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
    }
  }, []);

  // 初始化欢迎消息
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: t('aiDataGenerate.welcome')
      }]);
    }
  }, [open, t]);

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!config?.apiKey) {
      message.warning(t('aiDataGenerate.configRequired'));
      return;
    }

    const userMessage = inputMessage.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 构建提示词
      const prompt = `${t('aiDataGenerate.promptPrefix')}\n\n${userMessage}\n\n${t('aiDataGenerate.promptSuffix')}`;

      const response = await callAliyunAPI(prompt, config.apiKey, config.model);
      
      setMessages([...newMessages, { role: 'assistant', content: response }]);
      
      // 尝试从响应中提取数据
      await extractAndGenerateData(response);
    } catch (error: any) {
      console.error('API调用错误:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: t('aiDataGenerate.error') + ': ' + error.message 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 从AI响应中提取数据并生成
  const extractAndGenerateData = async (aiResponse: string) => {
    setIsGenerating(true);
    
    try {
      // 尝试从响应中提取数字
      const numbers = aiResponse.match(/[\d.]+/g);
      
      if (numbers && numbers.length > 0) {
        // 转换为数字数组
        const data = numbers
          .map(n => parseFloat(n))
          .filter(n => !isNaN(n) && isFinite(n))
          .slice(0, 1000); // 限制最多1000个数据点

        if (data.length > 0) {
          onGenerate(data);
          message.success(t('aiDataGenerate.success').replace('{{count}}', data.length.toString()));
          onClose();
          return;
        }
      }

      // 如果无法直接提取，尝试让AI生成JSON格式的数据
      const jsonPrompt = `${t('aiDataGenerate.jsonPrompt')}\n\n${aiResponse}`;
      const jsonResponse = await callAliyunAPI(jsonPrompt, config.apiKey, config.model);
      
      // 尝试解析JSON
      const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[0]);
          if (jsonData.data && Array.isArray(jsonData.data)) {
            const data = jsonData.data
              .map((n: any) => parseFloat(n))
              .filter((n: number) => !isNaN(n) && isFinite(n))
              .slice(0, 1000);
            
            if (data.length > 0) {
              onGenerate(data);
              message.success(t('aiDataGenerate.success').replace('{{count}}', data.length.toString()));
              onClose();
              return;
            }
          }
        } catch (e) {
          console.error('JSON解析失败:', e);
        }
      }

      // 如果都失败了，生成基于描述的数据
      generateDataFromDescription(aiResponse);
    } catch (error: any) {
      console.error('数据生成错误:', error);
      message.error(t('aiDataGenerate.generateError'));
    } finally {
      setIsGenerating(false);
    }
  };

  // 根据描述生成数据
  const generateDataFromDescription = (description: string) => {
    // 简单的启发式方法：根据描述生成数据
    let data: number[] = [];
    const sampleSize = 500;

    if (description.toLowerCase().includes('normal') || description.includes('正态')) {
      // 正态分布
      const mean = 50;
      const stdDev = 15;
      for (let i = 0; i < sampleSize; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(z * stdDev + mean);
      }
    } else if (description.toLowerCase().includes('uniform') || description.includes('均匀')) {
      // 均匀分布
      const min = 0;
      const max = 100;
      for (let i = 0; i < sampleSize; i++) {
        data.push(min + Math.random() * (max - min));
      }
    } else if (description.toLowerCase().includes('exponential') || description.includes('指数')) {
      // 指数分布
      const lambda = 0.1;
      for (let i = 0; i < sampleSize; i++) {
        data.push(-Math.log(Math.random()) / lambda);
      }
    } else {
      // 默认：正态分布
      const mean = 50;
      const stdDev = 15;
      for (let i = 0; i < sampleSize; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(z * stdDev + mean);
      }
    }

    onGenerate(data);
    message.success(t('aiDataGenerate.success').replace('{{count}}', data.length.toString()));
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInputMessage('');
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <RobotOutlined style={{ color: '#ae81ff' }} />
          <Text strong style={{ color: '#f8f8f2' }}>{t('aiDataGenerate.title')}</Text>
        </Space>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      style={{ top: 20 }}
      styles={{
        body: {
          backgroundColor: '#272822',
          maxHeight: '70vh',
          overflow: 'auto'
        },
        header: {
          backgroundColor: '#272822',
          borderBottom: '1px solid #49483e'
        }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 消息区域 */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          marginBottom: 16,
          padding: '16px',
          backgroundColor: '#2f2e27',
          borderRadius: '8px',
          minHeight: '300px',
          maxHeight: '400px'
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: message.role === 'user' 
                    ? '#ae81ff' 
                    : '#49483e',
                  color: '#f8f8f2'
                }}
              >
                <Paragraph style={{ margin: 0, color: '#f8f8f2' }}>
                  {message.content}
                </Paragraph>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
              <Spin size="small" />
              <Text style={{ marginLeft: 8, color: '#90908a' }}>
                {t('aiDataGenerate.thinking')}
              </Text>
            </div>
          )}

          {isGenerating && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
              <Spin size="small" />
              <Text style={{ marginLeft: 8, color: '#90908a' }}>
                {t('aiDataGenerate.generating')}
              </Text>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('aiDataGenerate.placeholder')}
            disabled={isLoading || isGenerating || !config?.apiKey}
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{
              backgroundColor: '#2f2e27',
              borderColor: '#49483e',
              color: '#f8f8f2'
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={isLoading || isGenerating || !inputMessage.trim() || !config?.apiKey}
            loading={isLoading}
            style={{
              backgroundColor: '#ae81ff',
              borderColor: '#ae81ff',
              height: 'auto'
            }}
          >
            {t('aiDataGenerate.send')}
          </Button>
        </Space.Compact>

        {!config?.apiKey && (
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#49483e', borderRadius: '8px' }}>
            <Text style={{ color: '#fd971f' }}>
              {t('aiDataGenerate.configRequired')}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIDataGenerateDialog;

