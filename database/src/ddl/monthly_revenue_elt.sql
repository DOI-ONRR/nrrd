
drop table if exists monthly_revenue_elt;
create table monthly_revenue_elt (
accept_date  date not null,
land_class_code varchar(255),
land_category_code_desc varchar(255),
state varchar(255),
county_code_desc varchar(255),
fips_code varchar(255) default 'NTL',
agency_state_region_code_desc varchar(255),
revenue_type varchar(255),
mineral_production_code_desc varchar(255),
commodity varchar(255),
product_code_desc varchar(255),
revenue varchar(255)
)
