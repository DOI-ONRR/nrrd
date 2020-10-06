const TIMEOUT = process.env.TIMEOUT ? process.env.TIMEOUT : 30000
const URL = process.env.URL ? process.env.URL : 'https://dev-nrrd.app.cloud.gov'
const STEP = process.env.STEP ? process.env.STEP : 0
const { toMatchImageSnapshot } = require('jest-image-snapshot')
const FAILURE_THRESHOLD = process.env.FAILURE_THRESHOLD ? process.env.FAILURE_THRSHOLD : 2
const FAILURE_THRESHOLD_TYPE = process.env.FAILURE_THRESHOLD_TYPE ? process.env.FAILURE_THRESHOLD_TYPE : 'percent'
const matchOptions={failureThreshold: FAILURE_THRESHOLD, failureThresholdType: FAILURE_THRESHOLD_TYPE} //customDiffConfig: {threshold: 0.1}}


expect.extend({ toMatchImageSnapshot })

describe(
    '/ (Home Page)',
    () => {
	let page
	beforeAll(async () => {
	    jest.setTimeout(TIMEOUT)

	    page = await global.__BROWSER__.newPage()
	    await page.goto(URL)
	}, TIMEOUT)

	afterAll(async () => {
	    await page.close()
	})

	it('Title should be: Home | Natural Resources Revenue Data ', async () => {
	    const title = await page.title();
            expect(title).toBe('Home | Natural Resources Revenue Data');
	})
	it('Home Page ', async () => {
	    const title = await page.title();
	    await page.waitForXPath('/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[1]/div/div/div[4]/div[2]')
	    const image = await page.screenshot()
	    try  {
		expect(image).toMatchImageSnapshot(matchOptions)
		if(STEP > 0) {  await page.evaluate(() => alert("Page has not changed")) }
	    } catch(err) {
		console.debug(err)
		await page.evaluate(() => alert("Note: yearly fiscal revenue chart has changed"))
		
		
	    }
	})
    })
/*
describe( 'Home Page Revenue: ', () => {
    let page
    beforeAll(async () => {
	jest.setTimeout(TIMEOUT)

	page = await global.__BROWSER__.newPage()
	await page.goto(URL)
    }, TIMEOUT)

    afterAll(async () => {
	await page.close()
    })

    it('Yearly Fiscal Revenue screenshot: ', async () => {
	//	    await page.waitFor(29000);
	await page.setViewport({
	    width: 1440,
	    height: 2400
	})

	const graph = await page.waitForXPath('/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[1]/div/div/div[4]/div[2]')
	const image = await graph.screenshot()
	try  {
	    expect(image).toMatchImageSnapshot(matchOptions)
	    if(STEP > 0) {  await page.evaluate(() => alert("Page has not changed")) }
	} catch(err) {
	    console.debug(err)
	    await page.evaluate(() => alert("Note: yearly fiscal revenue chart has changed"))
	    
	    
	}
    })
    it('Yearly Calendar Revenue screenshot: ', async () => {
	//	    await page.waitFor(29000);
	await page.setViewport({
	    width: 1440,
	    height: 2400
	})

	await page.click('#period-label-select-outlined')
	
        await page.click('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)')
	const graph = await page.waitForXPath('/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[1]/div/div/div[4]/div[2]')
	const image = await graph.screenshot()

	
	try  {
	    expect(image).toMatchImageSnapshot(matchOptions)
	    if(STEP > 0) {  await page.evaluate(() => alert("Page has not changed")) }
	} catch (err) {
	    console.debug(err)
	    await page.evaluate(() => alert("Note: yearly calendar revenue chart has changed"))
	}
    })
    it('Most Recent Monthly Revenue screenshot: ', async () => {
	//	    await page.waitFor(29000);
	await page.setViewport({
	    width: 1440,
	    height: 2400
	})

	const button = page.click('#full-width-tabpanel-0 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1) > div > button:nth-child(2)')
	const graph = await page.waitForXPath('/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[1]/div/div/div[4]/div[2]')

	const image = await graph.screenshot()

	
	try  {
	    expect(image).toMatchImageSnapshot(matchOptions)
	    if(STEP > 0) {  await page.evaluate(() => alert("Page has not changed")) }
	} catch (err) {
	    console.debug(err)
	    await page.evaluate(() => alert("Note: monthly fiscal revenue chart has changed"))
	}
    })
    it('Monthly Calendar Revenue screenshot: ', async () => {
	//	    await page.waitFor(29000);
	await page.setViewport({
	    width: 1440,
	    height: 2400
	})
	await page.click('#full-width-tabpanel-0 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1) > div > button:nth-child(2)')
	await page.click('#period-label-select-outlined')
        await page.click('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)')
	const graph = await page.waitForXPath('/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[1]/div/div/div[4]/div[2]')
	const image = await graph.screenshot()

	
	try  {
	    expect(image).toMatchImageSnapshot(matchOptions)
	    if(STEP > 0) {  await page.evaluate(() => alert("Page has not changed")) }
	} catch (err) {
	    console.debug(err)
	    await page.evaluate(() => alert("Note: yearly calendar revenue chart has changed"))
	}
    })
    it('Monthly Fiscal Revenue screenshot: ', async () => {
	//	    await page.waitFor(29000);
	await page.setViewport({
	    width: 1440,
	    height: 2400
	})
	await page.click('#full-width-tabpanel-0 > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-4 > div:nth-child(1) > div > button:nth-child(2)')
	await page.click('#period-label-select-outlined')
        await page.click('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(3)')
	const graph = await page.waitForXPath('/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[1]/div/div/div[4]/div[2]')
	const image = await graph.screenshot()
	
	
	try  {
	    expect(image).toMatchImageSnapshot(matchOptions)
	    if(STEP > 0) {  await page.evaluate(() => alert("Page has not changed")) }
	} catch (err) {
	    console.debug(err)
	    await page.evaluate(() => alert("Note: monthly fiscal revenue chart has changed"))
	}
    })
}, TIMEOUT)

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
    
    let title = 'Yearly Fiscal Disbursements Test'
    it(title, async () => {
	const t='Yearly Fiscal Disbursements Test'
	await page.setViewport({
	    width: 1440,
	    height: 2400
	})
	await page.click('#full-width-tab-1')
	const element = await page.waitForXPath('/html/body/div/div[1]/main/div[2]/div/div/div/div[2]/div[2]/div/div/div[4]/div[2]')
	const image = await element.screenshot()
	try  {
	    expect(image).toMatchImageSnapshot(matchOptions)
	    if(STEP > 0) {  await page.evaluate( (t) => alert(t+ ' detected no changed.'), t) }
	} catch (err) {
	    console.debug(err)
	    await page.evaluate((t) => alert('Note: ' + t + ' has detected a change, please review.'), t)
	}
    })
}, TIMEOUT)
*/

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
