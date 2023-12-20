DROP VIEW IF EXISTS download_federal_sales_v;

CREATE VIEW download_federal_sales_v AS
SELECT calendar_year "Date",
  calendar_year "Calendar Year",
  land_class "Land Class",
  land_category "Land Category",
  state_offshore_region "State/Offshore Region",
  revenue_type "Revenue Type",
  commodity "Commodity",
  sales_volume "Sales Volume",
  gas_volume "Gas MMBtu Volume",
  sales_value "Sales Value",
  royalty_value_prior_to_allowance "Royalty Value Prior to Allowances (RVPA)",
  transportation_allowance "Transportation Allowances (TA)",
  processing_allowance "Processing Allowances (PA)",
  royalty_value_less_allowance "Royalty Value Less Allowances (RVLA)",
  effective_royalty_rate "Effective Royalty Rate"
FROM sales
ORDER BY commodity,
  calendar_year;