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
-- Name: query_tool_revenue_try; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.query_tool_revenue_try AS
 SELECT _mview_fund_qtr.g1,
    _mview_fund_qtr.g2,
    _mview_fund_qtr.g3,
    _mview_fund_qtr.location_name,
    _mview_fund_qtr.location_order,
    _mview_fund_qtr.land_type,
    _mview_fund_qtr.region_type,
    _mview_fund_qtr.district_type,
    _mview_fund_qtr.state_name,
    _mview_fund_qtr.county,
    _mview_fund_qtr.county_name,
    _mview_fund_qtr.state_offshore_name,
    _mview_fund_qtr.commodity,
    _mview_fund_qtr.commodity_order,
    _mview_fund_qtr.revenue_type,
    _mview_fund_qtr.period,
    _mview_fund_qtr.fiscal_year,
    _mview_fund_qtr.calendar_year,
    _mview_fund_qtr.month_long,
    _mview_fund_qtr.revenue
   FROM public._mview_fund_qtr
UNION
 SELECT _mview_location_qtr.g1,
    _mview_location_qtr.g2,
    _mview_location_qtr.g3,
    _mview_location_qtr.location_name,
    _mview_location_qtr.location_order,
    _mview_location_qtr.land_type,
    _mview_location_qtr.region_type,
    _mview_location_qtr.district_type,
    _mview_location_qtr.state_name,
    _mview_location_qtr.county,
    _mview_location_qtr.county_name,
    _mview_location_qtr.state_offshore_name,
    _mview_location_qtr.commodity,
    _mview_location_qtr.commodity_order,
    _mview_location_qtr.revenue_type,
    _mview_location_qtr.period,
    _mview_location_qtr.fiscal_year,
    _mview_location_qtr.calendar_year,
    _mview_location_qtr.month_long,
    _mview_location_qtr.revenue
   FROM public._mview_location_qtr
UNION
 SELECT _mview_commodity_qtr.g1,
    _mview_commodity_qtr.g2,
    _mview_commodity_qtr.g3,
    _mview_commodity_qtr.location_name,
    _mview_commodity_qtr.location_order,
    _mview_commodity_qtr.land_type,
    _mview_commodity_qtr.region_type,
    _mview_commodity_qtr.district_type,
    _mview_commodity_qtr.state_name,
    _mview_commodity_qtr.county,
    _mview_commodity_qtr.county_name,
    _mview_commodity_qtr.state_offshore_name,
    _mview_commodity_qtr.commodity,
    _mview_commodity_qtr.commodity_order,
    _mview_commodity_qtr.revenue_type,
    _mview_commodity_qtr.period,
    _mview_commodity_qtr.fiscal_year,
    _mview_commodity_qtr.calendar_year,
    _mview_commodity_qtr.month_long,
    _mview_commodity_qtr.revenue
   FROM public._mview_commodity_qtr
UNION
 SELECT _mview_fund_location_qtr.g1,
    _mview_fund_location_qtr.g2,
    _mview_fund_location_qtr.g3,
    _mview_fund_location_qtr.location_name,
    _mview_fund_location_qtr.location_order,
    _mview_fund_location_qtr.land_type,
    _mview_fund_location_qtr.region_type,
    _mview_fund_location_qtr.district_type,
    _mview_fund_location_qtr.state_name,
    _mview_fund_location_qtr.county,
    _mview_fund_location_qtr.county_name,
    _mview_fund_location_qtr.state_offshore_name,
    _mview_fund_location_qtr.commodity,
    _mview_fund_location_qtr.commodity_order,
    _mview_fund_location_qtr.revenue_type,
    _mview_fund_location_qtr.period,
    _mview_fund_location_qtr.fiscal_year,
    _mview_fund_location_qtr.calendar_year,
    _mview_fund_location_qtr.month_long,
    _mview_fund_location_qtr.revenue
   FROM public._mview_fund_location_qtr
UNION
 SELECT _mview_fund_commodity_qtr.g1,
    _mview_fund_commodity_qtr.g2,
    _mview_fund_commodity_qtr.g3,
    _mview_fund_commodity_qtr.location_name,
    _mview_fund_commodity_qtr.location_order,
    _mview_fund_commodity_qtr.land_type,
    _mview_fund_commodity_qtr.region_type,
    _mview_fund_commodity_qtr.district_type,
    _mview_fund_commodity_qtr.state_name,
    _mview_fund_commodity_qtr.county,
    _mview_fund_commodity_qtr.county_name,
    _mview_fund_commodity_qtr.state_offshore_name,
    _mview_fund_commodity_qtr.commodity,
    _mview_fund_commodity_qtr.commodity_order,
    _mview_fund_commodity_qtr.revenue_type,
    _mview_fund_commodity_qtr.period,
    _mview_fund_commodity_qtr.fiscal_year,
    _mview_fund_commodity_qtr.calendar_year,
    _mview_fund_commodity_qtr.month_long,
    _mview_fund_commodity_qtr.revenue
   FROM public._mview_fund_commodity_qtr
UNION
 SELECT _mview_location_commodity_qtr.g1,
    _mview_location_commodity_qtr.g2,
    _mview_location_commodity_qtr.g3,
    _mview_location_commodity_qtr.location_name,
    _mview_location_commodity_qtr.location_order,
    _mview_location_commodity_qtr.land_type,
    _mview_location_commodity_qtr.region_type,
    _mview_location_commodity_qtr.district_type,
    _mview_location_commodity_qtr.state_name,
    _mview_location_commodity_qtr.county,
    _mview_location_commodity_qtr.county_name,
    _mview_location_commodity_qtr.state_offshore_name,
    _mview_location_commodity_qtr.commodity,
    _mview_location_commodity_qtr.commodity_order,
    _mview_location_commodity_qtr.revenue_type,
    _mview_location_commodity_qtr.period,
    _mview_location_commodity_qtr.fiscal_year,
    _mview_location_commodity_qtr.calendar_year,
    _mview_location_commodity_qtr.month_long,
    _mview_location_commodity_qtr.revenue
   FROM public._mview_location_commodity_qtr
UNION
 SELECT _mview_fund_location_commodity_qtr.g1,
    _mview_fund_location_commodity_qtr.g2,
    _mview_fund_location_commodity_qtr.g3,
    _mview_fund_location_commodity_qtr.location_name,
    _mview_fund_location_commodity_qtr.location_order,
    _mview_fund_location_commodity_qtr.land_type,
    _mview_fund_location_commodity_qtr.region_type,
    _mview_fund_location_commodity_qtr.district_type,
    _mview_fund_location_commodity_qtr.state_name,
    _mview_fund_location_commodity_qtr.county,
    _mview_fund_location_commodity_qtr.county_name,
    _mview_fund_location_commodity_qtr.state_offshore_name,
    _mview_fund_location_commodity_qtr.commodity,
    _mview_fund_location_commodity_qtr.commodity_order,
    _mview_fund_location_commodity_qtr.revenue_type,
    _mview_fund_location_commodity_qtr.period,
    _mview_fund_location_commodity_qtr.fiscal_year,
    _mview_fund_location_commodity_qtr.calendar_year,
    _mview_fund_location_commodity_qtr.month_long,
    _mview_fund_location_commodity_qtr.revenue
   FROM public._mview_fund_location_commodity_qtr;


ALTER TABLE public.query_tool_revenue_try OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

