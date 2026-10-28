CREATE OR REPLACE VIEW download_monthly_revenue AS
SELECT period.period_date AS "Date",
  CASE
    WHEN location.county::text <> ''::text THEN location.fips_code
    ELSE ''::character varying
  END AS "FIPS Code",
  location.state_name AS "State",
  location.county AS "County",
  location.land_class AS "Land Class",
  location.land_category AS "Land Category",
  location.offshore_region AS "Offshore Region",
  commodity.mineral_lease_type AS "Mineral Lease Type",
  commodity.commodity AS "Commodity",
  commodity.product AS "Product",
  fund.revenue_type AS "Revenue Type",
  round(revenue.revenue, 2) AS "Revenue"
FROM revenue
  JOIN period USING (period_id)
  JOIN location USING (location_id)
  JOIN commodity USING (commodity_id)
  JOIN fund USING (fund_id)
WHERE period.period::text = 'Monthly'::text
ORDER BY period.period_date;
