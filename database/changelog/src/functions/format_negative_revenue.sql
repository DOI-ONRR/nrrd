CREATE OR REPLACE FUNCTION format_negative_revenue()
  RETURNS TRIGGER
AS $$
BEGIN
    NEW.revenue := REPLACE(NEW.revenue, '(','-');
    NEW.revenue := REPLACE(NEW.revenue, ')','');

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;