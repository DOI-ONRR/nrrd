const TIMEOUT = process.env.TIMEOUT ? process.env.TIMEOUT : 30000
const URL = process.env.URL ? process.env.URL : 'https://dev-nrrd.app.cloud.gov'
const STEP = process.env.STEP ? process.env.STEP : 0
const { toMatchImageSnapshot } = require('jest-image-snapshot')

const matchOptions={failureThreshold: 1, failureThresholdType: 'percent'} //customDiffConfig: {threshold: 0.1}}

expect.extend({ toMatchImageSnapshot })

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

