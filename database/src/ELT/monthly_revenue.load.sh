#/bin/bash
psql --host=localhost --user=postgres  <<EOF 
\echo 'truncate revenue'
truncate monthly_revenue_elt;
truncate revenue;
EOF

for csv in ./static/csv/revenue/*.csv
do
    
psql --host=localhost --user=postgres  <<EOF 

\echo 'load $csv'
\copy monthly_revenue_elt (accept_date,land_class_code,land_category_code_desc,state,county_code_desc,fips_code,agency_state_region_code_desc,revenue_type,mineral_production_code_desc,commodity,product_code_desc, revenue) FROM '$csv' WITH  DELIMITER ',' CSV HEADER;


EOF
done

psql --host=localhost --user=postgres  <<EOE 

\pset pager 0

\echo delete empty rows if any
delete from monthly_revenue_elt where 
accept_date is null 
and land_class_code is null 
and land_category_code_desc is null 
and state is null 
and county_code_desc is null 
and fips_code is null 
and agency_state_region_code_desc is null 
and revenue_type is null 
and mineral_production_code_desc is null 
and commodity is null 
and product_code_desc is null 
and revenue is null;

\echo 'Summarize Native American Data'
insert into monthly_revenue_elt select accept_date, 'Native American', land_category_code_desc, 'Native American', '', 'NA',  '' ,revenue_type ,mineral_production_code_desc, commodity, product_code_desc, sum(to_number(revenue, 'L999G999G999G999D99')) from monthly_revenue_elt where land_class_code like '%Indian%' group by accept_date, land_category_code_desc, revenue_type ,mineral_production_code_desc, commodity, product_code_desc;
\echo 'Delete Native American Detail'
delete from monthly_revenue_elt where land_class_code like '%Indian%';


\echo 'Update NULLS to \'\' '
update monthly_revenue_elt set land_class_code = COALESCE(land_class_code,''),
                              land_category_code_desc = COALESCE(land_category_code_desc,''),
                               state = COALESCE(state,''), 
county_code_desc = COALESCE(county_code_desc,''),
fips_code = COALESCE(fips_code,'') ,
agency_state_region_code_desc = COALESCE(agency_state_region_code_desc,''),
revenue_type = COALESCE(revenue_type,''),
mineral_production_code_desc = COALESCE(mineral_production_code_desc,''),
commodity = COALESCE(commodity,'Not tied to a commodity'),
product_code_desc = COALESCE(product_code_desc, '');




\echo 'Clean up zip codes'
update monthly_revenue_elt set fips_code=concat('0',fips_code) where length(fips_code)=4 and county_code_desc != '';


\echo 'Clean up offshore region'
update monthly_revenue_elt set agency_state_region_code_desc='Alaska', fips_code='AKR' where agency_state_region_code_desc='ALASKA OCS';
update monthly_revenue_elt set agency_state_region_code_desc='Pacific', fips_code='POR'  where agency_state_region_code_desc='PACIFIC OCS';
update monthly_revenue_elt set agency_state_region_code_desc='Atlantic', fips_code='AOR'  where agency_state_region_code_desc='ATLANTIC OCS';
update monthly_revenue_elt set agency_state_region_code_desc='Gulf of Mexico', fips_code='GMR' where agency_state_region_code_desc='GULF OF MEXICO';
update monthly_revenue_elt set agency_state_region_code_desc='' where  land_category_code_desc in ('Not Tied to a Lease', 'Onshore');

update monthly_revenue_elt set agency_state_region_code_desc = ''  where  agency_state_region_code_desc in ( 'NEW MEXICO', 'EAST STATES');

\echo 'Clean up revenue_type'
update monthly_revenue_elt set revenue_type='Other Revenues' where revenue_type='';
update monthly_revenue_elt set revenue_type='Civil Penalties' where revenue_type='Civil Penalty';
update monthly_revenue_elt set revenue_type=REPLACE(revenue_type, ' ', '1spc1') ;
update monthly_revenue_elt set revenue_type=initcap(revenue_type) ;
update monthly_revenue_elt set revenue_type=REPLACE(revenue_type, '1spc1', ' ') ;



\echo 'Clean up commodity, Oil & Gas, CO2, etc'
update monthly_revenue_elt set commodity='Carbon dioxide' where commodity='CO2';
update monthly_revenue_elt set commodity='Carbon dioxide' where commodity='Carbon Dioxide';
update monthly_revenue_elt set commodity='Natural gas liquids' where commodity='NGL';
update monthly_revenue_elt set commodity='Oil & gas (pre-production)' where commodity='Oil & Gas';
update monthly_revenue_elt set product_code_desc='Geothermal - Direct Use (Hundreds of Gallons)' where product_code_desc='Geothermal - Direct Utilization, Hundreds of Gallons';
update monthly_revenue_elt set product_code_desc='Geothermal - Direct Use (Millions of BTUs)' where product_code_desc='Geothermal - Direct Utilization, Millions of BTUs';
update monthly_revenue_elt set product_code_desc='Geothermal - Direct Use (Millions of Gallons)' WHERE product_code_desc='Geothermal - Direct Use, Millions of Gallons';
update monthly_revenue_elt set product_code_desc='Geothermal - Electrical Generation (Kilowatt Hours)' WHERE product_code_desc='Geothermal - Electrical Generation, Kilowatt Hours';
update monthly_revenue_elt set product_code_desc='Geothermal - Electrical Generation (Other)' WHERE product_code_desc='Geothermal - Electrical Generation, Other';
update monthly_revenue_elt set product_code_desc='Geothermal - Electrical Generation (Thousands of Pounds)' WHERE product_code_desc='Geothermal - Electrical Generation, Thousands of Pounds';
update monthly_revenue_elt set product_code_desc='Geothermal - Sulfur (tons)' WHERE product_code_desc='Geothermal - sulfur';


update monthly_revenue_elt set commodity=REPLACE(commodity, ' ', '1spc1') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, '-', '1dsh1') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, '/', '1slsh1') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, '(', '1oprn1') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, ')', 'coprn1') ;
update monthly_revenue_elt set commodity=initcap(commodity) ;
update monthly_revenue_elt set commodity=REPLACE(commodity, 'coprn1',')') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, '1oprn1', '(') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, '1slsh1','/') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, '1dsh1', '-') ;
update monthly_revenue_elt set commodity=REPLACE(commodity, '1spc1', ' ') ;



\echo 'Insert location records'
insert into location (land_class, land_category,  state, county, fips_code, offshore_region) select
       	COALESCE(land_class_code,'') as land_class,
	COALESCE(land_category_code_desc,'')  as land_category,
	COALESCE(state,'') ,
	COALESCE(county_code_desc,'')  as county,
	COALESCE(fips_code,'') ,
	COALESCE(agency_state_region_code_desc,'')  as offshore_region
from monthly_revenue_elt
group by  land_class_code, land_category_code_desc, state, county_code_desc, fips_code, agency_state_region_code_desc
on conflict DO NOTHING;

\echo 'Insert revenue type and source into fund table'
insert into fund (revenue_type, source)  select
	COALESCE(revenue_type,''),
	COALESCE(land_category_code_desc,'') 
from monthly_revenue_elt
group by revenue_type,land_category_code_desc
-- limit 10
on conflict DO NOTHING;


\echo 'Insert commodity records'
insert into commodity (mineral_lease_type, commodity, product, commodity_order)  select
	COALESCE(mineral_production_code_desc,''),
	COALESCE(commodity,'Not tied to a commodity'),
	COALESCE(product_code_desc, ''),
	CASE WHEN commodity is null  then 'ZZZ' 
	WHEN commodity='Oil' then '1' 
	WHEN commodity='Gas' then '2'
     	WHEN commodity='Oil & Gas' then '3' 
       	WHEN commodity='NGL' then '4' 
        WHEN commodity='Coal' then '5' 
	     ELSE substr(commodity, 1,5) END
from monthly_revenue_elt
group by mineral_production_code_desc, commodity, product_code_desc
-- limit 10
on conflict DO NOTHING;

\echo 'Insert period records'

insert into period (period, calendar_year, fiscal_year, month, month_long, month_short, fiscal_month, period_date )
select
        'Monthly',
	extract(year from accept_date),
	extract(year from accept_date + interval '3 months'),
	extract(month from accept_date),
	trim(to_char(accept_date, 'Month')),
	to_char(accept_date, 'Mon'),
	extract(month from accept_date + interval '3 months'),	
	accept_date
	
from monthly_revenue_elt
group by accept_date order by accept_date 
on conflict DO NOTHING;



\echo 'Insert revenue fact records'



insert into revenue (  location_id ,period_id, commodity_id, fund_id, revenue, unit, unit_abbr, duplicate_no)
select
location_id,
period_id,
commodity_id,
fund_id,
sum(to_number(revenue, 'L999G999G999G999D99')),
'dollars',
'$',
count(*) as cnt
from monthly_revenue_elt e
     join location l
     on land_class_code = land_class 
     and land_category_code_desc = land_category
     and e.state=l.state
     and county_code_desc = county
     and e.fips_code=l.fips_code
     and agency_state_region_code_desc =  offshore_region
     
     join fund f
     	 on e.revenue_type=f.revenue_type
	 and land_category_code_desc = source
         and recipient='' and fund_type='' and fund_class=''  and disbursement_type=''
     join commodity c
	 on e.commodity=c.commodity
         and e.mineral_production_code_desc = c.mineral_lease_type 
         and product_code_desc=product
     join period on accept_date=period_date
          and period='Monthly'
	 

group by location_id, period_id, commodity_id, 
fund_id

;







\echo 'Insert fiscal period records'

insert into period (period, calendar_year, fiscal_year, month, month_long, month_short, fiscal_month, period_date )
select
        'Fiscal Year',
	extract(year from accept_date + interval '3 months'),
	extract(year from accept_date + interval '3 months'),
	0,
	'',
	'',
	0,
       	to_date(concat('01/01/',extract(year from accept_date + interval '3 months')), 'MM/DD/YYYY')
	
from monthly_revenue_elt
where accept_date <= (select max(accept_date) from monthly_revenue_elt where extract(month from accept_date) = 9)
group by extract(year from accept_date + interval '3 months') order by  extract(year from accept_date + interval '3 months')  


on conflict DO NOTHING;



\echo 'Insert fiscal year revenue fact records'



insert into revenue (  location_id ,period_id, commodity_id, fund_id, revenue,  unit, unit_abbr, duplicate_no)
select
location_id,
period_id,
commodity_id,
fund_id,
sum(to_number(revenue, 'L999G999G999G999D99')),
'dollars',
'$',
count(*) as cnt
from monthly_revenue_elt e
     join location l
     on land_class_code = land_class 
     and land_category_code_desc = land_category
     and e.state=l.state
     and county_code_desc = county
     and e.fips_code=l.fips_code
     and agency_state_region_code_desc =  offshore_region
     
     join fund f
     	 on e.revenue_type=f.revenue_type
	 and land_category_code_desc = source
         and recipient='' and fund_type='' and fund_class='' and disbursement_type=''
     join commodity c
	 on e.commodity=c.commodity
         and e.mineral_production_code_desc = c.mineral_lease_type 
         and product_code_desc=product
     join period p on 
         extract(year from accept_date + interval '3 months')=p.fiscal_year
        and period_date <= (select max(period_date) from period where fiscal_month=12)
        and period='Fiscal Year'
	 

group by location_id, period_id, commodity_id, 
fund_id;


\echo 'Insert Calendar year period records';

insert into period (period, calendar_year, fiscal_year, month, month_long, month_short, fiscal_month, period_date )
select
        'Calendar Year',
	extract(year from accept_date),
	extract(year from accept_date),
	0,
	'',
	'',
	0,

       	to_date(concat('01/01/',extract(year from accept_date)), 'MM/DD/YYYY')
from monthly_revenue_elt
where accept_date <= (select max(accept_date) from monthly_revenue_elt where extract(month from accept_date) = 12)
group by extract(year from accept_date) order by  extract(year from accept_date)  


on conflict DO NOTHING;



\echo 'Insert calendar year revenue fact records';



insert into revenue (  location_id ,period_id, commodity_id, fund_id, revenue, unit, unit_abbr, duplicate_no)
select
location_id,
period_id,
commodity_id,
fund_id,
sum(to_number(revenue, 'L999G999G999G999D99')),
'dollars',
'$',
count(*) as cnt

from monthly_revenue_elt e
     join location l
     on land_class_code = land_class 
     and land_category_code_desc = land_category
     and e.state=l.state
     and county_code_desc = county
     and e.fips_code=l.fips_code
     and agency_state_region_code_desc =  offshore_region
     
     join fund f
     	 on e.revenue_type=f.revenue_type
	 and land_category_code_desc = source
         and recipient='' and fund_type='' and fund_class='' and disbursement_type=''
     join commodity c
	 on e.commodity=c.commodity
         and e.mineral_production_code_desc = c.mineral_lease_type 
         and product_code_desc=product
     join period p on 
	 extract(year from accept_date)=p.calendar_year
         and period='Calendar Year'
	 and period_date <= (select max(period_date) from period where month=12)
	 

group by location_id, period_id, commodity_id, 
fund_id;



/*
select period, calendar_year,  source,
sum(revenue)
from revenue join period using (period_id) join fund using (fund_id)
where period='Calendar Year'
group by  period, calendar_year,  source
*/
EOE
