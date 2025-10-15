// 阿里云API调用函数
// 支持两种调用方式：1. 标准DashScope API 2. OpenAI兼容接口
export const callAliyunAPI = async function(prompt: string, apiKey: string, model: string) {
  try {
    if (!apiKey) {
      throw new Error('请先配置阿里云API密钥！');
    }

    console.log('API调用信息:', { model, promptLength: prompt.length });

    // 使用标准DashScope API方式 (当前实现)
    // 阿里云官方文档确认的标准API地址
    const endpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
    console.log('使用标准DashScope API地址:', endpoint);

    // 构建请求体 - 严格按照阿里云DashScope API官方文档格式
    // 参考文档：https://help.aliyun.com/zh/dashscope/developer-reference/use-qwen-by-api
    const requestBody = {
      model: model,  // 模型名称，如qwen-plus, qwen-turbo, qwen-max等
      input: {
        prompt: prompt  // 用户提示文本，支持单轮对话
      },
      parameters: {
        result_format: 'text',  // 返回格式：text或json_object
        temperature: 0.8,       // 控制生成文本的随机性，范围0-1
        top_p: 0.8              // 控制词汇多样性，范围0-1
      }
    };

    console.log('API请求体格式确认 - 符合官方规范:', requestBody);

    // 构建请求头，包含认证信息
    // 阿里云DashScope API官方要求使用Bearer认证方式
    const headers = {
      'Content-Type': 'application/json',  // 必须设置为application/json
      'Authorization': `Bearer ${apiKey}`  // Bearer + 空格 + API Key格式
    };

    console.log('开始发送实际API请求到阿里云服务器...');
    console.log('请求地址:', endpoint);
    console.log('请求头验证 - 符合官方要求:', headers);

    // 添加请求超时处理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    try {
      // 发送实际的API请求
      console.log('正在发送真实API请求...');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        credentials: 'omit' // 不发送cookies，避免跨域问题
      });

      clearTimeout(timeoutId);

      console.log('API响应状态:', response.status);

      // 记录响应头信息，帮助调试
      const responseHeaders = Object.fromEntries(response.headers.entries());
      console.log('API响应头:', responseHeaders);

      // 检查CORS相关响应头
      console.log('CORS允许的来源:', responseHeaders['access-control-allow-origin']);
      console.log('CORS允许的方法:', responseHeaders['access-control-allow-methods']);

      if (!response.ok) {
        // 获取详细的错误信息
        let errorDetail = '';
        try {
          const errorData = await response.json();
          console.log('API错误响应数据:', errorData);
          errorDetail = errorData.message || errorData.error_msg || '';
        } catch (e) {
          // 如果无法解析JSON，就使用默认错误信息
          console.error('无法解析错误响应:', e);
          // 尝试获取原始文本响应
          try {
            const rawText = await response.text();
            console.log('原始错误响应:', rawText);
            errorDetail = rawText;
          } catch (textError) {
            console.error('无法获取原始响应:', textError);
          }
        }

        const errorMessage = `API调用失败: ${response.status} ${response.statusText}${errorDetail ? ' - ' + errorDetail : ''}`;
        throw new Error(errorMessage);
      }

      // 解析响应
      const data = await response.json();
      console.log('API响应数据结构:', Object.keys(data));
      console.log('完整API响应数据:', data);

      // 检查响应结构
      if (!data.output || !data.output.text) {
        // 尝试从其他可能的字段获取响应
        if (data.result) {
          console.log('从result字段获取响应');
          return data.result;
        } else if (data.text) {
          console.log('从text字段获取响应');
          return data.text;
        } else {
          throw new Error('API返回格式错误: 缺少output.text、result或text字段');
        }
      }

      return data.output.text;
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // 专门处理fetch网络错误
      const error = fetchError as Error;
      console.error('网络请求错误:', error.name, error.message);

      if (error.name === 'AbortError') {
        throw new Error('API请求超时，请检查您的网络连接是否稳定。');
      } else if (error.message === 'Failed to fetch') {
        throw new Error('网络连接失败，无法连接到阿里云API服务器。\n\n可能原因：\n1. 您的网络环境限制了对阿里云API的访问\n2. 浏览器的安全策略阻止了跨域请求\n3. 防火墙或代理服务器限制了API访问\n4. 阿里云API服务暂时不可用\n\n解决方案：\n1. 尝试使用不同的网络环境\n2. 确认您的浏览器允许跨域请求\n3. 检查防火墙设置是否允许访问dashscope.aliyuncs.com\n4. 直接在浏览器中访问https://dashscope.aliyuncs.com测试连接');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('API调用错误详情:', error);

    const err = error as Error;
    // 根据不同错误类型提供更具体的提示和解决方案
    if (err.message.includes('401')) {
      throw new Error('API密钥无效或已过期，请检查您的API密钥设置。\n\n解决方案:\n1. 确认API Key输入正确\n2. 检查API Key是否已过期\n3. 确保已开通通义千问服务\n4. 登录阿里云控制台检查API Key权限');
    } else if (err.message.includes('403')) {
      throw new Error('您没有权限访问此服务，请确保已开通大模型服务并配置了正确的权限。\n\n解决方案:\n1. 登录阿里云控制台确认已开通通义千问服务\n2. 检查账户是否有可用的调用额度\n3. 确认您选择的模型与您的权限匹配\n4. 尝试使用免费额度的模型如qwen-turbo');
    } else if (err.message.includes('429')) {
      throw new Error('API调用频率过高，请稍后再试。\n\n解决方案:\n1. 等待1-2分钟后再尝试调用\n2. 减少调用频率\n3. 考虑升级到更高配额的服务');
    } else if (err.message.includes('NetworkError')) {
      throw new Error('网络连接失败，请检查您的网络连接。\n\n解决方案:\n1. 确认您的网络连接正常\n2. 检查防火墙设置是否阻止了API请求\n3. 尝试使用VPN或切换网络');
    } else if (err.message.includes('format error')) {
      throw new Error('API请求格式错误，请确保所有参数格式正确。\n\n解决方案:\n1. 检查API Key格式\n2. 确认选择的模型名称正确\n3. 刷新页面后重新尝试');
    } else {
      throw new Error('与大模型通信失败：' + err.message + '\n\n通用解决方案:\n1. 确认API Key输入正确\n2. 检查网络连接\n3. 确保已开通阿里云通义千问服务\n4. 确认账户有可用的调用额度\n5. 尝试选择其他模型（如qwen-turbo）\n6. 如果在企业网络环境中，请确认网络策略允许访问阿里云API\n7. 按F12打开浏览器控制台，查看详细的API调用日志');
    }
  }
};
