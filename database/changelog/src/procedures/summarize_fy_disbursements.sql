CREATE OR REPLACE PROCEDURE summarize_fy_disbursements(p_fiscal_year period.fiscal_year%TYPE)
AS $$
BEGIN
    DELETE FROM disbursement d
    WHERE EXISTS (
        SELECT 1
        FROM period p
        WHERE p.period_id = d.period_id
            AND period = 'Fiscal Year'
            AND fiscal_year = p_fiscal_year
            AND EXISTS (
                SELECT 1
                FROM period
                WHERE fiscal_year = p.fiscal_year
                  AND period = 'Monthly'
                  AND fiscal_month = 12
            )
    );

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
    SELECT d.location_id,
        fyp.period_id,
        d.commodity_id,
        d.fund_id, 
        sum(d.disbursement) disbursement, 
        'dollars', 
        '$', 
        1
    FROM disbursement d,
        period p,
        period fyp
    WHERE p.period_id = d.period_id
        AND p.period = 'Monthly'
        AND p.fiscal_year = p_fiscal_year
        AND EXISTS (
            SELECT 1
            FROM period
            WHERE fiscal_year = p.fiscal_year
                AND period = 'Monthly'
                AND fiscal_month = 12
        )
        AND fyp.period = 'Fiscal Year'
        AND fyp.fiscal_year = p.fiscal_year
    GROUP BY fyp.period_id,
        d.location_id, 
        d.commodity_id, 
        d.fund_id
    ON CONFLICT DO NOTHING;

END $$ LANGUAGE PLPGSQL;