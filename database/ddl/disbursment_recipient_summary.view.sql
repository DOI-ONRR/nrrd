drop view  "public"."disbursement_recipient_summary"; 
CREATE OR REPLACE VIEW "public"."disbursement_recipient_summary" AS 
( SELECT 'Nationwide Federal'::character varying AS state_or_area,
        CASE
            WHEN ((commodity.fund_type)::text ~~ 'State%'::text) THEN 'State and Counties'::text
            WHEN ((commodity.fund_type)::text ~~ 'U.S.%'::text) THEN 'U.S. Treasury'::text
            ELSE 'Specific Funds'::text
        END AS recipient,
    'Nationwide Federal'::text AS location,
    fiscal_year,
    calendar_year,
    sum(disbursement.disbursement) AS total
   FROM (((disbursement
     JOIN commodity USING (commodity_id))
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY
        CASE
            WHEN ((commodity.fund_type)::text ~~ 'State%'::text) THEN 'State and Counties'::text
            WHEN ((commodity.fund_type)::text ~~ 'U.S.%'::text) THEN 'U.S. Treasury'::text
            ELSE 'Specific Funds'::text
        END, 'Nationwide Federal'::text,
          fiscal_year,
            calendar_year

  ORDER BY (sum(disbursement.disbursement)) DESC)
UNION
( SELECT location.state AS state_or_area,
        CASE
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text = ''::text)) THEN 'States'::text
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text <> ''::text)) THEN 'Counties'::text
            ELSE NULL::text
        END AS recipient,
    'State'::text AS location,
            fiscal_year,
            calendar_year,

sum(disbursement.disbursement) AS total
   FROM (((disbursement
     JOIN commodity USING (commodity_id))
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.state)::text <> ''::text))
  GROUP BY location.state,
        CASE
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text = ''::text)) THEN 'States'::text
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text <> ''::text)) THEN 'Counties'::text
            ELSE NULL::text
        END, 'State'::text,
          fiscal_year,
            calendar_year

  ORDER BY (sum(disbursement.disbursement)) DESC);
