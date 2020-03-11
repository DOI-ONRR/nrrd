CREATE OR REPLACE VIEW "public"."total_yearly_calendar_revenue" AS 
 SELECT period.period,
    period.calendar_year AS year,
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
    (sum((revenue.revenue)::double precision))::numeric(20,2) AS sum
   FROM ((revenue
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE (((period.period)::text = 'Monthly'::text) AND (period.calendar_year <= ( SELECT max(period_1.calendar_year) AS max
           FROM (revenue revenue_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.month = 12))) AND (period.calendar_year > ( SELECT (max(period_1.calendar_year) - 10)
           FROM (revenue revenue_1
             JOIN period period_1 USING (period_id))
          WHERE (period_1.month = 12))))
  GROUP BY period.period, period.calendar_year,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 'Native American'::text
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 'Federal - not tied to a lease'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 'Federal - not tied to a location'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 'Federal Onshore'::text
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 'Federal Offshore'::text
            ELSE concat('Unknown: ', location.land_class, ' - ', location.land_category)
        END,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0
        END
  ORDER BY period.period, period.calendar_year,
        CASE
            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 0
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 1
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 4
            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 3
            ELSE 0
        END;
