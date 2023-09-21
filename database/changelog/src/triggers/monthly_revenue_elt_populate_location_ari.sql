CREATE TRIGGER monthly_revenue_elt_populate_location_ari
    AFTER INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION populate_location_revenue();