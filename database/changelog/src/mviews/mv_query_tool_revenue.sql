CREATE MATERIALIZED VIEW mv_query_tool_revenue AS
SELECT r.revenue,
  f.revenue_type,
  c.commodity,
  l.land_type,
  l.county,
  CASE
    WHEN state IS NOT NULL THEN state
    WHEN offshore_region IS NOT NULL THEN offshore_region
    ELSE NULL
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
