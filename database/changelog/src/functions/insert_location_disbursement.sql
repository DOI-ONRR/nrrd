CREATE OR REPLACE FUNCTION insert_location_disbursement()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO location(
        land_class,
        land_category,
        state,
        county,
        fips_code
    )
    VALUES(
        CASE 
            WHEN NEW.fund_type = 'Native American Tribes & Allottees' THEN 
                'Native American' 
            ELSE 'Federal' 
        END,
        COALESCE(NEW.land_category, ''),
        COALESCE(NEW.state, ''),
        COALESCE(NEW.county, ''),
        COALESCE(NEW.fips_code, ''),
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;
END $$ LANGUAGE PLPGSQL;