
drop table if exists monthly_disbursement_elt;
create table monthly_disbursement_elt (
month varchar(255),
calendar_year integer,
fund_type varchar(255),
fund_class varchar(255),
recipient varchar(255),
treasury_fund varchar(255),
land_category varchar(255),
disbursement_type varchar(255),
state varchar(255),
county varchar(255),
fips_code varchar(5),
commodity varchar(255),
category varchar(255),
disbursement varchar(255)
)
