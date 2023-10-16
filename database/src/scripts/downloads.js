const { Pool } = require('pg')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))

const db = new Pool({
  user: argv.username,
  host: argv.host,
  database: argv.database,
  password: argv.password,
  port: argv.port

})
const metaJson = {}

const metaData = (dataSet, extension, period) => {
  metaJson[dataSet + '.' + extension] = {}
  const r = db.query('select min("Date") as min_period, max("Date") as max_period from download_' + dataSet).then(
    res => {
	    const minPeriod = new Date(res.rows[0].min_period)
	    const maxPeriod = new Date(res.rows[0].max_period)
	    const minMonth = minPeriod.getMonth() + 1
	    const minYear = minPeriod.getFullYear()
	    const maxMonth = maxPeriod.getMonth() + 1
	    const maxYear = maxPeriod.getFullYear()
	    let minDate = ''
	    let maxDate = ''
	    if (period === 'monthly') {
        minDate = minMonth + '/' + minYear
        maxDate = maxMonth + '/' + maxYear
	    }
      else {
        minDate = minYear
        maxDate = maxYear
	    }
	    metaJson[dataSet + '.' + extension].minDate = minDate
	    metaJson[dataSet + '.' + extension].maxDate = maxDate

	    const csvStats = fs.statSync('/tmp/downloads/' + dataSet + '.' + extension)

	    metaJson[dataSet + '.' + extension].size = csvStats.size
    }
  ).catch(err => {
    console.debug(err); process.exit()
  })
  return r
}
const processFiles = async () => {
  console.log('start')
  const datasets = fs.readdirSync('/tmp/downloads/')
  console.log('datasets', datasets)
  for (let ii = 0; ii < datasets.length; ii++) {
    const [dataset, extension] = datasets[ii].split('.')
    console.debug('dataset', dataset)

    if (dataset.match(/monthly/)) {
      console.log('monthly')
      await metaData(dataset, extension, 'monthly')
    }
    else if (dataset.match(/year/)) {
      console.log('yearly')
      await metaData(dataset, extension, 'year')
    }
    else if (dataset.match(/federal/)) {
      console.log('yearly')
      await metaData(dataset, extension, 'year')
    }
    else if (dataset.match(/all/)) {
      console.log('all')
    }
  }
  console.log('fin')
}

const main = async () => {
  await processFiles()
  console.log('processed files')
  metaJson['all_revenue.xlsx'] = {}
  metaJson['all_revenue.xlsx'].minDate = metaJson['monthly_revenue.csv'].minDate
  metaJson['all_revenue.xlsx'].maxDate = metaJson['monthly_revenue.csv'].maxDate
  let xlsxStats = fs.statSync('/tmp/downloads/all_revenue.xlsx')
  metaJson['all_revenue.xlsx'].size = xlsxStats.size

  metaJson['all_production.xlsx'] = {}
  metaJson['all_production.xlsx'].minDate = metaJson['fiscal_year_production.csv'].minDate
  metaJson['all_production.xlsx'].maxDate = metaJson['fiscal_year_production.csv'].maxDate
  xlsxStats = fs.statSync('/tmp/downloads/all_production.xlsx')
  metaJson['all_production.xlsx'].size = xlsxStats.size

  console.debug('MJ   ', metaJson)
  const data = JSON.stringify(metaJson)
  fs.writeFileSync('/tmp/downloads/downloads.json', data)
}

main()
