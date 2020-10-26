module.exports = {
    launch: {
        headless: false,
        devtools: true,
	defaultViewport: process.env.VIEWPORT ? process.env.VIEWPORT : {width:1440, height:2400}
    }
    
}
