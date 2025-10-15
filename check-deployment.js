// 检查GitHub Pages部署状态的简单脚本
// 在浏览器控制台中运行此代码

async function checkDeployment() {
  console.log('🔍 检查GitHub Pages部署状态...\n');

  const baseUrl = 'https://a1motoro.github.io/analyzer_for_aie1901';
  const testUrls = [
    '/',
    '/index.html',
    '/static/js/main.b186718e.js',
    '/favicon.ico'
  ];

  for (const url of testUrls) {
    try {
      const response = await fetch(baseUrl + url, { method: 'HEAD' });
      console.log(`${url}: ${response.status} ${response.statusText}`);
      if (response.status === 200) {
        console.log(`  ✅ 文件存在 (${response.headers.get('content-length')} bytes)`);
      } else {
        console.log(`  ❌ 文件不存在或无法访问`);
      }
    } catch (error) {
      console.log(`${url}: ❌ 网络错误 - ${error.message}`);
    }
  }

  console.log('\n📋 建议检查：');
  console.log('1. GitHub Actions是否成功完成');
  console.log('2. Pages设置是否为"GitHub Actions"');
  console.log('3. 等待5-10分钟让部署生效');
  console.log('4. 尝试硬刷新页面 (Ctrl+F5)');
}

// 运行检查
checkDeployment();
