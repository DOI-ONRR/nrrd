CREATE OR REPLACE VIEW "public"."fiscal_revenue_summary" AS 
 SELECT a.location_name,
    a.location_type,
    a.land_category,
    a.fiscal_year,
    a.state_or_area,
    a.sum,
    a.distinct_commodities
   FROM (
            (select  location_name,
            'Offshore'::text as location_type,
             location.land_category,
             period.fiscal_year,
             offshore_planning_area_code as state_or_area
             sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
            FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text and location.land_category='Offshore') 
             GROUP BY offshore_planning_area_code,location_name, region_type, fiscal_year
            )
            UNION
         ( SELECT
           location.state_name AS location_name,
            'State'::text AS location_type,
            location.land_category,
            period.fiscal_year,
            location.state as state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
           WHERE ((period.period)::text = 'Fiscal Year'::text  and state_name != '')
          GROUP BY location.state_name, location_type, location.land_category, period.fiscal_year, location.state  
             )
        UNION
        ( SELECT location.location_name,
            'County'::text AS location_type,
            location.land_category,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND location.region_type='County')
          GROUP BY location.fips_code, location.location_name, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year, location.fips_code)
        UNION
        ( SELECT 'Nationwide Federal'::text AS location_name,
            'Nationwide Federal'::text AS location_type,
            'Nationwide Federal'::character varying AS land_category,
            period.fiscal_year,
            'Nationwide Federal'::text AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
          GROUP BY 'Nationwide Federal'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Nationwide Federal'::text)
        UNION
        ( SELECT 'Naive American'::text AS location_name,
            'Naive American'::text AS location_type,
            'Native American'::character varying AS land_category,
            period.fiscal_year,
            'Native American'::text AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
          GROUP BY 'Native American'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Native American'::text)) a
  ORDER BY a.fiscal_year, a.state_or_area;








