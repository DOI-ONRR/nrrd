DROP TRIGGER IF EXISTS monthly_production_elt_ignore_empty_bri ON monthly_production_elt;
 
CREATE TRIGGER monthly_production_elt_ignore_empty_bri
    BEFORE INSERT
    ON monthly_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION ignore_empty_production();