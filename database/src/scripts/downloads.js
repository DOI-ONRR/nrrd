const path = require('path')
const { Pool, Client } = require('pg')
const fs = require('fs') // Load the filesystem module

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgrespassword',
  port: 5432

})
const metaJson = {}

const metaData = (data_set, extension, period) => {
  metaJson[data_set + '.' + extension] = {}
  const r = db.query('select min("Date") as min_period, max("Date") as max_period from download_' + data_set).then(
    res => {
	    const min_period = new Date(res.rows[0].min_period)
	    const max_period = new Date(res.rows[0].max_period)
	    const minMonth = min_period.getMonth() + 1
	    const minYear = min_period.getFullYear()
	    const maxMonth = max_period.getMonth() + 1
	    const maxYear = max_period.getFullYear()
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
	    metaJson[data_set + '.' + extension].minDate = minDate
	    metaJson[data_set + '.' + extension].maxDate = maxDate
	    //	    console.debug(res)

	    const csv_stats = fs.statSync('/tmp/downloads/' + data_set + '.' + extension)

	    metaJson[data_set + '.' + extension].size = csv_stats.size
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
  var xlsx_stats = fs.statSync('/tmp/downloads/all_revenue.xlsx')
  metaJson['all_revenue.xlsx'].size = xlsx_stats.size

  metaJson['all_production.xlsx'] = {}
  metaJson['all_production.xlsx'].minDate = metaJson['fiscal_year_production.csv'].minDate
  metaJson['all_production.xlsx'].maxDate = metaJson['fiscal_year_production.csv'].maxDate
  var xlsx_stats = fs.statSync('/tmp/downloads/all_production.xlsx')
  metaJson['all_production.xlsx'].size = xlsx_stats.size

  console.debug('MJ   ', metaJson)
  const data = JSON.stringify(metaJson)
  fs.writeFileSync('/tmp/downloads/downloads.json', data)

}

main()
