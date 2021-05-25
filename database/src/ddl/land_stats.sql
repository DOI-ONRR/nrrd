drop table if exists land_stats;
create table land_stats (
location  varchar(255),
total_acres bigint,
federal_acres bigint,
federal_percent numeric
);
