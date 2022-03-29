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
-- Name: query_tool_fed_revenue_by_company; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.query_tool_fed_revenue_by_company AS
 SELECT 'Calendar Year'::character varying(255) AS period,
    federal_revenue_by_company.commodity,
    federal_revenue_by_company.corporate_name,
    federal_revenue_by_company.revenue_type,
    federal_revenue_by_company.calendar_year,
    federal_revenue_by_company.commodity_order,
    (federal_revenue_by_company.revenue)::double precision AS revenue
   FROM public.federal_revenue_by_company;


ALTER TABLE public.query_tool_fed_revenue_by_company OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

