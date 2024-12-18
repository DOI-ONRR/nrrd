DROP TRIGGER IF EXISTS monthly_revenue_elt_transform_offshore_bri ON monthly_revenue_elt;
 
CREATE TRIGGER monthly_revenue_elt_transform_offshore_bri
    BEFORE INSERT
    ON monthly_revenue_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_offshore_region();