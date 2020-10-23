const TIMEOUT = process.env.TIMEOUT ? process.env.TIMEOUT : 30000
const URL = process.env.URL ? process.env.URL : 'https://dev-nrrd.app.cloud.gov'
const STEP = process.env.STEP ? process.env.STEP : 0

const FAILURE_THRESHOLD = process.env.FAILURE_THRESHOLD ? process.env.FAILURE_THRESHOLD : 2
const FAILURE_THRESHOLD_TYPE = process.env.FAILURE_THRESHOLD_TYPE ? process.env.FAILURE_THRESHOLD_TYPE : 'percent'
const matchOptions={comparisonMethod: 'ssim',allowSizeMismatch: true, failureThreshold: FAILURE_THRESHOLD, failureThresholdType: FAILURE_THRESHOLD_TYPE} //customDiffConfig: {threshold: 0.1}}

const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot })

const  tests  = require('./homepage.production.json')

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
	    
	    const element = await page.waitForSelector(target)
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

    tests.map( (test) => ScreenshotTest(test.title, test.commands, test.target));

}, TIMEOUT)

