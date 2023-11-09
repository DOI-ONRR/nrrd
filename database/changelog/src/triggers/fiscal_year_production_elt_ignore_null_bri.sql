DROP TRIGGER IF EXISTS fiscal_year_production_elt_ignore_empty_bri ON fiscal_year_production_elt;
 
CREATE TRIGGER fiscal_year_production_elt_ignore_empty_bri
    BEFORE INSERT
    ON fiscal_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION ignore_empty_production_fy();