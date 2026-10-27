CREATE OR REPLACE VIEW download_fiscal_year_disbursements AS
SELECT period.period_date AS "Date",
  period.fiscal_year AS "Fiscal Year",
  fund.fund_class AS "Fund Type",
  fund.source AS "Source",
  location.state_name AS "State",
  location.county AS "County",
  round(disbursement.disbursement, 2) AS "Disbursement"
FROM disbursement
  JOIN period USING (period_id)
  JOIN location USING (location_id)
  JOIN commodity USING (commodity_id)
  JOIN fund USING (fund_id)
WHERE period.period::text = 'Fiscal Year'::text
ORDER BY period.period_date;
