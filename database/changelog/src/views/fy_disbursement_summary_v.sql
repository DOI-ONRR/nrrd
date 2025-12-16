CREATE OR REPLACE VIEW fy_disbursement_summary_v AS
SELECT SUM(disbursement) disbursement,
  'current' fy
FROM disbursement d,
  period pe
WHERE pe.period_id = d.period_id
  AND pe.period = 'Monthly'
  AND pe.fiscal_year = (
    SELECT max(fiscal_year)
    FROM period pe2
    WHERE exists (
      SELECT 1
      FROM disbursement
      WHERE period_id = pe2.period_id
    )
  )
GROUP BY fy
UNION
SELECT SUM(disbursement) disbursement,
  'previous' fy
FROM disbursement d,
  period pe
WHERE pe.period_id = d.period_id
  AND pe.period = 'Monthly'
  AND pe.fiscal_year = (
    SELECT max(fiscal_year) - 1
    FROM period pe2
    WHERE exists (
      SELECT 1
      FROM disbursement
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
        FROM disbursement
        WHERE period_id = pe3.period_id
      )
    )
  )
GROUP BY fy;