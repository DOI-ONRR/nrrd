update location set fips_code='POR', location_name='Pacific', location_order='1-POR' where offshore_region like 'Pacific%' and fips_code is null;
update location set location_name='Alaska Offshore', fips_code='AKR', offshore_region='Alaska Offshore'  where offshore_region='Alaska';
update location set fips_code='GMR', location_name='Gulf of Mexico', location_order='1-GMR'  where offshore_region like 'Gulf of Mexico' and fips_code is null;
update location set fips_code='AOR' , location_name='Atlantic' where offshore_region = 'Atlantic'  and fips_code is null;
update location  set location_name ='location not published.' where land_class='Native American';

update location set location_order=concat(state,'1',) where offshore_region ='' and region_type='State'

update location set location_order=concat(substr(state,1,2),'2',substr(county,1,2)) where offshore_region ='' and region_type='County' ;

update location set location_order=concat('1-', fips_code) where offshore_region !='' and location_order is null 

;

