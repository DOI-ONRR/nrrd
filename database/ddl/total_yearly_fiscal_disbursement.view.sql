CREATE OR REPLACE VIEW "public"."total_yearly_fiscal_disbursement" AS 
 SELECT a.period,
    a.year,
    a.source,
    a.sort_order,
    sum(a.sum) AS sum
   FROM ( SELECT period.period,
            period.fiscal_year AS year,
                CASE
                    WHEN ((commodity.fund_type)::text = 'American Indian Tribes'::text) THEN 'Native American'::text
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes'::text) AND (initcap((location.land_category)::text) = 'Offshore'::text)) THEN 'Federal Offshore'::text
                    ELSE concat('Unknown: ', commodity.fund_type, ' - ', location.land_category)
                END AS source,
                CASE
                    WHEN ((commodity.fund_type)::text = 'American Indian Tribes'::text) THEN 1
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes'::text) AND (initcap((location.land_category)::text) = 'Offshore'::text)) THEN 2
                    ELSE 0
                END AS sort_order,
            (sum((disbursement.disbursement)::double precision))::numeric(20,2) AS sum
           FROM (((disbursement
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND (period.period_date > ( SELECT (max(period_1.period_date) - '10 years'::interval)
                   FROM (disbursement disbursement_1
                     JOIN period period_1 USING (period_id))
                  WHERE ((period_1.period)::text = 'Fiscal Year'::text))))
          GROUP BY period.period, period.fiscal_year, location.land_category, commodity.fund_type, commodity.source,
                CASE
                    WHEN ((commodity.fund_type)::text = 'American Indian Tribes'::text) THEN 1
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 3
                    WHEN (((commodity.fund_type)::text <> 'American Indian Tribes'::text) AND (initcap((location.land_category)::text) = 'Offshore'::text)) THEN 2
                    ELSE 0
                END) a
  GROUP BY a.period, a.year, a.source, a.sort_order
  ORDER BY a.period, a.year, a.sort_order;
