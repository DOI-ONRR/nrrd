DROP TRIGGER IF EXISTS location_last_update_date_bru ON location;
 
CREATE TRIGGER location_last_update_date_bru
    BEFORE UPDATE
    ON location
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();