DROP PROCEDURE IF EXISTS load_disbursement_monthly;

CREATE PROCEDURE load_disbursement_monthly(p_fiscal_year period.fiscal_year%TYPE DEFAULT NULL)
AS $$
DECLARE
    monthly_disbursement CURSOR FOR
    SELECT location_id,
        period_id,
        commodity_id,
        fund_id,
        SUM(TO_NUMBER(disbursement, 'L999G999G999G999D99')) disbursement,
        'dollars' unit,
        '$' unit_abbr,
        COUNT(*) duplicate_no
    FROM monthly_disbursement_elt e,
        location l,
        fund f,
        commodity c,
        period p
    WHERE 
        CASE 
        WHEN e.fund_type = 'Native American Tribes & Allottees' THEN 
            'Native American' 
        ELSE 
            'Federal' 
        END = l.land_class
        AND COALESCE(e.land_category, '') = l.land_category
        AND COALESCE(e.state, '') = l.state
        AND COALESCE(e.county, '') = l.county
        AND CASE WHEN COALESCE(e.fips_code, '') = '' AND e.county = '' AND LENGTH(e.state) = 2 THEN
            e.state
        ELSE
            COALESCE(e.fips_code, '')
        END = l.fips_code
        AND l.offshore_region = ''
        AND e.fund_type = f.fund_type
     	AND e.category = f.revenue_type
	    AND CASE 
            WHEN e.disbursement_type = '8(g)' THEN 
                '8(g) offshore' 
            WHEN e.disbursement_type LIKE '%GoMESA%' OR e.disbursement_type LIKE '%GOMESA%' THEN 
                'GOMESA offshore'
 	        ELSE 
                COALESCE(e.land_category, '') 
            END = f.source
	    AND COALESCE(e.fund_class, '') = f.fund_class
	    AND COALESCE(e.recipient, '') = f.recipient
 	    AND COALESCE(e.disbursement_type, '') = f.disbursement_type
        AND CASE e.commodity
            WHEN NULL THEN
                'Not tied to a commodity'
            WHEN '' THEN
                'Not tied to a commodity'
            ELSE
                e.commodity
            END = c.commodity
	    AND COALESCE(e.commodity, '') = c.product
	    AND mineral_lease_type = ''
        AND p.period = 'Monthly'
        AND p.period_date = TO_DATE(CONCAT('01 ', e.month, ' ', e.calendar_year), 'DD Month YYYY')
	GROUP BY location_id,
        period_id,
        commodity_id,
        fund_id;
BEGIN
    FOR disbursement_rec IN monthly_disbursement LOOP
        INSERT INTO disbursement(
            location_id,
            period_id,
            commodity_id,
            fund_id,
            disbursement,
            unit,
            unit_abbr,
            duplicate_no
        )
        VALUES (
            disbursement_rec.location_id,
            disbursement_rec.period_id,
            disbursement_rec.commodity_id,
            disbursement_rec.fund_id,
            disbursement_rec.disbursement,
            disbursement_rec.unit,
            disbursement_rec.unit_abbr,
            disbursement_rec.duplicate_no
        )
        ON CONFLICT DO NOTHING;
    END LOOP;

END $$ LANGUAGE PLPGSQL;