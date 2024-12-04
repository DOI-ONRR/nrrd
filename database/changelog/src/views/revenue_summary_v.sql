DROP view IF EXISTS revenue_summary;

CREATE VIEW revenue_summary AS
SELECT a.period,
    a.location_name,
    a.location_type,
    a.land_category,
    a.year,
    a.location,
    a.commodity,
    a.total
   FROM ( SELECT period.period,
            location.offshore_region AS location_name,
            'Offshore'::text AS location_type,
            location.land_category,
                CASE
                    WHEN period.period::text = 'Fiscal Year'::text THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            location.fips_code AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM revenue
             JOIN period USING (period_id)
             JOIN location USING (location_id)
             JOIN commodity USING (commodity_id)
          WHERE location.land_category::text = 'Offshore'::text
          GROUP BY period.period, location.fips_code, location.offshore_region, location.land_category, location.region_type, commodity.commodity, period.fiscal_year, period.calendar_year
        UNION
         SELECT period.period,
            location.state_name AS location_name,
            'State'::text AS location_type,
            location.land_category,
                CASE
                    WHEN period.period::text = 'Fiscal Year'::text THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            location.state AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM revenue
             JOIN period USING (period_id)
             JOIN location USING (location_id)
             JOIN commodity USING (commodity_id)
          WHERE location.state_name::text <> ''::text
          GROUP BY period.period, location.state_name, 'State'::text, location.land_category, commodity.commodity, period.fiscal_year, period.calendar_year, location.state
        UNION
         SELECT period.period,
            l.location_name,
            'County'::text AS location_type,
            l.land_category,
                CASE
                    WHEN period.period::text = 'Fiscal Year'::text THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            l.fips_code AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM revenue
             JOIN period USING (period_id)
             JOIN location AS l USING (location_id)
             JOIN commodity USING (commodity_id)
          WHERE l.region_type::text = 'County'::text
            AND NOT EXISTS (SELECT 1 FROM fips_counties_exceptions WHERE l.fips_code = fips_code)
          GROUP BY period.period, l.fips_code, l.location_name, l.land_category, commodity.commodity, period.fiscal_year, period.calendar_year
        UNION
         SELECT period.period,
  fce.title as location_name,
  'County'::text AS location_type,
  l.land_category,
                CASE
                    WHEN period.period::text = 'Fiscal Year'::text THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            l.fips_code AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM revenue
             JOIN period USING (period_id)
             JOIN location AS l USING (location_id)
             JOIN commodity USING (commodity_id)
             JOIN fips_counties_exceptions fce
               ON fce.fips_code = l.fips_code
          WHERE l.region_type::text = 'County'::text
            AND fce.fips_code = l.fips_code
          GROUP BY period.period, l.fips_code, fce.title, l.land_category, commodity.commodity, period.fiscal_year, period.calendar_year
        UNION
         SELECT period.period,
            'Nationwide Federal'::text AS location_name,
            'Nationwide Federal'::text AS location_type,
            'Nationwide Federal'::character varying AS land_category,
                CASE
                    WHEN period.period::text = 'Fiscal Year'::text THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            'NF'::text AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM revenue
             JOIN period USING (period_id)
             JOIN location USING (location_id)
             JOIN commodity USING (commodity_id)
          WHERE location.land_class::text = 'Federal'::text
          GROUP BY period.period, 'Nationwide Federal'::text, commodity.commodity, period.fiscal_year, period.calendar_year
        UNION
         SELECT period.period,
            'Native American'::text AS location_name,
            'Native American'::text AS location_type,
            'Native American'::character varying AS land_category,
                CASE
                    WHEN period.period::text = 'Fiscal Year'::text THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            'NA'::text AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM revenue
             JOIN period USING (period_id)
             JOIN location USING (location_id)
             JOIN commodity USING (commodity_id)
          WHERE location.land_class::text = 'Native American'::text
          GROUP BY period.period, 'Native American'::text, commodity.commodity, period.fiscal_year, period.calendar_year
        UNION
         SELECT period.period,
            'Not tied to a lease'::text AS location_name,
            'State'::text AS location_type,
            'State'::character varying AS land_category,
                CASE
                    WHEN period.period::text = 'Fiscal Year'::text THEN period.fiscal_year
                    ELSE period.calendar_year
                END AS year,
            'State'::text AS location,
            commodity.commodity,
            sum(revenue.revenue) AS total
           FROM revenue
             JOIN period USING (period_id)
             JOIN location USING (location_id)
             JOIN commodity USING (commodity_id)
             JOIN fund USING (fund_id)
          WHERE location.land_class::text <> 'Native American'::text AND fund.source::text = 'Not tied to a lease'::text AND location.location_name::text = 'Not tied to a location'::text
          GROUP BY period.period, 'State'::text, commodity.commodity, period.fiscal_year, period.calendar_year) a
  ORDER BY a.year, a.location;