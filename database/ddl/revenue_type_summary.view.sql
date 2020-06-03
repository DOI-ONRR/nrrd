CREATE OR REPLACE VIEW "public"."revenue_type_summary" AS 
( SELECT
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.state
        END AS state_or_area,
    period.fiscal_year,
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.state
        END, period.fiscal_year, commodity.revenue_type
  ORDER BY period.fiscal_year,
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.state
        END, (sum(revenue.revenue)) DESC)
UNION
( SELECT
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.fips_code
        END AS state_or_area,
    period.fiscal_year,
    commodity.revenue_type,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.fips_code
        END, period.fiscal_year, commodity.revenue_type
  ORDER BY period.fiscal_year,
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.fips_code
        END, (sum(revenue.revenue)) DESC)
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
