CREATE OR REPLACE VIEW download_fiscal_year_revenue AS
SELECT period.period_date AS "Date",
  period.fiscal_year AS "Fiscal Year",
  CASE
    WHEN location.region_type::text = 'County'::text THEN location.fips_code
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
WHERE period.period::text = 'Fiscal Year'::text
ORDER BY period.period_date;
