DROP TRIGGER IF EXISTS fiscal_year_production_etl_insert_period_ari ON fiscal_year_production_elt;
 
CREATE TRIGGER fiscal_year_production_etl_insert_period_ari
    AFTER INSERT
    ON fiscal_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_period_production_fy();