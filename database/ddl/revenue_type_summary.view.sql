CREATE OR REPLACE VIEW "public"."revenue_type_summary" AS 
( SELECT
    period.period,
    location.fips_code AS location,
    case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year,  
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
     JOIN commodity USING (commodity_id))
  WHERE  ((location.land_category)::text = 'Offshore'::text)
  GROUP BY period.period,  location.fips_code, period.fiscal_year, period.calendar_year, commodity.revenue_type
  ORDER BY period.fiscal_year, location.fips_code)
UNION
( SELECT period.period,
    location.state AS location,
    case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year,  
    commodity.revenue_type,
    sum(revenue.revenue) AS total    
   FROM (((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
     JOIN commodity USING (commodity_id))
  WHERE ((location.state)::text <> ''::text)
  GROUP BY period.period,  location.state, period.fiscal_year, period.calendar_year, commodity.revenue_type
  ORDER BY period.fiscal_year, location.state)
UNION
( SELECT
    period.period,
    location.fips_code AS location,
    case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year,  
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
     JOIN commodity USING (commodity_id))
  WHERE  (location.region_type)::text = 'County'::text
  GROUP BY period.period,  location.fips_code, period.fiscal_year, period.calendar_year, commodity.revenue_type       
  ORDER BY period.fiscal_year, location.fips_code)
UNION
( SELECT
 period.period,
'Nationwide Federal'::text AS location,
    case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year,  
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((location.land_class)::text = 'Federal'::text)
  GROUP BY period.period,  'Nationwide Federal'::text, period.fiscal_year,period.calendar_year, commodity.revenue_type
  ORDER BY period.fiscal_year, 'Nationwide Federal'::text, (sum(revenue.revenue)) DESC)
UNION
( SELECT period.period,
 'Native American'::text AS location,
    case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year,  
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((location.land_class)::text = 'Native American'::text)
  GROUP BY period.period, 'Native American'::text, period.fiscal_year, period.calendar_year, commodity.revenue_type
  ORDER BY period.fiscal_year,period.calendar_year, 'Native American'::text, (sum(revenue.revenue)) DESC);
