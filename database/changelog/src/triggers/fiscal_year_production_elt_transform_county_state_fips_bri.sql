DROP TRIGGER IF EXISTS fiscal_year_production_elt_transform_county_state_fips_bri ON fiscal_year_production_elt;
 
CREATE TRIGGER fiscal_year_production_elt_transform_county_state_fips_bri
    BEFORE INSERT
    ON fiscal_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_county_state_fips_code_prod_fy();