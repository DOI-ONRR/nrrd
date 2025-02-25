DROP TRIGGER IF EXISTS disbursement_last_update_date_bru ON disbursement;
 
CREATE TRIGGER disbursement_last_update_date_bru
    BEFORE UPDATE
    ON disbursement
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();