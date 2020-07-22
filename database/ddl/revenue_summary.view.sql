CREATE OR REPLACE VIEW "public"."revenue_summary" AS 
 SELECT
    a.period,
    a.location_name,
    a.location_type,
    a.land_category,
    a.year,
    a.location,
    a.commodity,
    a.total
   FROM (
          (
          SELECT 
            period.period,
            location.offshore_region AS location_name,
            'Offshore'::text AS location_type,
            location.land_category,
            case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
            location.fips_code AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (location.land_category)::text = 'Offshore'::text
          GROUP BY period.period, location.fips_code, location.offshore_region, location.land_category, location.region_type, commodity.commodity, period.fiscal_year, period.calendar_year
          )
          UNION
         (
         SELECT 
            period.period,
            location.state_name AS location_name,
            'State'::text AS location_type,
            location.land_category,
            case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
            location.state AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (location.state_name)::text <> ''::text
          GROUP BY period.period, location.state_name, 'State'::text, location.land_category, commodity.commodity, period.fiscal_year, period.calendar_year, location.state
        )
        UNION
        ( SELECT 
        period.period,
        location.location_name,
            'County'::text AS location_type,
            location.land_category,
            case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
            location.fips_code AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
            FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (location.region_type)::text = 'County'::text
          GROUP BY period.period, location.fips_code, location.location_name, location.land_category,commodity.commodity, period.fiscal_year, period.calendar_year
       )
        UNION
        ( SELECT
            period.period,
           'Nationwide Federal'::text AS location_name,
            'Nationwide Federal'::text AS location_type,
            'Nationwide Federal'::character varying AS land_category,
            case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
            'Nationwide Federal'::text AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
            FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (location.land_class)::text = 'Federal'::text
          GROUP BY period.period, 'Nationwide Federal'::text, commodity.commodity, period.fiscal_year, period.calendar_year
          )
        UNION
        ( SELECT 
        period.period,
        'Native American'::text AS location_name,
            'Native American'::text AS location_type,
            'Native American'::character varying AS land_category,
            case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
            'Native American'::text AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (location.land_class)::text = 'Native American'::text
          GROUP BY  period.period, 'Native American'::text, commodity.commodity, period.fiscal_year, period.calendar_year
          )
        UNION
        ( SELECT 
            period.period,
            'Not tied to a lease'::text AS location_name,
            'State'::text AS location_type,
            'State'::character varying AS land_category,
            case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
            'State'::text AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE  ((location.land_class)::text <> 'Native American'::text) AND ((commodity.revenue_category)::text = 'Not tied to a lease'::text)
          GROUP BY period.period, 'State'::text, commodity.commodity, period.fiscal_year, period.calendar_year
          )
          ) a
  ORDER BY a.year, a.location;
