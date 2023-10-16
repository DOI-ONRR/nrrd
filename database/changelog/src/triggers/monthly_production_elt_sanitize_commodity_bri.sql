DROP TRIGGER IF EXISTS monthly_production_elt_sanitize_commodity_bri ON monthly_production_elt;

CREATE TRIGGER monthly_production_elt_sanitize_commodity_bri
    BEFORE INSERT
    ON monthly_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION sanitize_commodity_production();