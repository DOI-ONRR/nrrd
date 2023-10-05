DROP TRIGGER IF EXISTS monthly_disbursement_elt_insert_fund_ari ON monthly_disbursement_elt;
 
CREATE TRIGGER monthly_disbursement_elt_insert_fund_ari
    AFTER INSERT
    ON monthly_disbursement_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_fund_disbursement();