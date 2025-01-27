CREATE OR REPLACE PROCEDURE load_revenue_monthly()
AS $$
DECLARE
    monthly_revenue CURSOR FOR
        SELECT location_id,
            period_id,
            commodity_id,
            fund_id,
            SUM(revenue) revenue,
            'dollars' unit,
            '$' unit_abbr,
            COUNT(*) duplicate_no
        FROM monthly_revenue_elt e
        JOIN location l ON land_class_code = land_class 
            AND land_category_code_desc = land_category
            AND e.state=l.state
            AND county_code_desc = county
            AND e.fips_code=l.fips_code
            AND agency_state_region_code_desc =  offshore_region
        JOIN (
            SELECT revenue_type, 
                source, 
                fund_id 
            FROM fund 
            WHERE recipient = '' 
                AND fund_type = '' 
                AND fund_class = '' 
                AND disbursement_type = ''
            ) f ON e.revenue_type = f.revenue_type 
            AND e.land_category_code_desc = f.source
        JOIN commodity c ON e.commodity = c.commodity
            AND e.mineral_production_code_desc = c.mineral_lease_type 
            AND product_code_desc = product
        JOIN period ON accept_date = period_date
            AND period = 'Monthly'
        GROUP BY location_id, 
            period_id, 
            commodity_id, 
            fund_id; 
BEGIN
    FOR revenue_rec IN monthly_revenue LOOP
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
        )
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$ LANGUAGE PLPGSQL;