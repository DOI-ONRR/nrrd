CREATE OR REPLACE FUNCTION transform_offshore_region_production()
    RETURNS TRIGGER
AS $$
BEGIN
    CASE NEW.offshore_region
        WHEN 'Offshore Alaska' THEN
            NEW.offshore_region := 'Alaska';
            NEW.fips_code := 'AKR';
            NEW.county := '';
            NEW.state := '';
        WHEN 'Offshore Pacific' THEN
            NEW.offshore_region := 'Pacific';
            NEW.fips_code := 'POR';
            NEW.county := '';
            NEW.state := '';
        WHEN 'Offshore Atlantic' THEN
            NEW.offshore_region := 'Atlantic';
            NEW.fips_code := 'AOR';
            NEW.county := '';
            NEW.state := '';
        WHEN 'Offshore Gulf' THEN
            NEW.offshore_region := 'Gulf of Mexico';
            NEW.fips_code := 'GMR';
            NEW.county := '';
            NEW.state := '';
        ELSE
            NEW.offshore_region := NEW.offshore_region;
    END CASE;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;