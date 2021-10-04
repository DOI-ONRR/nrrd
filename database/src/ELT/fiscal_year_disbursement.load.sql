truncate table  fiscal_year_disbursement_elt;
delete from disbursement where period_id in (select period_id from period where period='Fiscal Year');

\copy fiscal_year_disbursement_elt (fiscal_year,fund_type,land_category,state ,county,disbursement) FROM './static/csv/disbursements/disbursements.csv' WITH  DELIMITER ',' CSV HEADER;

-- Fiscal Year,Fund Type,Onshore/Offshore,State,County, Total

\echo 'Update NULLS to \'\' '
update fiscal_year_disbursement_elt set fund_type = COALESCE(fund_type,''),
                              land_category = COALESCE(land_category,''),
                              fund_class = COALESCE(fund_class,''),
                              recipient = COALESCE(recipient,''),	
                              state = COALESCE(state,''), 
                              county = COALESCE(county,'')
			      ;


\echo 'Formated disbursement'
update fiscal_year_disbursement_elt set disbursement=REPLACE(disbursement, '(','-');
update fiscal_year_disbursement_elt set disbursement=REPLACE(disbursement, ')','');

\echo update fund_class and recipient


update fiscal_year_disbursement_elt set fund_class='Other funds' where fund_type != '' and fund_class = '';

update fiscal_year_disbursement_elt set fund_class='Native American tribes and individuals', recipient='Native American tribes and individuals' where fund_type = 'U.S. TreasuryAI' or fund_type='American Indian Tribes' or fund_type='Native American Tribes & Allottees' ;

update  fiscal_year_disbursement_elt set fund_class='U.S. Treasury' , recipient='U.S. Treasury' where fund_type='U.S. Treasury' or fund_type='U.S. Treasury - GoMESA';


update fiscal_year_disbursement_elt set fund_class='Historic Preservation Fund' , recipient='Historic Preservation Fund' where fund_type='Historic Preservation Fund';

update fiscal_year_disbursement_elt set fund_class='State and local governments' , recipient='State' where fund_type='State' and county='';
update fiscal_year_disbursement_elt set fund_class='State and local governments' , recipient='County' where fund_type='State' and county != '';

update fiscal_year_disbursement_elt set fund_class='State and local governments' , recipient='State' where fund_type='State 8(g)' and county = '';
update fiscal_year_disbursement_elt set fund_class='State and local governments' , recipient='County' where fund_type='State 8(g)' and county != '';

update fiscal_year_disbursement_elt set fund_class='U.S. Treasury' , recipient='U.S. Treasury' where lower(fund_type) like 'u.s.%gomesa%' and county='';
update fiscal_year_disbursement_elt set fund_class='State and local governments' , recipient='State' where lower(fund_type) like 'state%gomesa%' and county='';
update fiscal_year_disbursement_elt set fund_class='State and local governments' , recipient='County' where lower(fund_type) like '%gomesa%' and county != '';



update  fiscal_year_disbursement_elt  set fund_class='Land and Water Conservation Fund' , recipient='Land and Water Conservation Fund - GoMesa' where fund_type='Land & Water Conservation Fund - GoMesa' or fund_type='Land & Water Conservation Fund - GoMESA';

update fiscal_year_disbursement_elt set fund_class='Land and Water Conservation Fund' , recipient='Land and Water Conservation Fund' where fund_type='Land & Water Conservation Fund';


update  fiscal_year_disbursement_elt set fund_class='Reclamation Fund',  recipient='Reclamation Fund' where fund_type='Reclamation Fund' or fund_type='Reclamation'
;


update fiscal_year_disbursement_elt set fund_class='Other funds', recipient=fund_type where fund_type not in ('','Historic Preservation Fund',  'U.S. Treasury - GoMESA', 'U.S. Treasury', 'State', 'U.S. TreasuryAI','American Indian Tribes','Native American Tribes & Allottees','Land & Water Conservation Fund - GoMesa','Land & Water Conservation Fund' ) and fund_class='' and recipient='';


\echo 'Update county and fips_code'

update fiscal_year_disbursement_elt set county=COALESCE(REPLACE(REPLACE(REPLACE(county,' County', ''),' Parish',''), ' Borough',''),'');
update fiscal_year_disbursement_elt e set fips_code = l.fips_code FROM county_lookup l WHERE e.county=l.county and e.state=l.state;


\echo 'Insert location records'
insert into location (land_class, land_category,  state, county, fips_code)
select
      	CASE WHEN fund_type = 'Native American Tribes & Allottees' or fund_type='U.S. TreasuryAI' THEN 'Native American' ELSE 'Federal' END as land_class,
	COALESCE(e.land_category,'')  as land_category,
	COALESCE(e.state,'') ,
	e.county,
	COALESCE(e.fips_code,'')
from fiscal_year_disbursement_elt e
group by
e.fund_type, e.land_category, e.state, e.county, e.fips_code
on conflict DO NOTHING;

\echo 'Insert revenue type and source into fund table'

insert into fund (fund_type, fund_class, recipient, source)  select
       	COALESCE(fund_type,''),
	COALESCE(fund_class,''),
	COALESCE(recipient,''),
	CASE WHEN fund_type='State 8(g)' then '8(g) offshore'
	WHEN 	  fund_type like '%GoMESA%' or fund_type like '%GOMESA%' Then 'GOMESA offshore'
 	ELSE COALESCE(land_category,'') END
from fiscal_year_disbursement_elt
group by fund_type, fund_class, recipient, land_category
-- limit 10
on conflict DO NOTHING;


\echo 'Insert commodity records'
insert into commodity (commodity, commodity_order) values ('Not tied to a commodity', 'ZZZ') on conflict DO NOTHING;



\echo 'Insert period records'

insert into period (period, calendar_year, fiscal_year, month, month_long, month_short, fiscal_month, period_date )
select
        'Fiscal Year',
	fiscal_year,	
	fiscal_year,	
	0,
	'',
	'',
	0,
	to_date(concat('01/01/',fiscal_year), 'MM/DD/YYYY') as period_date 
from fiscal_year_disbursement_elt 
group by fiscal_year
on conflict DO NOTHING;




\echo 'Insert disbursement fact records'



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
from fiscal_year_disbursement_elt e
     join location l
     on
     CASE WHEN e.fund_type = 'Native American Tribes & Allottees' or fund_type='U.S. TreasuryAI' THEN 'Native American' ELSE 'Federal' END = l.land_class
     and COALESCE(e.land_category,'') = l.land_category
     and COALESCE(e.state,'')=l.state
     and COALESCE(e.county,'') = l.county
     and COALESCE(e.fips_code,'') = l.fips_code
     and l.offshore_region=''
     
     join fund f
         on COALESCE(e.fund_type,'')=f.fund_type
	 and CASE WHEN e.fund_type='State 8(g)' then '8(g) offshore'
	WHEN 	  e.fund_type like '%GoMESA%' or e.fund_type like '%GOMESA%' Then 'GOMESA offshore'
 	ELSE COALESCE(e.land_category,'') END = f.source
	and COALESCE(e.fund_class, '') =f.fund_class
	and COALESCE(e.recipient,'')=f.recipient
        and f.revenue_type=''


     join commodity c
         on c.commodity='Not tied to a commodity'
	 and c.mineral_lease_type=''
     join period p
          on
       'Fiscal Year'= p.period
       AND TO_DATE(concat('01/01/',e.fiscal_year), 'MM/DD/YYYY') = p.period_date
	 

group by location_id, period_id, commodity_id, 
fund_id;



\echo 'summarize monthly disbursement fact records into fiscal year'


delete from disbursement where period_id in (select period_id from disbursement join period using (period_id) 
where period='Fiscal Year' and fiscal_year in (select
distinct fiscal_year
from disbursement join period using (period_id)
where period='Monthly' and fiscal_month=12)) ;




insert into disbursement(location_id, period_id, commodity_id, fund_id, disbursement, unit, unit_abbr, duplicate_no)
 select t1.location_id,t2.period_id,t1.commodity_id, t1.fund_id,t1.disbursement, 'dollars', '$', 1
from (select disbursement.location_id, disbursement.commodity_id,
disbursement.fund_id, sum(disbursement) as disbursement , fiscal_year
from disbursement join period using (period_id)
where fiscal_year in (select distinct fiscal_year
from disbursement join period using (period_id)
where period='Monthly' and fiscal_month=12) and period='Monthly'
group by  fiscal_year, disbursement.location_id, disbursement.commodity_id, disbursement.fund_id) t1 join
(
select period_id, fiscal_year, period from period
where fiscal_year in
(select distinct fiscal_year
from disbursement join period using (period_id)
where period='Monthly' and fiscal_month=12) and period='Fiscal Year' ) t2 on (t1.fiscal_year=t2.fiscal_year);
