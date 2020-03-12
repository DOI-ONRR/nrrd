CREATE OR REPLACE VIEW "public"."distinct_locations" AS 
 SELECT DISTINCT location.state_name AS location,
    location.state AS location_id,
    1 AS sort_order
   FROM location
  WHERE (location.state_name IS NOT NULL)
UNION
 SELECT DISTINCT concat(location.county, ',  ', location.state_name) AS location,
    location.fips_code AS location_id,
    2 AS sort_order
   FROM location
  WHERE ((location.county IS NOT NULL) AND ((location.county)::text <> ''::text))
UNION
 SELECT DISTINCT location.offshore_region AS location,
    location.offshore_region AS location_id,
    3 AS sort_order
   FROM location
  WHERE (location.offshore_region IS NOT NULL)
  ORDER BY 3, 1;
