drop table if exists disbursement ;
CREATE TABLE  IF NOT EXISTS
disbursement( 
  location_id integer references location, 
  period_id integer references period, 
  commodity_id integer references commodity,
   fund_id integer references fund,
  disbursement numeric,
  unit varchar(20) default '',
  unit_abbr varchar(5) default '',
  duplicate_no integer default 0,
  primary key (location_id, period_id, commodity_id,fund_id)
  
)
