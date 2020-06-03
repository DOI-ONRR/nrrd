
CREATE OR REPLACE VIEW "public"."revenue_trends" AS
select a.fiscal_year, a.trend_type, a.current_month, sum(a.total_ytd) as total_ytd, sum(a.total) as total
FROM (
 SELECT period.fiscal_year,
        CASE
          WHEN commodity.revenue_type = 'Royalties'  THEN 1 
          WHEN commodity.revenue_type = 'Bonus'  THEN 2 
          WHEN commodity.revenue_type = 'Rents'  THEN 3
          WHEN (((commodity.revenue_type)::text = 'Other Revenues'::text) OR ((commodity.revenue_type)::text = 'Civil Penalties'::text) OR ((commodity.revenue_type)::text = 'Inspection Fees'::text)) THEN 4
          END AS trend_order, 
          CASE
            WHEN (((commodity.revenue_type)::text = 'Other Revenues'::text) OR ((commodity.revenue_type)::text = 'Civil Penalties'::text) OR ((commodity.revenue_type)::text = 'Inspection Fees'::text)) THEN 'Other Revenues'::character varying
            ELSE commodity.revenue_type
        END AS trend_type,
    ( SELECT period_1.month_long
           FROM period period_1
          WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                   FROM period period_2 ) 
                ))  AS current_month,
    sum(
        CASE
            WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
               FROM period period_1
              WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                       FROM period period_2 
                       )))) THEN revenue.revenue
            ELSE (0)
        END) AS total_ytd,
    sum(revenue.revenue) AS total
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((commodity.commodity IS NOT NULL) AND ((period.period)::text = 'Monthly'::text))
  GROUP BY period.fiscal_year,commodity.revenue_type
UNION
 SELECT period.fiscal_year,
    5 as trend_order,
    'All Revenue'::character varying AS trend_type,
    ( SELECT period_1.month_long
           FROM period period_1
          WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                   FROM period period_2))) AS current_month,
    sum(
        CASE
            WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
               FROM period period_1
              WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                       FROM period period_2)))) THEN revenue.revenue
            ELSE (0)
        END) AS total_ytd,
    sum(revenue.revenue) AS total
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((commodity.commodity IS NOT NULL)  AND ((period.period)::text = 'Monthly'::text))
  GROUP BY period.fiscal_year

) a

group  by  a.fiscal_year, a.trend_type, a.trend_order, a.current_month
order by a.fiscal_year, a.trend_order  
