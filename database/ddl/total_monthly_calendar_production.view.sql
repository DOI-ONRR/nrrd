CREATE OR REPLACE VIEW "public"."total_monthly_calendar_production" AS 
 SELECT a.period,
    a.year,
    a.month,
    a.month_long,
    a.period_date,
    a.product,
    a.source,
    a.sort_order,
    sum(a.sum) AS sum
   FROM ( SELECT period.period,
            period.calendar_year AS year,
            period.month,
            period.month_long,
            period.period_date,
            commodity.product,
                CASE
                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 'Mixed Exploratory'::text
                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 'Native American'::text
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
                    ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
                END AS source,
                CASE
                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
                    ELSE 0
                END AS sort_order,
            (sum((production.volume)::double precision))::numeric(12,2) AS sum
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Monthly'::text) AND (period.calendar_year = ( SELECT max(period_1.calendar_year) AS max
                   FROM (disbursement
                     JOIN period period_1 USING (period_id))
                  WHERE (period_1.month = 12))))
          GROUP BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, commodity.product, location.land_class, location.land_category, commodity.source,
                CASE
                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
                    ELSE 0
                END
          ORDER BY period.period, period.calendar_year, period.month, period.month_long, period.period_date,
                CASE
                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
                    ELSE 0
                END) a
  GROUP BY a.period, a.year, a.month, a.month_long, a.period_date, a.product, a.source, a.sort_order
  ORDER BY a.period, a.year, a.month, a.sort_order;
