'use strict';

const config = {
    headless: 'false',
    step: 0,
    failure_threshold: 2,
    failure_threshold_type: 'percent',
    puppeteer: 'true'
};
const argv = process.argv.slice(0, 2);

// Naive argv parsing
process.argv
  .reduce((cmd, arg) => {
      if (cmd) {

	config[cmd] = arg;
      return;
    }

    if (arg.startsWith('--')) {
      const sub = arg.substring('--'.length);
      if (Object.keys(config).includes(sub)) {
          config[sub] = arg
	  console.debug
      } 
	
        return sub;
    }

    argv.push(arg)
  });

Object.keys(config).map( (option) => {
    // console.debug('SETUP ENV', option.toUpperCase())
    
    process.env[option.toUpperCase()]=config[option]
    // /console.debug("process ENV" + option.toUpperCase() + ' is: ' +  process.env[option.toUpperCase()])
    // console.debug(process.env[option.toUpperCase()])
})
// add additional args such as --runInBand since windows runs tests in parallel

//argv.push('--runInBand')

// Store configuration on env
process.env.__CONFIGURATION = JSON.stringify(config);

// Setting real ARGV
process.argv = argv;
//console.debug("ARG", process.argv)

// Calling jest runner
require('jest-cli/bin/jest');
