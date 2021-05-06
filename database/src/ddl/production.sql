drop table if exists production ;
CREATE TABLE  IF NOT EXISTS
production( 
  location_id integer references location, 
  period_id integer references period, 
  commodity_id integer references commodity,
  volume numeric,
  unit varchar(20) default '',
  unit_abbr varchar(5) default '',
  duplicate_no integer default 0,
  primary key (location_id, period_id, commodity_id)
  
)
