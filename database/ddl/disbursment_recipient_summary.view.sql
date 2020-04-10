CREATE OR REPLACE VIEW "public"."disbursement_recipient_summary" AS 

(
select
      
       'Nationwide Federal' as state_or_area,
case when  fund_type like 'State%' then 'State and Counties'
       when fund_type like 'U.S.%' then 'U.S. Treasury'
       else 'Specific Funds'
      END as recipient,
      'Nationwide Federal' as location,
       sum(disbursement.disbursement) as t
from disbursement  join commodity using (commodity_id) join period using (period_id) join location using (location_id)
where period='Fiscal Year'
group by fund, location
order by t desc

  )
UNION
(
  select state as state_or_area,

     case when state_name !='' and  county = '' then 'States'
      when state_name !='' and county !='' then 'Counties'
      end as  recipient,
      case when state_name !='' and  county = '' then 'States'
      when state_name !='' and county !='' then 'Counties'
      end as location,
       sum(disbursement.disbursement) as t
from disbursement  join commodity using (commodity_id) join period using (period_id) join location using (location_id)
where period='Fiscal Year'
and state !=''
group by state, fund, location
order by t desc

)
