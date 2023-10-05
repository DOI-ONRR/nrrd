CREATE OR REPLACE FUNCTION transform_product_code_desc()
    RETURNS TRIGGER
AS $$
BEGIN
    CASE NEW.product_code_desc
        WHEN 'Geothermal - Direct Utilization, Hundreds of Gallons' THEN
            NEW.product_code_desc := 'Geothermal - Direct Use (Hundreds of Gallons)';
        WHEN 'Geothermal - Direct Utilization, Millions of BTUs' THEN
            NEW.product_code_desc := 'Geothermal - Direct Use (Millions of BTUs)';
        WHEN 'Geothermal - Direct Use, Millions of Gallons' THEN
            NEW.product_code_desc := 'Geothermal - Direct Use (Millions of Gallons)';
        WHEN 'Geothermal - Electrical Generation, Kilowatt Hours' THEN
            NEW.product_code_desc := 'Geothermal - Electrical Generation (Kilowatt Hours)';
        WHEN 'Geothermal - Electrical Generation, Other' THEN
            NEW.product_code_desc := 'Geothermal - Electrical Generation (Other)';
        WHEN 'Geothermal - Electrical Generation, Thousands of Pounds' THEN
            NEW.product_code_desc := 'Geothermal - Electrical Generation (Thousands of Pounds)';
        WHEN 'Geothermal - sulfur' THEN
            NEW.product_code_desc := 'Geothermal - Sulfur (tons)';
        ELSE
            RETURN NEW;
    END CASE;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;