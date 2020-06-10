CREATE OR REPLACE VIEW "public"."revenue_type_summary" AS 

 ( SELECT
              location.fips_code AS state_or_area,
            period.fiscal_year,
            commodity.revenue_type,          
            sum(revenue.revenue) AS total
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_category)::text = 'Offshore'::text))
          GROUP BY location.fips_code, period.fiscal_year , commodity.revenue_type
          ORDER BY fiscal_year, fips_code
) UNION(

              location.state AS state_or_area,
            period.fiscal_year,
            commodity.revenue_type,          
            sum(revenue.revenue) AS total
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.state)::text <> ''))                   GROUP BY location.state, period.fiscal_year , commodity.revenue_type    
          ORDER BY fiscal_year, state

 ) UNION (

         location.fips_code AS state_or_area,
            period.fiscal_year,
            commodity.revenue_type,          
            sum(revenue.revenue) AS total
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.county)::text <> ''))                   GROUP BY location.fips_code, period.fiscal_year , commodity.revenue_type    
          ORDER BY fiscal_year, fips_code

)
UNION
( SELECT 'Nationwide Federal'::text AS state_or_area,
    period.fiscal_year,
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
  GROUP BY 'Nationwide Federal'::text, period.fiscal_year, commodity.revenue_type
  ORDER BY period.fiscal_year, 'Nationwide Federal'::text, (sum(revenue.revenue)) DESC)
UNION
( SELECT 'Native American'::text AS state_or_area,
    period.fiscal_year,
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
  GROUP BY 'Native American'::text, period.fiscal_year, commodity.revenue_type
  ORDER BY period.fiscal_year, 'Native American'::text, (sum(revenue.revenue)) DESC);
