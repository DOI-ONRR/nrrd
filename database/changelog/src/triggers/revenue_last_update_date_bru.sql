DROP TRIGGER IF EXISTS revenue_last_update_date_bru ON revenue;
 
CREATE TRIGGER revenue_last_update_date_bru
    BEFORE UPDATE
    ON revenue
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();