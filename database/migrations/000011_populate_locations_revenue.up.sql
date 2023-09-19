CREATE OR REPLACE FUNCTION populate_location_revenue()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
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
        COALESCE(NEW.land_class_code, ''),
        COALESCE(NEW.land_category_code_desc, ''),
        COALESCE(NEW.state, ''),
        COALESCE(NEW.county_code_desc, ''),
        COALESCE(NEW.fips_code, ''),
        COALESCE(NEW.agency_state_region_code_desc,'')
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;
END $$;

CREATE TRIGGER monthly_revenue_elt_populate_location_ari
    AFTER INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION populate_location_revenue();