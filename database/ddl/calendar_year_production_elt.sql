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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: calendar_year_production_elt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_year_production_elt (
    calendar_year character varying(255),
    land_category character varying(255),
    land_class character varying(255),
    state character varying(255),
    county character varying(255),
    fips_code character varying(255),
    offshore_region character varying(255),
    product character varying(255),
    volume character varying(255)
);


ALTER TABLE public.calendar_year_production_elt OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

