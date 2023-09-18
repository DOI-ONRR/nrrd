CREATE OR REPLACE FUNCTION transform_commodity()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
AS
$$
BEGIN
    CASE NEW.commodity
        WHEN 'CO2', 'Carbon Dioxide' THEN
            NEW.commodity := 'Carbon dioxide';
        WHEN 'NGL' THEN
            NEW.commodity := 'Natural gas liquids';
        WHEN 'Oil & Gas' THEN
            NEW.commodity := 'Oil & gas (pre-production)';
        ELSE
            NEW.commodity := UPPER(SUBSTRING(NEW.commodity, 1, 1)) || LOWER(SUBSTRING(NEW.commodity, 2));
    END CASE;

    RETURN NEW;
END
$$;

CREATE TRIGGER monthly_revenue_elt_transform_commodity_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_commodity();