DROP TRIGGER IF EXISTS fiscal_year_production_elt_transform_product_bri ON fiscal_year_production_elt;
 
CREATE TRIGGER fiscal_year_production_elt_transform_product_bri
    BEFORE INSERT
    ON fiscal_year_production_elt
    FOR EACH ROW
    EXECUTE FUNCTION transform_product();