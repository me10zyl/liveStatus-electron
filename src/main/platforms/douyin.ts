import puppeteer from 'puppeteer';
export async function getDouyinFollowList(cookies: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    // 设置Cookies
    const cookieArray = cookies.split(';').map(cookie => {
      const [name, value] = cookie.trim().split('=');
      return { name, value, domain: '.douyin.com', path: '/' };
    });
    await page.setCookie(...cookieArray);
  
    // 访问抖音关注页面
    await page.goto('https://www.douyin.com/follow', { waitUntil: 'networkidle2' });
  
    // 提取关注列表
    const followList = await page.evaluate(() => {
      const list = Array.from(document.querySelectorAll('.follow-item')).map(item => ({
        name: item.querySelector('.nickname')?.textContent || '',
        isLive: !!item.querySelector('.live-indicator'),
      }));
      return list;
    });
  
    await browser.close();
    return followList;
  }