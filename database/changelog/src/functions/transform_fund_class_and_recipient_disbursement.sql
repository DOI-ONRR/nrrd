CREATE OR REPLACE FUNCTION transform_fund_class_and_recipient_disbursement()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.fund_type != '' AND NEW.fund_class = '' THEN
        NEW.fund_class := 'Other funds';
    END IF;
    
    IF NEW.fund_type = 'U.S. TreasuryAI' 
        OR NEW.fund_type = 'American Indian Tribes' 
        OR NEW.fund_type = 'Native American Tribes & Allottees' THEN
        
        NEW.fund_class := 'Native American tribes and individuals';
        NEW.recipient := 'Native American tribes and individuals';

    ELSIF NEW.fund_type = 'U.S. Treasury' OR NEW.fund_type = 'U.S. Treasury - GoMESA' THEN
        NEW.fund_class := 'U.S. Treasury';
        NEW.recipient := 'U.S. Treasury';
    
    ELSIF NEW.fund_type = 'Historic Preservation Fund' THEN
        NEW.fund_class := 'Historic Preservation Fund';
        NEW.recipient := 'Historic Preservation Fund';
    
    ELSIF NEW.fund_type = 'State' AND NEW.county = '' THEN
        NEW.fund_class := 'State and local governments';
        NEW.recipient := 'State';
    
    ELSIF NEW.fund_type = 'State' AND NEW.county != '' THEN
        NEW.fund_class := 'State and local governments';
        NEW.recipient := 'County';
    
    ELSIF NEW.fund_type = 'State 8(g)' AND NEW.county = '' THEN
        NEW.fund_class := 'State and local governments';
        NEW.recipient := 'State';
    
    ELSIF NEW.fund_type = 'State 8(g)' AND NEW.county != '' THEN
        NEW.fund_class := 'State and local governments';
        NEW.recipient := 'County';

    ELSIF LOWER(NEW.fund_type) LIKE 'u.s.%gomesa%' AND NEW.county = '' THEN
        NEW.fund_class := 'U.S. Treasury';
        NEW.recipient := 'U.S. Treasury';
    
    ELSIF LOWER(NEW.fund_type) LIKE 'state%gomesa%' AND NEW.county = '' THEN
        NEW.fund_class := 'State and local governments';
        NEW.recipient := 'State';
    
    ELSIF LOWER(NEW.fund_type) = '%gomesa%' AND NEW.county != '' THEN
        NEW.fund_class := 'State and local governments';
        NEW.recipient := 'County';
    
    ELSIF NEW.fund_type = 'Land & Water Conservation Fund - GoMesa' OR NEW.fund_type = 'Land & Water Conservation Fund - GoMESA' THEN
        NEW.fund_class := 'Land and Water Conservation Fund';
        NEW.recipient := 'Land and Water Conservation Fund - GoMesa';
    
    ELSIF NEW.fund_type = 'Land & Water Conservation Fund' THEN
        NEW.fund_class := 'Land and Water Conservation Fund';
        NEW.recipient := 'Land and Water Conservation Fund';
    
    ELSIF NEW.fund_type = 'Reclamation Fund' OR NEW.fund_type = 'Reclamation' THEN
        NEW.fund_class := 'Reclamation Fund';
        NEW.recipient := 'Reclamation Fund';
    
    ELSIF NEW.fund_type NOT IN ('', 'Historic Preservation Fund', 'U.S. Treasury - GoMESA', 'U.S. Treasury', 'State', 'U.S. TreasuryAI', 'American Indian Tribes', 'Native American Tribes & Allottees', 'Native American tribes and individuals') 
        AND COALESCE(NEW.fund_class, 'Other funds') = 'Other funds' 
        AND NEW.recipient = '' THEN
        
        NEW.fund_class := 'Other funds';
        NEW.recipient := NEW.fund_type;
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;