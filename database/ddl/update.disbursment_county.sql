
select l.fips_code, l.county, l.state, c.fips_code, c.county, c.state from location l join county_lookup c using(county,state) where length(l.fips_code) < 5 limit 100

ALTER TABLE location
DROP CONSTRAINT location_fips_code_state_county_land_class_land_category_of_key;

update location set fips_code=county_lookup.fips_code
from
county_lookup
where
location.fips_code != county_lookup.fips_code
and location.state=county_lookup.state
and location.county=county_lookup.county
;
