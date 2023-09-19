CREATE OR REPLACE FUNCTION insert_commodity_revenue()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO commodity(
        mineral_lease_type, 
        commodity, 
        product, 
        commodity_order
        )
    VALUES (
	    COALESCE(NEW.mineral_production_code_desc,''),
	    COALESCE(NEW.commodity,'Not tied to a commodity'),
	    COALESCE(NEW.product_code_desc, ''),
	    CASE 
            WHEN NEW.commodity IS NULL THEN 'ZZZ' 
	        WHEN NEW.commodity = 'Oil' THEN '1' 
	        WHEN NEW.commodity = 'Gas' THEN '2'
     	    WHEN NEW.commodity = 'Oil & gas (pre-production)' THEN '3' 
       	    WHEN NEW.commodity = 'Natural gas liquids' THEN '4' 
            WHEN NEW.commodity = 'Coal' THEN '5' 
        ELSE 
            substr(NEW.commodity, 1,5) 
        END
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;
    
END $$ LANGUAGE PLPGSQL;

CREATE TRIGGER monthly_revenue_elt_insert_commodity_ari
    AFTER INSERT 
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_commodity_revenue();