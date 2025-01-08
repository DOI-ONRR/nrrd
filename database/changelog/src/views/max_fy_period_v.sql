DROP VIEW IF EXISTS max_fy_period_v;

CREATE VIEW max_fy_period_v AS
SELECT fiscal_year, 
  month_long, 
  calendar_year
FROM period p
WHERE period = 'Monthly'
  AND fiscal_year = (
    SELECT MAX(fiscal_year)
    FROM period 
    WHERE period = 'Monthly')
  AND fiscal_month = (
    SELECT MAX(fiscal_month) 
    FROM period p2 
    WHERE fiscal_year = p.fiscal_year 
      AND EXISTS (
        SELECT 1 
        FROM disbursement 
        WHERE period_id = p2.period_id))
  AND EXISTS (
    SELECT 1 
    FROM disbursement 
    WHERE period_id = p.period_id);