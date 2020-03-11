CREATE OR REPLACE VIEW "public"."total_monthly_fiscal_disbursement" AS 
 SELECT a.period,
    a.year,
    a.month,
    a.month_long,
    a.period_date,
    a.source,
    a.sort_order,
    sum(a.sum) AS sum
   FROM ( SELECT period.period,
            period.fiscal_year AS year,
            period.fiscal_month AS month,
            period.month_long,
            period.period_date,
                CASE
                    WHEN ((commodity.fund_type)::text = 'American Indian Tribes & Allottees'::text) THEN 'Native American'::text
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND (initcap((location.land_category)::text) = 'Offshore'::text)) THEN 'Federal Offshore'::text
                    ELSE concat('Unknown: ', commodity.fund_type, ' - ', location.land_category)
                END AS source,
                CASE
                    WHEN ((commodity.fund_type)::text = 'American Indian Tribes & Allottees'::text) THEN 1
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND (initcap((location.land_category)::text) = 'Offshore'::text)) THEN 2
                    ELSE 0
                END AS sort_order,
            (sum((disbursement.disbursement)::double precision))::numeric(12,2) AS sum
           FROM (((disbursement
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year = ( SELECT max(period_1.fiscal_year) AS max
                   FROM (disbursement disbursement_1
                     JOIN period period_1 USING (period_id))
                  WHERE (period_1.fiscal_month = 12))))
          GROUP BY period.period, period.fiscal_year, period.fiscal_month, period.month_long, period.period_date, commodity.fund_type, location.land_category, commodity.source,
                CASE
                    WHEN ((commodity.fund_type)::text = 'American Indian Tribes & Allottees'::text) THEN 1
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND (initcap((location.land_category)::text) = 'Offshore'::text)) THEN 2
                    ELSE 0
                END
          ORDER BY period.period, period.fiscal_year, period.fiscal_month, period.month_long, period.period_date,
                CASE
                    WHEN ((commodity.fund_type)::text = 'American Indian Tribes & Allottees'::text) THEN 1
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes & Allottees'::text) AND (initcap((location.land_category)::text) = 'Offshore'::text)) THEN 2
                    ELSE 0
                END) a
  GROUP BY a.period, a.year, a.month, a.month_long, a.period_date, a.source, a.sort_order
  ORDER BY a.period, a.year, a.month, a.sort_order;
