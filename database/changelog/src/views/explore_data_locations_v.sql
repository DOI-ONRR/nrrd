DROP view IF EXISTS explore_data_locations_v;

CREATE VIEW explore_data_locations_v AS
SELECT fips_code,
  location_name,
  state,
  state_name,
  county,
  region_type,
  district_type
FROM location l
WHERE region_type IN ('State', 'Offshore', 'County')
  AND NOT EXISTS (SELECT 1 FROM fips_counties_exceptions WHERE fips_code = l.fips_code)
  and fips_code != ''
UNION
SELECT l.fips_code,
  state_name || ', ' || e.title,
  state,
  state_name,
  e.title,
  region_type,
  district_type
FROM location l,
  fips_counties_exceptions e
WHERE region_type IN ('State', 'Offshore', 'County')
  AND e.fips_code = l.fips_code
ORDER BY fips_code;