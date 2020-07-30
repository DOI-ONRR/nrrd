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
//          console.debug('RAW: ', raw_row)
	  let string = JSON.stringify(raw_row)
	  string = string.replace(/[^\x00-\x7F]/g, '') // remove wingdings as microsoft is source
	  let json_row = JSON.parse(string)
          let row = await trimData(json_row)
          const raw_revenue = getRevenue(row)
	  const raw_disbursement = getDisbursement(row)
	  const raw_volume = getVolume(row)
          let unit
          let unit_abbr
          if(raw_volume) {
            [unit, unit_abbr]= await getUnit(row)
            //console.debug("Row --->: ", row)
          }
          row = await NativeAmerican(row)

  	  const location = await addLocation(row, location_lookup)
          // console.debug("location: ", location)
	  const location_id = location[0]
	  const commodity = await addCommodity(row, commodity_lookup)
          // console.debug("commodity: ", commodity)
	  const commodity_id = commodity[0]
	  const period = await addPeriod(row, period_lookup)
	  const period_id = period[0]
	 // const raw_revenue = getRevenue(row)
	 // const raw_disbursement = getDisbursement(row)
	  // const raw_volume = getVolume(row)
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
/*		if(row.Product.match(/Geo/) ) {
		console.debug("ROW: ", row)
		    console.debug("Unit: ", unit)
		}
*/
				
  await insertProduction(commodity_id, location_id, period_id, duplicate_no, raw_volume, unit, unit_abbr, row)
          }
          
          
        }
      }
    })
}
  
const trimData = async (data) => {
  let row={}

  for( let key in data) {
    // console.debug('Key>'+key+'<Key')
    row[key.trim()]=data[key]
    // console.debug('Data:', data)
    // console.debug('row:', row)
    
  }
  return row
}


const getLocationName = (row) => {
  let location_name=''

  if(  row['State'] &&  row['County'] && row['State'].length > 0 && row['County'].length > 0 ) {

    let county = row['County']
    county = county.replace(' Borough','')
    county = county.replace(' County','')
    county = county.replace(' Caounty','')
    county = county.replace(' Parish','')
    county = county.replace('St ', 'St. ')
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
  } else if(  row['Onshore/Offshore'] &&  (row['State'].length > 0 || row['County'].length > 0 ) ) {
      r='Federal '+row['Onshore/Offshore']
  } else if(  row['Onshore/Offshore'] === 'Onshore & Offshore' ) {
    r='Federal Onshore and Offshore' 
  } else if ( row['Land Class'] &&  row['Land Category'] && row['Land Class'].length > 0 && row['Land Category'].length === 0 ) {  
    r='Federal - not tied to a location'
  } else {
    r='Federal - not tied to a location'
  }
  return r
}

const getFipsCode = (row) => {
  let fips_code=''
  // console.debug('getFipsCode:', row);
//  console.debug('WTF '+ fips_code.length +'=== 0 &&'+ row['State'] +' && '+row['State'].length +' > 0 &&'+ row['County']+' && '+row['County'].length+ ' === 0' )
  if( fips_code.length === 0 && row['State'] && row['State'].length > 0 && row['County'].length === 0 ) {

      //    fips_code=STATE_FIPS_MAP[row['State']]
      // use state abbrev for now
      fips_code=row['State']
      
  }
  else if( fips_code.length === 0 && row['Offshore Planning Area'] && row['Offshore Planning Area'].length > 0) {
    fips_code=OFFSHORE_FIPS_MAP[row['Offshore Planning Area']]
    offshore_planning_area_code=fips_code
  }
    else if( fips_code.length === 0 && row['Offshore Region'] && row['Offshore Region'].length > 0 && (!row['Offshore Planning Area']) ) {
	fips_code=OFFSHORE_FIPS_MAP[row['Offshore Region']]
	offshore_planning_area_code=fips_code

    }
  else if( fips_code.length === 0 && row['State'] && row['State'].length > 0 && row['County'] && row['County'].length > 0 ) {
    let county=row['County'].replace(/County|Borough|Parish|Caounty/, '')
    county=county.trim()
    fips_code=COUNTY_LOOKUP[row['State']+'-'+county]
    
  }
  if (fips_code === 'Withheld') {
    fips_code = ''
  }
  // console.debug('fips_code:', fips_code)
  return fips_code
}



const getUnit = async (row) => {
  let unit='';
  let unit_abbr='';
  let commodity=''
  let product='';
  let tmp=''
//  console.debug('======================= '+row.__line+'==============================')
//  console.debug('getUnit row:', row)
  for (let field in row) {
    switch (field.trim()) {
    case 'Commodity':
      // console.debug('DWGCOMMOD')
      tmp = row['Commodity']||''
      if(tmp.match(/Prod Vol/) ) {
        let tmp1=tmp.replace(' Prod Vol ','|')
        let a=tmp1.split('|')
        a[1] = a[1].replace('(ton)', '(tons)')
        unit_abbr = a[1].replace(/[\(/)]/g,'')
        
        commodity = a[0]
        unit = unit_abbr
        product = a[0]+' ('+unit_abbr+')'
      } else {
          commodity = tmp
	  unit_abbr = UNIT_MAP[commodity]
	  unit = UNIT_MAP[commodity]

        product = tmp
      }
      break
    case 'Product':
  //          console.debug('Product')
      tmp = row['Product'] || ''
      
      if(tmp.match(/\(/)) {
        let a=tmp.split('(')
        a[1] = a[1].replace('(ton)', '(tons)')
        a[0] = a[0].trim()
        unit_abbr = a[1].replace(/[\(/)]/g,'')      
        commodity = a[0]
        unit = unit_abbr
        product = a[0]+' ('+unit_abbr+')'
      }
      else {
          commodity = tmp
	  unit_abbr = UNIT_MAP[commodity]
	  unit = UNIT_MAP[commodity]
	  
        product = tmp
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
  // console.debug(row)
  return [unit, unit_abbr]


}


const NativeAmerican = async (row) => {

  //// console.debug('NATIVE AMERICAN', row)
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

const initCountyLookup = lookup => {
  const r = db.query('select * from county_lookup').then(
    res => {
      res.rows.map((row, i) => {
        const key = row.state + '-' + row.county
        lookup[key] = row.fips_code
      })
      return lookup
    }).catch(err => {
      console.debug(err); process.exit()
    })
  return r
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
    const insert = await db.query('insert into revenue( location_id, period_id, commodity_id, duplicate_no, revenue , raw_revenue, row_number) values ($1 , $2 , $3 , $4 , $5, $6, $7 )', [location_id, period_id, commodity_id, duplicate_no, revenue, raw_revenue, row.__line])
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
    const insert = await db.query('insert into disbursement( location_id, period_id, commodity_id, fund_id, duplicate_no, disbursement , raw_disbursement, row_number) values ($1 , $2 , $3 , $4 , $5, $6, $7, $8 )', [location_id, period_id, commodity_id,fund_id, duplicate_no, disbursement, raw_disbursement, row.__line])
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
    const insert = await db.query('insert into production( location_id, period_id, commodity_id, duplicate_no, volume ,unit, unit_abbr, raw_volume, row_number) values ($1 , $2 , $3 , $4 , $5, $6, $7, $8, $9 )', [location_id, period_id, commodity_id, duplicate_no, volume,unit, unit_abbr, raw_volume, row.__line])
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
      county = county.replace(' Caounty','')
      county = county.replace(' Parish','')
      county = county.replace('St ','St. ')
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
  if(!fips_code || fips_code.length===0) {
    fips_code=getFipsCode(row)
  }
  if(fips_code==='160081') {
    fips_code='16081'
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
  //   console.debug('Row: ', row);
  for (let field in row) {
    field=field.trim()
    //    console.debug('FIeld:',field,':')
    switch (field) {
    case 'Product':
      // console.debug('WTF>'+field+'<TWF>',row,'FTW')
      product = row[field]
      break
    case 'Commodity':
      // console.debug('WTF>'+field+'<TWF>',row,'FTW')
      commodity = row[field]
      break
    case 'Revenue Type':
      //// console.debug('revenue_field|', field,'|')
      
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

  if(commodity==='' && product==='') {
    commodity='Not tied to a commodity'
  }
  
  const key = product + '-' + commodity + '-' + revenue_type + '-' + revenue_category + '-' + mineral_lease_type + '-' + disbursement_type + '-' + fund_type + '-' + disbursement_category
//  console.debug('commodity', key)
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

const UNIT_MAP = {
    "Geothermal - Direct Utilization, Millions of BTUs": "MMBtu",
    "Geothermal - Electrical Generation, Kilowatt Hours": "kWh",
    "Geothermal - Electrical Generation, Other": "Other",
    "Geothermal - Electrical Generation, Thousands of Pounds": "lbs, thousand",
    "Geothermal - Direct Utilization, Hundreds of Gallons": "gal hundreds"

    
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
        'Aleutian Arc': 'AKR',
        'Aleutian Basin': 'AKR',
        'Beaufort Sea': 'AKR',
        'Bowers Basin': 'AKR',
        'Chukchi Sea': 'AKR',
        'Cook Inlet': 'AKR',
        'St. George Basin': 'AKR',
        'Gulf of Alaska': 'AKR',
        'Hope Basin': 'AKR',
        'Kodiak': 'AKR',
        'St. Matthew-Hall': 'AKR',
        'North Aleutian Basin': 'AKR',
        'Navarin Basin': 'AKR',
        'Norton Basin': 'AKR',
        'Shumagin': 'AKR',
        'Florida Straits': 'AOR',
        'Mid Atlantic': 'AOR',
        'North Atlantic': 'AOR',
        'South Atlantic': 'AOR',
        'Western Gulf of Mexico': 'GMR',
        'Central Gulf of Mexico': 'GMR',
        'Eastern Gulf of Mexico': 'GMR',
        'Central California': 'POR',
        'Northern California': 'POR',
        'Southern California': 'POR',
          'Washington-Oregon': 'POR',
	  "Offshore Alaska": 'AKR' , 
	  "Offshore Pacific":'POR' , 
	  "Offshore Gulf":  'GMR', 


      }

const COUNTY_LOOKUP = {
 'AK-Kenai Peninsula': '02122',
 'AK-Meade River': '02185',
 'AK-Lookout Rdg': '02185',
 'AK-Tyonek': '02122',
 'AK-Naknek': '02185',
 'AK-Teshekpuk': '02185',
 'AK-Tyonek': '02122',
 'AK-Umiat': '02185',
 'AK-North Slope': '02185',
 'AK-Barrow': '02185',
 'AK-Kenai Peninsula': '02122',
 'AK-Teshekpuk': '02185',
 'AK-Naknek': '02185',
 'AK-Kenai (Pre)': '02122',
 'AK-Bristol Bay': '02060',
 'AK-North Slope': '02185',
 'AK-Harrison Bay': '02185',
 'AK-Kenai Peninsula': '02122',
 'AK-Kenai (Post)': '02122',
 'AK-Ikpikpuk Riv': '02185',
 'AK-Meade River': '02185',
 'AK-Lookout Rdg': '02185',
 'AK-Barrow': '02185',
 'AK-North Slope': '02185',
 'AK-Kenai Peninsula': '02122',
 'AK-Bristol Bay': '02060',
 'AK-North Slope': '02185',
 'AK-Kenai Peninsula': '02122',
 'AK-Ikpikpuk Riv': '02185',
 'AK-North Slope': '02185',
 'AK-Kenai Peninsula': '02122',
 'AK-North Slope': '02185',
 'AK-Harrison Bay': '02185',
 'AK-Umiat': '02185',
 'AL-Fayette': '01057',
 'AL-Lamar': '01075',
 'AL-Mobile': '01097',
 'AL-Mobile/Water': '01097',
 'AL-Tuscaloosa': '01125',
 'AL-Shelby': '01117',
 'AL-Pickens': '01107',
 'AL-Jefferson': '01073',
 'AL-Mobile': '01097',
 'AL-Lamar': '01075',
 'AL-Conecuh': '01035',
 'AL-Jefferson': '01073',
 'AL-Hale': '01065',
 'AL-Shelby': '01117',
 'AL-St Clair': '01115',
 'AL-Escambia': '01053',
 'AL-Covington': '01039',
 'AL-Conecuh': '01035',
 'AL-Jefferson': '01073',
 'AL-Baldwin': '01003',
 'AL-Bibb': '01007',
 'AL-Choctaw': '01023',
 'AL-Covington': '01039',
 'AL-Escambia': '01053',
 'AL-Fayette': '01057',
 'AL-Lamar': '01075',
 'AL-Mobile': '01097',
 'AL-Tuscaloosa': '01125',
 'AL-Clarke': '01025',
 'AL-Blount': '01009',
 'AL-Bibb': '01007',
 'AL-Baldwin': '01003',
 'AL-Marshall': '01095',
 'AL-Etowah': '01055',
 'AL-Blount': '01009',
 'AL-Conecuh': '01035',
 'AL-Greene': '01063',
 'AL-Conecuh': '01035',
 'AL-Tuscaloosa': '01125',
 'AL-Mobile': '01097',
 'AL-Lamar': '01075',
 'AL-Fayette': '01057',
 'AL-Escambia': '01053',
 'AL-Covington': '01039',
 'AL-Choctaw': '01023',
 'AL-Bibb': '01007',
 'AL-Baldwin': '01003',
 'AL-Jefferson': '01073',
 'AL-Pickens': '01107',
 'AL-Perry': '01105',
 'AL-Hale': '01065',
 'AL-Chilton': '01021',
 'AL-Tuscaloosa': '01125',
 'AL-Mobile/Water': '01097',
 'AL-Mobile': '01097',
 'AL-Lamar': '01075',
 'AL-Jefferson': '01073',
 'AL-Fayette': '01057',
 'AL-Escambia': '01053',
 'AL-Covington': '01039',
 'AL-Conecuh': '01035',
 'AL-Clarke': '01025',
 'AL-Bibb': '01007',
 'AL-Baldwin': '01003',
 'AL-Greene': '01063',
 'AL-St Clair': '01115',
 'AL-Marshall': '01095',
 'AL-Etowah': '01055',
 'AL-Blount': '01009',
 'AL-Shelby': '01117',
 'AL-Chilton': '01021',
 'AL-Pickens': '01107',
 'AL-Perry': '01105',
 'AL-Perry': '01105',
 'AL-Hale': '01065',
 'AL-Baldwin': '01003',
 'AL-Bibb': '01007',
 'AL-Choctaw': '01023',
 'AL-Covington': '01039',
 'AL-Escambia': '01053',
 'AL-Fayette': '01057',
 'AL-Lamar': '01075',
 'AL-Mobile': '01097',
 'AL-Tuscaloosa': '01125',
 'AL-Tuscaloosa': '01125',
 'AL-Baldwin': '01003',
 'AL-Bibb': '01007',
 'AL-Clarke': '01025',
 'AL-Conecuh': '01035',
 'AL-Covington': '01039',
 'AL-Escambia': '01053',
 'AL-Jefferson': '01073',
 'AR-Ouachita': '05103',
 'AR-Montgomery': '05097',
 'AR-Columbia': '05027',
 'AR-Cleburne': '05023',
 'AR-Sebastian': '05131',
 'AR-Conway': '05029',
 'AR-Crawford': '05033',
 'AR-Scott': '05127',
 'AR-Scott': '05127',
 'AR-Washington': '05143',
 'AR-Van Buren': '05141',
 'AR-Sebastian': '05131',
 'AR-Scott': '05127',
 'AR-Prairie': '05117',
 'AR-Pope': '05115',
 'AR-Polk': '05113',
 'AR-Ouachita': '05103',
 'AR-Montgomery': '05097',
 'AR-Logan': '05083',
 'AR-Lafayette': '05073',
 'AR-Johnson': '05071',
 'AR-Garland': '05051',
 'AR-Franklin': '05047',
 'AR-Faulkner': '05045',
 'AR-Crawford': '05033',
 'AR-Conway': '05029',
 'AR-Columbia': '05027',
 'AR-Sharp': '05135',
 'AR-Sebastian': '05131',
 'AR-Pope': '05115',
 'AR-Conway': '05029',
 'AR-Columbia': '05027',
 'AR-Crawford': '05033',
 'AR-Franklin': '05047',
 'AR-Johnson': '05071',
 'AR-Logan': '05083',
 'AR-Faulkner': '05045',
 'AR-Columbia': '05027',
 'AR-Yell': '05149',
 'AR-Garland': '05051',
 'AR-White': '05145',
 'AR-Franklin': '05047',
 'AR-Garland': '05051',
 'AR-Conway': '05029',
 'AR-Logan': '05083',
 'AR-Scott': '05127',
 'AR-Montgomery': '05097',
 'AR-Pope': '05115',
 'AR-Sebastian': '05131',
 'AR-Sharp': '05135',
 'AR-Yell': '05149',
 'AR-Logan': '05083',
 'AR-Lafayette': '05073',
 'AR-Johnson': '05071',
 'AR-Garland': '05051',
 'AR-Yell': '05149',
 'AR-White': '05145',
 'AR-Phillips': '05107',
 'AR-Perry': '05105',
 'AR-Lee': '05077',
 'AR-Van Buren': '05141',
 'AR-Johnson': '05071',
 'AR-Van Buren': '05141',
 'AR-Sebastian': '05131',
 'AR-Sebastian': '05131',
 'AR-Scott': '05127',
 'AR-Pope': '05115',
 'AR-White': '05145',
 'AR-Faulkner': '05045',
 'AR-Cleburne': '05023',
 'AR-Sharp': '05135',
 'AR-Yell': '05149',
 'AR-Sebastian': '05131',
 'AR-Sebastian': '05131',
 'AR-Garland': '05051',
 'AR-Lee': '05077',
 'AR-Lincoln': '05079',
 'AR-Perry': '05105',
 'AR-Van Buren': '05141',
 'AR-Faulkner': '05045',
 'AR-Phillips': '05107',
 'AR-White': '05145',
 'AR-Montgomery': '05097',
 'AR-Pope': '05115',
 'AR-White': '05145',
 'AR-Montgomery': '05097',
 'AR-Garland': '05051',
 'AR-Van Buren': '05141',
 'AR-Crawford': '05033',
 'AR-Logan': '05083',
 'AR-Conway': '05029',
 'AR-Johnson': '05071',
 'AR-Cleburne': '05023',
 'AR-Fulton': '05049',
 'AR-Franklin': '05047',
 'AR-Crawford': '05033',
 'AR-Cleburne': '05023',
 'AR-Columbia': '05027',
 'AR-Cross': '05037',
 'AR-Madison': '05087',
 'AR-Columbia': '05027',
 'AR-Cross': '05037',
 'AR-Cleburne': '05023',
 'AR-Jackson': '05067',
 'AR-Franklin': '05047',
 'AR-Stone': '05137',
 'AR-Madison': '05087',
 'AR-Faulkner': '05045',
 'AR-Crawford': '05033',
 'AR-White': '05145',
 'AR-Yell': '05149',
 'AR-Nevada': '05099',
 'AR-Faulkner': '05045',
 'AR-Washington': '05143',
 'AR-Lincoln': '05079',
 'AR-Fulton': '05049',
 'AR-Stone': '05137',
 'AR-Fulton': '05049',
 'AR-Franklin': '05047',
 'AR-Yell': '05149',
 'AR-Conway': '05029',
 'AR-Cleburne': '05023',
 'AR-Van Buren': '05141',
 'AR-Sebastian': '05131',
 'AR-Jackson': '05067',
 'AR-Johnson': '05071',
 'AR-Logan': '05083',
 'AR-Montgomery': '05097',
 'AR-Nevada': '05099',
 'AR-Perry': '05105',
 'AR-Scott': '05127',
 'AR-Prairie': '05117',
 'AR-Pope': '05115',
 'AR-Polk': '05113',
 'AZ-Greenlee': '04011',
 'AZ-Maricopa': '04013',
 'AZ-Navajo': '04017',
 'AZ-Mohave': '04015',
 'AZ-Maricopa': '04013',
 'AZ-Greenlee': '04011',
 'AZ-Coconino': '04005',
 'AZ-Cochise': '04003',
 'AZ-Apache': '04001',
 'AZ-Maricopa': '04013',
 'AZ-Coconino': '04005',
 'AZ-Maricopa': '04013',
 'AZ-Navajo': '04017',
 'AZ-Apache': '04001',
 'AZ-Navajo': '04017',
 'AZ-Apache': '04001',
 'AZ-Cochise': '04003',
 'AZ-Coconino': '04005',
 'AZ-Maricopa': '04013',
 'AZ-Maricopa': '04013',
 'AZ-Mohave': '04015',
 'CA-Kings': '06031',
 'CA-Kern': '06029',
 'CA-Inyo': '06027',
 'CA-Imperial': '06025',
 'CA-Glenn': '06021',
 'CA-Fresno': '06019',
 'CA-Contra Costa': '06013',
 'CA-Glenn': '06021',
 'CA-Santa Barbara': '06083',
 'CA-Solano': '06095',
 'CA-Sonoma': '06097',
 'CA-Ventura': '06111',
 'CA-Riverside': '06065',
 'CA-Contra Costa': '06013',
 'CA-Fresno': '06019',
 'CA-Glenn': '06021',
 'CA-Imperial': '06025',
 'CA-Inyo': '06027',
 'CA-Kern': '06029',
 'CA-Kings': '06031',
 'CA-Lake': '06033',
 'CA-Lassen': '06035',
 'CA-Los Angeles': '06037',
 'CA-Mendocino': '06045',
 'CA-Mono': '06051',
 'CA-Monterey': '06053',
 'CA-Riverside': '06065',
 'CA-Sacramento': '06067',
 'CA-San Benito': '06069',
 'CA-San Bernardino': '06071',
 'CA-Ventura': '06111',
 'CA-San Joaquin': '06077',
 'CA-Lake': '06033',
 'CA-Lake': '06033',
 'CA-San Luis Obispo': '06079',
 'CA-Sonoma': '06097',
 'CA-Santa Barbara': '06083',
 'CA-San Diego': '06073',
 'CA-Siskiyou': '06093',
 'CA-Solano': '06095',
 'CA-Santa Barbara': '06083',
 'CA-San Luis Obispo': '06079',
 'CA-San Joaquin': '06077',
 'CA-San Bernardino': '06071',
 'CA-San Benito': '06069',
 'CA-Sacramento': '06067',
 'CA-Monterey': '06053',
 'CA-Mono': '06051',
 'CA-Solano': '06095',
 'CA-Sonoma': '06097',
 'CA-Sutter': '06101',
 'CA-Ventura': '06111',
 'CA-Tehama': '06103',
 'CA-Colusa': '06011',
 'CA-Mendocino': '06045',
 'CA-Trinity': '06105',
 'CA-San Diego': '06073',
 'CA-Los Angeles': '06037',
 'CA-San Luis Obispo': '06079',
 'CA-Kern': '06029',
 'CA-Lassen': '06035',
 'CA-Mendocino': '06045',
 'CA-Kern': '06029',
 'CA-Inyo': '06027',
 'CA-Imperial': '06025',
 'CA-Glenn': '06021',
 'CA-Fresno': '06019',
 'CA-Contra Costa': '06013',
 'CA-Contra Costa': '06013',
 'CA-Fresno': '06019',
 'CA-Glenn': '06021',
 'CA-Imperial': '06025',
 'CA-Inyo': '06027',
 'CA-Kern': '06029',
 'CA-Trinity': '06105',
 'CA-San Diego': '06073',
 'CA-Colusa': '06011',
 'CA-Yolo': '06113',
 'CA-Lassen': '06035',
 'CA-Ventura': '06111',
 'CA-Tulare': '06107',
 'CA-Sutter': '06101',
 'CA-Stanislaus': '06099',
 'CA-Sonoma': '06097',
 'CA-Solano': '06095',
 'CA-Siskiyou': '06093',
 'CA-Santa Barbara': '06083',
 'CA-San Luis Obispo': '06079',
 'CA-San Joaquin': '06077',
 'CA-San Bernardn': '06071',
 'CA-San Benito': '06069',
 'CA-Sacramento': '06067',
 'CA-Monterey': '06053',
 'CA-Fresno': '06019',
 'CA-Mono': '06051',
 'CA-Merced': '06047',
 'CA-Ventura': '06111',
 'CA-San Luis Obispo': '06079',
 'CA-Sonoma': '06097',
 'CA-Solano': '06095',
 'CA-Santa Barbara': '06083',
 'CA-Kern': '06029',
 'CA-San Luis Obispo': '06079',
 'CA-San Joaquin': '06077',
 'CA-San Bernardino': '06071',
 'CA-San Benito': '06069',
 'CA-Los Angeles': '06037',
 'CA-Sacramento': '06067',
 'CA-Monterey': '06053',
 'CA-Tehama': '06103',
 'CA-Mono': '06051',
 'CA-San Luis Obispo': '06079',
 'CA-Kern': '06029',
 'CA-Mono': '06051',
 'CA-Ventura': '06111',
 'CA-Tulare': '06107',
 'CA-Sutter': '06101',
 'CA-Stanislaus': '06099',
 'CA-Merced': '06047',
 'CA-Sonoma': '06097',
 'CA-Solano': '06095',
 'CA-Siskiyou': '06093',
 'CA-Santa Barbara': '06083',
 'CA-San Luis Obispo': '06079',
 'CA-San Joaquin': '06077',
 'CA-San Bernardino': '06071',
 'CA-Contra Costa': '06013',
 'CA-Los Angeles': '06037',
 'CA-Lassen': '06035',
 'CA-Lake': '06033',
 'CA-Kings': '06031',
 'CA-Kern': '06029',
 'CA-San Benito': '06069',
 'CA-Sacramento': '06067',
 'CA-Inyo': '06027',
 'CA-Imperial': '06025',
 'CA-Glenn': '06021',
 'CA-Fresno': '06019',
 'CA-Contra Costa': '06013',
 'CA-Los Angeles': '06037',
 'CA-Lassen': '06035',
 'CA-Lake': '06033',
 'CA-Kings': '06031',
 'CA-Tehama': '06103',
 'CA-Monterey': '06053',
 'CA-Kern': '06029',
 'CA-Inyo': '06027',
 'CA-Kings': '06031',
 'CA-Kings': '06031',
 'CA-Riverside': '06065',
 'CA-Yolo': '06113',
 'CA-Imperial': '06025',
 'CA-San Luis Obispo': '06079',
 'CA-San Joaquin': '06077',
 'CA-San Bernardino': '06071',
 'CA-San Benito': '06069',
 'CA-Sacramento': '06067',
 'CA-Monterey': '06053',
 'CA-Mono': '06051',
 'CA-Los Angeles': '06037',
 'CA-Lassen': '06035',
 'CA-Lake': '06033',
 'CO-Adams': '08001',
 'CO-Mesa': '08077',
 'CO-Moffat': '08081',
 'CO-Grand': '08049',
 'CO-Crowley': '08025',
 'CO-Elbert': '08039',
 'CO-Saguache': '08109',
 'CO-Ouray': '08091',
 'CO-Lincoln': '08073',
 'CO-Pueblo': '08101',
 'CO-Chaffee': '08015',
 'CO-Fremont': '08043',
 'CO-Garfield': '08045',
 'CO-Gunnison': '08051',
 'CO-Huerfano': '08055',
 'CO-Jackson': '08057',
 'CO-Kiowa': '08061',
 'CO-Kit Carson': '08063',
 'CO-La Plata': '08067',
 'CO-Larimer': '08069',
 'CO-Las Animas': '08071',
 'CO-Logan': '08075',
 'CO-Mesa': '08077',
 'CO-Moffat': '08081',
 'CO-Montezuma': '08083',
 'CO-Morgan': '08087',
 'CO-Prowers': '08099',
 'CO-Rio Blanco': '08103',
 'CO-Routt': '08107',
 'CO-San Miguel': '08113',
 'CO-Washington': '08121',
 'CO-Weld': '08123',
 'CO-Yuma': '08125',
 'CO-Custer': '08027',
 'CO-Baca': '08009',
 'CO-Weld': '08123',
 'CO-San Juan': '08111',
 'CO-Grand': '08049',
 'CO-Routt': '08107',
 'CO-La Plata': '08067',
 'CO-Archuleta': '08007',
 'CO-Adams': '08001',
 'CO-Jackson': '08057',
 'CO-Phillips': '08095',
 'CO-Delta': '08029',
 'CO-Gunnison': '08051',
 'CO-Mesa': '08077',
 'CO-Moffat': '08081',
 'CO-San Miguel': '08113',
 'CO-Rio Blanco': '08103',
 'CO-Las Animas': '08071',
 'CO-Garfield': '08045',
 'CO-Adams': '08001',
 'CO-Alamosa': '08003',
 'CO-Arapahoe': '08005',
 'CO-Archuleta': '08007',
 'CO-Bent': '08011',
 'CO-Broomfield': '08014',
 'CO-Cheyenne': '08017',
 'CO-Delta': '08029',
 'CO-Dolores': '08033',
 'CO-Douglas': '08035',
 'CO-Eagle': '08037',
 'CO-El Paso': '08041',
 'CO-Garfield': '08045',
 'CO-Gunnison': '08051',
 'CO-Huerfano': '08055',
 'CO-Jackson': '08057',
 'CO-Kiowa': '08061',
 'CO-Kit Carson': '08063',
 'CO-La Plata': '08067',
 'CO-Larimer': '08069',
 'CO-Dolores': '08033',
 'CO-Delta': '08029',
 'CO-Cheyenne': '08017',
 'CO-Broomfield': '08014',
 'CO-Bent': '08011',
 'CO-Baca': '08009',
 'CO-Archuleta': '08007',
 'CO-Yuma': '08125',
 'CO-Weld': '08123',
 'CO-Washington': '08121',
 'CO-San Miguel': '08113',
 'CO-Routt': '08107',
 'CO-Rio Blanco': '08103',
 'CO-Prowers': '08099',
 'CO-Morgan': '08087',
 'CO-Montezuma': '08083',
 'CO-Moffat': '08081',
 'CO-Mesa': '08077',
 'CO-Logan': '08075',
 'CO-Las Animas': '08071',
 'CO-Larimer': '08069',
 'CO-La Plata': '08067',
 'CO-Kit Carson': '08063',
 'CO-Kiowa': '08061',
 'CO-Jackson': '08057',
 'CO-Huerfano': '08055',
 'CO-Gunnison': '08051',
 'CO-Garfield': '08045',
 'CO-Fremont': '08043',
 'CO-Dolores': '08033',
 'CO-Delta': '08029',
 'CO-Cheyenne': '08017',
 'CO-Broomfield': '08014',
 'CO-Bent': '08011',
 'CO-Baca': '08009',
 'CO-Archuleta': '08007',
 'CO-Arapahoe': '08005',
 'CO-Fremont': '08043',
 'CO-Arapahoe': '08005',
 'CO-El Paso': '08041',
 'CO-Yuma': '08125',
 'CO-Weld': '08123',
 'CO-Washington': '08121',
 'CO-Sedgwick': '08115',
 'CO-San Miguel': '08113',
 'CO-Routt': '08107',
 'CO-Rio Grande': '08105',
 'CO-Rio Blanco': '08103',
 'CO-Garfield': '08045',
 'CO-Las Animas': '08071',
 'CO-Rio Blanco': '08103',
 'CO-San Miguel': '08113',
 'CO-Prowers': '08099',
 'CO-Pitkin': '08097',
 'CO-Phillips': '08095',
 'CO-Park': '08093',
 'CO-Morgan': '08087',
 'CO-Montrose': '08085',
 'CO-Montezuma': '08083',
 'CO-Moffat': '08081',
 'CO-Mesa': '08077',
 'CO-Logan': '08075',
 'CO-Las Animas': '08071',
 'CO-Larimer': '08069',
 'CO-La Plata': '08067',
 'CO-Kit Carson': '08063',
 'CO-Kiowa': '08061',
 'CO-Jackson': '08057',
 'CO-Huerfano': '08055',
 'CO-Gunnison': '08051',
 'CO-Garfield': '08045',
 'CO-El Paso': '08041',
 'CO-Eagle': '08037',
 'CO-Douglas': '08035',
 'CO-Dolores': '08033',
 'CO-Delta': '08029',
 'CO-Cheyenne': '08017',
 'CO-Broomfield': '08014',
 'CO-Bent': '08011',
 'CO-Baca': '08009',
 'CO-Archuleta': '08007',
 'CO-Arapahoe': '08005',
 'CO-Alamosa': '08003',
 'CO-Adams': '08001',
 'CO-Moffat': '08081',
 'CO-Mesa': '08077',
 'CO-Gunnison': '08051',
 'CO-Delta': '08029',
 'CO-Phillips': '08095',
 'CO-Yuma': '08125',
 'CO-Jackson': '08057',
 'CO-Weld': '08123',
 'CO-Adams': '08001',
 'CO-Washington': '08121',
 'CO-Sedgwick': '08115',
 'CO-San Miguel': '08113',
 'CO-Archuleta': '08007',
 'CO-La Plata': '08067',
 'CO-Routt': '08107',
 'CO-Routt': '08107',
 'CO-Rio Grande': '08105',
 'CO-Rio Blanco': '08103',
 'CO-Prowers': '08099',
 'CO-Pitkin': '08097',
 'CO-Phillips': '08095',
 'CO-Park': '08093',
 'CO-Morgan': '08087',
 'CO-Montrose': '08085',
 'CO-Montezuma': '08083',
 'CO-Moffat': '08081',
 'CO-Mesa': '08077',
 'CO-San Juan': '08111',
 'CO-Logan': '08075',
 'CO-Grand': '08049',
 'CO-Lincoln': '08073',
 'CO-Arapahoe': '08005',
 'CO-Archuleta': '08007',
 'CO-Baca': '08009',
 'CO-Bent': '08011',
 'CO-Broomfield': '08014',
 'CO-Cheyenne': '08017',
 'CO-Delta': '08029',
 'CO-Dolores': '08033',
 'CO-Fremont': '08043',
 'CO-Garfield': '08045',
 'CO-Gunnison': '08051',
 'CO-Huerfano': '08055',
 'CO-Jackson': '08057',
 'CO-Kiowa': '08061',
 'CO-Kit Carson': '08063',
 'CO-La Plata': '08067',
 'CO-Larimer': '08069',
 'CO-Las Animas': '08071',
 'CO-Logan': '08075',
 'CO-Mesa': '08077',
 'CO-Moffat': '08081',
 'CO-Montezuma': '08083',
 'CO-Morgan': '08087',
 'CO-Prowers': '08099',
 'CO-Rio Blanco': '08103',
 'CO-Routt': '08107',
 'CO-San Miguel': '08113',
 'CO-Washington': '08121',
 'CO-Weld': '08123',
 'CO-Yuma': '08125',
 'CO-Las Animas': '08071',
 'CO-Larimer': '08069',
 'CO-La Plata': '08067',
 'CO-Kit Carson': '08063',
 'CO-Kiowa': '08061',
 'CO-Jackson': '08057',
 'CO-Huerfano': '08055',
 'CO-Gunnison': '08051',
 'CO-Grand': '08049',
 'CO-Garfield': '08045',
 'CO-Elbert': '08039',
 'CO-Dolores': '08033',
 'CO-Delta': '08029',
 'CO-Cheyenne': '08017',
 'CO-Chaffee': '08015',
 'CO-Broomfield': '08014',
 'CO-Bent': '08011',
 'CO-Baca': '08009',
 'CO-Archuleta': '08007',
 'CO-Arapahoe': '08005',
 'CO-Las Animas': '08071',
 'CO-Weld': '08123',
 'CO-San Juan': '08111',
 'CO-Yuma': '08125',
 'CO-Weld': '08123',
 'CO-Washington': '08121',
 'CO-Sedgwick': '08115',
 'CO-San Miguel': '08113',
 'CO-Routt': '08107',
 'CO-Rio Grande': '08105',
 'CO-Rio Blanco': '08103',
 'CO-Grand': '08049',
 'CO-Custer': '08027',
 'CO-Logan': '08075',
 'CO-Mesa': '08077',
 'CO-Moffat': '08081',
 'CO-Chaffee': '08015',
 'CO-Montezuma': '08083',
 'CO-Pueblo': '08101',
 'CO-Elbert': '08039',
 'CO-Montrose': '08085',
 'CO-Morgan': '08087',
 'CO-Park': '08093',
 'CO-Fremont': '08043',
 'CO-Lincoln': '08073',
 'CO-Routt': '08107',
 'CO-La Plata': '08067',
 'CO-Archuleta': '08007',
 'CO-Phillips': '08095',
 'CO-Pitkin': '08097',
 'CO-Prowers': '08099',
 'CO-Rio Blanco': '08103',
 'CO-Fremont': '08043',
 'CO-Grand': '08049',
 'CO-Crowley': '08025',
 'CO-Rio Grande': '08105',
 'CO-Routt': '08107',
 'CO-San Miguel': '08113',
 'CO-Saguache': '08109',
 'CO-Ouray': '08091',
 'CO-Adams': '08001',
 'CO-Sedgwick': '08115',
 'CO-Washington': '08121',
 'CO-Weld': '08123',
 'CO-Jackson': '08057',
 'CO-Yuma': '08125',
 'CO-Phillips': '08095',
 'CO-Delta': '08029',
 'CO-Garfield': '08045',
 'CO-Las Animas': '08071',
 'CO-Rio Blanco': '08103',
 'CO-San Miguel': '08113',
 'CO-Gunnison': '08051',
 'FL-Manatee': '12081',
 'FL-Manatee': '12081',
 'FL-Hardee': '12049',
 'FL-Santa Rosa': '12113',
 'FL-Manatee': '12081',
 'FL-Okaloosa': '12091',
 'FL-Okaloosa': '12091',
 'FL-Polk': '12105',
 'FL-Santa Rosa': '12113',
 'FL-Santa Rosa': '12113',
 'FL-Hardee': '12049',
 'FL-Hardee': '12049',
 'FL-Manatee': '12081',
 'FL-Polk': '12105',
 'FL-Hardee': '12049',
 'FL-Okaloosa': '12091',
 'FL-Polk': '12105',
 'FL-Hardee': '12049',
 'FL-Manatee': '12081',
 'FL-Hardee': '12049',
 'FL-Polk': '12105',
 'FL-Polk': '12105',
 'FL-Manatee': '12081',
 'FL-Manatee': '12081',
 'FL-Hardee': '12049',
 'FL-Santa Rosa': '12113',
 'FL-Santa Rosa': '12113',
 'FL-Santa Rosa': '12113',
 'FL-Polk': '12105',
 'FL-Polk': '12105',
 'GA-Greene': '13133',
 'GA-Greene': '13133',
 'GA-Greene': '13133',
 'ID-Bonneville': '16019',
 'ID-Clark': '16033',
 'ID-Clearwater': '16035',
 'ID-Caribou': '16029',
 'ID-Clearwater': '16035',
 'ID-Clearwater': '16035',
 'ID-Latah': '16057',
 'ID-Bonneville': '16019',
 'ID-Boise': '16015',
 'ID-Canyon': '16027',
 'ID-Camas': '16025',
 'ID-Blaine': '16013',
 'ID-Payette': '16075',
 'ID-Payette': '16075',
 'ID-Canyon': '16027',
 'ID-Camas': '16025',
 'ID-Blaine': '16013',
 'ID-Latah': '16057',
 'ID-Bannock': '16005',
 'ID-Shoshone': '16079',
 'ID-Jefferson': '16051',
 'ID-Caribou': '16029',
 'ID-Boise': '16015',
 'ID-Bannock': '16005',
 'ID-Bear Lake': '16007',
 'ID-Bingham': '16011',
 'ID-Shoshone': '16079',
 'ID-Jefferson': '16051',
 'ID-Caribou': '16029',
 'ID-Bear Lake': '16007',
 'ID-Bingham': '16011',
 'ID-Cassia': '16031',
 'ID-Cassia': '16031',
 'ID-Caribou': '16029',
 'ID-Clark': '16033',
 'ID-Teton': '16081',
 'ID-Shoshone': '16079',
 'ID-Clearwater': '16035',
 'ID-Teton': '16081',
 'ID-Payette': '16075',
 'ID-Caribou': '16029',
 'ID-Payette': '16075',
 'ID-Bannock': '16005',
 'ID-Bear Lake': '16007',
 'ID-Bingham': '16011',
 'ID-Boise': '16015',
 'ID-Bonneville': '16019',
 'ID-Canyon': '16027',
 'ID-Caribou': '16029',
 'ID-Cassia': '16031',
 'ID-Clark': '16033',
 'ID-Washington': '16087',
 'ID-Latah': '16057',
 'ID-Payette': '16075',
 'ID-Washington': '16087',
 'ID-Clearwater': '16035',
 'ID-Payette': '16075',
 'ID-Teton': '16081',
 'ID-Clearwater': '16035',
 'ID-Clark': '16033',
 'ID-Caribou': '16029',
 'ID-Bingham': '16011',
 'ID-Bear Lake': '16007',
 'ID-Bannock': '16005',
 'ID-Clearwater': '16035',
 'ID-Washington': '16087',
 'IL-Clinton': '17027',
 'IL-Franklin': '17055',
 'IL-Fayette': '17051',
 'IL-Franklin': '17055',
 'IL-Jefferson': '17081',
 'IL-Franklin': '17055',
 'IL-Fayette': '17051',
 'IL-Clinton': '17027',
 'IL-Jefferson': '17081',
 'IL-Fayette': '17051',
 'IL-Clinton': '17027',
 'IL-Hardin': '17069',
 'IL-Hardin': '17069',
 'IL-Franklin': '17055',
 'IL-Fayette': '17051',
 'IL-Clinton': '17027',
 'IL-Franklin': '17055',
 'IL-Clinton': '17027',
 'IL-Jefferson': '17081',
 'IL-Clinton': '17027',
 'IL-Fayette': '17051',
 'IL-Hardin': '17069',
 'IL-Franklin': '17055',
 'IL-Fayette': '17051',
 'IL-Clinton': '17027',
 'IL-Union': '17181',
 'IL-Franklin': '17055',
 'IL-Union': '17181',
 'IL-Fayette': '17051',
 'IN-Crawford': '18025',
 'IN-Perry': '18123',
 'IN-Gibson': '18051',
 'IN-Crawford': '18025',
 'IN-Perry': '18123',
 'IN-Gibson': '18051',
 'IN-Crawford': '18025',
 'IN-Perry': '18123',
 'IN-Gibson': '18051',
 'KS-Grant': '20067',
 'KS-Gove': '20063',
 'KS-Finney': '20055',
 'KS-Woodson': '20207',
 'KS-Trego': '20195',
 'KS-Stevens': '20189',
 'KS-Stanton': '20187',
 'KS-Seward': '20175',
 'KS-Morton': '20129',
 'KS-Meade': '20119',
 'KS-Lane': '20101',
 'KS-Kearny': '20093',
 'KS-Haskell': '20081',
 'KS-Hamilton': '20075',
 'KS-Grant': '20067',
 'KS-Gove': '20063',
 'KS-Finney': '20055',
 'KS-Ellsworth': '20053',
 'KS-Comanche': '20033',
 'KS-Kearny': '20093',
 'KS-Ellsworth': '20053',
 'KS-Haskell': '20081',
 'KS-Hamilton': '20075',
 'KS-Comanche': '20033',
 'KS-Wilson': '20205',
 'KS-Grant': '20067',
 'KS-Gove': '20063',
 'KS-Finney': '20055',
 'KS-Cheyenne': '20023',
 'KS-Comanche': '20033',
 'KS-Ellsworth': '20053',
 'KS-Labette': '20099',
 'KS-Russell': '20167',
 'KS-Clark': '20025',
 'KS-Cheyenne': '20023',
 'KS-Barber': '20007',
 'KS-Saline': '20169',
 'KS-Logan': '20109',
 'KS-Sherman': '20181',
 'KS-Comanche': '20033',
 'KS-Ellsworth': '20053',
 'KS-Bourbon': '20011',
 'KS-Marion': '20115',
 'KS-Finney': '20055',
 'KS-Gove': '20063',
 'KS-Grant': '20067',
 'KS-Hamilton': '20075',
 'KS-Haskell': '20081',
 'KS-Kearny': '20093',
 'KS-Lane': '20101',
 'KS-Norton': '20137',
 'KS-Meade': '20119',
 'KS-Morton': '20129',
 'KS-Seward': '20175',
 'KS-Stanton': '20187',
 'KS-Stevens': '20189',
 'KS-Trego': '20195',
 'KS-Stanton': '20187',
 'KS-Trego': '20195',
 'KS-Trego': '20195',
 'KS-Stevens': '20189',
 'KS-Stanton': '20187',
 'KS-Seward': '20175',
 'KS-Morton': '20129',
 'KS-Meade': '20119',
 'KS-Lane': '20101',
 'KS-Kearny': '20093',
 'KS-Haskell': '20081',
 'KS-Hamilton': '20075',
 'KS-Grant': '20067',
 'KS-Gove': '20063',
 'KS-Finney': '20055',
 'KS-Seward': '20175',
 'KS-Morton': '20129',
 'KS-Meade': '20119',
 'KS-Ellsworth': '20053',
 'KS-Saline': '20169',
 'KS-Comanche': '20033',
 'KS-Lane': '20101',
 'KS-Russell': '20167',
 'KS-Stevens': '20189',
 'KS-Norton': '20137',
 'KS-Labette': '20099',
 'KS-Marshall': '20117',
 'KS-Wilson': '20205',
 'KS-Woodson': '20207',
 'KS-Kearny': '20093',
 'KS-Haskell': '20081',
 'KS-Trego': '20195',
 'KS-Stevens': '20189',
 'KS-Edwards': '20047',
 'KS-Geary': '20061',
 'KS-Logan': '20109',
 'KS-Sherman': '20181',
 'KS-Stanton': '20187',
 'KS-Bourbon': '20011',
 'KS-Marion': '20115',
 'KS-Seward': '20175',
 'KS-Morton': '20129',
 'KS-Meade': '20119',
 'KS-Barber': '20007',
 'KS-Cheyenne': '20023',
 'KS-Clark': '20025',
 'KS-Comanche': '20033',
 'KS-Lane': '20101',
 'KS-Kearny': '20093',
 'KS-Haskell': '20081',
 'KS-Hamilton': '20075',
 'KS-Greeley': '20071',
 'KS-Grant': '20067',
 'KS-Gove': '20063',
 'KS-Finney': '20055',
 'KS-Ellsworth': '20053',
 'KS-Comanche': '20033',
 'KS-Clark': '20025',
 'KS-Cheyenne': '20023',
 'KS-Barber': '20007',
 'KS-Woodson': '20207',
 'KS-Wilson': '20205',
 'KS-Trego': '20195',
 'KS-Stevens': '20189',
 'KS-Stanton': '20187',
 'KS-Sherman': '20181',
 'KS-Seward': '20175',
 'KS-Morton': '20129',
 'KS-Meade': '20119',
 'KS-Marion': '20115',
 'KS-Logan': '20109',
 'KS-Lane': '20101',
 'KS-Labette': '20099',
 'KS-Edwards': '20047',
 'KS-Geary': '20061',
 'KS-Marshall': '20117',
 'KS-Hamilton': '20075',
 'KS-Greeley': '20071',
 'KY-Letcher': '21133',
 'KY-Leslie': '21131',
 'KY-Lawrence': '21127',
 'KY-Henderson': '21101',
 'KY-Harlan': '21095',
 'KY-Floyd': '21071',
 'KY-Clay': '21051',
 'KY-Owsley': '21189',
 'KY-Pike': '21195',
 'KY-Whitley': '21235',
 'KY-Johnson': '21115',
 'KY-Morgan': '21175',
 'KY-Grayson': '21085',
 'KY-Johnson': '21115',
 'KY-Morgan': '21175',
 'KY-Harlan': '21095',
 'KY-Bell': '21013',
 'KY-Estill': '21065',
 'KY-Lee': '21129',
 'KY-Whitley': '21235',
 'KY-Pike': '21195',
 'KY-McCreary': '21147',
 'KY-Letcher': '21133',
 'KY-Leslie': '21131',
 'KY-Lawrence': '21127',
 'KY-Henderson': '21101',
 'KY-Floyd': '21071',
 'KY-Clay': '21051',
 'KY-Harlan': '21095',
 'KY-Morgan': '21175',
 'KY-Johnson': '21115',
 'KY-Clay': '21051',
 'KY-Floyd': '21071',
 'KY-Harlan': '21095',
 'KY-Henderson': '21101',
 'KY-Johnson': '21115',
 'KY-Lawrence': '21127',
 'KY-Leslie': '21131',
 'KY-Letcher': '21133',
 'KY-McCreary': '21147',
 'KY-Meade': '21163',
 'KY-Morgan': '21175',
 'KY-Owsley': '21189',
 'KY-Pike': '21195',
 'KY-Union': '21225',
 'KY-Whitley': '21235',
 'KY-Clay': '21051',
 'KY-Floyd': '21071',
 'KY-Harlan': '21095',
 'KY-Henderson': '21101',
 'KY-Johnson': '21115',
 'KY-Lawrence': '21127',
 'KY-Leslie': '21131',
 'KY-Mccreary': '21147',
 'KY-Meade': '21163',
 'KY-Morgan': '21175',
 'KY-Owsley': '21189',
 'KY-Pike': '21195',
 'KY-Whitley': '21235',
 'KY-Bell': '21013',
 'KY-Clay': '21051',
 'KY-Floyd': '21071',
 'KY-Henderson': '21101',
 'KY-Lawrence': '21127',
 'KY-Leslie': '21131',
 'KY-Letcher': '21133',
 'KY-McCreary': '21147',
 'KY-Pike': '21195',
 'KY-Whitley': '21235',
 'KY-Johnson': '21115',
 'KY-Morgan': '21175',
 'KY-Harlan': '21095',
 'KY-Whitley': '21235',
 'KY-Pike': '21195',
 'KY-McCreary': '21147',
 'KY-Letcher': '21133',
 'KY-Leslie': '21131',
 'KY-Lawrence': '21127',
 'KY-Henderson': '21101',
 'KY-Floyd': '21071',
 'KY-Clay': '21051',
 'KY-Union': '21225',
 'KY-McCreary': '21147',
 'KY-Grayson': '21085',
  'KY-Letcher': '21133',
 'KY-Bell': '21013',
 'KY-Lee': '21129',
 'KY-Estill': '21065',
 'KY-Mccreary': '21147',
 'KY-Meade': '21163',
  'LA-Iberia': '22045',
  'LA-Rapides': '22079',
 'LA-Sabine': '22085',
  'LA-South': '22721',
  'LA-St. Bernard': '22087',
 'LA-St Charles': '22089',
  'LA-St. Charles': '22089',
  'LA-St. James': '22093',
     'LA-St. John the Baptist': '22095',
  'LA-St. Martin': '22099',
 'LA-St. Tammany': '22103',
 'LA-Natchitoches': '22069',
 'LA-Ouachita': '22073',
 'LA-Plaquemines': '22075',
 'LA-Rapides': '22079',
 'LA-South Pass': '22721',
 'LA-St. Martin': '22099',
 'LA-Tangipahoa': '22105',
 'LA-Terrebonne': '22109',
 'LA-Union': '22111',
 'LA-Vermilion': '22113',
 'LA-Vernon': '22115',
 'LA-Webster': '22119',
 'LA-West Delta': '22719',
 'LA-Winn': '22127',
 'LA-Avoyelles': '22009',
 'LA-Sabine': '22085',
 'LA-Pt. Coupee': '22077',
 'LA-Red River': '22081',
 'LA-Grant': '22043',
 'LA-St Charles': '22089',
 'LA-Orleans': '22071',
 'LA-Natchitoches': '22069',
 'LA-Catahoula': '22025',
 'LA-Morehouse': '22067',
 'LA-West': '22719',
 'LA-South': '22721',
 'LA-Beauregard': '22011',
 'LA-Livingston': '22063',
 'LA-Pointe Coupee': '22077',
 'LA-Assumption': '22007',
 'LA-Lincoln': '22061',
 'LA-Lafourche': '22057',
 'LA-Avoyelles': '22009',
 'LA-Assumption': '22007',
 'LA-Beauregard': '22011',
 'LA-Bienville': '22013',
 'LA-Bossier': '22015',
 'LA-Caddo': '22017',
 'LA-Calcasieu': '22019',
 'LA-Caldwell': '22021',
 'LA-Cameron': '22023',
 'LA-Claiborne': '22027',
 'LA-De Soto': '22031',
 'LA-East Baton Rouge': '22033',
 'LA-Grant': '22043',
 'LA-Iberville': '22047',
 'LA-Jackson': '22049',
 'LA-Jefferson': '22051',
 'LA-Lafourche': '22057',
 'LA-Lincoln': '22061',
 'LA-Livingston': '22063',
 'LA-Morehouse': '22067',
 'LA-Natchitoches': '22069',
 'LA-Orleans': '22071',
 'LA-Ouachita': '22073',
 'LA-Plaquemines': '22075',
 'LA-Rapides': '22079',
 'LA-South Pass': '22721',
 'LA-St Bernard': '22087',
 'LA-St Martin': '22099',
 'LA-St Mary': '22101',
 'LA-Terrebonne': '22109',
 'LA-Union': '22111',
 'LA-Vermilion': '22113',
 'LA-Vernon': '22115',
 'LA-Webster': '22119',
 'LA-West Delta': '22719',
 'LA-Winn': '22127',
 'LA-Plaquemines': '22075',
 'LA-Pointe Coupee': '22077',
 'LA-Red River': '22081',
 'LA-St. Mary': '22101',
 'LA-Terrebonne': '22109',
 'LA-Union': '22111',
 'LA-Vermilion': '22113',
 'LA-Vernon': '22115',
 'LA-Webster': '22119',
 'LA-West': '22719',
 'LA-Winn': '22127',
 'LA-Catahoula': '22025',
 'LA-East Baton Rouge': '22033',
 'LA-Jefferson': '22051',
 'LA-Concordia': '22029',
 'LA-La Salle': '22059',
 'LA-Concordia': '22029',
 'LA-Winn': '22127',
 'LA-West Delta': '22719',
 'LA-Webster': '22119',
 'LA-Vernon': '22115',
 'LA-Vermilion': '22113',
 'LA-Union': '22111',
 'LA-Terrebonne': '22109',
 'LA-St Mary': '22101',
 'LA-St Martin': '22099',
 'LA-St Bernard': '22087',
 'LA-South Pass': '22721',
 'LA-Jackson': '22049',
 'LA-Iberville': '22047',
 'LA-Grant': '22043',
 'LA-Sabine': '22085',
 'LA-Pt. Coupee': '22077',
 'LA-Red River': '22081',
 'LA-E Btn Rouge': '22033',
 'LA-De Soto': '22031',
 'LA-Claiborne': '22027',
 'LA-Beauregard': '22011',
 'LA-Bienville': '22013',
 'LA-Bossier': '22015',
 'LA-Caddo': '22017',
 'LA-Calcasieu': '22019',
 'LA-Cameron': '22023',
 'LA-Claiborne': '22027',
 'LA-De Soto': '22031',
 'LA-East Baton Rouge': '22033',
 'LA-La Salle': '22059',
 'LA-Lafourche': '22057',
 'LA-Lincoln': '22061',
 'LA-Morehouse': '22067',
 'LA-Natchitoches': '22069',
 'LA-Ouachita': '22073',
 'LA-Plaquemines': '22075',
 'LA-Rapides': '22079',
 'LA-South Pass': '22721',
 'LA-St. Martin': '22099',
 'LA-Terrebonne': '22109',
 'LA-Union': '22111',
 'LA-Vermilion': '22113',
 'LA-Vernon': '22115',
 'LA-Webster': '22119',
 'LA-West Delta': '22719',
 'LA-Winn': '22127',
 'LA-Caldwell': '22021',
 'LA-St. Mary': '22101',
 'LA-Red River': '22081',
 'LA-St Charles': '22089',
 'LA-St. Mary': '22101',
 'LA-Sabine': '22085',
 'LA-Concordia': '22029',
 'LA-La Salle': '22059',
 'LA-Grant': '22043',
 'LA-Winn': '22127',
 'LA-West Delta': '22719',
 'LA-Webster': '22119',
 'LA-Vernon': '22115',
 'LA-Vermilion': '22113',
 'LA-Union': '22111',
 'LA-Terrebonne': '22109',
 'LA-St. Martin': '22099',
 'LA-South Pass': '22721',
 'LA-Rapides': '22079',
 'LA-Plaquemines': '22075',
 'LA-Ouachita': '22073',
 'LA-Natchitoches': '22069',
 'LA-Morehouse': '22067',
 'LA-Lincoln': '22061',
 'LA-Lafourche': '22057',
 'LA-La Salle': '22059',
 'LA-East Baton Rouge': '22033',
 'LA-De Soto': '22031',
 'LA-Claiborne': '22027',
 'LA-Cameron': '22023',
 'LA-Calcasieu': '22019',
 'LA-Caddo': '22017',
 'LA-Bossier': '22015',
 'LA-Caldwell': '22021',
 'LA-St. Mary': '22101',
 'LA-Red River': '22081',
 'LA-Sabine': '22085',
 'LA-Concordia': '22029',
 'LA-Grant': '22043',
 'LA-Beauregard': '22011',
 'LA-Bienville': '22013',
 'LA-Bossier': '22015',
 'LA-Caddo': '22017',
 'LA-Calcasieu': '22019',
 'LA-Cameron': '22023',
 'LA-Claiborne': '22027',
 'LA-De Soto': '22031',
 'LA-East Baton Rouge': '22033',
 'LA-La Salle': '22059',
 'LA-Lafourche': '22057',
 'LA-Lincoln': '22061',
 'LA-Morehouse': '22067',
 'LA-Bienville': '22013',
 'LA-Beauregard': '22011',
 'LA-Red River': '22081',
 'LA-Cameron': '22023',
 'LA-Caldwell': '22021',
 'LA-Calcasieu': '22019',
 'LA-Concordia': '22029',
 'LA-Caldwell': '22021',
 'LA-Caddo': '22017',
 'LA-Bossier': '22015',
 'LA-Bienville': '22013',
 'LA-Sabine': '22085',
 'LA-Rapides': '22079',
 'LA-Plaquemines': '22075',
 'LA-Ouachita': '22073',
 'LA-Avoyelles': '22009',
 'LA-Beauregard': '22011',
 'LA-Bienville': '22013',
 'LA-Bossier': '22015',
 'LA-Caddo': '22017',
 'LA-Calcasieu': '22019',
 'LA-Caldwell': '22021',
 'LA-Cameron': '22023',
 'LA-Claiborne': '22027',
 'LA-Concordia': '22029',
 'LA-De Soto': '22031',
 'LA-East Baton Rouge': '22033',
 'LA-Grant': '22043',
 'LA-Iberville': '22047',
 'LA-Jackson': '22049',
 'LA-Jefferson': '22051',
 'LA-La Salle': '22059',
 'LA-Lafourche': '22057',
 'LA-Lincoln': '22061',
 'LA-Morehouse': '22067',
 'LA-Natchitoches': '22069',
 'LA-Ouachita': '22073',
 'MD-Garrett': '24023',
 'MD-Garrett': '24023',
 'MD-Garrett': '24023',
 'MI-Jackson': '26075',
 'MI-Alcona': '26001',
 'MI-Allegan': '26005',
 'MI-Clare': '26035',
 'MI-Crawford': '26039',
 'MI-Grand Traverse': '26055',
 'MI-Kalkaska': '26079',
 'MI-Montmorency': '26119',
 'MI-Oscoda': '26135',
 'MI-Otsego': '26137',
 'MI-Roscommon': '26143',
 'MI-Lake': '26085',
 'MI-Calhoun': '26025',
 'MI-Antrim': '26009',
 'MI-Newaygo': '26123',
 'MI-Alcona': '26001',
 'MI-Allegan': '26005',
 'MI-Clare': '26035',
 'MI-Crawford': '26039',
 'MI-Grand Traverse': '26055',
 'MI-Kalkaska': '26079',
 'MI-Lake': '26085',
 'MI-Montmorency': '26119',
 'MI-Oscoda': '26135',
 'MI-Otsego': '26137',
 'MI-Roscommon': '26143',
 'MI-Calhoun': '26025',
 'MI-Antrim': '26009',
 'MI-Jackson': '26075',
 'MI-Newaygo': '26123',
 'MI-Alcona': '26001',
 'MI-Allegan': '26005',
 'MI-Baraga': '26013',
 'MI-Clare': '26035',
 'MI-Crawford': '26039',
 'MI-Grand Trvse': '26055',
 'MI-Houghton': '26061',
 'MI-Kalkaska': '26079',
 'MI-Manistee': '26101',
 'MI-Mason': '26105',
 'MI-Montmorency': '26119',
 'MI-Newaygo': '26123',
 'MI-Oceana': '26127',
 'MI-Ogemaw': '26129',
 'MI-Osceola': '26133',
 'MI-Oscoda': '26135',
 'MI-Otsego': '26137',
 'MI-Presque Isle': '26141',
 'MI-Roscommon': '26143',
 'MI-Lake': '26085',
 'MI-Antrim': '26009',
 'MI-Grand Traverse': '26055',
 'MI-Wexford': '26165',
 'MI-Calhoun': '26025',
 'MI-Muskegon': '26121',
 'MI-Missaukee': '26113',
 'MI-Jackson': '26075',
 'MI-Alcona': '26001',
 'MI-Allegan': '26005',
 'MI-Baraga': '26013',
 'MI-Clare': '26035',
 'MI-Crawford': '26039',
 'MI-Grand Traverse': '26055',
 'MI-Houghton': '26061',
 'MI-Kalkaska': '26079',
 'MI-Manistee': '26101',
 'MI-Mason': '26105',
 'MI-Montmorency': '26119',
 'MI-Newaygo': '26123',
 'MI-Oceana': '26127',
 'MI-Ogemaw': '26129',
 'MI-Osceola': '26133',
 'MI-Oscoda': '26135',
 'MI-Otsego': '26137',
 'MI-Presque Isle': '26141',
 'MI-Roscommon': '26143',
 'MI-Antrim': '26009',
 'MI-Lake': '26085',
 'MI-Wexford': '26165',
 'MI-Calhoun': '26025',
 'MI-Muskegon': '26121',
 'MI-Missaukee': '26113',
 'MI-Jackson': '26075',
 'MI-Alcona': '26001',
 'MI-Allegan': '26005',
 'MI-Antrim': '26009',
 'MI-Calhoun': '26025',
 'MI-Clare': '26035',
 'MI-Crawford': '26039',
 'MI-Grand Traverse': '26055',
 'MI-Jackson': '26075',
 'MI-Kalkaska': '26079',
 'MI-Lake': '26085',
 'MI-Manistee': '26101',
 'MI-Mason': '26105',
 'MI-Montmorency': '26119',
 'MI-Muskegon': '26121',
 'MI-Newaygo': '26123',
 'MI-Oceana': '26127',
 'MI-Ogemaw': '26129',
 'MI-Oscoda': '26135',
 'MI-Otsego': '26137',
 'MI-Roscommon': '26143',
 'MI-Wexford': '26165',
 'MI-Alcona': '26001',
 'MI-Allegan': '26005',
 'MI-Clare': '26035',
 'MI-Crawford': '26039',
 'MI-Grand Traverse': '26055',
 'MI-Kalkaska': '26079',
 'MI-Lake': '26085',
 'MI-Montmorency': '26119',
 'MI-Oscoda': '26135',
 'MI-Otsego': '26137',
 'MI-Roscommon': '26143',
 'MI-Calhoun': '26025',
 'MI-Antrim': '26009',
 'MI-Jackson': '26075',
 'MI-Newaygo': '26123',
 'MN-Blue Earth': '27013',
 'MN-Lake': '27063',
 'MN-St Louis': '27137',
 'MN-Kalkaska': '27079',
 'MN-Jackson': '27063',
 'MN-Le Sueur': '27079',
 'MN-Blue Earth': '27013',
 'MN-Lake': '27063',
 'MN-St Louis': '27137',
 'MN-Kalkaska': '26079',
 'MN-Lake': '27075',
 'MN-Otsego': '26137',
 'MN-Jackson': '26075',
 'MN-Le Sueur': '27079',
 'MN-Otsego': '27137',
 'MN-Otsego': '27137',
 'MN-Lake': '27075',
 'MN-Kalkaska': '27079',
 'MN-Jackson': '27063',
 'MO-Iron': '29093',
 'MO-Shannon': '29203',
 'MO-Washington': '29221',
 'MO-Crawford': '29055',
 'MO-Jackson': '29095',
 'MO-Madison': '29123',
 'MO-Washington': '29221',
 'MO-Dent': '29065',
 'MO-Iron': '29093',
 'MO-Crawford': '29055',
 'MO-Reynolds': '29179',
 'MO-Iron': '29093',
 'MO-Dent': '29065',
 'MO-Reynolds': '29179',
 'MO-Washington': '29221',
 'MO-Shannon': '29203',
 'MO-Shannon': '29203',
 'MO-St Charles': '29183',
 'MO-Shannon': '29203',
 'MO-Dent': '29065',
 'MO-Iron': '29093',
 'MO-Reynolds': '29179',
 'MO-Madison': '29123',
 'MO-Reynolds': '29179',
 'MO-Jackson': '29095',
 'MO-Washington': '29221',
 'MO-Shannon': '29203',
 'MO-Reynolds': '29179',
 'MO-Madison': '29123',
 'MO-Iron': '29093',
 'MO-St Charles': '29183',
 'MO-Dent': '29065',
 'MO-Crawford': '29055',
 'MO-Dent': '29065',
 'MO-Crawford': '29055',
 'MO-Dent': '29065',
 'MO-Iron': '29093',
 'MO-Reynolds': '29179',
 'MO-Shannon': '29203',
 'MO-Washington': '29221',
 'MO-Crawford': '29055',
 'MO-Washington': '29221',
 'MO-Crawford': '29055',
 'MS-Jasper': '28061',
 'MS-Hancock': '28045',
 'MS-Franklin': '28037',
 'MS-Forrest': '28035',
 'MS-Covington': '28031',
 'MS-Chickasaw': '28017',
 'MS-Adams': '28001',
 'MS-Smith': '28129',
 'MS-Jasper': '28061',
 'MS-Marion': '28091',
 'MS-Adams': '28001',
 'MS-Wilkinson': '28157',
 'MS-Chickasaw': '28017',
 'MS-Wayne': '28153',
 'MS-Stone': '28131',
 'MS-Yalobusha': '28161',
 'MS-Copiah': '28029',
 'MS-Tishomingo': '28141',
 'MS-Lawrence': '28077',
 'MS-Lamar': '28073',
 'MS-Jones': '28067',
 'MS-Jefferson Davis': '28065',
 'MS-Jasper': '28061',
 'MS-Jackson': '28059',
 'MS-Harrison': '28047',
 'MS-Grenada': '28043',
 'MS-Greene': '28041',
 'MS-George': '28039',
 'MS-Wilkinson': '28157',
 'MS-Wayne': '28153',
 'MS-Stone': '28131',
 'MS-Scott': '28123',
 'MS-Adams': '28001',
 'MS-Amite': '28005',
 'MS-Chickasaw': '28017',
 'MS-Choctaw': '28019',
 'MS-Clarke': '28023',
 'MS-Covington': '28031',
 'MS-Forrest': '28035',
 'MS-Franklin': '28037',
 'MS-George': '28039',
 'MS-Greene': '28041',
 'MS-Hancock': '28045',
 'MS-Harrison': '28047',
 'MS-Itawamba': '28057',
 'MS-Jackson': '28059',
 'MS-Jefferson': '28063',
 'MS-Jefferson Davis': '28065',
 'MS-Jones': '28067',
 'MS-Lamar': '28073',
 'MS-Lawrence': '28077',
 'MS-Lincoln': '28085',
 'MS-Lowndes': '28087',
 'MS-Madison': '28089',
 'MS-Monroe': '28095',
 'MS-Neshoba': '28099',
 'MS-Oktibbeha': '28105',
 'MS-Pearl River': '28109',
 'MS-Perry': '28111',
 'MS-Scott': '28123',
 'MS-Simpson': '28127',
 'MS-Smith': '28129',
 'MS-Stone': '28131',
 'MS-Madison': '28089',
 'MS-Wayne': '28153',
 'MS-Wilkinson': '28157',
 'MS-Winston': '28159',
 'MS-Wilkinson': '28157',
 'MS-Wayne': '28153',
 'MS-Stone': '28131',
 'MS-Scott': '28123',
 'MS-Perry': '28111',
 'MS-Pearl River': '28109',
 'MS-Monroe': '28095',
 'MS-Lowndes': '28087',
 'MS-Lawrence': '28077',
 'MS-Lamar': '28073',
 'MS-Jones': '28067',
 'MS-Jefferson Davis': '28065',
 'MS-Pearl River': '28109',
 'MS-Tate': '28137',
 'MS-Marion': '28091',
 'MS-Jasper': '28061',
 'MS-Perry': '28111',
 'MS-Copiah': '28029',
 'MS-Tate': '28137',
 'MS-Yalobusha': '28161',
 'MS-Scott': '28123',
 'MS-Perry': '28111',
 'MS-Pearl River': '28109',
 'MS-Monroe': '28095',
 'MS-Lowndes': '28087',
 'MS-Lawrence': '28077',
 'MS-Lamar': '28073',
 'MS-Jones': '28067',
 'MS-Jefferson Davis': '28065',
 'MS-Jasper': '28061',
 'MS-Hancock': '28045',
 'MS-Franklin': '28037',
 'MS-Forrest': '28035',
 'MS-Covington': '28031',
 'MS-Chickasaw': '28017',
 'MS-Adams': '28001',
 'MS-Lowndes': '28087',
 'MS-Covington': '28031',
 'MS-Smith': '28129',
 'MS-Lowndes': '28087',
 'MS-Lawrence': '28077',
 'MS-Lamar': '28073',
 'MS-Jones': '28067',
 'MS-Jefferson Davis': '28065',
 'MS-Jasper': '28061',
 'MS-Hancock': '28045',
 'MS-Franklin': '28037',
 'MS-Forrest': '28035',
 'MS-Claiborne': '28021',
 'MS-Grenada': '28043',
 'MS-Newton': '28101',
 'MS-Adams': '28001',
 'MS-Amite': '28005',
 'MS-Chickasaw': '28017',
 'MS-Claiborne': '28021',
 'MS-Sharkey': '28125',
 'MS-Clarke': '28023',
 'MS-Copiah': '28029',
 'MS-Covington': '28031',
 'MS-Forrest': '28035',
 'MS-Franklin': '28037',
 'MS-Tippah': '28139',
 'MS-Sharkey': '28125',
 'MS-Newton': '28101',
 'MS-Grenada': '28043',
 'MS-Claiborne': '28021',
 'MS-Winston': '28159',
 'MS-Wilkinson': '28157',
 'MS-Wayne': '28153',
 'MS-Tishomingo': '28141',
 'MS-Stone': '28131',
 'MS-Smith': '28129',
 'MS-Simpson': '28127',
 'MS-Scott': '28123',
 'MS-Perry': '28111',
 'MS-Pearl River': '28109',
 'MS-Oktibbeha': '28105',
 'MS-Neshoba': '28099',
 'MS-Monroe': '28095',
 'MS-Madison': '28089',
 'MS-Lowndes': '28087',
 'MS-Lincoln': '28085',
 'MS-Lawrence': '28077',
 'MS-Lamar': '28073',
 'MS-Jones': '28067',
 'MS-Jefferson Davis': '28065',
 'MS-Jefferson': '28063',
 'MS-Jackson': '28059',
 'MS-Itawamba': '28057',
 'MS-Harrison': '28047',
 'MS-Hancock': '28045',
 'MS-Greene': '28041',
 'MS-George': '28039',
 'MS-Franklin': '28037',
 'MS-Forrest': '28035',
 'MS-Covington': '28031',
 'MS-Clarke': '28023',
 'MS-Choctaw': '28019',
 'MS-Chickasaw': '28017',
 'MS-Amite': '28005',
 'MS-Adams': '28001',
 'MS-Monroe': '28095',
 'MS-Smith': '28129',
 'MS-Wilkinson': '28157',
 'MS-Wayne': '28153',
 'MS-Tippah': '28139',
 'MS-Stone': '28131',
 'MS-Smith': '28129',
 'MS-Simpson': '28127',
 'MS-Scott': '28123',
 'MS-Perry': '28111',
 'MS-Pearl River': '28109',
 'MS-Newton': '28101',
 'MT-Valley': '30105',
 'MT-Toole': '30101',
 'MT-Teton': '30099',
 'MT-Meagher': '30059',
 'MT-Park': '30067',
 'MT-Mccone': '30055',
 'MT-Powder River': '30075',
 'MT-Stillwater': '30095',
 'MT-Sheridan': '30091',
 'MT-Rosebud': '30087',
 'MT-Roosevelt': '30085',
 'MT-Richland': '30083',
 'MT-Prairie': '30079',
 'MT-Dawson': '30021',
 'MT-Hill': '30041',
 'MT-Fallon': '30025',
 'MT-Prairie': '30079',
 'MT-Wibaux': '30109',
 'MT-Rosebud': '30087',
 'MT-Fallon': '30025',
 'MT-Fergus': '30027',
 'MT-Garfield': '30033',
 'MT-Glacier': '30035',
 'MT-Treasure': '30103',
 'MT-Yellowstone': '30111',
 'MT-Wibaux': '30109',
 'MT-Wheatland': '30107',
 'MT-Musselshell': '30065',
 'MT-Liberty': '30051',
 'MT-Hill': '30041',
 'MT-Glacier': '30035',
 'MT-Liberty': '30051',
 'MT-Musselshell': '30065',
 'MT-Petroleum': '30069',
 'MT-McCone': '30055',
 'MT-Garfield': '30033',
 'MT-Fergus': '30027',
 'MT-Valley': '30105',
 'MT-Treasure': '30103',
 'MT-Toole': '30101',
 'MT-Teton': '30099',
 'MT-Sweet Grass': '30097',
 'MT-Stillwater': '30095',
 'MT-Fallon': '30025',
 'MT-Dawson': '30021',
 'MT-Custer': '30017',
 'MT-Chouteau': '30015',
 'MT-Flathead': '30029',
 'MT-Fergus': '30027',
 'MT-Fallon': '30025',
 'MT-Roosevelt': '30085',
 'MT-Sheridan': '30091',
 'MT-Carter': '30011',
 'MT-Carbon': '30009',
 'MT-Rosebud': '30087',
 'MT-Roosevelt': '30085',
 'MT-Valley': '30105',
 'MT-Toole': '30101',
 'MT-Dawson': '30021',
 'MT-Park': '30067',
 'MT-Richland': '30083',
 'MT-Prairie': '30079',
 'MT-Treasure': '30103',
 'MT-Phillips': '30071',
 'MT-Daniels': '30019',
 'MT-Yellowstone': '30111',
 'MT-Wibaux': '30109',
 'MT-Wheatland': '30107',
 'MT-Valley': '30105',
 'MT-Treasure': '30103',
 'MT-Toole': '30101',
 'MT-Teton': '30099',
 'MT-Sweet Grass': '30097',
 'MT-Stillwater': '30095',
 'MT-Sheridan': '30091',
 'MT-Rosebud': '30087',
 'MT-Roosevelt': '30085',
 'MT-Richland': '30083',
 'MT-Prairie': '30079',
 'MT-Powder River': '30075',
 'MT-Pondera': '30073',
 'MT-Phillips': '30071',
 'MT-Petroleum': '30069',
 'MT-Musselshell': '30065',
 'MT-Meagher': '30059',
 'MT-Mccone': '30055',
 'MT-Liberty': '30051',
 'MT-Lew And Clar': '30049',
 'MT-Hill': '30041',
 'MT-Glacier': '30035',
 'MT-Garfield': '30033',
 'MT-Flathead': '30029',
 'MT-Fergus': '30027',
 'MT-Fallon': '30025',
 'MT-Dawson': '30021',
 'MT-Daniels': '30019',
 'MT-Custer': '30017',
 'MT-Chouteau': '30015',
 'MT-Cascade': '30013',
 'MT-Carter': '30011',
 'MT-Carbon': '30009',
 'MT-Broadwater': '30007',
 'MT-Blaine': '30005',
 'MT-Big Horn': '30003',
 'MT-Beaverhead': '30001',
 'MT-Phillips': '30071',
 'MT-Powder River': '30075',
 'MT-Pondera': '30073',
 'MT-Phillips': '30071',
 'MT-Petroleum': '30069',
 'MT-Musselshell': '30065',
 'MT-Blaine': '30005',
 'MT-Carbon': '30009',
 'MT-McCone': '30055',
 'MT-Madison': '30057',
 'MT-Liberty': '30051',
 'MT-Hill': '30041',
 'MT-Granite': '30039',
 'MT-Golden Valley': '30037',
 'MT-Glacier': '30035',
 'MT-Garfield': '30033',
 'MT-Gallatin': '30031',
 'MT-Fergus': '30027',
 'MT-Fallon': '30025',
 'MT-Dawson': '30021',
 'MT-Daniels': '30019',
 'MT-Liberty': '30051',
 'MT-Lew And Clar': '30049',
 'MT-Hill': '30041',
 'MT-Glacier': '30035',
 'MT-Garfield': '30033',
 'MT-Wibaux': '30109',
 'MT-Prairie': '30079',
 'MT-Fallon': '30025',
 'MT-Dawson': '30021',
 'MT-Custer': '30017',
 'MT-Chouteau': '30015',
 'MT-Carter': '30011',
 'MT-Carbon': '30009',
 'MT-Blaine': '30005',
 'MT-Custer': '30017',
 'MT-Chouteau': '30015',
 'MT-Cascade': '30013',
 'MT-Carter': '30011',
 'MT-Carbon': '30009',
 'MT-Broadwater': '30007',
 'MT-Blaine': '30005',
 'MT-Big Horn': '30003',
 'MT-Yellowstone': '30111',
 'MT-Richland': '30083',
 'MT-Roosevelt': '30085',
 'MT-Richland': '30083',
 'MT-Wibaux': '30109',
 'MT-Prairie': '30079',
 'MT-Prairie': '30079',
 'MT-Powder River': '30075',
 'MT-Madison': '30057',
 'MT-Gallatin': '30031',
 'MT-Golden Valley': '30037',
 'MT-Stillwater': '30095',
 'MT-Wibaux': '30109',
 'MT-Phillips': '30071',
 'MT-Pondera': '30073',
 'MT-Phillips': '30071',
 'MT-Golden Valley': '30037',
 'MT-Powder River': '30075',
 'MT-Pondera': '30073',
 'MT-Phillips': '30071',
 'MT-Granite': '30039',
 'MT-Big Horn': '30003',
 'MT-Sheridan': '30091',
 'MT-Petroleum': '30069',
 'MT-Beaverhead': '30001',
 'MT-Big Horn': '30003',
 'MT-Petroleum': '30069',
 'MT-Yellowstone': '30111',
 'MT-Liberty': '30051',
 'MT-Glacier': '30035',
 'MT-Yellowstone': '30111',
 'MT-Wibaux': '30109',
 'MT-Phillips': '30071',
 'MT-Musselshell': '30065',
 'MT-Valley': '30105',
 'MT-Toole': '30101',
 'MT-Valley': '30105',
 'MT-Dawson': '30021',
 'MT-Fallon': '30025',
 'MT-Fergus': '30027',
 'MT-Toole': '30101',
 'MT-Gallatin': '30031',
 'MT-Stillwater': '30095',
 'MT-Liberty': '30051',
 'MT-Meagher': '30059',
 'MT-Sweet Grass': '30097',
 'MT-Park': '30067',
 'MT-Stillwater': '30095',
 'MT-Sheridan': '30091',
 'MT-Glacier': '30035',
 'MT-Sheridan': '30091',
 'MT-Garfield': '30033',
 'MT-Glacier': '30035',
 'MT-Hill': '30041',
 'MT-Liberty': '30051',
 'MT-Treasure': '30103',
 'MT-Musselshell': '30065',
 'MT-Petroleum': '30069',
 'MT-Stillwater': '30095',
 'MT-Rosebud': '30087',
 'MT-Big Horn': '30003',
 'MT-Stillwater': '30095',
 'MT-Custer': '30017',
 'MT-Granite': '30039',
 'MT-Phillips': '30071',
 'MT-Treasure': '30103',
 'MT-Blaine': '30005',
 'MT-Rosebud': '30087',
 'MT-Wibaux': '30109',
 'MT-Prairie': '30079',
 'MT-Fallon': '30025',
 'MT-Dawson': '30021',
 'MT-Roosevelt': '30085',
 'MT-Pondera': '30073',
 'MT-Richland': '30083',
 'MT-Prairie': '30079',
 'MT-Glacier': '30035',
 'MT-Chouteau': '30015',
 'MT-Madison': '30057',
 'MT-Liberty': '30051',
 'MT-Powder River': '30075',
 'MT-Yellowstone': '30111',
 'MT-Stillwater': '30095',
 'MT-Wibaux': '30109',
 'MT-Big Horn': '30003',
 'MT-Blaine': '30005',
 'MT-Carbon': '30009',
 'MT-Carter': '30011',
 'MT-Chouteau': '30015',
 'MT-Carter': '30011',
 'MT-Custer': '30017',
 'MT-Wheatland': '30107',
 'MT-Pondera': '30073',
 'MT-Beaverhead': '30001',
 'MT-Dawson': '30021',
 'NC-Clay': '37043',
 'NC-Clay': '37043',
 'NC-Jefferson': '37043',
 'NC-Jefferson': '37043',
 'NC-Jefferson': '30043',
 'ND-Billings': '38007',
 'ND-Ward': '38101',
 'ND-Mchenry': '38049',
 'ND-Williams': '38105',
 'ND-Stark': '38089',
 'ND-Slope': '38087',
 'ND-Renville': '38075',
 'ND-Oliver': '38065',
 'ND-Mountrail': '38061',
 'ND-Mercer': '38057',
 'ND-McLean': '38055',
 'ND-McKenzie': '38053',
 'ND-Golden Valley': '38033',
 'ND-Dunn': '38025',
 'ND-Burke': '38013',
 'ND-Bowman': '38011',
 'ND-Bottineau': '38009',
 'ND-Billings': '38007',
 'ND-Wells': '38103',
 'ND-Divide': '38023',
 'ND-Mchenry': '38049',
 'ND-Billings': '38007',
 'ND-Bottineau': '38009',
 'ND-Bowman': '38011',
 'ND-Burke': '38013',
 'ND-Divide': '38023',
 'ND-Dunn': '38025',
 'ND-Golden Valley': '38033',
 'ND-McKenzie': '38053',
 'ND-McLean': '38055',
 'ND-Mercer': '38057',
 'ND-Mountrail': '38061',
 'ND-Oliver': '38065',
 'ND-Renville': '38075',
 'ND-Slope': '38087',
 'ND-Foster': '38031',
 'ND-Stark': '38089',
 'ND-Williams': '38105',
 'ND-Bowman': '38011',
 'ND-Williams': '38105',
 'ND-Ward': '38101',
 'ND-Stutsman': '38093',
 'ND-Stark': '38089',
 'ND-McKenzie': '38053',
 'ND-McLean': '38055',
 'ND-Slope': '38087',
 'ND-Renville': '38075',
 'ND-Oliver': '38065',
 'ND-Mountrail': '38061',
 'ND-Mercer': '38057',
 'ND-Mclean': '38055',
 'ND-Mckenzie': '38053',
 'ND-Golden Valley': '38033',
 'ND-Dunn': '38025',
 'ND-Divide': '38023',
 'ND-Burleigh': '38015',
 'ND-Burke': '38013',
 'ND-Bowman': '38011',
 'ND-Bottineau': '38009',
 'ND-Billings': '38007',
 'ND-Williams': '38105',
 'ND-Ward': '38101',
 'ND-Stark': '38089',
 'ND-Slope': '38087',
 'ND-Renville': '38075',
 'ND-Oliver': '38065',
 'ND-Mountrail': '38061',
 'ND-Mercer': '38057',
 'ND-McLean': '38055',
 'ND-McKenzie': '38053',
 'ND-Golden Valley': '38033',
 'ND-Dunn': '38025',
 'ND-Divide': '38023',
 'ND-Burke': '38013',
 'ND-Bowman': '38011',
 'ND-Bottineau': '38009',
 'ND-Billings': '38007',
 'ND-Divide': '38023',
 'ND-Bowman': '38011',
 'ND-Bottineau': '38009',
 'ND-Bowman': '38011',
 'ND-Burke': '38013',
 'ND-Burleigh': '38015',
 'ND-Divide': '38023',
 'ND-Dunn': '38025',
 'ND-Golden Valley': '38033',
 'ND-Mckenzie': '38053',
 'ND-Mclean': '38055',
 'ND-Mercer': '38057',
 'ND-Mountrail': '38061',
 'ND-Oliver': '38065',
 'ND-Renville': '38075',
 'ND-Slope': '38087',
 'ND-Stark': '38089',
 'ND-Stutsman': '38093',
 'ND-Wells': '38103',
 'ND-Williams': '38105',
 'ND-Bowman': '38011',
 'ND-Billings': '38007',
 'ND-Bottineau': '38009',
 'ND-Bowman': '38011',
 'ND-Burke': '38013',
 'ND-Dunn': '38025',
 'ND-Golden Valley': '38033',
 'ND-McKenzie': '38053',
 'ND-McLean': '38055',
 'ND-Mercer': '38057',
 'ND-Mountrail': '38061',
 'ND-Oliver': '38065',
 'ND-Renville': '38075',
 'ND-Slope': '38087',
 'ND-Stark': '38089',
 'ND-Williams': '38105',
 'NE-Kimball': '31105',
 'NE-Deuel': '31049',
 'NE-Dundy': '31057',
 'NE-Harlan': '31083',
 'NE-Morrill': '31123',
 'NE-Harlan': '31083',
 'NE-Red Willow': '31145',
 'NE-Scotts Bluff': '31157',
 'NE-Red Willow': '31145',
 'NE-Cheyenne': '31033',
 'NE-Dundy': '31057',
 'NE-Hitchcock': '31087',
 'NE-Kimball': '31105',
 'NE-Morrill': '31123',
 'NE-Red Willow': '31145',
 'NE-Scotts Bluff': '31157',
 'NE-Sioux': '31165',
 'NE-Hitchcock': '31087',
 'NE-Kimball': '31105',
 'NE-Banner': '31007',
 'NE-Cheyenne': '31033',
 'NE-Deuel': '31049',
 'NE-Dundy': '31057',
 'NE-Red Willow': '31145',
 'NE-Harlan': '31083',
 'NE-Kimball': '31105',
 'NE-Cheyenne': '31033',
 'NE-Deuel': '31049',
 'NE-Hitchcock': '31087',
 'NE-Dundy': '31057',
 'NE-Hayes': '31085',
 'NE-Hitchcock': '31087',
 'NE-Kimball': '31105',
 'NE-Sioux': '31165',
 'NE-Dundy': '31057',
 'NE-Cheyenne': '31033',
 'NE-Harlan': '31083',
 'NE-Hitchcock': '31087',
 'NE-Hayes': '31085',
 'NE-Banner': '31007',
 'NE-Harlan': '31083',
 'NE-Cheyenne': '31033',
 'NE-Cheyenne': '31033',
 'NE-Dundy': '31057',
 'NE-Hitchcock': '31087',
 'NE-Sioux': '31165',
 'NE-Hayes': '31085',
 'NE-Kimball': '31105',
 'NE-Red Willow': '31145',
 'NM-Guadalupe': '35019',
 'NM-Harding': '35021',
 'NM-Hidalgo': '35023',
 'NM-Lea': '35025',
 'NM-Hidalgo': '35023',
 'NM-Lincoln': '35027',
 'NM-Luna': '35029',
 'NM-Mckinley': '35031',
 'NM-Rio Arriba': '35039',
 'NM-Otero': '35035',
 'NM-Quay': '35037',
 'NM-Rio Arriba': '35039',
 'NM-Roosevelt': '35041',
 'NM-San Juan': '35045',
 'NM-San Miguel': '35047',
 'NM-Sandoval': '35043',
 'NM-Socorro': '35053',
 'NM-Roosevelt': '35041',
 'NM-Chaves': '35005',
 'NM-Eddy': '35015',
 'NM-Lea': '35025',
 'NM-Rio Arriba': '35039',
 'NM-San Juan': '35045',
 'NM-San Juan': '35045',
 'NM-Sandoval': '35043',
 'NM-Socorro': '35053',
 'NM-Union': '35059',
 'NM-Quay': '35037',
 'NM-Taos': '35055',
 'NM-Colfax': '35007',
 'NM-Union': '35059',
 'NM-Bernalillo': '35001',
 'NM-Valencia': '35061',
 'NM-Bernalillo': '35001',
 'NM-Grant': '35017',
 'NM-Hidalgo': '35023',
 'NM-Otero': '35035',
 'NM-Sandoval': '35043',
 'NM-Colfax': '35007',
 'NM-Colfax': '35007',
 'NM-Union': '35059',
 'NM-Sandoval': '35043',
 'NM-San Juan': '35045',
 'NM-Roosevelt': '35041',
 'NM-Rio Arriba': '35039',
 'NM-Quay': '35037',
 'NM-McKinley': '35031',
 'NM-Lea': '35025',
 'NM-Harding': '35021',
 'NM-Eddy': '35015',
 'NM-Dona Ana': '35013',
 'NM-Chaves': '35005',
 'NM-Torrance': '35057',
 'NM-Curry': '35009',
 'NM-Sandoval': '35043',
 'NM-Otero': '35035',
 'NM-Chaves': '35005',
 'NM-Eddy': '35015',
 'NM-Harding': '35021',
 'NM-Lea': '35025',
 'NM-McKinley': '35031',
 'NM-Quay': '35037',
 'NM-Rio Arriba': '35039',
 'NM-Roosevelt': '35041',
 'NM-San Juan': '35045',
 'NM-Sandoval': '35043',
 'NM-Union': '35059',
 'NM-Cibola': '35006',
 'NM-Curry': '35009',
 'NM-Torrance': '35057',
 'NM-Colfax': '35007',
 'NM-Chaves': '35005',
 'NM-Eddy': '35015',
 'NM-Lea': '35025',
 'NM-Rio Arriba': '35039',
 'NM-San Juan': '35045',
 'NM-Bernalillo': '35001',
 'NM-Colfax': '35007',
 'NM-Dona Ana': '35013',
 'NM-Hidalgo': '35023',
 'NM-Otero': '35035',
 'NM-Sandoval': '35043',
 'NM-Bernalillo': '35001',
 'NM-Chaves': '35005',
 'NM-Colfax': '35007',
 'NM-McKinley': '35031',
 'NM-Curry': '35009',
 'NM-Dona Ana': '35013',
 'NM-Eddy': '35015',
 'NM-San Juan': '35045',
 'NM-Grant': '35017',
 'NM-Dona Ana': '35013',
 'NM-Union': '35059',
 'NM-Rio Arriba': '35039',
 'NM-Sandoval': '35043',
 'NM-Roosevelt': '35041',
 'NM-Chaves': '35005',
 'NM-Eddy': '35015',
 'NM-Harding': '35021',
 'NM-Lea': '35025',
 'NM-McKinley': '35031',
 'NM-Bernalillo': '35001',
 'NM-Catron': '35003',
 'NM-Chaves': '35005',
 'NM-De Baca': '35011',
 'NM-Dona Ana': '35013',
 'NM-Eddy': '35015',
 'NM-Guadalupe': '35019',
 'NM-Harding': '35021',
 'NM-Hidalgo': '35023',
 'NM-Lea': '35025',
 'NM-Luna': '35029',
 'NM-Mckinley': '35031',
 'NM-Otero': '35035',
 'NM-Quay': '35037',
 'NM-Rio Arriba': '35039',
 'NM-Roosevelt': '35041',
 'NM-San Juan': '35045',
 'NM-San Miguel': '35047',
 'NM-Sandoval': '35043',
 'NM-Socorro': '35053',
 'NM-Taos': '35055',
 'NM-Union': '35059',
 'NM-Valencia': '35061',
 'NM-San Juan': '35045',
 'NM-Rio Arriba': '35039',
 'NM-Lea': '35025',
 'NM-Eddy': '35015',
 'NM-Chaves': '35005',
 'NM-Guadalupe': '35019',
 'NM-Harding': '35021',
 'NM-Hidalgo': '35023',
 'NM-Lea': '35025',
 'NM-McKinley': '35031',
 'NM-Otero': '35035',
 'NM-Quay': '35037',
 'NM-Bernalillo': '35001',
 'NM-Catron': '35003',
 'NM-Chaves': '35005',
 'NM-Cibola': '35006',
 'NM-De Baca': '35011',
 'NM-Dona Ana': '35013',
 'NM-Eddy': '35015',
 'NV-Eureka': '32011',
 'NV-Lyon': '32019',
 'NV-White Pine': '32033',
 'NV-Washoe': '32031',
 'NV-Pershing': '32027',
 'NV-Nye': '32023',
 'NV-Mineral': '32021',
 'NV-Lincoln': '32017',
 'NV-Lander': '32015',
 'NV-Humboldt': '32013',
 'NV-Eureka': '32011',
 'NV-Esmeralda': '32009',
 'NV-Elko': '32007',
 'NV-Clark': '32003',
 'NV-Churchill': '32001',
 'NV-Elko': '32007',
 'NV-Mineral': '32021',
 'NV-Lyon': '32019',
 'NV-Esmeralda': '32009',
 'NV-Pershing': '32027',
 'NV-Humboldt': '32013',
 'NV-Humboldt': '32013',
 'NV-Churchill': '32001',
 'NV-Clark': '32003',
 'NV-Elko': '32007',
 'NV-Esmeralda': '32009',
 'NV-Eureka': '32011',
 'NV-Humboldt': '32013',
 'NV-Lander': '32015',
 'NV-Lincoln': '32017',
 'NV-Mineral': '32021',
 'NV-Nye': '32023',
 'NV-Pershing': '32027',
 'NV-Washoe': '32031',
 'NV-White Pine': '32033',
 'NV-Lyon': '32019',
 'NV-Pershing': '32027',
 'NV-Washoe': '32031',
 'NV-Nye': '32023',
 'NV-Lander': '32015',
 'NV-Clark': '32003',
 'NV-Churchill': '32001',
 'NV-Elko': '32007',
 'NV-Mineral': '32021',
 'NV-Lyon': '32019',
 'NV-Esmeralda': '32009',
 'NV-Pershing': '32027',
 'NV-Humboldt': '32013',
 'NV-Esmeralda': '32009',
 'NV-Lyon': '32019',
 'NV-Mineral': '32021',
 'NV-Churchill': '32001',
 'NV-Elko': '32007',
 'NV-Esmeralda': '32009',
 'NV-Eureka': '32011',
 'NV-Humboldt': '32013',
 'NV-Lander': '32015',
 'NV-Lincoln': '32017',
 'NV-Lyon': '32019',
 'NV-Mineral': '32021',
 'NV-Nye': '32023',
 'NV-Pershing': '32027',
 'NV-Washoe': '32031',
 'NV-White Pine': '32033',
 'NV-Washoe': '32031',
 'NV-Nye': '32023',
 'NV-Lander': '32015',
 'NV-Eureka': '32011',
 'NV-Clark': '32003',
 'NV-Churchill': '32001',
 'NV-Elko': '32007',
 'NV-Churchill': '32001',
 'NV-Clark': '32003',
 'NV-Eureka': '32011',
 'NV-Lander': '32015',
 'NV-Nye': '32023',
 'NV-Washoe': '32031',
 'NY-Chautauqua': '36013',
 'NY-Seneca': '36099',
 'NY-Steuben': '36101',
 'NY-Steuben': '36101',
 'NY-Seneca': '36099',
 'NY-Steuben': '36101',
 'NY-Chautauqua': '36013',
 'NY-Steuben': '36101',
 'NY-Seneca': '36099',
 'NY-Chautauqua': '36013',
 'NY-Chautauqua': '36013',
 'NY-Seneca': '36099',
 'NY-Chemung': '36015',
 'NY-Chemung': '36015',
 'NY-Chautauqua': '36013',
 'NY-Steuben': '36101',
 'NY-Seneca': '36099',
 'NY-Chemung': '36015',
 'NY-Seneca': '36099',
 'NY-Steuben': '36101',
 'NY-Chemung': '36015',
 'NY-Chemung': '36015',
 'NY-Chemung': '36015',
 'NY-Chautauqua': '36013',
 'OH-Trumbull': '39155',
 'OH-Mahoning': '39099',
 'OH-Monroe': '39111',
 'OH-Muskingum': '39119',
 'OH-Perry': '39127',
 'OH-Portage': '39133',
 'OH-Athens': '39009',
 'OH-Ross': '39141',
 'OH-Stark': '39151',
 'OH-Trumbull': '39155',
 'OH-Tuscarawas': '39157',
 'OH-Muskingum': '39119',
 'OH-Monroe': '39111',
 'OH-Washington': '39167',
 'OH-Washington': '39167',
 'OH-Vinton': '39163',
 'OH-Washington': '39167',
 'OH-Mahoning': '39099',
 'OH-Licking': '39089',
 'OH-Lawrence': '39087',
 'OH-Hocking': '39073',
 'OH-Athens': '39009',
 'OH-Vinton': '39163',
 'OH-Washington': '39167',
 'OH-Trumbull': '39155',
 'OH-Stark': '39151',
 'OH-Portage': '39133',
 'OH-Perry': '39127',
 'OH-Muskingum': '39119',
 'OH-Monroe': '39111',
 'OH-Mahoning': '39099',
 'OH-Licking': '39089',
 'OH-Lawrence': '39087',
 'OH-Hocking': '39073',
 'OH-Athens': '39009',
 'OH-Trumbull': '39155',
 'OH-Noble': '39121',
 'OH-Stark': '39151',
 'OH-Ross': '39141',
 'OH-Gallia': '39053',
 'OH-Noble': '39121',
 'OH-Lawrence': '39087',
 'OH-Athens': '39009',
 'OH-Hocking': '39073',
 'OH-Licking': '39089',
 'OH-Mahoning': '39099',
 'OH-Monroe': '39111',
 'OH-Muskingum': '39119',
 'OH-Perry': '39127',
 'OH-Portage': '39133',
 'OH-Ross': '39141',
 'OH-Stark': '39151',
 'OH-Trumbull': '39155',
 'OH-Tuscarawas': '39157',
 'OH-Vinton': '39163',
 'OH-Washington': '39167',
 'OH-Gallia': '39053',
 'OH-Portage': '39133',
 'OH-Perry': '39127',
 'OH-Muskingum': '39119',
 'OH-Athens': '39009',
 'OH-Monroe': '39111',
 'OH-Hocking': '39073',
 'OH-Athens': '39009',
 'OH-Mahoning': '39099',
 'OH-Hocking': '39073',
 'OH-Lawrence': '39087',
 'OH-Licking': '39089',
 'OH-Washington': '39167',
 'OH-Trumbull': '39155',
 'OH-Stark': '39151',
 'OH-Lawrence': '39087',
 'OH-Licking': '39089',
 'OH-Mahoning': '39099',
 'OH-Licking': '39089',
 'OH-Lawrence': '39087',
 'OH-Monroe': '39111',
 'OH-Hocking': '39073',
 'OH-Gallia': '39053',
 'OH-Muskingum': '39119',
 'OH-Perry': '39127',
 'OH-Portage': '39133',
 'OH-Portage': '39133',
 'OH-Perry': '39127',
 'OH-Stark': '39151',
 'OK-Sequoyah': '40135',
 'OK-Roger Mills': '40129',
 'OK-Pittsburg': '40121',
 'OK-Payne': '40119',
 'OK-Oklahoma': '40109',
 'OK-McIntosh': '40091',
 'OK-Major': '40093',
 'OK-Logan': '40083',
 'OK-Lincoln': '40081',
 'OK-Le Flore': '40079',
 'OK-Latimer': '40077',
 'OK-Kingfisher': '40073',
 'OK-Hughes': '40063',
 'OK-Haskell': '40061',
 'OK-Harper': '40059',
 'OK-Greer': '40055',
 'OK-Grady': '40051',
 'OK-Garvin': '40049',
 'OK-Garfield': '40047',
 'OK-Ellis': '40045',
 'OK-Dewey': '40043',
 'OK-Custer': '40039',
 'OK-Creek': '40037',
 'OK-Comanche': '40031',
 'OK-Coal': '40029',
 'OK-Canadian': '40017',
 'OK-Caddo': '40015',
 'OK-Blaine': '40011',
 'OK-Beckham': '40009',
 'OK-Beaver': '40007',
 'OK-Alfalfa': '40003',
 'OK-Custer': '40039',
 'OK-Creek': '40037',
 'OK-Cherokee': '40021',
 'OK-Harmon': '40057',
 'OK-Atoka': '40005',
 'OK-Comanche': '40031',
 'OK-Muskogee': '40101',
 'OK-Alfalfa': '40003',
 'OK-Beaver': '40007',
 'OK-Beckham': '40009',
 'OK-Blaine': '40011',
 'OK-Bryan': '40013',
 'OK-Caddo': '40015',
 'OK-Coal': '40029',
 'OK-Cimarron': '40025',
 'OK-Carter': '40019',
 'OK-Canadian': '40017',
 'OK-Kay': '40071',
 'OK-Wagoner': '40145',
 'OK-Woodward': '40153',
 'OK-Woods': '40151',
 'OK-Washita': '40149',
 'OK-Tillman': '40141',
 'OK-Sequoyah': '40135',
 'OK-Harmon': '40057',
 'OK-Texas': '40139',
 'OK-Sequoyah': '40135',
 'OK-Roger Mills': '40129',
 'OK-Pittsburg': '40121',
 'OK-Payne': '40119',
 'OK-Oklahoma': '40109',
 'OK-McIntosh': '40091',
 'OK-Major': '40093',
 'OK-Texas': '40139',
 'OK-Latimer': '40077',
 'OK-Logan': '40083',
 'OK-Lincoln': '40081',
 'OK-Le Flore': '40079',
 'OK-Latimer': '40077',
 'OK-Kingfisher': '40073',
 'OK-Hughes': '40063',
 'OK-Haskell': '40061',
 'OK-Harper': '40059',
 'OK-Greer': '40055',
 'OK-Grady': '40051',
 'OK-Kiowa': '40075',
 'OK-Oklahoma': '40109',
 'OK-Hughes': '40063',
 'OK-Garvin': '40049',
 'OK-Noble': '40103',
 'OK-Murray': '40099',
 'OK-Garfield': '40047',
 'OK-Mcintosh': '40091',
 'OK-Ellis': '40045',
 'OK-Dewey': '40043',
 'OK-Custer': '40039',
 'OK-Creek': '40037',
 'OK-Comanche': '40031',
 'OK-Coal': '40029',
 'OK-Canadian': '40017',
 'OK-Caddo': '40015',
 'OK-Blaine': '40011',
 'OK-Beckham': '40009',
 'OK-Beaver': '40007',
 'OK-Alfalfa': '40003',
 'OK-Tillman': '40141',
 'OK-Tulsa': '40143',
 'OK-Washita': '40149',
 'OK-Woods': '40151',
 'OK-Woodward': '40153',
 'OK-Mccurtain': '40089',
 'OK-Mcclain': '40087',
 'OK-Woodward': '40153',
 'OK-Woods': '40151',
 'OK-Washita': '40149',
 'OK-Tulsa': '40143',
 'OK-Tillman': '40141',
 'OK-Texas': '40139',
 'OK-Sequoyah': '40135',
 'OK-Roger Mills': '40129',
 'OK-Pushmataha': '40127',
 'OK-Pottawatomie': '40125',
 'OK-Pittsburg': '40121',
 'OK-Payne': '40119',
 'OK-Oklahoma': '40109',
 'OK-Haskell': '40061',
 'OK-Harper': '40059',
 'OK-Greer': '40055',
 'OK-Kay': '40071',
 'OK-Noble': '40103',
 'OK-Murray': '40099',
 'OK-Mcintosh': '40091',
 'OK-Mccurtain': '40089',
 'OK-Mcclain': '40087',
 'OK-Grady': '40051',
 'OK-Grant': '40053',
 'OK-Garvin': '40049',
 'OK-Marshall': '40095',
 'OK-Atoka': '40005',
 'OK-Major': '40093',
 'OK-Logan': '40083',
 'OK-Garfield': '40047',
 'OK-Ellis': '40045',
 'OK-Lincoln': '40081',
 'OK-Le Flore': '40079',
 'OK-Latimer': '40077',
 'OK-Kiowa': '40075',
 'OK-McClain': '40087',
 'OK-Kingfisher': '40073',
 'OK-Jackson': '40065',
 'OK-Hughes': '40063',
 'OK-Marshall': '40095',
 'OK-Major': '40093',
 'OK-Haskell': '40061',
 'OK-Harper': '40059',
 'OK-Greer': '40055',
 'OK-Grady': '40051',
 'OK-Garvin': '40049',
 'OK-Garfield': '40047',
 'OK-Ellis': '40045',
 'OK-Dewey': '40043',
 'OK-Delaware': '40041',
 'OK-McClain': '40087',
 'OK-Major': '40093',
 'OK-Major': '40093',
 'OK-Pottawatomie': '40125',
 'OK-Pittsburg': '40121',
 'OK-Custer': '40039',
 'OK-Creek': '40037',
 'OK-Comanche': '40031',
 'OK-Payne': '40119',
 'OK-Coal': '40029',
 'OK-Cimarron': '40025',
 'OK-Carter': '40019',
 'OK-Canadian': '40017',
 'OK-Caddo': '40015',
 'OK-Bryan': '40013',
 'OK-Blaine': '40011',
 'OK-Atoka': '40005',
 'OK-Beckham': '40009',
 'OK-Beaver': '40007',
 'OK-Alfalfa': '40003',
 'OK-Atoka': '40005',
 'OK-Major': '40093',
 'OK-Woodward': '40153',
 'OK-Woods': '40151',
 'OK-Washita': '40149',
 'OK-Tillman': '40141',
 'OK-Texas': '40139',
 'OK-Sequoyah': '40135',
 'OK-McClain': '40087',
 'OK-Roger Mills': '40129',
 'OK-Pittsburg': '40121',
 'OK-Payne': '40119',
 'OK-Atoka': '40005',
 'OK-Roger Mills': '40129',
 'OK-Oklahoma': '40109',
 'OK-Kingfisher': '40073',
 'OK-McIntosh': '40091',
 'OK-Jackson': '40065',
 'OK-Major': '40093',
 'OK-Logan': '40083',
 'OK-Lincoln': '40081',
 'OK-Le Flore': '40079',
 'OK-McIntosh': '40091',
 'OK-McCurtain': '40089',
 'OK-McClain': '40087',
 'OK-Latimer': '40077',
 'OK-Stephens': '40137',
 'OK-Wagoner': '40145',
 'OK-Muskogee': '40101',
 'OK-Grant': '40053',
 'OK-Cherokee': '40021',
 'OK-Alfalfa': '40003',
 'OK-Atoka': '40005',
 'OK-Beaver': '40007',
 'OK-Beckham': '40009',
 'OK-Blaine': '40011',
 'OK-Caddo': '40015',
 'OK-Canadian': '40017',
 'OK-Cherokee': '40021',
 'OK-Cimarron': '40025',
 'OK-Coal': '40029',
 'OK-Comanche': '40031',
 'OK-Custer': '40039',
 'OK-Dewey': '40043',
 'OK-Ellis': '40045',
 'OK-Garfield': '40047',
 'OK-Garvin': '40049',
 'OK-Grady': '40051',
 'OK-Grant': '40053',
 'OK-Greer': '40055',
 'OK-Harper': '40059',
 'OK-Haskell': '40061',
 'OK-Hughes': '40063',
 'OK-Jackson': '40065',
 'OK-Kay': '40071',
 'OK-Kingfisher': '40073',
 'OK-Latimer': '40077',
 'OK-Le Flore': '40079',
 'OK-Lincoln': '40081',
 'OK-Major': '40093',
 'OK-McClain': '40087',
 'OK-McIntosh': '40091',
 'OK-Murray': '40099',
 'OK-Muskogee': '40101',
 'OK-Oklahoma': '40109',
 'OK-Payne': '40119',
 'OK-Pittsburg': '40121',
 'OK-Pottawatomie': '40125',
 'OK-Pushmataha': '40127',
 'OK-Roger Mills': '40129',
 'OK-Sequoyah': '40135',
 'OK-Texas': '40139',
 'OK-Tillman': '40141',
 'OK-Wagoner': '40145',
 'OK-Washita': '40149',
 'OK-Woods': '40151',
 'OK-Woodward': '40153',
 'OK-Logan': '40083',
 'OK-Lincoln': '40081',
 'OK-Grant': '40053',
 'OK-Kingfisher': '40073',
 'OK-Hughes': '40063',
 'OK-Haskell': '40061',
 'OK-Harper': '40059',
 'OK-Greer': '40055',
 'OK-Grady': '40051',
 'OK-Garvin': '40049',
 'OK-Garfield': '40047',
 'OK-Ellis': '40045',
 'OK-Dewey': '40043',
 'OK-Custer': '40039',
 'OK-Creek': '40037',
 'OK-Comanche': '40031',
 'OK-Coal': '40029',
 'OK-Canadian': '40017',
 'OK-Caddo': '40015',
 'OK-Blaine': '40011',
 'OK-Beckham': '40009',
 'OK-Beaver': '40007',
 'OK-Alfalfa': '40003',
 'OK-Creek': '40037',
 'OK-Noble': '40103',
 'OK-Dewey': '40043',
 'OK-Delaware': '40041',
 'OK-Le Flore': '40079',
 'OK-Logan': '40083',
 'OK-McCurtain': '40089',
 'OK-Pushmataha': '40127',
 'OK-Woodward': '40153',
 'OK-Woods': '40151',
 'OK-Washita': '40149',
 'OK-Tillman': '40141',
 'OK-Texas': '40139',
 'OR-Deschutes': '41017',
 'OR-Columbia': '41009',
 'OR-Wasco': '41065',
 'OR-Gilliam': '41021',
 'OR-Malheur': '41045',
 'OR-Wasco': '41065',
 'OR-Columbia': '41009',
 'OR-Deschutes': '41017',
 'OR-Jefferson': '41031',
 'OR-Wheeler': '41069',
 'OR-Sherman': '41055',
 'OR-Gilliam': '41021',
 'OR-Wheeler': '41069',
 'OR-Lake': '41037',
 'OR-Hood River': '41027',
 'OR-Hood River': '41027',
 'OR-Jefferson': '41031',
 'OR-Lake': '41037',
 'OR-Morrow': '41049',
 'OR-Malheur': '41045',
 'OR-Morrow': '41049',
 'OR-Umatilla': '41059',
 'OR-Umatilla': '41059',
 'OR-Lake': '41037',
 'OR-Jefferson': '41031',
 'OR-Deschutes': '41017',
 'OR-Sherman': '41055',
 'PA-Armstrong': '42005',
 'PA-Armstrong': '42005',
 'PA-Westmoreland': '42129',
 'PA-Forest': '42053',
 'PA-Forest': '42053',
 'PA-Bradford': '42015',
 'PA-Westmoreland': '42129',
 'PA-Westmoreland': '42129',
 'PA-Indiana': '42063',
 'PA-Bradford': '42015',
 'PA-Westmoreland': '42129',
 'PA-Warren': '42123',
 'PA-Jefferson': '42065',
 'PA-Indiana': '42063',
 'PA-Bedford': '42009',
 'PA-Armstrong': '42005',
 'PA-Bedford': '42009',
 'PA-Forest': '42053',
 'PA-Indiana': '42063',
 'PA-Jefferson': '42065',
 'PA-Warren': '42123',
 'PA-Westmoreland': '42129',
 'PA-Forest': '42053',
 'PA-Indiana': '42063',
 'PA-Bradford': '42015',
 'PA-Jefferson': '42065',
 'PA-Warren': '42123',
 'PA-Forest': '42053',
 'PA-Bradford': '42015',
 'PA-Bradford': '42015',
 'PA-Westmoreland': '42129',
 'PA-Forest': '42053',
 'PA-Bedford': '42009',
 'PA-Indiana': '42063',
 'PA-Indiana': '42063',
 'SC-Abbeville': '45001',
 'SC-Abbeville': '45001',
 'SC-Abbeville': '45001',
 'SC-Abbeville': '45001',
 'SC-Abbeville': '45001',
 'SC-Abbeville': '45001',
 'SD-Butte': '46019',
 'SD-Harding': '46063',
 'SD-Fall River': '46047',
 'SD-Stanley': '46117',
 'SD-Meade': '46093',
 'SD-Butte': '46019',
 'SD-Custer': '46033',
 'SD-Douglas': '46043',
 'SD-Harding': '46063',
 'SD-Meade': '46093',
 'SD-Harding': '46063',
 'SD-Harding': '46063',
 'SD-Fall River': '46047',
 'SD-Fall River': '46047',
 'SD-Fall River': '46047',
 'SD-Douglas': '46043',
 'SD-Custer': '46033',
 'SD-Fall River': '46047',
 'SD-Stanley': '46117',
 'SD-Douglas': '46043',
 'SD-Fall River': '46047',
 'SD-Harding': '46063',
  'SD-Harding': '46063',
  'TN-Scott': '47151',
  'TN-Scott': '47151',
  'TX-Aransas': '48007',
  'TX-Calhoun': '48057',
  'TX-Cameron': '48061',
  'TX-DeWitt': '48123',
  'TX-Hemphill': '48211',
  'TX-Grayson': '48181',
  'TX-Gray': '48179',
  'TX-Fayette': '48149',
  'TX-De Witt': '48123',
  'TX-Houston': '48225',
  'TX-Fannin': '48147',
  'TX-Jefferson': '48245',
  'TX-Kenedy': '48261',
  'TX-Matagorda': '48321',
  'TX-Refugio': '48391',
  'TX-San Patricio': '48409',
  'TX-Victoria': '48469',
  'TX-Terry': '48445',
  'TX-Robertson': '48395',
 'TX-Brazoria': '48039',
 'TX-Harrison': '48203',
 'TX-Johnson': '48251',
 'TX-Johnson': '48251',
 'TX-Taylor': '48441',
 'TX-Angelina': '48005',
 'TX-Armstrong': '48011',
 'TX-Bee': '48025',
 'TX-Bowie': '48037',
 'TX-Brazos': '48041',
 'TX-Fayette': '48149',
 'TX-De Witt': '48123',
 'TX-Fannin': '48147',
 'TX-Brazoria': '48039',
 'TX-Terry': '48445',
 'TX-Robertson': '48395',
 'TX-Jefferson': '48245',
 'TX-Brazoria': '48039',
 'TX-Bastrop': '48021',
 'TX-Galveston': '48167',
 'TX-Bosque': '48035',
 'TX-Hill': '48217',
 'TX-Tom Green': '48451',
 'TX-Freestone': '48161',
 'TX-Denton': '48121',
 'TX-Dallam': '48111',
 'TX-Coleman': '48083',
 'TX-Chambers': '48071',
 'TX-Hidalgo': '48215',
 'TX-Hemphill': '48211',
 'TX-Harrison': '48203',
 'TX-Harris': '48201',
 'TX-Grayson': '48181',
 'TX-Gray': '48179',
 'TX-Jackson': '48239',
 'TX-Houston': '48225',
 'TX-Hidalgo': '48215',
 'TX-Hemphill': '48211',
 'TX-Bowie': '48037',
 'TX-Grayson': '48181',
 'TX-Gray': '48179',
 'TX-Galveston': '48167',
 'TX-Freestone': '48161',
 'TX-Chambers': '48071',
 'TX-Brazos': '48041',
 'TX-Burleson': '48051',
 'TX-Galveston': '48167',
 'TX-Freestone': '48161',
 'TX-Bowie': '48037',
 'TX-Chambers': '48071',
 'TX-Bowie': '48037',
 'TX-Jefferson': '48245',
 'TX-Pecos': '48371',
 'TX-Shelby': '48419',
 'TX-Zapata': '48505',
 'TX-Montgomery': '48339',
 'TX-Montague': '48337',
 'TX-Mcmullen': '48311',
 'TX-Live Oak': '48297',
 'TX-Lee': '48287',
 'TX-Kleberg': '48273',
 'TX-Karnes': '48255',
 'TX-Jones': '48253',
 'TX-Jasper': '48241',
 'TX-Jackson': '48239',
 'TX-Houston': '48225',
 'TX-Hidalgo': '48215',
 'TX-Hemphill': '48211',
 'TX-Harrison': '48203',
 'TX-Harris': '48201',
 'TX-Grayson': '48181',
 'TX-Gray': '48179',
 'TX-Galveston': '48167',
 'TX-Freestone': '48161',
 'TX-Denton': '48121',
 'TX-Dallam': '48111',
 'TX-Coleman': '48083',
 'TX-Chambers': '48071',
 'TX-Burleson': '48051',
 'TX-Brazos': '48041',
 'TX-Bowie': '48037',
 'TX-Bee': '48025',
 'TX-Armstrong': '48011',
 'TX-Angelina': '48005',
 'TX-Brazos': '48041',
 'TX-Burleson': '48051',
 'TX-Dallam': '48111',
 'TX-Brazoria': '48039',
 'TX-Denton': '48121',
 'TX-DeWitt': '48123',
 'TX-Fannin': '48147',
 'TX-Fayette': '48149',
 'TX-Freestone': '48161',
 'TX-Galveston': '48167',
 'TX-Gray': '48179',
 'TX-Grayson': '48181',
 'TX-Harrison': '48203',
 'TX-Karnes': '48255',
 'TX-Hemphill': '48211',
 'TX-Zapata': '48505',
 'TX-Montague': '48337',
 'TX-Hidalgo': '48215',
 'TX-Shelby': '48419',
 'TX-Nacogdoches': '48347',
 'TX-Hill': '48217',
 'TX-San Augustine': '48405',
 'TX-Montgomery': '48339',
 'TX-Houston': '48225',
 'TX-Wise': '48497',
 'TX-Hill': '48217',
 'TX-Burleson': '48051',
 'TX-Jackson': '48239',
 'TX-Johnson': '48251',
 'TX-Harrison': '48203',
 'TX-Jasper': '48241',
 'TX-Johnson': '48251',
 'TX-Karnes': '48255',
 'TX-Wilbarger': '48487',
 'TX-Lee': '48287',
 'TX-Jackson': '48239',
 'TX-Walker': '48471',
 'TX-Live Oak': '48297',
 'TX-McMullen': '48311',
 'TX-Jasper': '48241',
 'TX-Montague': '48337',
 'TX-Montgomery': '48339',
 'TX-Wheeler': '48483',
 'TX-Tarrant': '48439',
 'TX-Nueces': '48355',
 'TX-Jones': '48253',
 'TX-Brazos': '48041',
 'TX-Nacogdoches': '48347',
 'TX-Newton': '48351',
 'TX-Jones': '48253',
 'TX-Karnes': '48255',
 'TX-Walker': '48471',
 'TX-Denton': '48121',
 'TX-Nueces': '48355',
  'TX-Ochiltree': '48357',
  'TX-Orange': '48361',
 'TX-Kleberg': '48273',
 'TX-Lee': '48287',
 'TX-Live Oak': '48297',
 'TX-Mcmullen': '48311',
 'TX-Montague': '48337',
 'TX-Montgomery': '48339',
 'TX-Nacogdoches': '48347',
 'TX-Tarrant': '48439',
 'TX-Nueces': '48355',
 'TX-Washington': '48477',
 'TX-Bastrop': '48021',
 'TX-Parker': '48367',
 'TX-Robertson': '48395',
 'TX-Sabine': '48403',
 'TX-San Augustine': '48405',
 'TX-San Jacinto': '48407',
 'TX-Shelby': '48419',
 'TX-Starr': '48427',
 'TX-Tarrant': '48439',
 'TX-Taylor': '48441',
 'TX-Terry': '48445',
 'TX-Trinity': '48455',
 'TX-Walker': '48471',
 'TX-Newton': '48351',
 'TX-Nueces': '48355',
 'TX-Ochiltree': '48357',
 'TX-Parker': '48367',
 'TX-Pecos': '48371',
 'TX-Jones': '48253',
 'TX-Denton': '48121',
 'TX-Sabine': '48403',
 'TX-San Augustine': '48405',
 'TX-San Jacinto': '48407',
 'TX-Shelby': '48419',
 'TX-Sherman': '48421',
 'TX-Washington': '48477',
 'TX-Starr': '48427',
 'TX-Tarrant': '48439',
 'TX-Taylor': '48441',
 'TX-Trinity': '48455',
 'TX-Walker': '48471',
 'TX-Washington': '48477',
 'TX-Wheeler': '48483',
 'TX-Willacy': '48489',
 'TX-Wise': '48497',
 'TX-Zapata': '48505',
 'TX-Zapata': '48505',
 'TX-Wise': '48497',
 'TX-Wilbarger': '48487',
 'TX-Wheeler': '48483',
 'TX-Washington': '48477',
 'TX-Taylor': '48441',
 'TX-Wheeler': '48483',
 'TX-Wise': '48497',
 'TX-Zapata': '48505',
 'TX-Montague': '48337',
 'TX-Starr': '48427',
 'TX-Shelby': '48419',
 'TX-San Jacinto': '48407',
 'TX-Sabine': '48403',
 'TX-Parker': '48367',
 'TX-Ochiltree': '48357',
 'TX-Starr': '48427',
 'TX-Newton': '48351',
 'TX-Nacogdoches': '48347',
 'TX-McMullen': '48311',
 'TX-Live Oak': '48297',
 'TX-Lee': '48287',
 'TX-Karnes': '48255',
 'TX-Wise': '48497',
 'TX-Wilbarger': '48487',
 'TX-Wheeler': '48483',
 'TX-Newton': '48351',
 'TX-Nueces': '48355',
 'TX-Ochiltree': '48357',
 'TX-Parker': '48367',
 'TX-Pecos': '48371',
 'TX-Sabine': '48403',
 'TX-San Augustine': '48405',
 'TX-San Jacinto': '48407',
 'TX-Shelby': '48419',
 'TX-Sherman': '48421',
 'TX-Starr': '48427',
 'TX-Tarrant': '48439',
 'TX-Taylor': '48441',
 'TX-Trinity': '48455',
 'TX-Walker': '48471',
 'TX-Washington': '48477',
 'TX-Wheeler': '48483',
 'TX-Willacy': '48489',
 'TX-San Augustine': '48405',
 'TX-Montgomery': '48339',
 'TX-Shelby': '48419',
 'TX-Hill': '48217',
 'TX-Burleson': '48051',
 'TX-San Jacinto': '48407',
 'TX-Sabine': '48403',
 'TX-Parker': '48367',
 'TX-Ochiltree': '48357',
 'TX-Newton': '48351',
 'TX-Nacogdoches': '48347',
 'TX-McMullen': '48311',
 'TX-Live Oak': '48297',
 'TX-Lee': '48287',
 'TX-Jasper': '48241',
 'TX-Jackson': '48239',
 'TX-Houston': '48225',
 'TX-Hidalgo': '48215',
 'TX-Hemphill': '48211',
 'TX-Grayson': '48181',
 'TX-Gray': '48179',
 'TX-Galveston': '48167',
 'TX-Freestone': '48161',
 'TX-Chambers': '48071',
 'TX-Brazos': '48041',
 'TX-Bowie': '48037',
 'TX-Johnson': '48251',
 'TX-Jasper': '48241',
 'TX-Denton': '48121',
 'TX-Jones': '48253',
 'TX-Washington': '48477',
 'TX-Taylor': '48441',
 'TX-Starr': '48427',
 'TX-Shelby': '48419',
 'TX-Nueces': '48355',
 'TX-Tarrant': '48439',
 'TX-Bosque': '48035',
 'TX-Hill': '48217',
 'TX-San Jacinto': '48407',
 'TX-Walker': '48471',
 'TX-Sabine': '48403',
 'TX-Tom Green': '48451',
 'TX-Parker': '48367',
 'TX-Harrison': '48203',
 'TX-Johnson': '48251',
 'TX-Ochiltree': '48357',
 'TX-Burleson': '48051',
 'TX-Hill': '48217',
 'TX-Newton': '48351',
 'TX-Nacogdoches': '48347',
 'TX-Montgomery': '48339',
 'TX-San Augustine': '48405',
 'TX-Wise': '48497',
 'TX-Shelby': '48419',
 'TX-Montague': '48337',
 'TX-McMullen': '48311',
 'TX-Live Oak': '48297',
 'TX-Karnes': '48255',
 'TX-Lee': '48287',
 'TX-Jasper': '48241',
 'TX-Jackson': '48239',
 'TX-Houston': '48225',
 'TX-Brazoria': '48039',
 'TX-Hidalgo': '48215',
 'TX-Zapata': '48505',
 'TX-McMullen': '48311',
 'UT-Duchesne': '49013',
 'UT-Washington': '49053',
 'UT-Uintah': '49047',
 'UT-Tooele': '49045',
 'UT-Summit': '49043',
 'UT-Sevier': '49041',
 'UT-San Juan': '49037',
 'UT-Wayne': '49055',
 'UT-Washington': '49053',
 'UT-Piute': '49031',
 'UT-Grand': '49019',
 'UT-Garfield': '49017',
 'UT-Emery': '49015',
 'UT-Duchesne': '49013',
 'UT-Daggett': '49009',
 'UT-Carbon': '49007',
 'UT-Beaver': '49001',
 'UT-Wasatch': '49051',
 'UT-Utah': '49049',
 'UT-Uintah': '49047',
 'UT-Tooele': '49045',
 'UT-Summit': '49043',
 'UT-Sevier': '49041',
 'UT-San Pete': '49039',
 'UT-Sanpete': '49039',
 'UT-San Juan': '49037',
 'UT-Salt Lake': '49035',
 'UT-Rich': '49033',
 'UT-Piute': '49031',
 'UT-Morgan': '49029',
 'UT-Millard': '49027',
 'UT-Kane': '49025',
 'UT-Juab': '49023',
 'UT-Iron': '49021',
 'UT-Grand': '49019',
 'UT-Garfield': '49017',
 'UT-Emery': '49015',
 'UT-Duchesne': '49013',
 'UT-Davis': '49011',
 'UT-Daggett': '49009',
 'UT-Carbon': '49007',
 'UT-Box Elder': '49003',
 'UT-Beaver': '49001',
 'UT-Millard': '49027',
 'UT-Salt Lake': '49035',
 'UT-Sanpete': '49039',
 'UT-San Juan': '49037',
 'UT-Utah': '49049',
 'UT-Uintah': '49047',
 'UT-Grand': '49019',
 'UT-Emery': '49015',
 'UT-Carbon': '49007',
 'UT-Washington': '49053',
 'UT-Uintah': '49047',
 'UT-Tooele': '49045',
 'UT-Salt Lake': '49035',
 'UT-Millard': '49027',
 'UT-Sanpete': '49039',
 'UT-Carbon': '49007',
 'UT-Grand': '49019',
 'UT-Uintah': '49047',
 'UT-Utah': '49049',
 'UT-San Juan': '49037',
 'UT-Duchesne': '49013',
 'UT-Sanpete': '49039',
 'UT-Salt Lake': '49035',
 'UT-Millard': '49027',
 'UT-Juab': '49023',
 'UT-Beaver': '49001',
 'UT-Carbon': '49007',
 'UT-Daggett': '49009',
 'UT-Duchesne': '49013',
 'UT-Emery': '49015',
 'UT-Garfield': '49017',
 'UT-Grand': '49019',
 'UT-Iron': '49021',
 'UT-Juab': '49023',
 'UT-Millard': '49027',
 'UT-Piute': '49031',
 'UT-Rich': '49033',
 'UT-San Juan': '49037',
 'UT-Sanpete': '49039',
 'UT-Sevier': '49041',
 'UT-Summit': '49043',
 'UT-Tooele': '49045',
 'UT-Uintah': '49047',
 'UT-Utah': '49049',
 'UT-Wasatch': '49051',
 'UT-Summit': '49043',
 'UT-Sevier': '49041',
 'UT-San Juan': '49037',
 'UT-Piute': '49031',
 'UT-Grand': '49019',
 'UT-Garfield': '49017',
 'UT-Emery': '49015',
 'UT-Duchesne': '49013',
 'UT-Daggett': '49009',
 'UT-Carbon': '49007',
 'UT-Wayne': '49055',
 'UT-Beaver': '49001',
 'UT-Box Elder': '49003',
 'UT-Kane': '49025',
 'UT-Sanpete': '49039',
 'UT-Washington': '49053',
 'UT-Wayne': '49055',
 'UT-Wasatch': '49051',
 'UT-Utah': '49049',
 'UT-Uintah': '49047',
 'UT-Tooele': '49045',
 'UT-Summit': '49043',
 'UT-Sevier': '49041',
 'UT-San Pete': '49039',
 'UT-San Juan': '49037',
 'UT-Salt Lake': '49035',
 'UT-Rich': '49033',
 'UT-Piute': '49031',
 'UT-Morgan': '49029',
 'UT-Millard': '49027',
 'UT-Kane': '49025',
 'UT-Iron': '49021',
 'UT-Grand': '49019',
 'UT-Garfield': '49017',
 'UT-Emery': '49015',
 'UT-Duchesne': '49013',
 'UT-Davis': '49011',
 'UT-Daggett': '49009',
 'UT-Beaver': '49001',
 'UT-Carbon': '49007',
 'UT-Daggett': '49009',
 'UT-Duchesne': '49013',
 'UT-Emery': '49015',
 'UT-Garfield': '49017',
 'UT-Grand': '49019',
 'UT-Piute': '49031',
 'UT-San Juan': '49037',
 'UT-Sevier': '49041',
 'UT-Summit': '49043',
 'UT-Tooele': '49045',
 'UT-Uintah': '49047',
 'UT-Washington': '49053',
 'UT-Carbon': '49007',
 'UT-Box Elder': '49003',
 'UT-Beaver': '49001',
 'UT-Carbon': '49007',
 'UT-Grand': '49019',
 'UT-Uintah': '49047',
 'UT-Utah': '49049',
 'UT-San Juan': '49037',
 'UT-Duchesne': '49013',
 'VA-Wise': '51195',
 'VA-Wise': '51195',
 'VA-Highland': '51091',
 'VA-Wise': '51195',
 'VA-Highland': '51091',
 'VA-Giles': '51071',
 'VA-Dickenson': '51051',
 'VA-Wise': '51195',
 'VA-Giles': '51071',
 'VA-Dickenson': '51051',
 'VA-Highland': '51091',
 'VA-Giles': '51071',
 'VA-Dickenson': '51051',
 'VA-Wise': '51195',
 'VA-Lee': '51105',
 'VA-Giles': '51071',
 'VA-Dickenson': '51051',
 'VA-Highland': '51091',
 'VA-Giles': '51071',
 'VA-Dickenson': '51051',
 'VA-Lee': '51105',
 'VA-Highland': '51091',
 'VA-Highland': '51091',
 'VA-Wise': '51195',
 'VA-Giles': '51071',
 'VA-Dickenson': '51051',
 'WA-Adams': '53001',
 'WA-Lewis': '53041',
 'WA-Yakima': '53077',
 'WA-Lewis': '53041',
 'WA-Lewis': '53041',
 'WA-Walla Walla': '53071',
 'WA-Douglas': '53017',
 'WA-Lewis': '53041',
 'WA-Walla Walla': '53071',
 'WA-Yakima': '53077',
 'WA-Klickitat': '53039',
 'WA-Kittitas': '53037',
 'WA-Grant': '53025',
 'WA-Franklin': '53021',
 'WA-Benton': '53005',
 'WA-Chelan': '53007',
 'WA-Adams': '53001',
 'WA-Whatcom': '53073',
 'WA-Lewis': '53041',
 'WA-Whatcom': '53073',
 'WA-Douglas': '53017',
 'WA-Klickitat': '53039',
 'WA-Kittitas': '53037',
 'WA-Whatcom': '53073',
 'WA-Lewis': '53041',
 'WA-Grant': '53025',
 'WA-Franklin': '53021',
 'WA-Chelan': '53007',
 'WA-Benton': '53005',
 'WI-Taylor': '55119',
 'WI-Taylor': '55119',
 'WV-Wood': '54107',
 'WV-Grant': '54023',
 'WV-Braxton': '54007',
 'WV-Grant': '54023',
 'WV-Lewis': '54041',
 'WV-Mingo': '54059',
 'WV-Pendleton': '54071',
 'WV-Pocahontas': '54075',
 'WV-Preston': '54077',
 'WV-Randolph': '54083',
 'WV-Tucker': '54093',
 'WV-Wayne': '54099',
 'WV-Wood': '54107',
 'WV-Wyoming': '54109',
 'WV-Wayne': '54099',
 'WV-Tucker': '54093',
 'WV-Randolph': '54083',
 'WV-Preston': '54077',
 'WV-Pocahontas': '54075',
 'WV-Pendleton': '54071',
 'WV-Mingo': '54059',
 'WV-Lewis': '54041',
 'WV-Grant': '54023',
 'WV-Braxton': '54007',
 'WV-Lewis': '54041',
 'WV-Wyoming': '54109',
 'WV-Mingo': '54059',
 'WV-Grant': '54023',
 'WV-Pendleton': '54071',
 'WV-Grant': '54023',
 'WV-Pendleton': '54071',
 'WV-Pocahontas': '54075',
 'WV-Preston': '54077',
 'WV-Randolph': '54083',
 'WV-Tucker': '54093',
 'WV-Pocahontas': '54075',
 'WV-Preston': '54077',
 'WV-Randolph': '54083',
 'WV-Tucker': '54093',
 'WV-Tucker': '54093',
 'WV-Mingo': '54059',
 'WV-Wyoming': '54109',
 'WV-Randolph': '54083',
 'WV-Preston': '54077',
 'WV-Lewis': '54041',
 'WV-Mingo': '54059',
 'WV-Pocahontas': '54075',
 'WV-Wyoming': '54109',
 'WV-Lewis': '54041',
 'WV-Pendleton': '54071',
 'WV-Webster': '54101',
 'WV-Wyoming': '54109',
 'WV-Wyoming': '54109',
 'WV-Wood': '54107',
 'WV-Webster': '54101',
 'WV-Wayne': '54099',
 'WV-Tucker': '54093',
 'WV-Randolph': '54083',
 'WV-Preston': '54077',
 'WV-Pocahontas': '54075',
 'WV-Pendleton': '54071',
 'WV-Mingo': '54059',
 'WV-Lewis': '54041',
 'WV-Grant': '54023',
 'WV-Braxton': '54007',
 'WY-Big Horn': '56003',
 'WY-Converse': '56009',
 'WY-Crook': '56011',
 'WY-Fremont': '56013',
 'WY-Goshen': '56015',
 'WY-Hot Springs': '56017',
 'WY-Johnson': '56019',
 'WY-Laramie': '56021',
 'WY-Lincoln': '56023',
 'WY-Natrona': '56025',
 'WY-Niobrara': '56027',
 'WY-Park': '56029',
 'WY-Platte': '56031',
 'WY-Sheridan': '56033',
 'WY-Sublette': '56035',
 'WY-Albany': '56001',
 'WY-Big Horn': '56003',
 'WY-Campbell': '56005',
 'WY-Carbon': '56007',
 'WY-Weston': '56045',
 'WY-Washakie': '56043',
 'WY-Uinta': '56041',
 'WY-Teton': '56039',
 'WY-Sweetwater': '56037',
 'WY-Sublette': '56035',
 'WY-Albany': '56001',
 'WY-Big Horn': '56003',
 'WY-Campbell': '56005',
 'WY-Carbon': '56007',
 'WY-Converse': '56009',
 'WY-Crook': '56011',
 'WY-Fremont': '56013',
 'WY-Hot Springs': '56017',
 'WY-Johnson': '56019',
 'WY-Laramie': '56021',
 'WY-Lincoln': '56023',
 'WY-Natrona': '56025',
 'WY-Niobrara': '56027',
 'WY-Park': '56029',
 'WY-Sheridan': '56033',
 'WY-Sublette': '56035',
 'WY-Sweetwater': '56037',
 'WY-Uinta': '56041',
 'WY-Washakie': '56043',
 'WY-Weston': '56045',
 'WY-Sweetwater': '56037',
 'WY-Teton': '56039',
 'WY-Uinta': '56041',
 'WY-Sheridan': '56033',
 'WY-Platte': '56031',
 'WY-Park': '56029',
 'WY-Niobrara': '56027',
 'WY-Albany': '56001',
 'WY-Big Horn': '56003',
 'WY-Campbell': '56005',
 'WY-Carbon': '56007',
 'WY-Converse': '56009',
 'WY-Crook': '56011',
 'WY-Fremont': '56013',
 'WY-Washakie': '56043',
 'WY-Weston': '56045',
 'WY-Natrona': '56025',
 'WY-Campbell': '56005',
 'WY-Carbon': '56007',
 'WY-Fremont': '56013',
 'WY-Johnson': '56019',
 'WY-Lincoln': '56023',
 'WY-Natrona': '56025',
 'WY-Sublette': '56035',
 'WY-Sweetwater': '56037',
 'WY-Uinta': '56041',
 'WY-Hot Springs': '56017',
 'WY-Johnson': '56019',
 'WY-Laramie': '56021',
 'WY-Lincoln': '56023',
 'WY-Natrona': '56025',
 'WY-Niobrara': '56027',
 'WY-Park': '56029',
 'WY-Converse': '56009',
 'WY-Lincoln': '56023',
 'WY-Laramie': '56021',
 'WY-Sheridan': '56033',
 'WY-Sublette': '56035',
 'WY-Sweetwater': '56037',
 'WY-Uinta': '56041',
 'WY-Washakie': '56043',
 'WY-Weston': '56045',
 'WY-Campbell': '56005',
 'WY-Carbon': '56007',
 'WY-Johnson': '56019',
 'WY-Fremont': '56013',
 'WY-Hot Springs': '56017',
 'WY-Park': '56029',
 'WY-Johnson': '56019',
 'WY-Lincoln': '56023',
 'WY-Natrona': '56025',
 'WY-Sublette': '56035',
 'WY-Sweetwater': '56037',
 'WY-Uinta': '56041',
 'WY-Crook': '56011',
 'WY-Goshen': '56015',
 'WY-Fremont': '56013',
 'WY-Crook': '56011',
 'WY-Sheridan': '56033',
 'WY-Converse': '56009',
 'WY-Park': '56029',
 'WY-Carbon': '56007',
 'WY-Campbell': '56005',
 'WY-Sheridan': '56033',
 'WY-Converse': '56009',
 'WY-Niobrara': '56027',
 'WY-Crook': '56011',
 'WY-Washakie': '56043',
 'WY-Big Horn': '56003',
 'WY-Fremont': '56013',
 'WY-Goshen': '56015',
 'WY-Hot Springs': '56017',
 'WY-Big Horn': '56003',
 'WY-Johnson': '56019',
 'WY-Laramie': '56021',
 'WY-Lincoln': '56023',
 'WY-Natrona': '56025',
 'WY-Albany': '56001',
 'WY-Niobrara': '56027',
 'WY-Park': '56029',
 'WY-Platte': '56031',
 'WY-Sheridan': '56033',
 'WY-Sublette': '56035',
 'WY-Sweetwater': '56037',
 'WY-Teton': '56039',
 'WY-Uinta': '56041',
 'WY-Washakie': '56043',
 'WY-Big Horn': '56003',
 'WY-Washakie': '56043',
 'WY-Crook': '56011',
 'WY-Weston': '56045',
 'WY-Sheridan': '56033',
 'WY-Albany': '56001',
 'WY-Park': '56029',
 'WY-Carbon': '56007',
 'WY-Campbell': '56005',
 'WY-Converse': '56009',
 'WY-Uinta': '56041',
 'WY-Sweetwater': '56037',
 'WY-Sublette': '56035',
 'WY-Natrona': '56025',
 'WY-Lincoln': '56023',
 'WY-Johnson': '56019',
 'WY-Fremont': '56013',
 'WY-Carbon': '56007',
 'WY-Campbell': '56005',
 'WY-Weston': '56045',
 'WY-Washakie': '56043',
 'WY-Uinta': '56041',
 'WY-Sweetwater': '56037',
 'WY-Sublette': '56035',
 'WY-Sheridan': '56033',
 'WY-Park': '56029',
 'WY-Niobrara': '56027',
 'WY-Natrona': '56025',
 'WY-Lincoln': '56023',
 'WY-Laramie': '56021',
 'WY-Johnson': '56019',
 'WY-Hot Springs': '56017',
 'WY-Fremont': '56013',
 'WY-Crook': '56011',
 'WY-Converse': '56009',
 'WY-Carbon': '56007',
 'WY-Campbell': '56005',
 'WY-Big Horn': '56003',
 'WY-Converse': '56009',
 'WY-Niobrara': '56027',
 'WY-Niobrara': '56027',
 'WY-Crook': '56011',
 'WY-Washakie': '56043',
 'WY-Big Horn': '56003',
 'WY-Albany': '56001'
}


main()
