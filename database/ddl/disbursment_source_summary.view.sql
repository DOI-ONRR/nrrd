CREATE OR REPLACE VIEW "public"."disbursement_recipient_summary" AS 
Select  state_or_area, source, location, fiscal_year, calendar_year, sum(total) as total
from (
(
SELECT 'Nationwide Federal'::text AS state_or_area,
       case when land_category = 'Onshore' then land_category
       when fund_type =  'State 8(g)' then '8(g) offshore'  
       when UPPER(fund_type) like '%GOMESA%' then 'GOMESA offshore'
       else 'Offshore'
       end as source,
    'Nationwide Federal'::text AS location,
    period.fiscal_year,
    period.calendar_year,
    sum(disbursement.disbursement) AS total
   FROM (((disbursement
     JOIN commodity USING (commodity_id))
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY source, location.land_category, fund_type, fiscal_year, calendar_year
  ORDER BY fiscal_year,source,  (sum(disbursement.disbursement)) DESC
  )
UNION
( SELECT location.state AS state_or_area,
         case when land_category = 'Onshore' then land_category
         when fund_type =  'State 8(g)' then '8(g) offshore'  
         when UPPER(fund_type) like '%GOMESA%' then 'GOMESA offshore'
         else 'Offshore' end as source,
         'States'::text as location,
    period.fiscal_year,
    period.calendar_year,
    sum(disbursement.disbursement) AS total
   FROM (((disbursement
     JOIN commodity USING (commodity_id))
     JOIN period USING (period_id))
     JOIN location USING (location_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.state)::text <> ''::text )and
  ((location.county)::text = ''::text))
  GROUP BY location.state,
        CASE
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text = ''::text)) THEN 'States'::text
            WHEN (((location.state_name)::text <> ''::text) AND ((location.county)::text <> ''::text)) THEN 'Counties'::text
            ELSE NULL::text
        END, 'State'::text, period.fiscal_year, period.calendar_year, land_category, fund_type
  ORDER BY (sum(disbursement.disbursement)) DESC)
) as t1
group by state_or_area, source, location, fiscal_year, calendar_year
;
