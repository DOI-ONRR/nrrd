CREATE OR REPLACE FUNCTION transform_county_state_fips_code_prod_fy()
    RETURNS TRIGGER
AS $$
BEGIN
    NEW.county := COALESCE(REPLACE(REPLACE(REPLACE(NEW.county,' County', ''),' Parish',''), ' Borough',''),'');
    
    IF NEW.state = 'LA' AND NEW.land_category = 'Offshore' THEN
        NEW.state := '';
        NEW.county := '';
        NEW.fips_code := 'GMR';
        NEW.offshore_region := 'Gulf of Mexico';
    END IF;

    IF NEW.fips_code IS NULL THEN
        DECLARE
            v_fips_code county_lookup.fips_code%TYPE;
        BEGIN
            SELECT fips_code
            INTO v_fips_code
            FROM county_lookup
            WHERE county = NEW.county
                AND state = NEW.state;

            NEW.fips_code := v_fips_code;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE NOTICE 'No record in county_lookup. No problem.';
        END;
    END IF;

    IF NEW.county = 'Santa Barbar' THEN
        NEW.county := 'Santa Barbara';
    END IF;

    IF NEW.county != '' THEN
        NEW.fips_code := LPAD(NEW.fips_code, 5, '0');
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;