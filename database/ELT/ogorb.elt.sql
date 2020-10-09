
create table ogorb_tmp (
period_date date ,
land_category varchar(255),
land_class  varchar(255),
state varchar(255),
county varchar(255),
fips_code varchar(255),
offshore_region varchar(255),
disposition_code integer,
disposition_desc varchar(255),
product varchar(255),
raw_volume varchar(255),
row_number integer
);


\copy ogorb_tmp (period_date,land_category,land_class,state,county,fips_code, offshore_region, disposition_code, disposition_desc, product, raw_volume) FROM '~/Downloads/OGOR B Test File.csv' DELIMITER ',' CSV HEADER;

