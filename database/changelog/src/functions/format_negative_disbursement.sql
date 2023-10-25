CREATE OR REPLACE FUNCTION format_negative_disbursement()
  RETURNS TRIGGER
AS $$
BEGIN
  IF TRIM(NEW.disbursement) = '-' THEN
    RETURN NULL;
  END IF;
  NEW.disbursement := REPLACE(NEW.disbursement, '(','-');
  NEW.disbursement := REPLACE(NEW.disbursement, ')','');

  RETURN NEW;
END $$ LANGUAGE PLPGSQL;