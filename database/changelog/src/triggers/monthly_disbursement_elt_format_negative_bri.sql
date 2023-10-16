DROP TRIGGER IF EXISTS monthly_disbursement_elt_format_negative_bri ON monthly_disbursement_elt;

CREATE TRIGGER monthly_disbursement_elt_format_negative_bri
    BEFORE INSERT
    ON monthly_disbursement_elt
    FOR EACH ROW
    EXECUTE FUNCTION format_negative_disbursement();