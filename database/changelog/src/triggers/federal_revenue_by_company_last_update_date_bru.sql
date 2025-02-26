DROP TRIGGER IF EXISTS federal_revenue_by_company_last_update_date_bru ON federal_revenue_by_company;
 
CREATE TRIGGER federal_revenue_by_company_last_update_date_bru
    BEFORE UPDATE
    ON federal_revenue_by_company
    FOR EACH ROW
    EXECUTE FUNCTION set_last_update_date();