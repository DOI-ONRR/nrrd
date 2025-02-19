DROP TRIGGER IF EXISTS commodity_last_update_date_bru ON commodity;
 
CREATE TRIGGER commodity_last_update_date_bru
    BEFORE UPDATE
    ON commodity
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();