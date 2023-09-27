CREATE OR REPLACE PROCEDURE load_revenue_calendar_year()
AS $$
DECLARE
    cy_periods CURSOR FOR
        SELECT period_id, 
            calendar_year
        FROM period p
        WHERE p.period = 'Calendar Year'
            AND NOT EXISTS (
                SELECT 1
                FROM revenue r
                WHERE r.period_id = p.period_id
            );
    
    calendar_year_revenue CURSOR (p_calendar_year period.calendar_year%TYPE) FOR
        SELECT location_id,
            commodity_id,
            fund_id,
            SUM(revenue) revenue,
            'dollars' unit,
            '$' unit_abbr,
            COUNT(*) duplicate_no
        FROM revenue r,
            period p 
        WHERE p.period_id = r.period_id
            AND period = 'Monthly'
	        AND p.calendar_year = p_calendar_year
        GROUP BY location_id, 
            commodity_id, 
            fund_id;
BEGIN

    FOR period_rec in cy_periods LOOP
        FOR cy_summary_rec IN calendar_year_revenue(period_rec.calendar_year) LOOP
            INSERT INTO revenue(
                location_id,
                period_id, 
                commodity_id, 
                fund_id, 
                revenue, 
                unit, 
                unit_abbr, 
                duplicate_no
            )
            VALUES(
                cy_summary_rec.location_id,
                period_rec.period_id,
                cy_summary_rec.commodity_id,
                cy_summary_rec.fund_id,
                cy_summary_rec.revenue,
                cy_summary_rec.unit,
                cy_summary_rec.unit_abbr,
                cy_summary_rec.duplicate_no
            )
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP
END $$ LANGUAGE PLPGSQL;