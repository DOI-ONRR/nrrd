drop table if exists revenue ;
CREATE TABLE  IF NOT EXISTS
revenue( 
  location_id integer references location, 
  period_id integer references period, 
  commodity_id integer references commodity,
  fund_id integer references fund,
  revenue numeric,
  unit varchar(20) default 'dollars',
  unit_abbr varchar(5) default '$',
  duplicate_no integer default 0,
  primary key (location_id, period_id, commodity_id, fund_id)
  
)
