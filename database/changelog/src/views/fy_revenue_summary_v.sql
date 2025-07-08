CREATE OR REPLACE VIEW fy_revenue_summary_v AS
SELECT SUM(revenue) revenue,
  'current' fy
FROM revenue r,
  period pe
WHERE pe.period_id = r.period_id
  AND pe.period = 'Monthly'
  AND pe.fiscal_year = (
    SELECT max(fiscal_year)
    FROM period pe2
    WHERE exists (
      SELECT 1
      FROM revenue
      WHERE period_id = pe2.period_id
    )
  )
GROUP BY fy
UNION
SELECT SUM(revenue) revenue,
  'previous' fy
FROM revenue r,
  period pe
WHERE pe.period_id = r.period_id
  AND pe.period = 'Monthly'
  AND pe.fiscal_year = (
    SELECT max(fiscal_year) - 1
    FROM period pe2
    WHERE exists (
      SELECT 1
      FROM revenue
      WHERE period_id = pe2.period_id
    )
  )
  AND pe.fiscal_month <= (
    SELECT max(fiscal_month)
    FROM period pe2
    WHERE fiscal_year = (
      SELECT max(fiscal_year)
      FROM period pe3
      WHERE exists (
        SELECT 1
        FROM production
        WHERE period_id = pe2.period_id
      )
    )
  )
GROUP BY fy;