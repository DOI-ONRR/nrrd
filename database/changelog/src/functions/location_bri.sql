CREATE OR REPLACE FUNCTION location_bri() RETURNS TRIGGER AS $$
BEGIN
    CASE NEW.state
        WHEN 'AL' THEN NEW.state_name := 'Alabama';
        WHEN 'AK' THEN NEW.state_name := 'Alaska';
        WHEN 'AS' THEN NEW.state_name := 'American Samoa'; 
        WHEN 'AZ' THEN NEW.state_name := 'Arizona'; 
        WHEN 'AR' THEN NEW.state_name := 'Arkansas'; 
        WHEN 'CA' THEN NEW.state_name := 'California'; 
        WHEN 'CO' THEN NEW.state_name := 'Colorado'; 
        WHEN 'CT' THEN NEW.state_name := 'Connecticut'; 
        WHEN 'DE' THEN NEW.state_name := 'Delaware';  
        WHEN 'DC' THEN NEW.state_name := 'District Of Columbia'; 
        WHEN 'FM' THEN NEW.state_name := 'Federated States Of Micronesia'; 
        WHEN 'FL' THEN NEW.state_name := 'Florida'; 
        WHEN 'GA' THEN NEW.state_name := 'Georgia'; 
        WHEN 'GU' THEN NEW.state_name := 'Guam'; 
        WHEN 'HI' THEN NEW.state_name := 'Hawaii'; 
        WHEN 'ID' THEN NEW.state_name := 'Idaho'; 
        WHEN 'IL' THEN NEW.state_name := 'Illinois'; 
        WHEN 'IN' THEN NEW.state_name := 'Indiana'; 
        WHEN 'IA' THEN NEW.state_name := 'Iowa'; 
        WHEN 'KS' THEN NEW.state_name := 'Kansas'; 
        WHEN 'KY' THEN NEW.state_name := 'Kentucky'; 
        WHEN 'LA' THEN NEW.state_name := 'Louisiana'; 
        WHEN 'ME' THEN NEW.state_name := 'Maine'; 
        WHEN 'MH' THEN NEW.state_name := 'Marshall Islands';
        WHEN 'MD' THEN NEW.state_name := 'Maryland';
        WHEN 'MA' THEN NEW.state_name := 'Massachusetts';
        WHEN 'MI' THEN NEW.state_name := 'Michigan';
        WHEN 'MN' THEN NEW.state_name := 'Minnesota';
        WHEN 'MS' THEN NEW.state_name := 'Mississippi';
        WHEN 'MO' THEN NEW.state_name := 'Missouri';
        WHEN 'MT' THEN NEW.state_name := 'Montana';
        WHEN 'NE' THEN NEW.state_name := 'Nebraska';
        WHEN 'NV' THEN NEW.state_name := 'Nevada';
        WHEN 'NH' THEN NEW.state_name := 'New Hampshire';
        WHEN 'NJ' THEN NEW.state_name := 'New Jersey';
        WHEN 'NM' THEN NEW.state_name := 'New Mexico';
        WHEN 'NY' THEN NEW.state_name := 'New York';
        WHEN 'NC' THEN NEW.state_name := 'North Carolina';
        WHEN 'ND' THEN NEW.state_name := 'North Dakota';
        WHEN 'MP' THEN NEW.state_name := 'Northern Mariana Islands';
        WHEN 'OH' THEN NEW.state_name := 'Ohio';
        WHEN 'OK' THEN NEW.state_name := 'Oklahoma';
        WHEN 'OR' THEN NEW.state_name := 'Oregon';
        WHEN 'PW' THEN NEW.state_name := 'Palau';
        WHEN 'PA' THEN NEW.state_name := 'Pennsylvania';
        WHEN 'PR' THEN NEW.state_name := 'Puerto Rico';
        WHEN 'RI' THEN NEW.state_name := 'Rhode Island';
        WHEN 'SC' THEN NEW.state_name := 'South Carolina';
        WHEN 'SD' THEN NEW.state_name := 'South Dakota';
        WHEN 'TN' THEN NEW.state_name := 'Tennessee';
        WHEN 'TX' THEN NEW.state_name := 'Texas';
        WHEN 'UT' THEN NEW.state_name := 'Utah';
        WHEN 'VT' THEN NEW.state_name := 'Vermont';
        WHEN 'VI' THEN NEW.state_name := 'Virgin Islands';
        WHEN 'VA' THEN NEW.state_name := 'Virginia';
        WHEN 'WA' THEN NEW.state_name := 'Washington';
        WHEN 'WV' THEN NEW.state_name := 'West Virginia';
        WHEN 'WI' THEN NEW.state_name := 'Wisconsin';
        WHEN 'WY' THEN NEW.state_name := 'Wyoming';
        ELSE NEW.state_name := NEW.state;
    END CASE;

    IF LENGTH(NEW.state) = 2 AND NEW.county = '' THEN
        NEW.fips_code := NEW.state;
    END IF;

    IF LENGTH(NEW.fips_code) = 5 THEN
        NEW.location_name := CONCAT(NEW.state_name, ', ', NEW.county); 
        NEW.region_type := 'County';
        NEW.district_type := 'County';
    END IF;

    IF LENGTH(NEW.state) = 2 AND NEW.region_type != 'County' THEN
        NEW.location_name := NEW.state_name;
        NEW.region_type := 'State';
        NEW.district_type := 'State';
    END IF;

    IF NEW.land_class = 'Federal' AND NEW.land_category = 'Not Tied to a Lease' THEN
        NEW.land_type := 'Federal - not tied to a lease';
        NEW.location_name := 'Not tied to a lease';
    END IF;

    IF NEW.land_class = 'Native American' THEN
        NEW.land_type := 'Native American';
        NEW.location_name := 'Location not published';
        NEW.location_order := 'zzz';
    END IF;

    IF NEW.land_class = 'Federal' AND NEW.land_category = 'Onshore' THEN
        NEW.land_type := 'Federal onshore';
    END IF;

    IF NEW.land_class = 'Federal' AND NEW.land_category = 'Offshore' THEN
        NEW.land_type := 'Federal offshore';
    END IF;

    IF NEW.land_class = 'Mixed Exploratory' AND NEW.land_category = 'Onshore' THEN
        NEW.land_type := 'Federal onshore';
    END IF;

    IF NEW.land_class = 'Mixed Exploratory' AND NEW.land_category='Offshore' THEN
        NEW.land_type := 'Federal offshore';
    END IF;

    IF NEW.location_name = '' AND NEW.land_category = 'Onshore' THEN
        NEW.location_name := 'Not tied to a location';
        NEW.location_order := 'zZz';
    END IF;

    IF NEW.location_name = '' AND NEW.land_category = 'Offshore' THEN
        NEW.location_name := 'Not tied to a region';
        NEW.location_order := 'zZZ';
    END IF;

    IF NEW.location_name = '' AND NEW.land_category = 'Onshore & Offshore' THEN
        NEW.location_name := 'Onshore & offshore';
        NEW.location_order := 'ZZZ';
    END IF;

    IF NEW.location_name = 'Not tied to a lease' THEN
        NEW.location_order := 'zzZ';
    END IF;

    IF NEW.offshore_region = '' and NEW.region_type = 'State' THEN
        NEW.location_order := CONCAT(NEW.state, '1');
    END IF;

    IF NEW.region_type = 'County' THEN
        NEW.location_order := CONCAT(SUBSTR(NEW.state, 1, 2), '2', SUBSTR(NEW.county, 1, 2));
    END IF;

    IF NEW.offshore_region != '' AND NEW.location_order IS NULL THEN
        NEW.location_order := CONCAT('1-', NEW.fips_code);
    END IF;

    IF LOWER(NEW.offshore_region) LIKE '%pacific%' AND NEW.state = '' AND NEW.county = '' THEN
        NEW.fips_code := 'POR';
        NEW.location_name := 'Pacific';
        NEW.location_order := '1-POR';
        NEW.region_type := 'Offshore';
    END IF;
    
    IF LOWER(NEW.offshore_region) LIKE '%alaska%' AND NEW.state = '' AND NEW.county = '' THEN
        NEW.location_name := 'Alaska';
        NEW.fips_code := 'AKR';
        NEW.offshore_region := 'Alaska';
        NEW.location_order := '1-AKR';
        NEW.region_type := 'Offshore';
    END IF;

    IF LOWER(NEW.offshore_region) LIKE '%gulf%' AND NEW.state='' AND NEW.county = '' THEN
        NEW.fips_code := 'GMR';
        NEW.location_name := 'Gulf of America';
        NEW.location_order := '1-GMR';
        NEW.offshore_region := 'Gulf';
        NEW.region_type := 'Offshore';
    END IF;

    IF LOWER(NEW.offshore_region) LIKE '%atlantic%' AND NEW.state = '' AND NEW.county = '' THEN
        NEW.fips_code := 'AOR';
        NEW.location_name := 'Atlantic';
        NEW.offshore_region := 'Atlantic';
        NEW.location_order := '1-AOR';
        NEW.region_type := 'Offshore';
    END IF;

    RETURN NEW;
END $$ LANGUAGE PLPGSQL;