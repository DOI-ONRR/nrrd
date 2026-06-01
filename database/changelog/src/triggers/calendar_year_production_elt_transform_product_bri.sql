-- The CY-side transform_product trigger has been retired.
-- Its renames are now expressed as rows in commodity_alias (source='production_calendar_year')
-- and its title-case workaround is replaced by the case-insensitive alias join in
-- load_production_calendar_year. The FY ELT still uses the transform_product() function.
DROP TRIGGER IF EXISTS calendar_year_production_elt_transform_product_bri ON calendar_year_production_elt;
