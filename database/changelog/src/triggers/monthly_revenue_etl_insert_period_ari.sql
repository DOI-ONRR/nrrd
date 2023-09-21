CREATE TRIGGER monthly_revenue_etl_insert_period_ari
    AFTER INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_period_revenue();