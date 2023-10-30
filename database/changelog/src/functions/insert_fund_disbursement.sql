CREATE OR REPLACE FUNCTION insert_fund_disbursement()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO fund(
        fund_type,
        fund_class,
        recipient,
        revenue_type,
        source,
        disbursement_type
    )
    VALUES (
        COALESCE(NEW.fund_type, ''),
       	COALESCE(NEW.fund_class, ''),
       	COALESCE(NEW.recipient, ''),
        COALESCE(NEW.category, ''),
        CASE 
            WHEN NEW.disbursement_type = '8(g)' THEN 
                '8(g) offshore'
	        WHEN NEW.disbursement_type LIKE '%GoMESA%' 
                OR NEW.disbursement_type LIKE '%GOMESA%' THEN 
                'GOMESA offshore'
 	        ELSE 
                COALESCE(NEW.land_category, '') 
        END,
	    COALESCE(NEW.disbursement_type, '')
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;

END $$ LANGUAGE PLPGSQL;