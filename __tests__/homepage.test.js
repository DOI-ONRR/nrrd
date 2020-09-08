const puppeteer = require('puppeteer');
const ScreenshotTester = require('puppeteer-screenshot-tester')

const fs = require('fs');

(async () => {
    const argv = process.argv
    console.debug(argv)
    const site = argv[2]
    console.debug(site)
    const tester = await ScreenshotTester(0.8, false, false, [], {
      transparency: 0.5
    })
    const browser = await puppeteer.launch({defaultViewport: {width:1440, height:2400}, headless: false});
  const page = await browser.newPage();
//  await page.setViewport({ width: 1440, height: 1600});
    await page.goto(site, {waitUntil: 'networkidle0'});
    const result1 = await tester(page, 'fiscal_revenue.png', {
      fullPage: true,
    })
    
    if ( result1 ) {
	console.log("fiscal revenue screenshot is the same!")
	await page.screenshot({path: 'fiscal_revenue.png'});
    } else {
	console.log("fiscal revenue screenshot is NOT the same!")
	await page.screenshot({path: 'fiscal_revenue.png'});

    }
  
    await page.click('#full-width-tabpanel-0 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1) > div > button:nth-child(2)')
    //   await page.waitForNavigation()
    const result2 = await tester(page, 'month_revenue.png', {
      fullPage: true,
    })
    
    if ( result2 ) {
	console.log("fiscal revenue screenshot is the same!")
	await page.screenshot({path: 'month_revenue.png'});
    } else {
	console.log("fiscal revenue screenshot is NOT the same!")
	await page.screenshot({path: 'month_revenue.png'});
    }
    await page.screenshot({path: 'month_revenue.png'});
  await browser.close();
})();
