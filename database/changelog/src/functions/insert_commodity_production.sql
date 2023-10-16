CREATE OR REPLACE FUNCTION insert_commodity_production()
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
	    '',
        SPLIT_PART(NEW.commodity, ' Prod Vol', 1),
        COALESCE(REPLACE(NEW.commodity, 'Prod Vol ', ''), ''),
        CASE 
            WHEN NEW.commodity IS NULL THEN 
                'ZZZ' 
            WHEN NEW.commodity LIKE 'Oil%' THEN 
                '1' 
            WHEN NEW.commodity LIKE 'Gas%' THEN 
                '2'
            WHEN NEW.commodity LIKE 'Coal%' THEN 
                '5' 
            ELSE 
                SUBSTR(NEW.commodity, 1, 5) 
        END
        )
    ON CONFLICT DO NOTHING;

    RETURN NULL;
    
END $$ LANGUAGE PLPGSQL;