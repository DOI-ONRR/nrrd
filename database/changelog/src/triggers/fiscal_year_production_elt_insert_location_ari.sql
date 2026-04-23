DROP TRIGGER IF EXISTS fiscal_year_production_elt_insert_location_ari ON fiscal_year_production_elt;
 
CREATE TRIGGER fiscal_year_production_elt_insert_location_ari
    AFTER INSERT
    ON fiscal_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_location_production_fy();