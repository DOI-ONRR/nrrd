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
-- Name: revenue_commodity_options; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.revenue_commodity_options AS
 SELECT DISTINCT commodity.commodity,
    commodity.commodity_order
   FROM (public.commodity
     JOIN public.revenue USING (commodity_id))
  ORDER BY commodity.commodity_order;


ALTER TABLE public.revenue_commodity_options OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

