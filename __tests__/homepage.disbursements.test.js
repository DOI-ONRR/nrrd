const TIMEOUT = process.env.TIMEOUT ? process.env.TIMEOUT : 30000
const URL = process.env.URL ? process.env.URL : 'https://dev-nrrd.app.cloud.gov'
const STEP = process.env.STEP ? process.env.STEP : 0
const { toMatchImageSnapshot } = require('jest-image-snapshot')

const matchOptions={failureThreshold: 1, failureThresholdType: 'percent'} //customDiffConfig: {threshold: 0.1}}

expect.extend({ toMatchImageSnapshot })


describe( 'Home Page Disbursements: ', () => {   
    let page
    beforeAll(async () => {
	jest.setTimeout(TIMEOUT)
	
	page = await global.__BROWSER__.newPage()
	await page.goto(URL)
    }, TIMEOUT)
    
    afterAll(async () => {
	await page.close()
    })
    const ScreenshotTest = ( title, commands, target) => {
	it(title, async () => {
	    await page.setViewport({
		width: 1440,
		height: 2400
	    })
	    for( let ii=0; ii < commands.length; ii++ ){
		await page[commands[ii].command](commands[ii].selector)
	    }
	    
	    const element = await page.waitForXPath(target)
	    const image = await element.screenshot()
	    try  {
		expect(image).toMatchImageSnapshot(matchOptions)
		if(STEP > 0) {  await page.evaluate( (t) => alert(t+ ' detected no changed.'), title) }
	    } catch (err) {
		console.debug(err)
		await page.evaluate((t) => alert('Note: ' + t + ' has detected a change, please review.'), title)
	    }
	    
	})
    }
    let title = 'Yearly Fiscal Disbursements Test'
    ScreenshotTest(title, [{command: 'click', selector: '#full-width-tab-1'}], '/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[2]/div/div/div[4]/div[2]')

    title = 'Monthly Most Recent Disbursements Test'
    ScreenshotTest(title,
		   [
		       {command: 'click', selector: '#full-width-tab-1'},
		       {command: 'click', selector: '#full-width-tabpanel-1 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1)'}
		   ],
		   '/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[2]/div/div/div[4]/div[2]')

    title = 'Monthly Fiscal Year Disbursements Test'
    ScreenshotTest(title,
		   [
		       {command: 'click', selector: '#full-width-tab-1'},
		       {command: 'click', selector: '#full-width-tabpanel-1 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1)'},
		       {command: 'click', selector:'#period-label-select-outlined'},
		       {command: 'click', selector:'#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)'}
		   ],
		   '/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[2]/div/div/div[4]/div[2]')

    title = 'Monthly Calendar Year Disbursements Test'
    ScreenshotTest(title,
		   [
		       {command: 'click', selector: '#full-width-tab-1'},
		       {command: 'click', selector: '#full-width-tabpanel-1 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1)'},
		       {command: 'click', selector:'#period-label-select-outlined'},
		       {command: 'click', selector:'#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)'}
		   ],
		   '/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[2]/div/div/div[4]/div[2]')

}, TIMEOUT)

/* Attempt at generalizing even more then test harness... 
   const ScreenshotTest = ( title, commands, target) => {
   it(title, async () => {
   await page.setViewport({
   width: 1440,
   height: 2400
   })
   for( let ii=0; ii < commands.length; ii++ ){
   page[commands[ii].command](commands[ii].selector)
   }
   
   const element = await page.waitForXPath(target)
   const image = await element.screenshot()

   
   try  {
   expect(image).toMatchImageSnapshot(matchOptions)
   if(STEP > 0) {  await page.evaluate(() => alert("Element has not changed")) }
   } catch (err) {
   console.debug(err)
   await page.evaluate(() => alert("Note: "+title+" has detected a change, please review."))
   }
   })
   }	


   
   ScreenshotTest('Try1' ,
   [
   {command: 'click', selector: '#full-width-tabpanel-0 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1) > div > button:nth-child(2)'},
   {command: 'click', selector:'#period-label-select-outlined'}   ,
   {command: 'click', selector:'#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)'}
   ],#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)
   '/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[1]/div/div/div[4]/div[2]')
   
   },
*/
