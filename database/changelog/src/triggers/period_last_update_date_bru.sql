DROP TRIGGER IF EXISTS period_last_update_date_bru ON period;
 
CREATE TRIGGER period_last_update_date_bru
    BEFORE UPDATE
    ON period
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();