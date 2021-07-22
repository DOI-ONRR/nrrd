create materialized view _mview_fund_location_commodity_qtp
SELECT
  'fund' as g1,
  'location' as g2,
  'commodity' as g3,
  location.location_name,
  location.location_order,
  location.land_type,
  location.region_type,
  location.district_type,
  location.state_name,
  location.county,
  commodity.product,
  period.period,
  period.fiscal_year,
  period.calendar_year,
  CASE
    WHEN ((period.month_long) :: text <> '' :: text) THEN (period.month_long) :: text
    ELSE NULL :: text
  END AS month_long,
  (production.volume) :: double precision AS production,
  CASE
    WHEN ((location.county) :: text <> '' :: text) THEN concat(
      location.state_name,
      ', ',
      location.county,
      ' ',
      location.district_type
    )
    ELSE NULL :: text
  END AS county_name,
  CASE
    WHEN ((period.period) :: text = 'Monthly' :: text) THEN NULL :: character varying
    WHEN ((location.region_type) :: text = 'County' :: text) THEN location.state_name
    WHEN ((location.region_type) :: text = 'Offshore' :: text) THEN (concat('Offshore ', location.location_name)) :: character varying
    ELSE location.location_name
  END AS state_offshore_name
FROM
  (
    (
      (
        production
        JOIN period USING (period_id)
      )
      JOIN location USING (location_id)
    )
    JOIN commodity USING (commodity_id)
  );
