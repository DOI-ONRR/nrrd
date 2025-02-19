DROP TRIGGER IF EXISTS fund_last_update_date_bru ON fund;
 
CREATE TRIGGER fund_last_update_date_bru
    BEFORE UPDATE
    ON fund
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();