CREATE OR REPLACE VIEW "public"."fiscal_disbursement_recipient_summary" AS 
 SELECT year,
            recipient,
            recipient_order,
            sum(sum) as total
           FROM ( SELECT period.fiscal_year AS year,
                           CASE
                            WHEN ((commodity.fund_type)::text = 'U.S. Treasury' ::text
                                   or (commodity.fund_type)::text = 'U.S. Treasury - GoMESA' ::text
                            ) THEN 'U.S. Treasury'
                            WHEN ((commodity.fund_type)::text = 'State'::text
                                or (commodity.fund_type)::text = 'State 8(g)'::text
                               or (commodity.fund_type)::text = 'State - GoMESA'::text
                            ) THEN 'State and local governments'
                            WHEN ((commodity.fund_type)::text = 'Reclamation'::text
                                     or (commodity.fund_type)::text = 'Reclamation Fund'::text)            
                            THEN 'Reclamation Fund'
                            WHEN (
                            (commodity.fund_type)::text = 'American Indian Tribes'::text
                            or (commodity.fund_type)::text = 'Native American Tribes & Allottees'::text
                            or (commodity.fund_type)::text = 'U.S. TreasuryAI'::text)
                            THEN 'Native American tribes and individuals'
                            WHEN (
                            (commodity.fund_type)::text like 'Land & Water Conservation Fund%'::text)
                            THEN 'Land and Water Conservation Fund'
                            WHEN ((commodity.fund_type)::text = 'Historic Preservation Fund'::text) THEN 'Historic Preservation Fund'
                            ELSE  'Other funds'
                        END AS recipient,
                        CASE
                            WHEN ((commodity.fund_type)::text = 'U.S. Treasury' ::text
                                   or (commodity.fund_type)::text = 'U.S. Treasury - GoMESA' ::text
                            ) THEN 1
                            WHEN ((commodity.fund_type)::text = 'State'::text
                                or (commodity.fund_type)::text = 'State 8(g)'::text
                               or (commodity.fund_type)::text = 'State - GoMESA'::text
                            ) THEN 2
                            WHEN ((commodity.fund_type)::text = 'Reclamation'::text
                                     or (commodity.fund_type)::text = 'Reclamation Fund'::text)            
                            THEN 3
                            WHEN (
                            (commodity.fund_type)::text = 'American Indian Tribes'::text
                            or (commodity.fund_type)::text = 'Native American Tribes & Allottees'::text
                            or (commodity.fund_type)::text = 'U.S. TreasuryAI'::text)
                            THEN 4
                            WHEN (
                            (commodity.fund_type)::text like 'Land & Water Conservation Fund%'::text)
                            THEN 5
                            WHEN ((commodity.fund_type)::text = 'Historic Preservation Fund'::text) THEN 7
                            ELSE  8
                        END AS recipient_order,
                    sum(disbursement.disbursement) AS sum
                   FROM (((disbursement
                     JOIN period USING (period_id))
                     JOIN location USING (location_id))
                     JOIN commodity USING (commodity_id))

          WHERE ((period.period)::text = 'Fiscal Year'::text)
          GROUP BY commodity.fund_type, period.fiscal_year, period.calendar_year
          ORDER BY period.fiscal_year
          ) t1
          GROUP BY year, recipient, recipient_order 
          ORDER BY year desc, recipient_order

