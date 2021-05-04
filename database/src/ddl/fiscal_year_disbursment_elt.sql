
drop table if exists fiscal_year_disbursement_elt;
create table fiscal_year_disbursement_elt (
fiscal_year integer,
fund_type varchar(255),
fund_class varchar(255),
fund_recipient varchar(255),
land_category varchar(255),
state varchar(255),
county varchar(255),
fips_code varchar(5),
disbursement varchar(255)
)
