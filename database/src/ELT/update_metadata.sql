\echo 'update location metadata'

\echo 'update state name'
update location set state_name='Alabama' where state='AL';
update location set state_name='Alaska' where state='AK';
update location set state_name='American Samoa' where state='AS';
update location set state_name='Arizona' where state='AZ';
update location set state_name='Arkansas' where state='AR';
update location set state_name='California' where state='CA';
update location set state_name='Colorado' where state='CO';
update location set state_name='Connecticut' where state='CT';
update location set state_name='Delaware' where state='DE';
update location set state_name='District Of Columbia' where state='DC';
update location set state_name='Federated States Of Micronesia' where state='FM';
update location set state_name='Florida' where state='FL';
update location set state_name='Georgia' where state='GA';
update location set state_name='Guam' where state='GU';
update location set state_name='Hawaii' where state='HI';
update location set state_name='Idaho' where state='ID';
update location set state_name='Illinois' where state='IL';
update location set state_name='Indiana' where state='IN';
update location set state_name='Iowa' where state='IA';
update location set state_name='Kansas' where state='KS';
update location set state_name='Kentucky' where state='KY';
update location set state_name='Louisiana' where state='LA';
update location set state_name='Maine' where state='ME';
update location set state_name='Marshall Islands' where state='MH';
update location set state_name='Maryland' where state='MD';
update location set state_name='Massachusetts' where state='MA';
update location set state_name='Michigan' where state='MI';
update location set state_name='Minnesota' where state='MN';
update location set state_name='Mississippi' where state='MS';
update location set state_name='Missouri' where state='MO';
update location set state_name='Montana' where state='MT';
update location set state_name='Nebraska' where state='NE';
update location set state_name='Nevada' where state='NV';
update location set state_name='New Hampshire' where state='NH';
update location set state_name='New Jersey' where state='NJ';
update location set state_name='New Mexico' where state='NM';
update location set state_name='New York' where state='NY';
update location set state_name='North Carolina' where state='NC';
update location set state_name='North Dakota' where state='ND';
update location set state_name='Northern Mariana Islands' where state='MP';
update location set state_name='Ohio' where state='OH';
update location set state_name='Oklahoma' where state='OK';
update location set state_name='Oregon' where state='OR';
update location set state_name='Palau' where state='PW';
update location set state_name='Pennsylvania' where state='PA';
update location set state_name='Puerto Rico' where state='PR';
update location set state_name='Rhode Island' where state='RI';
update location set state_name='South Carolina' where state='SC';
update location set state_name='South Dakota' where state='SD';
update location set state_name='Tennessee' where state='TN';
update location set state_name='Texas' where state='TX';
update location set state_name='Utah' where state='UT';
update location set state_name='Vermont' where state='VT';
update location set state_name='Virgin Islands' where state='VI';
update location set state_name='Virginia' where state='VA';
update location set state_name='Washington' where state='WA';
update location set state_name='West Virginia' where state='WV';
update location set state_name='Wisconsin' where state='WI';
update location set state_name='Wyoming' where state='WY';
update location set fips_code=state where length(state)=2 and county='';

\echo 'update location name'

update location set location_name=concat(state_name, ', ', county), region_type='County', district_type='County' where length(fips_code)=5;
update location set location_name=state_name, region_type='State', district_type='State' where length(state)=2 and region_type not in('County');

\echo 'update land type'

update location set land_type='Federal - not tied to a lease', location_name='Not tied to a lease' where land_class='Federal' and land_category='Not Tied to a Lease';
update location set land_type='Native American', location_name='Location not published' where land_class='Native American';
update location set land_type='Federal onshore' where land_class='Federal' and land_category='Onshore';
update location set land_type='Federal offshore' where land_class='Federal' and land_category='Offshore';
update location set land_type='Federal onshore'  where land_class='Mixed Exploratory' and land_category='Onshore';
update location set land_type='Federal offshore'  where land_class='Mixed Exploratory' and land_category='Offshore';

\echo 'update location order'
update location set location_order=concat(state,'1') where offshore_region ='' and region_type='State';

update location set location_order=concat(substr(state,1,2),'2',substr(county,1,2)) where  region_type='County' ;

update location set location_order=concat('1-', fips_code) where offshore_region !='' and location_order is null ;

;

\echo 'update offshore'

update location set fips_code='POR', location_name='Pacific', location_order='1-POR', region_type='Offshore' where lower(offshore_region) like '%pacific%'  and state='' and county='';
update location set location_name='Alaska', fips_code='AKR', offshore_region='Alaska', location_order='1-AKR', region_type='Offshore' where lower(offshore_region) like '%alaska%' and state='' and county='';
update location set fips_code='GMR', location_name='Gulf of Mexico', location_order='1-GMR' , offshore_region = 'Gulf of Mexico', region_type='Offshore'   where lower(offshore_region) like '%gulf%' and state='' and county='' ;
update location set fips_code='AOR' , location_name='Atlantic', offshore_region = 'Atlantic', location_order='1-GMR', region_type='Offshore'   where lower(offshore_region) like '%atlantic%'  and state='' and county='';

\echo 'update commodity order'

update commodity set commodity_order=1.1  where commodity like '%Oil %';
update commodity set commodity_order='ZZZ'  where commodity ='Not tied to a commodity';

