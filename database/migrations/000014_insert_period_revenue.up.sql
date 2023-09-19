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
        EXTRACT(year FROM NEW.accept_date),
        EXTRACT(year FROM NEW.accept_date + INTERVAL '3 months'),
        EXTRACT(month FROM NEW.accept_date),
        TRIM(TO_CHAR(NEW.accept_date, 'Month')),
        TO_CHAR(NEW.accept_date, 'Mon'),
        EXTRACT(month FROM NEW.accept_date + INTERVAL '3 months'),	
        NEW.accept_date
    )
    ON CONFLICT DO NOTHING;

    IF EXTRACT(month FROM NEW.accept_date) = 9 THEN
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
            'Fiscal Year',
            EXTRACT(year FROM NEW.accept_date + INTERVAL '3 months'),
            EXTRACT(year FROM NEW.accept_date + INTERVAL '3 months'),
            0,
            '',
            '',
            0,
            TO_DATE(CONCAT('01/01/', EXTRACT(year FROM NEW.accept_date + INTERVAL '3 months')), 'MM/DD/YYYY')
        )
        ON CONFLICT DO NOTHING;
    END IF;

    IF EXTRACT(month FROM NEW.accept_date) = 12 THEN
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
            'Calendar Year',
            EXTRACT(year FROM NEW.accept_date),
            EXTRACT(year FROM NEW.accept_date),
            0,
            '',
            '',
            0,
            TO_DATE(CONCAT('01/01/', EXTRACT(year FROM NEW.accept_date)), 'MM/DD/YYYY')
        )
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NULL;

END $$ LANGUAGE PLPGSQL;

CREATE TRIGGER monthly_revenue_etl_insert_period_ari
    AFTER INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION insert_period_revenue();