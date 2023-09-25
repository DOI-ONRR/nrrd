CREATE OR REPLACE FUNCTION insert_fund_revenue()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO fund(
        revenue_type, 
        source
    )
    VALUES (
        COALESCE(NEW.revenue_type, ''),
        COALESCE(NEW.land_category_code_desc, '') 
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;

END $$ LANGUAGE PLPGSQL;