CREATE OR REPLACE FUNCTION sanitize_nulls_revenue()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
AS
$$
BEGIN
    NEW.land_class_code := COALESCE(NEW.land_class_code,'');
    NEW.land_category_code_desc := COALESCE(NEW.land_category_code_desc,'');
    NEW.state := COALESCE(NEW.state,'');
    NEW.county_code_desc := COALESCE(NEW.county_code_desc,'');
    NEW.fips_code := COALESCE(NEW.fips_code,'');
    NEW.agency_state_region_code_desc := COALESCE(NEW.agency_state_region_code_desc,'');
    NEW.revenue_type := COALESCE(NEW.revenue_type,'');
    NEW.mineral_production_code_desc := COALESCE(NEW.mineral_production_code_desc,'');
    NEW.product_code_desc := COALESCE(NEW.product_code_desc, '');

    IF NEW.commodity = '' OR NEW.commodity IS NULL THEN
      NEW.commodity := 'Not tied to a commodity';
    END IF;

    RETURN NEW;
END
$$;