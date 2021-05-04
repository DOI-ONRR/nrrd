truncate table  monthly_production_elt;
delete from production where period_id in (select period_id from period where period='Monthly');

\copy monthly_production_elt (month, calendar_year, land_class, land_category, commodity, volume) FROM './static/csv/production/monthly_production.csv' WITH  DELIMITER ',' CSV HEADER;

update monthly_production_elt set commodity=REPLACE(commodity,'(ton)','(tons)') where commodity like 'Coal%';


\echo 'delete empty rows'
delete from monthly_production_elt where month is null
and calendar_year is null 
and land_class is null
and land_category is null
and commodity is null
and volume is null;


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
	to_number(calendar_year, '9999'),
	extract(year from period_date + interval '3 months') as  fiscal_year,
	extract(month from period_date) as month,	
	month as month_long,
	to_char(period_date, 'Mon') as month_short,
	extract(month from period_date + interval '3 months') as fiscal_month,	
	period_date
from (select month, calendar_year,
to_date(concat('01 ',month,' ',calendar_year), 'DD Month YYYY') as period_date 
from monthly_production_elt group by month, calendar_year) table1
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
       AND TO_DATE(concat('01 ',e.month,' ',e.calendar_year), 'DD Month YYYY') = p.period_date
group by location_id, period_id, commodity_id, volume, e.commodity;
