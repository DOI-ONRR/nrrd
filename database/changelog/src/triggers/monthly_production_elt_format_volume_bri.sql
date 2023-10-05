DROP TRIGGER IF EXISTS monthly_production_elt_format_volume_bri ON monthly_production_elt;

CREATE TRIGGER monthly_production_elt_format_volume_bri
    BEFORE INSERT
    ON monthly_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION format_volume();