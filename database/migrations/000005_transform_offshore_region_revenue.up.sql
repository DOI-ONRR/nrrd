CREATE OR REPLACE FUNCTION transform_offshore_region()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    CASE NEW.agency_state_region_code_desc
        WHEN 'ALASKA OCS' THEN
            NEW.agency_state_region_code_desc := 'Alaska';
            NEW.fips_code := 'AKR';
        WHEN 'PACIFIC OCS' THEN
            NEW.agency_state_region_code_desc := 'Pacific';
            NEW.fips_code := 'POR';
        WHEN 'ATLANTIC OCS' THEN
            NEW.agency_state_region_code_desc := 'Atlantic';
            NEW.fips_code := 'AOR';
        WHEN 'GULF OF MEXICO' THEN
            NEW.agency_state_region_code_desc := 'Gulf of Mexico';
            NEW.fips_code := 'GMR';
        WHEN 'NEW MEXICO', 'EAST STATES' THEN
            NEW.agency_state_region_code_desc := '';
        ELSE
            IF NEW.land_category_code_desc IN ('Not Tied to a Lease', 'Onshore') THEN
                NEW.agency_state_region_code_desc := '';
            END IF;
    END CASE;

    RETURN NEW;
END
$$;

CREATE TRIGGER monthly_revenue_elt_transform_offshore_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_offshore_region();