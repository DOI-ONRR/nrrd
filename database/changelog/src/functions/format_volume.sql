CREATE OR REPLACE FUNCTION format_volume()
  RETURNS TRIGGER
AS $$
BEGIN
    NEW.volume := REPLACE(NEW.volume, '(','-');
    NEW.volume := REPLACE(NEW.volume, ')','');

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;