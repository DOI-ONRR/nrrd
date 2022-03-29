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
-- Name: distinct_locations; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.distinct_locations AS
 SELECT DISTINCT location.state_name AS location,
    location.state AS location_id,
    1 AS sort_order
   FROM public.location
  WHERE (location.state_name IS NOT NULL)
UNION
 SELECT DISTINCT concat(location.county, ',  ', location.state_name) AS location,
    location.fips_code AS location_id,
    2 AS sort_order
   FROM public.location
  WHERE ((location.county IS NOT NULL) AND ((location.county)::text <> ''::text))
UNION
 SELECT DISTINCT location.offshore_region AS location,
    location.offshore_region AS location_id,
    3 AS sort_order
   FROM public.location
  WHERE (location.offshore_region IS NOT NULL)
  ORDER BY 3, 1;


ALTER TABLE public.distinct_locations OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

