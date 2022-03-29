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
-- Name: total_revenue_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_revenue_summary AS
 SELECT _mview_cy_commodity.period_group,
    _mview_cy_commodity.breakout_group,
    _mview_cy_commodity.source,
    _mview_cy_commodity.revenue_type,
    _mview_cy_commodity.commodity,
    _mview_cy_commodity.sort_order,
    _mview_cy_commodity.period,
    _mview_cy_commodity.period_date,
    _mview_cy_commodity.month_long,
    _mview_cy_commodity.month,
    _mview_cy_commodity.fiscal_month,
    _mview_cy_commodity.fiscal_year,
    _mview_cy_commodity.calendar_year,
    _mview_cy_commodity.sum
   FROM public._mview_cy_commodity
UNION
 SELECT _mview_cy_revenue_type.period_group,
    _mview_cy_revenue_type.breakout_group,
    _mview_cy_revenue_type.source,
    _mview_cy_revenue_type.revenue_type,
    _mview_cy_revenue_type.commodity,
    _mview_cy_revenue_type.sort_order,
    _mview_cy_revenue_type.period,
    _mview_cy_revenue_type.period_date,
    _mview_cy_revenue_type.month_long,
    _mview_cy_revenue_type.month,
    _mview_cy_revenue_type.fiscal_month,
    _mview_cy_revenue_type.fiscal_year,
    _mview_cy_revenue_type.calendar_year,
    _mview_cy_revenue_type.sum
   FROM public._mview_cy_revenue_type
UNION
 SELECT _mview_cy_source.period_group,
    _mview_cy_source.breakout_group,
    _mview_cy_source.source,
    _mview_cy_source.revenue_type,
    _mview_cy_source.commodity,
    _mview_cy_source.sort_order,
    _mview_cy_source.period,
    _mview_cy_source.period_date,
    _mview_cy_source.month_long,
    _mview_cy_source.month,
    _mview_cy_source.fiscal_month,
    _mview_cy_source.fiscal_year,
    _mview_cy_source.calendar_year,
    _mview_cy_source.sum
   FROM public._mview_cy_source
UNION
 SELECT _mview_fy_commodity.period_group,
    _mview_fy_commodity.breakout_group,
    _mview_fy_commodity.source,
    _mview_fy_commodity.revenue_type,
    _mview_fy_commodity.commodity,
    _mview_fy_commodity.sort_order,
    _mview_fy_commodity.period,
    _mview_fy_commodity.period_date,
    _mview_fy_commodity.month_long,
    _mview_fy_commodity.month,
    _mview_fy_commodity.fiscal_month,
    _mview_fy_commodity.fiscal_year,
    _mview_fy_commodity.calendar_year,
    _mview_fy_commodity.sum
   FROM public._mview_fy_commodity
UNION
 SELECT _mview_fy_revenue_type.period_group,
    _mview_fy_revenue_type.breakout_group,
    _mview_fy_revenue_type.source,
    _mview_fy_revenue_type.revenue_type,
    _mview_fy_revenue_type.commodity,
    _mview_fy_revenue_type.sort_order,
    _mview_fy_revenue_type.period,
    _mview_fy_revenue_type.period_date,
    _mview_fy_revenue_type.month_long,
    _mview_fy_revenue_type.month,
    _mview_fy_revenue_type.fiscal_month,
    _mview_fy_revenue_type.fiscal_year,
    _mview_fy_revenue_type.calendar_year,
    _mview_fy_revenue_type.sum
   FROM public._mview_fy_revenue_type
UNION
 SELECT _mview_fy_source.period_group,
    _mview_fy_source.breakout_group,
    _mview_fy_source.source,
    _mview_fy_source.revenue_type,
    _mview_fy_source.commodity,
    _mview_fy_source.sort_order,
    _mview_fy_source.period,
    _mview_fy_source.period_date,
    _mview_fy_source.month_long,
    _mview_fy_source.month,
    _mview_fy_source.fiscal_month,
    _mview_fy_source.fiscal_year,
    _mview_fy_source.calendar_year,
    _mview_fy_source.sum
   FROM public._mview_fy_source;


ALTER TABLE public.total_revenue_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

