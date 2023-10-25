CREATE OR REPLACE FUNCTION insert_commodity_production_fy()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO commodity(
        commodity, 
        product, 
        commodity_order
        )
    VALUES (
	    CASE 
            WHEN NEW.product LIKE '%(%' THEN 
                COALESCE(SPLIT_PART(NEW.product, ' (', 1), '')
	        WHEN NEW.product LIKE '%-%' THEN 
                COALESCE(SPLIT_PART(NEW.product, ' - ', 1), '')
	        ELSE 
                NEW.product 
        END,
        COALESCE(NEW.product, ''),
	    CASE 
            WHEN NEW.product IS NULL THEN 
                'ZZZ' 
	        WHEN NEW.product LIKE 'Oil%' THEN 
                '1' 
	        WHEN NEW.product LIKE 'Gas%' THEN 
                '2'
            WHEN NEW.product LIKE 'Coal%' THEN 
                '5'
            ELSE 
                substr(NEW.product, 1, 5) 
        END
        )
    ON CONFLICT DO NOTHING;

    RETURN NULL;
    
END $$ LANGUAGE PLPGSQL;