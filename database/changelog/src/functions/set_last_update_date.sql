CREATE OR REPLACE FUNCTION set_last_update_date()
  RETURNS TRIGGER
AS $$
BEGIN
    NEW.last_update_date = transaction_timestamp();
    RETURN NEW;
END $$ LANGUAGE PLPGSQL;