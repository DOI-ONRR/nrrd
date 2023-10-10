DROP TRIGGER IF EXISTS calendar_year_production_elt_transform_offshore_region_bri ON calendar_year_production_elt;
 
CREATE TRIGGER calendar_year_production_elt_transform_offshore_region_bri
    BEFORE INSERT
    ON calendar_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_offshore_region_production();