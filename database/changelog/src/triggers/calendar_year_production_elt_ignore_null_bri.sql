DROP TRIGGER IF EXISTS calendar_year_production_elt_ignore_empty_bri ON calendar_year_production_elt;
 
CREATE TRIGGER calendar_year_production_elt_ignore_empty_bri
    BEFORE INSERT
    ON calendar_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION ignore_empty_production_cy();