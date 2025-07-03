CREATE OR REPLACE VIEW max_fy_month_by_dataset_v AS
SELECT MAX(fiscal_month) fiscal_month,
  'production' dataset
FROM period p
WHERE EXISTS (
  SELECT 1
  FROM production
  WHERE period_id = p.period_id
)
  AND fiscal_year = (
    SELECT MAX(fiscal_year)
    FROM period p2
    WHERE EXISTS (
      SELECT 1
      FROM production
      WHERE period_id = p2.period_id
    )
  )
GROUP BY dataset
UNION
SELECT MAX(fiscal_month) fiscal_month,
  'revenue' dataset
FROM period p
WHERE EXISTS (
  SELECT 1
  FROM revenue
  WHERE period_id = p.period_id
)
  AND fiscal_year = (
    SELECT MAX(fiscal_year)
    FROM period p2
    WHERE EXISTS (
      SELECT 1
      FROM revenue
      WHERE period_id = p2.period_id
    )
  )
GROUP BY dataset
UNION
SELECT MAX(fiscal_month) fiscal_month,
  'disbursements' dataset
FROM period p
WHERE EXISTS (
  SELECT 1
  FROM disbursement
  WHERE period_id = p.period_id
)
  AND fiscal_year = (
    SELECT MAX(fiscal_year)
    FROM period p2
    WHERE EXISTS (
      SELECT 1
      FROM disbursement
      WHERE period_id = p2.period_id
    )
  )
GROUP BY dataset;