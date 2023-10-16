CREATE OR REPLACE FUNCTION insert_location_production()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO location(
        land_class,
        land_category,
        state,
        county,
        fips_code,
        offshore_region
    )
    VALUES(
        COALESCE(NEW.land_class, ''),
        COALESCE(NEW.land_category, ''),
        CASE 
            WHEN NEW.land_class = 'Federal' THEN 
                'Nationwide'
            ELSE 
                'Native American' 
        END,
        '',
        CASE 
            WHEN NEW.land_class = 'Federal' THEN 
                'NL'
        ELSE 
            'NA' 
        END,
        ''  
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;
END $$ LANGUAGE PLPGSQL;