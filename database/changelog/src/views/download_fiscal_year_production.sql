DROP VIEW IF EXISTS download_fiscal_year_production;

CREATE VIEW download_fiscal_year_production AS
SELECT DISTINCT period.period_date AS "Date",
  period.fiscal_year AS "Fiscal Year",
  location.land_class AS "Land Class",
  location.land_category AS "Land Category",
  location.state_name AS "State",
  location.county AS "County",
  CASE
    WHEN location.county::text <> ''::text THEN location.fips_code
    ELSE ''::character varying
  END AS "FIPS Code",
  location.offshore_region AS "Offshore Region",
  UPPER(left(commodity.product, 1)) || LOWER(SUBSTRING(commodity.product FROM 2)) AS "Product",
  production.volume AS "Volume"
FROM production
  JOIN period USING (period_id)
  JOIN location USING (location_id)
  JOIN commodity USING (commodity_id)
WHERE period.period::text = 'Fiscal Year'::text
ORDER BY period.period_date;