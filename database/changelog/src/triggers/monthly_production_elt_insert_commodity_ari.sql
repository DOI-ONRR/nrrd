DROP TRIGGER IF EXISTS monthly_production_elt_insert_commodity_ari ON monthly_production_elt;
 
CREATE TRIGGER monthly_production_elt_insert_commodity_ari
    AFTER INSERT 
    ON monthly_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_commodity_production();