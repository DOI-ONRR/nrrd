drop table if exists land_stats_elt;
create table land_stats_elt (
location  varchar(255),
total_acres varchar,
federal_acres varchar,
federal_percent varchar
);
