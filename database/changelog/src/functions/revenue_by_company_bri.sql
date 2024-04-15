CREATE OR REPLACE FUNCTION revenue_by_company_bri()
    RETURNS TRIGGER
AS $$
BEGIN
    NEW.raw_revenue := REPLACE(NEW.raw_revenue, '(','-');
    NEW.raw_revenue := REPLACE(NEW.raw_revenue, ')','');
    
    NEW.revenue := TO_NUMBER(NEW.raw_revenue, 'L999G999G999G999D99');
    NEW.revenue_agency := SPLIT_PART(NEW.revenue_agency_type, ' - ', 1);
    NEW.revenue_type := SPLIT_PART(NEW.revenue_agency_type, ' - ', 2);

    NEW.commodity := TRIM(NEW.commodity);

    NEW.commodity_order := substr(NEW.commodity,1,5);

    CASE NEW.commodity
        WHEN 'Oil' THEN
            NEW.commodity_order := 1;
        WHEN 'Gas' THEN
            NEW.commodity_order := 2;
        WHEN 'Oil & Gas' THEN
            NEW.commodity_order := 3;
            NEW.commodity := 'Oil & Gas (Pre-production)';
        WHEN 'NGL' THEN
            NEW.commodity_order := 4;
        WHEN 'Coal' THEN
            NEW.commodity_order := 5;
        ELSE
            NEW.commodity_order := SUBSTR(NEW.commodity, 1, 5);
    END CASE;

    NEW.commodity := UPPER(SUBSTRING(NEW.commodity, 1, 1)) || LOWER(SUBSTRING(NEW.commodity, 2));

    NEW.commodity := REPLACE(NEW.commodity, 'N\a', 'N\A');

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;