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
-- Name: query_tool_disbursement_monthly_data; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.query_tool_disbursement_monthly_data AS
 SELECT period.period,
        CASE
            WHEN ((location.state_name)::text <> ''::text) THEN (location.state_name)::text
            ELSE NULL::text
        END AS state_name,
        CASE
            WHEN ((location.region_type)::text = 'County'::text) THEN concat(location.state_name, ', ', location.county, ' ', location.district_type)
            WHEN ((location.region_type)::text = 'State'::text) THEN concat('Disbursements to ', location.state_name)
            ELSE NULL::text
        END AS local_recipient,
        CASE
            WHEN ((fund.recipient)::text = 'Land & Water Conservation Fund - GoMESA'::text) THEN 'Land and Water Conservation Fund'::character varying
            WHEN ((fund.recipient)::text = 'Land & Water Conservation Fund - GoMesa'::text) THEN 'Land and Water Conservation Fund'::character varying
            WHEN ((fund.recipient)::text = 'U.S. Treasury - GoMESA'::text) THEN 'U.S. Treasury'::character varying
            WHEN ((fund.recipient)::text = 'County'::text) THEN 'State and local governments'::character varying
            ELSE fund.recipient
        END AS recipient,
    fund.source,
    period.month_long,
    period.calendar_year,
    period.fiscal_year,
    sum(
        CASE
            WHEN (period.calendar_year = 2003) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2003,
    sum(
        CASE
            WHEN (period.calendar_year = 2004) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2004,
    sum(
        CASE
            WHEN (period.calendar_year = 2005) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2005,
    sum(
        CASE
            WHEN (period.calendar_year = 2006) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2006,
    sum(
        CASE
            WHEN (period.calendar_year = 2007) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2007,
    sum(
        CASE
            WHEN (period.calendar_year = 2008) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2008,
    sum(
        CASE
            WHEN (period.calendar_year = 2009) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2009,
    sum(
        CASE
            WHEN (period.calendar_year = 2010) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2010,
    sum(
        CASE
            WHEN (period.calendar_year = 2011) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2011,
    sum(
        CASE
            WHEN (period.calendar_year = 2012) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2012,
    sum(
        CASE
            WHEN (period.calendar_year = 2013) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2013,
    sum(
        CASE
            WHEN (period.calendar_year = 2014) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2014,
    sum(
        CASE
            WHEN (period.calendar_year = 2015) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2015,
    sum(
        CASE
            WHEN (period.calendar_year = 2016) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2016,
    sum(
        CASE
            WHEN (period.calendar_year = 2017) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2017,
    sum(
        CASE
            WHEN (period.calendar_year = 2018) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2018,
    sum(
        CASE
            WHEN (period.calendar_year = 2019) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2019,
    sum(
        CASE
            WHEN (period.calendar_year = 2020) THEN (disbursement.disbursement)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2020
   FROM (((public.disbursement
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.fund USING (fund_id))
  WHERE ((period.period)::text = 'Monthly'::text)
  GROUP BY period.period, location.state_name,
        CASE
            WHEN ((location.region_type)::text = 'County'::text) THEN concat(location.state_name, ', ', location.county, ' ', location.district_type)
            WHEN ((location.region_type)::text = 'State'::text) THEN concat('Disbursements to ', location.state_name)
            ELSE NULL::text
        END, fund.recipient, fund.source, period.month_long, period.calendar_year, period.fiscal_year;


ALTER TABLE public.query_tool_disbursement_monthly_data OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

