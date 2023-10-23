DROP TRIGGER IF EXISTS calendar_year_production_elt_format_volume_bri ON calendar_year_production_elt;

CREATE TRIGGER calendar_year_production_elt_format_volume_bri
    BEFORE INSERT
    ON calendar_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION format_volume();