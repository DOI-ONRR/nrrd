CREATE OR REPLACE VIEW "public"."disbursement_summary" AS 
 SELECT a.location_type,
    a.fiscal_year,
    a.state_or_area,
    a.sum,
    a.distinct_commodities
   FROM (( SELECT 'State'::text AS location_type,
            period.fiscal_year,
            location.state AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((disbursement
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND (((location.region_type)::text = 'State'::text) or ((location.region_type)::text = 'County'::text)) )
          GROUP BY location.state, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year, location.state)
        UNION
        ( SELECT 'County'::text AS location_type,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((disbursement
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.region_type)::text = 'County'::text))
          GROUP BY location.fips_code, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year, location.fips_code)
        UNION
        ( SELECT 'Nationwide Federal'::text AS location_type,
            period.fiscal_year,
            'Nationwide Federal'::text AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((disbursement
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
          GROUP BY 'Nationwide Federal'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Nationwide Federal'::text)
        UNION
        ( SELECT 'Naive American'::text AS location_type,
            period.fiscal_year,
            'Native American'::text AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((disbursement
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
          GROUP BY 'Native American'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Native American'::text)) a
  ORDER BY a.fiscal_year, a.state_or_area;
