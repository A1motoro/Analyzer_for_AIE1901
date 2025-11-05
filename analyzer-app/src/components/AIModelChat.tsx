import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { callAliyunAPI } from '../api';

// Add Ant Design imports
import { Input, Button } from 'antd';

interface AIModelChatProps {
  analysisResult: any;
  data: number[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIModelChat: React.FC<AIModelChatProps> = ({ analysisResult, data }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'ready' | 'error' | 'configuring'>('ready');

  // 加载API配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('aliyunApiConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      // 检查配置完整性，只需API Key
      if (!parsedConfig.apiKey) {
        setApiStatus('error');
      } else {
        setApiStatus('ready');
      }
    } else {
      setApiStatus('configuring');
    }
  }, []);

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // 检查是否配置了API，只需API Key
    if (!config?.apiKey) {
      setApiStatus('error');
      alert(t('ai.configuringDesc'));
      return;
    }

    const userMessage = inputMessage.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 构建完整的提示，包含数据分析结果
      let fullPrompt = userMessage;

      if (data.length > 0 && analysisResult) {
        fullPrompt += "\n\n" + t('ai.chatHint');
        fullPrompt += "\n- " + t('appInfo.dataPoints') + ": " + data.length;
        fullPrompt += "\n- " + t('statistics.mean') + ": " + analysisResult.mean?.toFixed(4);
        fullPrompt += "\n- " + t('statistics.median') + ": " + analysisResult.median?.toFixed(4);
        fullPrompt += "\n- " + t('statistics.stdDev') + ": " + analysisResult.stdDev?.toFixed(4);
        fullPrompt += "\n- " + t('statistics.skewness') + ": " + analysisResult.skewness?.toFixed(4);
        fullPrompt += "\n- " + t('statistics.kurtosis') + ": " + analysisResult.kurtosis?.toFixed(4);

        if (analysisResult.mleParams && analysisResult.momParams) {
          fullPrompt += "\n\n" + t('parameter.comparison') + ":";
          fullPrompt += "\n- MLE " + t('statistics.mean') + ": " + analysisResult.mleParams.mean?.toFixed(4);
          fullPrompt += "\n- MoM " + t('statistics.mean') + ": " + analysisResult.momParams.mean?.toFixed(4);
        }
      }

      // 调用阿里云API，仅使用API Key认证
      const response = await callAliyunAPI(fullPrompt, config.apiKey, config.model);

      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error('API调用错误详情:', error);
      let errorMessage = t('errors.apiError');

      // 根据错误类型提供更具体的提示
      if (error.message.includes('API密钥无效')) {
        errorMessage += '\n\n' + t('errors.apiError') + ': ' + t('api.tip1');
      } else if (error.message.includes('权限')) {
        errorMessage += '\n\n' + t('errors.apiError') + ': ' + t('errors.apiError');
      } else if (error.message.includes('频率过高')) {
        errorMessage += '\n\n' + t('errors.apiError') + ': ' + t('errors.networkError');
      } else {
        errorMessage += '\n\n' + t('errors.apiError') + ': ' + error.message;
        errorMessage += '\n\n' + t('errors.networkError');
      }

      setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 预设问题建议
  const suggestionQuestions = [
    t('ai.chatHint') + "请分析我的数据分布特征",
    t('ai.chatHint') + "基于这些统计结果，我应该使用什么分析方法？",
    t('ai.chatHint') + "如何解释偏度和峰度的值？",
    t('ai.chatHint') + "这些数据适合进行回归分析吗？",
    t('ai.chatHint') + "MLE和MoM结果不同说明了什么？"
  ];

  // 根据API状态显示不同的提示
  const renderAPIStatusMessage = () => {
    if (apiStatus === 'configuring') {
      return (
        <div className="text-center text-blue-600 py-6">
          <i className="fa fa-info-circle text-2xl mb-2"></i>
          <p>{t('ai.configuring')}</p>
          <p className="text-sm mt-1">{t('ai.configuringDesc')}</p>
          <button
            onClick={() => window.location.hash = '#settings'}
            className="mt-3 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm py-1 px-4 rounded-full transition-all-300"
          >
            {t('ai.goToSettings')}
          </button>
        </div>
      );
    } else if (apiStatus === 'error') {
      return (
        <div className="text-center text-red-600 py-6">
          <i className="fa fa-exclamation-circle text-2xl mb-2"></i>
          <p>{t('ai.error')}</p>
          <p className="text-sm mt-1">{t('ai.errorDesc')}</p>
          <button
            onClick={() => window.location.hash = '#settings'}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 text-sm py-1 px-4 rounded-full transition-all-300"
          >
            {t('ai.editSettings')}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 h-[500px] flex flex-col animate-fade-in">
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--monokai-fg)' }}>
        {t('ai.title')}
      </h3>

      {/* API状态提示 */}
      {(apiStatus === 'configuring' || apiStatus === 'error') && renderAPIStatusMessage()}

      {/* 消息展示区域 */}
      <div className="flex-grow overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg">
        {messages.length === 0 && apiStatus === 'ready' ? (
          <div className="text-center text-gray-500 py-8">
            <i className="fa fa-comment-o text-4xl mb-2"></i>
            <p>{t('ai.startConversation')}</p>
            <p className="text-sm mt-1">{t('ai.chatHint')}</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div
                className={message.role === 'user'
                  ? 'bg-primary text-white rounded-lg p-3 max-w-[80%] rounded-tl-none'
                  : 'bg-gray-200 rounded-lg p-3 max-w-[80%] rounded-tr-none'
                }
              >
                <p className="text-balance">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {/* 加载动画 */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 rounded-lg p-3 max-w-[80%] rounded-tr-none animate-pulse-slow">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 预设问题建议 */}
      {messages.length === 0 && apiStatus === 'ready' && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">💡 {t('ai.chatHint')}</p>
          <div className="flex flex-wrap gap-2">
            {suggestionQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputMessage(question);
                  handleSendMessage();
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-all-300"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 - 仅当API状态为ready时显示 */}
      {apiStatus === 'ready' && (
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('ai.placeholder')}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            loading={isLoading}
            type="primary"
          >
            {isLoading ? null : <i className="fa fa-paper-plane"></i>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIModelChat;
