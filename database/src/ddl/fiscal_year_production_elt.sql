
drop table if exists calendar_year_production_elt;
create table calendar_year_production_elt (
calendar_year  varchar(255),
land_category varchar(255),
land_class varchar(255),
state varchar(255),
county varchar(255),
fips_code varchar(255),
offshore_region varchar(255),
product varchar(255),
volume varchar(255)
)
