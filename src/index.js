const puppeteer = require('puppeteer-core');

const { locateChrome } = require("./utils");

(async () => {
  const browser = await puppeteer.launch({
      executablePath: await locateChrome()
  });
  const page = await browser.newPage();
  await page.goto('https://tones.wolfram.com/generate', {
    waitUntil: 'networkidle2',
  });
  const urls = await page.$$eval("main>div a", anchors => anchors.map(a => a.getAttribute("href")));

  const mp3Url = urls.find(url => url.endsWith("MP3"));

  console.log(mp3Url);

  await browser.close();
})();