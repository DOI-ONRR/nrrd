const args =  require('commander');

args
    .option('--duplicates', 'Enable/disable duplicates',true)
    .option('--no-duplicates', 'Enable/disable duplicates')
    .option('-f, --file <file>', 'CSV file to load')
    .option('--password <password>', 'DB PASSWORD')
    .option('--port <port>', 'DB PORT') 
    .parse(process.argv)

let DB_PASSWORD='';
if(args.password) {
	DB_PASSWORD=args.password;
    } else if( process.env.DB_PASSWORD ) {
	DB_PASSWORD= process.env.DB_PASSWORD
    } else {
	console.warn("No database password use command line option or set DB_PASSWORD variable");
	process.exit();

    }

let PORT=7222
if(args.port) {
    DB_PORT=args.port;
} else if( process.env.DB_PORT ) {
    DB_PORT= process.env.DB_PORT
}


const { Pool, Client } = require('pg')
const db = new Pool({user: 'postgres',
		     host: 'localhost',
		     database: 'onrr_db',
		     password: DB_PASSWORD,
		     port: PORT,
			});

db.connect((err, client, release) => {
    if (err) {
	
	console.error('Error connectiong', err.stack);
	process.exit();
    } else {
	console.log("Connected to database");
    }
})

//process.exit();
const main = () => {

   // yearly_calendar_revenue();
   // yearly_fiscal_revenue();
    
    	revenue_trends();
	
}

const revenue_summary = () => {
let view=`
-- drop view fiscal_revenue_summary
create view  fiscal_revenue_summary as 
select land_category,  fiscal_year, case when land_category = 'Offshore' then  offshore_planning_area else state end as state_or_area, sum(revenue) 
from revenue natural join period natural join location 
where period='Fiscal Year'
group by state_or_area, land_category, fiscal_year,  state order by   fiscal_year, state
;q
}
    

const yearly_calendar_revenue = () => {
    let view=`
-- drop view yearly_calendar_revenue;
CREATE view yearly_calendar_revenue as
select calendar_year as year, 
       sum(case when revenue_category='Federal offshore' then revenue else 0 end) as 'Federal offshore',
       sum(case when revenue_category='Federal onshore' then revenue else 0 end) as 'Federal onshore',
       sum(case when revenue_category='Native American' then revenue else 0 end) as 'Native American',
       sum(case when revenue_category='Not tied to a lease' then revenue else 0 end) as 'Not tied to a lease'

from revenue 
  natural join period 
  natural join commodity 
where commodity is not null
group by calendar_year
`
    const create=db.query(view);

}

const yearly_fiscal_revenue = () => {
    let view=`
-- drop view yearly_fiscal_revenue;
CREATE view yearly_fiscal_revenue as
select fiscal_year as year, 
       sum(case when revenue_category='Federal offshore' then revenue else 0 end) as 'Federal offshore',
       sum(case when revenue_category='Federal onshore' then revenue else 0 end) as 'Federal onshore',
       sum(case when revenue_category='Native American' then revenue else 0 end) as 'Native American',
       sum(case when revenue_category='Not tied to a lease' then revenue else 0 end) as 'Not tied to a lease'

from revenue 
  natural join period 
  natural join commodity 
where commodity is not null
group by fiscal_year


`
    const create=db.query(view);

}


const revenue_trends = () => {
    let view=`
drop view revenue_trends;
CREATE view revenue_trends as
select fiscal_year, 
       case when (revenue_type='Other Revenues' or revenue_type='Civil Penalties' or revenue_type='Inspection Fees') then 'Other Revenues' else  revenue_type end as trend_type,  
       (select month_long from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01')) as current_month,
       sum(case when fiscal_month <= (select fiscal_month from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01' )) then revenue else 0 end) as total_ytd, 
       sum(revenue) as total 
from revenue 
  natural join period 
  natural join commodity 
where commodity not null
and period_date <= '2019-07-01'
group by fiscal_year, trend_type

union 
select fiscal_year,  
       'All Revenue' as trend_type,
       (select month_long from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01' )) as current_month,
       sum(case when fiscal_month <= (select fiscal_month from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01')) then revenue else 0 end) as total_ytd, 
       sum(revenue) as total 
from revenue natural join period natural join commodity 
where commodity is not null and  period_date <= '2019-07-01'
group by fiscal_year;


`
    const create=db.query(view);

}


main();
