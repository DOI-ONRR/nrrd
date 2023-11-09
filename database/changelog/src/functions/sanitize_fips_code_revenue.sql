CREATE OR REPLACE FUNCTION sanitize_fips_code()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.county_code_desc != '' THEN
        NEW.fips_code := LPAD(NEW.fips_code, 5, '0');
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;