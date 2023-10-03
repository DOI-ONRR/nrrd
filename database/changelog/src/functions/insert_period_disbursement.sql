CREATE OR REPLACE FUNCTION insert_period_revenue()
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
        calendar_year,
        EXTRACT(year FROM NEW.period_date + INTERVAL '3 months'),
        EXTRACT(month FROM NEW.period_date),	
        month,
        TO_CHAR(NEW.period_date, 'Mon'),
        EXTRACT(month FROM NEW.period_date + INTERVAL '3 months'),	
        NEW.period_date
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;

END $$ LANGUAGE PLPGSQL;