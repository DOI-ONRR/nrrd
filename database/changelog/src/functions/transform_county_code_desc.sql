CREATE OR REPLACE FUNCTION transform_county_code_desc()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.county_code_desc = 'Santa Barbar' THEN
        NEW.county_code_desc := 'Santa Barbara';
    END IF;

    IF NEW.county_code_desc = 'Pt. Coupee'
        OR NEW.county_code_desc = 'Point Coupee' THEN
        NEW.county_code_desc := 'Pointe Coupee';
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;