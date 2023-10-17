CREATE OR REPLACE FUNCTION transform_product()
    RETURNS TRIGGER
AS $$
BEGIN
    CASE 
        WHEN NEW.product LIKE '%Dioxide%' THEN
            NEW.product := REPLACE(NEW.product, 'Dioxide', 'dioxide');
        WHEN NEW.product = 'Sand/Gravel-Cubic Yards (cyd)' THEN
            NEW.product='Sand/Gravel (Cubic Yards)';
        WHEN NEW.product = 'Geothermal - Direct Utilization, Hundreds of Gallons' THEN
            NEW.product := 'Geothermal - Direct Use (Hundreds of Gallons)';
        WHEN NEW.product = 'Geothermal - Direct Use, Millions of Gallons' THEN
            NEW.product := 'Geothermal - Direct Use (Millions of Gallons)';
        WHEN NEW.product = 'Geothermal - Direct Utilization, Millions of BTUs' THEN
            NEW.product := 'Geothermal - Direct Use (Millions of BTUs)';
        WHEN NEW.product = 'Geothermal - Electrical Generation, Kilowatt Hours' THEN
            NEW.product := 'Geothermal - Electrical Generation (Kilowatt Hours)';
        WHEN NEW.product = 'Geothermal - Electrical Generation, Other' THEN
            NEW.product := 'Geothermal - Electrical Generation (Other)';
        WHEN NEW.product = 'Geothermal - Electrical Generation, Thousands of Pounds' THEN
            NEW.product := 'Geothermal - Electrical Generation (Thousands of Pounds)';
        WHEN NEW.product = 'Geothermal - sulfur' THEN
            NEW.product := 'Geothermal - Sulfur (tons)';
        ELSE
            NEW.product := NEW.product;
    END CASE;

    NEW.product := UPPER(SUBSTRING(NEW.product, 1, 1)) || LOWER(SUBSTRING(NEW.product, 2));
     
    RETURN NEW;
END $$ LANGUAGE PLPGSQL;