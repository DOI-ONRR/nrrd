CREATE OR REPLACE FUNCTION format_negative_disbursement()
  RETURNS TRIGGER
AS $$
BEGIN
    NEW.disbursement := REPLACE(NEW.disbursement, '(','-');
    NEW.disbursement := REPLACE(NEW.disbursement, ')','');

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;