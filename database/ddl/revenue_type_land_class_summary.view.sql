CREATE OR REPLACE VIEW "public"."fiscal_revenue_type_class_summary" AS 

select period, year, revenue_type, type_order,  land_class, class_order, sum(sum) as sum

from (
SELECT 
    period.fiscal_year AS year,
    commodity.revenue_type as revenue_type,
    CASE WHEN commodity.revenue_type = 'Royalties' THEN 1       
         WHEN commodity.revenue_type = 'Bonus' THEN 2   
         WHEN commodity.revenue_type = 'Rents' THEN 3
         WHEN commodity.revenue_type = 'Inspection Fees' THEN 4
         WHEN commodity.revenue_type = 'Civil Penalties' THEN 5
         WHEN commodity.revenue_type = 'Other Revenues' THEN 6     
         END as type_order ,          
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS land_class,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 3
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 5
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 2
            ELSE 0
        END AS class_order,
    sum(revenue.revenue) as sum
   FROM (revenue
     JOIN period USING (period_id)
     JOIN location USING (location_id)
     JOIN commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
           FROM (revenue revenue_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 10)
           FROM (revenue revenue_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))))
  GROUP BY period.period, period.fiscal_year, commodity.revenue_type, location.land_class, location.land_category
  ORDER BY year, type_order, class_order
) A

GROUP BY  period, year, revenue_type, type_order, land_class, class_order
order by year, type_order, class_order
