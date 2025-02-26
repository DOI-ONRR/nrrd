DROP TRIGGER IF EXISTS production_last_update_date_bru ON production;
 
CREATE TRIGGER production_last_update_date_bru
    BEFORE UPDATE
    ON production
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();