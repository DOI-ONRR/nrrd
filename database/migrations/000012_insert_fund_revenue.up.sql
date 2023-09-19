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

CREATE TRIGGER monthly_revenue_elt_insert_fund_ari
    AFTER INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_fund_revenue();