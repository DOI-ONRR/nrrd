CREATE OR REPLACE FUNCTION sanitize_nulls_disbursement()
    RETURNS TRIGGER
AS $$
BEGIN
    NEW.fund_type := COALESCE(NEW.fund_type, '');
    NEW.disbursement_type := COALESCE(NEW.disbursement_type, '');
    NEW.land_category := COALESCE(NEW.land_category, '');
    NEW.state := COALESCE(NEW.state, '');
    NEW.county := COALESCE(NEW.county, '');
    NEW.fund_class := COALESCE(NEW.fund_class, '');
    NEW.recipient := COALESCE(NEW.recipient, '');
    NEW.category := COALESCE(NEW.category, '');

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;