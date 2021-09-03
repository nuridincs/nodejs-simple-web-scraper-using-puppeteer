const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  const domain = "https://app.kukelola.id/Home/Login?ReturnUrl=%2F";
  const websiteUrl = domain;
  const username = 'demosuperadmin@kukelola.com';
  const password = 'Dem0@kukelola';

  await page.goto(websiteUrl);
  await page.waitForSelector("#username");
  await page.type("#username", username);
  await page.type("#password", password);
  await page.click(".btnLogin");
  // Get cookies
  const cookies = await page.cookies();

  // Use cookies in other tab or browser
  const page2 = await browser.newPage();
  await page2.setCookie(...cookies);
  await page2.goto('https://app.kukelola.id/', {waitUntil : 'networkidle2' });
  const getCookie = await page2._client.send('Network.getAllCookies');
  console.log('getCookie: ', getCookie);
})();