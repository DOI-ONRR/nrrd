update location set fips_code='POR', location_name='Pacific', location_order='1-POR' where offshore_region like 'Pacific%' and fips_code is null;
update location set location_name='Alaska Offshore', fips_code='AKR', offshore_region='Alaska Offshore'  where offshore_region='Alaska';
update location set fips_code='GMR', location_name='Gulf of Mexico', location_order='1-GMR'  where offshore_region like 'Gulf of Mexico' and fips_code is null;
update location set fips_code='AOR' , location_name='Atlantic' where offshore_region = 'Atlantic'  and fips_code is null;
update location  set location_name ='location not published.' where land_class='Native American';

update location set location_order=concat(state,'1',) where offshore_region ='' and region_type='State'

update location set location_order=concat(substr(state,1,2),'2',substr(county,1,2)) where offshore_region ='' and region_type='County' ;

update location set location_order=concat('1-', fips_code) where offshore_region !='' and location_order is null 

;


update location set fips_code='POR', location_name='Pacific', location_order='1-POR' where offshore_region like 'Pacific%';
update location set location_name='Alaska', fips_code='AKR', offshore_region='Alaska'  where offshore_region like '%Alaska%';
update location set fips_code='GMR', location_name='Gulf of Mexico', location_order='1-GMR' , offshore_region = 'Gulf of Mexico'   where offshore_region like '%Gulf%';
update location set fips_code='AOR' , location_name='Atlantic', offshore_region = 'Atlantic'   where offshore_region like '%Atlantic%'  ;


 select distinct
 offshore_region,
 fips_code,
 CASE
    WHEN ((location.region_type) :: text = 'County' :: text) THEN location.state_name
    WHEN ((location.region_type) :: text = 'Offshore' :: text) THEN (concat('Offshore ', location.location_name)) :: character varying
    ELSE location.location_name
  END AS state_offshore_name,
 region_type, state_name, location_name from location join production  using (location_id) where region_type != 'County'
 
