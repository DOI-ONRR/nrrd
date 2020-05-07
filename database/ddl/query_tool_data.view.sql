CREATE OR REPLACE VIEW "public"."query_tool_data" AS 
 SELECT period.period,
    location.state,
    location.county,
    location.land_class,
    location.land_category,
    location.offshore_region,
    commodity.commodity,
    commodity.revenue_type,
    sum(
        CASE
            WHEN (period.fiscal_year = 2003) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2003,
    sum(
        CASE
            WHEN (period.fiscal_year = 2004) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2004,
    sum(
        CASE
            WHEN (period.fiscal_year = 2005) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2005,
    sum(
        CASE
            WHEN (period.fiscal_year = 2006) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2006,
    sum(
        CASE
            WHEN (period.fiscal_year = 2007) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2007,
    sum(
        CASE
            WHEN (period.fiscal_year = 2008) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2008,
    sum(
        CASE
            WHEN (period.fiscal_year = 2009) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2009,
    sum(
        CASE
            WHEN (period.fiscal_year = 2010) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2010,
    sum(
        CASE
            WHEN (period.fiscal_year = 2011) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2011,
    sum(
        CASE
            WHEN (period.fiscal_year = 2012) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2012,
    sum(
        CASE
            WHEN (period.fiscal_year = 2013) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2013,
    sum(
        CASE
            WHEN (period.fiscal_year = 2014) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2014,
    sum(
        CASE
            WHEN (period.fiscal_year = 2015) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2015,
    sum(
        CASE
            WHEN (period.fiscal_year = 2016) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2016,
    sum(
        CASE
            WHEN (period.fiscal_year = 2017) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2017,
    sum(
        CASE
            WHEN (period.fiscal_year = 2018) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2018,
    sum(
        CASE
            WHEN (period.fiscal_year = 2019) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2019,
    sum(
        CASE
            WHEN (period.fiscal_year = 2020) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2020
   FROM (((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY period.period, location.state, location.county, location.land_class, location.land_category, location.offshore_region, commodity.commodity, commodity.revenue_type
UNION
 SELECT period.period,
    location.state,
    location.county,
    location.land_class,
    location.land_category,
    location.offshore_region,
    commodity.commodity,
    commodity.revenue_type,
    sum(
        CASE
            WHEN (period.calendar_year = 2003) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2003,
    sum(
        CASE
            WHEN (period.calendar_year = 2004) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2004,
    sum(
        CASE
            WHEN (period.calendar_year = 2005) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2005,
    sum(
        CASE
            WHEN (period.calendar_year = 2006) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2006,
    sum(
        CASE
            WHEN (period.calendar_year = 2007) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2007,
    sum(
        CASE
            WHEN (period.calendar_year = 2008) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2008,
    sum(
        CASE
            WHEN (period.calendar_year = 2009) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2009,
    sum(
        CASE
            WHEN (period.calendar_year = 2010) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2010,
    sum(
        CASE
            WHEN (period.calendar_year = 2011) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2011,
    sum(
        CASE
            WHEN (period.calendar_year = 2012) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2012,
    sum(
        CASE
            WHEN (period.calendar_year = 2013) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2013,
    sum(
        CASE
            WHEN (period.calendar_year = 2014) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2014,
    sum(
        CASE
            WHEN (period.calendar_year = 2015) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2015,
    sum(
        CASE
            WHEN (period.calendar_year = 2016) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2016,
    sum(
        CASE
            WHEN (period.calendar_year = 2017) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2017,
    sum(
        CASE
            WHEN (period.calendar_year = 2018) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2018,
    sum(
        CASE
            WHEN (period.calendar_year = 2019) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2019,
    sum(
        CASE
            WHEN (period.calendar_year = 2020) THEN revenue.revenue
            ELSE (0)::real
        END) AS y2020
   FROM (((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Calendar Year'::text)
  GROUP BY period.period, location.state, location.county, location.land_class, location.land_category, location.offshore_region, commodity.commodity, commodity.revenue_type;
