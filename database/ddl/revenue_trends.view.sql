CREATE OR REPLACE VIEW "public"."revenue_trends" AS 
 SELECT period.fiscal_year,
        CASE
            WHEN (((commodity.revenue_type)::text = 'Other Revenues'::text) OR ((commodity.revenue_type)::text = 'Civil Penalties'::text) OR ((commodity.revenue_type)::text = 'Inspection Fees'::text)) THEN 'Other Revenues'::character varying
            ELSE commodity.revenue_type
        END AS trend_type,
    ( SELECT period_1.month_long
           FROM period period_1
          WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                   FROM period period_2
                  WHERE (period_2.period_date <= '2019-07-01'::date)))) AS current_month,
    sum(
        CASE
            WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
               FROM period period_1
              WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                       FROM period period_2
                      WHERE (period_2.period_date <= '2019-07-01'::date))))) THEN revenue.revenue
            ELSE (0)
        END) AS total_ytd,
    sum(revenue.revenue) AS total
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((commodity.commodity IS NOT NULL) AND (period.period_date <= '2019-07-01'::date) AND ((period.period)::text = 'Monthly'::text))
  GROUP BY period.fiscal_year,
        CASE
            WHEN (((commodity.revenue_type)::text = 'Other Revenues'::text) OR ((commodity.revenue_type)::text = 'Civil Penalties'::text) OR ((commodity.revenue_type)::text = 'Inspection Fees'::text)) THEN 'Other Revenues'::character varying
            ELSE commodity.revenue_type
        END
UNION
 SELECT period.fiscal_year,
    'All Revenue'::character varying AS trend_type,
    ( SELECT period_1.month_long
           FROM period period_1
          WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                   FROM period period_2
                  WHERE (period_2.period_date <= '2019-07-01'::date)))) AS current_month,
    sum(
        CASE
            WHEN (period.fiscal_month <= ( SELECT period_1.fiscal_month
               FROM period period_1
              WHERE (period_1.period_date = ( SELECT max(period_2.period_date) AS max
                       FROM period period_2
                      WHERE (period_2.period_date <= '2019-07-01'::date))))) THEN revenue.revenue
            ELSE (0)
        END) AS total_ytd,
    sum(revenue.revenue) AS total
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN commodity USING (commodity_id))
  WHERE ((commodity.commodity IS NOT NULL) AND (period.period_date <= '2019-07-01'::date) AND ((period.period)::text = 'Monthly'::text))
  GROUP BY period.fiscal_year;
