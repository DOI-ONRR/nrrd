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
-- Name: query_tool_production; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.query_tool_production AS
 SELECT _mview_location_qtp.g1,
    _mview_location_qtp.g2,
    _mview_location_qtp.g3,
    _mview_location_qtp.location_name,
    _mview_location_qtp.location_order,
    _mview_location_qtp.land_type,
    _mview_location_qtp.region_type,
    _mview_location_qtp.district_type,
    _mview_location_qtp.state_name,
    _mview_location_qtp.county,
    _mview_location_qtp.product,
    _mview_location_qtp.period,
    _mview_location_qtp.fiscal_year,
    _mview_location_qtp.calendar_year,
    _mview_location_qtp.month_long,
    _mview_location_qtp.production,
    _mview_location_qtp.county_name,
    _mview_location_qtp.state_offshore_name
   FROM public._mview_location_qtp
UNION
 SELECT _mview_commodity_qtp.g1,
    _mview_commodity_qtp.g2,
    _mview_commodity_qtp.g3,
    _mview_commodity_qtp.location_name,
    _mview_commodity_qtp.location_order,
    _mview_commodity_qtp.land_type,
    _mview_commodity_qtp.region_type,
    _mview_commodity_qtp.district_type,
    _mview_commodity_qtp.state_name,
    _mview_commodity_qtp.county,
    _mview_commodity_qtp.product,
    _mview_commodity_qtp.period,
    _mview_commodity_qtp.fiscal_year,
    _mview_commodity_qtp.calendar_year,
    _mview_commodity_qtp.month_long,
    _mview_commodity_qtp.production,
    _mview_commodity_qtp.county_name,
    _mview_commodity_qtp.state_offshore_name
   FROM public._mview_commodity_qtp
UNION
 SELECT _mview_location_commodity_qtp.g1,
    _mview_location_commodity_qtp.g2,
    _mview_location_commodity_qtp.g3,
    _mview_location_commodity_qtp.location_name,
    _mview_location_commodity_qtp.location_order,
    _mview_location_commodity_qtp.land_type,
    _mview_location_commodity_qtp.region_type,
    _mview_location_commodity_qtp.district_type,
    _mview_location_commodity_qtp.state_name,
    _mview_location_commodity_qtp.county,
    _mview_location_commodity_qtp.product,
    _mview_location_commodity_qtp.period,
    _mview_location_commodity_qtp.fiscal_year,
    _mview_location_commodity_qtp.calendar_year,
    _mview_location_commodity_qtp.month_long,
    _mview_location_commodity_qtp.production,
    _mview_location_commodity_qtp.county_name,
    _mview_location_commodity_qtp.state_offshore_name
   FROM public._mview_location_commodity_qtp;


ALTER TABLE public.query_tool_production OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

