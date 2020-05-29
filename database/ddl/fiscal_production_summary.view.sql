CREATE OR REPLACE VIEW "public"."fiscal_production_summary" AS 
 SELECT a.location_type,
    a.land_category,
    a.location_name,
    a.state,
    a.unit_abbr,
    a.fiscal_year,  
    a.state_or_area,
    a.sum,
    a.commodity

 a.location_type,
    a.land_category,
    a.location_name,
    a.state,
    a.unit_abbr,
    a.fiscal_year,
    a.state_or_area,
    a.sum,
    a.commodity
   FROM (( SELECT    Offshore as location_type,
            location.land_category,
            offshore_region as location_name,
            offshore_region as state, 
            production.unit_abbr,
            period.fiscal_year,
            offshore_region AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text) and  (land_category='Offshore') and offshore_region!= ''
          GROUP BY land_type, location.location_name, location.state, production.unit_abbr,offshore_region, location.land_category, period.fiscal_year, commodity.product
          ORDER BY period.fiscal_year,offshore_region

          ) UNION (
          
          SELECT     'State' as location_type,
            location.land_category,
            location.state_name as location_name,
            state  as state, 
            production.unit_abbr,
            period.fiscal_year,
            state AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text) and  (land_category='Onshore') and state != ''
          GROUP BY land_type, location.state_name, location.state, production.unit_abbr,offshore_region, location.land_category, period.fiscal_year, commodity.product
          ORDER BY period.fiscal_year,offshore_region




         ) UNION (

          SELECT     'County' as location_type,
            location.land_category,
            location.location_name as name,
            state  as state,        
            production.unit_abbr,
            period.fiscal_year,
            fips_code AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text) and  (land_category='Onshore') and county != ''
          GROUP BY land_type, location.location_name, state, location.county, production.unit_abbr,offshore_region, location.land_category, period.fiscal_year, commodity.product
         
         ) UNION (


         SELECT 'Nationwide Federal'::text AS location_type,
            'Nationwide Federal'::character varying AS land_category,
            'Nationwide'::character varying AS location_name,
            'Nationwide'::character varying AS state,
            production.unit_abbr,
            period.fiscal_year,
            'Nationwide Federal'::text AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
          GROUP BY production.unit_abbr, 'Nationwide Federal'::text, period.fiscal_year, commodity.product
      )  UNION (
    SELECT 'Native American'::text AS location_type,
            'Native American'::character varying AS land_category,
            'Native American lands'::character varying AS location_name,
            'Native American lands'::character varying AS state,
            production.unit_abbr,
            period.fiscal_year,
            'Native American'::text AS state_or_area,
            sum(production.volume) AS sum,
            commodity.product AS commodity
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
          GROUP BY production.unit_abbr, 'Native American'::text, period.fiscal_year, commodity.product
          )

        ) a
        ORDER BY a.fiscal_year,a.location_type



