CREATE OR REPLACE FUNCTION insert_period_production_fy()
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
        'Fiscal Year',
	    TO_NUMBER(NEW.fiscal_year, '9999'),
	    TO_NUMBER(NEW.fiscal_year, '9999'),
	    0,
	    '',
	    '',
	    0,
	    TO_DATE(CONCAT('01/01/', NEW.fiscal_year), 'MM/DD/YYYY')
    )
    ON CONFLICT DO NOTHING;

    RETURN NULL;

END $$ LANGUAGE PLPGSQL;