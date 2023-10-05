DROP TRIGGER IF EXISTS monthly_disbursement_elt_sanitize_nulls_bri ON monthly_disbursement_elt;

CREATE TRIGGER monthly_disbursement_elt_sanitize_nulls_bri
    BEFORE INSERT
    ON monthly_disbursement_elt
    FOR EACH ROW
    EXECUTE FUNCTION sanitize_nulls_disbursement();