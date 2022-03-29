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
-- Name: download_federal_revenue_by_company; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.download_federal_revenue_by_company AS
 SELECT to_date(concat(federal_revenue_by_company.calendar_year, '0101'), 'YYYYMMDD'::text) AS "Date",
    federal_revenue_by_company.calendar_year AS "Calendar Year",
    federal_revenue_by_company.corporate_name AS "Corporate Name",
    federal_revenue_by_company.revenue_agency_type AS "Revenue Agency Type",
    federal_revenue_by_company.revenue_agency AS "Revenue Agency",
    federal_revenue_by_company.revenue_type AS "Revenue Type",
    federal_revenue_by_company.commodity AS "Commodity",
    federal_revenue_by_company.revenue AS "Revenue"
   FROM public.federal_revenue_by_company;


ALTER TABLE public.download_federal_revenue_by_company OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

