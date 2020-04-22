CREATE OR REPLACE VIEW "public"."fiscal_disbursement_type_class_summary" AS 
 SELECT year,
            recipient
            recipient_order,
            source,
            source_order,
            sum(sum) as total
           FROM (( SELECT period.fiscal_year AS year,
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
                             CASE               
                    WHEN ((location.land_category)::text = 'Onshore'::text) THEN location.land_category
                    WHEN ((commodity.fund_type)::text = 'State 8(g)'::text) THEN '8(g) offshore'::character varying
                    WHEN (upper((commodity.fund_type)::text) ~~ '%GOMESA%'::text) THEN 'GOMESA offshore'::character varying
                    ELSE 'Offshore'::character varying
                END AS source,
                CASE               
                    WHEN ((location.land_category)::text = 'Onshore'::text) THEN 1
                    WHEN ((commodity.fund_type)::text = 'State 8(g)'::text) THEN 3
                    WHEN (upper((commodity.fund_type)::text) ~~ '%GOMESA%'::text) THEN 2
                    ELSE 4
                END AS source_order,
                    sum(disbursement.disbursement) AS sum
                   FROM (((disbursement
                     JOIN period USING (period_id))
                     JOIN location USING (location_id))
                     JOIN commodity USING (commodity_id))

          WHERE ((period.period)::text = 'Fiscal Year'::text)
          GROUP BY commodity.source, location.land_category, commodity.fund_type, period.fiscal_year, period.calendar_year
          ORDER BY period.fiscal_year
          )
          GROUP BY year, recipient, recipient_order, source, source_order
          ORDER BY year, recipient_order, souce_order

