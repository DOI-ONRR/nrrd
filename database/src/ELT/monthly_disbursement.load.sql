truncate table  monthly_disbursement_elt;
delete from disbursement where period_id in (select period_id from period where period='Monthly');

\copy monthly_disbursement_elt (month,calendar_year,fund_type,land_category,disbursement_type,state ,county,commodity,category,disbursement) FROM './static/csv/disbursements/monthly_disbursements.csv' WITH  DELIMITER ',' CSV HEADER;


\echo 'Update NULLS to \'\' '
update monthly_disbursement_elt set fund_type = COALESCE(fund_type,''),
                              disbursement_type = COALESCE(disbursement_type,''), 
                              land_category = COALESCE(land_category,''),
                              state = COALESCE(state,''), 
                              county = COALESCE(county,''),
                              fund_class = COALESCE(fund_class,''),
                              recipient = COALESCE(recipient,''),	
                              category = COALESCE(category,'')
			      ;

\echo 'Formated disbursement'
update monthly_disbursements_elt set disbursement=REPLACE(disbursement, '(','-');
update monthly_disbursements_elt set disbursement=REPLACE(disbursement, ')','');

\echo update fund_class and recipient
update  monthly_disbursement_elt set fund_type='Lease Process Improvement (BLM)' where fund_type='BLM - Permit Processing and Improvement' 
;

update monthly_disbursement_elt set fund_class='Other funds' where fund_type != '' and fund_class = '';
update monthly_disbursement_elt set fund_class='Native American tribes and individuals', recipient='Native American tribes and individuals' where fund_type = 'U.S. TreasuryAI' or fund_type='American Indian Tribes' or fund_type='Native American Tribes & Allottees' ;

update  monthly_disbursement_elt set fund_class='U.S. Treasury' , recipient='U.S. Treasury' where fund_type='U.S. Treasury' or fund_type='U.S. Treasury - GoMESA';


update monthly_disbursement_elt set fund_class='Historic Preservation Fund' , recipient='Historic Preservation Fund' where fund_type='Historic Preservation Fund';

update monthly_disbursement_elt set fund_class='Historic Preservation Fund' , recipient='Historic Preservation Fund' where fund_type='Historic Preservation Fund';
update monthly_disbursement_elt set fund_class='Historic Preservation Fund' , recipient='Historic Preservation Fund' where fund_type='Historic Preservation Fund';

update monthly_disbursement_elt set fund_class='State and local governments' , recipient='State' where fund_type='State' and county='';
update monthly_disbursement_elt set fund_class='State and local governments' , recipient='County' where fund_type='State' and county != '';


update monthly_disbursement_elt set fund_class='State and local governments' , recipient='State' where fund_type='State 8(g)' and county = '';
update monthly_disbursement_elt set fund_class='State and local governments' , recipient='County' where fund_type='State 8(g)' and county != '';

update monthly_disbursement_elt set fund_class='U.S. Treasury' , recipient='U.S. Treasury' where lower(fund_type) like 'u.s.%gomesa%' and county='';
update monthly_disbursement_elt set fund_class='State and local governments' , recipient='State' where lower(fund_type) like 'state%gomesa%' and county='';
update monthly_disbursement_elt set fund_class='State and local governments' , recipient='County' where lower(fund_type)='%gomesa%' and county != '';


update monthly_disbursement_elt set fund_class='Land and Water Conservation Fund' , recipient='Land and Water Conservation Fund - GoMesa' where fund_type='Land & Water Conservation Fund - GoMesa' or fund_type='Land & Water Conservation Fund - GoMESA';
update monthly_disbursement_elt set fund_class='Land and Water Conservation Fund' , recipient='Land and Water Conservation Fund' where fund_type='Land & Water Conservation Fund';

update  monthly_disbursement_elt set fund_class='Reclamation Fund',  recipient='Reclamation Fund' where fund_type='Reclamation Fund' or fund_type='Reclamation'
;


update monthly_disbursement_elt set fund_class='Other funds', recipient=fund_type where fund_type not in ('','Historic Preservation Fund',  'U.S. Treasury - GoMESA', 'U.S. Treasury', 'State', 'U.S. TreasuryAI','American Indian Tribes','Native American Tribes & Allottees') and fund_class='' and recipient='';

\echo 'Update revenue type'
update monthly_revenue_elt set revenue_type=REPLACE(revenue_type, ' ', '1spc1') ;
update monthly_revenue_elt set revenue_type=initcap(revenue_type) ;
update monthly_revenue_elt set revenue_type=REPLACE(revenue_type, '1spc1', ' ') ;

\echo 'Update county and fips_code'
update monthly_disbursement_elt set county='Hidalgo County' where county='Hidalgo Caounty';
update monthly_disbursement_elt set county=COALESCE(REPLACE(REPLACE(REPLACE(county,' county', ''),' parish',''), ' borough',''),'');
update monthly_disbursement_elt set county=COALESCE(REPLACE(REPLACE(REPLACE(county,' County', ''),' Parish',''), ' Borough',''),'');
update monthly_disbursement_elt set county=COALESCE(REPLACE(REPLACE(REPLACE(county,' County', ''),' Parish',''), ' Borough',''),'');
update monthly_disbursement_elt e set fips_code = l.fips_code FROM county_lookup l WHERE e.county=l.county and e.state=l.state;

\echo 'Update commodity'
update monthly_disbursement_elt set commodity=REPLACE(commodity, 'CO2', 'Carbon dioxide') where commodity like 'CO2%';
update monthly_disbursement_elt set commodity=REPLACE(commodity,'Carbon Dioxide','Carbon dioxide') where commodity like 'Carbon Dioxide%';
update monthly_disbursement_elt set commodity=REPLACE(commodity, 'NGL', 'Natural gas liquids') where commodity like 'NGL%';
update monthly_disbursement_elt set commodity=REPLACE(commodity, 'Oil & Gas', 'Oil & gas (pre-production)') where commodity like 'Oil & Gas%';

update monthly_disbursement_elt set commodity=REPLACE(commodity, ' ', '1spc1') ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, '-', '1dsh1') ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, '/', '1slsh1') ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, '(', '1oprn1') ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, ')', '1cprn1') ;
update monthly_disbursement_elt set commodity=initcap(commodity) ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, '1dsh1','-') ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, '1slsh1', '/') ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, '1oprn1','(') ;
update monthly_disbursement_elt set commodity=REPLACE(commodity, '1cprn1', ')') ;

update monthly_disbursement_elt set commodity=REPLACE(commodity, '1spc1', ' ') ;


\echo 'Insert location records'
insert into location (land_class, land_category,  state, county, fips_code) select
      	CASE WHEN fund_type = 'Native American Tribes & Allottees' or fund_type='U.S. TreasuryAI' THEN 'Native American' ELSE 'Federal' END as land_class,
	COALESCE(land_category,'')  as land_category,
	COALESCE(state,'') ,
	COALESCE(county,'')  as county,
	COALESCE(fips_code,'')
from monthly_disbursement_elt
group by  land_class, land_category, state, county, fips_code
on conflict DO NOTHING;

\echo 'Insert revenue type and source into fund table'
insert into fund (fund_type, fund_class, recipient, revenue_type, source, disbursement_type)  select
       	COALESCE(fund_type,''),
       	COALESCE(fund_class,''),
       	COALESCE(recipient,''),
        COALESCE(category,''),
	CASE WHEN disbursement_type='8(g)' then '8(g) offshore'
	WHEN 	  disbursement_type like '%GoMESA%' or disbursement_type like '%GOMESA%' Then 'GOMESA offshore'
 	ELSE COALESCE(land_category,'') END,
	COALESCE(disbursement_type,'')	
from monthly_disbursement_elt
group by fund_type,fund_class, recipient, category, land_category, disbursement_type
-- limit 10
on conflict DO NOTHING;


\echo 'Insert commodity records'
insert into commodity (mineral_lease_type, commodity, product, commodity_order)  select
         '', 
	COALESCE(commodity,'Not tied to a commodity'),
	COALESCE(commodity, ''),
	CASE WHEN commodity is null  then 'ZZZ' 
	WHEN commodity='Oil' then '1' 
	WHEN commodity='Gas' then '2'
     	WHEN commodity='Oil & Gas' then '3' 
       	WHEN commodity='NGL' then '4' 
        WHEN commodity='Coal' then '5' 
	     ELSE substr(commodity, 1,5) END
from monthly_disbursement_elt
group by commodity
-- limit 10
on conflict DO NOTHING;


\echo 'Insert period records'

insert into period (period, calendar_year, fiscal_year, month, month_long, month_short, fiscal_month, period_date )
select
        'Monthly',
	calendar_year,
	extract(year from period_date + interval '3 months') as  fiscal_year,
	extract(month from period_date) as month,	
	month as month_long,
	to_char(period_date, 'Mon') as month_short,
	extract(month from period_date + interval '3 months') as fiscal_month,	
	period_date
from (select month, calendar_year,
to_date(concat('01 ',month,' ',calendar_year), 'DD Month YYYY') as period_date 
from monthly_disbursement_elt group by month, calendar_year) table1
group by period_date,month, calendar_year order by period_date
on conflict DO NOTHING;




\echo 'Insert monthly disbursement fact records'



insert into disbursement (  location_id ,period_id, commodity_id, fund_id, disbursement, unit, unit_abbr, duplicate_no)
select
location_id,
period_id,
commodity_id,
fund_id,
sum(to_number(disbursement, 'L999G999G999G999D99')),
'dollars',
'$',
count(*) as cnt
from monthly_disbursement_elt e
     join location l
     on
     CASE WHEN e.fund_type = 'Native American Tribes & Allottees' or fund_type='U.S. TreasuryAI' THEN 'Native American' ELSE 'Federal' END = l.land_class
     and COALESCE(e.land_category,'') = l.land_category
     and COALESCE(e.state,'')=l.state
     and  COALESCE(e.county,'') = l.county
     and COALESCE(e.fips_code,'') = l.fips_code
     and l.offshore_region=''

     

     join fund f
         on e.fund_type=f.fund_type
     	 and e.category=f.revenue_type
	 and CASE WHEN e.disbursement_type='8(g)' then '8(g) offshore'
	WHEN 	  e.disbursement_type like '%GoMESA%' or e.disbursement_type like '%GOMESA%' Then 'GOMESA offshore'
 	ELSE COALESCE(e.land_category,'') END = f.source
	 and COALESCE(e.fund_class, '') =f.fund_class
	 and COALESCE(e.recipient,'')=f.recipient
 	 and COALESCE(e.disbursement_type,'')=f.disbursement_type	

     join commodity c
	on COALESCE(e.commodity,'Not tied to a commodity') = c.commodity
	AND COALESCE(e.commodity, '') = c.product
	and mineral_lease_type=''


     join period p
          on
       'Monthly'= p.period
       AND TO_DATE(concat('01 ',e.month,' ',e.calendar_year), 'DD Month YYYY') = p.period_date
	 

group by location_id, period_id, commodity_id, 
fund_id
;

	 
