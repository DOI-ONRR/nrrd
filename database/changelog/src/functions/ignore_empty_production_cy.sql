CREATE OR REPLACE FUNCTION ignore_empty_production_cy()
  RETURNS TRIGGER
AS $$
BEGIN
    
    IF NEW.calendar_year IS NULL
        AND NEW.land_category IS NULL 
        AND NEW.land_class IS NULL
        AND NEW.state IS NULL
        AND NEW.county IS NULL
        AND NEW.fips_code IS NULL
        AND NEW.offshore_region IS NULL
        AND NEW.product IS NULL
        AND NEW.volume IS NULL
    THEN
        RETURN NULL;
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;