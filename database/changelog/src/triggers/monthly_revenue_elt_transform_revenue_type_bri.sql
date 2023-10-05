DROP TRIGGER IF EXISTS monthly_revenue_elt_transform_revenue_type_bri ON monthly_revenue_elt;
 
CREATE TRIGGER monthly_revenue_elt_transform_revenue_type_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_revenue_type();