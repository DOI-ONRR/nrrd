CREATE OR REPLACE VIEW curr_fy_production_summary_v AS
SELECT SUM(volume) volume,
  commodity,
  unit_abbr
FROM production p,
  period pe,
  commodity c
WHERE pe.period_id = p.period_id
  AND pe.period = 'Monthly'
  AND pe.fiscal_year = (
    SELECT max(fiscal_year)
    FROM period pe2
    WHERE exists (
      SELECT 1
      FROM production
      WHERE period_id = pe2.period_id
    )
  )
  AND c.commodity_id = p.commodity_id
GROUP BY c.commodity,
  unit_abbr;