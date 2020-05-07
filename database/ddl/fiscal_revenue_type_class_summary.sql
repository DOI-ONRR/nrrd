CREATE OR REPLACE VIEW "public"."fiscal_revenue_type_class_summary" AS 
 SELECT a.year,
    a.revenue_type,
    a.type_order,
    a.land_class,
    a.class_order,
    sum(a.sum) AS sum
   FROM ( SELECT t1.year,
            t1.revenue_type,
            t1.type_order,
            t2.land_class,
            t2.class_order,
                CASE
                    WHEN (t1.land_class = t2.land_class) THEN t1.sum
                    ELSE NULL::numeric
                END AS sum
           FROM (( SELECT period.fiscal_year AS year,
                    commodity.revenue_type,
                        CASE
                            WHEN ((commodity.revenue_type)::text = 'Royalties'::text) THEN 1
                            WHEN ((commodity.revenue_type)::text = 'Bonus'::text) THEN 2
                            WHEN ((commodity.revenue_type)::text = 'Rents'::text) THEN 3
                            WHEN ((commodity.revenue_type)::text = 'Inspection Fees'::text) THEN 4
                            WHEN ((commodity.revenue_type)::text = 'Civil Penalties'::text) THEN 5
                            WHEN ((commodity.revenue_type)::text = 'Other Revenues'::text) THEN 6
                            ELSE NULL::integer
                        END AS type_order,
                        CASE
                            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
                            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
                            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
                        END AS land_class,
                        CASE
                            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
                            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 1
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 3
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 5
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 4
                            ELSE 0
                        END AS class_order,
                    sum(revenue.revenue) AS sum
                   FROM (((revenue
                     JOIN period USING (period_id))
                     JOIN location USING (location_id))
                     JOIN commodity USING (commodity_id))
                  WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
                           FROM (revenue revenue_1
                             JOIN period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 10)
                           FROM (revenue revenue_1
                             JOIN period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))))
                  GROUP BY period.fiscal_year, commodity.revenue_type, location.land_class, location.land_category) t1
             LEFT JOIN ( SELECT DISTINCT period.fiscal_year AS year,
                        CASE
                            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
                            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
                            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
                        END AS land_class,
                        CASE
                            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
                            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 1
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 3
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 5
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 4
                            ELSE 0
                        END AS class_order
                   FROM ((revenue
                     JOIN period USING (period_id))
                     JOIN location USING (location_id))
                  WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
                           FROM (revenue revenue_1
                             JOIN period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 10)
                           FROM (revenue revenue_1
                             JOIN period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))))
                  GROUP BY period.fiscal_year, location.land_class, location.land_category) t2 USING (year))) a
  GROUP BY a.year, a.revenue_type, a.type_order, a.land_class, a.class_order
  ORDER BY a.year, a.type_order, a.class_order;
