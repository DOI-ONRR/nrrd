const timeout = process.env.SLOWMO ?   process.env.SLOWMO: 10000;
const URL = process.env.URL ? process.env.URL : 'https://dev-nrrd.app.cloud.gov'
const ScreenshotTester = require('puppeteer-screenshot-tester')

beforeAll(async () => {
    jest.setTimeout(timeout + 5000 )
    await page.goto(URL,{waitUntil: 'networkidle0'});// {waitUntil: 'domcontentloaded'});
});

console.debug("URL: ",URL)
console.debug("timeout: ",timeout)
describe('Test of the homepage page', () => {
    test('Title of the page', async () => {
        const title = await page.title();
        expect(title).toBe('Home | Natural Resources Revenue Data');
        
    }, timeout);
/*    test('Fiscal Revenue', async () => {
	const result = await page.screenshot({
            path: '__tests__/screenshots/FY_Revenue.jpg',
            fullpage: true,
            type: 'jpeg'
        });
	expect(result)
}, timeout);
*/
    /*	const tester = await ScreenshotTester()
	const result1 = await tester(page, 'fiscal_revenue.png', {
	    fullPage: true,
	})
*/

});
