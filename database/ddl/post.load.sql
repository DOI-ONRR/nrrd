update location set fips_code='POR', location_name='Pacific' where offshore_region like 'Pacific%' and fips_code is null;
update location set location_name='Alaska Offshore', fips_code='AKR', offshore_region='Alaska Offshore'  where offshore_region='Alaska';
update location set fips_code='GMR', location_name='Gulf of Mexico' where offshore_region like 'Gulf of Mexico' and fips_code is null;
update location set fips_code='AOR' , location_name='Atlantic' where offshore_region = 'Atlantic'  and fips_code is null;
;

