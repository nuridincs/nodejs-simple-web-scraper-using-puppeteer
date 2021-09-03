const express = require('express');
const puppeteer = require('puppeteer');
const app     = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/scrape', async function(req, res){
  const result = await loadScrapper();
  console.log('~ result', result);
  res.send(result);
});

const loadScrapper = async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--single-process', '--no-zygote', '--no-sandbox']
      // "args": ["--fast-start", "--disable-extensions", "--no-sandbox"],
      // "ignoreHTTPSErrors": true
    });
    const page = await browser.newPage();
    const domain = "https://app.kukelola.id/Home/Login?ReturnUrl=%2F";
    const websiteUrl = domain;
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    await page.goto(websiteUrl);
    await page.waitForSelector("#username");
    await page.type("#username", username);
    await page.type("#password", password);
    await page.click(".btnLogin");

    // Get cookies
    const cookies = await page.cookies()
    const page2 = await browser.newPage();
    await page2.setCookie(...cookies);
    await page2.goto('https://app.kukelola.id/', {waitUntil : 'networkidle2' });
    const resultCookie = await page2._client.send('Network.getAllCookies');

    return resultCookie;
    // await browser.close();
};

app.listen('8081')
console.log('Server running at port 8081');
exports = module.exports = app;
