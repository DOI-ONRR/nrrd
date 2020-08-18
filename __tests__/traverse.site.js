const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const argv = process.argv
    console.debug(argv)
    const site = argv[2]
    console.debug(site)

    const browser = await puppeteer.launch({defaultViewport: {width:1440, height:2400}, headless: false});
  const page = await browser.newPage();
//  await page.setViewport({ width: 1440, height: 1600});
    await page.goto(site, {waitUntil: 'networkidle0'});
    await page.screenshot({path: 'fiscal_revenue.png'});
    await await page.click('#full-width-tabpanel-0 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1) > div > button:nth-child(2)')
 //   await page.waitForNavigation()
    await page.screenshot({path: 'month_revenue.png'});
  await browser.close();
})();
