drop table federal_revenue_by_company cascade;
create table federal_revenue_by_company (
calendar_year int not null,
corporate_name varchar(255) not null,
revenue_agency_type varchar(255) not null,
revenue_agency varchar(255),
revenue_type varchar(255),
commodity varchar(255) not null,
commodity_order varchar(5),
raw_revenue varchar(255) not null,
revenue numeric,
primary key (calendar_year, corporate_name, revenue_agency_type, commodity)
);


\copy federal_revenue_by_company (calendar_year,corporate_name,revenue_agency_type,commodity,raw_revenue) FROM 'static/downloads/federal_revenue_by_company_CY2013-CY2019.csv' DELIMITER ',' CSV HEADER;


update federal_revenue_by_company set revenue=to_number(raw_revenue, 'L999G999G999G999D99') ;
update federal_revenue_by_company set revenue_agency=split_part(revenue_agency_type, ' - ', 1);
update federal_revenue_by_company set revenue_type=split_part(revenue_agency_type, ' - ', 2);
update federal_revenue_by_company set commodity_order=substr(commodity,1,5);
update federal_revenue_by_company set commodity_order='1' where commodity = 'Oil';
update federal_revenue_by_company set commodity_order='2' where commodity = 'Gas';
update federal_revenue_by_company set commodity_order='3' where commodity = 'Oil & Gas';
update federal_revenue_by_company set commodity_order='4' where commodity = 'NGL';
update federal_revenue_by_company set commodity_order='5' where commodity = 'Coal';



CREATE
OR REPLACE VIEW "public"."query_tool_revenue_by_company" AS
SELECT
  'Calendar Year' :: character varying(255) AS period,
  federal_revenue_by_company.commodity,
  federal_revenue_by_company.corporate_name,
  federal_revenue_by_company.revenue_type,
  federal_revenue_by_company.calendar_year,
  federal_revenue_by_company.commodity_order,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2003) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2003,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2004) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2004,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2005) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2005,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2006) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2006,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2007) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2007,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2008) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2008,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2009) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2009,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2010) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2010,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2011) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2011,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2012) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2012,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2013) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2013,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2014) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2014,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2015) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2015,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2016) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2016,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2017) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2017,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2018) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2018,
  sum(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2019) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2019
FROM
  federal_revenue_by_company
GROUP BY
  ('Calendar Year' :: character varying(255)),
  federal_revenue_by_company.commodity,
  federal_revenue_by_company.corporate_name,
  federal_revenue_by_company.revenue_type,
  federal_revenue_by_company.calendar_year,
  federal_revenue_by_company.commodity_order
  
