CREATE OR REPLACE FUNCTION transform_fund_type_disbursement
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.fund_type = 'BLM - Permit Processing and Improvement' THEN
        NEW.fund_type := 'Lease Process Improvement (BLM)';

    ELSIF NEW.fund_type = 'U.S. TreasuryAI' 
        OR NEW.fund_type = 'American Indian Tribes' 
        OR NEW.fund_type = 'Native American Tribes & Allottees' THEN
        
        NEW.fund_type := 'Native American Tribes & Allottees';
        NEW.fund_class := 'Native American tribes and individuals';
        NEW.recipient := 'Native American tribes and individuals';
    
    ELSIF NEW.disbursement_type like '%8(g)%' THEN
        NEW.fund_type := CONCAT(NEW.fund_type, ' 8(g)');
    
    ELSIF NEW.disbursement_type like '%GoMESA%' THEN
        NEW.fund_type := CONCAT(NEW.fund_type,' - GoMESA');
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;