const args = require('commander')

args
  .option('--duplicates', 'Enable/disable duplicates', true)
  .option('--no-duplicates', 'Enable/disable duplicates')
  .option('-f, --file <file>', 'CSV file to load')
  .option('--password <password>', 'DB PASSWORD')
  .option('--port <port>', 'DB PORT')
  .option('--user <port>', 'DB USER')
  .option('--skip <ROWNUMB>', 'SKIP_TO')
  .option('--duplicates', 'Enable/disable duplicates', true)
  .option('--no-duplicates', 'Enable/disable duplicates')
  .option('--progress', 'Enable/disable progress', true)
  .option('--no-progress', 'Enable/disable progress')
  .option('-f, --file <file>', 'CSV file to load')
  .parse(process.argv)

let DB_PASSWORD = ''
if (args.password) {
  DB_PASSWORD = args.password
}
else if (process.env.DB_PASSWORD) {
  DB_PASSWORD = process.env.DB_PASSWORD
}
else {
  console.warn('No database password use command line option or set DB_PASSWORD variable')
  process.exit()
}

let DB_PORT = 7222
if (args.port) {
  DB_PORT = args.port
}
else if (process.env.DB_PORT) {
  DB_PORT = process.env.DB_PORT
}

let SKIP_TO = 0
if (args.skip) {
  SKIP_TO = args.skip
}

let DB_USER = 'postgres'
if (args.database) {
  DB_USER = args.user
}
else if (process.env.DB_USER) {
  DB_USER = process.env.DB_USER
}

let DB_DATABASE = 'postgres'
if (args.database) {
  DB_DATABASE = args.database
}
else if (process.env.DB_DATABASE) {
  DB_DATABASE = process.env.DB_DATABASE
}

let DB_HOST = 'localhost'
if (args.host) {
  DB_HOST = args.host
}
else if (process.env.DB_HOST) {
  DB_HOST = process.env.DB_HOST
}

const { Pool, Client } = require('pg')
const db = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
})

const CONSTANTS = require('../../src/js/constants')

const etl = require('etl')
const BATCH = 1
let DEDUPLICATE = true
let DUPLICATES = 0
let CSV = ''
if (args.duplicates) {

}
else {
  DEDUPLICATE = false
}

if (args.file) {
  CSV = args.file
}
else {
  process.exit()
}

let PROGRESS=true
if (args.progress) {

}
else {
  PROGRESS = false
}

console.debug('DEDUP ', DEDUPLICATE, 'FILE ', CSV)
const duplicate_lookup = {}



let ROW_COUNT = 0
const main = async () => {
  const period_lookup = await initPeriod({})
  //    console.debug("PL", period_lookup);
  const commodity_lookup = await initCommodity({})
  const location_lookup = await initLocation({})
  const fund_lookup = await initFund({})

  etl.file(CSV)
    .pipe(etl.csv()).pipe(etl.collect(BATCH)).promise().then(async data => {
      for (let dd = 0; dd < data.length; dd++) {
        rows =  data[dd]
	for (let rr = 0; rr < rows.length; rr++) {
          if (ROW_COUNT < SKIP_TO) {
            ROW_COUNT++
            continue
          }
          ROW_COUNT++

          if(ROW_COUNT % 100 == 0 ) {
            let dt=new Date()
            console.debug(ROW_COUNT+' rows processed @ '+dt)
          }

	  const raw_row = rows[rr]
	  let string = JSON.stringify(raw_row)
	  string = string.replace(/[^\x00-\x7F]/g, '') // remove wingdings as microsoft is source
	  let data = JSON.parse(string)
          let row = await trimData(data)
          let [unit, unit_abbr]= await getUnit(row)

          row = await NativeAmerican(row)
          console.debug("Row: ", row)
  	  const location = await addLocation(row, location_lookup)
          console.debug("location: ", location)
	  const location_id = location[0]
	  const commodity = await addCommodity(row, commodity_lookup)
          console.debug("commodity: ", commodity)
	  const commodity_id = commodity[0]
	  const period = await addPeriod(row, period_lookup)
	  const period_id = period[0]
	  const raw_revenue = getRevenue(row)
	  const raw_disbursement = getDisbursement(row)
	  const raw_volume = getVolume(row)
	  let duplicate_no = 0
	  if (DEDUPLICATE) {
            duplicate_no = deduplicate(commodity_id, location_id, period_id, row)
	  }

	  if (raw_revenue) {
            await insertRevenue(commodity_id, location_id, period_id, duplicate_no, raw_revenue, row)
	  }
	  if (raw_disbursement) {
            const fund = await addFund(row, fund_lookup)
            const fund_id = fund[0]
            await insertDisbursement(commodity_id, location_id, period_id, fund_id, duplicate_no, raw_disbursement, row)
	  }
	  if (raw_volume) {
            await insertProduction(commodity_id, location_id, period_id, duplicate_no, raw_volume, unit, unit_abbr, row)
          }
          
          
        }
      }
    })
}

const trimData = async (data) => {
  let row={}

  for( let key in data) {

    row[key.trim()]=data[key]

    
  }
  return row
}


const getLocationName = (row) => {
  let location_name=''

  if(  row['State'] &&  row['County'] && row['State'].length > 0 && row['County'].length > 0 ) {

    let county = row['County']
    county = county.replace(' Borough','')
    county = county.replace(' County','')
    county = county.replace(' Parish','')
    location_name=STATE_NAME_MAP[row['State']]+', '+county

  } else if (  row['State'] &&  row['State'].length > 0 ) {
    location_name=STATE_NAME_MAP[row['State']]
  } else if (row['Offshore Region'] && row['Offshore Region'].length > 0) {
    location_name=row['Offshore Region']+', '+row['Offshore Planning Area']
  } else {

    location_name='Not tied to a location'
  }
  return location_name
}

const getDistrictType = (row) => {
  let r=''
  if(  row['State'] &&  row['County'] && row['State'].length > 0 && row['County'].length > 0 ) {
    if(row['State'] === 'LA') {
      r = 'Parish'
    } else if (row['State'] === 'AK') {
      r = 'Borough'
    } else {
      r = 'County'
    }

  } else if (  row['State'] && row['State'].length > 0 ) {
    r='State'
    
  } else if (row['Offshore Region'] && row['Offshore Region'].length > 0) {
    r = 'Area'
  } 
  
  return r
}
const getRegionType = (row) => {
  let r=''
  if(  row['State'] &&  row['County'] && row['State'].length > 0 && row['County'].length > 0 ) {
    r = 'County'
    
  } else if (  row['State'] && row['State'].length > 0  ) {
    r='State'
    
  } else if (row['Offshore Region'] && row['Offshore Region'].length > 0) {
    r = 'Offshore'
  } 
  
  return r
}

const getLandType = (row) => {
  let r=''
  if( row['Land Class'] === 'Native American') {
    r='Native American';
  }
  else if( row['Land Class'] === 'Mixed Exploratory') {
    r='Mixed Exploratory';
  }
  else if(  row['Land Class'] &&  row['Land Category'] && row['Land Class'].length > 0 && row['Land Category'].length > 0 ) {
    if( row['Land Category'] === 'Not Tied to a Lease' ) {
      r='Federal - not tied to a lease'
    } else {
      r=row['Land Class']+' '+row['Land Category']
    }
  } else if ( row['Land Class'] &&  row['Land Category'] && row['Land Class'].length > 0 && row['Land Category'].length === 0 ) {  
    r='Federal - not tied to a location'
  } else {
    r='Federal - not tied to a location'
  }
  return r
}

const getFipsCode = (row) => {
  let fips_code=''
  if( fips_code.length === 0 && row['State'] && row['State'].length > 0) {
    fips_code=STATE_FIPS_MAP[row['State']]
  }
  else if( fips_code.length === 0 && row['Offshore Planning Area'] && row['Offshore Planning Area'].length > 0) {
    fips_code=OFFSHORE_FIPS_MAP[row['Offshore Planning Area']]
    offshore_planning_area_code=fips_code
  }
  if (fips_code == 'Withheld') {
    fips_code = ''
  }
  return fips_code
}



const getUnit = async (row) => {
  let unit='';
  let unit_abbr='';
  let commodity=''
  let product='';
  let tmp=''
  for (let field in row) {
    switch (field.trim()) {
    case 'Commodity':
      tmp = row['Commodity']||''
      if(tmp.match(/Prod Vol/) ) {
        let tmp1=tmp.replace(' Prod Vol ','|')
        let a=tmp1.split('|')
        a[1] = a[1].replace('(ton)', '(tons)')
        unit_abbr = a[1].replace(/[\(/)]/g,'')
        
        commodity = a[0]
        unit = unit_abbr
        product = a[0]+' ('+unit_abbr+')'
      }
      break
    case 'Product':
      tmp = row['Product'] || ''
      if(tmp.match(/\(/)) {
        let a=tmp.split('(')
        a[1] = a[1].replace('(ton)', '(tons)')
        unit_abbr = a[1].replace(/[\(/)]/g,'')      
        commodity = a[0]
        unit = unit_abbr
        product = a[0]+' ('+unit_abbr+')'
      }
      break
    default:
      if(row['Commodity']) {
        /*
          commodity=row['Commodity']
          unit='dollars'
          unit_abbr='$'
          product=commodity +' ('+unit+')'
        */
      }
      break

    }
    
  } 

  
  row['Commodity'] = commodity
  row['Unit_Abbr'] = unit_abbr
  row['Unit'] = unit
  row['Product'] =product
  return [unit, unit_abbr]


}


const NativeAmerican = async (row) => {

  //console.debug('NATIVE AMERICAN', row)
  if(row['Fund Type']) {
    switch (row['Fund Type']) {
    case 'U.S. TreasuryAI':
      row['Land Class']='Native American'
      break;
    case 'Native American Tribes & Allottees':
      row['Land Class']='Native American'
      break;
    case 'American Indian Tribes':
      row['Land Class']='Native American'
      break;
    default:
      row['Land Class']='Federal'
      break;
      
    }
  }
  //    console.debug('NATIVE AMERICAN AFTER', row)
  return row
  
}

const deduplicate = (commodity_id, location_id, period_id, row) => {
  const dup_key = commodity_id + '-' + location_id + '-' + period_id
  if (duplicate_lookup[dup_key] > 0) {
    duplicate_no = duplicate_lookup[dup_key]
    DUPLICATES++
    console.debug('Total duplicates: ' + DUPLICATES + ' duplicate on line: ' + row.__line + ' of file ' + CSV)
    console.table(row)
    duplicate_lookup[dup_key]++
  }
  else {
    duplicate_lookup[dup_key] = 1
    duplicate_no = 0
  }
  return duplicate_no
}

const initLocation = lookup => {
  const r = db.query('select * from location').then(
    res => {
      res.rows.map((row, i) => {
        const key = row.fips_code + '-' + row.state + '-' + row.county + '-' + row.land_class + '-' + row.land_category + '-' + row.offshore_region + '-' + row.offshore_planning_area + '-' + row.offshore_planning_area_code + '-' + row.offshore_block + '-' + row.offshore_protraction
        lookup[key] = [row.location_id, row.fips_code, row.state, row.county, row.land_class, row.land_category, row.offshore_region, row.offshore_planning_area, row.offshore_planning_area_code, row.offshore_block, row.offshore_protraction]
      })
      return lookup
    }).catch(err => {
      console.debug(err); process.exit()
    })
  return r
}

const insertRevenue = async (commodity_id, location_id, period_id, duplicate_no, raw_revenue, row) => {
  const revenue = cleanValue(raw_revenue)
  try {
    const insert = await db.query('insert into revenue( location_id, period_id, commodity_id, duplicate_no, revenue , raw_revenue) values ($1 , $2 , $3 , $4 , $5, $6 )', [location_id, period_id, commodity_id, duplicate_no, revenue, raw_revenue])
  }
  catch (err) {
    if (err.stack.match('duplicate')) {
      DUPLICATES++
      console.warn(DUPLICATES + ' total duplicates. duplicate key error on line: ' + row.__line)
    }
    else {
      console.debug('revenue:', err)
      process.exit()
    }
  }
}

const insertDisbursement = async (commodity_id, location_id, period_id, fund_id, duplicate_no, raw_disbursement, row) => {
  const disbursement = cleanValue(raw_disbursement)
  try {
    const insert = await db.query('insert into disbursement( location_id, period_id, commodity_id, fund_id, duplicate_no, disbursement , raw_disbursement) values ($1 , $2 , $3 , $4 , $5, $6, $7 )', [location_id, period_id, commodity_id,fund_id, duplicate_no, disbursement, raw_disbursement])
  }
  catch (err) {
    if (err.stack.match('duplicate')) {
      DUPLICATES++
      console.warn(DUPLICATES + ' total duplicates. duplicate key error on line: ' + row.__line)
      //	    console.table([location_id, period_id, commodity_id, disbursement , raw_disbursement])

      //	    console.table(row);
      //	    process.exit();
    }
    else {
      console.debug('revenue:', err)
      process.exit()
    }
  }
}

const insertProduction = async (commodity_id, location_id, period_id, duplicate_no, raw_volume,unit, unit_abbr, row) => {
  const volume = cleanValue(raw_volume)
  try {
    const insert = await db.query('insert into production( location_id, period_id, commodity_id, duplicate_no, volume ,unit, unit_abbr, raw_volume) values ($1 , $2 , $3 , $4 , $5, $6, $7, $8 )', [location_id, period_id, commodity_id, duplicate_no, volume,unit, unit_abbr, raw_volume])
  }
  catch (err) {
    if (err.stack.match('duplicate')) {
      DUPLICATES++
      console.warn(DUPLICATES + ' total duplicates. duplicate key error on line: ' + row.__line)
      // console.table([location_id, period_id, commodity_id, disbursement , raw_disbursement])
      // process.exit();
    }
    else {
      console.debug('revenue:', err)
      process.exit()
    }
  }
}




const addLocation = async (row, lookup) => {
  let fips_code = ''; let state = ''; let county = ''; let land_class = ''; let land_category = ''; let offshore_region = ''; let offshore_planning_area = ''; let offshore_planning_area_code = ''; let offshore_block = ''; let offshore_protraction = ''
  let location_name=''
  let land_type=''
  let region_type=''
  let district_type=''
  
  for (const field in row) {
    switch (field.trim()) {
    case 'FIPS Code':

      fips_code = row[field]

      if (fips_code == 'Withheld') {
        fips_code = ''
      }
      break
    case 'State':
      state = row[field]
      break
    case 'County':

      county = row[field]
      county = county.replace(' Borough','')
      county = county.replace(' County','')
      county = county.replace(' Parish','')
      break
    case 'Land Class':
      land_class = row[field]
      break
    case 'Onshore/Offshore':
    case 'Land Category':
      land_category = row[field]
      if (land_category.toLowerCase === 'not tied to a lease' ||
	  row['Revenue Type'] === 'Civil Penalities' ||
	  row['Revenue Type'] === 'Other Revenues') {
        if (row['Land Class'] !== CONSTANTS.NATIVE_AMERICAN &&
	    !row['Offshore Region']) {
	  state = row.State || 'Not tied to a location'
        }
      }

      break
    case 'Offshore Region':
      offshore_region = row[field]
      break
    case 'Offshore Planning Area':
      offshore_planning_area = row[field]
       offshore_planning_area_code=OFFSHORE_FIPS_MAP[row[field]]
      break
    case 'Offshore Block':
      offshore_block = row[field]
      break
    case 'Offshore Protraction':
      offshore_protraction = row[field]
      break
    }
  }
  location_name=getLocationName(row);
  land_type=getLandType(row);
  region_type=getRegionType(row);
  district_type=getDistrictType(row);
  if(fips_code.length===0) {
    fips_code=getFipsCode(row)
  }
  let state_name=STATE_NAME_MAP[state] || ''
  const key = fips_code + '-' + state + '-' + county + '-' + land_class + '-' + land_category + '-' + offshore_region + '-' + offshore_planning_area + '-' + offshore_planning_area_code + '-' + offshore_block + '-' + offshore_protraction
  if (lookup[key]) {
    return lookup[key]
  }
  else {
    try {
      const insert = await db.query('insert into location(fips_code, state,state_name,county,land_class,land_category,land_type, region_type, district_type, offshore_region, offshore_planning_area, offshore_planning_area_code, offshore_block,offshore_protraction, location_name) values ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT DO NOTHING  returning location_id', [fips_code, state,state_name, county, land_class, land_category, land_type, region_type, district_type, offshore_region, offshore_planning_area, offshore_planning_area_code, offshore_block, offshore_protraction, location_name])

      if (insert.rows.length > 0) {
        lookup[key] = [insert.rows[0].location_id, fips_code, state, county, land_class, land_category, offshore_region, offshore_planning_area, offshore_planning_area_code, offshore_block, offshore_protraction]
      }
      else {

      }
    }
    catch (err) {
      console.log('location ERROR: ', err.stack)
      console.log('ROW: ', row)
      process.exit()
    }
    //	console.debug("addLocation", lookup[key])
    return lookup[key]
  }
}

const initCommodity = lookup => {
  const r = db.query('select * from commodity').then(
    res => {
      res.rows.map((row, i) => {
        const key = row.product + '-' + row.commodity + '-' + row.revenue_type + '-' + row.revenue_category + '-' + row.mineral_lease_type + '-' + row.disbursement_type + '-' + row.fund_type + '-' + row.disbursement_category
        lookup[key] = [row.commodity_id, row.product, row.commodity, row.revenue_type, row.revenue_category, row.mineral_lease_type, row.disbursement_type, row.fund_type, row.disbursement_category]
      })
      return lookup
    }).catch(err => {
      console.debug(err); process.exit()
    })
  return r
}

const addCommodity = async (row, lookup) => {
  let product = ''
  let commodity = 'Not tied to a commodity'
  let revenue_type = ''
  let revenue_category = ''
  let mineral_lease_type = ''
  let fund_type = ''
  let disbursement_type = ''
  let disbursement_category = ''
  let commodity_order = ''

  for (const field in row) {
    switch (field) {
    case 'Product':
      product = row[field]
      break
    case 'Commodity':
      commodity = row[field]
      break
    case 'Revenue Type':
      revenue_type = row[field]
      break
    case 'Mineral Lease Type':
      mineral_lease_type = row[field]
      break
    case 'Fund Type':
      fund_type = row[field]
      break
    case 'Disbursement Type':
      disbursement_type = row[field]
      break
    case 'Category':
      disbursement_category = row[field]
      break
    }
  }
  // add a revenue category based on land class and category otherwise  default
  revenue_category = LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[row['Land Class']] &&
    LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[row['Land Class']][row['Land Category']]

  if (revenue_category === undefined && disbursement_category == '') {
    if (row['Land Class'] === CONSTANTS.NATIVE_AMERICAN) {
      revenue_category = CONSTANTS.NATIVE_AMERICAN
    }
    else {
      revenue_category = 'Not tied to a lease'
    }
  }
  else {
    revenue_category = ''
  }
  
  const key = product + '-' + commodity + '-' + revenue_type + '-' + revenue_category + '-' + mineral_lease_type + '-' + disbursement_type + '-' + fund_type + '-' + disbursement_category
  if (lookup[key]) {
    return lookup[key]
  }
  else {
    try {
      if (commodity === 'Oil') {
        commodity_order='1'
      }
      else if (commodity === 'Gas') {
        commodity_order='2'
      }
      else if (commodity=== 'Coal') {
        commodity_order='3'
      }
      else {
        commodity_order=commodity.substring(0,5)
      }
      
      const insert = await db.query('insert into commodity(  product,commodity, revenue_type, revenue_category,  mineral_lease_type,disbursement_type, fund_type, disbursement_category, commodity_order) values ($1 , $2 , $3 , $4 , $5, $6, $7, $8, $9  ) ON CONFLICT DO NOTHING returning commodity_id', [product, commodity, revenue_type, revenue_category, mineral_lease_type, disbursement_type, fund_type, disbursement_category, commodity_order])
      if (insert.rows.length > 0) {
        lookup[key] = [insert.rows[0].commodity_id, product, commodity, revenue_type, revenue_category, mineral_lease_type, disbursement_type, fund_type, disbursement_category]
      }
      else {
        // console.debug("IGNORE ----------------------")
      }
    }
    catch (err) {
      console.log('commodity ERROR: ', err.stack)
      process.exit()
    }
  }
  //    console.debug("addCommodity", lookup[key]);

  return lookup[key]
}

const initFund = lookup => {
  const r = db.query('select * from fund').then(
    res => {
      res.rows.map((row, i) => {
        const key = row.recipient + '-' + row.fund_class + '-' + row.fund_type + '-' + row.revenue_type + '-' + row.source
        lookup[key] = [row.fund_id, row.recipient, row.fund_class, row.fund_type, row.revenue_type, row.source]
      })
      return lookup
    }).catch(err => {
      console.debug(err); process.exit()
    })
  return r
}

const addFund = async (row, lookup) => {
  let recipient=''
  let fund_class = ''
  let fund_type = ''
  let revenue_type = ''
  let source = ''
  for (const field in row) {
    switch (field) {
    case 'Category':
      revenue_type = row[field]
      break
    case 'Mineral Lease Type':
      mineral_lease_type = row[field]
      break
    case 'Disbursement Type':
//      console.debug('row', row[field])
      if(row[field].match(/GOMESA/i)) {
        source='GOMESA offshore'
      }
      else if (row[field].match(/8\(g\)/g)) {
        source='8(g) offshore'
      }
      else {
        source=(row['Land Category']) ? row['Land Category'] : row['Onshore/Offshore']
      }
      
      break
    case 'Fund Type':
      if(row[field].match(/GOMESA/i)) {
        source='GOMESA offshore'
      }
      else if (row[field].match(/8\(g\)/)) {
        source='State 8(g)'
      } else {
        source=(row['Land Category']) ? row['Land Category'] : row['Onshore/Offshore']

      }
      
      if(row['State'] && row['State'].length > 0 && row['State'] && row['State'].length > 0) {
        recipient = 'County'
        fund_class = 'County'
      }
      else if(row['State'] && row['State'].length > 0 && row['State'] && row['State'].length === 0) {
        recipient = 'State'
        fund_class = 'State'
      }
      else if(row[field].match(/Tribe/i) || row[field].match(/TreasuryAI/i) ){
        recipient = 'Native American tribes and individuals'
        fund_class = 'Native American tribes and individuals'
      }
      else if(row[field]==='Land & Water Conservation Fund') {
        recipient = 'Land and Water Conservation Fund'
        fund_class = 'Specific Fund'
      }
      else {
        recipient = row[field]
        fund_class = 'Specific Fund'
      }
      
      fund_type = row[field]
      break
    }
  }
 // console.debug('source: ',source)

  const key = recipient + '-' + fund_class + '-' + fund_type + '-' +  revenue_type + '-' + source 
  if (lookup[key]) {
    return lookup[key]
  }
  else {
    try {

      
      const insert = await db.query('insert into fund( recipient, fund_class, fund_type, revenue_type, source  ) values ($1 , $2 , $3 , $4, $5 ) ON CONFLICT DO NOTHING returning fund_id', [recipient, fund_class, fund_type, revenue_type, source ])
      
      
      if (insert.rows.length > 0) {
        
        lookup[key] = [insert.rows[0].fund_id, recipient, fund_class, fund_type, revenue_type, source ]
      }
      else {
        console.debug("inserted: ", [recipient, fund_class, fund_type, revenue_type, source ]);
        // console.debug("IGNORE ----------------------")
      }
    }
    catch (err) {
      console.log('fund ERROR: ', err.stack)
      process.exit()
    }
  }
  //    console.debug("addCommodity", lookup[key]);
  
  return lookup[key]
}

const initPeriod = lookup => {
  const r = db.query('select * from period').then(
    res => {
      res.rows.map((row, i) => {
        let date = row.period_date.toISOString().replace('T', ' ')
        date = date.replace('Z', '')

        const key = row.period + '-' + row.calendar_year + '-' + row.fiscal_year + '-' + row.month + '-' + row.month_long + '-' + row.fiscal_month
        lookup[key] = [row.period_id, row.calendar_year, row.fiscal_year, row.month, row.month_long, row.fiscal_month, date]
      })

      return lookup
    }).catch(err => {
      console.debug(err); process.exit()
    })
  return r
}

const addPeriod = async (row, lookup) => {
  let period = ''
  let calendar_year = ''
  let fiscal_year = ''
  let month = ''
  let month_long = ''
  let fiscal_month = ''
  let period_date = ''

  for (const field in row) {
    switch (field) {
    case 'Fiscal Year':
      period = 'Fiscal Year'
      fiscal_year = row[field]
      month = 0
      fiscal_month = 0
      calendar_year = 0
      period_date = fiscal_year + '-01-01 00:00:00'

      break

    case 'Month':
      period = 'Monthly'
      month_long = row[field]
      month = monthToNumber(row[field])
      fiscal_month = monthToFiscalMonth(row[field])
      break

    case 'Calendar Year':
      calendar_year = row[field]
      if (!row.Month) {
        period = 'Calendar Year'
        if (calendar_year == '') {
	  calendar_year = 1970
        }

        month = 0
        fiscal_month = 0
        fiscal_year = 0
        period_date = calendar_year + '-01-01 00:00:00'
      }
      break
    }
  }
  if (month && calendar_year) {
    period_date = calendar_year + '-' + month + '-01 00:00:00'

    fiscal_year = getFiscalYear(period_date)
  }

  const key = period + '-' + calendar_year + '-' + fiscal_year + '-' + month + '-' + month_long + '-' + fiscal_month
  if (lookup[key]) {
    return lookup[key]
  }
  else {
    try {
      const insert = await db.query('insert into period( period, calendar_year,fiscal_year, month, month_long,fiscal_month, period_date) values ($1 , $2 , $3 , $4 , $5 , $6 , $7 ) ON CONFLICT DO NOTHING returning period_id', [period, calendar_year, fiscal_year, month, month_long, fiscal_month, period_date])
      if (insert.rows.length > 0) {
        lookup[key] = [insert.rows[0].period_id, period, calendar_year, fiscal_year, month, month_long, fiscal_month, period_date]
      }
      else {

        //	process.exit();
      }
    }
    catch (err) {
      console.log('peroid ERROR: ', err.stack)
      console.log('ROW: ', row)
      console.log('ROW: ', key)
      process.exit()
    }
    //	rowid=insert.run([null, period, calendar_year,fiscal_year, month, month_long, fiscal_month, period_date]);
    // lookup[key]=[rowid.lastInsertRowid, period, calendar_year, fiscal_year, month, month_long, fiscal_month,  period_date];
    //	console.debug("AddPeriod: ", lookup[key]);
    return lookup[key]
  }
  //    console.debug("lookup -=-------", lookup);
}

const getRevenue = row => {
  let revenue = null
  for (const field in row) {
    switch (field.trim()) {
    case 'Revenue':
      revenue = row[field]
      break
    }
  }
  return revenue
}

const getDisbursement = row => {
  let total = null
  for (const field in row) {
    switch (field.trim()) {
    case 'Total':
      total = row[field]
      break
    case 'Disbursement':
      total = row[field]
      break
    }
  }
  return total
}

const getVolume = row => {
  let volume = null
  for (const field in row) {
    switch (field.trim()) {
    case 'Volume':
      volume = row[field]
      break
    }
  }
  return volume
}

const cleanValue = value => {
  const trim = /[\s,\$\)]/g
  const neg = /\(/g
  let return_value = null
  try {
    value = value.replace(trim, '')
    value = value.replace(neg, '-')
    return_value = Number(value)
  }
  catch (err) {
    console.warn('Value: ', value); process.exit()
  }
  if (isNaN(return_value)) {
    return null
  }
  else {
    return return_value
  }
}

const monthToNumber = month_long => {
  const m = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12

  }
  return m[month_long.toLowerCase()]
}
const monthToFiscalMonth = month_long => {
  const m = {
    january: 4,
    february: 5,
    march: 6,
    april: 7,
    may: 8,
    june: 9,
    july: 10,
    august: 11,
    september: 12,
    october: 1,
    november: 2,
    december: 3
  }
  return m[month_long.toLowerCase()]
}

const getFiscalYear = date => {
  let fiscalyear = ''
  const d = new Date(date)
  if ((d.getMonth() + 1) >= 10) {
    fiscalyear = (d.getFullYear() + 1)
  }
  else {
    fiscalyear = d.getFullYear()
  }
  return fiscalyear
}

const offshore_planning_area = {
  'Aleutian Arc': 'ALA',
  'Aleutian Basin': 'ALB',
  'Beaufort Sea': 'BFT',
  'Bowers Basin': 'BOW',
  'Chukchi Sea': 'CHU',
  'Cook Inlet': 'COK',
  'St. George Basin': 'GEO',
  'Gulf of Alaska': 'GOA',
  'Hope Basin': 'HOP',
  'Kodiak': 'KOD',
  'St. Matthew-Hall': 'MAT',
  'North Aleutian Basin': 'NAL',
  'Navarin Basin': 'NAV',
  'Norton Basin': 'NOR',
  'Shumagin': 'SHU',
  'Florida Straits': 'FLS',
  'Mid Atlantic': 'MDA',
  'North Atlantic': 'NOA',
  'South Atlantic': 'SOA',
  'Western Gulf of Mexico': 'WGM',
  'Central Gulf of Mexico': 'CGM',
  'Eastern Gulf of Mexico': 'EGM',
  'Central California': 'CEC',
  'Northern California': 'NOC',
  'Southern California': 'SOC',
  'Washington-Oregon': 'WAO'
}

const location_deduplicate = (data, lookup) => {
  data.map((d, index) => {
    d.map((row, i) => {
      lookup[key] = [row['FIPS Code'], row.State, row.County, row['Land Category'], row['Offshore Region'], row['Offshore Planning Area'], offshore_planning_area[row['Offshore Planning Area']], row['Offshore Block'], row['Offshore Protraction']]
    })
  })
}

const LAND_CATEGORY_TO_DISPLAY_NAME = {
  Offshore: CONSTANTS.OFFSHORE,
  Onshore: CONSTANTS.ONSHORE,
}

const LAND_CLASS_TO_DISPLAY_NAME = {
  Federal: CONSTANTS.FEDERAL,
  'Native American': CONSTANTS.NATIVE_AMERICAN,
}

const LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY = {
  [CONSTANTS.FEDERAL]: {
    [CONSTANTS.OFFSHORE]: CONSTANTS.FEDERAL_OFFSHORE,
    [CONSTANTS.ONSHORE]: CONSTANTS.FEDERAL_ONSHORE,
  },
  [CONSTANTS.NATIVE_AMERICAN]: {
    [CONSTANTS.OFFSHORE]: CONSTANTS.NATIVE_AMERICAN,
    [CONSTANTS.ONSHORE]: CONSTANTS.NATIVE_AMERICAN,
  },
}

const COMMODITY_MAP = {
  'Oil & Gas (Non Royalty)': 'Oil & Gas (Non-Royalty)',
  'Oil & Gas (Non-Royalty)': 'Oil & Gas (Non-Royalty)'
}

const STATE_NAME_MAP = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
}
const STATE_FIPS_MAP =
      {
        "AK": "02",
        "AL": "01",
        "AR": "05",
        "AS": "60",
        "AZ": "04",
        "CA": "06",
        "CO": "08",
        "CT": "09",
        "DC": "11",
        "DE": "10",
        "FL": "12",
        "GA": "13",
        "GU": "66",
        "HI": "15",
        "IA": "19",
        "ID": "16",
        "IL": "17",
        "IN": "18",
        "KS": "20",
        "KY": "21",
        "LA": "22",
        "MA": "25",
        "MD": "24",
        "ME": "23",
        "MI": "26",
        "MN": "27",
        "MO": "29",
        "MS": "28",
        "MT": "30",
        "NC": "37",
        "ND": "38",
        "NE": "31",
        "NH": "33",
        "NJ": "34",
        "NM": "35",
        "NV": "32",
        "NY": "36",
        "OH": "39",
        "OK": "40",
        "OR": "41",
        "PA": "42",
        "PR": "72",
        "RI": "44",
        "SC": "45",
        "SD": "46",
        "TN": "47",
        "TX": "48",
        "UT": "49",
        "VA": "51",
        "VI": "78",
        "VT": "50",
        "WA": "53",
        "WI": "55",
        "WV": "54",
        "WY": "56"
      }

const OFFSHORE_FIPS_MAP =
      {
        'Aleutian Arc': 'ALA',
        'Aleutian Basin': 'ALB',
        'Beaufort Sea': 'BFT',
        'Bowers Basin': 'BOW',
        'Chukchi Sea': 'CHU',
        'Cook Inlet': 'COK',
        'St. George Basin': 'GEO',
        'Gulf of Alaska': 'GOA',
        'Hope Basin': 'HOP',
        'Kodiak': 'KOD',
        'St. Matthew-Hall': 'MAT',
        'North Aleutian Basin': 'NAL',
        'Navarin Basin': 'NAV',
        'Norton Basin': 'NOR',
        'Shumagin': 'SHU',
        'Florida Straits': 'FLS',
        'Mid Atlantic': 'MDA',
        'North Atlantic': 'NOA',
        'South Atlantic': 'SOA',
        'Western Gulf of Mexico': 'WGM',
        'Central Gulf of Mexico': 'CGM',
        'Eastern Gulf of Mexico': 'EGM',
        'Central California': 'CEC',
        'Northern California': 'NOC',
        'Southern California': 'SOC',
        'Washington-Oregon': 'WAO'
      }

main()
