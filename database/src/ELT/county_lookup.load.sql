
drop table if exists county_lookup;
create table county_lookup (
fips_code varchar(5),
county varchar(255),
state varchar(255)
);


\copy county_lookup(county,fips_code, state) FROM './static/csv/county_lookup.csv' WITH  DELIMITER ',' CSV HEADER;
