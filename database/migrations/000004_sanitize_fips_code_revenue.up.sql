CREATE OR REPLACE FUNCTION sanitize_fips_code()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    NEW.fips_code := LPAD(NEW.fips_code, 5, '0');

    RETURN NEW;
END
$$;

CREATE TRIGGER monthly_revenue_elt_sanitize_fips_code_bri 
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION sanitize_fips_code();