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
-- Name: download_monthly_production; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.download_monthly_production AS
 SELECT period.period_date AS "Date",
    location.land_class AS "Land Class",
    location.land_category AS "Land Category",
    replace((commodity.product)::text, ' ('::text, ' Prod Vol ('::text) AS "Commodity",
    production.volume AS "Volume"
   FROM (((public.production
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
  WHERE ((period.period)::text = 'Monthly'::text)
  ORDER BY period.period_date;


ALTER TABLE public.download_monthly_production OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

