
drop table if exists land_stats_elt;
create table land_stats_elt (
location  varchar(255),
total_acres varchar(255),
federal_acres varchar(255),
federal_percent  varchar(255)
);


truncate land_stats;

\copy land_stats_elt (location, total_acres, federal_acres, federal_percent) FROM './static/csv/land_stats.csv' WITH  DELIMITER ',' CSV HEADER;

\echo 'Insert into land_stats'
insert into land_stats (location, total_acres, federal_acres, federal_percent)
select
location,
to_number(total_acres, '9G999G999G999'),
to_number(federal_acres, '9G999G999G999'),
to_number(federal_percent, '99D9')
from land_stats_elt;


drop table if exists land_stats_elt;
