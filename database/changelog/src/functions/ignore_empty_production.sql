CREATE OR REPLACE FUNCTION ignore_empty_production()
  RETURNS TRIGGER
AS $$
BEGIN
    
    IF NEW.period_date IS NULL
        AND NEW.land_class IS NULL
        AND NEW.land_category IS NULL
        AND NEW.commodity IS NULL
        AND NEW.volume IS NULL
    THEN
        RETURN NULL;
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;