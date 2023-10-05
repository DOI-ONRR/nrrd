CREATE OR REPLACE PROCEDURE delete_production(p_period period.period%TYPE, p_from_date period.period_date%TYPE)
AS $$
DECLARE
    production_data CURSOR FOR
    SELECT *
    FROM period
    WHERE period = p_period
        AND period_date >= p_from_date
    ORDER BY calendar_year, 
        month;

BEGIN
    RAISE NOTICE 'Delete % production records beginning %', p_period, p_from_date;
    FOR production_rec IN production_data LOOP
        RAISE NOTICE 'Deleting production records for %, %', production_rec.calendar_year, production_rec.month;
        DELETE FROM production
        WHERE period_id = production_rec.period_id;
    END LOOP;
END $$ LANGUAGE PLPGSQL;