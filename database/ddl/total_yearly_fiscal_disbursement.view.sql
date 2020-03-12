CREATE OR REPLACE VIEW "public"."total_yearly_fiscal_disbursement" AS 
 SELECT a.period,
    a.year,
    a.source,
    a.sort_order,
    sum(a.sum) AS sum
   FROM ( SELECT period.period,
            period.fiscal_year AS year,
            CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END AS source,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0
        END AS sort_order,
            sum(disbursement.disbursement) AS sum
           FROM (((disbursement
             JOIN period USING (period_id))
             JOIN location USING (location_id))
             JOIN commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND (period.period_date > ( SELECT (max(period_1.period_date) - '10 years'::interval)
                   FROM (disbursement disbursement_1
                     JOIN period period_1 USING (period_id))
                  WHERE ((period_1.period)::text = 'Fiscal Year'::text))))
          GROUP BY period.period, period.fiscal_year, location.land_category, location.land_class, commodity.source,
) a
  GROUP BY a.period, a.year, a.source, a.sort_order
  ORDER BY a.period, a.year, a.sort_order;
