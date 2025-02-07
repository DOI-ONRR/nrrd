CREATE OR REPLACE FUNCTION transform_revenue_type()
    RETURNS TRIGGER
AS $$
BEGIN
    CASE NEW.revenue_type
        WHEN '' THEN
            NEW.revenue_type := 'Other revenues';
        WHEN 'Civil Penalty' THEN
            NEW.revenue_type := 'Civil penalties';
        ELSE
            NEW.revenue_type := UPPER(SUBSTRING(NEW.revenue_type, 1, 1)) || LOWER(SUBSTRING(NEW.revenue_type, 2));
    END CASE;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;