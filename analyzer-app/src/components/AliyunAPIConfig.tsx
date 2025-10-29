import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AliyunAPIConfig: React.FC = () => {
  const { t } = useTranslation();
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
        {t('api.title')}
      </h3>

      <div className="space-y-4">
        {/* API Key输入 */}
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            {t('api.apiKey')}
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t('api.apiKeyPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all-300"
          />
        </div>

        {/* 模型选择 */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            {t('api.modelSelect')}
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all-300"
          >
            <option value="qwen-plus">{t('api.qwenPlus')}</option>
            <option value="qwen-max">{t('api.qwenMax')}</option>
            <option value="qwen-turbo">{t('api.qwenTurbo')}</option>
          </select>
        </div>

        {/* 保存按钮 */}
        <div>
          <button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-all-300 flex items-center"
          >
            <i className="fa fa-save mr-2"></i>
            {t('api.save')}
          </button>
        </div>

        {/* 保存成功提示 */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
            <i className="fa fa-check-circle text-green-500 mr-2"></i>
            <span className="text-green-700 text-sm">{t('api.saveSuccess')}</span>
          </div>
        )}

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-blue-700 mb-2">💡 {t('api.tips')}</p>
          <ul className="list-disc list-inside text-blue-600 space-y-1">
            <li>{t('api.tip1')}</li>
            <li>{t('api.tip2')}</li>
            <li>{t('api.tip3')}</li>
            <li>{t('api.tip4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AliyunAPIConfig;
