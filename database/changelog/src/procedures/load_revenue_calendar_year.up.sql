CREATE OR REPLACE PROCEDURE load_revenue_calendar_year()
AS $$
DECLARE
    calendar_year_revenue CURSOR FOR
        SELECT location_id,
            period_id,
            commodity_id,
            fund_id,
            SUM(TO_NUMBER(revenue, 'L999G999G999G999D999999999')) revenue,
            'dollars' unit,
            '$' unit_abbr,
            COUNT(*) duplicate_no
        FROM monthly_revenue_elt e
        JOIN location l ON land_class_code = land_class 
            AND land_category_code_desc = land_category
            AND e.state = l.state
            AND county_code_desc = county
            AND e.fips_code = l.fips_code
            AND agency_state_region_code_desc = offshore_region
        JOIN fund f ON e.revenue_type = f.revenue_type
	        AND land_category_code_desc = source
            AND recipient = '' 
            AND fund_type = '' 
            AND fund_class = '' 
            AND disbursement_type = ''
        JOIN commodity c ON e.commodity=c.commodity
            AND e.mineral_production_code_desc = c.mineral_lease_type 
            AND product_code_desc = product
        JOIN period p ON EXTRACT(year from accept_date) = p.calendar_year
            AND period = 'Calendar Year'
	        AND period_date <= (SELECT max(period_date) FROM period WHERE month = 12)
        GROUP BY location_id, 
            period_id, 
            commodity_id, 
            fund_id;
BEGIN
    FOR revenue_rec IN calendar_year_revenue LOOP
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
            revenue_rec.period_id,
            revenue_rec.commodity_id,
            revenue_rec.fund_id,
            revenue_rec.revenue,
            revenue_rec.unit,
            revenue_rec.unit_abbr,
            revenue_rec.duplicate_no
        );
    END LOOP;
END $$ LANGUAGE PLPGSQL;