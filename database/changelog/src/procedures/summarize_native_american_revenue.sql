CREATE OR REPLACE PROCEDURE summarize_native_american_revenue()
AS $$
BEGIN
    INSERT INTO monthly_revenue_elt
    SELECT accept_date, 
        'Native American' land_class_code,
        land_category_code_desc,
        'Native American' state,
        '' county_code_desc,
        'NA' fips_code,
        '' agency_state_region_code_desc,
        revenue_type,
        mineral_production_code_desc,
        commodity,
        product_code_desc,
        SUM(revenue) revenue
    FROM monthly_revenue_elt 
    WHERE land_class_code LIKE '%Indian%' 
    GROUP BY accept_date, 
        land_category_code_desc, 
        revenue_type,
        mineral_production_code_desc, 
        commodity, 
        product_code_desc
    ON CONFLICT DO NOTHING;

    DELETE FROM monthly_revenue_elt 
    WHERE land_class_code LIKE '%Indian%';
END $$ LANGUAGE PLPGSQL;