truncate table  monthly_production_elt;
delete from production where period_id in (select period_id from period where period='Monthly');

-- \copy monthly_production_elt (month, calendar_year, land_class, land_category, commodity, volume) FROM './static/csv/production/monthly_production.csv' WITH  DELIMITER ',' CSV HEADER;

\copy monthly_production_elt (period_date, land_class, land_category, commodity, volume) FROM './static/csv/production/monthly_production.csv' WITH  DELIMITER ',' CSV HEADER;


update monthly_production_elt set commodity=REPLACE(commodity,'(ton)','(tons)') where commodity like 'Coal%';


\echo 'delete empty rows'
delete from monthly_production_elt where period_date is null
and land_class is null
and land_category is null
and commodity is null
and volume is null;

\echo 'Formated volume'
update monthly_production_elt set volume=REPLACE(volume, '(','-');
update monthly_production_elt set volume=REPLACE(volume, ')',''); 


\echo 'Insert location records'
insert into location (land_class, land_category,  state, county, fips_code, offshore_region) select
       	COALESCE(land_class,'') as land_class,
	COALESCE(land_category,'')  as land_category,
	CASE WHEN land_class = 'Federal' then 'Nationwide'
	ELSE 'Native American' END as state,
	''  as county,
        CASE WHEN land_class = 'Federal' then 'NL'
	ELSE 'NA' END as  fips_code,
	''
from monthly_production_elt
group by  land_class, land_category
on conflict DO NOTHING;



\echo 'Insert commodity records'
insert into commodity (mineral_lease_type, commodity, product, commodity_order)  select
	'' as  mineral_lease_type,
        SPLIT_PART(commodity,' Prod Vol', 1) as commodity,
        COALESCE(REPLACE(commodity, 'Prod Vol ',''),'') as product,
	CASE WHEN commodity is null  then 'ZZZ' 
	WHEN commodity like 'Oil%' then '1' 
	WHEN commodity like 'Gas%' then '2'
        WHEN commodity like 'Coal%' then '5' 
        ELSE substr(commodity, 1,5) END
from monthly_production_elt
group by  commodity
-- limit 10
on conflict DO NOTHING;

\echo 'Insert period records'

insert into period (period, calendar_year, fiscal_year, month, month_long, month_short, fiscal_month, period_date )
select
        'Monthly',
	extract(year from period_date) as calendar_year,
	extract(year from period_date + interval '3 months') as  fiscal_year,
	extract(month from period_date) as month,	
	trim(to_char(period_date, 'Month')) as month_long,
	trim(to_char(period_date, 'Mon')) as month_short,
	extract(month from period_date + interval '3 months') as fiscal_month,	
	period_date
from (select  period_date 
from monthly_production_elt group by period_date) table1
group by period_date,month, calendar_year order by period_date
on conflict DO NOTHING;

\echo 'Insert production fact records'
insert into production (  location_id ,period_id, commodity_id, volume, unit, unit_abbr, duplicate_no)
select
location_id,
period_id,
commodity_id,
to_number(volume, 'L999G999G999G999D99'),
REPLACE(REPLACE(SPLIT_PART(e.commodity,'Prod Vol ', 2),'(',''),')',''),
REPLACE(REPLACE(SPLIT_PART(e.commodity,'Prod Vol ', 2),'(',''),')',''),
count(*) as cnt
from monthly_production_elt e

    join location l
     on COALESCE(e.land_class,'') = l.land_class 
     and COALESCE(e.land_category,'') = l.land_category
     and (CASE WHEN e.land_class = 'Federal' then 'Nationwide'
     ELSE 'Native American' END) =  l.state
     join commodity c
     on
     SPLIT_PART(e.commodity,' ',1 )  = c.commodity
     AND  COALESCE(REPLACE(e.commodity, 'Prod Vol ',''),'') = c.product
     and c.mineral_lease_type=''

     join period p
     on
       'Monthly'= p.period
       AND e.period_date = p.period_date
group by location_id, period_id, commodity_id, volume, e.commodity;
