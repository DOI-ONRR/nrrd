DROP TRIGGER IF EXISTS calendar_year_production_elt_insert_commodity_ari ON calendar_year_production_elt;
 
CREATE TRIGGER calendar_year_production_elt_insert_commodity_ari
    AFTER INSERT 
    ON calendar_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_commodity_production_fy();