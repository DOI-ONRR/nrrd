CREATE OR REPLACE FUNCTION insert_location_production_fy()
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
        COALESCE(NEW.state, ''),
        COALESCE(NEW.county, ''),
        COALESCE(NEW.fips_code, ''),
        COALESCE(NEW.offshore_region, '')
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;
END $$ LANGUAGE PLPGSQL;