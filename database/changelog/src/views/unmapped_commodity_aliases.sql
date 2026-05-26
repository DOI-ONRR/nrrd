-- Observability for the commodity_alias lookup.
-- Surfaces distinct raw values currently sitting in each ELT staging table that
-- have no matching commodity_alias row under the matching logic the corresponding
-- loader uses (or would use, after cutover).
CREATE OR REPLACE VIEW unmapped_commodity_aliases AS
SELECT 'production_calendar_year'::TEXT AS source,
       COALESCE(e.product, '') AS raw_value,
       COUNT(*) AS elt_row_count
FROM calendar_year_production_elt e
WHERE NOT EXISTS (
    SELECT 1 FROM commodity_alias a
    WHERE a.source = 'production_calendar_year'
      AND LOWER(COALESCE(e.product, '')) = LOWER(COALESCE(a.alias_product, ''))
)
GROUP BY COALESCE(e.product, '')

UNION ALL

SELECT 'production_fiscal_year',
       COALESCE(e.product, ''),
       COUNT(*)
FROM fiscal_year_production_elt e
WHERE NOT EXISTS (
    SELECT 1 FROM commodity_alias a
    WHERE a.source = 'production_fiscal_year'
      AND LOWER(COALESCE(e.product, '')) = LOWER(COALESCE(a.alias_product, ''))
)
GROUP BY COALESCE(e.product, '')

UNION ALL

SELECT 'production_monthly',
       COALESCE(e.commodity, ''),
       COUNT(*)
FROM monthly_production_elt e
WHERE NOT EXISTS (
    SELECT 1 FROM commodity_alias a
    WHERE a.source = 'production_monthly'
      AND COALESCE(e.commodity, '') = COALESCE(a.alias_commodity, '')
)
GROUP BY COALESCE(e.commodity, '')

UNION ALL

SELECT 'disbursement_monthly',
       COALESCE(e.commodity, ''),
       COUNT(*)
FROM monthly_disbursement_elt e
WHERE NOT EXISTS (
    SELECT 1 FROM commodity_alias a
    WHERE a.source = 'disbursement_monthly'
      AND COALESCE(e.commodity, '') = COALESCE(a.alias_commodity, '')
)
GROUP BY COALESCE(e.commodity, '')

UNION ALL

SELECT 'revenue_monthly',
       COALESCE(e.mineral_production_code_desc, '') || ' | ' ||
       COALESCE(e.commodity, '') || ' | ' ||
       COALESCE(e.product_code_desc, ''),
       COUNT(*)
FROM monthly_revenue_elt e
WHERE NOT EXISTS (
    SELECT 1 FROM commodity_alias a
    WHERE a.source = 'revenue_monthly'
      AND COALESCE(e.mineral_production_code_desc, '') = COALESCE(a.alias_mineral_lease_type, '')
      AND COALESCE(e.commodity, '') = COALESCE(a.alias_commodity, '')
      AND COALESCE(e.product_code_desc, '') = COALESCE(a.alias_product, '')
)
GROUP BY e.mineral_production_code_desc, e.commodity, e.product_code_desc;
