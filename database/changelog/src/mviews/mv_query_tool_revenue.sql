CREATE MATERIALIZED VIEW mv_query_tool_revenue AS
SELECT r.revenue,
  f.revenue_type,
  c.commodity,
  l.land_type,
  l.county,
  CASE
    WHEN l.region_type::text = 'County'::text THEN l.state_name
    WHEN l.region_type::text = 'Offshore'::text THEN concat('Offshore ', l.location_name)::character varying
    ELSE l.location_name
  END state_offshore_name,
  CASE
    WHEN l.county::text <> ''::text THEN CONCAT(l.state_name, ', ', l.county, ' ', l.district_type)
    ELSE NULL::text
  END county_name,
  l.location_order,
  p.calendar_year,
  p.fiscal_year,
  p.month_long,
  p."period"
FROM revenue r,
  period p,
  fund f,
  location l,
  commodity c
 WHERE p.period_id = r.period_id
   AND f.fund_id = r.fund_id
   AND l.location_id = r.location_id
   AND c.commodity_id = r.commodity_id;
