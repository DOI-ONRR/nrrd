CREATE OR REPLACE VIEW "public"."query_tool_revenue_by_company" AS
SELECT
  'Calendar Year' :: character varying(255) AS period,
  federal_revenue_by_company.commodity,
  federal_revenue_by_company.corporate_name,
  federal_revenue_by_company.revenue_type,
  federal_revenue_by_company.calendar_year,
  federal_revenue_by_company.commodity_order,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2003) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2003,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2004) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2004,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2005) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2005,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2006) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2006,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2007) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2007,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2008) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2008,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2009) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2009,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2010) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2010,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2011) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2011,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2012) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2012,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2013) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2013,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2014) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2014,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2015) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2015,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2016) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2016,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2017) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2017,
  SUM(
    CASE
      WHEN (federal_revenue_by_company.calendar_year = 2018) THEN (federal_revenue_by_company.revenue) :: double precision
      ELSE ((0) :: real) :: double precision
    END
  ) AS y2018,
  SUM(
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
  federal_revenue_by_company.commodity_order;