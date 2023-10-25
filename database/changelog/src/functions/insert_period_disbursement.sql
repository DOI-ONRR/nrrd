CREATE OR REPLACE FUNCTION insert_period_disbursement()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO PERIOD(
        period,
        calendar_year,
        fiscal_year,
        month,
        month_long,
        month_short,
        fiscal_month,
        period_date 
    )
    VALUES (
        'Monthly',
        NEW.calendar_year,
        EXTRACT(year FROM (TO_DATE(CONCAT('01 ', NEW.month, ' ', NEW.calendar_year), 'DD Month YYYY')) + INTERVAL '3 months'),
        EXTRACT(month FROM (TO_DATE(CONCAT('01 ', NEW.month, ' ', NEW.calendar_year), 'DD Month YYYY'))),	
        NEW.month,
        TO_CHAR((TO_DATE(CONCAT('01 ', NEW.month, ' ', NEW.calendar_year), 'DD Month YYYY')), 'Mon'),
        EXTRACT(month FROM (TO_DATE(CONCAT('01 ', NEW.month, ' ', NEW.calendar_year), 'DD Month YYYY')) + INTERVAL '3 months'),	
        (TO_DATE(CONCAT('01 ', NEW.month, ' ', NEW.calendar_year), 'DD Month YYYY'))
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;

END $$ LANGUAGE PLPGSQL;