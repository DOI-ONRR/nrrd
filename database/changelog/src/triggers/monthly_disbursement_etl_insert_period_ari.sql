DROP TRIGGER IF EXISTS monthly_disbursement_etl_insert_period_ari ON monthly_disbursement_elt;
 
CREATE TRIGGER monthly_disbursement_etl_insert_period_ari
    AFTER INSERT
    ON monthly_disbursement_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_period_disbursement();