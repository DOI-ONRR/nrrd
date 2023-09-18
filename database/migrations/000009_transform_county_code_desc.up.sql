CREATE OR REPLACE FUNCTION transform_county_code_desc()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    IF NEW.county_code_desc = 'Santa Barbar' THEN
        NEW.county_code_desc := 'Santa Barbara';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER monthly_revenue_elt_transform_county_code_desc_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_county_code_desc();