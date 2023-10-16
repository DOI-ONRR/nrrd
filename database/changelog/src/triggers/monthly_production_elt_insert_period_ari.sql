DROP TRIGGER IF EXISTS monthly_production_etl_insert_period_ari ON monthly_production_elt;
 
CREATE TRIGGER monthly_production_etl_insert_period_ari
    AFTER INSERT
    ON monthly_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_period_production();