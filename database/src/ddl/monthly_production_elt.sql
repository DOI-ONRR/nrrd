
drop table if exists monthly_production_elt;
create table monthly_production_elt (
month  varchar(255),
calendar_year varchar(255),
land_class varchar(255),
land_category varchar(255),
commodity varchar(255),
volume varchar(255)
)
