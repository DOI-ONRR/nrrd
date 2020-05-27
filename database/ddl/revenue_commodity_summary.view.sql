


-- CREATE OR REPLACE VIEW "public"."revenue_commodity_summary" AS 
( SELECT
       fips_code AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text) and ((location.region_type)::text = 'Offshore'::text)
  GROUP BY fips_code, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION
( SELECT
       state AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text) and ((location.region_type)::text = 'County'::text)
  GROUP BY state, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION


( SELECT
        location.fips_code AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)and ((location.region_type)::text = 'County'::text)
  GROUP BY  location.fips_code, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION
( SELECT 'Nationwide Federal'::text AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
  GROUP BY 'Nationwide Federal'::text, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, 'Nationwide Federal'::text, (sum(revenue.revenue)) DESC)
UNION
( SELECT 'Native American'::text AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
  GROUP BY 'Native American'::text, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, 'Native American'::text, (sum(revenue.revenue)) DESC);






