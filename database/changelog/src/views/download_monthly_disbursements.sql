CREATE OR REPLACE VIEW download_monthly_disbursements AS
SELECT period.period_date AS "Date",
  fund.fund_type AS "Fund Type",
  location.land_category AS "Land Category",
  fund.disbursement_type AS "Disbursement Type",
  location.state_name AS "State",
  location.county AS "County",
  fund.revenue_type AS "Category",
  commodity.commodity AS "Commodity",
  round(disbursement.disbursement, 2) AS "Disbursement"
FROM disbursement
  JOIN period USING (period_id)
  JOIN location USING (location_id)
  JOIN commodity USING (commodity_id)
  JOIN fund USING (fund_id)
WHERE period.period::text = 'Monthly'::text
ORDER BY period.period_date;
