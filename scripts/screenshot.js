const puppeteer = require('puppeteer');
const path = require('path');

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 设置视口大小
  await page.setViewport({ width: 1280, height: 800 });
  
  // 访问首页
  await page.goto('http://localhost:40140/leetcode-hot-100', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // 等待页面加载完成
  await page.waitForSelector('.path-overview-container', { timeout: 15000 });
  
  // 等待动画完成
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 截取整个页面
  await page.screenshot({
    path: path.join(__dirname, '../public/screenshot-home.png'),
    fullPage: true
  });
  
  console.log('✅ 首页截图已保存到 public/screenshot-home.png');
  
  // 截取路径详情页
  await page.goto('http://localhost:40140/leetcode-hot-100#/path/two-pointers', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  await page.waitForSelector('.duolingo-path-container', { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.screenshot({
    path: path.join(__dirname, '../public/screenshot-path.png'),
    fullPage: true
  });
  
  console.log('✅ 路径详情截图已保存到 public/screenshot-path.png');
  
  await browser.close();
  console.log('🎉 截图完成！');
}

takeScreenshot().catch(err => {
  console.error('截图失败:', err);
  process.exit(1);
});
