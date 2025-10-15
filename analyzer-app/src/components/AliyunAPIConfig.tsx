import React, { useState, useEffect } from 'react';

const AliyunAPIConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('qwen-plus');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 加载已保存的配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('aliyunApiConfig');
    if (savedConfig) {
      const { apiKey: savedKey, model: savedModel } = JSON.parse(savedConfig);
      setApiKey(savedKey || '');
      setModel(savedModel || 'qwen-plus');
    }
  }, []);

  // 保存配置
  const handleSave = () => {
    const config = { apiKey, model };
    localStorage.setItem('aliyunApiConfig', JSON.stringify(config));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-12 animate-fade-in">
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--monokai-fg)' }}>
        阿里云API配置
      </h3>

      <div className="space-y-4">
        {/* API Key输入 */}
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="请输入您的阿里云API Key"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all-300"
          />
        </div>

        {/* 模型选择 */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            模型选择
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all-300"
          >
            <option value="qwen-plus">通义千问 Plus</option>
            <option value="qwen-max">通义千问 Max</option>
            <option value="qwen-turbo">通义千问 Turbo</option>
          </select>
        </div>

        {/* 保存按钮 */}
        <div>
          <button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-all-300 flex items-center"
          >
            <i className="fa fa-save mr-2"></i>
            保存配置
          </button>
        </div>

        {/* 保存成功提示 */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
            <i className="fa fa-check-circle text-green-500 mr-2"></i>
            <span className="text-green-700 text-sm">配置保存成功！</span>
          </div>
        )}

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-blue-700 mb-2">💡 提示：</p>
          <ul className="list-disc list-inside text-blue-600 space-y-1">
            <li>请确保您已在阿里云官网开通了大模型服务</li>
            <li>仅需要API Key即可连接阿里云DashScope API</li>
            <li>API Key仅保存在您的本地浏览器中，不会上传到任何服务器</li>
            <li>如需修改已保存的配置，重新输入并点击保存按钮即可</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AliyunAPIConfig;
