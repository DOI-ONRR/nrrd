--
-- PostgreSQL database dump
--

-- Dumped from database version 12.6 (Debian 12.6-1.pgdg100+1)
-- Dumped by pg_dump version 12.6 (Debian 12.6-1.pgdg100+1)

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
-- Name: total_revenue_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_revenue_summary AS
 SELECT fy_source_mview.period_group,
    fy_source_mview.breakout_group,
    fy_source_mview.source,
    fy_source_mview.revenue_type,
    fy_source_mview.commodity,
    fy_source_mview.sort_order,
    fy_source_mview.period,
    fy_source_mview.period_date,
    fy_source_mview.month_long,
    fy_source_mview.month,
    fy_source_mview.fiscal_month,
    fy_source_mview.fiscal_year,
    fy_source_mview.calendar_year,
    fy_source_mview.sum
   FROM public.fy_source_mview
UNION
 SELECT cy_source_mview.period_group,
    cy_source_mview.breakout_group,
    cy_source_mview.source,
    cy_source_mview.revenue_type,
    cy_source_mview.commodity,
    cy_source_mview.sort_order,
    cy_source_mview.period,
    cy_source_mview.period_date,
    cy_source_mview.month_long,
    cy_source_mview.month,
    cy_source_mview.fiscal_month,
    cy_source_mview.fiscal_year,
    cy_source_mview.calendar_year,
    cy_source_mview.sum
   FROM public.cy_source_mview;


ALTER TABLE public.total_revenue_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

