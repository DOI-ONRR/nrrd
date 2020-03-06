drop view "public"."total_monthly_fiscal_revenue2";
CREATE OR REPLACE VIEW "public"."total_monthly_fiscal_revenue2" AS 
 SELECT period.period,
    period.fiscal_year as year,
    period.fiscal_month as month,
    period.month_long,
    period.period_date,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS Source,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0          WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0
        END AS sort_order,
    sum(revenue.revenue::float)::numeric(12,2) AS sum
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE ((period.period)::text = 'Monthly'::text)
  and fiscal_year=(select max(fiscal_year) from revenue natural join period where fiscal_month=12)
  GROUP BY period.period, period.fiscal_year, period.fiscal_month, period.month_long, period.period_date, Source, sort_order
  ORDER BY period.period, period.fiscal_year, period.fiscal_month, period.month_long, period.period_date, sort_order;



drop view "public"."total_monthly_calendar_revenue2";
CREATE OR REPLACE VIEW "public"."total_monthly_calendar_revenue2" AS 
 SELECT period.period,
    period.calendar_year as year,
    period.month as month,
    period.month_long,
    period.period_date,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS Source,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0          WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0
        END AS sort_order,
    sum(revenue.revenue::float)::numeric(12,2) AS sum
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE ((period.period)::text = 'Monthly'::text)
   and calendar_year=(select max(calendar_year) from revenue natural join period where month=12)
  GROUP BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, Source, sort_order
  ORDER BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, sort_order;



drop view "public"."last_twelve_revenue2";
CREATE OR REPLACE VIEW "public"."last_twelve_revenue2" AS 
 SELECT period.period,
    period.calendar_year as year,
    period.month as month,
    period.month_long,
    period.period_date,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS Source,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0          WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0
        END AS sort_order,
    sum(revenue.revenue::float)::numeric(12,2) AS sum
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE ((period.period)::text = 'Monthly'::text)
   and period_date > (select max(period_date) - interval '12 months' from revenue natural join period where period='Monthly')
  GROUP BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, Source, sort_order
  ORDER BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, sort_order;






drop view  "public"."total_yearly_fiscal_revenue2";
CREATE OR REPLACE VIEW "public"."total_yearly_fiscal_revenue2" AS 
 SELECT period.period,
    period.fiscal_year as year, 
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN  4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0                             
        END AS sort_order,
    sum(revenue.revenue::float)::numeric(20,2)  AS sum
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE ((period.period)::text = 'Monthly'::text)
  and fiscal_year <= (select max(fiscal_year) from revenue natural join period where fiscal_month=12)
  and fiscal_year > (select max(fiscal_year)-10 from revenue natural join period where fiscal_month=12)
  GROUP BY period.period, period.fiscal_year,source, sort_order 
  ORDER BY period.period, period.fiscal_year, sort_order        



drop view  "public"."total_yearly_calendar_revenue2";
CREATE OR REPLACE VIEW "public"."total_yearly_calendar_revenue2" AS 
 SELECT period.period,
    period.calendar_year as year, 
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN  4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0                             
        END AS sort_order,
    sum(revenue.revenue::float)::numeric(20,2)  AS sum
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE ((period.period)::text = 'Monthly'::text)
  and calendar_year <= (select max(calendar_year) from revenue natural join period where   month=12)
  and calendar_year > (select max(calendar_year)-10 from revenue natural join period where month=12)
  GROUP BY period.period, period.calendar_year,source, sort_order 
  ORDER BY period.period, period.calendar_year, sort_order        


CREATE OR REPLACE VIEW "public"."fiscal_revenue_summary" AS
select * from _fiscal_revenue_summary

CREATE MATERIALIZED VIEW "public"."_fiscal_revenue_summary" AS
 SELECT a.location_type,
    a.land_category,
    a.fiscal_year,
    a.state_or_area,
    a.sum,
    a.distinct_commodities
   FROM (( SELECT 'State'::text AS location_type,
            location.land_category,
            period.fiscal_year,
                CASE
                    WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
                    ELSE location.state
                END AS state_or_area,
                CASE    
                    WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
                    ELSE location.state
                END AS state_or_area_name,
                
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text)
          GROUP BY
                CASE
                    WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
                    ELSE location.state
                END, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year,
                CASE
                    WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
                    ELSE location.state
                END)



UNION


( SELECT 'County'::text AS location_type,
            location.land_category,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text)
          GROUP BY location.fips_code, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year, location.fips_code)
UNION

( SELECT 'National'::text AS location_type,
            'National'::character varying AS land_category,
            period.fiscal_year,
            'National'::text AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text)
          AND land_class= 'Federal'
          GROUP BY 'National'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'National'::text)

UNION

( SELECT 'Naive American'::text AS location_type,
            'Native American'::character varying AS land_category,
            period.fiscal_year,
            'Native American'::text AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((revenue
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text)
          and land_class= 'Native American'
          GROUP BY 'Native American'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Native American'::text)) a

  ORDER BY a.fiscal_year, a.state_or_area;

create index on _fiscal_revenue_summary(fiscal_year); 
create index on _fiscal_revenue_summary(fiscal_year,location_type); 


CREATE OR REPLACE VIEW "public"."revenue_commodity_summary" AS
select * from _revenue_commodity_summary


CREATE MATERIALIZED VIEW "public"."_revenue_commodity_summary" AS 
( SELECT
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.state
        END AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY state_or_area, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, state_or_area, (sum(revenue.revenue)) DESC)
UNION
( SELECT
        CASE
            WHEN ((location.land_category)::text = 'Offshore'::text) THEN location.offshore_planning_area_code
            ELSE location.fips_code
        END AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY state_or_area, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, state_or_area, (sum(revenue.revenue)) DESC)
UNION
( SELECT 'National'::text AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  AND land_class= 'Federal'       
  GROUP BY 'National'::text, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, 'National'::text, (sum(revenue.revenue)) DESC)
UNION
( SELECT 'Native American'::text AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((revenue
     JOIN location USING (location_id))
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  and land_class= 'Native American'     
  GROUP BY 'Native American'::text, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, 'Native American'::text, (sum(revenue.revenue)) DESC)

create index on _revenue_commodity_summary (state_or_area, fiscal_year) 
