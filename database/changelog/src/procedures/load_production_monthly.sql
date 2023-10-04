CREATE OR REPLACE PROCEDURE load_production_monthly()
AS $$
DECLARE
    monthly_production CURSOR FOR
    SELECT location_id,
        period_id,
        commodity_id,
        TO_NUMBER(volume, 'L999G999G999G999D99') volume,
        REPLACE(REPLACE(SPLIT_PART(e.commodity, 'Prod Vol ', 2), '(', ''), ')', '') unit,
        REPLACE(REPLACE(SPLIT_PART(e.commodity, 'Prod Vol ', 2), '(', ''), ')', '') unit_abbr,
        COUNT(*) duplicate_no
    FROM monthly_production_elt e,
        location l,
        commodity c,
        period p
    WHERE COALESCE(e.land_class, '') = l.land_class 
        AND COALESCE(e.land_category, '') = l.land_category
        AND CASE 
                WHEN e.land_class = 'Federal' THEN 
                    'Nationwide'
                ELSE 
                    'Native American' 
            END =  l.state
        AND SPLIT_PART(e.commodity, ' ', 1) = c.commodity
        AND COALESCE(REPLACE(e.commodity, 'Prod Vol ', ''), '') = c.product
        AND c.mineral_lease_type = ''
        AND p.period = 'Monthly'
        AND e.period_date = p.period_date
    GROUP BY location_id, 
        period_id, 
        commodity_id, 
        volume, 
        e.commodity;
BEGIN
    FOR production_rec IN monthly_production LOOP
        INSERT INTO production (
            location_id,
            period_id, 
            commodity_id,
            volume,
            unit,
            unit_abbr, 
            duplicate_no
        )
        VALUES (
            production_rec.location_id,
            production_rec.period_id,
            production_rec.commodity_id,
            production_rec.volume,
            production_rec.unit,
            production_rec.unit_abbr,
            production_rec.duplicate_no
        )
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$ LANGUAGE PLPGSQL;