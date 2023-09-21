CREATE TRIGGER monthly_revenue_elt_format_negative_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION format_negative_revenue();