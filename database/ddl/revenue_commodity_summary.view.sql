


 CREATE OR REPLACE VIEW "public"."revenue_commodity_summary" AS 
( SELECT period.period,
       fips_code AS state_or_area,
CASE WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year ELSE period.calendar_year END AS year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((location.region_type)::text = 'Offshore'::text)
  GROUP BY fips_code, period.period, period.calendar_year,  period.fiscal_year, commodity.commodity
  ORDER BY period.calendar_year, period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION
( SELECT
       period.period,  
       state AS state_or_area,
       CASE WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year ELSE period.calendar_year END AS year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE  ((location.region_type)::text = 'County'::text)
  GROUP BY state,   period.period, period.calendar_year, period.fiscal_year, commodity.commodity
  ORDER BY period.calendar_year, period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION


( SELECT
        period.period,
        location.fips_code AS state_or_area,
    CASE WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year ELSE period.calendar_year END AS year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((location.region_type)::text = 'County'::text)
  GROUP BY  location.fips_code, period.period, period.calendar_year, period.fiscal_year, commodity.commodity
  ORDER BY period.calendar_year, period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION
( SELECT period.period,
    'Nationwide Federal'::text AS state_or_area,
    CASE WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year ELSE period.calendar_year END AS year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ( ((location.land_class)::text = 'Federal'::text))
  GROUP BY 'Nationwide Federal'::text, period.period, period.calendar_year, period.fiscal_year, commodity.commodity
  ORDER BY  period.calendar_year, period.fiscal_year, 'Nationwide Federal'::text, (sum(revenue.revenue)) DESC)
UNION
(  SELECT
    period.period,
   'Native American'::text AS state_or_area,
    CASE WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year ELSE period.calendar_year END AS year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE (((location.land_class)::text = 'Native American'::text))
  GROUP BY 'Native American'::text, period.period, period.calendar_year, period.fiscal_year, commodity.commodity
  ORDER BY period.calendar_year, period.fiscal_year, 'Native American'::text, (sum(revenue.revenue)) DESC);






