truncate table  fiscal_year_production_elt;
delete from production where period_id in (select period_id from period where period='Fiscal Year');

\copy fiscal_year_production_elt (fiscal_year,land_category,  land_class, state, county, fips_code, offshore_region, product, volume) FROM './static/csv/production/fiscal_year_production.csv' WITH  DELIMITER ',' CSV HEADER;


delete from fiscal_year_production_elt where fiscal_year is null
and land_category is null 
and land_class is null
and state is null
and county is null
and fips_code is null
and offshore_region is null
and product is null
and volume is null;

update fiscal_year_production_elt set county=COALESCE(REPLACE(REPLACE(REPLACE(county,' County', ''),' Parish',''), ' Borough',''),'');
update fiscal_year_production_elt set state='', county='',   fips_code='GMR', offshore_region='Gulf of Mexico' where state='LA' and land_category='Offshore';
update fiscal_year_production_elt e set fips_code = l.fips_code FROM county_lookup l WHERE e.county=l.county and e.state=l.state;


\echo 'Formated volume'
update fiscal_year_production_elt set volume=REPLACE(volume, '(','-');
update fiscal_year_production_elt set volume=REPLACE(volume, ')',''); 


\echo update production(commodity)

update fiscal_year_production_elt e set product=replace(product,'Dioxide', 'dioxide') WHERE product like '%Dioxide%' ;
update fiscal_year_production_elt e set product='Sand/Gravel (Cubic Yards)' where product='Sand/Gravel-Cubic Yards (cyd)';
update fiscal_year_production_elt e set product='Geothermal - Direct Use (Hundreds of Gallons)' where product='Geothermal - Direct Utilization, Hundreds of Gallons';
update fiscal_year_production_elt e set product='Geothermal - Direct Use (Millions of Gallons)' WHERE product='Geothermal - Direct Use, Millions of Gallons';
update fiscal_year_production_elt set product='Geothermal - Direct Use (Millions of BTUs)' where product ='Geothermal - Direct Utilization, Millions of BTUs';
update fiscal_year_production_elt e set product='Geothermal - Electrical Generation (Kilowatt Hours)' WHERE product='Geothermal - Electrical Generation, Kilowatt Hours';
update fiscal_year_production_elt e set product='Geothermal - Electrical Generation (Other)' WHERE product='Geothermal - Electrical Generation, Other';
update fiscal_year_production_elt e set product='Geothermal - Electrical Generation (Thousands of Pounds)' WHERE product='Geothermal - Electrical Generation, Thousands of Pounds';
update fiscal_year_production_elt e set product='Geothermal - Sulfur (tons)' WHERE product='Geothermal - sulfur';

update fiscal_year_production_elt set product=REPLACE(product, ' ', '1spc1') ;
update fiscal_year_production_elt set product=REPLACE(product, '-', '1dsh1') ;
update fiscal_year_production_elt set product=REPLACE(product, '/', '1slsh1') ;
update fiscal_year_production_elt set product=REPLACE(product, '(', '1oprn1') ;
update fiscal_year_production_elt set product=REPLACE(product, ')', '1cprn1') ;
update fiscal_year_production_elt set product=initcap(product) ;
update fiscal_year_production_elt set product=REPLACE(product, '1oprn1', '(') ;
update fiscal_year_production_elt set product=REPLACE(product, '1cprn1', ')') ;
update fiscal_year_production_elt set product=REPLACE(product, '1slsh1', '/') ;
update fiscal_year_production_elt set product=REPLACE(product, '1dsh1', '-') ;
update fiscal_year_production_elt set product=REPLACE(product, '1spc1', ' ') ;

\echo 'Clean up offshore region'
update fiscal_year_production_elt set offshore_region='Alaska',fips_code='AKR',  county='', state='' where offshore_region='Offshore Alaska';
update fiscal_year_production_elt set offshore_region='Pacific', fips_code='POR',  county='', state='' where offshore_region='Offshore Pacific';
update fiscal_year_production_elt set offshore_region='Atlantic',  fips_code='AOR',  county='', state='' where offshore_region='Offshore Atlantic';
update fiscal_year_production_elt set offshore_region='Gulf of Mexico', fips_code='GMR', county='', state='' where offshore_region='Offshore Gulf';



\echo 'Insert location records'
insert into location (land_class, land_category,  state, county, fips_code, offshore_region)
select
       	COALESCE(land_class,'') as land_class,
	COALESCE(land_category,'')  as land_category,
	COALESCE(state,'')  as state,
	COALESCE(county,'')  as county,
	COALESCE(fips_code,'')  as fips_code,
	COALESCE(offshore_region,'')  as offshore_region
from fiscal_year_production_elt
group by  land_class, land_category, land_category,  state, county, fips_code, offshore_region
on conflict DO NOTHING;



\echo 'Insert commodity records'
insert into commodity (commodity, product, commodity_order)
select
        case when product like '%(%' then COALESCE(SPLIT_PART(product,' (', 1), '')
	     when product like '%-%' then COALESCE(SPLIT_PART(product,' - ', 1), '')
	     ELSE product END as commodity,
        COALESCE(product, '') as product,
	CASE WHEN product is null  then 'ZZZ' 
	WHEN product like 'Oil%' then '1' 
	WHEN product like 'Gas%' then '2'
        WHEN product like 'Coal%' then '5' 
        ELSE substr(product, 1,5) END
from fiscal_year_production_elt
group by  product
-- limit 10
on conflict DO NOTHING;

\echo 'Insert period records'

insert into period (period, calendar_year, fiscal_year, month, month_long, month_short, fiscal_month, period_date )
select
        'Fiscal Year',
	to_number(fiscal_year, '9999'),
	to_number(fiscal_year, '9999'),
	0,
	'',
	'',
	0,
	to_date(concat('01/01/',fiscal_year), 'MM/DD/YYYY')
from fiscal_year_production_elt
group by fiscal_year order by fiscal_year
on conflict DO NOTHING;

\echo 'Insert production fact records'
insert into production (  location_id ,period_id, commodity_id, volume,  unit, unit_abbr, duplicate_no)
select
location_id,
period_id,
commodity_id,
to_number(volume, 'L999G999G999G999D99'),
COALESCE(SUBSTR(SPLIT_PART(SPLIT_PART(e.product,' (', 2),')',1),1,20),''),
COALESCE(SUBSTR(SPLIT_PART(SPLIT_PART(e.product,' (', 2),')',1),1,5),''),
count(*) as cnt
from fiscal_year_production_elt e

    join location l
     on COALESCE(e.land_class,'') = l.land_class 
     and COALESCE(e.land_category,'') = l.land_category
     and COALESCE(e.state,'') = l.state
     and COALESCE(e.county,'') = l.county
     and COALESCE(e.fips_code,'') = l.fips_code
     and COALESCE(e.offshore_region,'') = l.offshore_region
    join commodity c
     on
     case when e.product like '%(%' then COALESCE(SPLIT_PART(e.product,' (', 1), '')
	     when e.product like '%-%' then COALESCE(SPLIT_PART(e.product,' - ', 1), '')
	     ELSE e.product END = c.commodity
     AND COALESCE(e.product, '')  = c.product
     and c.mineral_lease_type=''	

     join period p
     on
       'Fiscal Year'= p.period
       AND TO_DATE(concat('01 ','/01/',e.fiscal_year), 'MM/DD/YYYY') = p.period_date
group by location_id, period_id, commodity_id, volume, e.product;
