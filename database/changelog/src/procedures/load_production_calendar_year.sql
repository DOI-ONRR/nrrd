CREATE OR REPLACE PROCEDURE load_production_calendar_year()
AS $$
DECLARE
    cy_production CURSOR FOR
    SELECT location_id,
        period_id,
        commodity_id,
        TO_NUMBER(volume, 'L999G999G999G999D99') volume,
        COALESCE(SUBSTR(SPLIT_PART(SPLIT_PART(e.product, ' (', 2), ')', 1), 1, 20), '') unit,
        COALESCE(SUBSTR(SPLIT_PART(SPLIT_PART(e.product, ' (', 2), ')', 1), 1, 5), '') unit_abbr,
        COUNT(*) duplicate_no
    FROM calendar_year_production_elt e,
        location l,
        commodity c,
        period p
    WHERE COALESCE(e.land_class, '') = l.land_class 
        AND COALESCE(e.land_category, '') = l.land_category
        AND COALESCE(e.state, '') = l.state
        AND COALESCE(e.county, '') = l.county
        AND COALESCE(e.fips_code, '') = l.fips_code
        AND COALESCE(e.offshore_region, '') = l.offshore_region
        AND CASE 
                WHEN e.product LIKE '%(%' THEN 
                    COALESCE(SPLIT_PART(e.product,' (', 1), '')
	            WHEN e.product LIKE '%-%' THEN 
                    COALESCE(SPLIT_PART(e.product,' - ', 1), '')
	            ELSE e.product 
            END = c.commodity
     AND COALESCE(e.product, '') = c.product
        AND c.mineral_lease_type = ''
        AND p.period = 'Calendar Year'
        AND p.period_date = TO_DATE(concat('01', '/01/', e.calendar_year), 'MM/DD/YYYY')
    GROUP BY location_id, 
        period_id, 
        commodity_id, 
        volume, 
        e.product;

    v_from_date period.period_date%TYPE;
BEGIN
    SELECT TO_DATE('01/01/' || MIN(calendar_year), 'MM/DD/YYYY')
    INTO v_from_date
    FROM calendar_year_production_elt;

    CALL delete_production('Calendar Year', v_from_date);

    FOR production_rec IN cy_production LOOP
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