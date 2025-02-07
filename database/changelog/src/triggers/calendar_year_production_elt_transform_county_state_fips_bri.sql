DROP TRIGGER IF EXISTS calendar_year_production_elt_transform_county_state_fips_bri ON calendar_year_production_elt;
 
CREATE TRIGGER calendar_year_production_elt_transform_county_state_fips_bri
    BEFORE INSERT
    ON calendar_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_county_state_fips_code_prod_fy();