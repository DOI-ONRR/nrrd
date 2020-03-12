
CREATE OR REPLACE VIEW "public"."disbursement_trends" AS
select a.fiscal_year, a.trend_type, a.current_month, sum(a.total_ytd) as total_ytd, sum(a.total) as total
FROM (
 SELECT period.fiscal_year,
        CASE
          WHEN commodity.fund_type = 'U.S. Treasury'  THEN 1 
          WHEN commodity.fund_type like '%State%'  THEN 2 
          WHEN commodity.fund_type like '%Reclamation%'  THEN 3
          WHEN location.land_class = 'Native American' THEN 4
          ELSE 5 
          END AS trend_order, 
          CASE
            WHEN commodity.fund_type = 'U.S. Treasury'  THEN  'U.S. Treasury'
            WHEN commodity.fund_type like '%State%'  THEN   'States & counties'
            WHEN commodity.fund_type like '%Reclamation%'  THEN 'Reclamation fund'
            WHEN location.land_class = 'Native American' THEN 'Native Americans'
          ELSE  'Other Funds'
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
                       )))) THEN disbursement.disbursement
            ELSE (0)
        END) AS total_ytd,
    sum(disbursement.disbursement) AS total
   FROM (disbursement
     JOIN period USING (period_id)
     JOIN commodity USING (commodity_id)
          JOIN location USING (location_id))  
  WHERE ((commodity.fund_type IS NOT NULL) AND (
  (period.period)::text = 'Monthly'::text  
  OR
  (period.period='Fiscal Year'
  AND period.period_date < (SELECT min(period_date)
                            FROM disbursement
                            JOIN period USING (period_id)
                            WHERE period='Monthly'
                            )
  )
  ))
  GROUP BY period.fiscal_year,commodity.fund_type, location.land_class
UNION
 SELECT period.fiscal_year,
    5 as trend_order,
    'Total'::character varying AS trend_type,
    ( SELECT period_1.month_long
           FROM period period_1
          WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                   FROM period period_2))) AS current_month,
    sum(
        CASE
            WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
               FROM period period_1
              WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                       FROM period period_2)))) THEN disbursement.disbursement
            ELSE (0)
        END) AS total_ytd,
    sum(disbursement.disbursement) AS total
   FROM disbursement
     JOIN period USING (period_id)
     JOIN commodity USING (commodity_id)
  WHERE ((commodity.commodity IS NOT NULL)
  AND (
  (period.period)::text = 'Monthly'::text
   OR
   (period.period='Fiscal Year'
    AND period.period_date < (SELECT min(period_date)
                            FROM disbursement
                            JOIN period USING (period_id)
                            WHERE period='Monthly')
                            )
  )
 ) 
  GROUP BY period.fiscal_year

) a

group  by  a.fiscal_year, a.trend_type, a.trend_order, a.current_month
order by a.fiscal_year, a.trend_order  

