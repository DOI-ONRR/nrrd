CREATE OR REPLACE VIEW "public"."total_yearly_fiscal_production" AS 
 SELECT a.period,
    a.year,
    a.product_order,
    a.product,
    a.source,
    a.sort_order,
    sum(a.sum) AS sum
   FROM
(  select t1.period, t1.year, t1.product_order, t1.product,
    t2.source,
    t2.sort_order,
   CASE WHEN t1.source=t2.source THEN t1.sum ELSE null END as sum
FROM   ( SELECT period.period,
            period.fiscal_year AS year,
                CASE
                    WHEN ((commodity.product)::text = 'Oil (bbl)'::text) THEN 1
                    WHEN ((commodity.product)::text = 'Gas (mcf)'::text) THEN 2
                    WHEN ((commodity.product)::text = 'Coal (tons)'::text) THEN 3
                    ELSE 0
                END AS product_order,
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
            sum(production.volume) AS sum
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
           FROM (production production_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 10)
           FROM (production production_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))))

             AND (commodity.product)::text = ANY (ARRAY[('Oil (bbl)'::character varying)::text, ('Gas (mcf)'::character varying)::text, ('Coal (tons)'::character varying)::text])
             
          GROUP BY period.period, period.fiscal_year, location.land_category, location.land_class, commodity.product,
                CASE
                    WHEN ((commodity.product)::text = 'Oil (bbl)'::text) THEN 1
                    WHEN ((commodity.product)::text = 'Gas (mcf)'::text) THEN 2
                    WHEN ((commodity.product)::text = 'Coal (tons)'::text) THEN 3
                    ELSE 0
                END, commodity.source,
                CASE
                    WHEN ((location.land_class)::text = 'Mixed Exploratory'::text) THEN 0
                    WHEN (((location.land_class)::text = 'Native American'::text) OR ((location.land_class)::text = 'Native American '::text)) THEN 1
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
                    ELSE 0
                END
               ) t1 LEFT OUTER JOIN (
               
                SELECT distinct  period.period,
                       period.fiscal_year AS year,
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
                       0 as sum
           FROM (((production
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
               WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
           FROM (production production_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 10)
           FROM (production production_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))))

             AND (commodity.product)::text = ANY (ARRAY[('Oil (bbl)'::character varying)::text, ('Gas (mcf)'::character varying)::text, ('Coal (tons)'::character varying)::text])
             

          ) t2 using (period, year)
               
 
) a
  GROUP BY a.period, a.year, a.source, a.sort_order, a.product, a.product_order
  ORDER BY a.period, a.product_order, a.year, a.sort_order;

