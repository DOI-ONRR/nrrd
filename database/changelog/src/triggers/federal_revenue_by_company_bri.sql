DROP TRIGGER IF EXISTS federal_revenue_by_company_bri ON federal_revenue_by_company;

CREATE TRIGGER federal_revenue_by_company_bri
    BEFORE INSERT
    ON federal_revenue_by_company
    FOR EACH ROW
    EXECUTE FUNCTION revenue_by_company_bri();