CREATE OR REPLACE FUNCTION transform_county_disbursement()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.county = 'Hidalgo Caounty' THEN
        NEW.county := 'Hidalgo County';
    END IF;
    
    NEW.county := COALESCE(REPLACE(REPLACE(REPLACE(NEW.county, ' county', ''), ' parish', ''), ' borough', ''), '');
    NEW.county := COALESCE(REPLACE(REPLACE(REPLACE(NEW.county, ' County', ''), ' Parish', ''), ' Borough', ''), '');
    NEW.county := COALESCE(REPLACE(REPLACE(REPLACE(NEW.county, ' County', ''), ' Parish', ''), ' Borough', ''), '');
    NEW.county := COALESCE(REPLACE(NEW.county, ' Paris', ''),'');

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;