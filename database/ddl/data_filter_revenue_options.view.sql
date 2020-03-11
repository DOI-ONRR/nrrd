CREATE OR REPLACE VIEW "public"."data_filter_revenue_options" AS 
 SELECT location.land_class,
    location.land_category,
    location.offshore_region,
    location.state,
    location.county,
    commodity.commodity,
    commodity.revenue_type,
    period.fiscal_year,
    period.calendar_year
   FROM (((commodity
     JOIN revenue USING (commodity_id))
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  GROUP BY location.land_class, location.land_category, location.offshore_region, location.state, location.county, commodity.commodity, commodity.revenue_type, period.fiscal_year, period.calendar_year;
