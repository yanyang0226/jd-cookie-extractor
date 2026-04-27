document.addEventListener('DOMContentLoaded', () => {
  const openJdBtn = document.getElementById('openJd');
  const extractBtn = document.getElementById('extractCookie');
  const resultText = document.getElementById('resultText');
  const copyBtn = document.getElementById('copyBtn');
  const status = document.getElementById('status');

  // 打开京东
  openJdBtn.addEventListener('click', async () => {
    try {
      const url = 'https://m.jd.com/';
      // 在当前窗口新建标签页
      const tab = await chrome.tabs.create({ url, active: true });
      status.textContent = '已打开京东，请登录...';
    } catch (error) {
      status.textContent = '打开失败: ' + error.message;
    }
  });

  // 提取Cookie
  extractBtn.addEventListener('click', async () => {
    try {
      status.textContent = '正在提取...';
      resultText.value = '';

      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.url.includes('jd.com')) {
        status.textContent = '请先打开京东网站';
        return;
      }

      // 从京东域名读取cookie (需要分别查询pt_key和pt_pin)
      const [ptKeyCookie, ptPinCookie] = await Promise.all([
        chrome.cookies.get({ url: 'https://m.jd.com/', name: 'pt_key' }),
        chrome.cookies.get({ url: 'https://m.jd.com/', name: 'pt_pin' })
      ]);

      if (!ptKeyCookie || !ptPinCookie) {
        status.textContent = 'Cookie不完整，请确认已登录';
        return;
      }

      resultText.value = `pt_key=${ptKeyCookie.value};pt_pin=${ptPinCookie.value};`;
      status.textContent = '提取成功!';
    } catch (error) {
      status.textContent = '提取失败: ' + error.message;
    }
  });

  // 复制功能
  copyBtn.addEventListener('click', async () => {
    if (!resultText.value) {
      status.textContent = '没有内容可复制';
      return;
    }
    try {
      await navigator.clipboard.writeText(resultText.value);
      status.textContent = '已复制到剪贴板';
    } catch (error) {
      status.textContent = '复制失败';
    }
  });
});