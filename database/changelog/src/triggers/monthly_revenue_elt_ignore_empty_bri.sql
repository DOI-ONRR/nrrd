CREATE TRIGGER monthly_revenue_elt_ignore_empty_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION ignore_empty_revenue();