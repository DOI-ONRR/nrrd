CREATE OR REPLACE FUNCTION transform_commodity()
    RETURNS TRIGGER
AS $$
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
END $$ LANGUAGE PLPGSQL;