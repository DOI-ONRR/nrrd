create table federal_revenue_by_company (
calendar_year int not null,
corporate_name varchar(255) not null,
revenue_type varchar(255) not null,
commodity varchar(255) not null,
raw_revenue varchar(255) not null,
revenue numeric,
primary key (calendar_year, corporate_name, revenue_type, commodity)
)


\copy federal_revenue_by_company (calendar_year,corporate_name,
revenue_type,
commodity,
raw_revenue)
FROM 'static/downloads/federal_revenue_by_company_CY2013-CY2019.csv'
DELIMITER ','
CSV HEADER;


update federal_revenue_by_company set revenue=to_number(raw_revenue, 'L999G999G999G999D99') ;
