CREATE TRIGGER monthly_revenue_elt_insert_fund_ari
    AFTER INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_fund_revenue();