CREATE OR REPLACE FUNCTION sanitize_fips_code()
    RETURNS TRIGGER
AS $$
BEGIN
    NEW.fips_code := LPAD(NEW.fips_code, 5, '0');

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;