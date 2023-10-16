CREATE OR REPLACE FUNCTION transform_county_code_desc()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.county_code_desc = 'Santa Barbar' THEN
        NEW.county_code_desc := 'Santa Barbara';
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;