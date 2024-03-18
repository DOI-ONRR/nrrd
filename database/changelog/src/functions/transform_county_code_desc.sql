CREATE OR REPLACE FUNCTION transform_county_code_desc()
    RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.county_code_desc = 'Santa Barbar' THEN
        NEW.county_code_desc := 'Santa Barbara';
    END IF;

    IF NEW.county_code_desc = 'Pt. Coupee'
        OR NEW.county_code_desc = 'Point Coupee' THEN
        NEW.county_code_desc := 'Pointe Coupee';
    END IF;

    IF (NEW.county_code_desc = 'Golden Valle' 
        AND NEW.fips_code = '38033') OR 
        (NEW.county_code_desc = 'Golden Vally' 
        AND NEW.fips_code = '30037') THEN
        NEW.county_code_desc := 'Golden Valley';
    END IF;

    IF NEW.county_code_desc = 'E Baton Rouge' THEN
        NEW.county_code_desc := 'East Baton Rouge';
    END IF;

    IF NEW.county_code_desc = 'Grand Trvse' THEN
        NEW.county_code_desc := 'Grand Traverse';
    END IF;

    IF NEW.county_code_desc = 'Jeffer Davis' THEN
        NEW.county_code_desc := 'Jefferson Davis';
    END IF;

    IF NEW.county_code_desc = 'San Augustin' THEN
        NEW.county_code_desc := 'San Augustine';
    END IF;

    IF NEW.county_code_desc = 'San Pete' THEN
        NEW.county_code_desc := 'Sanpete';
    END IF;

    IF NEW.county_code_desc = 'St Charles' THEN
        NEW.county_code_desc := 'St. Charles';
    END IF;

    IF NEW.county_code_desc = 'St Clair' THEN
        NEW.county_code_desc := 'St. Clair';
    END IF;

    IF NEW.county_code_desc = 'St Martin' THEN
        NEW.county_code_desc := 'St. Martin';
    END IF;

    IF NEW.county_code_desc = 'St Mary' THEN
        NEW.county_code_desc := 'St. Mary';
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;