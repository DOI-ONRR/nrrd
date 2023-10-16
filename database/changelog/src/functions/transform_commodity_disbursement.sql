CREATE OR REPLACE FUNCTION transform_commodity_disbursement()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.commodity LIKE 'CO2%' THEN
        NEW.commodity := REPLACE(NEW.commodity, 'CO2', 'Carbon dioxide');
    ELSIF NEW.commodity LIKE 'Carbon Dioxide%' THEN
        NEW.commodity := REPLACE(NEW.commodity, 'Carbon Dioxide', 'Carbon dioxide');
    ELSIF NEW.commodity LIKE 'NGL%' THEN
        NEW.commodity := REPLACE(NEW.commodity, 'NGL', 'Natural gas liquids');
    ELSIF NEW.commodity LIKE 'Oil & Gas%' THEN
        NEW.commodity := REPLACE(NEW.commodity, 'Oil & Gas', 'Oil & gas (pre-production)');
    END IF;

    NEW.commodity := UPPER(SUBSTRING(NEW.commodity, 1, 1)) || LOWER(SUBSTRING(NEW.commodity, 2));

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;