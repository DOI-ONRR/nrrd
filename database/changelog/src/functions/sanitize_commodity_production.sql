CREATE OR REPLACE FUNCTION sanitize_commodity_production()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.commodity LIKE 'Coal%' THEN
        NEW.commodity := REPLACE(NEW.commodity,'(ton)','(tons)');
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;