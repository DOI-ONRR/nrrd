
CREATE OR REPLACE VIEW "public"."revenue_type_class_summary" AS 
 SELECT a.period,
        a.year,
    a.revenue_type,
    a.revenue_type_order,
    a.land_type,
    a.land_type_order,
    sum(a.sum) AS total
   FROM ( SELECT
            t1.period,
            t1.year,
            t1.revenue_type,
            t1.revenue_type_order,
            t2.land_type,
            t2.land_type_order,
                CASE
                    WHEN (t1.land_type = t2.land_type) THEN t1.sum
                    ELSE NULL::numeric
                END AS sum
           FROM (( SELECT  period.period,
                    case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
                    commodity.revenue_type,
                        CASE
                            WHEN ((commodity.revenue_type)::text = 'Royalties'::text) THEN 1
                            WHEN ((commodity.revenue_type)::text = 'Bonus'::text) THEN 2
                            WHEN ((commodity.revenue_type)::text = 'Rents'::text) THEN 3
                            WHEN ((commodity.revenue_type)::text = 'Inspection Fees'::text) THEN 4
                            WHEN ((commodity.revenue_type)::text = 'Civil Penalties'::text) THEN 5
                            WHEN ((commodity.revenue_type)::text = 'Other Revenues'::text) THEN 6
                            ELSE NULL::integer
                        END AS revenue_type_order,
                        land_type,
                        CASE WHEN land_type='Native American' THEN 2
                        WHEN land_type='Federal - not tied to a lease' THEN 1
                        WHEN land_type='Federal - not tied to a location' then 3
                        WHEN land_type='Federal Onshore' then 5
                        WHEN land_type='Federal Offshore' then 4
                        else 0 END as land_type_order,
                    sum(revenue.revenue) AS sum
                   FROM (((revenue
                     JOIN period USING (period_id))
                     JOIN location USING (location_id))
                     JOIN commodity USING (commodity_id))
                  GROUP BY period.period, period.fiscal_year, period.calendar_year, commodity.revenue_type, location.land_type) t1
             LEFT JOIN ( SELECT DISTINCT period.period,
                         case when period.period = 'Fiscal Year' then period.fiscal_year ELSE period.calendar_year END as year, 
                         land_type,
                         case when land_type='Native American' then 2
                           when land_type='Federal - not tied to a lease' then 1
                           when land_type='Federal - not tied to a location' then 3
                           when land_type='Federal Onshore' then 5
                           when land_type='Federal Offshore' then 4
                           else 0 END as land_type_order
                   FROM ((revenue
                     JOIN period USING (period_id))
                     JOIN location USING (location_id))
                 
                  GROUP BY  period.period, period.fiscal_year,  period.calendar_year,   location.land_type) t2 USING (year,period))) a
  GROUP BY a.period, a.year, a.revenue_type, a.revenue_type_order, a.land_type, a.land_type_order
  ORDER BY a.year desc, a.revenue_type_order, a.land_type_order;
