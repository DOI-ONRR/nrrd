CREATE OR REPLACE FUNCTION transform_fips_code_disbursement()
    RETURNS TRIGGER
AS $$
DECLARE
    l_fips_code county_lookup.fips_code%TYPE;
BEGIN
    SELECT fips_code
    INTO l_fips_code
    FROM county_lookup
    WHERE county = NEW.county
    AND state = NEW.state;

    NEW.fips_code := l_fips_code;
    
    RETURN NEW;
EXCEPTION
    WHEN no_data_found THEN
        NEW.fips_code := '';
        RETURN NEW;
END $$ LANGUAGE PLPGSQL;