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
-- Name: query_tool_disbursement; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.query_tool_disbursement AS
 SELECT period.period,
        CASE
            WHEN ((location.state_name)::text <> ''::text) THEN (location.state_name)::text
            ELSE (location.location_name)::text
        END AS state_name,
    location.location_order,
        CASE
            WHEN ((location.region_type)::text = 'County'::text) THEN concat(location.state_name, ', ', location.county, ' ', location.district_type)
            WHEN ((location.region_type)::text = 'State'::text) THEN concat('Disbursements to ', location.state_name)
            ELSE NULL::text
        END AS local_recipient,
    fund.fund_class AS recipient,
    fund.source,
    period.month_long,
    period.calendar_year,
    period.fiscal_year,
    (disbursement.disbursement)::double precision AS disbursement,
        CASE
            WHEN ((period.period)::text = 'Monthly'::text) THEN commodity.commodity
            ELSE NULL::character varying
        END AS commodity,
    commodity.commodity_order
   FROM ((((public.disbursement
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.fund USING (fund_id))
     JOIN public.commodity USING (commodity_id));


ALTER TABLE public.query_tool_disbursement OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

