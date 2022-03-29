--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-0ubuntu0.21.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: query_tool_revenue_by_company; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.query_tool_revenue_by_company AS
 SELECT 'Calendar Year'::character varying(255) AS period,
    federal_revenue_by_company.commodity,
    federal_revenue_by_company.corporate_name,
    federal_revenue_by_company.revenue_type,
    federal_revenue_by_company.calendar_year,
    federal_revenue_by_company.commodity_order,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2003) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2003,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2004) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2004,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2005) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2005,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2006) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2006,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2007) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2007,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2008) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2008,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2009) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2009,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2010) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2010,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2011) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2011,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2012) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2012,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2013) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2013,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2014) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2014,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2015) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2015,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2016) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2016,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2017) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2017,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2018) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2018,
    sum(
        CASE
            WHEN (federal_revenue_by_company.calendar_year = 2019) THEN (federal_revenue_by_company.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2019
   FROM public.federal_revenue_by_company
  GROUP BY ('Calendar Year'::character varying(255)), federal_revenue_by_company.commodity, federal_revenue_by_company.corporate_name, federal_revenue_by_company.revenue_type, federal_revenue_by_company.calendar_year, federal_revenue_by_company.commodity_order;


ALTER TABLE public.query_tool_revenue_by_company OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

