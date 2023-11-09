CREATE OR REPLACE PROCEDURE load_revenue_fiscal_year()
AS $$
DECLARE
    fy_periods CURSOR FOR
        SELECT period_id, 
            fiscal_year
        FROM period p
        WHERE p.period = 'Fiscal Year'
            AND NOT EXISTS (
                SELECT 1
                FROM revenue r
                WHERE r.period_id = p.period_id
            )
            AND 12 = (
                SELECT COUNT(*)
                FROM period
                WHERE period = 'Monthly'
                  AND fiscal_year = p.fiscal_year
            );

    fiscal_year_revenue CURSOR (p_fiscal_year period.fiscal_year%TYPE) FOR
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
            AND p.period = 'Monthly'
	        AND p.fiscal_year = p_fiscal_year
        GROUP BY r.location_id, 
            r.commodity_id, 
            r.fund_id;
BEGIN
    FOR fy_period IN fy_periods LOOP
        FOR revenue_rec IN fiscal_year_revenue(fy_period.fiscal_year) LOOP
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
                revenue_rec.location_id,
                fy_period.period_id,
                revenue_rec.commodity_id,
                revenue_rec.fund_id,
                revenue_rec.revenue,
                revenue_rec.unit,
                revenue_rec.unit_abbr,
                revenue_rec.duplicate_no
            );
        END LOOP;
    END LOOP;
END $$ LANGUAGE PLPGSQL;