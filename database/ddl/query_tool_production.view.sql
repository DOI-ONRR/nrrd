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
 SELECT location.location_name,
    location.location_order,
    location.land_type,
    location.region_type,
    location.district_type,
    location.state_name,
    location.county,
    commodity.product,
    period.period,
    period.fiscal_year,
    period.calendar_year,
        CASE
            WHEN ((period.month_long)::text <> ''::text) THEN (period.month_long)::text
            ELSE NULL::text
        END AS month_long,
    (production.volume)::double precision AS production,
        CASE
            WHEN ((location.county)::text <> ''::text) THEN concat(location.state_name, ', ', location.county, ' ', location.district_type)
            ELSE NULL::text
        END AS county_name,
        CASE
            WHEN ((period.period)::text = 'Monthly'::text) THEN NULL::character varying
            WHEN ((location.region_type)::text = 'County'::text) THEN location.state_name
            WHEN ((location.region_type)::text = 'Offshore'::text) THEN (concat('Offshore ', location.location_name))::character varying
            ELSE location.location_name
        END AS state_offshore_name
   FROM (((public.production
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id));


ALTER TABLE public.query_tool_production OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

