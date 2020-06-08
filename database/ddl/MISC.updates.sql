;; This buffer is for text that is not saved, and for Lisp evaluation.
;; To create a file, visit it with C-x C-f and enter text in its buffer.

POR Pacific off shore region
GMR
AKR
AOR

update location set fips_code ='AKR' where offshore_planning_area_code != '' and fips_code = offshore_planning_area_code and location_name like '%Alaska%';



update location set fips_code ='GMR' where offshore_planning_area_code != '' and fips_code = offshore_planning_area_code and location_name like '%Mexico%';

update location set fips_code ='AOR' where offshore_planning_area_code != '' and fips_code = offshore_planning_area_code and location_name like '%Atlantic%';

update location set fips_code ='POR' where offshore_planning_area_code != '' and fips_code = offshore_planning_area_code and location_name like '%Pacific%';

update location set fips_code='22089' where state='LA' and county='St. Charles';
update location set fips_code='22093' where state='LA' and county='St. James';
update location set fips_code='22087' where state='LA' and county='St. Bernard';
update location set fips_code='22105' where state='LA' and county='Tangipahoa';
update location set fips_code='22103' where state='LA' and county='St. Tammany';
update location set fips_code='22045' where state='LA' and county='Iberia';
update location set fips_code='22095' where state='LA' and county='St. John the Baptist';

update location set fips_code='35023', county='Hidalgo' where state='NM' and county='Hidalgo Caounty';


update location set fips_code='48007' where state='TX' and county='Aransas';
update location set fips_code='48057' where state='TX' and county='Calhoun';
update location set fips_code='48061' where state='TX' and county='Cameron';
update location set fips_code='48321' where state='TX' and county='Matagorda';
update location set fips_code='48391' where state='TX' and county='Refugio';
update location set fips_code='48409' where state='TX' and county='San Patricio';
update location set fips_code='48469' where state='TX' and county='Victoria';
update location set fips_code='48261' where state='TX' and county='Kenedy';


