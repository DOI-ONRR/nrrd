DROP VIEW IF EXISTS federal_sales_v;

CREATE VIEW federal_sales_v AS
SELECT id,
  calendar_year,
  'Calendar Year' period,
  land_class || ' ' || land_category land_type,
  state_offshore_region,
  revenue_type,
  CASE commodity
  WHEN 'Gas (mcf)' THEN
    'Gas (mmbtu)'
  ELSE
    commodity
  END commodity,
  CASE commodity
  WHEN 'Gas (mcf)' THEN
    gas_volume
  ELSE
    sales_volume
  END sales_volume,
  sales_value,
  royalty_value_prior_to_allowance,
  transportation_allowance,
  processing_allowance,
  royalty_value_less_allowance,
  effective_royalty_rate
FROM sales
WHERE commodity != 'Not Tied to a Commodity';