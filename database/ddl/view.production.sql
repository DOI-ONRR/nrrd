drop view "public"."total_monthly_fiscal_production2";
CREATE OR REPLACE VIEW "public"."total_monthly_fiscal_production2" AS
SELECT  period,
       year,
       month,
       month_long,
       period_date,
       product,
       source,
       sort_order,
       sum(sum)
       from (
 SELECT period.period,
    period.fiscal_year as year,
    period.fiscal_month as month,
    period.month_long,
    period.period_date,
        commodity.product, 
       CASE
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 'Mixed Exploratory'
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 'Native American'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'
        ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE 
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
        ELSE 0
        END AS sort_order,
    sum(production.volume::float)::numeric(12,2) AS sum
   FROM ((production
     JOIN period USING (period_id))
     JOIN location USING (location_id)
     JOIN commodity USING (commodity_id))     
  WHERE ((period.period)::text = 'Monthly'::text)
  and fiscal_year=(select max(fiscal_year) from disbursement natural join period where fiscal_month=12)
  GROUP BY period.period, period.fiscal_year, period.fiscal_month, period.month_long, period.period_date, commodity.product,location.land_category, location.land_class, source, sort_order
  ORDER BY period.period, period.fiscal_year, period.fiscal_month, period.month_long, period.period_date, sort_order) A
  GROUP BY period, year,month, month_long, period_date,product, source, sort_order
  ORDER BY period, year, month, sort_order
;


drop view "public"."total_monthly_calendar_production2";
CREATE OR REPLACE VIEW "public"."total_monthly_calendar_production2" AS
SELECT  period,
       year,
       month,
       month_long,
       period_date,
       product,
       source,
       sort_order,
       sum(sum)
       from (
 SELECT period.period,
    period.calendar_year as year,
    period.month as month,
    period.month_long,
    period.period_date,
    commodity.product, 
       CASE
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 'Mixed Exploratory'
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 'Native American'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'
        ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE 
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
        ELSE 0
        END AS sort_order,
sum(production.volume::float)::numeric(12,2) AS sum
   FROM ((production
     JOIN period USING (period_id))
     JOIN location USING (location_id)
     JOIN commodity USING (commodity_id))     
  WHERE ((period.period)::text = 'Monthly'::text)
   and calendar_year=(select max(calendar_year) from disbursement natural join period where month=12)
GROUP BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, commodity.product,location.land_class,location.land_category, source, sort_order
  ORDER BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, sort_order) A
  GROUP BY period, year,month, month_long, period_date,product, source, sort_order
  ORDER BY period, year, month, sort_order
;


drop view "public"."last_twelve_production2";
CREATE OR REPLACE VIEW "public"."last_twelve_production2" AS
SELECT  period,
       year,
       month,
       month_long,
       period_date,
       product,
       source,
       sort_order,
       sum(sum)
       from (
 SELECT period.period,
    period.calendar_year as year,
    period.month as month,
    period.month_long,
    period.period_date,
    commodity.product,
       CASE
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 'Mixed Exploratory'
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 'Native American'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'
        ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE 
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
        ELSE 0
        END AS sort_order,
sum(production.volume::float)::numeric(12,2) AS sum
   FROM ((production
     JOIN period USING (period_id))
     JOIN location USING (location_id)
     JOIN commodity USING (commodity_id))     
  WHERE ((period.period)::text = 'Monthly'::text)
  and period_date > (select max(period_date) - interval '12 months' from disbursement natural join period where period='Monthly')       
  GROUP BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, commodity.product,location.land_category,location.land_class, source, sort_order
  ORDER BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, sort_order) A
  GROUP BY period, year,month, month_long, period_date,product,  source, sort_order
  ORDER BY period, year, month, sort_order
;





drop view  "public"."total_yearly_fiscal_production2";
CREATE OR REPLACE VIEW "public"."total_yearly_fiscal_production2" AS 
select period,
       year,
       product_order,
       product,
       source,
       sort_order,
       sum(sum)
       from (
SELECT period.period,
    period.fiscal_year as year,
    CASE
      WHEN product='Oil (bbl)' THEN 1
      WHEN product='Gas (mcf)' THEN 2
      WHEN product='Coal (tons)' THEN 3
      ELSE 0
      END as product_order,
    commodity.product, 
       CASE
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 'Mixed Exploratory'
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 'Native American'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'
        ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE 
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
        ELSE 0
        END AS sort_order,
        sum(production.volume::float)::numeric(20,2)  AS sum
   FROM ((production                                  
     JOIN period USING (period_id))
     JOIN location USING (location_id)
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text
   and period_date > (select max(period_date) - interval '10 years' from production natural join period where period='Fiscal Year')
   and product in ('Oil (bbl)','Gas (mcf)','Coal (tons)'))
  GROUP BY period.period, period.fiscal_year,location.land_category,location.land_class, commodity.product, product_order, source, sort_order ) A
  where sum is not null
  GROUP BY period, year, source, sort_order, product, product_order
  ORDER BY period, product_order, year, sort_order




drop view  "public"."total_yearly_calendar_production2";
CREATE OR REPLACE VIEW "public"."total_yearly_calendar_production2" AS 
select period,
       year,
       product_order,
       product,
       source,
       sort_order,
       sum(sum)
       from (
SELECT period.period,
    period.calendar_year as year,
    CASE
      WHEN product='Oil (bbl)' THEN 1
      WHEN product='Gas (mcf)' THEN 2
      WHEN product='Coal (tons)' THEN 3
      ELSE 0
      END as product_order,
    commodity.product, 
       CASE
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 'Mixed Exploratory'
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 'Native American'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'
        ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE 
        WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
        WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
        WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
        ELSE 0
        END AS sort_order,
        sum(production.volume::float)::numeric(20,2)  AS sum
   FROM ((production                                  
     JOIN period USING (period_id))
     JOIN location USING (location_id)
     JOIN commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Calendar Year'::text
   and period_date > (select max(period_date) - interval '10 years' from production natural join period where period='Calendar Year')
   and product in ('Oil (bbl)','Gas (mcf)','Coal (tons)'))
  GROUP BY period.period, period.calendar_year,location.land_category,location.land_class, commodity.product, product_order, source, sort_order ) A

  GROUP BY period, year, source, sort_order, product, product_order
  ORDER BY period, product_order, year, sort_order



