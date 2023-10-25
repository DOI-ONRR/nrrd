DROP TRIGGER IF EXISTS calendar_year_production_etl_insert_period_ari ON calendar_year_production_elt;
 
CREATE TRIGGER calendar_year_production_etl_insert_period_ari
    AFTER INSERT
    ON calendar_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_period_production_cy();